import React, { memo, useEffect } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { HomeWrapper } from './style'
// 导入store
import {
  useAppSelector,
  useAppDispatch,
  shallowEqualApp
} from '@/hooks/useSelectorHook'
import { CHANGE_THEME_ACTION } from '@/store/module/global'
import { Theme } from '@/store/module/global/types'
// 导入路由函数
import { useNavigate } from 'react-router-dom'
// 导入组件
import SHeader from '@/components/SHeader'
import { Card } from 'antd'

interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  const { theme, caseList } = useAppSelector(
    (state) => ({
      caseList: state.home.caseList,
      theme: state.global.theme
    }),
    shallowEqualApp
  )
  const { Meta } = Card
  // 初始化hook
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    // 设置主题色
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // 切换主题
  const handleThemeChange = (theme: Theme) => {
    dispatch(CHANGE_THEME_ACTION(theme))
  }
  // 跳转到指定页面
  const jumpToCase = (path: string) => {
    navigate(path)
  }

  return (
    <HomeWrapper>
      <SHeader
        changeTheme={(theme: Theme) => handleThemeChange(theme)}
      ></SHeader>
      <div className="content">
        {caseList.map((item, index) => {
          return (
            <Card
              onClick={() => jumpToCase(item.path)}
              key={index}
              hoverable
              style={{ width: '23%', margin: 10, minWidth: '100px' }}
              cover={<img alt="example" src={item.image} />}
            >
              <Meta title={item.title} description={item.description} />
            </Card>
          )
        })}
      </div>
    </HomeWrapper>
  )
}

export default memo(Home)
