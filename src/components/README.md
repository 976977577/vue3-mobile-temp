# 组件目录

此目录下的组件会被自动注册和按需加载，由 [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components) 提供支持。

## 使用方式

1. 在此目录下创建 Vue 组件
2. 组件会自动注册，无需手动导入
3. 在页面中直接使用组件名即可

## 示例

```vue
<!-- 创建组件：src/components/MyButton.vue -->
<template>
  <button class="my-button">
    <slot />
  </button>
</template>

<!-- 在页面中使用，无需导入 -->
<template>
  <MyButton>点击我</MyButton>
</template>
```
