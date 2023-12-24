import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { HeaderWrapper } from './style'
// 导入组件
import { Col, Row, Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
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

  const items: MenuProps['items'] = [
    {
      key: 'zh',
      label: <p onClick={() => handleLangClick(Lang.ZH)}>中文</p>
    },
    {
      key: 'en',
      label: <p onClick={() => handleLangClick(Lang.EN)}>英文</p>
    }
  ]
  // const items: MenuProps['items'] = [
  //   {
  //     key: 'light',
  //     label: <p onClick={() => changeTheme(Theme.LIGHT)}>Light</p>
  //   },
  //   {
  //     key: 'dark',
  //     label: <p onClick={() => changeTheme(Theme.DARK)}>Dark</p>
  //   }
  // ]

  return (
    <HeaderWrapper>
      <Row>
        <Col span={12} className="left">
          ThreeJS 案例鉴赏
        </Col>
        <Col span={12} className="right">
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {t(lang)}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          {/* <Dropdown menu={{ themes }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {t(theme)}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown> */}
        </Col>
      </Row>
    </HeaderWrapper>
  )
}

export default memo(Header)
