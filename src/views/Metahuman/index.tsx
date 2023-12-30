import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'

interface IProps {
  children?: ReactNode
}

const Metahuman: FC<IProps> = () => {
  return <div>Metahuman</div>
}

export default memo(Metahuman)
