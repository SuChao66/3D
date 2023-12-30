import React, { memo } from 'react'
// 导入类型
import type { ReactNode, FC } from 'react'
// 导入路由
import { useRoutes } from 'react-router-dom'
import routes from '@/router'
// 导入样式
import { AppWrapper } from './style'

interface IProps {
  children?: ReactNode
}

const App: FC<IProps> = () => {
  return (
    <AppWrapper>
      <div className="page">{useRoutes(routes)}</div>
    </AppWrapper>
  )
}

export default memo(App)
