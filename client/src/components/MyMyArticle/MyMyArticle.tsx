import React from 'react';
import BrowserList from '../BrowserComp/BrowserList/BrowserList';
import "./MyMyArticle.less"

function MyArticle() {
  return (<div className='article-box'>
    <BrowserList browserType={1}></BrowserList>
  </div>);
}

export default MyArticle;
