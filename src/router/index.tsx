import React from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
// 导入组件（懒加载）
const Home = React.lazy(
  () => import(/* webpackChunkName: 'Home' */ '@/views/Home')
)

const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: '/home', element: <Home /> }
]

export default routes
