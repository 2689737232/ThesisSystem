import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Divider, message, Popconfirm, Row } from 'antd';
import { spawn } from 'child_process';
import "./ListComp.less";
import ListItem from './ListItem';
import { PDFType, setCancelIds, setSelectedIds } from '@/store/importPdfSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fireAllEvents, onSubmitPush, submitEvents } from '../SubmitHandler';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import ListHead from './ListHead';
import ListBody from './ListBody';

export type ListCompProps = {
   pdfs: PDFType[]
}

function ListComp({ pdfs }: ListCompProps) {
   const importPdf = useAppSelector(state => state.importPdf)
   const dispatch = useAppDispatch()
   const [showProgress, setShowProgress] = useState(false)
   const [total, setTotal] = useState(submitEvents.length)
   const [currentNum, setCurrentNum] = useState(0)

   useEffect(() => {
      onSubmitPush(function (item: SubmitEvent, subs: SubmitEvent[]) {
         setTotal(subs.length)
         setCurrentNum(0)
      })
      return () => {
         setShowProgress(false)
      }
   }, [])



   function genBody() {
      return pdfs.map(item => <ListItem key={item.id} id={item.id} file={item.file} />)
   }

   // 取消选中
   function cancelSelected() {
      if (importPdf.selectedIds.length === 0) return
      const temp = [...importPdf.selectedIds]
      dispatch(setCancelIds(temp))
      dispatch(setSelectedIds([]))
   }

   async function submitAll() {
      setShowProgress(true)
      // 触发每一项的提交事件，完成提交所有
      const result = await fireAllEvents({
         eachSubmit: (result: boolean, item: SubmitEvent, i: number) => {
            if (result) setCurrentNum(pre => pre + 1)
         },
         afterAllSubmitted: (submiteEvent: SubmitEvent[]) => {
            message.info("全部上传完毕")
            setShowProgress(false)
            setTotal(0)
            setCurrentNum(0)
         }
      })
      if (!result) {  // 如果中断了，取消显示，重新设置
         setShowProgress(false)
         setTotal(submitEvents.length)
         setCurrentNum(0)
      }
   }


   if (!pdfs || pdfs.length === 0) return <div></div>
   return (
      <div className='wrapper-list'>
         {
            showProgress ? <ProgressBar total={total} currentNum={currentNum} /> : ""
         }
         <div className='list-comp'>
            <table style={{ borderCollapse: "separate", borderSpacing: "0px 10px" }}>
               <ListHead />
               <ListBody pdfs={pdfs} />
            </table>
         </div>
         <Row>
            <Col className='bottom-item' xs={12} sm={6} md={6} lg={6} xl={6}>
               <span className='tip-span'>总共{pdfs.length}项</span>
            </Col>
            <Col className='bottom-item' xs={12} sm={6} md={6} lg={6} xl={6}>
               <Button className='submit-btn-selected'>提交选中</Button>
            </Col>
            <Col className='bottom-item' xs={12} sm={6} md={6} lg={6} xl={6}>
               <Button onClick={cancelSelected} className='cancel-btn-selected'>取消选中</Button>
            </Col>
            <Col className='bottom-item' xs={12} sm={6} md={6} lg={6} xl={6}>
               <Popconfirm title="提交所有吗" okText="是" cancelText="否" onConfirm={submitAll}>
                  <Button className='submit-btn-all'>提交所有</Button>
               </Popconfirm>
            </Col>
         </Row>
      </div >
   );
}

export default ListComp;
