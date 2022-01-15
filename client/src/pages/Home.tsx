import React, { useEffect } from 'react'
import useLogin from '../hooks/useLogin'


function Home() {
   useLogin()
   return (
      <div>
         主页
      </div>
   )
}

export default Home
