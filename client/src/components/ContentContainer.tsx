import { message, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { setActiveMenu, setMenuQueue } from '../features/menuSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import MyArticle from './ArticleComp/MyMyArticle';
import { MenuType } from './MenuComp/MenuComp';
import menuNameMap from './MenuNameMap';
const { TabPane } = Tabs;



function ContentContainer() {
   const menuList = useAppSelector(state => state.menu.value)
   const activateMenu = useAppSelector(state => state.menu.active)
   const dispatch = useAppDispatch()
   const [activeKey, setActiveKey] = useState(activateMenu?.code)


   useEffect(() => {
      setActiveKey(activateMenu?.code)
   }, [activateMenu])

   function remove(targetKey: string) {
      let newActiveKey: string | undefined = activeKey;
      let lastIndex = 0;
      menuList.forEach((item, i) => {
         if (item.code === targetKey) {
            lastIndex = i - 1;
         }
      });
      const newPaneList: MenuType[] = menuList.filter(item => item.code !== targetKey);
      if (newPaneList.length && newActiveKey === targetKey) {
         if (lastIndex >= 0) {
            newActiveKey = newPaneList[lastIndex].code;
            dispatch(setActiveMenu(newPaneList[lastIndex]))
         } else {
            dispatch(setActiveMenu(newPaneList[0]))
            newActiveKey = newPaneList[0].code;
         }
      }
      dispatch(setMenuQueue(newPaneList))
      setActiveKey(newActiveKey)
   };
   const actions: { [key: string]: any } = { remove }

   function onChange(activeKey: string) {
      if (activeKey !== "unselected") {
         setActiveKey(activeKey)
         dispatch(setActiveMenu(menuList.find(menu => menu.code === activeKey)))
      }
   }
   function onEdit(targetKey: any, action: string) {
      actions[action](targetKey);
   }

   function genPanes() {
      const result = menuList.map(menu => {
         const SubComp = menuNameMap[menu.name].SubComp
         return <TabPane tab={menu.name} key={menu.code} closable>
            {<SubComp />}
         </TabPane>
      })
      if (result.length === 0) {
         return (<TabPane tab={"选择一个菜单"} key={"unselected"} closable={false}>
            还没有选择一个菜单哦
         </TabPane>)
      } else {
         return result
      }
   }


   return (
      <div className='content-container'>
         <Tabs
            hideAdd
            type="editable-card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={onEdit}
         >
            {genPanes()}
         </Tabs>
      </div>
   );
}

export default ContentContainer;
