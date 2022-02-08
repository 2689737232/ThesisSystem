import React, { useEffect, useState } from 'react';
import { Upload, Button, Row, Col, message, Divider, Modal, Pagination } from 'antd';
import { UploadOutlined, ClearOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { request } from '@/api/base';
import { uploadPDF } from '@/api/upload';
import "./ImportComp.less";
import ListComp from './ListComp/ListComp';
import Id from '@/util/Id';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { PDFType, setCancelIds, setTargetPDF } from '@/features/importPdfSlice';
import PdfReader from '../PdfReader/PdfReader';
const { confirm } = Modal;


function ImportComp() {
    const maxCount = 80;
    const [pdfFiles, setPdfFiles] = useState<PDFType[]>([]);
    const [uploading, setUploading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPageNum, setTotalPageNum] = useState(0)
    const id = new Id()
    const importState = useAppSelector(state => state.importPdf)
    const dispatch = useAppDispatch()


    async function handleUpload() {
        const formData = new FormData();
        pdfFiles.forEach(pdf => {
            formData.append('pdfs[]', pdf.file);
        })
        setUploading(true)
        // const result = await uploadPDF(formData)
    }

    useEffect(() => {
        console.log(pdfFiles);
        setTotalPageNum(pdfFiles.length)
    }, [pdfFiles]);

    // 删除取消的项
    useEffect(() => {

        const temp = [...pdfFiles]
        importState.cancelIds.forEach(cancelId => {
            let i = temp.findIndex(pdf => pdf.id === cancelId)
            temp.splice(i, 1)
        })
        setPdfFiles(temp)
    }, [importState.cancelIds])

    const uploadProps = {
        action: "localhost:8000",
        accept: "application/pdf",
        maxCount,
        uploading: false,
        showUploadList: false,
        beforeUpload: (file: RcFile) => { // 返回false，实现手动上传
            const isPDF = file.type === 'application/pdf';
            if (isPDF) {
                setPdfFiles(state => [...state, { file, id: id.genId(file.name) }])
            } else message.error(`${file.name} 不是一个pdf格式文件`);
            return false;
        },
        onChange: (info: UploadChangeParam<object>) => {
            // console.log(info.fileList);
        },
        customRequest() {
        }
    }

    function showConfirm() {
        if (pdfFiles.length === 0) message.info("没有导入文件哦")
        else {
            confirm({
                title: '是否清空?',
                icon: <ExclamationCircleOutlined />,
                content: '清除所有已导入的信息',
                onOk() {
                    setPdfFiles([])
                    dispatch(setTargetPDF(null))
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }
    }

    function onPageChange(pageNumber: number) {
        console.log('Page: ', pageNumber);
    }

    return <div className='import-container'>
        {importState.targetPDF ? <PdfReader pdf={importState.targetPDF}></PdfReader> : ""}
        <Row justify="end">
            <Col xs={10} sm={12} md={12} lg={12} xl={12}>
                <Button onClick={showConfirm} icon={<ClearOutlined />}>清空</Button>
            </Col>
            <Col xs={14} sm={12} md={12} lg={12} xl={12}>
                <Upload multiple {...uploadProps}>
                    <Button icon={<UploadOutlined />}>选择上传的文件</Button>
                </Upload>
            </Col>
        </Row>
        <Divider />
        {/* 内容主体 */}
        <Row className='middle-pdf-edit'>
            <ListComp originPdfs={pdfFiles}></ListComp>
        </Row>
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                {
                    pdfFiles.length === 0 ?
                        <h2>选择pdf文献上传</h2> : ""
                }
            </Col>
        </Row>
    </div>;
}

export default ImportComp;
