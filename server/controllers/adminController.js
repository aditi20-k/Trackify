const User = require('../models/User');
const Expense = require('../models/Expense');

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    // Get expense count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const expenseCount = await Expense.countDocuments({ user: user._id });
        const expenseTotal = await Expense.aggregate([
          { $match: { user: user._id, type: 'expense' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        return {
          ...user.toObject(),
          expenseCount,
          totalSpent: expenseTotal[0]?.total || 0,
        };
      })
    );

    res.json({
      success: true,
      data: usersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block/unblock user (admin)
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot block an admin',
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: user,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an admin',
      });
    }

    // Delete all user's expenses
    await Expense.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User and their expenses deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all expenses across users (admin)
// @route   GET /api/admin/expenses
// @access  Private/Admin
const getAllExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const total = await Expense.countDocuments();
    const expenses = await Expense.find()
      .populate('user', 'name email')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: expenses,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const totalExpenses = await Expense.countDocuments();

    const financialStats = await Expense.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const topCategories = await Expense.aggregate([
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt role isBlocked');

    let totalIncome = 0;
    let totalExpenseAmount = 0;

    financialStats.forEach((stat) => {
      if (stat._id === 'income') totalIncome = stat.total;
      if (stat._id === 'expense') totalExpenseAmount = stat.total;
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        blockedUsers,
        totalExpenses,
        totalIncome,
        totalExpenseAmount,
        topCategories,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllExpenses,
  getAdminStats,
};
