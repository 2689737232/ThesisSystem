import { request } from "./base";

export async function getMenuList() {
   return await request.get("user/menu", {
      headers: {
         "Authorization": localStorage.getItem("user") || ""
      }
   }).catch(() => { })
}