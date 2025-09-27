# Vue3 移动端开发模板

一个基于 Vue 3 生态系统的移动 web 应用开发模板，帮助你快速完成业务开发。

## 特性

- ⚡ [Vue 3](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/), [ESBuild](https://github.com/evanw/esbuild) - 就是快！
- 📦 [组件自动化加载](./src/components)
- 🍍 [Pinia 状态管理](https://pinia.vuejs.org/)
- 📱 [Vant 4](https://vant-ui.github.io/vant/#/zh-CN) - 轻量、可靠的移动端组件库
- 🌐 [Axios](https://axios-http.com/) - HTTP 客户端，支持请求/响应拦截
- 📱 移动端适配 - 基于 viewport 的响应式设计
- 🎨 [UnoCSS](https://github.com/antfu/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎
- 😃 [各种图标集为你所用](https://github.com/antfu/unocss/tree/main/packages/preset-icons)
- 🔥 使用 [新的 `<script setup>` 语法](https://github.com/vuejs/rfcs/pull/227)
- 📥 [API 自动加载](https://github.com/antfu/unplugin-auto-import) - 直接使用 Composition API 无需引入
- 🦾 TypeScript, 当然
- 🔧 [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - 代码规范和格式化
- 🚀 多环境构建支持 - 开发/生产环境配置

## 环境要求

- Node.js 版本 22.19.0+
- pnpm 包管理器

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
pnpm dev
```

在浏览器中打开 <http://localhost:3000> 查看效果

### 构建

```bash
# 开发环境构建
pnpm build:dev

# 生产环境构建
pnpm build:pro
```

### 预览

```bash
pnpm preview
```

## 项目结构

```
src/
├── api/          # API 接口
├── assets/       # 静态资源
├── components/   # 公共组件
├── config/       # 配置文件
├── constants/    # 常量定义
├── pages/        # 页面组件
├── router/       # 路由配置
├── stores/       # 状态管理
├── styles/       # 全局样式
├── types/        # 类型定义
└── utils/        # 工具函数
```

## 开发规范

- 使用 Composition API 的 `<script setup>` 语法
- 遵循 ESLint 规范，单引号，无分号
- 使用 TypeScript 进行类型检查
- 提交代码前会自动进行 lint 检查

## License

[MIT](./LICENSE) License
