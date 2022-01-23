import React from 'react';
import { Row, Col, Input } from 'antd';
import "./TopBar.less"
const { Search } = Input;

type TopBarProps = {
   userName: string
}

function TopBar(props: TopBarProps) {

   function onSearch(){
      console.log("搜索中");
   }

   return <div className='top-bar'>
      <Row>
         <Col xs={7} sm={7} md={7} lg={8} xl={7}>
            欢迎, {props.userName}
         </Col>
         <Col xs={2} sm={6} md={6} lg={6} xl={8}>
         </Col>
         <Col className='input-col' xs={15} sm={11} md={11} lg={10} xl={7}>
            <Search placeholder='搜索文献' onSearch={onSearch} className='serach-comp'></Search>
         </Col>
      </Row>
   </div>
}

export default TopBar;
