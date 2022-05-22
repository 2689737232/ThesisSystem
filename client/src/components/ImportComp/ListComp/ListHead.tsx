import { Checkbox } from 'antd';
import "./ListHead.less"

export default function ListHead() {
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
   return (
      <thead>
         <tr>
            {headList.map(item => <th key={item.id} className={`${item.class} head-item`}>{item.comp ? item.comp : item.name}</th>)}
         </tr>
      </thead>
   )
}