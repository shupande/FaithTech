# Battery Emulator

一个基于 Next.js 构建的现代化 Web 应用程序。

## 技术栈

- **前端框架**: Next.js 14.1.3
- **编程语言**: TypeScript
- **UI 框架**: React 18
- **样式解决方案**: TailwindCSS
- **数据库**: Prisma ORM
- **状态管理**: React Hook Form
- **UI 组件**: 
  - Radix UI (多个组件)
  - Lucide React (图标)
  - Framer Motion (动画)
- **开发工具**: 
  - ESLint
  - TypeScript
  - Prisma CLI

## 项目结构

```
src/
├── app/          # Next.js 应用路由和页面
├── components/   # React 组件
├── config/       # 配置文件
├── data/         # 数据相关文件
├── hooks/        # 自定义 React Hooks
├── lib/          # 工具函数和库
├── types/        # TypeScript 类型定义
└── middleware.ts # Next.js 中间件

prisma/          # Prisma 数据库配置和迁移
public/          # 静态资源
scripts/         # 脚本文件
```

## 主要功能

- 用户认证和授权
- 响应式设计
- 数据可视化 (使用 Nivo, Recharts)
- 富文本编辑 (TipTap, React Quill)
- 文件处理 (支持 FFmpeg)
- 邮件发送功能
- 主题切换
- 国际化支持

## 开始使用

1. 安装依赖
```bash
npm install
```

2. 环境配置
- 复制 `.env.example` 到 `.env`
- 配置必要的环境变量

3. 数据库设置
```bash
npx prisma generate
npx prisma db push
```

4. 启动开发服务器
```bash
npm run dev
```

应用将在 http://localhost:3000 启动

## 可用的脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行代码检查
- `npm run migrate:mock` - 运行模拟数据迁移

## 注意事项

- 确保已安装 Node.js 16+ 版本
- 需要配置数据库连接
- 部分功能可能需要额外的 API 密钥配置

## 许可证

Private 