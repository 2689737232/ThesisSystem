/**
 * @Description:  获取文章数据
 * @Author: wawa
 * @Date: 2022-02-18 13:47:43
 */

import { request } from "./base"


export type RequestArticleParams = {
   [key: string]: any;
   articlesType: 1 | 2 | 3;   // 1为我的，2为所有,3为收藏
}

export async function getArticles(params: RequestArticleParams) {
   return await request.get("/user/pdf", {
      params: {
         articlesType: params.articlesType
      }
   })
}

