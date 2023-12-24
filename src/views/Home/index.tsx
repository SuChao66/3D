import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { HomeWrapper } from './style'
import { useAppSelector, shallowEqualApp } from '@/hooks/useSelectorHook'
// 导入国际化
import { useTranslation } from 'react-i18next'
import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Space } from 'antd'
import type { MenuProps } from 'antd'

interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  const { homeTitle } = useAppSelector(
    (state) => ({
      homeTitle: state.home.homeTitle
    }),
    shallowEqualApp
  )
  const { t, i18n } = useTranslation()
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <p
          onClick={() => {
            i18n.changeLanguage('zh')
          }}
        >
          中文
        </p>
      )
    },
    {
      key: '2',
      label: (
        <p
          onClick={() => {
            i18n.changeLanguage('en')
          }}
        >
          英文
        </p>
      )
    }
  ]

  return (
    <HomeWrapper>
      <span>{homeTitle}</span>
      <span>{t('article')}</span>
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            中英文切换
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </HomeWrapper>
  )
}

export default memo(Home)
