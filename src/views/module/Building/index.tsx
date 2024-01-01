import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { BuildingWrapper } from './style'

interface IProps {
  children?: ReactNode
}

const Building: FC<IProps> = () => {
  return <BuildingWrapper>Building</BuildingWrapper>
}

export default memo(Building)
