import { tokenVerification } from "../api/login";



export type GetUserState = {
   state: boolean;
   message: string;
   token: {
      [key: string]: any
   }
}

/**
 *  从localstorage中获取token
 */
export async function getUserInfo(): Promise<GetUserState> {
   const result: GetUserState = {
      state: false,
      token: {},
      message: "还没登录"
   }
   const tokenStr = localStorage.getItem("user");
   if (!tokenStr) return result
   // 网络请求验证token
   const { data } = await tokenVerification(tokenStr)
   if (data.code === 200) {
      const tokenObj = JSON.parse(decodeURIComponent(escape(window.atob(tokenStr.split('.')[1]))))
      result.token = tokenObj
      result.state = true
   } else {
      result.message = "token验证失败"
   }

   return result
}


export function logOut() {
   localStorage.removeItem("user")
   return true
}