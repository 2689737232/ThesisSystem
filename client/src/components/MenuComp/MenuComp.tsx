import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { CopyOutlined, SolutionOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./MenuComp.less"
import MyArticle from '../ArticleComp/MyMyArticle';
import { getMenuList } from '@/api/menu';


type MenuComp = {
   className: string
}
const menuNameMap: { [key: string]: any } = {
   "我的文献": <UserOutlined />,
   "浏览": <VideoCameraOutlined />,
   "回收站": <UploadOutlined />,
   "添加用户": <UserOutlined />,
   "导入": <SolutionOutlined />
}

type MenuListType = Array<{ code: string, id: number, name: string }>
function MenuComp(props: MenuComp) {

   const [menuList, setMenuList] = useState<MenuListType>([]);

   // 获取用户菜单组件
   useEffect(() => {
      async function inner() {
         const { data: { code, data } } = await getMenuList()
         console.log(data);
         
         if (code === 200) {
            setMenuList(data.menus)
         }
      }
      inner()
   }, [])

   function genMenuItems() {
      return menuList.map(item => {
        return <Menu.Item key={item.id} icon={menuNameMap[item.name] || <CopyOutlined />}>
            {item.name}
         </Menu.Item>
      })
   }


   return <div className={props.className}>
      <Menu style={{ height: "100%" }} mode="inline" defaultSelectedKeys={['1']}>
         {genMenuItems()}
      </Menu>
   </div>;
}

export default MenuComp;
