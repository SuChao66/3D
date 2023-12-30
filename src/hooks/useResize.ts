import { useState, useEffect } from 'react'
import { debounce } from '@/utils'

const getWindowSize = () => ({
  innerHeight: window.innerHeight,
  innerWidth: window.innerWidth
})

function useResize() {
  const [windowSize, setWindowSize] = useState(getWindowSize())

  useEffect(() => {
    const handleSize = () => {
      setWindowSize(getWindowSize())
    }
    // 对resize函数进行防抖处理
    const debouncedHandleResize = debounce(handleSize, 1000)

    // 监听resize事件
    window.addEventListener('resize', debouncedHandleResize)
    // 销毁事件
    return () => window.removeEventListener('resize', debouncedHandleResize)
  }, [windowSize])

  return windowSize
}

export default useResize
