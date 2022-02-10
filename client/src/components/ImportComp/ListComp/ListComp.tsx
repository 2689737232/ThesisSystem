import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Divider, message, Row } from 'antd';
import { spawn } from 'child_process';
import "./ListComp.less";
import ListItem from './ListItem';
import { PDFType, setCancelIds, setSelectedIds } from '@/features/importPdfSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { fireAllEvents, submitEvents } from '../SubmitHandler';
import ProgressBar from '@/components/ProgressBar/ProgressBar';


type ListComp = {
   originPdfs: PDFType[]
}
type ProgressStateType = {
   total: number,
   currentNum: number
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
   const importPdf = useAppSelector(state => state.importPdf)
   const dispatch = useAppDispatch()
   const [showProgress, setShowProgress] = useState(false)
   const [progressState, setProgressState] = useState<ProgressStateType>({
      total: 0,
      currentNum: 0
   })

   useEffect(() => {
      return () => {
         setShowProgress(false)
      }
   }, [])

   function genHead() {
      return headList.map(item => <th key={item.id} className={`${item.class} head-item`}>{item.comp ? item.comp : item.name}</th>)
   }

   function genBody() {
      return originPdfs.map(item => <ListItem key={item.id} id={item.id} file={item.file} />)
   }

   function cancelSelected() {
      if (importPdf.selectedIds.length === 0) return
      const temp = [...importPdf.selectedIds]
      dispatch(setCancelIds(temp))
      dispatch(setSelectedIds([]))
   }

   async function submitAll() {
      setShowProgress(true)
      // 触发每一项的提交事件，完成提交所有
      fireAllEvents({
         eachSubmit: (result: boolean) => {
            if (result) {
               setProgressState((preState: ProgressStateType) => {
                  return {
                     currentNum: preState.currentNum + 1,
                     total: submitEvents.length
                  }
               })
            }
         },
         afterAllSubmitted: (submiteEvent: SubmitEvent[]) => {
            message.info("全部上传完毕")
            setShowProgress(false)
            setProgressState({
               currentNum: 0,
               total: submitEvents.length
            })
         }
      })
   }


   if (!originPdfs || originPdfs.length === 0) return <div></div>
   return (
      <div className='wrapper-list'>
         {
            showProgress ? <ProgressBar {...progressState} /> : ""
         }
         <div className='list-comp'>
            <table style={{ borderCollapse: "separate", borderSpacing: "0px 10px" }}>
               <thead>
                  <tr>
                     {genHead()}
                  </tr>
               </thead>
               <tbody className='tbody-list'>
                  {genBody()}
               </tbody>
            </table>
         </div>
         <Row>
            <Col className='bottom-item' xs={12} sm={6} md={6} lg={6} xl={6}>
               <span className='tip-span'>总共{originPdfs.length}项</span>
            </Col>
            <Col className='bottom-item' xs={12} sm={6} md={6} lg={6} xl={6}>
               <Button className='submit-btn-selected'>提交选中</Button>
            </Col>
            <Col className='bottom-item' xs={12} sm={6} md={6} lg={6} xl={6}>
               <Button onClick={cancelSelected} className='cancel-btn-selected'>取消选中</Button>
            </Col>
            <Col className='bottom-item' xs={12} sm={6} md={6} lg={6} xl={6}>
               <Button onClick={submitAll} className='submit-btn-all'>提交所有</Button>
            </Col>
         </Row>
      </div>
   );
}

export default ListComp;
