import React from 'react'
import "./Login.less"
import { Row, Col } from 'antd';

function Login() {
   return (
      <div className='login-container'>
         <Row className='login-form'> 
            <Col className='text-box' xs={0} sm={0} md={10} lg={10} xl={12}>
               <h2>登录</h2>
               <h4>wawa论文系统，前端基于react+vite+typescript+ant design构建</h4>
            </Col>
            <Col xs={24} sm={24} md={14} lg={14} xl={12}>
               right-form
            </Col>
         </Row>
      </div>
   )
}

export default Login
