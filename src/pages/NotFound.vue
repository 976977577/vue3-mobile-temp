<script setup lang="ts">
import { useRouter } from 'vue-router'

// 页面元数据
defineOptions({
  name: 'NotFound',
})

const router = useRouter()

// 返回首页
function goHome() {
  router.push('/')
}

// 返回上一页
function goBack() {
  if (window.history.length > 1) {
    router.go(-1)
  }
  else {
    router.push('/')
  }
}
</script>

<template>
  <div class="not-found-container">
    <div class="content">
      <div class="error-section">
        <div class="error-icon">
          <van-icon name="warning-o" size="80" color="#ff6b6b" />
        </div>
        <h1 class="error-code glitch" data-text="404">
          404
        </h1>
        <h2 class="error-title">
          页面未找到
        </h2>
        <p class="error-message">
          抱歉，您访问的页面不存在或已被移除
        </p>
      </div>

      <div class="suggestions">
        <div class="suggestion-item">
          <van-icon name="info-o" size="16" color="#1989fa" />
          <span>请检查网址是否正确</span>
        </div>
        <div class="suggestion-item">
          <van-icon name="replay" size="16" color="#1989fa" />
          <span>稍后再试或刷新页面</span>
        </div>
        <div class="suggestion-item">
          <van-icon name="home-o" size="16" color="#1989fa" />
          <span>返回首页继续浏览</span>
        </div>
      </div>

      <div class="actions">
        <van-button
          type="primary"
          size="large"
          round
          block
          @click="goHome"
        >
          返回首页
        </van-button>
        <van-button
          type="default"
          size="large"
          round
          block
          class="mt-3"
          @click="goBack"
        >
          返回上页
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    justify-content: center;
  }

  .error-section {
    text-align: center;
    margin-bottom: 40px;

    .error-icon {
      margin-bottom: 20px;
    }

    .error-code {
      font-size: 72px;
      font-weight: bold;
      color: #ff6b6b;
      margin: 0 0 10px 0;
      text-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
      position: relative;

      &.glitch {
        animation: glitch 3s ease-in-out infinite;

        &::before,
        &::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        &::before {
          animation: glitch-1 3s ease-in-out infinite;
          color: rgba(255, 0, 64, 0.7);
          z-index: -1;
        }

        &::after {
          animation: glitch-2 3s ease-in-out infinite;
          color: rgba(0, 255, 255, 0.7);
          z-index: -2;
        }
      }
    }

    .error-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 10px 0;
    }

    .error-message {
      font-size: 16px;
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
  }

  .suggestions {
    width: 100%;
    max-width: 320px;
    margin-bottom: 40px;

    .suggestion-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 8px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);

      span {
        margin-left: 8px;
        color: #666;
        font-size: 14px;
      }
    }
  }

  .actions {
    width: 100%;
    max-width: 280px;

    .mt-3 {
      margin-top: 12px;
    }
  }
}

// 404数字的优雅故障效果动画
@keyframes glitch {
  0%,
  85%,
  100% {
    transform: translate(0);
  }
  87% {
    transform: translate(-2px, 1px);
  }
  89% {
    transform: translate(2px, -1px);
  }
  91% {
    transform: translate(-1px, -2px);
  }
  93% {
    transform: translate(1px, 2px);
  }
  95% {
    transform: translate(-2px, -1px);
  }
  97% {
    transform: translate(2px, 1px);
  }
}

@keyframes glitch-1 {
  0%,
  85%,
  100% {
    transform: translate(0);
    opacity: 0.8;
  }
  87% {
    transform: translate(-3px, 2px);
    opacity: 0.9;
  }
  89% {
    transform: translate(3px, -2px);
    opacity: 0.6;
  }
  91% {
    transform: translate(-2px, -3px);
    opacity: 0.8;
  }
  93% {
    transform: translate(2px, 3px);
    opacity: 0.9;
  }
  95% {
    transform: translate(-3px, -1px);
    opacity: 0.7;
  }
  97% {
    transform: translate(3px, 1px);
    opacity: 0.8;
  }
}

@keyframes glitch-2 {
  0%,
  85%,
  100% {
    transform: translate(0);
    opacity: 0.8;
  }
  87% {
    transform: translate(3px, -2px);
    opacity: 0.6;
  }
  89% {
    transform: translate(-3px, 2px);
    opacity: 0.9;
  }
  91% {
    transform: translate(2px, 3px);
    opacity: 0.7;
  }
  93% {
    transform: translate(-2px, -3px);
    opacity: 0.8;
  }
  95% {
    transform: translate(3px, 1px);
    opacity: 0.9;
  }
  97% {
    transform: translate(-3px, -1px);
    opacity: 0.6;
  }
}
</style>
