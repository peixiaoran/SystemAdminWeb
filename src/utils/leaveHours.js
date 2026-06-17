/**
 * 请假总时数：开始/结束时间须在 08:00-12:00 或 13:00-17:00；
 * 仅统计上述工作时段，12:00-13:00 午休不计；单日最多 8 小时。
 */

const MAX_HOURS_PER_DAY = 8

export function parseLeaveDateTime (val) {
  if (!val) return null
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val
  const s = String(val).trim().replace(' ', 'T').replace(/\.\d+$/, '')
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

/** 开始/结束时间点是否落在 08:00-12:00 或 13:00-17:00 */
export function isLeaveDateTimeInWorkRange (date) {
  if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) return false
  const minutes = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60
  return (minutes >= 8 * 60 && minutes <= 12 * 60) ||
    (minutes >= 13 * 60 && minutes <= 17 * 60)
}

/** 起止时间有效且均在允许的工作时段内 */
export function isLeaveTimeRangeAllowed (startStr, endStr) {
  const start = parseLeaveDateTime(startStr)
  const end = parseLeaveDateTime(endStr)
  if (!start || !end || end <= start) return false
  return isLeaveDateTimeInWorkRange(start) && isLeaveDateTimeInWorkRange(end)
}

function atTime (baseDate, hour, minute = 0, second = 0) {
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hour,
    minute,
    second,
    0
  )
}

function floorDate (date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function overlapHours (rangeStart, rangeEnd, periodStart, periodEnd) {
  const start = Math.max(rangeStart.getTime(), periodStart.getTime())
  const end = Math.min(rangeEnd.getTime(), periodEnd.getTime())
  if (end <= start) return 0
  return (end - start) / 3600000
}

/** 单日有效工时：仅 8-12、13-17，扣除午休，上限 8 小时 */
function hoursInAllowedWindows (segStart, segEnd) {
  if (!segStart || !segEnd || segEnd <= segStart) return 0

  const day = floorDate(segStart)
  let hours = 0
  hours += overlapHours(segStart, segEnd, atTime(day, 8, 0, 0), atTime(day, 12, 0, 0))
  hours += overlapHours(segStart, segEnd, atTime(day, 13, 0, 0), atTime(day, 17, 0, 0))
  return Math.min(hours, MAX_HOURS_PER_DAY)
}

/**
 * 计算请假总时数（小时，保留两位小数）
 * 起止不在允许时段内时返回 0
 */
export function calculateLeaveTotalHours (startStr, endStr) {
  const start = parseLeaveDateTime(startStr)
  const end = parseLeaveDateTime(endStr)
  if (!start || !end || end <= start) return 0
  if (!isLeaveTimeRangeAllowed(startStr, endStr)) return 0

  const startDay = floorDate(start)
  const endDay = floorDate(end)
  let total = 0

  for (
    let cursor = new Date(startDay);
    cursor.getTime() <= endDay.getTime();
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)
  ) {
    const isFirst = cursor.getTime() === startDay.getTime()
    const isLast = cursor.getTime() === endDay.getTime()
    const dayAt8 = atTime(cursor, 8, 0, 0)
    const dayAt17 = atTime(cursor, 17, 0, 0)

    let segStart
    let segEnd

    if (isFirst && isLast) {
      segStart = start
      segEnd = end
    } else if (isFirst) {
      segStart = start
      segEnd = dayAt17
    } else if (isLast) {
      segStart = dayAt8
      segEnd = end
    } else {
      segStart = dayAt8
      segEnd = dayAt17
    }

    if (segEnd > segStart) {
      total += hoursInAllowedWindows(segStart, segEnd)
    }
  }

  return parseFloat(total.toFixed(2))
}
