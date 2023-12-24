import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { HomeWrapper } from './style'
import { useAppSelector, shallowEqualApp } from '@/hooks/useSelectorHook'
// 导入国际化
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <HomeWrapper>
      <span>{t('article')}</span>
    </HomeWrapper>
  )
}

export default memo(Home)
