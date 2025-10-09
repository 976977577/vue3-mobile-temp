import MlDialog from './index.vue'
import type { DialogOptions } from './index.vue'
import { createApp } from 'vue'

declare global {
  interface Window {
    malanDialog: (
      options: DialogOptions
    ) => Promise<{ confirm: boolean, cancel: boolean, close: boolean }>
  }
}

export default function (
  options: DialogOptions
): Promise<{ confirm: boolean, cancel: boolean, close: boolean }> {
  return new Promise((resolve) => {
    const div = document.createElement('div')
    const app = createApp(
      h(
        MlDialog,
        {
          title: options.title,
          message: options.message,
          showClose: options.showClose,
          showConfirmButton: options.showConfirmButton ?? true,
          showCancelButton: options.showCancelButton ?? true,
          confirmButtonText: options.confirmButtonText || '确认',
          cancelButtonText: options.cancelButtonText || '取消',
          confirmButtonStyle: options.confirmButtonStyle,
          cancelButtonStyle: options.cancelButtonStyle,
          show: true,
          destroy: () => {
            app.unmount()
            div.remove()
            resolve({
              close: true,
              confirm: false,
              cancel: false
            })
          },
          confirm: () => {
            app.unmount()
            div.remove()
            options.confirm?.()
            resolve({
              close: false,
              confirm: true,
              cancel: false
            })
          },
          cancel: () => {
            app.unmount()
            div.remove()
            options.cancel?.()
            resolve({
              close: false,
              confirm: false,
              cancel: true
            })
          },
          close: () => {
            app.unmount()
            div.remove()
            options.close?.()
            resolve({
              close: true,
              confirm: false,
              cancel: false
            })
          },
          beforeClose: options.beforeClose
        },
        options.slot
          ? {
              default: () => h(options.slot!)
            }
          : undefined
      )
    )
    app.mount(div)
    document.body.appendChild(div)
  })
}
