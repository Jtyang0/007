const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// 创建分类
exports.createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { name, color, type, icon } = req.body;

    const category = await Category.create({
      name,
      color: color || '#1976d2',
      type: type || 'neutral',
      icon: icon || 'circle'
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: '该分类名称已存在'
      });
    }
    res.status(500).json({
      success: false,
      message: '创建分类失败',
      error: error.message
    });
  }
};

// 获取分类列表
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ isDefault: -1, createdAt: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取分类列表失败',
      error: error.message
    });
  }
};

// 更新分类
exports.updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { name, color, type, icon } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, color, type, icon },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新分类失败',
      error: error.message
    });
  }
};

// 删除分类
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在'
      });
    }

    // 检查是否有时间记录使用此分类
    const TimeRecord = require('../models/TimeRecord');
    const recordCount = await TimeRecord.countDocuments({
      category: category.name
    });

    if (recordCount > 0) {
      return res.status(400).json({
        success: false,
        message: `该分类下有 ${recordCount} 条时间记录，无法删除`
      });
    }

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除分类失败',
      error: error.message
    });
  }
};

