# 启动指南

## 问题修复

### ✅ 已修复的问题

1. **环境变量加载问题**
   - 修复了 `server/index.js` 中环境变量加载路径问题
   - 现在会从项目根目录正确加载 `.env` 文件

2. **前端依赖缺失**
   - 已安装 `client` 目录的所有依赖
   - `react-scripts` 现在可用

## 启动步骤

### 1. 确保 MongoDB 运行

**Windows**:
```powershell
# 检查 MongoDB 服务状态
Get-Service MongoDB

# 如果未运行，启动服务
net start MongoDB
```

**或使用 Docker**:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### 2. 验证环境变量

确保 `.env` 文件在项目根目录，内容如下：

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/time-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. 启动应用

**方式1: 同时启动前后端（推荐）**
```bash
npm run dev
```

**方式2: 分别启动**

终端1 - 启动后端:
```bash
npm run server
```

终端2 - 启动前端:
```bash
npm run client
```

### 4. 访问应用

- 前端: http://localhost:3000
- 后端 API: http://localhost:5000/api

## 验证启动

### 检查后端

1. 查看终端输出，应该看到：
   ```
   服务器运行在端口 5000
   MongoDB 连接成功: localhost
   ```

2. 测试健康检查接口：
   ```bash
   curl http://localhost:5000/api/health
   ```

### 检查前端

1. 浏览器访问 http://localhost:3000
2. 应该看到登录页面

## 常见问题

### MongoDB 连接失败

**错误信息**: `MongoDB 连接失败: The uri parameter to openUri() must be a string, got "undefined"`

**解决方案**:
1. 检查 `.env` 文件是否存在且包含 `MONGODB_URI`
2. 确保 MongoDB 服务正在运行
3. 检查 MongoDB 连接字符串格式是否正确

### 端口被占用

**错误信息**: `Port 5000 is already in use` 或 `Port 3000 is already in use`

**解决方案**:
1. 关闭占用端口的其他应用
2. 或修改 `.env` 文件中的 `PORT` 值

### react-scripts 未找到

**错误信息**: `'react-scripts' 不是内部或外部命令`

**解决方案**:
```bash
cd client
npm install
```

## 测试

启动成功后，可以运行测试：

```bash
# 快速连接测试
npm run test:quick

# 完整 API 测试
npm run test:api
```

## 下一步

1. 访问 http://localhost:3000
2. 注册新用户
3. 开始使用时间跟踪功能

