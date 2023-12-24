import React, { memo } from 'react'
// 导入类型
import type { ReactNode, FC } from 'react'
// 使用路由
import { useRoutes } from 'react-router-dom'
import routes from '@/router'

interface IProps {
  children?: ReactNode
}

const App: FC<IProps> = () => {
  return (
    <div className="app">
      <div className="header">header</div>
      <div className="page">{useRoutes(routes)}</div>
    </div>
  )
}

export default memo(App)
