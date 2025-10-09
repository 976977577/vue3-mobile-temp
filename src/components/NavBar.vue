<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { useRouter } from 'vue-router'

export interface NavBarProps {
  /** 导航栏标题 */
  title?: string
  /** 是否固定在顶部 */
  fixed?: boolean
  /** 是否显示左侧返回箭头 */
  leftArrow?: boolean
  /** 左侧文本 */
  leftText?: string
  /** 右侧文本 */
  rightText?: string
  /** 是否显示占位符 */
  placeholder?: boolean
  /** 是否可点击 */
  clickable?: boolean
  /** z-index 层级 */
  zIndex?: number
  /** 是否显示底部边框 */
  border?: boolean
  /** 背景是否透明 */
  transparent?: boolean
  /** 自定义样式 */
  customStyle?: CSSProperties
  /** 自定义类名 */
  customClass?: string
  /** 是否启用默认返回行为 */
  enableDefaultBack?: boolean
  /** 是否开启顶部安全区域 */
  safeAreaInsetTop?: boolean
}

const props = withDefaults(defineProps<NavBarProps>(), {
  title: '',
  fixed: true,
  leftArrow: true,
  leftText: '',
  rightText: '',
  placeholder: true,
  clickable: true,
  zIndex: 1,
  border: false,
  transparent: false,
  customStyle: () => ({}),
  customClass: '',
  enableDefaultBack: true,
  safeAreaInsetTop: true
})

const emit = defineEmits<{
  clickLeft: [event: MouseEvent]
  clickRight: [event: MouseEvent]
}>()

const router = useRouter()

/**
 * 处理左侧点击事件
 */
function handleClickLeft(event: MouseEvent) {
  emit('clickLeft', event)

  // 如果启用默认返回行为且没有被阻止
  if (props.enableDefaultBack && !event.defaultPrevented) {
    if (window.history.state?.back) {
      history.back()
    }
    else {
      router.replace('/')
    }
  }
}

function handleClickRight(event: MouseEvent) {
  emit('clickRight', event)
}
</script>

<template>
  <VanNavBar
    class="malan-nav-bar"
    :class="[
      { 'malan-nav-bar--transparent': props.transparent },
      props.customClass,
    ]"
    :title="props.title"
    :fixed="props.fixed"
    :left-arrow="props.leftArrow"
    :left-text="props.leftText"
    :right-text="props.rightText"
    :placeholder="props.placeholder"
    :clickable="props.clickable"
    :z-index="props.zIndex"
    :border="props.border && !props.transparent"
    :style="props.customStyle"
    :safe-area-inset-top="props.safeAreaInsetTop"
    @click-left="handleClickLeft"
    @click-right="handleClickRight"
  >
    <!-- 左侧插槽 -->
    <template #left>
      <slot name="left">
        <van-icon v-if="props.leftArrow" name="arrow-left" color="#151515" size="20" />
        <span v-if="props.leftText">{{ props.leftText }}</span>
      </slot>
    </template>

    <!-- 标题插槽 -->
    <template #title>
      <slot name="title">
        <span v-if="props.title">{{ props.title }}</span>
      </slot>
    </template>

    <!-- 右侧插槽 -->
    <template #right>
      <slot name="right">
        <span v-if="props.rightText">{{ props.rightText }}</span>
      </slot>
    </template>
  </VanNavBar>
</template>

<style scoped lang="less">
.malan-nav-bar {
  span {
    font-weight: 600;
    font-size: 34px;
    color: #151515;
  }
  &.malan-nav-bar--transparent {
    :deep(.van-nav-bar) {
      background: transparent !important;
    }
  }
}
</style>
