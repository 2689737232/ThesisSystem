import React from 'react';
import { Row, Col, Input, Button, Popconfirm, message } from 'antd';
import "./TopBar.less"
import { logOut } from '@/util/user';
const { Search } = Input;
import { useNavigate } from "react-router";

type TopBarProps = {
   userName: string
}

function TopBar(props: TopBarProps) {
   const navigate = useNavigate()

   function onSearch() {
      console.log("搜索中");
   }

   function confirm() {
      if (logOut()) {
         

         message.success('退出成功');
         navigate("/login");
      }
   }



   return <div className='top-bar'>
      <Row>
         <Col xs={5} sm={7} md={5} lg={5} xl={7}>
            欢迎, {props.userName}
         </Col>
         <Col xs={0} sm={3} md={3} lg={3} xl={6}>
         </Col>
         <Col className='input-col' xs={13} sm={12} md={12} lg={12} xl={9}>
            <Search placeholder='搜索文献' onSearch={onSearch} className='serach-comp'></Search>
         </Col>
         <Col xs={1} sm={2} md={2} lg={2} xl={1}>
            <Popconfirm
               title="确定退出吗？"
               onConfirm={confirm}
               okText="确认"
               cancelText="取消"
            >
               <Button>退出登录</Button>
            </Popconfirm>
         </Col>
      </Row>
   </div>
}

export default TopBar;
