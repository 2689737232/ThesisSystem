import React from 'react'
import BrowserComp, { AritcleList } from '../BrowserComp/BrowserComp'

function ViewAll() {
  return (
    <div>
       <BrowserComp browserType={AritcleList.ALL_ARTICLE} ></BrowserComp>
    </div>
  )
}

export default ViewAll