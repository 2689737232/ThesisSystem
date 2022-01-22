import { request } from "./base";

export async function login(userNo: string, password: string) {
   return await request.post("user/auth", {
      userNo,
      password
   }).catch((err)=>{
      console.log("请求错误", err);
   })
}
