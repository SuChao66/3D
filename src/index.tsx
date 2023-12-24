import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
// 导入路由的方式
import { HashRouter } from 'react-router-dom'
// 导入store
import { Provider } from 'react-redux'
import store from '@/store'
// 导入根组件
import App from './App'
// 导入重置样式
import 'normalize.css'
// 导入antd样式
import 'antd/dist/reset.css'
// 引入i18n国际化配置文件
import '@/i18n'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  // 路由懒加载
  <Suspense fallback="loadng...">
    {/* 全局提供store */}
    <Provider store={store}>
      {/* 路由方式 */}
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </Suspense>
)
