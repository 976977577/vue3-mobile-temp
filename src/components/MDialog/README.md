## showDialog 函数返回值

函数返回一个 `Promise`，解析后会得到一个对象，包含用户的操作信息：

```ts
{
  confirm: boolean // 是否点击了确认
  cancel: boolean // 是否点击了取消
  close: boolean // 是否关闭了对话框
}
```

### 1. 基本使用

```ts
const { confirm, cancel, close } = await showDialog({
  title: '确认操作',
  message: '你确定要执行此操作吗？',
  showClose: true
})

if (result.confirm) {
  console.log('用户点击了确认')
}
else if (result.cancel) {
  console.log('用户点击了取消')
}
else if (result.close) {
  console.log('用户关闭了对话框')
}
```

### 2. 自定义按钮文本

```ts
const { confirm } = await showDialog({
  title: '删除确认',
  message: '确定要删除此项吗？',
  confirmButtonText: '删除',
  cancelButtonText: '放弃'
})

if (confirm) {
  console.log('用户点击了删除')
}
```

### 3. 监听事件

```ts
showDialog({
  title: '信息',
  message: '这是一个带关闭按钮的对话框',
  showClose: true,
  confirm() {
    console.log('confirm 触发')
  },
  cancel() {
    console.log('cancel 触发')
  },
  close() {
    console.log('close 触发')
  }
})
```

### 4. 传递自定义插槽内容

```ts
// https://cn.vuejs.org/api/render-function.html#h
import { h } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
// 第一种方式
showDialog({
  title: '确认发布',
  slot: h('p', {
    innerHTML:
      '发布此任务将扣除你 <span style="color: #4A59FF;">20星钻 </span>确认要发布吗？'
  })
})

// 第二种方式
showDialog({
  title: '确认发布',
  slot: HelloWorld
})
```

## API

| 参数                 | 类型            | 默认值      | 说明               |
| -------------------- | --------------- | ----------- | ------------------ |
| `title`              | `string`        | `''`        | 对话框标题         |
| `message`            | `string`        | `''`        | 对话框消息内容     |
| `showClose`          | `boolean`       | `false`     | 是否显示关闭按钮   |
| `showConfirmButton`  | `boolean`       | `true`      | 是否显示确认按钮   |
| `showCancelButton`   | `boolean`       | `true`      | 是否显示取消按钮   |
| `confirmButtonText`  | `string`        | `'确认'`    | 确认按钮文本       |
| `cancelButtonText`   | `string`        | `'取消'`    | 取消按钮文本       |
| `confirmButtonStyle` | `CSSProperties` | `无`        | 取消按钮文本       |
| `cancelButtonStyle`  | `CSSProperties` | `无`        | 取消按钮文本       |
| `slot`               | `VNode`         | `undefined` | 传递自定义插槽内容 |
| `confirm`            | `Function`      | `undefined` | 确认按钮回调       |
| `cancel`             | `Function`      | `undefined` | 取消按钮回调       |
| `close`              | `Function`      | `undefined` | 关闭按钮回调       |
