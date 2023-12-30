import { createSlice } from '@reduxjs/toolkit'
// 导入类型
import type { InitialStateType } from './types'
// 导入配置数据
import { caseList } from './config'

// 定义一个初始化
const initialState: InitialStateType = {
  caseList: caseList
}

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {}
})

export default homeSlice.reducer
