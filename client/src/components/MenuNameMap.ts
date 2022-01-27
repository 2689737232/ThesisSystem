// 菜单名：菜单组件
// 配置主页菜单名对应的图标、每个菜单应用对应的子组件
import { SolutionOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import React, { ReactNode } from 'react';
import AddUser from './AddUser/AddUser';
import MyArticle from './ArticleComp/MyMyArticle';
import BrowserComp from './BrowserComp/BrowserComp';
import ImportComp from './ImportComp/ImportComp';
import Permission from './Permission/Permission';
import RecycleComp from './RecycleComp/RecycleComp';

const menuNameMap: { [key: string]: any } = {
   "我的文献": {
      Icon: UserOutlined,
      SubComp: MyArticle
   },
   "浏览": {
      Icon: VideoCameraOutlined,
      SubComp: BrowserComp
   },
   "回收站": {
      Icon: UploadOutlined,
      SubComp: RecycleComp
   },
   "添加用户": {
      Icon: UserOutlined,
      SubComp: AddUser
   },
   "导入": {
      Icon: SolutionOutlined,
      SubComp: ImportComp
   },
   "权限修改": {
      Icon: UserOutlined,
      SubComp: Permission
   }
}

export default menuNameMap