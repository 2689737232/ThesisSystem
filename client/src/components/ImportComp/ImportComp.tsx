import React, { useEffect, useState } from 'react';
import { Upload, Button, Row, Col, message, Divider, Modal, Pagination } from 'antd';
import { UploadOutlined, ClearOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import "./ImportComp.less";
import Id from '@/util/Id';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { PDFType, setTargetPDF } from '@/store/importPdfSlice';
import PdfReader from '../PdfReader/PdfReader';
import ListComp from './ListComp/ListComp';
const { confirm } = Modal;


function ImportComp() {
    const maxCount = 80;  //最大上传量
    const id = new Id()

    const [pdfs, setPdfs] = useState<PDFType[]>([]);
    const importState = useAppSelector(state => state.importPdf)
    const dispatch = useAppDispatch()


    // 删除取消的项
    useEffect(() => {
        const temp = [...pdfs]
        importState.cancelIds.forEach(cancelId => {
            let i = temp.findIndex(pdf => pdf.id === cancelId)
            temp.splice(i, 1)
        })
        setPdfs(temp)
    }, [importState.cancelIds])

    // 上传组件属性，点击事件、文件类型等配置
    const uploadProps = {
        action: "localhost:8000",
        accept: "application/pdf",
        maxCount,
        uploading: false,
        showUploadList: false,
        beforeUpload: (file: RcFile) => {
            if (file.type === 'application/pdf') {
                setPdfs(state => [...state, { file, id: id.genId(file.name) }])
            } else {
                message.error(`${file.name} 不是一个pdf格式文件`);
            }
            return false; // 返回false，实现手动上传
        }
    }

    function clear() {
        if (pdfs.length === 0) message.info("没有导入文件哦")
        else {
            confirm({
                title: '是否清空?',
                icon: <ExclamationCircleOutlined />,
                content: '清除所有已导入的信息',
                onOk() {
                    setPdfs([])
                    dispatch(setTargetPDF(null))
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    }
    return <div className='import-container'>
        {importState.targetPDF ? <PdfReader pdf={importState.targetPDF}></PdfReader> : ""}
        <Row justify="end">
            <Col xs={10} sm={12} md={12} lg={12} xl={12}>
                <Button onClick={clear} icon={<ClearOutlined />}>清空</Button>
            </Col>
            <Col xs={14} sm={12} md={12} lg={12} xl={12}>
                <Upload multiple {...uploadProps}>
                    <Button icon={<UploadOutlined />}>选择上传的文件</Button>
                </Upload>
            </Col>
        </Row>
        <Divider />
        {/* 内容主体 */}
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                {
                    pdfs.length === 0 ?
                        <h2>选择pdf文献上传</h2> : ""
                }
            </Col>
        </Row>
        <Row className='middle-pdf-edit'>
            <ListComp pdfs={pdfs}></ListComp>
        </Row>
    </div>;
}

export default ImportComp;
