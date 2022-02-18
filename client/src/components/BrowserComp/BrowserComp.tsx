import React from 'react';
import "./BrowserComp.less";
import BrowserList from './BrowserList/BrowserList';


function BrowserComp() {
  return <div className='browser-container'>
    <BrowserList showCollection browserType={1}/>
  </div>;
}

export default BrowserComp;
