import axios from "axios";
import config from "../config";


const DEV_BASE_URL = "/api/v1";
const PROD_BASE_URL = "localhost:8000/api/v1";


export const request = axios.create({
   baseURL: config.environment === "dev" ? DEV_BASE_URL : PROD_BASE_URL,
   headers: {
      "X-CSRFToken": "csrftoken",
      "Authorization": localStorage.getItem("user") || ""  // 一定需要在退出登录的时候重新刷新页面将内存中的request清除掉,否则在页面没有关闭的情况下，重新登录其他人的账号，而token还是之前用户的。
   },
   timeout: 3000
})