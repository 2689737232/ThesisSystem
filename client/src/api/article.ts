/**
 * @Description:  获取文章数据
 * @Author: wawa
 * @Date: 2022-02-18 13:47:43
 */

import { request } from "./base"

export type ArticlesType = 1 | 2 | 3;

export type RequestArticleParams = {
   [key: string]: any;
   articlesType: ArticlesType;   // 1为我的，2为所有,3为收藏
   page: number;  // 第几页
   size: number;  // 一页多少条数据
}

export async function getArticles(params: RequestArticleParams, errorCB?: Function) {
   const result = request.get("/user/pdf", {
      params: {
         articlesType: params.articlesType,
         page: params.page,
         size: params.size
      }
   })
   result.then((err) => {
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
