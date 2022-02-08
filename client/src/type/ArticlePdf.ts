import ArticleType from "./ArticleEnum";

/**
 * 名字、作者、年份、标题、期刊、最后更新、文献类型
 */
interface ArticlePdf {
   name:string;
   author: string;
   year: string;
   title: string;
   periodical: string;
   lastModify: string;
   articleType: ArticleType
}

export default ArticlePdf;
