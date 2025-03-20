# 部署指南

## 前置要求

- Docker 和 Docker Compose（本地开发用）
- Node.js 18+（本地开发用）
- Dokploy 账号和访问权限

## Dokploy 部署步骤

### 1. 准备工作

1. 确保你有 Dokploy 平台的访问权限
2. 准备好所需的环境变量值
3. 确保项目根目录包含 `dokploy.yml` 文件

### 2. 配置 Secrets

在 Dokploy 平台上配置以下 secrets：

- `app_url`: 应用访问地址
- `database_url`: 数据库连接字符串
- `jwt_secret`: JWT 密钥
- `smtp_host`: SMTP 服务器地址
- `smtp_port`: SMTP 端口
- `smtp_user`: SMTP 用户名
- `smtp_pass`: SMTP 密码
- `smtp_from`: 发件人地址
- `redis_url`: Redis 连接字符串
- `db_user`: 数据库用户名
- `db_password`: 数据库密码

### 3. 部署应用

1. 在 Dokploy 控制台创建新项目
2. 连接到你的代码仓库
3. 选择部署分支（如 main 或 production）
4. 确认配置并部署

### 4. 数据库迁移

首次部署后，需要执行数据库迁移：

```bash
# 使用 Dokploy CLI 或 Web 控制台执行
dokploy exec -c "npx prisma migrate deploy"
```

### 5. 持久化存储

Dokploy 会自动管理以下持久化存储：

- 上传文件目录 (`/app/uploads`)
- Next.js 缓存目录 (`/app/.next/cache`)
- PostgreSQL 数据
- Redis 数据

### 6. 监控和日志

1. 在 Dokploy 控制台查看应用日志
2. 监控应用健康状态（`/api/health` 端点）
3. 查看资源使用情况

### 7. 扩展和缩放

通过 Dokploy 控制台或 API 可以：

- 调整实例数量（1-3个实例）
- 修改资源限制
- 配置自动扩展规则

### 8. 更新部署

1. 推送代码到仓库
2. Dokploy 将自动触发新的部署
3. 监控部署状态和健康检查

### 9. 备份策略

1. 数据库备份：
   - 使用 Dokploy 的自动备份功能
   - 配置备份频率和保留策略

2. 文件备份：
   - 配置持久化存储的备份策略
   - 定期验证备份的完整性

### 10. 故障排除

1. 检查应用日志：
   - 使用 Dokploy 控制台查看实时日志
   - 下载历史日志进行分析

2. 健康检查失败：
   - 检查 `/api/health` 端点响应
   - 验证数据库和 Redis 连接
   - 查看资源使用情况

3. 数据库问题：
   - 检查连接字符串
   - 验证数据库访问权限
   - 检查数据库服务状态

## 注意事项

1. 生产环境配置：
   - 使用强密码和密钥
   - 配置适当的资源限制
   - 启用 HTTPS

2. 性能优化：
   - 配置合适的实例数量
   - 调整资源限制
   - 优化数据库查询

3. 安全考虑：
   - 定期更新依赖
   - 启用安全标头
   - 配置 CORS 策略

4. 监控告警：
   - 配置健康检查告警
   - 设置资源使用告警
   - 配置错误日志告警

5. 成本控制：
   - 监控资源使用情况
   - 适当配置自动扩展
   - 优化存储使用

## 部署步骤

### 1. 环境准备

1. 复制环境变量文件：
```bash
cp .env.example .env
```

2. 修改环境变量：
- 设置正确的 `NEXT_PUBLIC_APP_URL`
- 配置数据库连接信息
- 设置安全的 `JWT_SECRET`
- 配置邮件服务信息
- 设置正确的 `CORS_ORIGINS`

### 2. 使用 Docker Compose 部署

1. 构建并启动服务：
```bash
docker-compose up -d
```

2. 执行数据库迁移：
```bash
docker-compose exec app npx prisma migrate deploy
```

3. 检查服务状态：
```bash
docker-compose ps
```

### 3. 使用 Coolify 部署

1. 在 Coolify 中创建新项目
2. 配置构建设置：
   - 构建命令：`npm run build`
   - 启动命令：`npm start`
   - Node.js 版本：18
3. 配置环境变量（从 .env.example 复制）
4. 设置持久化存储：
   - /app/uploads
   - /app/.next/cache
5. 配置数据库连接
6. 部署项目

### 4. 数据库迁移

首次部署或更新数据库架构时：

```bash
npx prisma migrate deploy
```

### 5. 文件权限

确保上传目录具有正确的权限：

```bash
chmod -R 755 /app/uploads
```

### 6. SSL 配置

建议使用 Nginx 作为反向代理并配置 SSL：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 7. 监控和日志

- 使用 Docker 日志：`docker-compose logs -f app`
- 监控容器状态：`docker stats`

### 8. 备份

定期备份数据库和上传的文件：

```bash
# 备份数据库
docker-compose exec db pg_dump -U postgres battery_emulator > backup.sql

# 备份上传文件
tar -czf uploads_backup.tar.gz /path/to/uploads
```

### 9. 更新部署

1. 拉取最新代码
2. 重新构建容器：
```bash
docker-compose build
docker-compose up -d
```

### 10. 故障排除

1. 检查日志：
```bash
docker-compose logs -f
```

2. 检查数据库连接：
```bash
docker-compose exec app npx prisma db seed
```

3. 检查 Redis 连接：
```bash
docker-compose exec redis redis-cli ping
``` 