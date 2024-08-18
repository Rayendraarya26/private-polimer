import { useEffect, useRef, useState } from 'react'

const useDebounceValue = <T,>(value: T, delay = 500) => {
  const [debValue, setDebValue] = useState<T>(value)
  const mounted = useRef(true)

  useEffect(() => {
    if (mounted.current) {
      mounted.current = false
      return
    }

    const timer = setTimeout(() => setDebValue(value), delay)

    return () => clearTimeout(timer)
  }, [delay, value])

  return debValue
}

export default useDebounceValue
