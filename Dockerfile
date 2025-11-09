# 多阶段构建：后端
FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
EXPOSE 5000

# 多阶段构建：前端
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# 生产镜像
FROM node:18-alpine
WORKDIR /app
COPY --from=server-build /app/server ./server
COPY --from=client-build /app/client/build ./client/build
WORKDIR /app/server
EXPOSE 5000
CMD ["node", "index.js"]

