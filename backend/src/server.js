const app = require("./app");
const config = require("./config/env");
const connectDB = require("./config/db");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.PORT, () => {
      console.log(`
========================================
🚀 ExpenseFlow API is running
🌍 Environment : ${config.NODE_ENV}
📡 Server      : http://localhost:${config.PORT}
========================================
`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();