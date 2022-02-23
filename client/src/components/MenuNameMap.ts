// 菜单名：菜单组件
// 配置主页菜单名对应的图标、每个菜单应用对应的子组件
import { FolderOpenOutlined, SolutionOutlined, UserOutlined, VerifiedOutlined, VideoCameraOutlined } from '@ant-design/icons';
import AddUser from './AddUser/AddUser';
import MyArticle from './MyMyArticle/MyMyArticle';
import BrowserComp from './BrowserComp/BrowserComp';
import ImportComp from './ImportComp/ImportComp';
import Permission from './Permission/Permission';
import MyCollection from './MyCollection/MyCollection';
import ViewAll from './ViewAll/ViewAll';
import AdminComp from './AdminComp/AdminComp';

const menuNameMap: { [key: string]: any } = {
   "我的文献": {
      Icon: UserOutlined,
      SubComp: MyArticle
   },
   "浏览": {
      Icon: VideoCameraOutlined,
      SubComp: ViewAll
   },
   // "收藏": {
   //    Icon: FolderOpenOutlined,
   //    SubComp: MyCollection,
   // },
   // "添加用户": {
   //    Icon: UserOutlined,
   //    SubComp: AddUser
   // },
   "导入": {
      Icon: SolutionOutlined,
      SubComp: ImportComp
   },
   // "权限修改": {
   //    Icon: UserOutlined,
   //    SubComp: Permission
   // }
   "权限管理":{
      Icon: VerifiedOutlined ,
      SubComp: AdminComp
   }
}

export default menuNameMap