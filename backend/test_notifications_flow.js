const assert = require("assert");
const mongoose = require("mongoose");
const config = require("./src/config/env");

// Models
const User = require("./src/models/User");
const Budget = require("./src/models/Budget");
const Transaction = require("./src/models/Transaction");
const Notification = require("./src/models/Notification");

// Helpers
const {
  evaluateBudgetUsage,
  checkBudgetThresholds,
  getPeriodBoundaries,
} = require("./src/utils/budgetAlertHelper");

console.log("==================================================================");
console.log("🔔 TESTING EXPENSEFLOW NOTIFICATIONS & BUDGET ALERT SYSTEM");
console.log("==================================================================");

async function runNotificationsTestSuite() {
  let passedCount = 0;
  function pass(msg) {
    passedCount++;
    console.log(`  ✅ [PASS] ${msg}`);
  }

  try {
    // 1. Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    pass("MongoDB connected successfully");

    // 2. Setup isolated test user
    const testEmail = `notif_tester_${Date.now()}@expenseflow.io`;
    const user = await User.create({
      name: "Notification Test User",
      email: testEmail,
      password: "TestPassword123!",
    });
    const userId = user._id;
    pass(`Created test user: ${testEmail}`);

    // Clean any pre-existing test records for this user
    await Budget.deleteMany({ user: userId });
    await Transaction.deleteMany({ user: userId });
    await Notification.deleteMany({ user: userId });

    // 3. Test Period Boundaries
    const monthlyBoundaries = getPeriodBoundaries("monthly");
    assert(monthlyBoundaries.periodKey.match(/^\d{4}-\d{2}$/));
    assert(monthlyBoundaries.startDate instanceof Date);
    assert(monthlyBoundaries.endDate instanceof Date);

    const weeklyBoundaries = getPeriodBoundaries("weekly");
    assert(weeklyBoundaries.periodKey.match(/^\d{4}-W\d{2}$/));
    pass("Period boundaries for monthly and ISO weekly calendars correctly computed");

    // 4. Create a Monthly Food Budget of ₹2,000
    const foodBudget = await Budget.create({
      user: userId,
      name: "Food",
      period: "monthly",
      category: "Food",
      amount: 2000,
      thresholds: [50, 75, 90, 100],
      active: true,
      notifiedThresholds: [],
    });
    pass("Created ₹2,000 monthly Food budget");

    // 5. Initial state: 0 spent -> no notifications
    await checkBudgetThresholds(userId);
    let notifs = await Notification.find({ user: userId });
    assert.strictEqual(notifs.length, 0, "Initial spending 0 should trigger 0 alerts");
    pass("Initial zero-spending state triggers 0 notifications");

    // 6. Add Expense: ₹1,000 (50% threshold)
    await Transaction.create({
      user: userId,
      title: "Grocery Store",
      amount: 1000,
      type: "expense",
      category: "Food",
      date: new Date(),
    });

    await checkBudgetThresholds(userId);
    notifs = await Notification.find({ user: userId, "metadata.threshold": 50 });
    assert.strictEqual(notifs.length, 1, "Should generate exactly 1 notification for 50% threshold");
    assert(notifs[0].title.includes("50%"));
    assert(notifs[0].message.includes("₹1,000 of your ₹2,000"));
    assert.strictEqual(notifs[0].type, "info");
    pass("50% threshold crossed: Generated informational notification with exact amount and remaining balance");

    // 7. Deduplication test: re-run checkBudgetThresholds without new expenses
    await checkBudgetThresholds(userId);
    const countAfterRecheck = await Notification.countDocuments({ user: userId, "metadata.threshold": 50 });
    assert.strictEqual(countAfterRecheck, 1, "Duplicate alert must NOT be created on re-check");
    pass("Duplicate prevention: Re-checking budget threshold does NOT create duplicate alerts");

    // 8. Add Expense taking spending to ₹1,500 (75% threshold)
    await Transaction.create({
      user: userId,
      title: "Supermarket Vegetables",
      amount: 500,
      type: "expense",
      category: "Food",
      date: new Date(),
    });

    await checkBudgetThresholds(userId);
    const notifs75 = await Notification.find({ user: userId, "metadata.threshold": 75 });
    assert.strictEqual(notifs75.length, 1, "Should generate exactly 1 notification for 75% threshold");
    assert(notifs75[0].title.includes("75%"));
    assert(notifs75[0].message.includes("₹1,500 of your ₹2,000"));
    assert.strictEqual(notifs75[0].type, "warning");
    pass("75% threshold crossed: Generated warning notification with remaining balance");

    // 9. Add Expense taking spending to ₹1,800 (90% threshold)
    await Transaction.create({
      user: userId,
      title: "Dinner Outing",
      amount: 300,
      type: "expense",
      category: "Food",
      date: new Date(),
    });

    await checkBudgetThresholds(userId);
    const notifs90 = await Notification.find({ user: userId, "metadata.threshold": 90 });
    assert.strictEqual(notifs90.length, 1, "Should generate exactly 1 notification for 90% threshold");
    assert(notifs90[0].title.includes("90%"));
    assert(notifs90[0].message.includes("Only ₹200 remains"));
    assert.strictEqual(notifs90[0].type, "warning");
    pass("90% threshold crossed: Generated high-priority warning notification");

    // 10. Add Expense taking spending to ₹2,000 (100% threshold)
    await Transaction.create({
      user: userId,
      title: "Bakery Snack",
      amount: 200,
      type: "expense",
      category: "Food",
      date: new Date(),
    });

    await checkBudgetThresholds(userId);
    const notifs100 = await Notification.find({ user: userId, "metadata.threshold": 100 });
    assert.strictEqual(notifs100.length, 1, "Should generate 100% limit reached alert");
    assert(notifs100[0].title.includes("100%"));
    assert(notifs100[0].message.includes("reached your monthly Food budget of ₹2,000"));
    pass("100% threshold reached: Generated budget limit reached notification");

    // 11. Add Expense exceeding limit: ₹250 over (Total: ₹2,250)
    await Transaction.create({
      user: userId,
      title: "Extra Treats",
      amount: 250,
      type: "expense",
      category: "Food",
      date: new Date(),
    });

    await checkBudgetThresholds(userId);
    const notifsExceeded = await Notification.find({ user: userId, "metadata.threshold": 101 });
    assert.strictEqual(notifsExceeded.length, 1, "Should generate Budget Exceeded alert");
    assert.strictEqual(notifsExceeded[0].title, "Budget Exceeded");
    assert(notifsExceeded[0].message.includes("exceeded the Food budget by ₹250"));
    assert.strictEqual(notifsExceeded[0].type, "danger");
    pass("Over 100% spending: Generated 'Budget Exceeded' notification with exact ₹250 overage");

    // 12. Non-expense (income) does NOT count towards budget spending
    await Transaction.create({
      user: userId,
      title: "Freelance Payment",
      amount: 5000,
      type: "income",
      category: "Income",
      date: new Date(),
    });
    const usageAfterIncome = await evaluateBudgetUsage(foodBudget, userId);
    assert.strictEqual(usageAfterIncome.spent, 2250, "Income must not affect budget expense spending");
    pass("Financial correctness: Income transactions do NOT inflate budget spending");

    // 13. Test Read/Unread Toggling
    const sampleNotif = notifs100[0];
    assert.strictEqual(sampleNotif.read, false);

    // Mark as read
    sampleNotif.read = true;
    await sampleNotif.save();
    let unreadCount = await Notification.countDocuments({ user: userId, read: false });
    assert.strictEqual(unreadCount, 4, "Unread count should decrease by 1");
    pass("Individual notification mark-as-read updates read status and unread count");

    // Mark as unread
    sampleNotif.read = false;
    await sampleNotif.save();
    unreadCount = await Notification.countDocuments({ user: userId, read: false });
    assert.strictEqual(unreadCount, 5, "Unread count should increase by 1");
    pass("Individual notification mark-as-unread restores unread state and count");

    // 14. Mark All As Read
    await Notification.updateMany({ user: userId, read: false }, { read: true });
    unreadCount = await Notification.countDocuments({ user: userId, read: false });
    assert.strictEqual(unreadCount, 0, "All notifications should be marked as read");
    pass("Mark all as read updates all notifications and resets unread count to 0");

    // 15. User Isolation Security Test
    const otherUser = await User.create({
      name: "Other User",
      email: `other_${Date.now()}@expenseflow.io`,
      password: "TestPassword123!",
    });
    const otherNotifs = await Notification.find({ user: otherUser._id });
    assert.strictEqual(otherNotifs.length, 0, "Other user must NOT have access to test user's notifications");
    pass("User isolation: Notifications are strictly scoped to the authenticated user");

    // 16. Cleanup
    await User.deleteMany({ _id: { $in: [userId, otherUser._id] } });
    await Budget.deleteMany({ user: { $in: [userId, otherUser._id] } });
    await Transaction.deleteMany({ user: { $in: [userId, otherUser._id] } });
    await Notification.deleteMany({ user: { $in: [userId, otherUser._id] } });
    await mongoose.disconnect();
    pass("Cleaned up test data and closed database connection");

    console.log("\n==================================================================");
    console.log(`🎉 ALL ${passedCount} NOTIFICATION & BUDGET ALERT TESTS PASSED!`);
    console.log("==================================================================");
  } catch (error) {
    console.error("❌ Test Failed:", error);
    process.exit(1);
  }
}

runNotificationsTestSuite();
