const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Expense = require('./models/Expense');

const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Salary', 'Freelance', 'Other'];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Expense.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@expense.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create demo user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@expense.com',
      password: 'john123',
      role: 'user',
    });

    // Create sample expenses for demo user
    const expenses = [];
    const now = new Date();

    for (let i = 0; i < 25; i++) {
      const isIncome = Math.random() > 0.7;
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));

      expenses.push({
        user: user._id,
        amount: isIncome
          ? Math.floor(Math.random() * 5000) + 1000
          : Math.floor(Math.random() * 500) + 10,
        type: isIncome ? 'income' : 'expense',
        category: isIncome
          ? categories[Math.floor(Math.random() * 2) + 7]
          : categories[Math.floor(Math.random() * 7)],
        description: isIncome ? 'Monthly income' : `Expense #${i + 1}`,
        date,
      });
    }

    await Expense.insertMany(expenses);

    console.log('Seed data created successfully!');
    console.log('Admin: admin@expense.com / admin123');
    console.log('User:  john@expense.com / john123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
