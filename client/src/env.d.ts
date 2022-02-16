/**
 * @Description: 为vite提供ts提示
 * @Author: wawa
 * @Date: 2022-02-16 11:01:49
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
   readonly VITE_APP_TITLE: string
   // 更多环境变量...
 }
 interface ImportMeta {
   readonly env: ImportMetaEnv
 }