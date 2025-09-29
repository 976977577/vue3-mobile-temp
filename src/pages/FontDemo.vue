<script setup lang="ts">
// 页面逻辑
</script>

<template>
  <div class="font-demo">
    <van-nav-bar title="字体切片演示" left-arrow @click-left="$router.back()" />
    <div class="test">
      你还计划临时决定立刻发货
    </div>
    <div class="demo-content">
      <van-cell-group title="HarmonyOS Sans 字体演示">
        <van-cell>
          <div class="font-sample font-regular">
            <h3>Regular 字重</h3>
            <p>这是 HarmonyOS Sans Regular 字体的演示文本。包含中文、English、数字123和符号！@#</p>
            <p>鸿蒙字体具有现代感和科技感，适合移动端应用使用。</p>
          </div>
        </van-cell>

        <van-cell>
          <div class="font-sample font-medium">
            <h3>Medium 字重</h3>
            <p>这是 HarmonyOS Sans Medium 字体的演示文本。包含中文、English、数字456和符号$%^</p>
            <p>中等字重适合标题和重要信息的展示。</p>
          </div>
        </van-cell>

        <van-cell>
          <div class="font-sample font-bold">
            <h3>Bold 字重</h3>
            <p>这是 HarmonyOS Sans Bold 字体的演示文本。包含中文、English、数字789和符号&*()</p>
            <p>粗体字重适合强调和突出显示重要内容。</p>
          </div>
        </van-cell>
      </van-cell-group>

      <van-cell-group title="字体切片优势">
        <van-cell>
          <div class="advantage-item">
            <h4>🚀 按需加载</h4>
            <p>根据页面实际使用的字符动态加载对应的字体切片，大幅减少首次加载时间</p>
          </div>
        </van-cell>

        <van-cell>
          <div class="advantage-item">
            <h4>📦 体积优化</h4>
            <p>将完整字体文件切分为多个小文件，只加载需要的部分，显著降低网络传输成本</p>
          </div>
        </van-cell>

        <van-cell>
          <div class="advantage-item">
            <h4>⚡ 渲染性能</h4>
            <p>使用 font-display: swap 策略，确保文本内容优先显示，提升用户体验</p>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<style scoped>
.test {
  font-size: 16px;
  font-weight: 700;
}
.font-demo {
  min-height: 100vh;
  background: var(--van-gray-1);
}

.demo-content {
  padding: 16px;
}

.font-sample {
  padding: 16px 0;
}

.font-sample h3 {
  margin: 0 0 12px 0;
  color: var(--van-text-color);
}

.font-sample p {
  margin: 8px 0;
  line-height: 1.6;
  color: var(--van-text-color-2);
}

.advantage-item {
  padding: 12px 0;
}

.advantage-item h4 {
  margin: 0 0 8px 0;
  color: var(--van-primary-color);
  font-size: 16px;
}

.advantage-item p {
  margin: 0;
  line-height: 1.5;
  color: var(--van-text-color-2);
  font-size: 14px;
}

/* 字重演示类 */
.font-regular {
  font-weight: normal;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: bold;
}
</style>
