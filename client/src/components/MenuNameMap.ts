/**
 * @Description:  根据后端传递的菜单列表，渲染对于的组件。
 * @Author: wawa
 * @Date: 2022-03-20 15:52:16
 */


import {
   FolderOpenOutlined, SmileOutlined, FileSearchOutlined, SolutionOutlined,
   UserOutlined, VerifiedOutlined, VideoCameraOutlined
} from '@ant-design/icons';
import AddUser from './AddUser/AddUser';
import MyArticle from './MyMyArticle/MyMyArticle';
import BrowserComp from './BrowserComp/BrowserComp';
import ImportComp from './ImportComp/ImportComp';
import Permission from './Permission/Permission';
import MyCollection from './MyCollection/MyCollection';
import ViewAll from './ViewAll/ViewAll';
import AdminComp from './AdminComp/AdminComp';
import SearchComp from './SearchArticle/SearchComp';
import Recommend from './Recommend/Recommend';

const menuNameMap: { [key: string]: any } = {
   "我的文献": {
      Icon: UserOutlined,
      SubComp: MyArticle
   },
   "浏览": {
      Icon: VideoCameraOutlined,
      SubComp: ViewAll
   },
   "推荐": {
      Icon: SmileOutlined,
      SubComp: Recommend
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
   "权限管理": {
      Icon: VerifiedOutlined,
      SubComp: AdminComp
   },
   "搜索": {
      Icon: FileSearchOutlined,
      SubComp: SearchComp
   }
}

export default menuNameMap