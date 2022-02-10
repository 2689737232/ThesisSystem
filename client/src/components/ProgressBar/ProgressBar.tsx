import React, { useState } from 'react';
import { Progress, Button, Popconfirm, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import "./ProgressBar.less";
import { interrupt } from '../ImportComp/SubmitHandler';


function ProgressBar(props: { total: number, currentNum: number }) {
   let percent: string | number = props.currentNum / props.total
   if (Number.isNaN(percent)) percent = 0
   percent = (percent * 100).toFixed(2)
   const [isMini, setIsMini] = useState(false)
   const [visible, setVisible] = useState(false)


   const miniStyle = {
      wrapperStyle: {
         width: "30vw",
         height: "30vh",
         top: "70%",
         left: "-8%",
         backgroundColor: "transparent"
      },
      barStyle: {
         backgroundColor: "transparent"
      }
   }
   const maxStyle = {
      wrapperStyle: {
         width: "100vw",
         height: "100vh",
         left: "0",
         top: "0",
         backgroundColor: "rgba(158, 158, 158, 0.493)"
      },
      barStyle: {
         backgroundColor: "rgb(255, 255, 255)"
      }
   }
   const [style, setStyle] = useState(maxStyle)

   function minify() {
      if (!isMini) {
         setStyle(miniStyle)
         setIsMini(true)
      } else {
         setStyle(maxStyle)
         setIsMini(false)
      }
   }


   // 
   function cancel() {
      interrupt()
      setVisible(false)
   }

   return (
      <div className='progresss-wrapper' style={style.wrapperStyle}>
         <div className="progress-bar" style={style.barStyle}>
            <Progress className='progress-item item-progress' percent={Number(percent)} />
            <div className="progress-item item-info">
               总共{props.total === undefined ? 0 : props.total},
               已经上传{props.currentNum === undefined ? 0 : props.currentNum}
            </div>
            <div className="progress-item item-btn">
               <Button className='btn-item' onClick={minify}>{isMini ? "最大化" : "最小化"}</Button>
               <Modal
                  title="确认取消吗"
                  visible={visible}
                  onOk={cancel}
                  onCancel={() => setVisible(false)}
                  okText="确认"
                  cancelText="取消"
               >
               </Modal>
               <Button className='submit-btn-cancle' onClick={() => setVisible(true)}>取消</Button>
            </div>
         </div>
      </div>
   );
}

export default ProgressBar;


