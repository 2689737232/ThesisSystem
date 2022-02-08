import { PDFType, pushId, removeId, setCancelIds, setSelectedIds, setShowMask, setTargetPDF } from '@/features/importPdfSlice';
import { useAppSelector } from '@/hooks/reduxHooks';
import { UserOutlined } from '@ant-design/icons';
import { Button, Cascader, Checkbox, DatePicker, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Item from 'antd/lib/list/Item';
import { RcFile } from 'antd/lib/upload/interface';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./ListItem.less"


const options = [
   {
      value: 'Journal Article',
      label: 'Journal Article'
   }
]

function ListItem({ file, id }: PDFType) {
   const dateFormat = 'YYYY/MM/DD';
   const dispatch = useDispatch()
   const importPdf = useAppSelector(state => state.importPdf)


   function handleClick() {
      dispatch(setTargetPDF(file))
      dispatch(setShowMask(true))
   }

   function onChange(e: CheckboxChangeEvent) {
      if (e.target.checked) {
         dispatch(pushId(id))
      } else {
         dispatch(removeId(id))
      }
   }

   function cancel() {
      dispatch(setCancelIds([id]))
   }

   return (
      <tr className='bpdy-tr'>
         <td>
            <Checkbox onChange={onChange} />
         </td>
         <td>
            <Input className='input-author' placeholder="作者姓名" prefix={<UserOutlined />} />
         </td>
         <td>
            <DatePicker picker="year" />
         </td>
         <td onClick={handleClick} style={{ cursor: "pointer" }}>{file.name}</td>
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
            <Button onClick={cancel}>取消</Button>
         </td>
         <td>
            <Button type="primary">提交</Button>
         </td>
      </tr>
   );
}

export default ListItem;