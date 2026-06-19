const APPLICANT_DATE_FIELDS = [
  'applicantDate',
  'ApplicantDate',
  'applyDate',
  'ApplyDate',
  'applicantTime',
  'ApplicantTime',
  'createDate',
  'CreateDate',
  'createTime',
  'CreateTime'
]

const pad2 = (n) => String(n).padStart(2, '0')

const formatDateParts = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

/** .NET 空日期、年份异常等视为无效 */
export function isInvalidApplicantDateValue (val) {
  if (val === undefined || val === null || val === '') return true
  const text = String(val).trim()
  if (!text) return true
  if (/^0001[-/]01[-/]01/.test(text)) return true

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso && Number(iso[1]) < 1900) return true

  const d = new Date(text.includes(' ') && !text.includes('T') ? text.replace(' ', 'T') : text)
  if (!Number.isNaN(d.getTime()) && d.getFullYear() < 1900) return true

  return false
}

/** 按字段顺序取第一个有效申请日期 */
export function resolveApplicantDate (row) {
  if (!row) return ''
  for (const key of APPLICANT_DATE_FIELDS) {
    const val = row[key]
    if (!isInvalidApplicantDateValue(val)) return val
  }
  return ''
}

export function formatApplicantDate (val) {
  if (isInvalidApplicantDateValue(val)) return '-'

  const text = String(val).trim()
  const msMatch = text.match(/\/Date\((\d+)\)\//)
  if (msMatch) {
    const d = new Date(Number(msMatch[1]))
    if (!Number.isNaN(d.getTime()) && d.getFullYear() >= 1900) return formatDateParts(d)
  }

  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso && Number(iso[1]) >= 1900) return `${iso[1]}-${iso[2]}-${iso[3]}`

  const slash = text.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/)
  if (slash && Number(slash[1]) >= 1900) {
    return `${slash[1]}-${pad2(slash[2])}-${pad2(slash[3])}`
  }

  const d = new Date(text.includes(' ') && !text.includes('T') ? text.replace(' ', 'T') : text)
  if (!Number.isNaN(d.getTime()) && d.getFullYear() >= 1900) return formatDateParts(d)

  return text.length >= 10 ? text.slice(0, 10) : text
}
