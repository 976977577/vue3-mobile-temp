import { computed, onActivated, onBeforeUnmount, onDeactivated, ref } from 'vue'
import { cancelRaf, inBrowser, raf } from '@/utils/browser'

export interface CurrentTime {
  days: number
  hours: string
  total: number
  minutes: string
  seconds: string
  milliseconds: number
  formatted: string
}

export interface UseCountDownOptions {
  time?: number
  millisecond?: boolean
  onChange?: (current: CurrentTime) => void
  onFinish?: () => void
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function parseTime(time: number): CurrentTime {
  const days = Math.floor(time / DAY)
  const hours = Math.floor((time % DAY) / HOUR)
  const minutes = Math.floor((time % HOUR) / MINUTE)
  const seconds = Math.floor((time % MINUTE) / SECOND)
  const milliseconds = Math.floor(time % SECOND)
  const formatTimePart = (part: number): string => String(part).padStart(2, '0')
  const totalHours = Math.floor(time / HOUR)
  const formatted = `${formatTimePart(totalHours)}:${formatTimePart(minutes)}:${formatTimePart(
    seconds
  )}`
  return {
    total: time,
    days,
    hours: formatTimePart(hours),
    minutes: formatTimePart(minutes),
    seconds: formatTimePart(seconds),
    milliseconds,
    formatted
  }
}

function isSameSecond(time1: number, time2: number): boolean {
  return Math.floor(time1 / 1000) === Math.floor(time2 / 1000)
}

export function useCountDown(options: UseCountDownOptions = {}) {
  let rafId: number
  let endTime: number
  let counting: boolean
  let deactivated: boolean

  const remain = ref(options.time || 0)
  const current = computed(() => parseTime(remain.value))

  const pause = () => {
    counting = false
    cancelRaf(rafId)
  }

  const getCurrentRemain = () => Math.max(endTime - Date.now(), 0)

  const setRemain = (value: number) => {
    remain.value = value
    options.onChange?.(current.value)

    if (value === 0) {
      pause()
      options.onFinish?.()
    }
  }

  const microTick = () => {
    rafId = raf(() => {
      if (counting) {
        setRemain(getCurrentRemain())
        if (remain.value > 0) {
          microTick()
        }
      }
    })
  }

  const macroTick = () => {
    rafId = raf(() => {
      if (counting) {
        const remainRemain = getCurrentRemain()
        if (!isSameSecond(remainRemain, remain.value) || remainRemain === 0) {
          setRemain(remainRemain)
        }

        if (remain.value > 0) {
          macroTick()
        }
      }
    })
  }

  const tick = () => {
    if (!inBrowser) {
      return
    }

    if (options.millisecond) {
      microTick()
    }
    else {
      macroTick()
    }
  }

  const start = (time?: number) => {
    if (time) {
      options.time = time
      setRemain(time)
    }
    if (!counting) {
      endTime = Date.now() + remain.value
      counting = true
      tick()
    }
  }

  const reset = (totalTime: number = options.time!) => {
    pause()
    remain.value = totalTime
  }

  onBeforeUnmount(pause)

  onActivated(() => {
    if (deactivated) {
      counting = true
      deactivated = false
      tick()
    }
  })

  onDeactivated(() => {
    if (counting) {
      pause()
      deactivated = true
    }
  })

  return {
    start,
    pause,
    reset,
    current
  }
}
