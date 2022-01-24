import { Tabs } from 'antd';
import React, { useState } from 'react';
import MyArticle from './ArticleComp/MyMyArticle';
const { TabPane } = Tabs;

const initialPanes = [
   { title: '我的文献', content: <MyArticle></MyArticle>, key: '1' },
   { title: '浏览', content: <input type="text" />, key: '2' },
   { title: '回收站', content: '回收站', key: '3' },
   { title: '添加用户', content: '添加用户', key: '4' },
   { title: '导入', content: '导入', key: '5' }
];

function ContentContainer() {
   let newTabIndex = 0;
   const [activeKey, setActiveKey] = useState(initialPanes[0].key)
   const [panes, setPanes] = useState(initialPanes)

   function add() {
      const activeKey = `newTab${newTabIndex++}`;
      const newPanes = [...panes];
      newPanes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey });
      setPanes(newPanes)
      setActiveKey(activeKey)
   };
   function remove(targetKey: string) {
      let newActiveKey = activeKey;
      let lastIndex = 0;
      panes.forEach((pane, i) => {
         if (pane.key === targetKey) {
            lastIndex = i - 1;
         }
      });
      const newPanes = panes.filter(pane => pane.key !== targetKey);
      if (newPanes.length && newActiveKey === targetKey) {
         if (lastIndex >= 0) {
            newActiveKey = newPanes[lastIndex].key;
         } else {
            newActiveKey = newPanes[0].key;
         }
      }
      setPanes(newPanes)
      setActiveKey(newActiveKey)
   };
   const actions: { [key: string]: any } = { add, remove }


   function onChange(activeKey: string) {
      setActiveKey(activeKey)
   }

   function onEdit(targetKey: any, action: string) {
      console.log(targetKey, action);
      actions[action](targetKey);
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
            {panes.map(pane => (
               <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                  {pane.content}
               </TabPane>
            ))}
         </Tabs>
      </div>
   );
}

export default ContentContainer;
