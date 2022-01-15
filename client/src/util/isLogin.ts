export default function () {
   const user = localStorage.getItem("user")
   return !!user;
}