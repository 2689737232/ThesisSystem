import React, { useEffect, useState } from 'react'
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
import ApiResponse from "../type/ApiResponse"
import { useNavigate } from 'react-router';

function Login() {
   const [userNo, setUserNo] = useState<string>("")
   const [password, setPassword] = useState<string>("")
   const [isLogin, setIsLogin] = useState(true)
   const [registerNo, setRegisterNo] = useState("")
   const [registerPassword, setRegisterPassword] = useState("")
   const [registerRePassword, setRegisterRePassword] = useState("")

   const navigate = useNavigate()

   useEffect(() => {
      window.onkeydown = function (e) {
         if (e.key === "Enter") {
            login()
         }
      }
   }, [])

   async function login() {
      if (userNo.length === 0 || password.length === 0) {
         message.error("请输入完整！")
         return false;
      }
      const response = await apiLogin(userNo, password)
      if (!response) return
      const data: ApiResponse = response.data;
      if (data.code === 200 && data.data) {
         message.success("登录成功！")
         if (data.data.token) {
            localStorage.setItem("user", data.data.token)
            navigate("/home")
         } else {
            message.error("登录成功，但是token获取失败！")
         }
      } else {
         message.error(data.message)
      }
   }

   async function register() {
      if (registerNo.length < 11) message.error("用户账户需要大于等于11位")
      if (registerPassword.length < 10) {
         message.error("用户密码需要大于等于10位")
         return false
      }
      if (registerPassword !== registerRePassword) message.error("两次输入密码不一样")

   }
   return (
      <div className='login-container'>
         {
            isLogin ?
               (<Row className={'login-form'}>
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
                           {/* <Button onClick={() => setIsLogin(!isLogin)} className='btn-item'>注册</Button> */}
                           <Button onClick={login} className='btn-item' type="primary">登录</Button>
                        </div>
                     </div>
                     <div className="forget-pwd">
                        <Button block>忘记密码</Button>
                     </div>
                  </Col>
               </Row>) :
               (<Row className={'register-box'}>
                  <Col xs={14} sm={14} md={14} lg={14} xl={12}>
                     <div className="input-box">
                        <Input
                           value={registerNo}
                           className='input-item'
                           placeholder='请输入账号（工号、学号）'
                           prefix={<UserOutlined />}
                           onChange={e => setRegisterNo(e.target.value)}
                        />
                        <Input.Password
                           value={registerPassword}
                           className='input-item'
                           placeholder="输入注册密码"
                           prefix={<LockOutlined />}
                           onChange={e => setRegisterPassword(e.target.value)}
                        />
                        <Input.Password
                           value={registerRePassword}
                           className='input-item'
                           placeholder="重新输入注册密码"
                           prefix={<LockOutlined />}
                           onChange={e => setRegisterRePassword(e.target.value)}
                        />
                        <div className="btn-box">
                           <Button onClick={register} className='btn-item' type="primary">注册</Button>
                           <Button onClick={() => setIsLogin(!isLogin)} className='btn-item'>返回</Button>
                        </div>
                     </div>
                  </Col>
               </Row>)
         }
      </div>
   )
}

export default Login
