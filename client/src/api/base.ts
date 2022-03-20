import axios from "axios";

const DEV_BASE_URL = "/api/v1";
const PROD_BASE_URL = "生产环境地址";

export type ResultTemp = {
   code: number,
   data: any,
   message: string
}

function getCookie(cookieName: string): string {
   let cookieValue = "";
   if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
         const cookie = cookies[i].trim();
         // Does this cookie string begin with the name we want?
         if (cookie.substring(0, cookieName.length + 1) === (cookieName + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(cookieName.length + 1));
            break;
         }
      }
   }
   return cookieValue;
}

export const request = axios.create({
   baseURL: import.meta.env.MODE === "development" ? DEV_BASE_URL : PROD_BASE_URL, // vite配置生产环境下的地址
   headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      // "Authorization": localStorage.getItem("user") || ""  // 一定需要在退出登录的时候重新刷新页面将内存中的request清除掉,否则在页面没有关闭的情况下，重新登录其他人的账号，而token还是之前用户的。
   },
   timeout: 5000
})


function requestErrorHandler(error: any) {
   if (import.meta.env.MODE === "development") {
      console.log("请求拦截器截取到错误: ", error);
   }
}
// 添加请求拦截器，用于每次请求动态的从localstorage中获取token
request.interceptors.request.use(function (config) {
   const token = localStorage.getItem("user") || ""
   config.headers = {
      ...config.headers,
      "Authorization": token,
      "X-CSRFToken": getCookie("csrftoken"),
   }
   return config
}, requestErrorHandler)