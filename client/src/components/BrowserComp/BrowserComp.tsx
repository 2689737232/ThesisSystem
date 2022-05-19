import React from 'react';
import "./BrowserComp.less";
import BrowserList from './BrowserList/BrowserList';

export enum AritcleList {
  MY_ARTICLE = 1,
  ALL_ARTICLE = 2,
  COLLECTION = 3
}

type BrowserCompProps = {
  browserType: AritcleList
}

function BrowserComp({ browserType }: BrowserCompProps) {
  return <div className='browser-container'>
    <BrowserList showCollection browserType={browserType} />
  </div>;
}

export default BrowserComp;
