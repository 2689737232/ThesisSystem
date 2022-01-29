import { request } from "./base";
import {AxiosResponse} from "axios";


type MenuListType = {
   [key:string]:any
   code:number,
   data: {
      [key:string]:any
      data:{}
   }
}
export async function getMenuList():Promise<AxiosResponse<any> | void> {
   return await request.get("user/menu", {
      headers: {
         "Authorization": localStorage.getItem("user") || ""
      }
   }).catch(() => { })
}