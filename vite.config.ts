import path from 'path'
import { defineConfig } from '@lark-apaas/coding-preset-vite-react'
import { DATA_VERSION } from './src/version'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/naruto-helper/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@shared': path.resolve(import.meta.dirname, 'shared'),
    },
  },
  plugins: [
    {
      name: 'html-version-inject',
      transformIndexHtml(html) {
        // 将占位符替换为实际的版本号（字符串形式，保证 JSON 安全）
        return html.replace('"__DATA_VERSION__"', JSON.stringify(DATA_VERSION))
      }
    }
  ]
})