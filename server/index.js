const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// 加载环境变量（从项目根目录加载 .env 文件）
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

// 验证环境变量
if (!process.env.MONGODB_URI) {
  console.error('错误: MONGODB_URI 环境变量未设置');
  console.error(`请检查 .env 文件是否存在: ${envPath}`);
  process.exit(1);
}

// 连接数据库
connectDB();

// 初始化默认分类
const initDefaultCategories = require('./utils/initDefaultCategories');
setTimeout(() => {
  initDefaultCategories();
}, 2000); // 等待数据库连接完成

const app = express();

// 中间件
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 路由
app.use('/api/time-records', require('./routes/timeRecordRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '服务器运行正常',
    timestamp: new Date().toISOString()
  });
});

// 生产环境：提供前端静态文件
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));
  
  // 所有非 API 路由返回前端应用
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // 开发环境：API 404 处理
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: '接口不存在'
    });
  });
}

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});


