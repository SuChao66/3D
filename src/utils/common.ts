/**
 * 防抖函数
 * @param fn 函数
 * @param interval 时间
 * @returns 返回一个函数
 */
type FnType = (e?: any) => void
export const debounce = (fn: FnType, interval: number) => {
  let timer: ReturnType<typeof setTimeout> | undefined
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
      fn.apply(this)
    }, interval)
  }
}
