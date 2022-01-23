import React, { useEffect } from 'react';
import { Empty, Button, PageHeader } from 'antd';
import { useNavigate } from 'react-router';
import {
   useLocation
} from 'react-router';


function NotFound() {
   const history = useLocation()
   const navgate = useNavigate()

   useEffect(()=>{
      console.log(history);
   },[])

   return <div>
      <PageHeader
         style={{ marginLeft: "1rem" }}
         onBack={()=>navgate("/home")}
         title="主页"
      />
      <Empty>页面没找到哦</Empty>
      {/* <Button onClick={() => navgate("/home")} style={{ marginTop: "5rem" }} type="primary">
         返回主页
      </Button> */}
   </div>;
}

export default NotFound;
