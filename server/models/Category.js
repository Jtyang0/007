const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '分类名称不能为空'],
    trim: true,
    maxlength: [20, '分类名称最多20个字符']
  },
  color: {
    type: String,
    required: true,
    default: '#1976d2'
  },
  type: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral',
    required: true
  },
  icon: {
    type: String,
    default: 'circle'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 索引：分类名称唯一
categorySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);

