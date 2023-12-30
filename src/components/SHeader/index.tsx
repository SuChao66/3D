import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { HeaderWrapper } from './style'
// 导入组件
import { Col, Row, Dropdown } from 'antd'
// 导入图标
import { UnorderedListOutlined } from '@ant-design/icons'
// 导入类型
import type { MenuProps } from 'antd'
// 导入国际化
import { useTranslation } from 'react-i18next'
// 使用store中数据
import { useAppSelector, shallowEqualApp } from '@/hooks/useSelectorHook'
import { Theme } from '@/store/module/global/types'
// 导入hook
import useResize from '@/hooks/useResize'
// 导入自定义组件
import STheme from '@/components/STheme'
import SLang from '@/components/SLang'
import SGithub from '@/components/SGithub'

interface IProps {
  children?: ReactNode
  changeTheme: (theme: Theme) => void
}

const Header: FC<IProps> = (props) => {
  const { changeTheme } = props
  const { t } = useTranslation()
  const { innerWidth } = useResize()
  // 1.获取当前的语言配置
  const { lang, theme } = useAppSelector(
    (state) => ({
      lang: state.global.lang,
      theme: state.global.theme
    }),
    shallowEqualApp
  )

  const isShow = innerWidth > 600
  const items: MenuProps['items'] = [
    {
      key: 'light',
      label: <STheme theme={theme} changeTheme={changeTheme} />
    },
    {
      key: 'lang',
      label: <SLang theme={theme} lang={lang} />
    },
    {
      key: 'github',
      label: <SGithub theme={theme} />
    }
  ]
  // 自定义dropDown的样式
  const contentStyle: React.CSSProperties = {
    backgroundColor: theme === Theme.LIGHT ? '#FFFFFF' : '#000000'
  }

  return (
    <HeaderWrapper>
      <Row>
        <Col span={12} className="left">
          {t('websiteTitle')}
        </Col>
        {isShow && (
          <Col span={12} className="right">
            {/* 主题切换 */}
            <STheme theme={theme} changeTheme={changeTheme} />
            {/* 中英文切换 */}
            <SLang theme={theme} lang={lang} />
            {/* github链接跳转 */}
            <SGithub theme={theme} />
          </Col>
        )}
        {!isShow && (
          <Col span={12} className="right">
            <Dropdown
              menu={{ items }}
              placement="bottom"
              dropdownRender={(menu) => (
                <div style={contentStyle}>
                  {React.cloneElement(menu as React.ReactElement, {
                    style: contentStyle
                  })}
                </div>
              )}
            >
              <UnorderedListOutlined />
            </Dropdown>
          </Col>
        )}
      </Row>
    </HeaderWrapper>
  )
}

export default memo(Header)
