/**
 * 依赖检查脚本
 * 检查项目依赖是否已安装
 */

const fs = require('fs');
const path = require('path');

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

function checkDirectory(dir, name) {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    log(`✓ ${name} 目录存在`, 'green');
    return true;
  } else {
    log(`✗ ${name} 目录不存在`, 'red');
    return false;
  }
}

function checkNodeModules(dir, name) {
  const nodeModulesPath = path.join(__dirname, '..', dir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    log(`✓ ${name} node_modules 已安装`, 'green');
    return true;
  } else {
    log(`✗ ${name} node_modules 未安装`, 'yellow');
    return false;
  }
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    log(`✓ .env 文件存在`, 'green');
    return true;
  } else {
    log(`✗ .env 文件不存在 (请复制 env.example 为 .env)`, 'yellow');
    return false;
  }
}

function checkPackageJson(dir, name) {
  const packageJsonPath = path.join(__dirname, '..', dir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    log(`✓ ${name} package.json 存在`, 'green');
    return true;
  } else {
    log(`✗ ${name} package.json 不存在`, 'red');
    return false;
  }
}

log('\n=== 检查项目依赖 ===\n', 'blue');

let allOk = true;

// 检查目录结构
log('检查目录结构...', 'yellow');
allOk = checkDirectory('server', 'server') && allOk;
allOk = checkDirectory('client', 'client') && allOk;
allOk = checkDirectory('docs', 'docs') && allOk;

// 检查 package.json
log('\n检查配置文件...', 'yellow');
allOk = checkPackageJson('.', '根目录') && allOk;
allOk = checkPackageJson('server', 'server') && allOk;
allOk = checkPackageJson('client', 'client') && allOk;

// 检查 node_modules
log('\n检查依赖安装...', 'yellow');
const serverDeps = checkNodeModules('server', 'server');
const clientDeps = checkNodeModules('client', 'client');

// 检查环境变量
log('\n检查环境配置...', 'yellow');
const envExists = checkEnvFile();

log('\n=== 检查结果 ===\n', 'blue');

if (!serverDeps) {
  log('请运行: cd server && npm install', 'yellow');
}

if (!clientDeps) {
  log('请运行: cd client && npm install', 'yellow');
}

if (!envExists) {
  log('请运行: copy env.example .env (Windows) 或 cp env.example .env (Linux/Mac)', 'yellow');
}

if (serverDeps && clientDeps && envExists) {
  log('✓ 所有依赖已安装，可以开始测试！', 'green');
} else {
  log('✗ 请先安装缺失的依赖', 'red');
}

log('', 'reset');

