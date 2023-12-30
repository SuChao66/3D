/**
 * 防抖函数
 * @param fn 函数
 * @param interval 时间
 * @returns 返回一个函数
 */
export const debounce = (fn: () => void, interval: number) => {
  let timer: any
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      fn.apply(this)
    }, interval)
  }
}
