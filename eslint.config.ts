import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: {
      overrides: {
        // 自定义 Vue 文件中标签的顺序，模板 -> 脚本 -> 样式
        'vue/block-order': ['error', {
          order: ['template', 'script', 'style'],
        }],
        'vue/component-name-in-template-casing': ['error', 'kebab-case', {
          registeredComponentsOnly: false, // 对所有组件生效（包括未显式注册的）
          ignores: [], // 无需忽略的组件
        }],
      },
    },
    typescript: true,
    formatters: {
      css: true,
    },
  },
  {
    rules: {
      'unused-imports/no-unused-vars': 'off',
      'no-console': 'off',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-exports': 'off',
    },
  },
  {
    ignores: [
      '.github/**',
      'scripts/**',
      'src/assets/iconfont/**',
    ],
  },
)
