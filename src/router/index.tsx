import React from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
// 导入组件（懒加载）
const Home = React.lazy(
  () => import(/* webpackChunkName: 'Home' */ '@/views/Home')
)
const Robot = React.lazy(
  () => import(/* webpackChunkName: 'Robot' */ '@/views/Robot')
)
const Room = React.lazy(
  () => import(/* webpackChunkName: 'Room' */ '@/views/Room')
)

const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: '/home', element: <Home /> },
  { path: '/robot', element: <Robot /> },
  { path: '/room', element: <Room /> }
]

export default routes
