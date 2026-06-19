<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" :aria-label="$t('formbusiness.workflowrulestep.title')">
        <el-form-item :label="$t('formbusiness.workflowrulestep.formGroupName')">
          <el-select v-model="searchForm.formGroupId" filterable style="width: 180px" @change="getFormTypeOptions">
            <el-option
              v-for="item in formGroupOptions"
              :key="item.formGroupId"
              :label="item.formGroupName"
              :value="item.formGroupId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('formbusiness.workflowrulestep.formTypeName')">
          <el-select v-model="searchForm.formTypeId" filterable style="width: 180px" @change="getRuleOptions">
            <el-option
              v-for="item in formTypeOptions"
              :key="item.formTypeId"
              :label="item.formTypeName"
              :value="item.formTypeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('formbusiness.workflowrulestep.rule')">
          <el-select v-model="searchForm.ruleId" filterable style="width: 220px" @change="getRuleStepList">
            <el-option
              v-for="item in ruleOptions"
              :key="item.ruleId"
              :label="item.ruleName"
              :value="item.ruleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-right-button">
          <el-button type="primary" @click="handleAdd">
            {{ $t('formbusiness.workflowrulestep.addRuleStep') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="ruleStepList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        :empty-text="$t('common.noData')"
        >
          <el-table-column type="index" :label="$t('formbusiness.workflowrulestep.index')" width="70" align="center" fixed />
          <el-table-column prop="currentStepName" :label="$t('formbusiness.workflowrulestep.currentStepName')" align="left" min-width="180" show-overflow-tooltip />
          <el-table-column :label="$t('formbusiness.workflowrulestep.nextStepName')" align="left" min-width="180" show-overflow-tooltip>
            <template #default="{ row }">
              {{ isNextStepEnd(row.nextStepId) ? $t('formbusiness.workflowrulestep.nextStepEnd') : (row.nextStepName || '') }}
            </template>
          </el-table-column>
          <el-table-column prop="guidance" :label="$t('formbusiness.workflowrulestep.guidance')" align="left" min-width="160" show-overflow-tooltip />
          <el-table-column prop="sortOrder" :label="$t('formbusiness.workflowrulestep.sortOrder')" width="90" align="center" />
          <el-table-column :label="$t('formbusiness.workflowrulestep.operation')" width="220" align="center" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleEdit(row)" plain>
                {{ $t('formbusiness.workflowrulestep.editRuleStep') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">
                {{ $t('formbusiness.workflowrulestep.deleteRuleStep') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEditMode ? $t('formbusiness.workflowrulestep.editRuleStep') : $t('formbusiness.workflowrulestep.addRuleStep')"
      width="50%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="true"
      @close="handleDialogClose"
    >
      <div v-loading="dialogLoading">
        <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogFormRules" label-width="auto" class="dialog-form">
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowrulestep.formGroupName')" prop="formGroupId">
              <el-select
                v-model="dialogForm.formGroupId"
                :placeholder="$t('formbusiness.workflowrulestep.pleaseSelectFormGroup')"
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
            <el-form-item :label="$t('formbusiness.workflowrulestep.formTypeName')" prop="formTypeId">
              <el-select
                v-model="dialogForm.formTypeId"
                :placeholder="$t('formbusiness.workflowrulestep.pleaseSelectFormType')"
                filterable
                style="width:100%"
                :disabled="isEditMode"
                @change="handleDialogFormTypeChange"
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
            <el-form-item :label="$t('formbusiness.workflowrulestep.rule')" prop="ruleId">
              <el-select
                v-model="dialogForm.ruleId"
                :placeholder="$t('formbusiness.workflowrulestep.pleaseSelectRule')"
                filterable
                style="width:100%"
                :disabled="isEditMode"
              >
                <el-option
                  v-for="item in dialogRuleOptions"
                  :key="item.ruleId"
                  :label="item.ruleName"
                  :value="item.ruleId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowrulestep.sortOrder')">
              <el-input-number v-model="dialogForm.sortOrder" :min="0" :max="9999" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowrulestep.currentStepName')" prop="currentStepId">
              <el-select
                v-model="dialogForm.currentStepId"
                :placeholder="$t('formbusiness.workflowrulestep.pleaseSelectCurrentStep')"
                filterable
                style="width:100%"
                :disabled="isEditMode"
              >
                <el-option
                  v-for="item in dialogStepOptions"
                  :key="item.stepId"
                  :label="item.stepName"
                  :value="item.stepId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowrulestep.nextStepName')" prop="nextStepId">
              <el-select
                v-model="dialogForm.nextStepId"
                :placeholder="$t('formbusiness.workflowrulestep.pleaseSelectNextStep')"
                filterable
                style="width:100%"
              >
                <el-option
                  :value="NEXT_STEP_END_ID"
                  :label="$t('formbusiness.workflowrulestep.nextStepEnd')"
                />
                <el-option
                  v-for="item in dialogStepOptions"
                  :key="item.stepId"
                  :label="item.stepName"
                  :value="item.stepId"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowrulestep.guidance')" prop="guidance">
              <el-input
                v-model="dialogForm.guidance"
                :placeholder="$t('formbusiness.workflowrulestep.pleaseInputGuidance')"
                clearable
                style="width:100%"
              />
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
  GET_WORKFLOWRULE_DROPDOWN_API,
  GET_WORKFLOWSTEP_DROPDOWN_API,
  INSERT_WORKFLOWRULESTEP_API,
  DELETE_WORKFLOWRULESTEP_API,
  UPDATE_WORKFLOWRULESTEP_API,
  GET_WORKFLOWRULESTEP_ENTITY_API,
  GET_WORKFLOWRULESTEP_LIST_API
} from '@/config/api/formbusiness/form-workflow/workflowrulestep.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// nextStepId 为 "0" 或 null 表示流程结束（后端 NextStepId 为 string 类型）
const NEXT_STEP_END_ID = '0'
const FORM_DATA_OPTIONS = { headers: { 'Content-Type': 'multipart/form-data' }, skipDedupe: true }
// 最小 loading 显示时间，避免接口太快导致动画一闪而过
const MIN_LOADING_DURATION = 300

const isNextStepEnd = (id) => {
  if (id === null || id === undefined) return true
  if (id === '') return false
  return id === 0 || id === '0' || Number(id) === 0
}

const normalizeNextStepIdForForm = (val) => {
  if (val === null || val === undefined) return NEXT_STEP_END_ID
  if (val === '') return ''
  return isNextStepEnd(val) ? NEXT_STEP_END_ID : val
}

const isSuccess = (code) => code === 200 || code === '200'

const buildFormData = (params) => {
  const fd = new FormData()
  Object.entries(params).forEach(([k, v]) => fd.append(k, v ?? ''))
  return fd
}

const loading = ref(false)
const ruleStepList = ref([])
const formGroupOptions = ref([])
const formTypeOptions = ref([])
const ruleOptions = ref([])
const dialogFormTypeOptions = ref([])
const dialogRuleOptions = ref([])
const dialogStepOptions = ref([])

const searchForm = reactive({ formGroupId: '', formTypeId: '', ruleId: '' })

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

let listSeq = 0
const getRuleStepList = async () => {
  const seq = ++listSeq
  loading.value = true
  const start = Date.now()
  try {
    if (!searchForm.ruleId) {
      ruleStepList.value = []
      return
    }
    const res = await post(GET_WORKFLOWRULESTEP_LIST_API, buildFormData({ ruleId: searchForm.ruleId }), FORM_DATA_OPTIONS)
    if (seq !== listSeq) return
    if (res.code === 200) {
      ruleStepList.value = res.data || []
    } else {
      showMessage(res.message)
      ruleStepList.value = []
    }
  } catch {
    if (seq === listSeq) showMessage(t('formbusiness.workflowrulestep.getFailed'))
    ruleStepList.value = []
  } finally {
    if (seq === listSeq) {
      const elapsed = Date.now() - start
      if (elapsed < MIN_LOADING_DURATION) {
        await new Promise(r => setTimeout(r, MIN_LOADING_DURATION - elapsed))
      }
      if (seq === listSeq) loading.value = false
    }
  }
}

// 通过 seq 丢弃过期响应，避免快速切换时回填错乱
let ruleSeq = 0
const getRuleOptions = async (formTypeId) => {
  const seq = ++ruleSeq
  if (!formTypeId) {
    ruleOptions.value = []
    searchForm.ruleId = ''
    await getRuleStepList()
    return
  }
  try {
    const res = await post(GET_WORKFLOWRULE_DROPDOWN_API, buildFormData({ formTypeId }), FORM_DATA_OPTIONS)
    if (seq !== ruleSeq) return
    if (res.code === 200) {
      ruleOptions.value = res.data || []
      searchForm.ruleId = ruleOptions.value[0]?.ruleId ?? ''
    } else {
      showMessage(res.message)
      ruleOptions.value = []
      searchForm.ruleId = ''
    }
  } catch {
    if (seq === ruleSeq) showMessage(t('formbusiness.workflowrulestep.getRuleFailed'))
    ruleOptions.value = []
    searchForm.ruleId = ''
  }
  if (seq === ruleSeq) await getRuleStepList()
}

let formTypeSeq = 0
const getFormTypeOptions = async (formGroupId) => {
  const seq = ++formTypeSeq
  if (!formGroupId) {
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    await getRuleOptions('')
    return
  }
  try {
    const res = await post(GET_FORMTYPE_DROPDOWN_API, buildFormData({ formGroupId }), FORM_DATA_OPTIONS)
    if (seq !== formTypeSeq) return
    if (res.code === 200) {
      formTypeOptions.value = res.data || []
      searchForm.formTypeId = formTypeOptions.value[0]?.formTypeId ?? ''
    } else {
      showMessage(res.message)
      formTypeOptions.value = []
      searchForm.formTypeId = ''
    }
  } catch {
    if (seq === formTypeSeq) showMessage(t('formbusiness.workflowrulestep.getFormTypeFailed'))
    formTypeOptions.value = []
    searchForm.formTypeId = ''
  }
  if (seq === formTypeSeq) await getRuleOptions(searchForm.formTypeId)
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
    showMessage(t('formbusiness.workflowrulestep.getFormGroupFailed'))
  }
}

const dialogVisible = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const dialogFormRef = ref(null)
const isEditMode = ref(false)

const dialogForm = reactive({
  formGroupId: '',
  formTypeId: '',
  ruleId: '',
  currentStepId: '',
  nextStepId: '',
  guidance: '',
  sortOrder: 0
})

const dialogFormRules = {
  formGroupId:   [{ required: true, message: () => t('formbusiness.workflowrulestep.pleaseSelectFormGroup'),    trigger: 'change' }],
  formTypeId:    [{ required: true, message: () => t('formbusiness.workflowrulestep.pleaseSelectFormType'),     trigger: 'change' }],
  ruleId:        [{ required: true, message: () => t('formbusiness.workflowrulestep.pleaseSelectRule'),         trigger: 'change' }],
  currentStepId: [{ required: true, message: () => t('formbusiness.workflowrulestep.pleaseSelectCurrentStep'), trigger: 'change' }],
  nextStepId: [{
    required: true,
    validator: (_rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        callback(new Error(t('formbusiness.workflowrulestep.pleaseSelectNextStep')))
        return
      }
      callback()
    },
    trigger: 'change'
  }]
}

const resetDialogForm = () => {
  dialogForm.formGroupId = ''
  dialogForm.formTypeId  = ''
  dialogForm.ruleId      = ''
  dialogForm.currentStepId = ''
  dialogForm.nextStepId  = ''
  dialogForm.guidance    = ''
  dialogForm.sortOrder   = 0
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

const loadDialogRuleOptions = async (formTypeId) => {
  if (!formTypeId) { dialogRuleOptions.value = []; return }
  try {
    const res = await post(GET_WORKFLOWRULE_DROPDOWN_API, buildFormData({ formTypeId }), FORM_DATA_OPTIONS)
    dialogRuleOptions.value = res.code === 200 ? (res.data || []) : []
  } catch {
    dialogRuleOptions.value = []
  }
}

// formTypeId 取弹窗内 dialogForm.formTypeId，确保步骤选项与所选表单类别一致
const loadDialogStepOptions = async () => {
  const formTypeId = dialogForm.formTypeId
  if (!formTypeId) { dialogStepOptions.value = []; return }
  try {
    const res = await post(GET_WORKFLOWSTEP_DROPDOWN_API, buildFormData({ formTypeId: String(formTypeId) }), FORM_DATA_OPTIONS)
    dialogStepOptions.value = res.code === 200 ? (res.data || []) : []
  } catch {
    dialogStepOptions.value = []
  }
}

const handleDialogFormGroupChange = async (val) => {
  dialogForm.formTypeId    = ''
  dialogForm.ruleId        = ''
  dialogForm.currentStepId = ''
  dialogForm.nextStepId    = ''
  dialogFormTypeOptions.value = []
  dialogRuleOptions.value     = []
  dialogStepOptions.value     = []
  if (!val) return
  dialogLoading.value = true
  try {
    await loadDialogFormTypeOptions(val)
    if (dialogFormTypeOptions.value.length > 0) {
      dialogForm.formTypeId = dialogFormTypeOptions.value[0].formTypeId
      await Promise.all([loadDialogRuleOptions(dialogForm.formTypeId), loadDialogStepOptions()])
      if (dialogRuleOptions.value.length > 0) dialogForm.ruleId = dialogRuleOptions.value[0].ruleId
    }
  } finally {
    dialogLoading.value = false
  }
}

const handleDialogFormTypeChange = async (val) => {
  dialogForm.ruleId        = ''
  dialogForm.currentStepId = ''
  dialogForm.nextStepId    = ''
  dialogRuleOptions.value  = []
  dialogStepOptions.value  = []
  if (!val) return
  dialogLoading.value = true
  try {
    await Promise.all([loadDialogRuleOptions(val), loadDialogStepOptions()])
    if (dialogRuleOptions.value.length > 0) dialogForm.ruleId = dialogRuleOptions.value[0].ruleId
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
      const formTypeId = searchForm.formTypeId && dialogFormTypeOptions.value.some(i => i.formTypeId === searchForm.formTypeId)
        ? searchForm.formTypeId
        : (dialogFormTypeOptions.value[0]?.formTypeId || '')
      if (formTypeId) {
        dialogForm.formTypeId = formTypeId
        await Promise.all([loadDialogRuleOptions(formTypeId), loadDialogStepOptions()])
        dialogForm.ruleId = searchForm.ruleId && dialogRuleOptions.value.some(i => i.ruleId === searchForm.ruleId)
          ? searchForm.ruleId
          : (dialogRuleOptions.value[0]?.ruleId || '')
      }
    }
    dialogForm.currentStepId = ''
    dialogForm.nextStepId    = ''
    dialogForm.guidance      = ''
    dialogForm.sortOrder     = 0
  } finally {
    dialogLoading.value = false
    nextTick(() => dialogFormRef.value?.clearValidate())
  }
}

const handleEdit = async (row) => {
  dialogVisible.value = true
  dialogLoading.value = true
  try {
    const res = await post(
      GET_WORKFLOWRULESTEP_ENTITY_API,
      buildFormData({ ruleId: row.ruleId, currentStepId: row.currentStepId }),
      FORM_DATA_OPTIONS
    )
    if (res.code === 200 && res.data) {
      isEditMode.value = true
      const d = res.data
      dialogForm.formGroupId   = d.formGroupId   ?? searchForm.formGroupId ?? ''
      dialogForm.formTypeId    = d.formTypeId    ?? searchForm.formTypeId  ?? ''
      dialogForm.ruleId        = d.ruleId        || row.ruleId        || ''
      dialogForm.currentStepId = d.currentStepId || row.currentStepId || ''
      dialogForm.nextStepId    = normalizeNextStepIdForForm(d.nextStepId ?? row.nextStepId)
      dialogForm.guidance      = d.guidance ?? d.Guidance ?? row.guidance ?? ''
      dialogForm.sortOrder     = d.sortOrder     ?? row.sortOrder     ?? 0

      const tasks = []
      if (dialogForm.formGroupId) tasks.push(loadDialogFormTypeOptions(dialogForm.formGroupId))
      if (dialogForm.formTypeId) {
        tasks.push(loadDialogRuleOptions(dialogForm.formTypeId))
        tasks.push(loadDialogStepOptions())
      }
      if (tasks.length) await Promise.all(tasks)
      nextTick(() => dialogFormRef.value?.clearValidate())
    } else {
      dialogVisible.value = false
      showMessage(res.message || t('formbusiness.workflowrulestep.getEntityFailed'))
    }
  } catch {
    dialogVisible.value = false
    showMessage(t('formbusiness.workflowrulestep.getEntityFailed'))
  } finally {
    dialogLoading.value = false
  }
}

const handleDialogClose = () => {
  dialogFormRef.value?.resetFields()
  resetDialogForm()
  dialogFormTypeOptions.value = []
  dialogRuleOptions.value     = []
  dialogStepOptions.value     = []
  isEditMode.value = false
}

const handleSubmit = async () => {
  if (!dialogFormRef.value) return
  try {
    await dialogFormRef.value.validate()
  } catch {
    return
  }
  if (
    dialogForm.currentStepId !== '' && dialogForm.currentStepId !== null && dialogForm.currentStepId !== undefined
    && !isNextStepEnd(dialogForm.nextStepId)
    && String(dialogForm.currentStepId) === String(dialogForm.nextStepId)
  ) {
    showMessage(t('formbusiness.workflowrulestep.stepDuplicated'))
    return
  }
  submitLoading.value = true
  const isEdit = isEditMode.value
  try {
    const params = {
      ruleId:        dialogForm.ruleId,
      currentStepId: dialogForm.currentStepId,
      nextStepId:    isNextStepEnd(dialogForm.nextStepId) ? '0' : String(dialogForm.nextStepId),
      guidance:      dialogForm.guidance,
      sortOrder:     dialogForm.sortOrder
    }
    const api        = isEdit ? UPDATE_WORKFLOWRULESTEP_API : INSERT_WORKFLOWRULESTEP_API
    const successKey = isEdit ? 'editSuccess' : 'addSuccess'
    const failKey    = isEdit ? 'editFailed'  : 'addFailed'
    const res = await post(api, params)
    if (isSuccess(res.code)) {
      showMessage(res.message || t(`formbusiness.workflowrulestep.${successKey}`), 'success')
      dialogVisible.value = false
      if (dialogForm.ruleId === searchForm.ruleId) await getRuleStepList()
    } else {
      showMessage(res.message || t(`formbusiness.workflowrulestep.${failKey}`))
    }
  } catch {
    showMessage(t(`formbusiness.workflowrulestep.${isEdit ? 'editFailed' : 'addFailed'}`))
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.workflowrulestep.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  loading.value = true
  try {
    const res = await post(
      DELETE_WORKFLOWRULESTEP_API,
      buildFormData({ ruleId: row.ruleId, currentStepId: row.currentStepId }),
      FORM_DATA_OPTIONS
    )
    if (isSuccess(res.code)) {
      showMessage(res.message || t('formbusiness.workflowrulestep.deleteSuccess'), 'success')
      await getRuleStepList()
    } else {
      showMessage(res.message || t('formbusiness.workflowrulestep.deleteFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowrulestep.deleteFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await getFormGroupOptions()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
