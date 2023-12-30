import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { LangWrapper } from './style'
// 导入类型
import type { MenuProps } from 'antd'
import { Theme, Lang } from '@/store/module/global/types'
// 导入国际化
import { useTranslation } from 'react-i18next'
// 导入组件
import { Dropdown, Space } from 'antd'
import { LangLight, LangDark } from '@/plugins'
// 导入store
import { CHANGR_LANG_ACTION } from '@/store/module/global'
import { useAppDispatch } from '@/hooks/useSelectorHook'

interface IProps {
  children?: ReactNode
  theme: string
  lang: string
}

const SLang: FC<IProps> = (props) => {
  const { theme, lang } = props
  const { t, i18n } = useTranslation()
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
  // 3.切换语言
  const dispatch = useAppDispatch()
  const handleLangClick = (lang: Lang) => {
    i18n.changeLanguage(lang)
    dispatch(CHANGR_LANG_ACTION(lang))
  }

  return (
    <LangWrapper>
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
    </LangWrapper>
  )
}

export default memo(SLang)
