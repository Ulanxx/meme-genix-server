# 服务端技术框架

## 核心框架

* Nest.js - 主框架
* TypeScript - 提供类型安全和更好的开发体验

## 数据库相关

* TypeORM/Prisma - ORM框架，用于数据库操作
* PostgreSQL - 主数据库，适合处理复杂查询和高并发
* Redis - 缓存层，用于提升性能和存储临时数据

## 区块链交互

* Web3.js/Ethers.js - 与以太坊区块链交互
* Multicall - 批量查询合约数据，优化性能

## API文档和验证

* Swagger/OpenAPI - API文档自动生成
* class-validator - 请求数据验证
* class-transformer - 数据转换

## 安全相关

* Helmet - HTTP 安全头配置
* Rate-limiting - 限流保护
* JWT - 身份认证
* bcrypt - 密码加密

## 监控和日志

* Winston - 日志管理
* Prometheus + Grafana - 性能监控
* Sentry - 错误跟踪

## 测试工具

* Jest - 单元测试
* Supertest - API测试

## 部署和DevOps

* Docker - 容器化
* Docker Compose - 本地开发环境
* GitHub Actions/GitLab CI - CI/CD
* PM2 - Node.js进程管理

## 跨域和缓存

* CORS - 跨域资源共享
* Cache-Control - HTTP缓存策略

## 国际化支持

* i18n - 多语言支持
* Moment.js/Day.js - 时间处理
