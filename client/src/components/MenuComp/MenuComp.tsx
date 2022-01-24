import React from 'react';
import { Menu } from 'antd';
import { SolutionOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./MenuComp.less"
import MyArticle from '../ArticleComp/MyMyArticle';

type MenuComp = {
   className: string
}

function MenuComp(props: MenuComp) {
   return <div className={props.className}>
      <Menu style={{ height: "100%" }} mode="inline" defaultSelectedKeys={['1']}>
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
         <Menu.Item key="5" icon={<SolutionOutlined />}>
            导入
         </Menu.Item>
      </Menu>
   </div>;
}

export default MenuComp;
