import React from 'react'
let adminSite = ""
if(import.meta.env.MODE === "development") adminSite = "http://localhost:8000/admin/"
else adminSite = "上线地址"
function AdminComp() {
  return (
    <div>
       <h2>权限管理</h2>
       <h4>管理员账户： admin</h4>
       <h4>密码：123456</h4>
       <p>
          <a href={adminSite} target="_blank">访问管理站点</a>
       </p>
    </div>
  )
}

export default AdminComp