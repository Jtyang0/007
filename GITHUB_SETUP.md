# GitHub 上传指南

## 当前状态

您的项目已经配置了 GitHub 远程仓库：
- 远程仓库地址: `https://github.com/Jtyang0/007.git`
- 当前分支: `main`

## 推送代码到 GitHub

### 方法 1: 使用命令行推送

```bash
# 1. 确保所有更改已提交
git add .
git commit -m "更新项目：移除用户登录功能，改为单用户模式"

# 2. 推送到 GitHub
git push origin main
```

如果遇到认证问题，您可能需要：

**使用 Personal Access Token (推荐)**:
1. 访问 GitHub: https://github.com/settings/tokens
2. 生成新的 token (classic)
3. 选择权限: `repo` (完整仓库权限)
4. 复制 token
5. 推送时使用 token 作为密码：
   ```bash
   git push origin main
   # 用户名: 您的 GitHub 用户名
   # 密码: 粘贴您的 token
   ```

**或使用 SSH (更安全)**:
```bash
# 1. 检查是否已有 SSH 密钥
ls ~/.ssh

# 2. 如果没有，生成新的 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 3. 将公钥添加到 GitHub
# 复制 ~/.ssh/id_ed25519.pub 的内容
# 访问: https://github.com/settings/keys
# 点击 "New SSH key"，粘贴公钥

# 4. 更改远程仓库 URL 为 SSH
git remote set-url origin git@github.com:Jtyang0/007.git

# 5. 推送
git push origin main
```

### 方法 2: 使用 GitHub Desktop

1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 打开 GitHub Desktop
3. 选择 "File" > "Add Local Repository"
4. 选择项目目录
5. 点击 "Publish repository" 或 "Push origin"

### 方法 3: 在 GitHub 网页上创建新仓库

如果远程仓库不存在或想创建新仓库：

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `time-tracker-app` (或您喜欢的名称)
   - Description: `时间开销记录仪网页应用`
   - 选择 Public 或 Private
   - **不要**初始化 README、.gitignore 或 license
3. 点击 "Create repository"
4. 按照页面上的说明推送现有代码：

```bash
git remote remove origin  # 如果已有远程仓库
git remote add origin https://github.com/您的用户名/仓库名.git
git branch -M main
git push -u origin main
```

## 检查推送状态

```bash
# 查看远程仓库信息
git remote -v

# 查看提交历史
git log --oneline -10

# 查看本地和远程的差异
git fetch origin
git log HEAD..origin/main --oneline  # 远程有本地没有的提交
git log origin/main..HEAD --oneline  # 本地有远程没有的提交
```

## 常见问题

### 1. 认证失败

**问题**: `fatal: Authentication failed`

**解决方案**:
- 使用 Personal Access Token 代替密码
- 或配置 SSH 密钥

### 2. 网络连接问题

**问题**: `Failed to connect to github.com`

**解决方案**:
- 检查网络连接
- 如果在国内，可能需要配置代理或使用镜像
- 尝试使用 SSH 方式连接

### 3. 推送被拒绝

**问题**: `! [rejected] main -> main (non-fast-forward)`

**解决方案**:
```bash
# 先拉取远程更改
git pull origin main --rebase

# 或强制推送（谨慎使用，会覆盖远程更改）
git push origin main --force
```

## 项目文件说明

以下文件/目录会被 Git 忽略（不会上传）：
- `node_modules/` - 依赖包
- `.env` - 环境变量（包含敏感信息）
- `build/` - 构建产物
- `*.log` - 日志文件

所有源代码和配置文件都会被上传。

## 下一步

推送成功后，您可以：
1. 在 GitHub 上查看代码
2. 添加 README 的徽章
3. 设置 GitHub Pages（如果需要）
4. 配置 GitHub Actions（CI/CD）
5. 添加 Issues 和 Projects 管理

