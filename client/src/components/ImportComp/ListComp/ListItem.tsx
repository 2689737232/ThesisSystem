import { PDFType, pushId, removeId, setCancelIds, setSelectedIds, setShowMask, setTargetPDF } from '@/features/importPdfSlice';
import { useAppSelector } from '@/hooks/reduxHooks';
import { UserOutlined } from '@ant-design/icons';
import { Button, Cascader, Checkbox, DatePicker, Input } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Item from 'antd/lib/list/Item';
import { RcFile } from 'antd/lib/upload/interface';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
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
   const [datePicker, setDatePicker] = useState(moment())
   const [author, setAuthor] = useState("")
   const [periodical, setPeriodical] = useState("")
   const [lastModify, setLastModify] = useState(moment())
   const [type, setType] = useState(['Journal Article'])

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
   function datePickerChange(date: moment.Moment | null, dateString: string) {
      if (date) setDatePicker(date)
   }
   function cancel() {
      dispatch(setCancelIds([id]))
   }

   function submit(){
      console.log(datePicker);
      console.log(author);
      console.log(periodical);
      console.log(lastModify);
      console.log(type);
      console.log(file.name);
   }

   return (
      <tr className='bpdy-tr'>
         <td>
            <Checkbox onChange={onChange} />
         </td>
         <td>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} className='input-author' placeholder="作者姓名" prefix={<UserOutlined />} />
         </td>
         <td>
            <DatePicker value={datePicker} onChange={datePickerChange} picker="year" />
         </td>
         <td onClick={handleClick} style={{ cursor: "pointer" }}>{file.name}</td>
         <td>
            <Input value={periodical} onChange={(e) => setPeriodical(e.target.value)} className='input-periodical' placeholder="输入期刊" />
         </td>
         <td>
            <DatePicker value={lastModify} onChange={(date: moment.Moment | null) => date ? setLastModify(date) : null} defaultValue={moment(new Date(), dateFormat)} format={dateFormat} />
         </td>
         <td>
            <Cascader value={type} onChange={(value: string) => { setType([value]) }} options={options} placeholder="请选择"></Cascader>
         </td>
         <td>
            <Button onClick={cancel}>取消</Button>
         </td>
         <td>
            <Button onClick={submit} type="primary">提交</Button>
         </td>
      </tr>
   );
}

export default ListItem;