import React, { memo, useEffect } from 'react'
// 导入类型
import type { ReactNode, FC } from 'react'
import { Theme } from '@/store/module/global/types'
// 导入路由
import { useRoutes } from 'react-router-dom'
import routes from '@/router'
import {
  useAppSelector,
  useAppDispatch,
  shallowEqualApp
} from './hooks/useSelectorHook'
import { CHANGE_THEME_ACTION } from '@/store/module/global'
// 导入组件
import Header from '@/components/Header'

interface IProps {
  children?: ReactNode
}

const App: FC<IProps> = () => {
  const { theme } = useAppSelector(
    (state) => ({
      theme: state.global.theme
    }),
    shallowEqualApp
  )
  // 初始化dispatch事件
  const dispatch = useAppDispatch()
  // 切换主题
  const handleThemeChange = (theme: Theme) => {
    dispatch(CHANGE_THEME_ACTION(theme))
  }

  useEffect(() => {
    // 设置主题色
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="app">
      <Header changeTheme={(theme: Theme) => handleThemeChange(theme)}></Header>
      <div className="page">{useRoutes(routes)}</div>
    </div>
  )
}

export default memo(App)
