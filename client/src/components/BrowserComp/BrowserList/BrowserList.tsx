import { ArticlesType, getArticles, getArticlesCount, RequestArticleParams } from '@/api/article';
import { Checkbox, message, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import "./BrowserList.less";

// 表头
const columnsInit = [
   {
      title: '收藏',
      dataIndex: 'collection',
      render: () => <Checkbox />,
      width: '7%',
   },
   {
      title: '作者',
      dataIndex: 'author',
      render: (author: string) => author ? author : "(空)",
      width: '10%',
   },
   {
      title: '年份',
      dataIndex: 'year',
      // filters: [
      //    { text: 'Male', value: 'male' },
      //    { text: 'Female', value: 'female' },
      // ],
      width: '10%',
   },
   {
      title: '标题',
      dataIndex: 'title',
      render(title: string, record: any, index: number) {
         return <a target="_blank" href={`api/v1/file?fileType=pdf&filePath=${record.pdfPath}`}>{title}</a>
      },
      width: "15%"
   },
   {
      title: '评分',
      dataIndex: 'score',
      width: "10%"
   },
   {
      title: '最后更新',
      dataIndex: 'lastModify',
      width: "10%"
   },
   {
      title: '文献类型',
      dataIndex: 'articleType',
      width: "10%"
   },
];

type BrowserList = {
   [key: string]: any
   showCollection?: boolean,
   browserType: ArticlesType  // 我的、浏览、收藏
}

function BrowserList(props: BrowserList) {
   const [columns, setColumns] = useState(columnsInit)
   const [data, setData] = useState([]);
   const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 9,
   })
   const [loading, setLoading] = useState(true)


   const getRandomuserParams = (params: { pagination: { pageSize: any; current: any; }; }) => ({
      results: params.pagination.pageSize,
      page: params.pagination.current,
      ...params,
   });

   const handleTableChange = async (pagination: { current: number, pageSize: number, total: number }, filters: any, sorter: any) => {
      const result = renderArticles(pagination.current - 1, pagination.pageSize)
      if (await result) {
         setPagination(preState => {
            return {
               ...preState,
               current: pagination.current
            }
         })
      } else {
         message.error("列表获取失败")
      }
   };

   const fetch = (params = {}) => {
      setLoading(false)
   };

   useEffect(() => {
      if (!props.showCollection) {
         setColumns(pre => pre.filter(item => item.title !== "收藏"))
      }
      renderArticles(pagination.current, pagination.pageSize)
      setArticlesCount()
   }, [])

   // 渲染页面
   async function renderArticles(page: number, size: number) {
      // 拉取数据
      const response = await getArticles({
         articlesType: props.browserType,
         page: page,
         size: size
      }, (err: any) => {
         setLoading(false)
      })

      if (response.data.data) {
         console.log(response.data.data.articles);
         setData(response.data.data.articles)
         return true
      } else {
         return false
      }
      setLoading(false)
   }
   // 获取文章总数
   async function setArticlesCount() {
      const data = await getArticlesCount(props.browserType)
      const count = data?.data?.data?.count
      if (count) {
         setPagination(preState => {
            return {
               ...preState,
               total: count
            }
         })
      }
   }

   function onHeaderRow(columns: any, index: any) {
      return {
         onClick: () => {
            console.log(columns, index);
         }, // 点击表头行
      };
   }

   return (
      <div className='browser-list-container'>
         <Table
            className='browser-table'
            columns={columns}
            rowKey={record => (record as any).id}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
         />
      </div>
   )
}

export default BrowserList