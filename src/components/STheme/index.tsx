import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { ThemeWrapper } from './style'
// 导入svg
import { SunLight, SunDark, MoonLight, MoonDark } from '@/plugins'
// 导入组件
import { Radio, ConfigProvider, theme as AntTheme } from 'antd'
import type { ThemeType } from './types'
import { Theme } from '@/store/module/global/types'

interface IProps {
  children?: ReactNode
  theme: string
  changeTheme: (theme: Theme) => void
}

const STheme: FC<IProps> = (props) => {
  const { theme, changeTheme } = props
  // 主题切换
  const themes: ThemeType[] = [
    {
      key: 'light',
      label: 'Light',
      icon: 'sun'
    },
    {
      key: 'dark',
      label: 'Dark',
      icon: 'moon'
    }
  ]
  const handleThemeClick = (theme: Theme) => {
    changeTheme(theme)
  }

  return (
    <ThemeWrapper>
      <div className="theme-box">
        <ConfigProvider
          theme={{
            // 1. 单独使用暗色算法
            algorithm: AntTheme.darkAlgorithm
          }}
        >
          <Radio.Group
            buttonStyle="solid"
            value={theme}
            onChange={(e) => handleThemeClick(e.target.value)}
          >
            {themes.map((theme, index) => {
              return (
                <Radio.Button value={theme.key} key={index}>
                  <div className="theme-item">
                    {theme.icon === 'sun' ? (
                      theme.label === Theme.LIGHT ? (
                        <SunLight />
                      ) : (
                        <SunDark />
                      )
                    ) : theme.label === Theme.LIGHT ? (
                      <MoonLight />
                    ) : (
                      <MoonDark />
                    )}
                    {theme.label}
                  </div>
                </Radio.Button>
              )
            })}
          </Radio.Group>
        </ConfigProvider>
      </div>
    </ThemeWrapper>
  )
}

export default memo(STheme)
