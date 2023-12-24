import { createSlice } from '@reduxjs/toolkit'
// 导入类型
import type { InitialStateType } from './types'

// 定义一个初始化
const initialState: InitialStateType = {
  homeTitle: '3D sample'
}

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {}
})

export default homeSlice.reducer
