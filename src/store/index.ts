import { configureStore } from '@reduxjs/toolkit'
// 导入modules
import GlobalReducer from './module/global'
import HomeReducer from './module/home'

const store = configureStore({
  reducer: {
    global: GlobalReducer,
    home: HomeReducer
  }
})

export default store
