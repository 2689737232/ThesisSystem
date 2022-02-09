import { uploadPDF } from '@/api/upload';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { PDFType, pushId, removeId, setCancelIds, setSelectedIds, setShowMask, setTargetPDF } from '@/features/importPdfSlice';
import { useAppSelector } from '@/hooks/reduxHooks';
import { getUserInfo } from '@/util/user';
import { UserOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Cascader, Checkbox, DatePicker, Input, message, Spin } from 'antd';
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

function ListItem(pdf: PDFType) {
   const dateFormat = 'YYYY/MM/DD';
   const dispatch = useDispatch()
   const [datePicker, setDatePicker] = useState(moment())
   const [author, setAuthor] = useState("")
   const [periodical, setPeriodical] = useState("")
   const [lastModify, setLastModify] = useState(moment())
   const [type, setType] = useState(['Journal Article'])

   console.log("重新渲染");


   function handleClick() {
      dispatch(setTargetPDF(pdf.file))
      dispatch(setShowMask(true))
   }

   function onChange(e: CheckboxChangeEvent) {
      if (e.target.checked) {
         dispatch(pushId(pdf.id))
      } else {
         dispatch(removeId(pdf.id))
      }
   }
   function datePickerChange(date: moment.Moment | null, dateString: string) {
      if (date) setDatePicker(date)
   }
   function cancel() {
      dispatch(setCancelIds([pdf.id]))
   }

   async function submit() {
      const userName = localStorage.getItem("user");
      if (!userName) {
         message.error('没有用户信息，请重新登录！');
         return false
      }

      const { token } = await getUserInfo()
      const userId = token.data.no
      if (!userId) {
         message.error('没有用户信息，请重新登录！');
         return false
      }

      // 构建formData上传数据
      var formdata = new FormData();
      formdata.append("pdf", pdf.file, pdf.file.name);
      formdata.append("user", userId);
      formdata.append("author", author);
      formdata.append("year", datePicker.format("yyyy"));
      formdata.append("pdf_title", pdf.file.name);
      formdata.append("periodical", periodical);
      formdata.append("last_modify", lastModify.format("yyyy-MM-DD"));
      formdata.append("article_type", type[0]);

      // 开启加载动画
      // const result = await uploadPDF(formdata)
      // let result = { data: { code: 200, message: "" } }
      // if (result.data.code === 200) {
      //    cancel()
      //    message.success(`上传c成功`)
      // } else {
      //    message.error(`上传失败${result.data.message}`)
      // }
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
         <td onClick={handleClick} style={{ cursor: "pointer" }}>{pdf.file.name}</td>
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

/**
 * 自定义渲染规则，用于性能优化
 * 在导入的列表变多之后，取消一项之后，渲染时间过长，阻塞用户操作
 */
function areEqual(prevProps: PDFType, nextProps: PDFType) {
   return prevProps.id === nextProps.id
}

export default React.memo(ListItem, areEqual);