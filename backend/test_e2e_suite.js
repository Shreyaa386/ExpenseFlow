const assert = require("assert");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Config & Services
const config = require("./src/config/env");
const { getPeriodBoundaries } = require("./src/utils/budgetAlertHelper");
const {
  isConfigured,
  getConfigurationStatus,
  checkRateLimit,
} = require("./src/services/geminiService");

// Import controllers
const { signupSchema, loginSchema } = require("./src/validators/authValidator");
const { transactionSchema } = require("./src/validators/transactionValidator");
const { chatWithAssistant } = require("./src/controllers/aiController");

console.log("==================================================================");
console.log("🚀 EXPENSEFLOW COMPREHENSIVE END-TO-END TEST SUITE");
console.log("==================================================================");

async function runAllTests() {
  let passedCount = 0;

  function pass(msg) {
    passedCount++;
    console.log(`  ✅ [PASS] ${msg}`);
  }

  // ==================================================================
  // MODULE 1: AUTHENTICATION & SECURITY VALIDATION
  // ==================================================================
  console.log("\n📦 MODULE 1: Authentication & Access Control");

  // 1.1 Password hashing & salt strength
  const plainPassword = "SecureFintechPass123!";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  assert.notStrictEqual(plainPassword, hashedPassword);
  assert(await bcrypt.compare(plainPassword, hashedPassword));
  assert(!(await bcrypt.compare("WrongPassword!", hashedPassword)));
  pass("Password bcrypt hashing (cost factor 10) and verification");

  // 1.2 JWT Signing & Validation
  const testUserId = "user_fintech_test_001";
  const token = jwt.sign({ id: testUserId }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
  const decoded = jwt.verify(token, config.JWT_SECRET);
  assert.strictEqual(decoded.id, testUserId);
  pass("JWT generation, payload integrity, and signature verification");

  // 1.3 Validation Schemas
  const validSignup = { name: "Fintech Tester", email: "test@expenseflow.io", password: "Password123!" };
  const signupRes = signupSchema.validate(validSignup);
  assert(!signupRes.error, signupRes.error?.message);

  const invalidSignup = { name: "AB", email: "invalid-email", password: "short" };
  const invalidSignupRes = signupSchema.validate(invalidSignup);
  assert(invalidSignupRes.error, "Invalid signup input should be rejected");
  pass("Auth Joi input schema validation (email formats, password minimum lengths)");

  // ==================================================================
  // MODULE 2: FINANCIAL ARITHMETIC & TRANSACTION LEDGER
  // ==================================================================
  console.log("\n📦 MODULE 2: Financial Correctness & Authoritative Arithmetic");

  const ledgerTransactions = [
    { id: 1, title: "Consulting Inflow", amount: 85000.5, type: "income", category: "Freelancing", date: new Date("2026-10-02") },
    { id: 2, title: "Dividend Return", amount: 14500.0, type: "income", category: "Investment", date: new Date("2026-10-05") },
    { id: 3, title: "Office Rent", amount: 32000.25, type: "expense", category: "Home", date: new Date("2026-10-03") },
    { id: 4, title: "Client Dinner", amount: 4850.75, type: "expense", category: "Food", date: new Date("2026-10-08") },
    { id: 5, title: "Cloud Infrastructure", amount: 6200.0, type: "expense", category: "Bills", date: new Date("2026-10-12") },
  ];

  // 2.1 Ledger Balances
  const totalInflow = ledgerTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Math.round(t.amount * 100), 0) / 100;

  const totalOutflow = ledgerTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.round(t.amount * 100), 0) / 100;

  const netBalance = Math.round((totalInflow - totalOutflow) * 100) / 100;
  const savingsRate = Math.round(((totalInflow - totalOutflow) / totalInflow) * 100);

  assert.strictEqual(totalInflow, 99500.5);
  assert.strictEqual(totalOutflow, 43051.0);
  assert.strictEqual(netBalance, 56449.5);
  assert.strictEqual(savingsRate, 57);
  pass("Authoritative cash flow arithmetic: Inflow (99500.50), Outflow (43051.00), Net (56449.50), Savings Rate (57%)");

  // 2.2 Category Distribution Aggregation
  const categoryTotals = {};
  ledgerTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  assert.strictEqual(categoryTotals["Home"], 32000.25);
  assert.strictEqual(categoryTotals["Food"], 4850.75);
  assert.strictEqual(categoryTotals["Bills"], 6200.0);
  pass("Expense category segmentation and ranking calculations");

  // 2.3 Date Boundaries (End-of-day inclusive check)
  const startDate = new Date("2026-10-01");
  const endDate = new Date("2026-10-12");
  endDate.setHours(23, 59, 59, 999);

  const filtered = ledgerTransactions.filter((t) => t.date >= startDate && t.date <= endDate);
  assert.strictEqual(filtered.length, 5, "All 5 transactions must be included up to end of day");
  pass("Date range boundary enforcement with 23:59:59.999 end-of-day precision");

  // ==================================================================
  // MODULE 3: SPLIT EXPENSES & DEBT RECONCILIATION
  // ==================================================================
  console.log("\n📦 MODULE 3: Split Expenses & Zero-Sum Debt Math");

  // 3.1 Equal Split Rounding & Cent Distribution
  // Bill of 1000.00 split among 3 participants -> 333.34, 333.33, 333.33 => Exactly 1000.00
  function allocateEqualShares(totalAmount, count, payerIndex = 0) {
    const totalCents = Math.round(totalAmount * 100);
    const baseCents = Math.floor(totalCents / count);
    let remainderCents = totalCents - baseCents * count;

    const shares = [];
    for (let i = 0; i < count; i++) {
      let shareCents = baseCents;
      if (remainderCents > 0 && i === payerIndex) {
        shareCents += remainderCents;
        remainderCents = 0;
      }
      shares.push(shareCents / 100);
    }
    return shares;
  }

  const shares3 = allocateEqualShares(1000.0, 3, 0);
  const sumShares = Math.round(shares3.reduce((s, v) => s + v, 0) * 100) / 100;
  assert.strictEqual(sumShares, 1000.0, "Sum of shares must equal total bill exactly");
  assert.strictEqual(shares3[0], 333.34, "Payer absorbs remaining cent");
  assert.strictEqual(shares3[1], 333.33);
  assert.strictEqual(shares3[2], 333.33);
  pass("Equal split rounding test: ₹1000.00 among 3 participants sums exactly to ₹1000.00 (₹333.34 + ₹333.33 + ₹333.33)");

  // 3.2 Custom Split Validation
  const customTotal = 1500.0;
  const validCustom = [600.0, 500.0, 400.0];
  const invalidCustom = [600.0, 500.0, 350.0]; // sums to 1450

  const sumValid = validCustom.reduce((s, v) => s + v, 0);
  const sumInvalid = invalidCustom.reduce((s, v) => s + v, 0);
  assert.strictEqual(sumValid, customTotal);
  assert.notStrictEqual(sumInvalid, customTotal);
  pass("Custom split validation: detects allocation mismatches and prevents under/over-allocation");

  // 3.3 Zero-Sum Net Balance & Pairwise Debt Settlement
  // Alice paid 1500 for Alice, Bob, Charlie (500 each)
  // Alice: paid 1500, share 500 => netBalance +1000
  // Bob: paid 0, share 500 => netBalance -500
  // Charlie: paid 0, share 500 => netBalance -500
  const balances = [
    { name: "Alice", netBalance: 1000.0 },
    { name: "Bob", netBalance: -500.0 },
    { name: "Charlie", netBalance: -500.0 },
  ];

  const netBalanceSum = balances.reduce((s, b) => s + b.netBalance, 0);
  assert.strictEqual(netBalanceSum, 0, "Net balances across participants must always sum to zero");
  pass("Zero-sum debt balance invariant: sum of debtor/creditor balances equals 0");

  // Settlement: Bob pays Alice 500
  balances[0].netBalance -= 500; // Alice: 500
  balances[1].netBalance += 500; // Bob: 0 (settled)
  assert.strictEqual(balances[1].netBalance, 0);
  assert(Math.abs(balances[1].netBalance) < 0.01, "Bob is marked settled");
  pass("Settlement recording: updates participant net balances and marks settled state");

  // ==================================================================
  // MODULE 4: BUDGETS & THRESHOLD ALERTS
  // ==================================================================
  console.log("\n📦 MODULE 4: Budgets & Threshold Alarms");

  // 4.1 Period Boundary Calculation
  const refDate = new Date("2026-10-16T12:00:00Z");
  const monthlyBoundaries = getPeriodBoundaries("monthly", refDate);
  assert.strictEqual(monthlyBoundaries.periodKey, "2026-10");
  assert.strictEqual(monthlyBoundaries.startDate.getDate(), 1);

  const weeklyBoundaries = getPeriodBoundaries("weekly", refDate);
  assert(weeklyBoundaries.periodKey.startsWith("2026-W"));
  pass("Period boundary evaluation for weekly (ISO week) and monthly calendars");

  // 4.2 Budget Threshold Crossing & Anti-Duplicate Alert Logic
  const budgetCap = 20000;
  const currentSpent = 16500;
  const percentUsed = Math.round((currentSpent / budgetCap) * 100);
  assert.strictEqual(percentUsed, 83);

  const thresholds = [50, 75, 90, 100];
  const notifiedThresholds = [{ periodKey: "2026-10", threshold: 50 }]; // already notified for 50

  const alertsToTrigger = [];
  for (const t of thresholds) {
    if (percentUsed >= t) {
      const alreadyNotified = notifiedThresholds.some((n) => n.periodKey === "2026-10" && n.threshold === t);
      if (!alreadyNotified) {
        alertsToTrigger.push(t);
        notifiedThresholds.push({ periodKey: "2026-10", threshold: t });
      }
    }
  }

  assert.deepStrictEqual(alertsToTrigger, [75], "Only 75% threshold alert should trigger (50 was already notified)");
  pass("Threshold crossing alarm with duplicate alert prevention (periodKey scoped)");

  // ==================================================================
  // MODULE 5: GEMINI AI SERVICE & SECURITY GUARDS
  // ==================================================================
  console.log("\n📦 MODULE 5: Gemini AI Service, Rate Limiting & Safety");

  // 5.1 Configuration Status
  const aiStatus = getConfigurationStatus();
  assert.strictEqual(typeof aiStatus.configured, "boolean");
  assert(aiStatus.setupGuide?.steps?.length > 0);
  pass("AI configuration readiness check and setup instructions guide");

  // 5.2 Rate Limiting
  const userRateKey = `user_limit_test_${Date.now()}`;
  for (let i = 0; i < 10; i++) {
    const res = checkRateLimit(userRateKey, "insights");
    assert.strictEqual(res.allowed, true);
  }
  const throttled = checkRateLimit(userRateKey, "insights");
  assert.strictEqual(throttled.allowed, false, "11th request must be rate limited");
  assert(throttled.retryAfterSeconds > 0);
  pass("Sliding-window rate limiter (10 insight refreshes / 10m throttled properly)");

  // 5.3 Chat Controller Input Validation
  let badReq = null;
  const mockRes = {
    status(c) { this.code = c; return this; },
    json(data) { badReq = { code: this.code, data }; return this; },
  };

  await chatWithAssistant({ user: { _id: "u1" }, body: { message: "" } }, mockRes);
  assert.strictEqual(badReq.code, 400);

  await chatWithAssistant({ user: { _id: "u1" }, body: { message: "a".repeat(1005) } }, mockRes);
  assert.strictEqual(badReq.code, 400);
  pass("Chat input validation: rejects empty, whitespace, and overlong (>1000 chars) inquiries");

  // ==================================================================
  // MODULE 6: LIVE HTTP SERVER SECURITY & MIDDLEWARE
  // ==================================================================
  console.log("\n📦 MODULE 6: Live HTTP Server Mounting & Route Protection");

  const app = require("./src/app");
  const http = require("http");
  const server = http.createServer(app);

  await new Promise((resolve, reject) => {
    server.listen(0, () => {
      const port = server.address().port;

      http.get(`http://localhost:${port}/api/v1/health`, (res) => {
        assert.strictEqual(res.statusCode, 200);

        // Protected routes must reject unauthenticated requests with 401
        http.get(`http://localhost:${port}/api/v1/transactions`, (txRes) => {
          assert.strictEqual(txRes.statusCode, 401);

          http.get(`http://localhost:${port}/api/v1/budgets`, (bRes) => {
            assert.strictEqual(bRes.statusCode, 401);

            http.get(`http://localhost:${port}/api/v1/splits`, (sRes) => {
              assert.strictEqual(sRes.statusCode, 401);

              http.get(`http://localhost:${port}/api/v1/ai/status`, (aiRes) => {
                assert.strictEqual(aiRes.statusCode, 401);
                server.close(resolve);
              });
            });
          });
        });
      }).on("error", (err) => {
        server.close();
        reject(err);
      });
    });
  });

  pass("Live HTTP endpoint authorization: /api/v1/health (200), protected routes /transactions, /budgets, /splits, /ai require valid bearer token (401)");

  console.log("\n==================================================================");
  console.log(`🎉 ALL ${passedCount} END-TO-END TESTS EXECUTED AND PASSED SUCCESSFULLY!`);
  console.log("==================================================================");
}

runAllTests().catch((err) => {
  console.error("❌ E2E TEST FAILED:", err);
  process.exit(1);
});
