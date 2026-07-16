<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="流程规则筛选">
        <el-form-item :label="$t('formbusiness.workflowrule.formGroupName')">
          <el-select v-model="searchForm.formGroupId" filterable style="width: 180px" @change="getFormTypeOptions">
            <el-option
              v-for="item in formGroupOptions"
              :key="item.formGroupId"
              :label="item.formGroupName"
              :value="item.formGroupId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('formbusiness.workflowrule.formTypeName')">
          <el-select v-model="searchForm.formTypeId" filterable style="width: 180px" @change="handleFilterChange">
            <el-option
              v-for="item in formTypeOptions"
              :key="item.formTypeId"
              :label="item.formTypeName"
              :value="item.formTypeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('formbusiness.workflowrule.positionName')">
          <el-select v-model="searchForm.positionId" filterable style="width: 180px" @change="handleFilterChange">
            <el-option :label="$t('formbusiness.workflowrule.pleaseSelect')" value="0" />
            <el-option
              v-for="item in positionOptions"
              :key="item.positionId"
              :label="item.positionName"
              :value="item.positionId"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-right-button">
          <el-button type="primary" @click="handleAdd">
            {{ $t('formbusiness.workflowrule.addRule') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="ruleList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        :empty-text="$t('common.noData')"
        >
          <el-table-column type="index" :label="$t('formbusiness.workflowrule.index')" width="70" align="center" fixed />
          <el-table-column prop="ruleNameCn" :label="$t('formbusiness.workflowrule.ruleNameCn')" align="left" min-width="200" show-overflow-tooltip />
          <el-table-column prop="ruleNameEn" :label="$t('formbusiness.workflowrule.ruleNameEn')" align="left" min-width="240" show-overflow-tooltip />
          <el-table-column prop="positionName" :label="$t('formbusiness.workflowrule.positionName')" align="left" min-width="120" />
          <el-table-column prop="guidance" :label="$t('formbusiness.workflowrule.guidance')" align="left" min-width="160" show-overflow-tooltip />
          <el-table-column prop="version" :label="$t('formbusiness.workflowrule.version')" width="90" align="center" />
          <el-table-column :label="$t('formbusiness.workflowrule.effectiveStartTime')" width="180" align="center">
            <template #default="{ row }">{{ formatDateTime(row.effectiveStartTime) }}</template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.workflowrule.effectiveEndTime')" width="180" align="center">
            <template #default="{ row }">{{ row.effectiveEndTime ? formatDateTime(row.effectiveEndTime) : $t('formbusiness.workflowrule.unlimited') }}</template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.workflowrule.operation')" width="200" align="center" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleEdit(row)" plain>
                {{ $t('formbusiness.workflowrule.editRule') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">
                {{ $t('formbusiness.workflowrule.deleteRule') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.pageIndex"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="getRuleList"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? $t('formbusiness.workflowrule.editRule') : $t('formbusiness.workflowrule.addRule')"
      width="50%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="true"
      @close="handleDialogClose"
    >
      <div v-loading="dialogLoading">
        <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogFormRules" label-width="auto" class="dialog-form">
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowrule.formGroupName')" prop="formGroupId">
              <el-select
                v-model="dialogForm.formGroupId"
                :placeholder="$t('formbusiness.workflowrule.pleaseSelectFormGroup')"
                filterable
                style="width:100%"
                :disabled="isEditMode"
                @change="handleDialogFormGroupChange"
              >
                <el-option
                  v-for="item in formGroupOptions"
                  :key="item.formGroupId"
                  :label="item.formGroupName"
                  :value="item.formGroupId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowrule.formTypeName')" prop="formTypeId">
              <el-select
                v-model="dialogForm.formTypeId"
                :placeholder="$t('formbusiness.workflowrule.pleaseSelectFormType')"
                filterable
                style="width:100%"
                :disabled="isEditMode"
              >
                <el-option
                  v-for="item in dialogFormTypeOptions"
                  :key="item.formTypeId"
                  :label="item.formTypeName"
                  :value="item.formTypeId"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowrule.ruleNameCn')" prop="ruleNameCn">
              <el-input
                v-model="dialogForm.ruleNameCn"
                :placeholder="$t('formbusiness.workflowrule.pleaseInputRuleNameCn')"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowrule.ruleNameEn')" prop="ruleNameEn">
              <el-input
                v-model="dialogForm.ruleNameEn"
                :placeholder="$t('formbusiness.workflowrule.pleaseInputRuleNameEn')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowrule.positionName')" prop="positionId">
              <el-select v-model="dialogForm.positionId" filterable style="width:100%">
                <el-option :label="$t('formbusiness.workflowrule.other')" value="0" />
                <el-option
                  v-for="item in positionOptions"
                  :key="item.positionId"
                  :label="item.positionName"
                  :value="item.positionId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowrule.guidance')" prop="guidance">
              <el-input
                v-model="dialogForm.guidance"
                :placeholder="$t('formbusiness.workflowrule.pleaseInputGuidance')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowrule.effectiveStartTime')" prop="effectiveStartTime">
              <el-date-picker
                v-model="dialogForm.effectiveStartTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="$t('formbusiness.workflowrule.pleaseSelectEffectiveStartTime')"
                style="width:100%"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowrule.effectiveEndTime')" prop="effectiveEndTime">
              <el-date-picker
                v-model="dialogForm.effectiveEndTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                :placeholder="$t('formbusiness.workflowrule.effectiveEndTimeEmptyHint')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowrule.version')" prop="version">
              <el-input
                v-model="dialogForm.version"
                :placeholder="$t('formbusiness.workflowrule.pleaseInputVersion')"
                style="width:200px"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowrule.sortOrder')">
              <el-input-number v-model="dialogForm.sortOrder" :min="0" :max="9999" style="width:200px" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import {
  GET_FORMGROUP_DROPDOWN_API,
  GET_FORMTYPE_DROPDOWN_API,
  GET_POSITION_LIST_API,
  INSERT_WORKFLOWRULE_API,
  DELETE_WORKFLOWRULE_API,
  UPDATE_WORKFLOWRULE_API,
  GET_WORKFLOWRULE_ENTITY_API,
  GET_WORKFLOWRULE_PAGE_API
} from '@/config/api/formbusiness/form-workflow/workflowrule.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const FORM_DATA_OPTIONS = { headers: { 'Content-Type': 'multipart/form-data' }, skipDedupe: true }
// 最小 loading 显示时间，避免接口太快导致动画一闪而过
const MIN_LOADING_DURATION = 300

const buildFormData = (params) => {
  const fd = new FormData()
  Object.entries(params).forEach(([k, v]) => fd.append(k, v ?? ''))
  return fd
}

const isSuccess = (code) => code === 200 || code === '200'

const formatDateTime = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// 后端以 T 分隔的 ISO 格式接收/返回时间，日期选择器内部用空格分隔，两者之间转换
const toISODateTime = (str) => (str ? str.replace(' ', 'T') : null)

const loading = ref(false)
const ruleList = ref([])
const formGroupOptions = ref([])
const formTypeOptions = ref([])
const dialogFormTypeOptions = ref([])
const positionOptions = ref([])

const searchForm = reactive({ formGroupId: '', formTypeId: '', positionId: '0' })
const pagination = reactive({ pageIndex: 1, pageSize: 20, totalCount: 0 })

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const getPositionOptions = async () => {
  try {
    const res = await post(GET_POSITION_LIST_API, {})
    if (res.code === 200) positionOptions.value = res.data || []
  } catch {
    showMessage(t('formbusiness.workflowrule.getPositionFailed'))
  }
}

const getFormGroupOptions = async () => {
  try {
    const res = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (res.code === 200) {
      formGroupOptions.value = res.data || []
      if (formGroupOptions.value.length > 0 && !searchForm.formGroupId) {
        searchForm.formGroupId = formGroupOptions.value[0].formGroupId
        await getFormTypeOptions(searchForm.formGroupId)
      }
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.workflowrule.getFormGroupFailed'))
  }
}

const getFormTypeOptions = async (formGroupId) => {
  if (!formGroupId) {
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    await getRuleList()
    return
  }
  try {
    const res = await post(GET_FORMTYPE_DROPDOWN_API, buildFormData({ formGroupId }), FORM_DATA_OPTIONS)
    if (res.code === 200) {
      formTypeOptions.value = res.data || []
      searchForm.formTypeId = formTypeOptions.value[0]?.formTypeId ?? ''
    } else {
      showMessage(res.message)
      formTypeOptions.value = []
      searchForm.formTypeId = ''
    }
  } catch {
    showMessage(t('formbusiness.workflowrule.getFormTypeFailed'))
    formTypeOptions.value = []
    searchForm.formTypeId = ''
  }
  await getRuleList()
}

let ruleListSeq = 0
const getRuleList = async () => {
  const seq = ++ruleListSeq
  loading.value = true
  const start = Date.now()
  try {
    if (!searchForm.formTypeId) {
      ruleList.value = []
      pagination.totalCount = 0
      return
    }
    const res = await post(GET_WORKFLOWRULE_PAGE_API, {
      formTypeId: searchForm.formTypeId,
      positionId: searchForm.positionId ?? '',
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    })
    if (seq !== ruleListSeq) return
    if (res.code === 200) {
      ruleList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showMessage(res.message)
      ruleList.value = []
    }
  } catch {
    if (seq === ruleListSeq) showMessage(t('formbusiness.workflowrule.getFailed'))
    ruleList.value = []
  } finally {
    if (seq === ruleListSeq) {
      const elapsed = Date.now() - start
      if (elapsed < MIN_LOADING_DURATION) {
        await new Promise(r => setTimeout(r, MIN_LOADING_DURATION - elapsed))
      }
      if (seq === ruleListSeq) loading.value = false
    }
  }
}

const handleFilterChange = () => {
  pagination.pageIndex = 1
  getRuleList()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getRuleList()
}

const dialogVisible = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const dialogFormRef = ref(null)
const isEditMode = ref(false)

const dialogForm = reactive({
  ruleId: '',
  formGroupId: '',
  formTypeId: '',
  ruleNameCn: '',
  ruleNameEn: '',
  positionId: '0',
  guidance: '',
  sortOrder: 0,
  version: '',
  effectiveStartTime: '',
  effectiveEndTime: ''
})

const dialogFormRules = {
  formGroupId: [{ required: true, message: () => t('formbusiness.workflowrule.pleaseSelectFormGroup'), trigger: 'change' }],
  formTypeId:  [{ required: true, message: () => t('formbusiness.workflowrule.pleaseSelectFormType'),  trigger: 'change' }],
  ruleNameCn:  [{ required: true, message: () => t('formbusiness.workflowrule.pleaseInputRuleNameCn'), trigger: 'blur'   }],
  ruleNameEn:  [{ required: true, message: () => t('formbusiness.workflowrule.pleaseInputRuleNameEn'), trigger: 'blur'   }],
  positionId:  [{ required: true, message: () => t('formbusiness.workflowrule.pleaseSelectPosition'),  trigger: 'change' }],
  guidance:    [],
  effectiveStartTime: [{ required: true, message: () => t('formbusiness.workflowrule.pleaseSelectEffectiveStartTime'), trigger: 'change' }]
}

const resetDialogForm = () => {
  // ruleId 不在 el-form-item prop 里，resetFields 不会重置，需手动清
  dialogForm.ruleId = ''
  dialogForm.positionId = '0'
  dialogForm.version = ''
  dialogForm.effectiveStartTime = ''
  dialogForm.effectiveEndTime = ''
}

const loadDialogFormTypeOptions = async (formGroupId) => {
  if (!formGroupId) { dialogFormTypeOptions.value = []; return }
  try {
    const res = await post(GET_FORMTYPE_DROPDOWN_API, buildFormData({ formGroupId }), FORM_DATA_OPTIONS)
    dialogFormTypeOptions.value = res.code === 200 ? (res.data || []) : []
  } catch {
    dialogFormTypeOptions.value = []
  }
}

const handleDialogFormGroupChange = async (val) => {
  dialogForm.formTypeId = ''
  dialogFormTypeOptions.value = []
  if (!val) return
  dialogLoading.value = true
  try {
    await loadDialogFormTypeOptions(val)
    if (dialogFormTypeOptions.value.length > 0) {
      dialogForm.formTypeId = dialogFormTypeOptions.value[0].formTypeId
    }
  } finally {
    dialogLoading.value = false
  }
}

const handleAdd = async () => {
  isEditMode.value = false
  dialogVisible.value = true
  dialogLoading.value = true
  try {
    const formGroupId = searchForm.formGroupId || formGroupOptions.value[0]?.formGroupId || ''
    if (formGroupId) {
      dialogForm.formGroupId = formGroupId
      await loadDialogFormTypeOptions(formGroupId)
      if (searchForm.formTypeId && dialogFormTypeOptions.value.some(i => i.formTypeId === searchForm.formTypeId)) {
        dialogForm.formTypeId = searchForm.formTypeId
      } else {
        dialogForm.formTypeId = dialogFormTypeOptions.value[0]?.formTypeId ?? ''
      }
    }
    if (!dialogForm.positionId) {
      dialogForm.positionId = '0'
    }
  } finally {
    dialogLoading.value = false
    nextTick(() => dialogFormRef.value?.clearValidate())
  }
}

const handleEdit = async (row) => {
  dialogVisible.value = true
  dialogLoading.value = true
  try {
    const res = await post(GET_WORKFLOWRULE_ENTITY_API, buildFormData({ ruleId: row.ruleId }), FORM_DATA_OPTIONS)
    if (res.code === 200 && res.data) {
      isEditMode.value = true
      const d = res.data
      dialogForm.ruleId      = d.ruleId      || ''
      dialogForm.formGroupId = d.formGroupId || searchForm.formGroupId || ''
      dialogForm.formTypeId  = d.formTypeId  || searchForm.formTypeId  || ''
      dialogForm.ruleNameCn  = d.ruleNameCn  || ''
      dialogForm.ruleNameEn  = d.ruleNameEn  || ''
      dialogForm.positionId  = d.positionId  || '0'
      dialogForm.guidance    = d.guidance    || ''
      dialogForm.sortOrder   = Number(d.sortOrder ?? 0)
      dialogForm.version     = d.version || ''
      dialogForm.effectiveStartTime = formatDateTime(d.effectiveStartTime)
      dialogForm.effectiveEndTime   = formatDateTime(d.effectiveEndTime)
      if (dialogForm.formGroupId) await loadDialogFormTypeOptions(dialogForm.formGroupId)
      nextTick(() => dialogFormRef.value?.clearValidate())
    } else {
      dialogVisible.value = false
      showMessage(res.message || t('formbusiness.workflowrule.getEntityFailed'))
    }
  } catch {
    dialogVisible.value = false
    showMessage(t('formbusiness.workflowrule.getEntityFailed'))
  } finally {
    dialogLoading.value = false
  }
}

const handleDialogClose = () => {
  dialogFormRef.value?.resetFields()
  resetDialogForm()
  dialogFormTypeOptions.value = []
  isEditMode.value = false
}

const handleSubmit = async () => {
  if (!dialogFormRef.value) return
  try {
    await dialogFormRef.value.validate()
  } catch {
    return
  }
  submitLoading.value = true
  const isEdit = isEditMode.value
  try {
    const params = {
      ruleId:      dialogForm.ruleId || '',
      formTypeId:  dialogForm.formTypeId,
      ruleNameCn:  dialogForm.ruleNameCn,
      ruleNameEn:  dialogForm.ruleNameEn,
      positionId:  dialogForm.positionId === '0' ? null : dialogForm.positionId,
      guidance:    dialogForm.guidance || null,
      sortOrder:   dialogForm.sortOrder,
      version:     dialogForm.version,
      effectiveStartTime: toISODateTime(dialogForm.effectiveStartTime),
      effectiveEndTime:   toISODateTime(dialogForm.effectiveEndTime)
    }
    const api        = isEdit ? UPDATE_WORKFLOWRULE_API : INSERT_WORKFLOWRULE_API
    const successKey = isEdit ? 'editSuccess' : 'addSuccess'
    const failKey    = isEdit ? 'editFailed'  : 'addFailed'
    const res = await post(api, params)
    if (isSuccess(res.code)) {
      showMessage(res.message || t(`formbusiness.workflowrule.${successKey}`), 'success')
      dialogVisible.value = false
      if (dialogForm.formTypeId === searchForm.formTypeId) await getRuleList()
    } else {
      showMessage(res.message || t(`formbusiness.workflowrule.${failKey}`))
    }
  } catch {
    showMessage(t(`formbusiness.workflowrule.${isEdit ? 'editFailed' : 'addFailed'}`))
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.workflowrule.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  loading.value = true
  try {
    const res = await post(DELETE_WORKFLOWRULE_API, buildFormData({ ruleId: row.ruleId }), FORM_DATA_OPTIONS)
    if (isSuccess(res.code)) {
      showMessage(res.message || t('formbusiness.workflowrule.deleteSuccess'), 'success')
      if (ruleList.value.length === 1 && pagination.pageIndex > 1) pagination.pageIndex--
      await getRuleList()
    } else {
      showMessage(res.message || t('formbusiness.workflowrule.deleteFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowrule.deleteFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([getFormGroupOptions(), getPositionOptions()])
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
