import { getArticles, RequestArticleParams } from '@/api/article';
import { Checkbox, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import "./BrowserList.less";


// 表头
const columnsInit = [
   {
      title: '收藏',
      dataIndex: 'collection',
      render: () => <Checkbox />,
      // width: '7%',
   },
   {
      title: '作者',
      dataIndex: 'author',
      render: (author: string) => author ? author : "(空)",
      // width: '10%',
   },
   {
      title: '年份',
      dataIndex: 'year',
      // filters: [
      //    { text: 'Male', value: 'male' },
      //    { text: 'Female', value: 'female' },
      // ],
      // width: '10%',
   },
   {
      title: '标题',
      dataIndex: 'title',
      render(title: string, record: any, index: number) {
         return <a target="_blank" href={`pdfs/${record.pdfPath}`}>{title}</a>
      },
      // width: "30%"
   },
   {
      title: '评分',
      dataIndex: 'score',
      // width: "10%"
   },
   {
      title: '最后更新',
      dataIndex: 'lastModify',
      // width: "10%"
   },
   {
      title: '文献类型',
      dataIndex: 'articleType',
      // width: "10%"
   },
];

type BrowserList = {
   [key: string]: any
   showCollection?: boolean,
   browserType: 1 | 2 | 3  // 我的、浏览、收藏
}

function BrowserList(props: BrowserList) {
   const [columns, setColumns] = useState(columnsInit)
   const [data, setData] = useState([]);
   const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
   })
   const [loading, setLoading] = useState(true)

   const getRandomuserParams = (params: { pagination: { pageSize: any; current: any; }; }) => ({
      results: params.pagination.pageSize,
      page: params.pagination.current,
      ...params,
   });

   const handleTableChange = (pagination: any, filters: any, sorter: any) => {
      // 发送网络请求，
      // this.fetch({
      //    sortField: sorter.field,
      //    sortOrder: sorter.order,
      //    pagination,
      //    ...filters,
      // });
   };

   const fetch = (params = {}) => {
      setLoading(false)
   };

   useEffect(() => {
      if (!props.showCollection) {
         setColumns(pre => pre.filter(item => item.title !== "收藏"))
      }
      async function inner() {
         // 拉取数据
         const response = await getArticles({ articlesType: props.browserType })
         console.log(response);
         if (response.data.data) {
            setData(response.data.data.articles)
         }
         setLoading(false)
      }
      inner()
   }, [])

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