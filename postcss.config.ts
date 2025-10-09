// 需要转换的 fixed 选择器列表
const rootContainingBlockSelectorList = [
  '.van-tabbar',
  '.van-popup',
  '.van-popup--bottom',
  '.van-popup--top',
  '.van-popup--left',
  '.van-popup--right'
  // 在这里添加你的选择器
]

export default {
  plugins: {
    'autoprefixer': {},
    // https://github.com/wswmsword/postcss-mobile-forever
    'postcss-mobile-forever': {
      appSelector: '#app',
      viewportWidth: file => file.includes('vant') ? 375 : 750,
      maxDisplayWidth: 600,
      border: true,
      rootContainingBlockSelectorList
    }
  }
}
