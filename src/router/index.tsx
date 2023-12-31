import React from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
// 导入组件（懒加载）
const Home = React.lazy(
  () => import(/* webpackChunkName: 'Home' */ '@/views/Home')
)
// 元宇宙机器人
const Robot = React.lazy(
  () => import(/* webpackChunkName: 'Robot' */ '@/views/Robot')
)
// 3D看房
const Room = React.lazy(
  () => import(/* webpackChunkName: 'Room' */ '@/views/Room')
)
// 海天一色
const IsLand = React.lazy(
  () => import(/* webpackChunkName: 'IsLand' */ '@/views/IsLand')
)
// 酷炫3D字体
const Font = React.lazy(
  () => import(/* webpackChunkName: 'IsLand' */ '@/views/Font')
)

const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: '/home', element: <Home /> },
  { path: '/robot', element: <Robot /> },
  { path: '/room', element: <Room /> },
  { path: '/isLand', element: <IsLand /> },
  { path: '/font', element: <Font /> }
]

export default routes
