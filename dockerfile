# 基于官方 Node.js 镜像构建
FROM node:18.16.1

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 暴露端口
EXPOSE 5000

# 启动应用程序
CMD [ "npm", "start" ]
