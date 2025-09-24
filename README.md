# FlashBuy 移动端项目

一个基于 Vue 3 生态系统的移动 web 应用模板，帮助你快速完成业务开发。

## 技术栈

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite 7](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/), [esbuild](https://github.com/evanw/esbuild) - 就是快！
- 🗂 [基于文件的路由](./src/router)
- 📦 [组件自动化加载](./src/components)
- 🍍 [使用 Pinia 的状态管理](https://pinia.vuejs.org)
- 🎨 [UnoCSS](https://github.com/antfu/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎
- 🔥 使用 [新的 `<script setup>` 语法](https://github.com/vuejs/rfcs/pull/227)
- 📥 [API 自动加载](https://github.com/antfu/unplugin-auto-import) - 直接使用 Composition API 无需引入
- 💪 TypeScript, 当然
- 💾 [本地数据模拟](https://github.com/pengzhanbo/vite-plugin-mock-dev-server)的支持
- 🌈 Git hooks - 提交代码 eslint 检测 和 提交规范检测
- 🪶 [Vant](https://github.com/youzan/vant) - 移动端 Vue 组件库
- 🔭 [vConsole](https://github.com/vadxq/vite-plugin-vconsole) - 移动端网页开发工具
- 📱 浏览器适配 - 使用 viewport vw/vh 单位布局
- 💻 [桌面端优化](https://github.com/wswmsword/postcss-mobile-forever) - 处理为移动端视图
- 🛡️ 将 [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 设为默认

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
