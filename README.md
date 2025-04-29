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
- 用户认证与授权
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
└── vite.config.js       # Vite 配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产环境

```bash
npm run build
```

### 预览生产环境

```bash
npm run preview
```

## 登录信息

- 用户名: admin
- 密码: 123456

## 浏览器支持

- Chrome
- Firefox
- Safari
- Edge

## 许可证

[MIT](LICENSE) 