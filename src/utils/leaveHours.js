/**
 * 请假总时数：工作日 8:00-17:00 计工时，12:00-13:00 午休不计；
 * 首日开始早于 8:00 的时段计入；末日结束晚于 17:00 的时段计入。
 */

export function parseLeaveDateTime (val) {
  if (!val) return null
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val
  const s = String(val).trim().replace(' ', 'T').replace(/\.\d+$/, '')
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
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

/**
 * 单日时段内按规则累计小时数
 */
function hoursForDaySegment (segStart, segEnd, { allowBeforeEight, allowAfterSeventeen }) {
  if (!segStart || !segEnd || segEnd <= segStart) return 0

  const day = floorDate(segStart)
  const dayEnd = atTime(day, 24, 0, 0)
  let hours = 0

  if (allowBeforeEight) {
    hours += overlapHours(segStart, segEnd, atTime(day, 0, 0, 0), atTime(day, 8, 0, 0))
  }

  hours += overlapHours(segStart, segEnd, atTime(day, 8, 0, 0), atTime(day, 12, 0, 0))
  hours += overlapHours(segStart, segEnd, atTime(day, 13, 0, 0), atTime(day, 17, 0, 0))

  if (allowAfterSeventeen) {
    hours += overlapHours(segStart, segEnd, atTime(day, 17, 0, 0), dayEnd)
  }

  return hours
}

/**
 * 计算请假总时数（小时，保留两位小数）
 */
export function calculateLeaveTotalHours (startStr, endStr) {
  const start = parseLeaveDateTime(startStr)
  const end = parseLeaveDateTime(endStr)
  if (!start || !end || end <= start) return 0

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
    let allowBeforeEight = false
    let allowAfterSeventeen = false

    if (isFirst && isLast) {
      segStart = start
      segEnd = end
      allowBeforeEight = true
      allowAfterSeventeen = true
    } else if (isFirst) {
      segStart = start
      segEnd = dayAt17
      allowBeforeEight = true
      allowAfterSeventeen = false
    } else if (isLast) {
      segStart = dayAt8
      segEnd = end
      allowBeforeEight = false
      allowAfterSeventeen = true
    } else {
      segStart = dayAt8
      segEnd = dayAt17
      allowBeforeEight = false
      allowAfterSeventeen = false
    }

    if (segEnd > segStart) {
      total += hoursForDaySegment(segStart, segEnd, { allowBeforeEight, allowAfterSeventeen })
    }
  }

  return parseFloat(total.toFixed(2))
}
