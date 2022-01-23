type GetUserState = {
   state: boolean;
   message: string;
   token: {
      [key: string]: any
   }
}

export function getUserInfo(): GetUserState {
   const result: GetUserState = {
      state: false,
      token: {},
      message: "没有token"
   }
   const tokenStr = localStorage.getItem("user");
   if (!tokenStr) return result
   const tokenObj = JSON.parse(decodeURIComponent(escape(window.atob(tokenStr.split('.')[1]))))
   result.token = tokenObj
   result.state = true
   return result
}