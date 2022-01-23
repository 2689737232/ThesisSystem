import React, { useEffect, useState } from 'react'
import useLogin from '../hooks/useLogin'
import { Layout, Menu, message } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./Home.less"
import TopBar from '../components/TopBar';
import { getUserInfo } from '../util/user';
const { Header, Content, Footer, Sider } = Layout;


function Home() {
   useLogin()
   const [userName, setUserName] = useState("")
   const [leftCollapsed, setLeftCollapsed] = useState(false)
   const [rightollapsed, setRightollapsed] = useState(false)

   useEffect(() => {
      const { state, message: msg, token } = getUserInfo()
      console.log(token);
      
      if (state) {
         if (token?.data?.username) setUserName(token.data.username)
         else setUserName("")
      } else {
         message.error(msg);
      }
   }, [])

   return (
      <Layout className="home-box">
         <Header style={{ padding: 0 }} className='home-header'>
            <TopBar userName={userName}></TopBar>
         </Header>

         <Layout>
            <Sider
               className='sider-item left-sider'
               breakpoint="lg"
               collapsedWidth="70"
               collapsed={leftCollapsed}
               onBreakpoint={broken => {
                  setLeftCollapsed(broken)
               }}
            // onCollapse={(collapsed, type) => {
            //    console.log(collapsed);
            //    setLeftCollapsed(!leftCollapsed)
            // }}
            >
               <div className="logo" />
               <Menu className='left-menu' mode="inline" defaultSelectedKeys={['1']}>
                  <Menu.Item key="1" icon={<UserOutlined />}>
                     我的文献
                  </Menu.Item>
                  <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                     浏览
                  </Menu.Item>
                  <Menu.Item key="3" icon={<UploadOutlined />}>
                     回收站
                  </Menu.Item>
                  <Menu.Item key="4" icon={<UserOutlined />}>
                     添加用户
                  </Menu.Item>
               </Menu>
            </Sider>
            <Layout>
               <Content style={{ margin: '24px 16px 0' }}>
                  <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                     内容区
                  </div>
               </Content>
               <Footer style={{ textAlign: 'center' }}>论文推荐</Footer>
            </Layout>
            <Sider
               className='sider-item right-sider'
               breakpoint="lg"
               collapsedWidth="0"
               collapsed={rightollapsed}
               onBreakpoint={broken => {
                  setRightollapsed(broken)
               }}
            >
            </Sider>
         </Layout>
      </Layout>
   )
}

export default Home
function userState(): Iterable<any> {
   throw new Error('Function not implemented.');
}

