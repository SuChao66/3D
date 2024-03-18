import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'

interface IProps {
  children?: ReactNode
}

const VirtualRoom: FC<IProps> = () => {
  return <div>VirtualRoom</div>
}

export default memo(VirtualRoom)
