const mongoose = require("mongoose");
const config = require("./env");

// Connects the application to MongoDB Atlas
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.MONGODB_URI);

    console.log(`
========================================
✅ MongoDB Connected Successfully
📦 Database : ${connection.connection.name}
🌐 Host     : ${connection.connection.host}
========================================
`);
  } catch (error) {
    console.error(`
========================================
❌ MongoDB Connection Failed
${error.message}
========================================
`);

    process.exit(1);
  }
};

module.exports = connectDB;