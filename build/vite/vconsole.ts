import path from 'node:path'
import { viteVConsole } from 'vite-plugin-vconsole'

export function createViteVConsole(command: 'build' | 'serve') {
  return viteVConsole({
    entry: [path.resolve('src/main.ts')],
    localEnabled: command === 'serve',
    enabled: command === 'serve',
    config: {
      maxLogNumber: 1000,
      theme: 'light',
    },
    dynamicConfig: {
      theme: `document.documentElement.classList.contains('dark') ? 'dark' : 'light'`,
    },
    eventListener: `
      const targetElement = document.querySelector('html'); // 选择要监听的元素
      const observerOptions = {
        attributes: true, // 监听属性变化
        attributeFilter: ['class'] // 只监听class属性变化
      };

      // 定义回调函数来处理观察到的变化
      function handleAttributeChange(mutationsList) {
        for(let mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (window && window.vConsole) {
              window.vConsole.dynamicChange.value = new Date().getTime();
            }
          }
        }
      }

      // 创建观察者实例并传入回调函数
      const observer = new MutationObserver(handleAttributeChange);

      // 开始观察目标元素
      observer.observe(targetElement, observerOptions);

      // 当不再需要观察时，停止观察
      // observer.disconnect();
    `,
  })
}
