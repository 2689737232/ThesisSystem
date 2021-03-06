import { ArticlesType, getArticles, getArticlesCount, RequestArticleParams, viewArticle } from '@/api/article';
import { message, Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { Key, SetStateAction, useEffect, useState } from 'react'
import "./BrowserList.less";

interface TablePaginationConfig {
   current: number;
   pageSize: number;
   showSizeChanger: boolean;
   total: number;
   fTotal: number;
}

function TitleComp(props: { pdfPath: string, title: string, record: any }) {
   async function sendArticleId() {
      const articleId = props.record.id;
      const result = await viewArticle(articleId)
   }

   return (
      <a onClick={sendArticleId} target="_blank" href={`api/v1/file?fileType=pdf&filePath=${props.pdfPath}`}>{props.title}</a>
   )
}

// 表头
const columnsInit = [
   // {
   //    title: '收藏',
   //    dataIndex: 'collection',
   // render: () => <Checkbox />,
   // width: '7%',
   // },
   {
      title: '作者',
      dataIndex: 'author',
      render: (author: string) => author ? author : "(空)",
   },
   {
      title: '年份',
      dataIndex: 'year',
      // filters: [
      //    { text: 'Male', value: 'male' },
      //    { text: 'Female', value: 'female' },
      // ],
   },
   {
      title: '标题',
      dataIndex: 'title',
      render(title: string, record: any, index: number) {
         return <TitleComp pdfPath={record.pdfPath} title={title} record={record} />
      },
   },
   {
      title: '评分',
      dataIndex: 'score',
   },
   {
      title: '最后更新',
      dataIndex: 'lastModify',
   },
   {
      title: '文献类型',
      dataIndex: 'articleType',
   },
];

type BrowserList = {
   [key: string]: any
   showCollection?: boolean,
   browserType: ArticlesType,  // 我的、浏览、收藏
   keyWords?: string  // 搜索关键字
}

function BrowserList(props: BrowserList) {
   const [columns, setColumns] = useState(columnsInit)
   const [data, setData] = useState([]);
   const [pagination, setPagination] = useState<TablePaginationConfig>({
      current: 1,  // 当前页码、页容量
      pageSize: 10,
      showSizeChanger: false,
      total: 1,
      fTotal: 1
   })
   const [loading, setLoading] = useState(true)

   const rowSelection: TableRowSelection<React.Key[]> = {};

   const handleTableChange = async (pagination: TablePaginationConfig, filters: any, sorter: any) => {
      if (pagination.current && pagination.pageSize) {
         const current = pagination.current;

         const requestPage = current > Math.ceil(pagination.fTotal / 10) ?
            Math.ceil(Math.random() * pagination.fTotal / 10) : current;

         const result = renderArticles(requestPage - 1, pagination.pageSize)
         if (await result) {
            setPagination(preState => {
               return {
                  ...preState,
                  current: current
               }
            })
         } else {
            message.error("列表获取失败")
         }
      }

   };


   useEffect(() => {
      if (!props.showCollection) {
         setColumns(pre => pre.filter(item => item.title !== "收藏"))
      }
      renderArticles(pagination.current - 1, pagination.pageSize)
      setArticlesCount()
   }, [])

   useEffect(() => {
      if (props.keyWords !== "" && props.browserType === 4) {
         renderArticles(pagination.current, pagination.pageSize)
      }
   }, [props.keyWords])

   // 渲染页面
   async function renderArticles(page: number, size: number) {
      const baseRequestConf: RequestArticleParams = {
         articlesType: props.browserType,
         page: page,
         size: size
      }
      if (props.browserType === 4) {
         baseRequestConf.keyWords = props.keyWords
      }
      // 拉取数据
      const response = await getArticles(baseRequestConf, (err: any) => {
         message.error("请求文章数据失败，请刷新页面重试")
         setLoading(false)
      })

      if (response.data.data) {
         setData(response.data.data.articles)
         setLoading(false)
         return true
      } else {
         message.info("没有文章数据哦！")
         setLoading(false)
         return false
      }
   }
   // 获取文章总数
   async function setArticlesCount() {
      const data = await getArticlesCount(props.browserType)
      const fTotal = data?.data?.data?.count
      const total = fTotal * 5 * 8;
      if (fTotal) {
         setPagination(preState => {
            return {
               ...preState,
               total: total,
               fTotal
            }
         })
      }
   }

   const [inputPage, setInputPage] = useState(0)
   useEffect(() => {
      handleTableChange({
         ...pagination,
         current: inputPage
      }, null, null)
   }, [inputPage])


   return (
      <div className='browser-list-container'>

         <Table
            rowSelection={props.browserType === 2 ? rowSelection : undefined}
            className='browser-table'
            columns={columns}
            rowKey={record => (record as any).id}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
         />

         <div className="space" />
         {/* <div>
            <span>跳转</span>
            <input value={inputPage}
               onChange={e => setInputPage(Number(e.target.value))}
               type="number" min={1} max={pagination.total} />
         </div> */}
      </div>
   )
}

export default BrowserList