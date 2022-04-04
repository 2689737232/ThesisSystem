import { ArticlesType, getArticles, getArticlesCount, RequestArticleParams, viewArticle } from '@/api/article';
import { message, Table, TablePaginationConfig } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import React, { Key, useEffect, useState } from 'react'
import "./BrowserList.less";


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
   const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      showSizeChanger: false
   })
   const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
   const [loading, setLoading] = useState(true)

   //  复选框选中、取消事件
   function onSelectChange(selectedRowKeys: any) {
      setSelectedRowKeys(selectedRowKeys)
   }
   const rowSelection: TableRowSelection<React.Key[]> = {
      selectedRowKeys,
      onChange: onSelectChange,
      onSelect: function (record: { [key: string]: any }, selected, selectedRows, nativeEvent) {
         // 发送网络请求更新收藏列表
         if (selected) {
            const articleId = record.id;
         } else {
         }
         console.log(record, selected, selectedRows, nativeEvent);
      },
      columnTitle: "收藏",
      columnWidth: "5%"
   };


   const handleTableChange = async (pagination: TablePaginationConfig, filters: any, sorter: any) => {
      if (pagination.current && pagination.pageSize) {
         const current = pagination.current
         const result = renderArticles(pagination.current - 1, pagination.pageSize)
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

   useEffect(() => {
      console.log(props.browserType, props.keyWords);

      if (props.keyWords !== "" && props.browserType === 4) {
         console.log("key变量");
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
         console.log(response.data.data.articles);
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
            rowSelection={props.browserType === 2 ? rowSelection : undefined}
            className='browser-table'
            columns={columns}
            rowKey={record => (record as any).id}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
         />
         <div className="space"></div>
      </div>
   )
}

export default BrowserList