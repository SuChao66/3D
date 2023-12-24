import { configureStore } from '@reduxjs/toolkit'
// 导入modules
import HomeReducer from './module/home'

const store = configureStore({
  reducer: {
    home: HomeReducer
  }
})

export default store
