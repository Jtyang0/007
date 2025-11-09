const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createTimeRecord,
  getTimeRecords,
  getTimeRecord,
  updateTimeRecord,
  deleteTimeRecord
} = require('../controllers/timeRecordController');

// 创建/更新验证规则
const timeRecordValidation = [
  body('category')
    .trim()
    .notEmpty()
    .withMessage('活动分类不能为空'),
  body('startTime')
    .notEmpty()
    .withMessage('开始时间不能为空')
    .isISO8601()
    .withMessage('开始时间格式不正确'),
  body('duration')
    .isInt({ min: 1, max: 1440 })
    .withMessage('持续时间必须在1-1440分钟之间'),
  body('notes')
    .optional()
    .isLength({ max: 200 })
    .withMessage('备注最多200个字符'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('标签必须是数组')
];

router.post('/', timeRecordValidation, createTimeRecord);
router.get('/', getTimeRecords);
router.get('/:id', getTimeRecord);
router.put('/:id', timeRecordValidation, updateTimeRecord);
router.delete('/:id', deleteTimeRecord);

module.exports = router;

