# Vue3 后台管理系统

基于 Vue3、Vue Router、Element Plus 和 Axios 构建的现代化后台管理系统。

## 技术栈

- Vue 3.3.9
- Vue Router 4.2.5
- Element Plus 2.4.3
- Axios 1.6.2
- Vite 5.0.4
- Pinia 2.1.7

## 功能特性

- 响应式布局，适配不同屏幕尺寸
- 员工认证与授权
- 动态路由与菜单
- 仪表盘数据可视化
- 表单验证
- RESTful API 集成
- 错误处理与页面

## 项目结构

```
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── assets/          # 资源文件
│   ├── components/      # 公共组件
│   ├── layout/          # 布局组件
│   ├── router/          # 路由配置
│   ├── store/           # Pinia 状态管理
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── .gitignore           # Git 忽略文件
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── README.md            # 项目说明
└── vite.config.mjs      # Vite 配置
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发环境运行

```bash
pnpm dev
```

### 构建生产环境

```bash
pnpm build
```

## 构建输出目录（规范化）

默认构建产物输出到项目根目录下的相对路径 `dist/`。

- **默认值**：`dist`
- **env 覆盖**：通过 `VITE_BUILD_OUT_DIR` 覆盖（建议使用相对路径，便于跨平台/CI）

示例：在 `.env.production` 中配置：

```bash
VITE_BUILD_OUT_DIR=dist-prod
```

## 开发环境 API 配置（端口/路径约定）

项目默认通过 `VITE_API_BASE_URL` 指定后端地址（本项目未配置 Vite dev proxy）。

- **前端 dev**：`http://localhost:3001`
- **后端示例**：`https://localhost:7179`
- **推荐 baseURL**：`https://localhost:7179/api`
- **登录接口最终路径**：`/api/SystemBasicMgmt/SystemAuth/SysUserOperate/UserLogin`

### Cookie 会话探活（可选）

后端若提供“当前用户/会话检查”接口，可配置 `VITE_AUTH_ME_API` 启用探活闭环。

- **VITE_AUTH_ME_API**：必须带前导 `/`，例如：`/SystemBasicMgmt/SystemAuth/SysUserOperate/GetCurrentUser`
- **未配置时**：前端会跳过探活，避免默认 `/me` 导致 404

### 预览生产环境

```bash
pnpm preview
```

## 登录信息

- 员工名: admin
- 密码: 123456

## 浏览器支持

- Chrome
- Firefox
- Safari
- Edge

## 许可协议

[MIT](LICENSE)
