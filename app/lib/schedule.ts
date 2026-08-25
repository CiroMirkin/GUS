import { Schedule } from "@/types/subject"

const DAYS_MAP: Record<string, number> = {
  "Domingo": 0,
  "Lunes": 1,
  "Martes": 2,
  "Miércoles": 3,
  "Jueves": 4,
  "Viernes": 5,
  "Sábado": 6,
}

export type ScheduleStatus = "not-today" | "tomorrow" | "no-time" | "before" | "during" | "after"

export interface ScheduleTimeInfo {
  status: ScheduleStatus
  minutesUntilStart: number | null
  minutesUntilEnd: number | null
}

function parseTimeToday(time: string, now: Date): Date {
  const [hours, minutes] = time.split(":").map(Number)
  const date = new Date(now)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export function getScheduleTimeInfo(schedule: Schedule, now: Date = new Date()): ScheduleTimeInfo {
  const scheduleDay = DAYS_MAP[schedule.day]
  const todayIndex = now.getDay()
  const tomorrowIndex = (todayIndex + 1) % 7

  if (scheduleDay === tomorrowIndex) {
    return { status: "tomorrow", minutesUntilStart: null, minutesUntilEnd: null }
  }

  if (scheduleDay !== todayIndex) {
    return { status: "not-today", minutesUntilStart: null, minutesUntilEnd: null }
  }

  if (!schedule.startTime || !schedule.endTime) {
    return { status: "no-time", minutesUntilStart: null, minutesUntilEnd: null }
  }

  const start = parseTimeToday(schedule.startTime, now)
  const end = parseTimeToday(schedule.endTime, now)

  if (now < start) {
    const minutesUntilStart = Math.ceil((start.getTime() - now.getTime()) / 60000)
    return { status: "before", minutesUntilStart, minutesUntilEnd: null }
  }

  if (now >= start && now <= end) {
    const minutesUntilEnd = Math.ceil((end.getTime() - now.getTime()) / 60000)
    return { status: "during", minutesUntilStart: null, minutesUntilEnd }
  }

  return { status: "after", minutesUntilStart: null, minutesUntilEnd: null }
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0 && mins > 0) return `${hours}h ${mins}min`
  if (hours > 0) return `${hours}h`
  return `${mins}min`
}

const TODAY_STATUSES: ScheduleStatus[] = ["before", "during", "after", "no-time"]

export function getUpcomingScheduleLabel(schedules?: Schedule[], now: Date = new Date()): string | null {
  if (!schedules || schedules.length === 0) return null

  const todaySchedule = schedules.find(
    (schedule) => TODAY_STATUSES.includes(getScheduleTimeInfo(schedule, now).status)
  )
  if (todaySchedule) {
    return `Hoy ${todaySchedule.startTime ? `${todaySchedule.startTime}hs` : ""}`
  }

  const tomorrowSchedule = schedules.find(
    (schedule) => getScheduleTimeInfo(schedule, now).status === "tomorrow"
  )
  if (tomorrowSchedule) {
    return `Mañana ${tomorrowSchedule.startTime ? `${tomorrowSchedule.startTime}hs` : ""}`
  }

  return null
}

export interface ProximateScheduleInfo extends ScheduleTimeInfo {
  schedule: Schedule
}

const STATUS_RANK: Record<ScheduleStatus, number> = {
  "during": 0,
  "before": 1,
  "no-time": 2,
  "tomorrow": 3,
  "not-today": 4,
  "after": 5,
}

function getDaysUntil(schedule: Schedule, now: Date): number {
  const scheduleDay = DAYS_MAP[schedule.day]
  const todayIndex = now.getDay()
  return (scheduleDay - todayIndex + 7) % 7
}

export function getMostProximateSchedule(schedules?: Schedule[], now: Date = new Date()): ProximateScheduleInfo | null {
  if (!schedules || schedules.length === 0) return null

  let best: ProximateScheduleInfo | null = null
  let bestDaysUntil = Infinity

  for (const schedule of schedules) {
    const info = getScheduleTimeInfo(schedule, now)
    const daysUntil = getDaysUntil(schedule, now)

    if (!best) {
      best = { schedule, ...info }
      bestDaysUntil = daysUntil
      continue
    }

    const currentRank = STATUS_RANK[info.status]
    const bestRank = STATUS_RANK[best.status]

    if (currentRank < bestRank) {
      best = { schedule, ...info }
      bestDaysUntil = daysUntil
      continue
    }

    if (currentRank === bestRank) {
      if (daysUntil !== bestDaysUntil) {
        if (daysUntil < bestDaysUntil) {
          best = { schedule, ...info }
          bestDaysUntil = daysUntil
        }
        continue
      }

      const currentMinutes = info.minutesUntilStart ?? info.minutesUntilEnd ?? Infinity
      const bestMinutes = best.minutesUntilStart ?? best.minutesUntilEnd ?? Infinity
      if (currentMinutes < bestMinutes) {
        best = { schedule, ...info }
      }
    }
  }

  return best
}

function getStartMinutes(schedule: Schedule): number {
  if (!schedule.startTime) return Infinity
  const [hours, minutes] = schedule.startTime.split(":").map(Number)
  return hours * 60 + minutes
}

export function sortSchedulesByDay(schedules: Schedule[]): Schedule[] {
  return [...schedules].sort((a, b) => {
    const dayA = DAYS_MAP[a.day]
    const dayB = DAYS_MAP[b.day]

    if (dayA !== dayB) return dayA - dayB

    return getStartMinutes(a) - getStartMinutes(b)
  })
}

export function getScheduleDuration(schedule: Schedule): string | null {
  if (!schedule.startTime || !schedule.endTime) {
    return null
  }

  const now = new Date()
  const start = parseTimeToday(schedule.startTime, now)
  const end = parseTimeToday(schedule.endTime, now)

  let diffMs = end.getTime() - start.getTime()
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000 // cruza medianoche
  }

  const diffMinutes = Math.round(diffMs / 60000)
  return formatMinutes(diffMinutes)
}

export interface UpcomingScheduleInfo {
  label: string
  isToday: boolean
  status: ScheduleStatus
  minutesUntilStart: number | null
  minutesUntilEnd: number | null
}

export function getUpcomingScheduleInfo(
  schedules?: Schedule[], now: Date = new Date()
): UpcomingScheduleInfo | null {
  if (!schedules || schedules.length === 0) return null

  const todaySchedule = schedules.find(
    (schedule) => TODAY_STATUSES.includes(getScheduleTimeInfo(schedule, now).status)
  )
  if (todaySchedule) {
    const info = getScheduleTimeInfo(todaySchedule, now)
    const label = `Hoy ${todaySchedule.startTime ? `${todaySchedule.startTime}hs` : ""}`

    return { label, isToday: true, ...info }
  }

  const tomorrowSchedule = schedules.find(
    (schedule) => getScheduleTimeInfo(schedule, now).status === "tomorrow"
  )
  if (tomorrowSchedule) {
    const label = `Mañana ${tomorrowSchedule.startTime ? `${tomorrowSchedule.startTime}hs` : ""}`
    return { label, isToday: false, status: "tomorrow", minutesUntilStart: null, minutesUntilEnd: null }
  }

  return null
}
