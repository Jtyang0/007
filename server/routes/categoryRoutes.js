const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// 创建/更新验证规则
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('分类名称不能为空')
    .isLength({ max: 20 })
    .withMessage('分类名称最多20个字符'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('颜色格式不正确'),
  body('type')
    .optional()
    .isIn(['positive', 'negative', 'neutral'])
    .withMessage('类型必须是 positive、negative 或 neutral')
];

router.post('/', categoryValidation, createCategory);
router.get('/', getCategories);
router.put('/:id', categoryValidation, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

