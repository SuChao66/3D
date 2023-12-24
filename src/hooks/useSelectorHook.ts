import store from '@/store'
import {
  useSelector,
  useDispatch,
  TypedUseSelectorHook,
  shallowEqual
} from 'react-redux'

// 获取store.getState的类型
type GetStateFnType = typeof store.getState
// 拿到store.getState函数的返回值类型
type IRootState = ReturnType<GetStateFnType>
// 获取dispatch的类型
type DispatchType = typeof store.dispatch

// 定义useAppSelector
const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
const useAppDispatch: () => DispatchType = useDispatch
const shallowEqualApp = shallowEqual

export { useAppSelector, useAppDispatch, shallowEqualApp }
