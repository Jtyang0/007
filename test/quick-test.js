/**
 * 快速测试脚本
 * 检查服务器是否运行并测试基本连接
 */

const http = require('http');

const API_URL = process.env.API_URL || 'http://localhost:5000';
const HEALTH_CHECK_URL = `${API_URL}/api/health`;

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

function testHealthCheck() {
  return new Promise((resolve) => {
    log('\n=== 快速连接测试 ===\n', 'blue');
    log(`测试服务器: ${API_URL}`, 'yellow');
    
    const req = http.get(HEALTH_CHECK_URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            log('✓ 服务器运行正常', 'green');
            log(`  消息: ${result.message}`, 'green');
            log(`  时间戳: ${result.timestamp}`, 'green');
            resolve(true);
          } catch (e) {
            log('✗ 响应格式错误', 'red');
            resolve(false);
          }
        } else {
          log(`✗ 服务器返回错误状态码: ${res.statusCode}`, 'red');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      log(`✗ 无法连接到服务器: ${error.message}`, 'red');
      log('\n请确保:', 'yellow');
      log('  1. 服务器已启动 (运行: npm run server)', 'yellow');
      log('  2. MongoDB 服务正在运行', 'yellow');
      log('  3. 端口 5000 未被占用', 'yellow');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      log('✗ 连接超时', 'red');
      log('\n请确保服务器已启动 (运行: npm run server)', 'yellow');
      resolve(false);
    });
  });
}

// 运行测试
testHealthCheck().then((success) => {
  if (success) {
    log('\n✓ 基本连接测试通过！', 'green');
    log('可以运行完整测试: npm run test:api', 'blue');
  } else {
    log('\n✗ 基本连接测试失败', 'red');
    process.exit(1);
  }
});

