import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 如果报错需要npm i @types/node -D
const { resolve } = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    }
  }
})
