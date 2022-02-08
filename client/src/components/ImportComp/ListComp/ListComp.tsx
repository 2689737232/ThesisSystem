import React from 'react';
import { PDFType } from '../ImportComp';
import { Button, Checkbox, Divider } from 'antd';
import { spawn } from 'child_process';
import "./ListComp.less";
import ListItem from './ListItem';


type ListComp = {
   originPdfs: PDFType[]
}
const headList = [
   {
      id: "title1",
      name: "选中",
      class: "header-select",
      comp: <div> <Checkbox />选中</div>
   },
   {
      id: "title2",
      name: "作者",
      class: "header-author"
   },
   {
      id: "title3",
      name: "年份",
      class: "header-year"
   },
   {
      id: "title4",
      name: "标题",
      class: "header-title"
   },
   {
      id: "title5",
      name: "期刊",
      class: "header-periodical"
   },
   {
      id: "title6",
      name: "最后更新",
      class: "header-last-modify"
   },
   {
      id: "title7",
      name: "文献类型",
      class: "header-type"
   }
]

function ListComp({ originPdfs }: ListComp) {
   function genHead() {
      return headList.map(item => <th key={item.id} className={`${item.class} head-item`}>{item.comp ? item.comp : item.name}</th>)
   }

   function genBody() {
      return originPdfs.map(item => <ListItem item={item.file} key={item.id} />)
   }

   if (!originPdfs || originPdfs.length === 0) return <div></div>
   return <div className='wrapper-list'>
      <div className='list-comp'>
         <table style={{ borderCollapse: "separate", borderSpacing: "0px 10px" }}>
            <thead>
               <tr>
                  {genHead()}
               </tr>
            </thead>
            <tbody>
               {genBody()}
            </tbody>
         </table>
      </div>
      <Button className='submit-btn-all'>提交所有</Button>
   </div>;
}

export default ListComp;
