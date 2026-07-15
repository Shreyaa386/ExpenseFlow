const config = require("./config/env");
const app = require("./app");

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`
========================================
🚀 ExpenseFlow API is running
🌍 Environment : ${config.NODE_ENV}
📡 Server      : http://localhost:${PORT}
========================================
`);
});