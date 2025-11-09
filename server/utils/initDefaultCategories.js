/**
 * 初始化默认分类
 * 在应用启动时创建默认分类（如果不存在）
 */

const Category = require('../models/Category');

const defaultCategories = [
  { name: '工作', color: '#1976d2', type: 'positive', isDefault: true },
  { name: '学习', color: '#2e7d32', type: 'positive', isDefault: true },
  { name: '娱乐', color: '#ed6c02', type: 'neutral', isDefault: true },
  { name: '休息', color: '#9c27b0', type: 'neutral', isDefault: true },
  { name: '拖延', color: '#d32f2f', type: 'negative', isDefault: true }
];

async function initDefaultCategories() {
  try {
    // 检查是否已有分类
    const existingCategories = await Category.find();
    
    if (existingCategories.length === 0) {
      console.log('正在创建默认分类...');
      await Category.insertMany(defaultCategories);
      console.log('✓ 默认分类创建成功');
    } else {
      console.log(`已有 ${existingCategories.length} 个分类，跳过默认分类创建`);
    }
  } catch (error) {
    console.error('初始化默认分类失败:', error.message);
  }
}

module.exports = initDefaultCategories;

