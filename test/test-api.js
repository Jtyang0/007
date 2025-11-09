/**
 * API 测试脚本
 * 用于测试后端 API 接口
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

let authToken = '';
let userId = '';
let categoryId = '';
let timeRecordId = '';

// 测试用户
const testUser = {
  username: `testuser_${Date.now()}`,
  password: 'test123456'
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 测试函数
async function testAPI(name, method, url, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_URL}${url}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    log(`✓ ${name}: 成功`, 'green');
    return { success: true, data: response.data };
  } catch (error) {
    log(`✗ ${name}: 失败 - ${error.response?.data?.message || error.message}`, 'red');
    return { success: false, error: error.response?.data || error.message };
  }
}

// 运行所有测试
async function runTests() {
  log('\n=== 开始 API 测试 ===\n', 'blue');

  // 1. 测试用户注册
  log('1. 测试用户注册...', 'yellow');
  const registerResult = await testAPI('用户注册', 'POST', '/auth/register', testUser);
  if (registerResult.success && registerResult.data?.data?.token) {
    authToken = registerResult.data.data.token;
    userId = registerResult.data.data.user.id;
    log(`   用户ID: ${userId}`, 'green');
  } else {
    log('注册失败，尝试登录...', 'yellow');
    const loginResult = await testAPI('用户登录', 'POST', '/auth/login', {
      username: testUser.username,
      password: testUser.password
    });
    if (loginResult.success && loginResult.data?.data?.token) {
      authToken = loginResult.data.data.token;
      userId = loginResult.data.data.user.id;
    } else {
      log('无法获取认证令牌，停止测试', 'red');
      return;
    }
  }

  // 2. 测试获取当前用户
  log('\n2. 测试获取当前用户信息...', 'yellow');
  await testAPI('获取当前用户', 'GET', '/auth/me', null, authToken);

  // 3. 测试获取分类列表
  log('\n3. 测试获取分类列表...', 'yellow');
  const categoriesResult = await testAPI('获取分类列表', 'GET', '/categories', null, authToken);
  if (categoriesResult.success && categoriesResult.data?.data?.length > 0) {
    categoryId = categoriesResult.data.data[0]._id;
    log(`   找到 ${categoriesResult.data.data.length} 个分类`, 'green');
  }

  // 4. 测试创建分类
  log('\n4. 测试创建分类...', 'yellow');
  const newCategory = {
    name: `测试分类_${Date.now()}`,
    color: '#ff5722',
    type: 'positive'
  };
  const createCategoryResult = await testAPI('创建分类', 'POST', '/categories', newCategory, authToken);
  if (createCategoryResult.success && createCategoryResult.data?.data?._id) {
    categoryId = createCategoryResult.data.data._id;
    log(`   分类ID: ${categoryId}`, 'green');
  }

  // 5. 测试创建时间记录
  log('\n5. 测试创建时间记录...', 'yellow');
  const timeRecord = {
    category: newCategory.name,
    startTime: new Date().toISOString(),
    duration: 30,
    notes: '测试记录',
    tags: ['测试']
  };
  const createRecordResult = await testAPI('创建时间记录', 'POST', '/time-records', timeRecord, authToken);
  if (createRecordResult.success && createRecordResult.data?.data?._id) {
    timeRecordId = createRecordResult.data.data._id;
    log(`   记录ID: ${timeRecordId}`, 'green');
  }

  // 6. 测试获取时间记录列表
  log('\n6. 测试获取时间记录列表...', 'yellow');
  const today = new Date();
  const startDate = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endDate = new Date(today.setHours(23, 59, 59, 999)).toISOString();
  await testAPI('获取时间记录列表', 'GET', `/time-records?startDate=${startDate}&endDate=${endDate}`, null, authToken);

  // 7. 测试获取单个时间记录
  if (timeRecordId) {
    log('\n7. 测试获取单个时间记录...', 'yellow');
    await testAPI('获取单个时间记录', 'GET', `/time-records/${timeRecordId}`, null, authToken);
  }

  // 8. 测试更新时间记录
  if (timeRecordId) {
    log('\n8. 测试更新时间记录...', 'yellow');
    await testAPI('更新时间记录', 'PUT', `/time-records/${timeRecordId}`, {
      ...timeRecord,
      duration: 60,
      notes: '更新后的测试记录'
    }, authToken);
  }

  // 9. 测试生成报表
  log('\n9. 测试生成报表...', 'yellow');
  await testAPI('生成日报', 'GET', '/reports?type=day', null, authToken);
  await testAPI('生成周报', 'GET', '/reports?type=week', null, authToken);
  await testAPI('生成月报', 'GET', '/reports?type=month', null, authToken);

  // 10. 测试删除时间记录
  if (timeRecordId) {
    log('\n10. 测试删除时间记录...', 'yellow');
    await testAPI('删除时间记录', 'DELETE', `/time-records/${timeRecordId}`, null, authToken);
  }

  // 11. 测试删除分类
  if (categoryId && !createCategoryResult.data?.data?.isDefault) {
    log('\n11. 测试删除分类...', 'yellow');
    await testAPI('删除分类', 'DELETE', `/categories/${categoryId}`, null, authToken);
  }

  // 12. 测试健康检查
  log('\n12. 测试健康检查...', 'yellow');
  await testAPI('健康检查', 'GET', '/health');

  log('\n=== 测试完成 ===\n', 'blue');
}

// 运行测试
runTests().catch(error => {
  log(`\n测试执行出错: ${error.message}`, 'red');
  process.exit(1);
});

