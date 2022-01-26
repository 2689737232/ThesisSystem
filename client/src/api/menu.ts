import { request } from "./base";

export async function getMenuList() {
   return await request.get("user/menu").catch(() => { })
}