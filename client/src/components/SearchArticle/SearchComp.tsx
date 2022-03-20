import { useAppSelector } from '@/hooks/reduxHooks'
import React from 'react'

import BrowserList from '../BrowserComp/BrowserList/BrowserList'

function SearchComp() {
  const keyWords = useAppSelector(state => state.search.keyWords)
  
  return (
    <div>
      <BrowserList browserType={4} keyWords={keyWords}></BrowserList>
    </div>
  )
}

export default SearchComp