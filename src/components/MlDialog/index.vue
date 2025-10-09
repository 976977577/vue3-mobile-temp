<script setup lang="ts" name="malan-dialog-component">
import { watch } from 'vue'
import type { CSSProperties } from 'vue'

type EventType = 'confirm' | 'cancel' | 'close'
const props = withDefaults(
  defineProps<DialogOptions & { destroy?: () => void }>(),
  {
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }
)
const emit = defineEmits(['cancel', 'confirm', 'close'])
const show = defineModel('show', {
  type: Boolean
})
const showPopup = ref(show)
export interface DialogOptions {
  title?: string
  message?: string
  slot?: VNode | (() => VNode) | null | any
  showConfirmButton?: boolean
  showCancelButton?: boolean
  showClose?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonStyle?: CSSProperties
  cancelButtonStyle?: CSSProperties
  confirm?: () => void
  cancel?: () => void
  close?: () => void
  beforeClose?: (done: () => void, event: EventType) => void
}
watch(show, (val) => {
  showPopup.value = val ?? false
})

function handleEvent(event: EventType) {
  if (props.beforeClose) {
    props.beforeClose(() => {
      show.value = false
      emit(event, event)
      props[event]?.()
    }, event)
  }
  else {
    show.value = false
    emit(event, event)
    props[event]?.()
  }
}

function interceptClick(e: Event & { closeDialog?: () => void }) {
  e.closeDialog = () => {
    show.value = false
    props.destroy?.()
  }
}
</script>

<template>
  <van-popup class="malan-dialog" :show="showPopup">
    <div class="malan-dialog__content__wrapper">
      <h3 v-if="title" class="malan-dialog__title">
        {{ title }}
      </h3>
      <div class="malan-dialog__container" @click.capture="interceptClick">
        <slot v-if="$slots.default" />
        <div v-else class="malan-dialog__message">
          {{ message }}
        </div>
      </div>
      <div
        v-if="showConfirmButton || showCancelButton"
        class="malan-dialog__footer"
      >
        <button
          v-if="showConfirmButton"
          :style="confirmButtonStyle"
          class="malan-dialog__btn confirm"
          @click="handleEvent('confirm')"
        >
          {{ confirmButtonText }}
        </button>
        <button
          v-if="showCancelButton"
          :style="cancelButtonStyle"
          class="malan-dialog__btn cancel"
          @click="handleEvent('cancel')"
        >
          {{ cancelButtonText }}
        </button>
      </div>
      <i
        v-if="showClose"
        class="malan-dialog__close"
        @click="handleEvent('close')"
      />
    </div>
  </van-popup>
</template>

<style scoped lang="less">
.malan-dialog {
  background-color: transparent !important;
  .malan-dialog__content__wrapper {
    width: 670px;
    box-sizing: border-box;
    padding: 40px;
    border-radius: 24px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    animation: zoomIn 0.3s;
    @keyframes zoomIn {
      from {
        opacity: 0;
        transform: scale(0.5);
      }

      50% {
        opacity: 1;
      }
    }
    .malan-dialog__title {
      height: 50px;
      font-weight: 600;
      font-size: 32px;
      color: #333;
      text-align: center;
      line-height: 45px;
    }
    .malan-dialog__container {
      width: 100%;
      padding: 32px 0;
      font-weight: 400;
      font-size: 28px;
      color: #333333;
      line-height: 33px;
      text-align: center;
    }
    .malan-dialog__footer {
      margin-top: 32px;
      display: flex;
      width: 100%;
      flex-direction: column;
      .malan-dialog__btn {
        width: 100%;
        height: 88px;
        border-radius: 44px;
        font-weight: 600;
        font-size: 32px;
        color: #fff;
        line-height: 38px;
        border: 0 none;

        &.confirm {
          margin-bottom: 16px;
          background: #4a59ff;
        }
        &.cancel {
          color: #808080;
          background: #fff;
          border: 2px solid #eeeeee;
        }
      }
    }
    .malan-dialog__close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA+lJREFUWEfNV11oHFUU/s4wMLPgQx8UKhYaMA8WFRqsoNCCQoWAipRWFFppxUojPlghZu8lFS5omLsxxIIIERUrVVBsUUFRsKDQPBSMNKBSHyJUKFRIH3wQ5k5Y5jhnmQnjurO7E21qnjbMued89/x89zuEIf+MMVuCIHiYiPYC2AlgG4Cb8+PXAFxm5mXP8xbjOP7cGPPHMK5pkNHs7OztaZqeAHAot10EsJT9v8LMEtgnoi0ARgHsYub7xM7zvA+Y+aRS6ud+MSoBGGPCMAxfAXBcbkdENo7js4NuJpkKw/AggKPMfAcRLTjntDHG9QLSE0B+6y8AbCWiyTiO3zfGtAdlq/u7tfYYAAvgd9/3xycnJ3/rtvkHgCiK7iEiCX6FiPY1m80rdQOX7aMoGiGi01IiZn5Ea/1D+fvfAMzNzW1vt9sXpJmSJNlXlba6gKScQRB8SkQ7Pc/bPTU19WvhYx1AXvOLAK455x76r4IXgXL/5wHc5JwbK/yvA7DWvp412xFmHtNaX657y2HsjTHbwjD8MRvhd5RSL8mZDgBr7Z1ZfZaI6LhS6q1hnG3UptVqPcPMC8y8Q2u90gHQarXeZuZdSqmxjToe9pwxxg/D8BKARaXU05Qz3FUZN6XUm1WOoih6I5vprc65p6r6I6/zaSEorfVzVb6KLDjnbqFWq3U4TdOFJElu7UcyWZk+AXAgY7qve01IqdPHAZzJGPDxKgA5Wa0y8xEBIOkfVUo92C+N5QDdIPp9q/Jprf22w7DW2u8BfFd0ZV0QYp/P+HhVdnr5tNa+lvXBXgGwCuDEsN3ffdvOKBHVCp5PntD0qwKAmflJrfXHNTq5YDapN+rcvIgRRdF+IjpTADigtT67yQCeIKKP/hclEP4/d4Oa8AHJwHsARm7EGBLRivDAQWY+Jay0mUQUBMFVz/MmOlQchuEqEU00m813N4OKs9F/npnnhH2L11DKsNs5t2Mj0mvY6SnsrLUXiWip2Ww+2wEQRdEoEV0alIW6gSoY8Jio5TRN752env6pLEiEGo8S0d3/VgdWAc0l33LW9KeUUi+uCxL5kVOspOZP59ye6yTJvpFlpqckK5Xi/PUUpcx8f1ny9ZPlK77vH+ql5ev0wvz8/G1ra2ufySo3UJaXHooRAF+JAgKghn0py8BEejUajcMybrKYMPOjogG7wQ9azSJmniCiX0TJOuc+HGY1azQa+5lZCcMCOOmce7nWalZGOTMzc5fv+y+kadpZTrO3/0JpOZUNuE1EsiV3llPhk/y8LKczvW5d9j9wOy6MhTEbjcZjEoCZZT2X25XXc1nhlpn5XJIkXw7KVOH3Lw+lrLRL0gfWAAAAAElFTkSuQmCC)
        no-repeat;
      background-size: 32px 32px;
    }
  }
}
</style>
