const mongoose = require("mongoose");
const dns = require("dns");
const config = require("./env");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    console.log("Mongo URI:", config.MONGODB_URI);

    const connection = await mongoose.connect(config.MONGODB_URI);

    console.log("Connected:", connection.connection.host);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;