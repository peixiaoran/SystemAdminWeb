<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="流程规则筛选">
        <el-form-item :label="$t('formbusiness.workflowrule.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            filterable
            style="width: 180px"
            @change="handleFormGroupChange"
          >
            <el-option
              v-for="item in formGroupOptions"
              :key="item.formGroupId"
              :label="item.formGroupName"
              :value="item.formGroupId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('formbusiness.workflowrule.formTypeName')">
          <el-select
            v-model="searchForm.formTypeId"
            filterable
            style="width: 180px"
            @change="handleFormTypeChange"
          >
            <el-option
              v-for="item in formTypeOptions"
              :key="item.formTypeId"
              :label="item.formTypeName"
              :value="item.formTypeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('formbusiness.workflowrule.positionName')">
          <el-select
            v-model="searchForm.positionId"
            filterable
            style="width: 160px"
            @change="handlePositionChange"
          >
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
        >
          <el-table-column type="index" :label="$t('formbusiness.workflowrule.index')" width="70" align="center" fixed />
          <el-table-column prop="ruleNameCn" :label="$t('formbusiness.workflowrule.ruleNameCn')" align="left" min-width="200" show-overflow-tooltip />
          <el-table-column prop="ruleNameEn" :label="$t('formbusiness.workflowrule.ruleNameEn')" align="left" min-width="240" show-overflow-tooltip />
          <el-table-column prop="positionName" :label="$t('formbusiness.workflowrule.positionName')" align="left" min-width="120" />
          <el-table-column prop="guidance" :label="$t('formbusiness.workflowrule.guidance')" align="left" min-width="160" show-overflow-tooltip />
          <el-table-column prop="sortOrder" :label="$t('formbusiness.workflowrule.sortOrder')" width="90" align="center" />
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
          @current-change="handleCurrentChange"
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

const loading = ref(false)
const ruleList = ref([])
const formGroupOptions = ref([])
const formTypeOptions = ref([])
const dialogFormTypeOptions = ref([])
const positionOptions = ref([])

const searchForm = reactive({
  formGroupId: '',
  formTypeId: '',
  positionId: '0'
})

const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const getPositionOptions = async () => {
  try {
    const response = await post(GET_POSITION_LIST_API, {})
    if (response.code === 200) {
      positionOptions.value = response.data || []
    }
  } catch {
    showMessage(t('formbusiness.workflowrule.getPositionFailed'))
  }
}

const getFormGroupOptions = async () => {
  try {
    const response = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (response.code === 200) {
      formGroupOptions.value = response.data || []
      if (formGroupOptions.value.length > 0 && !searchForm.formGroupId) {
        searchForm.formGroupId = formGroupOptions.value[0].formGroupId
        await getFormTypeOptions(searchForm.formGroupId)
      }
    } else {
      showMessage(response.message)
    }
  } catch {
    showMessage(t('formbusiness.workflowrule.getFormGroupFailed'))
  }
}

/**
 * 获取表单类别下拉选项；不论是否有数据，最终都会调用 getRuleList 走一遍 loading 流程
 */
const getFormTypeOptions = async (formGroupId) => {
  if (!formGroupId) {
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    await getRuleList()
    return
  }
  try {
    const formData = new FormData()
    formData.append('formGroupId', String(formGroupId))
    const response = await post(GET_FORMTYPE_DROPDOWN_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (response.code === 200) {
      formTypeOptions.value = response.data || []
      searchForm.formTypeId = formTypeOptions.value.length > 0
        ? formTypeOptions.value[0].formTypeId
        : ''
    } else {
      showMessage(response.message)
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

// 最小 loading 显示时间，避免接口太快导致动画一闪而过
const MIN_LOADING_DURATION = 300

let ruleListSeq = 0
/**
 * 获取流程规则列表；formTypeId 为空时也走一遍 loading 流程并清空表格
 */
const getRuleList = async () => {
  const seq = ++ruleListSeq
  loading.value = true
  const loadingStart = Date.now()
  try {
    if (!searchForm.formTypeId) {
      ruleList.value = []
      pagination.totalCount = 0
      return
    }
    const params = {
      formTypeId: searchForm.formTypeId,
      positionId: searchForm.positionId ?? '',
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    }
    const response = await post(GET_WORKFLOWRULE_PAGE_API, params)
    if (seq !== ruleListSeq) return
    if (response.code === 200) {
      ruleList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      showMessage(response.message)
      ruleList.value = []
    }
  } catch {
    if (seq === ruleListSeq) showMessage(t('formbusiness.workflowrule.getFailed'))
    ruleList.value = []
  } finally {
    if (seq === ruleListSeq) {
      const elapsed = Date.now() - loadingStart
      if (elapsed < MIN_LOADING_DURATION) {
        await new Promise(resolve => setTimeout(resolve, MIN_LOADING_DURATION - elapsed))
      }
      if (seq === ruleListSeq) loading.value = false
    }
  }
}

/**
 * 表单分组改变：立即联动表单类别下拉，由 getRuleList 内部触发表格加载动画
 */
const handleFormGroupChange = (val) => {
  getFormTypeOptions(val)
}

/**
 * 表单类别改变：直接刷新表格
 */
const handleFormTypeChange = () => {
  pagination.pageIndex = 1
  getRuleList()
}

/**
 * 职级改变：直接刷新表格
 */
const handlePositionChange = () => {
  pagination.pageIndex = 1
  getRuleList()
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getRuleList()
}

const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getRuleList()
}

// 对话框
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
  positionId: '',
  guidance: '',
  sortOrder: 0
})

const dialogFormRules = reactive({
  formGroupId: [
    { required: true, message: () => t('formbusiness.workflowrule.pleaseSelectFormGroup'), trigger: 'change' }
  ],
  formTypeId: [
    { required: true, message: () => t('formbusiness.workflowrule.pleaseSelectFormType'), trigger: 'change' }
  ],
  ruleNameCn: [
    { required: true, message: () => t('formbusiness.workflowrule.pleaseInputRuleNameCn'), trigger: 'blur' }
  ],
  ruleNameEn: [
    { required: true, message: () => t('formbusiness.workflowrule.pleaseInputRuleNameEn'), trigger: 'blur' }
  ],
  positionId: [
    { required: true, message: () => t('formbusiness.workflowrule.pleaseSelectPosition'), trigger: 'change' }
  ],
  guidance: [
    { required: true, message: () => t('formbusiness.workflowrule.pleaseInputGuidance'), trigger: 'blur' }
  ]
})

const resetDialogForm = () => {
  // ruleId 不在 el-form-item prop 里，resetFields 不会重置，需手动清
  dialogForm.ruleId = ''
  // positionId 默认选第一项（resetFields 只能还原到挂载时的空值）
  dialogForm.positionId = positionOptions.value.length > 0 ? positionOptions.value[0].positionId : ''
}

/**
 * 仅为弹窗加载表单类别下拉，不影响搜索区
 */
const loadDialogFormTypeOptions = async (formGroupId) => {
  if (!formGroupId) {
    dialogFormTypeOptions.value = []
    return
  }
  try {
    const formData = new FormData()
    formData.append('formGroupId', String(formGroupId))
    const response = await post(GET_FORMTYPE_DROPDOWN_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    dialogFormTypeOptions.value = response.code === 200 ? (response.data || []) : []
  } catch {
    dialogFormTypeOptions.value = []
  }
}

/**
 * 弹窗内表单组别变更时仅刷新弹窗内的表单类别下拉
 */
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
    const formGroupId = searchForm.formGroupId
      || (formGroupOptions.value.length > 0 ? formGroupOptions.value[0].formGroupId : '')
    if (formGroupId) {
      dialogForm.formGroupId = formGroupId
      await loadDialogFormTypeOptions(formGroupId)
      if (searchForm.formTypeId
        && dialogFormTypeOptions.value.some(item => item.formTypeId === searchForm.formTypeId)) {
        dialogForm.formTypeId = searchForm.formTypeId
      } else if (dialogFormTypeOptions.value.length > 0) {
        dialogForm.formTypeId = dialogFormTypeOptions.value[0].formTypeId
      }
    }
    // positionId 默认选第一项
    if (!dialogForm.positionId && positionOptions.value.length > 0) {
      dialogForm.positionId = positionOptions.value[0].positionId
    }
  } finally {
    dialogLoading.value = false
    nextTick(() => {
      dialogFormRef.value?.clearValidate()
    })
  }
}

const handleEdit = async (row) => {
  dialogVisible.value = true
  dialogLoading.value = true
  try {
    const formData = new FormData()
    formData.append('ruleId', String(row.ruleId))
    const response = await post(GET_WORKFLOWRULE_ENTITY_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (response.code === 200 && response.data) {
      isEditMode.value = true
      const d = response.data
      dialogForm.ruleId = d.ruleId || ''
      dialogForm.formGroupId = d.formGroupId || searchForm.formGroupId || ''
      dialogForm.formTypeId = d.formTypeId || searchForm.formTypeId || ''
      dialogForm.ruleNameCn = d.ruleNameCn || ''
      dialogForm.ruleNameEn = d.ruleNameEn || ''
      dialogForm.positionId = d.positionId || ''
      dialogForm.guidance = d.guidance || ''
      dialogForm.sortOrder = d.sortOrder ?? 0
      if (dialogForm.formGroupId) {
        await loadDialogFormTypeOptions(dialogForm.formGroupId)
      }
      nextTick(() => {
        dialogFormRef.value?.clearValidate()
      })
    } else {
      dialogVisible.value = false
      showMessage(response.message || t('formbusiness.workflowrule.getEntityFailed'))
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
      ruleId: dialogForm.ruleId || '',
      formTypeId: dialogForm.formTypeId,
      ruleNameCn: dialogForm.ruleNameCn,
      ruleNameEn: dialogForm.ruleNameEn,
      positionId: dialogForm.positionId,
      guidance: dialogForm.guidance,
      sortOrder: dialogForm.sortOrder
    }
    const api = isEdit ? UPDATE_WORKFLOWRULE_API : INSERT_WORKFLOWRULE_API
    const successKey = isEdit ? 'editSuccess' : 'addSuccess'
    const failKey = isEdit ? 'editFailed' : 'addFailed'
    const response = await post(api, params)
    if (response.code === 200 || response.code === '200') {
      showMessage(response.message || t(`formbusiness.workflowrule.${successKey}`), 'success')
      dialogVisible.value = false
      if (dialogForm.formTypeId === searchForm.formTypeId) {
        await getRuleList()
      }
    } else {
      showMessage(response.message || t(`formbusiness.workflowrule.${failKey}`))
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
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
  } catch {
    return
  }
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('ruleId', String(row.ruleId))
    const response = await post(DELETE_WORKFLOWRULE_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (response.code === 200 || response.code === '200') {
      showMessage(response.message || t('formbusiness.workflowrule.deleteSuccess'), 'success')
      if (ruleList.value.length === 1 && pagination.pageIndex > 1) {
        pagination.pageIndex--
      }
      await getRuleList()
    } else {
      showMessage(response.message || t('formbusiness.workflowrule.deleteFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowrule.deleteFailed'))
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    getFormGroupOptions(),
    getPositionOptions()
  ])
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
