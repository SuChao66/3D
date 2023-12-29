import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { HeaderWrapper } from './style'
// 导入组件
import {
  Col,
  Row,
  Dropdown,
  Space,
  Radio,
  ConfigProvider,
  theme as AntTheme
} from 'antd'
import type { MenuProps } from 'antd'
// 导入国际化
import { useTranslation } from 'react-i18next'
// 使用store中数据
import {
  useAppSelector,
  useAppDispatch,
  shallowEqualApp
} from '@/hooks/useSelectorHook'
import { CHANGR_LANG_ACTION } from '@/store/module/global'
import { Theme, Lang } from '@/store/module/global/types'
import type { ThemeType } from './types'
// 导入svg
import {
  SunLight,
  SunDark,
  MoonLight,
  MoonDark,
  LangLight,
  LangDark,
  GitHubLight,
  GitHubDark
} from '@/plugins'

interface IProps {
  children?: ReactNode
  changeTheme: (theme: Theme) => void
}

const Header: FC<IProps> = (props) => {
  const { changeTheme } = props
  const { t, i18n } = useTranslation()
  // 1.获取当前的语言配置
  const { lang, theme } = useAppSelector(
    (state) => ({
      lang: state.global.lang,
      theme: state.global.theme
    }),
    shallowEqualApp
  )
  // 2.初始化diapatch
  const dispatch = useAppDispatch()
  // 3.切换语言
  const handleLangClick = (lang: Lang) => {
    i18n.changeLanguage(lang)
    dispatch(CHANGR_LANG_ACTION(lang))
  }
  // 4.切换主题
  const handleThemeClick = (theme: Theme) => {
    changeTheme(theme)
  }
  // 5.跳转至github
  const jumpToGithub = () => {
    window.open('https://github.com/SuChao66/3D/tree/main')
  }
  // 中英文国际化
  const items: MenuProps['items'] = [
    {
      key: 'zh',
      label: <p onClick={() => handleLangClick(Lang.ZH)}>{t('zh')}</p>
    },
    {
      key: 'en',
      label: <p onClick={() => handleLangClick(Lang.EN)}>{t('en')}</p>
    }
  ]
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

  return (
    <HeaderWrapper>
      <Row>
        <Col span={12} className="left">
          {t('websiteTitle')}
        </Col>
        <Col span={12} className="right">
          {/* 主题切换 */}
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
          {/* 中英文切换 */}
          <div className="lang-box">
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {t(lang)}
                  {theme === Theme.LIGHT ? <LangLight /> : <LangDark />}
                </Space>
              </a>
            </Dropdown>
          </div>
          {/* github链接跳转 */}
          <div className="github-box" onClick={() => jumpToGithub()}>
            {theme === Theme.LIGHT ? <GitHubLight /> : <GitHubDark />}
          </div>
        </Col>
      </Row>
    </HeaderWrapper>
  )
}

export default memo(Header)
