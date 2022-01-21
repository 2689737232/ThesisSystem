import React, { useState } from 'react'
import "./Login.less"
import {
   Row,
   Col,
   Input,
   Button,
   message
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login as apiLogin } from '@/api/login';
import ApiResponse from "../interfaces/ApiResponse"
import { useNavigate } from 'react-router';

function Login() {
   const [userNo, setUserNo] = useState<string>("")
   const [password, setPassword] = useState<string>("")
   const navigate = useNavigate()


   async function login() {
      const response = await apiLogin(userNo, password)
      const data: ApiResponse = response.data;
      if (data.code === 200) {
         message.success("登录成功！")
         localStorage.setItem("user", "登录token占位")
         navigate("/home")
      } else {
         message.error(data.message)
      }
   }

   return (
      <div className='login-container'>
         <Row className='login-form'>
            <Col className='text-box' xs={0} sm={0} md={10} lg={10} xl={12}>
               <h2>登录</h2>
               <h4>wawa论文系统，前端基于react+vite+typescript+ant design构建</h4>
               <h4> <a href="https://reactrouter.com/docs/en/v6/getting-started/overview">react-router</a></h4>
            </Col>
            <Col xs={24} sm={24} md={14} lg={14} xl={12}>
               <div className="title">欢迎使用！</div>
               <div className="input-box">
                  <Input
                     value={userNo}
                     className='input-item'
                     placeholder='请输入账号（工号、学号）'
                     prefix={<UserOutlined />}
                     onChange={e => setUserNo(e.target.value)}
                  />
                  <Input.Password
                     value={password}
                     className='input-item'
                     placeholder="请输入密码"
                     prefix={<LockOutlined />}
                     onChange={e => setPassword(e.target.value)}
                  />
                  <div className="btn-box">
                     <Button className='btn-item'>注册</Button>
                     <Button onClick={login} className='btn-item' type="primary">登录</Button>
                  </div>
               </div>
               <div className="forget-pwd">
                  <Button block>忘记密码</Button>
               </div>
            </Col>
         </Row>
      </div>
   )
}

export default Login
