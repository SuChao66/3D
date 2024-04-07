import React from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
// 导入组件（懒加载）
const Home = React.lazy(
  () => import(/* webpackChunkName: 'Home' */ '@/views/Home')
)
// 元宇宙机器人
const Robot = React.lazy(
  () => import(/* webpackChunkName: 'Robot' */ '@/views/module/Robot')
)
// 3D看房
const Room = React.lazy(
  () => import(/* webpackChunkName: 'Room' */ '@/views/module/Room')
)
// 海天一色
const IsLand = React.lazy(
  () => import(/* webpackChunkName: 'IsLand' */ '@/views/module/IsLand')
)
// 酷炫3D字体
const Font = React.lazy(
  () => import(/* webpackChunkName: 'IsLand' */ '@/views/module/Font')
)
// 新春快乐
const HappyNewYear = React.lazy(
  () =>
    import(/* webpackChunkName: 'HappyNewYear' */ '@/views/module/HappyNewYear')
)
// 地月同心
const Earth = React.lazy(
  () => import(/* webpackChunkName: 'Earth' */ '@/views/module/Earth')
)
// 酷炫3D地球
const CoolEarth = React.lazy(
  () => import(/* webpackChunkName: 'Earth' */ '@/views/module/CoolEarth')
)
// 酷炫建筑物
const Building = React.lazy(
  () => import(/* webpackChunkName: 'Earth' */ '@/views/module/Building')
)
// 圣诞贺卡
const MerryCard = React.lazy(
  () => import(/* webpackChunkName: 'MerryCard' */ '@/views/module/MerryCard')
)
// 智慧工厂
const SmartFactory = React.lazy(
  () =>
    import(/* webpackChunkName: 'SmartFactory' */ '@/views/module/SmartFactory')
)

const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: '/home', element: <Home /> },
  { path: '/robot', element: <Robot /> },
  { path: '/room', element: <Room /> },
  { path: '/isLand', element: <IsLand /> },
  { path: '/font', element: <Font /> },
  { path: '/happyNewYear', element: <HappyNewYear /> },
  { path: '/earthMoon', element: <Earth /> },
  { path: '/earth', element: <CoolEarth /> },
  { path: '/building', element: <Building /> },
  { path: '/merry', element: <MerryCard /> },
  { path: '/smartFactory', element: <SmartFactory /> }
]

export default routes
