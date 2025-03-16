export default {
  plugins: {
    'autoprefixer': {},
    'postcss-mobile-forever': {
      appSelector: '#app',
      viewportWidth: 375,
      maxDisplayWidth: 600,
      border: true,
      rootContainingBlockSelectorList: ['van-tabbar', 'van-popup'],
    },
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 414,
    },
  },
}
