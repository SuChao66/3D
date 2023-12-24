import { createSlice } from '@reduxjs/toolkit'
// 导入类型
import type { InitialStateType } from './types'
import { Theme, Lang } from './types'

const initialState: InitialStateType = {
  theme: Theme.DARK, // 主题背景
  lang: Lang.ZH // 中英文
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // 1.切换主题
    CHANGE_THEME_ACTION(state, { payload }) {
      state.theme = payload
    },
    // 2.切换中英文国际化
    CHANGR_LANG_ACTION(state, { payload }) {
      state.lang = payload
    }
  }
})

export const { CHANGE_THEME_ACTION, CHANGR_LANG_ACTION } = globalSlice.actions
export default globalSlice.reducer
