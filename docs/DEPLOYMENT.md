# 部署指南

## 环境要求

- Node.js 18+
- MongoDB 5.0+ (或使用 Docker)
- npm 或 yarn

## 本地开发部署

### 1. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

或使用快捷命令：

```bash
npm run install-all
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
# 服务器配置
PORT=5000
NODE_ENV=development

# MongoDB连接
MONGODB_URI=mongodb://localhost:27017/time-tracker

# JWT密钥（生产环境请使用强密钥）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# 前端URL（用于CORS）
CLIENT_URL=http://localhost:3000
```

### 3. 启动 MongoDB

#### 方式一：本地安装 MongoDB

确保 MongoDB 服务已启动：

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

#### 方式二：使用 Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### 4. 启动开发服务器

```bash
# 在项目根目录运行
npm run dev
```

这将同时启动：
- 后端服务: http://localhost:5000
- 前端应用: http://localhost:3000

### 5. 单独启动

```bash
# 启动后端
npm run server

# 启动前端（新终端）
npm run client
```

## Docker 部署

### 使用 Docker Compose（推荐）

1. 创建 `.env` 文件（参考上面的配置）

2. 启动服务：

```bash
docker-compose up -d
```

这将启动：
- MongoDB 容器
- 后端服务容器

3. 查看日志：

```bash
docker-compose logs -f
```

4. 停止服务：

```bash
docker-compose down
```

### 手动构建 Docker 镜像

1. 构建镜像：

```bash
docker build -t time-tracker-app .
```

2. 运行容器：

```bash
docker run -d \
  --name time-tracker \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongodb:27017/time-tracker \
  -e JWT_SECRET=your-secret-key \
  time-tracker-app
```

## 生产环境部署

### 1. 环境变量配置

确保设置以下环境变量：

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-mongodb-host:27017/time-tracker
JWT_SECRET=your-strong-secret-key-here
JWT_EXPIRE=7d
CLIENT_URL=https://your-domain.com
```

### 2. 构建前端

```bash
cd client
npm run build
```

构建产物在 `client/build` 目录。

### 3. 使用 PM2 管理 Node.js 进程

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
cd server
pm2 start index.js --name time-tracker

# 查看状态
pm2 status

# 查看日志
pm2 logs time-tracker

# 停止应用
pm2 stop time-tracker
```

### 4. 使用 Nginx 反向代理

Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/client/build;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. 使用 HTTPS

使用 Let's Encrypt 获取免费 SSL 证书：

```bash
sudo certbot --nginx -d your-domain.com
```

## MongoDB 备份与恢复

### 备份

```bash
mongodump --uri="mongodb://localhost:27017/time-tracker" --out=/backup/path
```

### 恢复

```bash
mongorestore --uri="mongodb://localhost:27017/time-tracker" /backup/path
```

## 故障排查

### 1. MongoDB 连接失败

- 检查 MongoDB 服务是否运行
- 检查连接字符串是否正确
- 检查防火墙设置

### 2. 端口被占用

```bash
# 查找占用端口的进程
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

### 3. JWT 认证失败

- 检查 JWT_SECRET 是否设置
- 检查 token 是否过期
- 检查请求头中是否包含正确的 Authorization 头

### 4. CORS 错误

- 检查 CLIENT_URL 环境变量是否正确
- 检查后端 CORS 配置

## 性能优化建议

1. **数据库索引**: 已在模型中定义必要的索引
2. **分页查询**: 使用分页参数避免一次性加载大量数据
3. **缓存**: 考虑使用 Redis 缓存常用数据
4. **CDN**: 前端静态资源使用 CDN 加速
5. **压缩**: 启用 gzip 压缩

## 安全建议

1. **JWT Secret**: 使用强随机密钥，不要使用默认值
2. **HTTPS**: 生产环境必须使用 HTTPS
3. **密码加密**: 已使用 bcrypt 加密存储
4. **输入验证**: 所有输入都经过验证
5. **SQL注入**: 使用 Mongoose 防止 NoSQL 注入
6. **速率限制**: 考虑添加 API 速率限制

## 监控与日志

建议使用以下工具监控应用：

- **PM2**: 进程管理
- **Winston**: 日志记录
- **Sentry**: 错误追踪
- **New Relic / Datadog**: 性能监控

