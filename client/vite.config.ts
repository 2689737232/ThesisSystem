// @ts-ignore
import dotenv from "dotenv"
dotenv.config()

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 如果报错需要npm i @types/node -D
const { resolve } = require("path");

const environment = process.env.environment;


console.log(environment);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    }
  }
})
