import { request } from "./base";

export async function login(userNo: string, password: string, catchFunc?: (reason: any) => void) {
   if (!catchFunc) catchFunc = () => { }
   return await request.post("user/auth", {
      userNo,
      password
   }).catch(catchFunc)
}
