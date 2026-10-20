const SplitExpense = require("../models/SplitExpense");
const Notification = require("../models/Notification");
const User = require("../models/User");

/**
 * Computes exact shares for equal splits handling remainder cents
 */
function allocateEqualShares(totalAmount, participants, payerIndex = 0) {
  const count = participants.length;
  const totalCents = Math.round(totalAmount * 100);
  const baseCents = Math.floor(totalCents / count);
  let remainderCents = totalCents - baseCents * count;

  return participants.map((p, idx) => {
    let shareCents = baseCents;
    if (remainderCents > 0) {
      // Allocate 1 extra cent to the payer or first participants until remainder is exhausted
      if (idx === payerIndex || (payerIndex === -1 && remainderCents > 0)) {
        shareCents += 1;
        remainderCents -= 1;
      }
    }

    const shareAmount = shareCents / 100;
    const paidAmount = p.paidAmount ? Math.round(p.paidAmount * 100) / 100 : 0;
    const netBalance = Math.round((paidAmount - shareAmount) * 100) / 100;

    return {
      ...p,
      shareAmount,
      paidAmount,
      netBalance,
      settled: Math.abs(netBalance) < 0.01,
    };
  });
}

/**
 * Validates and allocates custom shares
 */
function allocateCustomShares(totalAmount, participants) {
  const totalCents = Math.round(totalAmount * 100);
  const sharesSumCents = participants.reduce(
    (acc, p) => acc + Math.round((p.shareAmount || 0) * 100),
    0
  );

  if (Math.abs(sharesSumCents - totalCents) > 1) {
    throw new Error(
      `Sum of custom shares (₹${(sharesSumCents / 100).toFixed(2)}) must equal total bill amount (₹${totalAmount.toFixed(2)})`
    );
  }

  return participants.map((p) => {
    const shareAmount = Math.round((p.shareAmount || 0) * 100) / 100;
    const paidAmount = p.paidAmount ? Math.round(p.paidAmount * 100) / 100 : 0;
    const netBalance = Math.round((paidAmount - shareAmount) * 100) / 100;

    return {
      ...p,
      shareAmount,
      paidAmount,
      netBalance,
      settled: Math.abs(netBalance) < 0.01,
    };
  });
}

/**
 * Computes pairwise debts: who owes whom and how much
 */
function calculatePairwiseDebts(participants) {
  // Clone balances
  const balances = participants.map((p) => ({
    name: p.name,
    amount: Math.round(p.netBalance * 100) / 100,
  }));

  const debtors = balances.filter((b) => b.amount < -0.01).map((b) => ({ ...b, amount: -b.amount }));
  const creditors = balances.filter((b) => b.amount > 0.01).map((b) => ({ ...b }));

  const debts = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settleAmount = Math.min(debtor.amount, creditor.amount);

    debts.push({
      from: debtor.name,
      to: creditor.name,
      amount: Math.round(settleAmount * 100) / 100,
    });

    debtor.amount = Math.round((debtor.amount - settleAmount) * 100) / 100;
    creditor.amount = Math.round((creditor.amount - settleAmount) * 100) / 100;

    if (debtor.amount <= 0.01) dIdx++;
    if (creditor.amount <= 0.01) cIdx++;
  }

  return debts;
}

// ======================
// GET ALL SPLIT EXPENSES
// ======================
const getSplitExpenses = async (req, res) => {
  try {
    const userEmail = req.user.email.toLowerCase();

    // Query splits where user is the creator OR in participants
    const splits = await SplitExpense.find({
      $or: [
        { creator: req.user._id },
        { "participants.userId": req.user._id },
        { "participants.email": userEmail },
      ],
    }).sort({ date: -1, createdAt: -1 });

    // Calculate aggregated debt balance for current user
    let totalOwedToUser = 0; // Money others owe user
    let totalUserOwes = 0;   // Money user owes others
    let userShareTotal = 0;  // Total personal share of shared expenses

    const decoratedSplits = splits.map((split) => {
      const splitObj = split.toObject();

      // Find user's participant entry
      const userPart = splitObj.participants.find(
        (p) =>
          (p.userId && String(p.userId) === String(req.user._id)) ||
          (p.email && p.email.toLowerCase() === userEmail) ||
          p.isCreator
      );

      if (userPart) {
        userShareTotal += userPart.shareAmount || 0;

        if (splitObj.status === "active") {
          if (userPart.netBalance > 0.01) {
            totalOwedToUser += userPart.netBalance;
          } else if (userPart.netBalance < -0.01) {
            totalUserOwes += Math.abs(userPart.netBalance);
          }
        }
      }

      // Compute pairwise debts for UI guidance
      const pairwiseDebts = calculatePairwiseDebts(splitObj.participants);

      return {
        ...splitObj,
        currentUserParticipation: userPart || null,
        pairwiseDebts,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        splits: decoratedSplits,
        summary: {
          totalOwedToUser: Math.round(totalOwedToUser * 100) / 100,
          totalUserOwes: Math.round(totalUserOwes * 100) / 100,
          netBalance: Math.round((totalOwedToUser - totalUserOwes) * 100) / 100,
          userShareTotal: Math.round(userShareTotal * 100) / 100,
          activeCount: splits.filter((s) => s.status === "active").length,
          settledCount: splits.filter((s) => s.status === "settled").length,
        },
      },
    });
  } catch (error) {
    console.error("Get Split Expenses Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch split expenses.",
    });
  }
};

// ======================
// CREATE SPLIT EXPENSE
// ======================
const createSplitExpense = async (req, res) => {
  try {
    const {
      title,
      totalAmount,
      date,
      category,
      description,
      splitType = "equal",
      payerName,
      payerEmail,
      payerIsCurrentUser = true,
      participants = [],
    } = req.body;

    if (!title || !totalAmount || Number(totalAmount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Title and a positive total amount are required.",
      });
    }

    if (!Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 participants are required to split an expense.",
      });
    }

    const numTotal = Number(totalAmount);

    // Prepare participants list
    let preparedParticipants = participants.map((p) => ({
      name: p.name.trim(),
      email: p.email ? p.email.trim().toLowerCase() : "",
      userId: p.userId || null,
      isCreator: Boolean(p.isCreator),
      paidAmount: p.paidAmount ? Number(p.paidAmount) : 0,
      shareAmount: p.shareAmount ? Number(p.shareAmount) : 0,
    }));

    // Find payer index
    let payerIdx = preparedParticipants.findIndex((p) =>
      payerIsCurrentUser ? p.isCreator : p.name.toLowerCase() === (payerName || "").toLowerCase()
    );

    if (payerIdx === -1) {
      payerIdx = 0; // Default to first participant if payer not found
    }

    // Set paidAmount: the designated payer paid the total bill (unless custom paidAmounts are specified)
    const hasExplicitPaid = preparedParticipants.some((p) => p.paidAmount > 0);
    if (!hasExplicitPaid) {
      preparedParticipants = preparedParticipants.map((p, idx) => ({
        ...p,
        paidAmount: idx === payerIdx ? numTotal : 0,
      }));
    }

    // Allocate shares
    let allocatedParticipants;
    if (splitType === "equal") {
      allocatedParticipants = allocateEqualShares(numTotal, preparedParticipants, payerIdx);
    } else {
      allocatedParticipants = allocateCustomShares(numTotal, preparedParticipants);
    }

    // Check if any participant is a registered user by email
    for (const p of allocatedParticipants) {
      if (!p.userId && p.email) {
        const foundUser = await User.findOne({ email: p.email });
        if (foundUser) {
          p.userId = foundUser._id;
        }
      }
    }

    const paidByInfo = {
      name: preparedParticipants[payerIdx]?.name || req.user.name,
      email: preparedParticipants[payerIdx]?.email || req.user.email,
      userId: preparedParticipants[payerIdx]?.userId || (payerIsCurrentUser ? req.user._id : null),
      isCreator: payerIsCurrentUser,
    };

    const allSettled = allocatedParticipants.every((p) => p.settled);

    const splitExpense = await SplitExpense.create({
      creator: req.user._id,
      title: title.trim(),
      totalAmount: Math.round(numTotal * 100) / 100,
      date: date ? new Date(date) : new Date(),
      category: category ? category.trim() : "General",
      description: description ? description.trim() : "",
      splitType,
      paidBy: paidByInfo,
      participants: allocatedParticipants,
      settlements: [],
      status: allSettled ? "settled" : "active",
    });

    // Notify registered participants if any
    for (const p of allocatedParticipants) {
      if (p.userId && String(p.userId) !== String(req.user._id)) {
        await Notification.create({
          user: p.userId,
          title: `New Shared Bill: ${title}`,
          message: `${req.user.name} added you to "${title}" for ₹${numTotal.toLocaleString()}. Your share is ₹${p.shareAmount.toLocaleString()}.`,
          type: "info",
          category: "split",
          metadata: {
            splitId: splitExpense._id,
            spent: p.shareAmount,
            limit: numTotal,
          },
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Split expense created successfully.",
      data: splitExpense,
    });
  } catch (error) {
    console.error("Create Split Expense Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create split expense.",
    });
  }
};

// ======================
// RECORD SETTLEMENT
// ======================
const recordSettlement = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, amount, notes, date } = req.body;

    if (!from || !to || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payer (from), receiver (to), and a positive settlement amount are required.",
      });
    }

    const split = await SplitExpense.findById(id);

    if (!split) {
      return res.status(404).json({
        success: false,
        message: "Split expense not found.",
      });
    }

    // Verify requesting user is creator or participant of this split
    const userEmail = req.user.email ? req.user.email.toLowerCase() : "";
    const isAuthorized =
      String(split.creator) === String(req.user._id) ||
      split.participants.some(
        (p) =>
          (p.userId && String(p.userId) === String(req.user._id)) ||
          (p.email && p.email.toLowerCase() === userEmail)
      );

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You are not a participant of this shared expense.",
      });
    }

    const settleAmount = Math.round(Number(amount) * 100) / 100;

    // Find payer and receiver in participants
    const payer = split.participants.find((p) => p.name.toLowerCase() === from.trim().toLowerCase());
    const receiver = split.participants.find((p) => p.name.toLowerCase() === to.trim().toLowerCase());

    if (!payer || !receiver) {
      return res.status(400).json({
        success: false,
        message: "Payer and receiver must be participants of this split bill.",
      });
    }

    // Apply settlement to net balances
    // Payer's netBalance increases (reduces negative debt)
    payer.netBalance = Math.round((payer.netBalance + settleAmount) * 100) / 100;
    payer.settled = Math.abs(payer.netBalance) < 0.01;

    // Receiver's netBalance decreases (reduces claim)
    receiver.netBalance = Math.round((receiver.netBalance - settleAmount) * 100) / 100;
    receiver.settled = Math.abs(receiver.netBalance) < 0.01;

    // Record settlement transaction
    split.settlements.push({
      from: payer.name,
      to: receiver.name,
      amount: settleAmount,
      date: date ? new Date(date) : new Date(),
      notes: notes ? notes.trim() : "",
      recordedBy: req.user._id,
    });

    // If all participants have ~0 net balance, mark entire split as settled
    const allSettled = split.participants.every((p) => Math.abs(p.netBalance) < 0.01);
    if (allSettled) {
      split.status = "settled";
    }

    await split.save();

    // Notify participants involved if registered
    if (receiver.userId && String(receiver.userId) !== String(req.user._id)) {
      await Notification.create({
        user: receiver.userId,
        title: `Settlement Received: ${split.title}`,
        message: `${payer.name} recorded a settlement payment of ₹${settleAmount.toLocaleString()} to you.`,
        type: "success",
        category: "split",
        metadata: {
          splitId: split._id,
          spent: settleAmount,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Settlement recorded successfully.",
      data: split,
    });
  } catch (error) {
    console.error("Record Settlement Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record settlement.",
    });
  }
};

// ======================
// DELETE SPLIT EXPENSE
// ======================
const deleteSplitExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const split = await SplitExpense.findOneAndDelete({
      _id: id,
      creator: req.user._id,
    });

    if (!split) {
      return res.status(404).json({
        success: false,
        message: "Split expense not found or you are not authorized to delete it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Split expense deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Split Expense Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete split expense.",
    });
  }
};

module.exports = {
  getSplitExpenses,
  createSplitExpense,
  recordSettlement,
  deleteSplitExpense,
};
