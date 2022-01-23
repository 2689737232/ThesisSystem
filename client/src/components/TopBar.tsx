import React from 'react';
import { Row, Col } from 'antd';
import "./TopBar.less"

type TopBarProps = {
   userName: string
}

function TopBar(props: TopBarProps) {
   return <div className='top-bar'>
      <Row>
         <Col xs={7} sm={7} md={7} lg={8} xl={7}>
            欢迎, {props.userName}
         </Col>
         <Col xs={10} sm={10} md={10} lg={8} xl={10}>
         </Col>
         <Col xs={7} sm={7} md={7} lg={8} xl={7}>
            搜索
         </Col>
      </Row>
   </div>
}

export default TopBar;
