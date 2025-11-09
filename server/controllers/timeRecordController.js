const TimeRecord = require('../models/TimeRecord');
const { validationResult } = require('express-validator');

// 创建时间记录
exports.createTimeRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { category, startTime, duration, notes, tags } = req.body;

    const timeRecord = await TimeRecord.create({
      category,
      startTime: new Date(startTime),
      duration,
      notes,
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      data: timeRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建时间记录失败',
      error: error.message
    });
  }
};

// 获取时间记录列表
exports.getTimeRecords = async (req, res) => {
  try {
    const { startDate, endDate, category, page = 1, limit = 100 } = req.query;
    
    const query = {};
    
    // 日期范围筛选
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) {
        query.startTime.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startTime.$lte = new Date(endDate);
      }
    }
    
    // 分类筛选
    if (category) {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const timeRecords = await TimeRecord.find(query)
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TimeRecord.countDocuments(query);

    res.json({
      success: true,
      data: {
        records: timeRecords,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取时间记录失败',
      error: error.message
    });
  }
};

// 获取单个时间记录
exports.getTimeRecord = async (req, res) => {
  try {
    const timeRecord = await TimeRecord.findById(req.params.id);

    if (!timeRecord) {
      return res.status(404).json({
        success: false,
        message: '时间记录不存在'
      });
    }

    res.json({
      success: true,
      data: timeRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取时间记录失败',
      error: error.message
    });
  }
};

// 更新时间记录
exports.updateTimeRecord = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { category, startTime, duration, notes, tags } = req.body;

    const timeRecord = await TimeRecord.findByIdAndUpdate(
      req.params.id,
      {
        category,
        startTime: startTime ? new Date(startTime) : undefined,
        duration,
        notes,
        tags
      },
      { new: true, runValidators: true }
    );

    if (!timeRecord) {
      return res.status(404).json({
        success: false,
        message: '时间记录不存在'
      });
    }

    res.json({
      success: true,
      data: timeRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新时间记录失败',
      error: error.message
    });
  }
};

// 删除时间记录
exports.deleteTimeRecord = async (req, res) => {
  try {
    const timeRecord = await TimeRecord.findByIdAndDelete(req.params.id);

    if (!timeRecord) {
      return res.status(404).json({
        success: false,
        message: '时间记录不存在'
      });
    }

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除时间记录失败',
      error: error.message
    });
  }
};

