# Vercel 部署指南

## 问题修复

已修复 Vercel 构建失败的问题：

1. **创建了 `vercel.json` 配置文件**
   - 指定构建命令：`npm run vercel-build`
   - 指定输出目录：`client/build`
   - 指定安装命令：`npm install`

2. **添加了 `vercel-build` 脚本**
   - 在构建前自动安装 client 目录的依赖
   - 然后执行构建

3. **将 `react-scripts` 移到 `dependencies`**
   - 确保 Vercel 构建时能正确安装

## 部署步骤

### 1. 提交更改到 GitHub

```bash
git add .
git commit -m "修复 Vercel 构建配置"
git push origin main
```

### 2. 在 Vercel 中重新部署

1. 访问 Vercel 控制台
2. 找到您的项目
3. 点击 "Redeploy" 或等待自动重新部署

### 3. 检查构建日志

在 Vercel 的部署日志中，您应该看到：
- ✅ 安装根目录依赖
- ✅ 执行 `npm run vercel-build`
- ✅ 安装 client 目录依赖
- ✅ 执行 `react-scripts build`
- ✅ 构建成功

## Vercel 配置说明

### vercel.json

```json
{
  "version": 2,
  "buildCommand": "npm run vercel-build",
  "installCommand": "npm install",
  "outputDirectory": "client/build",
  "framework": null
}
```

- `buildCommand`: 自定义构建命令
- `installCommand`: 安装依赖的命令
- `outputDirectory`: 构建输出目录（React 应用）
- `framework`: 设置为 null，使用自定义构建

### package.json 脚本

```json
{
  "vercel-build": "cd client && npm install && npm run build"
}
```

这个脚本会：
1. 进入 client 目录
2. 安装 client 的依赖（包括 react-scripts）
3. 执行构建

## 环境变量配置

如果应用需要环境变量，在 Vercel 中设置：

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加以下变量（如果需要）：
   - `REACT_APP_API_URL`: 后端 API 地址

## 注意事项

1. **后端 API 地址**
   - 前端需要知道后端 API 的地址
   - 如果后端也部署在 Vercel，使用 Vercel 提供的 URL
   - 如果后端部署在其他地方，设置 `REACT_APP_API_URL` 环境变量

2. **MongoDB 连接**
   - 后端需要 MongoDB 连接
   - 可以使用 MongoDB Atlas（云数据库）
   - 在 Vercel 环境变量中设置 `MONGODB_URI`

3. **仅前端部署**
   - 当前配置只部署前端（React 应用）
   - 后端需要单独部署（如 Railway、Render、或 Vercel Serverless Functions）

## 后续优化

如果需要同时部署前后端：

1. **使用 Vercel Serverless Functions**
   - 将后端 API 转换为 Serverless Functions
   - 在 `api/` 目录下创建函数

2. **或使用单独的部署服务**
   - 后端部署到 Railway、Render 等
   - 前端部署到 Vercel
   - 通过环境变量连接

## 故障排查

### 构建失败：react-scripts 未找到

**解决方案**：
- 确保 `react-scripts` 在 `client/package.json` 的 `dependencies` 中
- 检查 `vercel-build` 脚本是否正确

### 构建失败：依赖安装失败

**解决方案**：
- 检查 `client/package.json` 是否有语法错误
- 确保所有依赖版本兼容

### 运行时错误：API 连接失败

**解决方案**：
- 检查 `REACT_APP_API_URL` 环境变量是否正确设置
- 检查后端服务是否正常运行
- 检查 CORS 配置

