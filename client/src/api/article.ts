/**
 * @Description:  获取文章数据
 * @Author: wawa
 * @Date: 2022-02-18 13:47:43
 */

import { message } from "antd";
import { request } from "./base"

// 1为我的，2为所有,3为收藏,4为搜索，5为推荐
export type ArticlesType = 1 | 2 | 3 | 4 | 5;

export type RequestArticleParams = {
   [key: string]: any;
   articlesType: ArticlesType;
   page: number;  // 第几页
   size: number;  // 一页多少条数据
   keyWords?: string
}

export async function getArticles(params: RequestArticleParams, errorCB?: Function) {
   let result = request.get("/user/pdf", {
      params
   })
   result.catch((err) => {
      if (errorCB) errorCB(err)
   })
   return await result
}


// 获取页面总数
export async function getArticlesCount(articlesType: ArticlesType) {
   return await request.get("/user/pdfpages", {
      params: {
         articlesType: articlesType
      }
   })
}

// 浏览文章
export async function viewArticle(articleId: string) {
   const fomrData = new FormData()
   fomrData.append("pdfId", articleId)
   return await request.post("/user/history", fomrData, {
      headers: {
         'content-type': 'application/x-www-form-urlencoded'
      }
   })
}


// 搜索文章
export async function searchArticle(keyWords: string) {
   return await request.get("/user/search", {
      params: {
         keyWords
      }
   })
}