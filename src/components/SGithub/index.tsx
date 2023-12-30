import React, { memo } from 'react'
import type { ReactNode, FC } from 'react'
// 导入样式
import { GithubWrapper } from './style'
import { Theme } from '@/store/module/global/types'
// 导入svg
import { GitHubLight, GitHubDark } from '@/plugins'

interface IProps {
  children?: ReactNode
  theme: string
}

const SGithub: FC<IProps> = (props) => {
  const { theme } = props
  // 跳转至github
  const jumpToGithub = () => {
    window.open('https://github.com/SuChao66/3D/tree/main')
  }

  return (
    <GithubWrapper>
      <div className="github-box" onClick={() => jumpToGithub()}>
        {theme === Theme.LIGHT ? <GitHubLight /> : <GitHubDark />}
      </div>
    </GithubWrapper>
  )
}

export default memo(SGithub)
