import { useEffect } from "react";
import { useNavigate } from "react-router";
import isLogin from "../util/isLogin";

/**
 * 判断登录hook，否则跳转到login
 */
export default function(){
   const navigate = useNavigate()
   useEffect(() => {
      if(!isLogin()) navigate("/login")
   }, [])
}