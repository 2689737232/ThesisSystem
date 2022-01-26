import { message } from "antd";
import { request } from "./base";

export async function login(userNo: string, password: string, catchFunc?: (reason: any) => void) {
   if (!catchFunc) catchFunc = () => { }
   return await request.post("user/auth", {
      userNo,
      password
   }).catch((error: any) => {
      if ((error.message as string).startsWith("timeout")) message.error("请求超时请稍后重试")
   }).catch(catchFunc)
}


export async function tokenVerification(token: string): Promise<{ [key: string]: any; }> {
   return await request.post("user/token", {}, {
      headers: {
         "Authorization": token
      }
   })
}