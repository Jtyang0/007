const mongoose = require('mongoose');

const timeRecordSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, '活动分类不能为空'],
    trim: true
  },
  startTime: {
    type: Date,
    required: [true, '开始时间不能为空'],
    index: true
  },
  duration: {
    type: Number,
    required: [true, '持续时间不能为空'],
    min: [1, '持续时间至少1分钟'],
    max: [1440, '持续时间不能超过24小时']
  },
  notes: {
    type: String,
    maxlength: [200, '备注最多200个字符'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, '标签最多20个字符']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 索引：开始时间，用于快速查询
timeRecordSchema.index({ startTime: -1 });

// 更新时自动更新 updatedAt
timeRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('TimeRecord', timeRecordSchema);

