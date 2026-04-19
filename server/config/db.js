const mongoose = require('mongoose');

const connectDB = async () => {
  const dbOptions = {
    dbName: 'expensedb',
  };
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, dbOptions);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;