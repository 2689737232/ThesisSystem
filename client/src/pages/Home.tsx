import React, { useEffect, useState } from 'react'
import useLogin from '../hooks/useLogin'
import { Layout, Menu, message } from 'antd';
import "./Home.less"
import TopBar from '../components/TopBar/TopBar';
import { getUserInfo, GetUserState } from '../util/user';
import MenuComp from '../components/MenuComp/MenuComp';
import ContentContainer from '../components/ContentContainer/ContentContainer';
import { tokenVerification } from '../api/login';
import { useNavigate } from 'react-router';
const { Header, Content, Sider } = Layout;


function Home() {
   useLogin()
   const [userName, setUserName] = useState("")
   const [leftCollapsed, setLeftCollapsed] = useState(false)
   const [rightollapsed, setRightollapsed] = useState(false)
   const [currentPage, setCurrentPage] = useState(1)
   const navigate = useNavigate();

   function pageChange(p: number) {
      setCurrentPage(p)
   }

   useEffect(() => {
      async function inner() {
         const { state, message: msg, token } = await getUserInfo()
         if (state) {
            if (token?.data?.username) setUserName(token.data.username)
            else setUserName("")
         } else {
            message.error(msg);
            navigate("/login")
         }
      }
      inner()
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
            >
               <div className="logo" />
               <MenuComp className='left-menu'></MenuComp>
            </Sider>
            <Layout className='layout-comp'>
               <Content style={{ margin: '24px 16px 0' }}>
                  <div className="site-layout-background" style={{ padding: 24, height: "100%" }}>
                     <ContentContainer></ContentContainer>
                  </div>
               </Content>
            </Layout>
         </Layout>
      </Layout>
   )
}

export default Home
function userState(): Iterable<any> {
   throw new Error('Function not implemented.');
}

