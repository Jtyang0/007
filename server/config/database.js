const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('错误: MONGODB_URI 环境变量未设置');
      console.error('请检查 .env 文件中的 MONGODB_URI 配置');
      process.exit(1);
    }

    console.log(`正在连接 MongoDB: ${mongoURI.replace(/\/\/.*@/, '//***@')}`); // 隐藏密码
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✓ MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error('✗ MongoDB 连接失败:', error.message);
    console.error('\n请检查:');
    console.error('  1. MongoDB 服务是否正在运行');
    console.error('  2. .env 文件中的 MONGODB_URI 是否正确');
    console.error('  3. 网络连接是否正常');
    process.exit(1);
  }
};

module.exports = connectDB;

