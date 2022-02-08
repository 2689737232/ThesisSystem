import { setTargetPDF } from '@/features/importPdfSlice';
import { useAppSelector } from '@/hooks/reduxHooks';
import { UserOutlined } from '@ant-design/icons';
import { Button, Cascader, Checkbox, DatePicker, Input } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./ListItem.less"

type ListItemType = {
   item: RcFile
}
const options = [
   {
      value: 'Journal Article',
      label: 'Journal Article'
   }
]

function ListItem({ item }: ListItemType) {
   const dateFormat = 'YYYY/MM/DD';
   
   const dispatch = useDispatch()

   

   function handleClick() {
      console.log("td点击了");
      
      dispatch(setTargetPDF(item))
   }

   return (
      <tr className='bpdy-tr'>
         <td>
            <Checkbox />
         </td>
         <td>
            <Input className='input-author' placeholder="作者姓名" prefix={<UserOutlined />} />
         </td>
         <td>
            <DatePicker picker="year" />
         </td>
         <td onClick={handleClick} style={{ cursor: "pointer" }}>{item.name}</td>
         <td>
            <Input className='input-periodical' placeholder="输入期刊" />
         </td>
         <td>
            <DatePicker defaultValue={moment(new Date(), dateFormat)} format={dateFormat} />
         </td>
         <td>
            <Cascader defaultValue={['Journal Article']} options={options} placeholder="请选择"></Cascader>
         </td>
         <td>
            <Button>取消</Button>
         </td>
         <td>
            <Button type="primary">提交</Button>
         </td>
      </tr>
   );
}

export default ListItem;