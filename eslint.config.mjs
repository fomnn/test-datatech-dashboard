// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  jsx: true,
  stylistic: {
    quotes: 'single',
    semi: false,
  },
  ignores: [
    'README.md',
  ],
})
