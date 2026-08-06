<template>
  <el-card class="leave-form-card review-log-card" shadow="never">
    <div class="review-log-section">
      <div class="review-log-title">{{ t(`${i18nPrefix}.reviewLog`) }}</div>
      <el-table
        v-if="reviewLogTableRows.length"
        :data="reviewLogTableRows"
        :span-method="reviewLogSpanMethod"
        :row-class-name="reviewLogRowClassName"
        :max-height="420"
        size="small"
        class="review-log-table"
      >
        <el-table-column type="index" label="#" width="46" align="center" class-name="review-log-index-col" />
        <el-table-column
          prop="stepName"
          :label="t(`${i18nPrefix}.reviewLogStep`)"
          width="150"
          align="left"
        >
          <template #default="{ row }">
            <span class="review-log-step-cell">{{ row.stepName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="t(`${i18nPrefix}.reviewLogOperationUser`)"
          width="165"
          align="left"
        >
          <template #default="{ row }">
            <div class="review-log-user-wrap">
              <div class="review-log-user-main">
                <span class="review-log-user-cell">{{ row.originalUserName || row.operationUserName }}</span>
                <span
                  v-if="row.reviewType && row.reviewType.toLowerCase() === 'automatic'"
                  class="review-log-auto-badge"
                >{{ row.reviewTypeName }}</span>
              </div>
              <div
                v-if="showUserSubRow && ((row.operationUserName && row.originalUserName && row.operationUserName !== row.originalUserName) || (row.appointmentType && row.appointmentType.toLowerCase() !== 'actual'))"
                class="review-log-sub-row"
              >
                <span v-if="row.operationUserName && row.originalUserName && row.operationUserName !== row.originalUserName" class="review-log-original-cell">{{ row.operationUserName }}</span>
                <span v-if="row.appointmentType && row.appointmentType.toLowerCase() !== 'actual'" class="review-log-appointment-cell">{{ row.appointmentTypeName }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t(`${i18nPrefix}.reviewLogResult`)"
          width="95"
          align="left"
        >
          <template #default="{ row }">
            <div class="review-log-result-cell">
              <el-tag
                :type="getReviewResultTagType(row)"
                :class="{ 'review-log-tag--withdraw': isReviewWithdrawResult(row) }"
                size="small"
              >
                {{ row.reviewResultName }}
              </el-tag>
              <span
                v-if="isReviewRejectResult(row) && getReviewRejectStepName(row)"
                class="review-log-reject-step"
              >（{{ t(`${i18nPrefix}.reviewLogRejectToStep`, { step: getReviewRejectStepName(row) }) }}）</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t(`${i18nPrefix}.reviewLogComment`)"
          min-width="200"
        >
          <template #default="{ row }">
            <div class="review-log-comment-cell">{{ row.comment }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t(`${i18nPrefix}.reviewLogDateTime`)"
          width="180"
          align="center"
        >
          <template #default="{ row }">
            <span class="review-log-datetime-cell">{{ formatReviewDateTime(row.reviewDateTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-empty
        v-else
        :description="t(`${i18nPrefix}.reviewLogEmpty`)"
        style="padding: 20px 0;"
      />
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  records: { type: Array, default: () => [] },
  i18nPrefix: { type: String, required: true },
  showUserSubRow: { type: Boolean, default: true }
})

const { t } = useI18n()

/** 相邻同 stepId/stepName 的记录合并为一组，用于表格序号列合并 */
const groupedReviewRecords = computed(() => {
  const groups = []
  for (const record of props.records) {
    const key = record.stepId != null && String(record.stepId) !== ''
      ? String(record.stepId)
      : (record.stepName || '')
    const last = groups[groups.length - 1]
    const lastKey = last
      ? (last.stepId || last.stepName)
      : null
    if (last && lastKey === key) {
      last.records.push(record)
    } else {
      groups.push({ stepId: record.stepId || '', stepName: record.stepName || '', records: [record] })
    }
  }
  return groups
})

const reviewLogTableRows = computed(() => {
  const rows = []
  for (const group of groupedReviewRecords.value) {
    group.records.forEach((record, rIdx) => {
      rows.push({
        ...record,
        stepName: group.stepName,
        stepId: group.stepId,
        _rowSpan: rIdx === 0 ? group.records.length : 0
      })
    })
  }
  return rows
})

function reviewLogSpanMethod ({ columnIndex, rowIndex }) {
  if (columnIndex === 0) {
    const row = reviewLogTableRows.value[rowIndex]
    if (!row) return { rowspan: 1, colspan: 1 }
    return row._rowSpan > 0
      ? { rowspan: row._rowSpan, colspan: 1 }
      : { rowspan: 0, colspan: 0 }
  }
}

function reviewLogRowClassName ({ row }) {
  return isReviewWithdrawResult(row) ? 'review-log-row--withdraw' : ''
}

function isReviewWithdrawResult (row) {
  const code = String(row?.reviewResult ?? '').trim().toLowerCase()
  if (code === 'withdraw' || code === 'withdrawn') return true
  const name = String(row?.reviewResultName ?? '').trim().toLowerCase()
  return name === 'withdraw' || name === 'withdrawn' || name === '撤回'
}

function isReviewRejectResult (row) {
  const code = String(row?.reviewResult ?? '').trim().toLowerCase()
  if (code === 'reject' || code === 'rejected') return true
  const name = String(row?.reviewResultName ?? '').trim().toLowerCase()
  return name === '驳回' || name === 'reject' || name === 'rejected'
}

function getReviewRejectStepName (row) {
  const v = row?.rejectStepName ?? row?.RejectStepName
  if (v == null || v === '') return ''
  return String(v)
}

function getReviewResultTagType (row) {
  const code = String(row?.reviewResult ?? '').trim().toLowerCase()
  if (code === 'approve' || code === 'approved') return 'success'
  if (code === 'reject' || code === 'rejected') return 'danger'
  if (code === 'return') return 'warning'
  if (code === 'withdraw' || code === 'withdrawn') return 'info'
  const name = String(row?.reviewResultName ?? '').trim().toLowerCase()
  if (name === '通过' || name === 'approve' || name === 'approved') return 'success'
  if (name === '驳回' || name === 'reject' || name === 'rejected') return 'danger'
  if (name === '退回' || name === 'return') return 'warning'
  if (name === 'withdraw' || name === 'withdrawn' || name === '撤回') return 'info'
  return 'info'
}

/** 兼容 ISO、"/Date(ms)/"、"yyyy/MM/dd HH:mm:ss" 等多种后端日期格式 */
function formatReviewDateTime (val) {
  if (!val) return ''
  let d
  if (val instanceof Date) {
    d = val
  } else if (typeof val === 'number') {
    d = new Date(val)
  } else if (typeof val === 'string') {
    const s = val.trim()
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/)
    if (m) return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}`
    const slash = s.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/)
    if (slash) {
      const pad = (n) => String(n).padStart(2, '0')
      return `${slash[1]}-${pad(slash[2])}-${pad(slash[3])} ${pad(slash[4])}:${pad(slash[5])}:${pad(slash[6])}`
    }
    const msMatch = s.match(/\/Date\((\d+)\)\//)
    if (msMatch) {
      d = new Date(Number(msMatch[1]))
    } else {
      d = new Date(s.replace('T', ' ').replace(/Z$/, ''))
    }
  }
  if (!d || isNaN(d.getTime())) return typeof val === 'string' ? val : ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
</script>

<style scoped>
.review-log-card.leave-form-card {
  margin-top: 10px;
}

.review-log-section {
  padding: 0 20px 20px;
}

.review-log-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
}

.review-log-table {
  width: 100%;
}

.review-log-table :deep(.el-table__body .el-table__cell) {
  vertical-align: middle;
}

.review-log-table :deep(.review-log-row--withdraw > td.el-table__cell) {
  background-color: var(--el-fill-color-lighter);
  color: var(--el-text-color-secondary);
}

.review-log-table :deep(.review-log-row--withdraw .review-log-step-cell),
.review-log-table :deep(.review-log-row--withdraw .review-log-user-cell),
.review-log-table :deep(.review-log-row--withdraw .review-log-comment-cell),
.review-log-table :deep(.review-log-row--withdraw .review-log-original-cell),
.review-log-table :deep(.review-log-row--withdraw .review-log-appointment-cell) {
  color: var(--el-text-color-secondary);
}

.review-log-tag--withdraw {
  --el-tag-bg-color: var(--el-fill-color);
  --el-tag-border-color: var(--el-border-color-lighter);
  --el-tag-text-color: var(--el-text-color-secondary);
}

.review-log-step-cell {
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.review-log-datetime-cell {
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.review-log-user-wrap {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.review-log-user-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}

.review-log-auto-badge {
  flex-shrink: 0;
  margin-left: auto;
  font-size: 10px;
  line-height: 1.4;
  color: var(--el-color-info);
  background: var(--el-color-info-light-9);
  border-radius: 3px;
  padding: 0 4px;
  white-space: nowrap;
}

.review-log-user-cell {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  color: var(--el-text-color-primary);
  word-break: break-all;
}

.review-log-sub-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.review-log-original-cell {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.review-log-appointment-cell {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.review-log-result-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.review-log-reject-step {
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
  word-break: break-all;
}

.review-log-comment-cell {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
  font-size: 13px;
  color: var(--el-text-color-primary);
}
</style>
