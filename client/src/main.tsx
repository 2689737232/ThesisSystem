import React from 'react'
import ReactDOM from 'react-dom'
import './index.less'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import 'antd/dist/antd.css';
import { Provider } from 'react-redux'
import store from "./store"


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
