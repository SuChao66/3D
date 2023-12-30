import React from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
// 导入组件（懒加载）
const Home = React.lazy(
  () => import(/* webpackChunkName: 'Home' */ '@/views/Home')
)
const Metahuman = React.lazy(
  () => import(/* webpackChunkName: 'Metahuman' */ '@/views/Metahuman')
)

const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: '/home', element: <Home /> },
  { path: '/human', element: <Metahuman /> }
]

export default routes
