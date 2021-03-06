import { useEffect } from 'react'
import { Route, Routes } from 'react-router'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
// import ShowAntComp from './pages/ShowAntComp'

function App() {
  // useEffect(()=>{
  //   window.onresize = function(){
  //     console.log("浏览器大小发生了变化");
  //   }
  // },[])

  return (
    <div className="App">
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="home" element={<Home />}></Route>
        {/* <Route path="show-ant" element={<ShowAntComp />}></Route> */}
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  )
}

export default App
