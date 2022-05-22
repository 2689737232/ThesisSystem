import { uploadPDF } from '@/api/upload';
import { PDFType, pushId, removeId, setCancelIds, setShowMask, setTargetPDF } from '@/store/importPdfSlice';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { getUserInfo } from '@/util/user';
import { UserOutlined } from '@ant-design/icons';
import { Button, Cascader, Checkbox, DatePicker, Input, message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { pushSubmit } from '../SubmitHandler';
import "./ListItem.less"

const options = [
   {
      value: 'Journal Article',
      label: 'Journal Article'
   },
]

function ListItem(pdf: PDFType) {
   // 日期、格式
   const dateFormat = 'YYYY/MM/DD';
   const [datePicker, setDatePicker] = useState(moment())
   const [lastModify, setLastModify] = useState(moment())
   // 作者、期刊、文章类型  
   const [author, setAuthor] = useState("")
   const [periodical, setPeriodical] = useState("")
   const [type, setType] = useState(['Journal Article'])

   const dispatch = useAppDispatch()


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

   async function submit(showMessage?: boolean): Promise<boolean> {
      if (showMessage === undefined) showMessage = true // 默认显示弹出上传结果信息
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

      const result = await uploadPDF(formdata)
      if (result.data.code === 200) {
         cancel()
         if (showMessage) message.success(`上传c成功`)
         return true
      } else {
         if (showMessage) message.error(`上传失败${result.data.message}`)
         return false
      }
   }

   useEffect(() => {
      const submiteItem = {
         submit,
         id: pdf.id,
         args: [false]
      }
      pushSubmit(submiteItem)
      return () => {
         // clearItem(submiteItem)
      }
   }, [])

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
            <Cascader value={type} onChange={(value: any) => { setType([value as string]) }} options={options} placeholder="请选择" />
         </td>
         <td>
            <Button onClick={cancel}>取消</Button>
         </td>
         <td>
            <Button onClick={() => submit(true)} type="primary">提交</Button>
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