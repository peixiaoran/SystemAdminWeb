<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" aria-label="表单类型筛选">
        <el-form-item :label="$t('formbusiness.formtype.formGroupName')">
          <el-select
            v-model="searchForm.formGroupId"
            :placeholder="$t('formbusiness.formtype.pleaseSelectFormGroup')"
            style="width: 200px"
            @change="scheduleSearch"
          >
            <el-option
              v-for="item in formGroupOptions"
              :key="item.formGroupId"
              :label="item.formGroupName"
              :value="item.formGroupId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('formbusiness.formtype.formTypeName')">
          <el-input
            v-model="searchForm.formTypeName"
            :placeholder="$t('formbusiness.formtype.pleaseInputFormTypeName')"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item class="form-button-group">
          <el-button type="primary" @click="scheduleSearch" plain>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
        <el-form-item class="form-right-button">
          <el-button type="primary" @click="handleAdd">
            {{ $t('formbusiness.formtype.addFormType') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="formTypeList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.formtype.index')" width="70" align="center" fixed />
          <el-table-column prop="formGroupName" :label="$t('formbusiness.formtype.formGroupName')" align="left" min-width="130" />
          <el-table-column prop="prefix" :label="$t('formbusiness.formtype.prefix')" align="center" width="130">
            <template #default="scope">
              <span style="color: #1890ff; font-weight: 500;">{{ scope.row.prefix }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="formTypeNameCn" :label="$t('formbusiness.formtype.formTypeNameCn')" align="left" min-width="170" />
          <el-table-column prop="formTypeNameEn" :label="$t('formbusiness.formtype.formTypeNameEn')" align="left" min-width="240" />
          <el-table-column :label="$t('common.operation')" min-width="100" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">
                {{ $t('common.delete') }}
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
          @current-change="getFormTypeList"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? $t('formbusiness.formtype.editFormType') : $t('formbusiness.formtype.addFormType')"
      width="55%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="true"
      @close="handleDialogClose"
    >
      <div v-loading="dialogLoading">
        <el-form
          :inline="true"
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="140px"
          class="dialog-form"
          role="form"
          aria-label="表单类型编辑"
        >
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formtype.formGroupName')" prop="formGroupId">
              <el-select v-model="form.formGroupId" :placeholder="$t('formbusiness.formtype.pleaseSelectFormGroup')" style="width:100%">
                <el-option
                  v-for="item in formGroupOptions"
                  :key="item.formGroupId"
                  :label="item.formGroupName"
                  :value="item.formGroupId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.formtype.prefix')" prop="prefix">
              <el-input v-model="form.prefix" :placeholder="$t('formbusiness.formtype.pleaseInputPrefix')" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formtype.formTypeNameCn')" prop="formTypeNameCn">
              <el-input v-model="form.formTypeNameCn" :placeholder="$t('formbusiness.formtype.pleaseInputFormTypeNameCn')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.formtype.formTypeNameEn')" prop="formTypeNameEn">
              <el-input v-model="form.formTypeNameEn" :placeholder="$t('formbusiness.formtype.pleaseInputFormTypeNameEn')" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formtype.reviewPath')" prop="reviewPath">
              <el-input v-model="form.reviewPath" :placeholder="$t('formbusiness.formtype.pleaseInputReviewPath')" style="width:100%" />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.formtype.viewPath')" prop="viewPath">
              <el-input v-model="form.viewPath" :placeholder="$t('formbusiness.formtype.pleaseInputViewPath')" style="width:100%" />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formtype.sortOrder')" prop="sortOrder">
              <el-input-number v-model="form.sortOrder" :min="0" :max="999" style="width:100%" />
            </el-form-item>
            <el-form-item />
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('formbusiness.formtype.descriptionCn')" prop="descriptionCn">
              <el-input v-model="form.descriptionCn" :placeholder="$t('formbusiness.formtype.pleaseInputDescriptionCn')" style="width:100%" type="textarea" :rows="2" />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('formbusiness.formtype.descriptionEn')" prop="descriptionEn">
              <el-input v-model="form.descriptionEn" :placeholder="$t('formbusiness.formtype.pleaseInputDescriptionEn')" style="width:100%" type="textarea" :rows="2" />
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
  GET_FORMTYPE_PAGE_API,
  GET_FORMTYPE_ENTITY_API,
  INSERT_FORMTYPE_ENTITY_API,
  UPDATE_FORMTYPE_API,
  DELETE_FORMTYPE_ENTITY_API,
  GET_FORMTYPE_DROPDOWN_API
} from '@/config/api/formbusiness/form-basicInfo/formtype.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DEBOUNCE_MS = 300

const buildFormData = (params) => {
  const fd = new FormData()
  Object.entries(params).forEach(([k, v]) => fd.append(k, v ?? ''))
  return fd
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const formTypeList = ref([])
const formGroupOptions = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const searchForm = reactive({ formGroupId: '', formTypeName: '' })

const pagination = reactive({ pageIndex: 1, pageSize: 20, totalCount: 0 })

const form = reactive({
  formTypeId:     '',
  formGroupId:    '',
  formTypeNameCn: '',
  formTypeNameEn: '',
  prefix:         '',
  sortOrder:      0,
  descriptionCn:  '',
  descriptionEn:  '',
  reviewPath:     '',
  viewPath:       ''
})

const rules = {
  formGroupId:    [{ required: true, message: () => t('formbusiness.formtype.pleaseSelectFormGroup'),    trigger: 'change' }],
  formTypeNameCn: [{ required: true, message: () => t('formbusiness.formtype.pleaseInputFormTypeNameCn'), trigger: 'blur'   }],
  formTypeNameEn: [{ required: true, message: () => t('formbusiness.formtype.pleaseInputFormTypeNameEn'), trigger: 'blur'   }],
  prefix:         [{ required: true, message: () => t('formbusiness.formtype.pleaseInputPrefix'),         trigger: 'blur'   }]
}

const getFormGroupOptions = async () => {
  try {
    const res = await post(GET_FORMTYPE_DROPDOWN_API, {})
    if (res.code === 200) {
      formGroupOptions.value = res.data || []
      if (formGroupOptions.value.length > 0 && !searchForm.formGroupId) {
        searchForm.formGroupId = formGroupOptions.value[0].formGroupId
      }
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.formtype.getFormGroupFailed'))
  }
}

const getFormTypeList = async () => {
  loading.value = true
  try {
    const res = await post(GET_FORMTYPE_PAGE_API, {
      formGroupId:  searchForm.formGroupId,
      formTypeName: searchForm.formTypeName,
      pageIndex:    pagination.pageIndex,
      pageSize:     pagination.pageSize,
      totalCount:   pagination.totalCount
    })
    if (res.code === 200) {
      formTypeList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showMessage(res.message)
      formTypeList.value = []
    }
  } catch {
    showMessage(t('formbusiness.formtype.getFailed'))
    formTypeList.value = []
  } finally {
    loading.value = false
  }
}

let searchTimer = null
const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    getFormTypeList()
  }, DEBOUNCE_MS)
}

const handleReset = () => {
  searchForm.formTypeName = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  getFormTypeList()
}

const resetForm = () => {
  form.formTypeId     = ''
  form.formGroupId    = ''
  form.formTypeNameCn = ''
  form.formTypeNameEn = ''
  form.prefix         = ''
  form.sortOrder      = 0
  form.descriptionCn  = ''
  form.descriptionEn  = ''
  form.reviewPath     = ''
  form.viewPath       = ''
}

const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => formRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true
  try {
    const res = await post(GET_FORMTYPE_ENTITY_API, buildFormData({ fromTypeId: row.formTypeId }))
    if (res.code === 200) {
      const d = res.data
      form.formTypeId     = d.formTypeId
      form.formGroupId    = d.formGroupId
      form.formTypeNameCn = d.formTypeNameCn
      form.formTypeNameEn = d.formTypeNameEn
      form.prefix         = d.prefix
      form.sortOrder      = d.sortOrder
      form.descriptionCn  = d.descriptionCn
      form.descriptionEn  = d.descriptionEn
      form.reviewPath     = d.reviewPath || ''
      form.viewPath       = d.viewPath     || ''
      // 数据回填后清除验证，避免瞬间显示校验红框
      nextTick(() => formRef.value?.clearValidate())
    } else {
      showMessage(res.message)
      dialogVisible.value = false
    }
  } catch {
    showMessage(t('formbusiness.formtype.getFailed'))
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.formtype.deleteConfirm'),
      t('common.warning'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  try {
    const res = await post(DELETE_FORMTYPE_ENTITY_API, buildFormData({ fromTypeId: row.formTypeId }))
    if (res.code === 200) {
      showMessage(res.message, 'success')
      getFormTypeList()
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.formtype.operationFailed'))
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  submitLoading.value = true
  try {
    const api = isEdit.value ? UPDATE_FORMTYPE_API : INSERT_FORMTYPE_ENTITY_API
    const res = await post(api, {
      formTypeId:     form.formTypeId,
      formGroupId:    form.formGroupId,
      formTypeNameCn: form.formTypeNameCn,
      formTypeNameEn: form.formTypeNameEn,
      prefix:         form.prefix,
      sortOrder:      form.sortOrder,
      descriptionCn:  form.descriptionCn,
      descriptionEn:  form.descriptionEn,
      reviewPath:     form.reviewPath,
      viewPath:       form.viewPath
    })
    if (res.code === 200) {
      showMessage(res.message, 'success')
      dialogVisible.value = false
      getFormTypeList()
    } else {
      showMessage(res.message)
    }
  } catch {
    showMessage(t('formbusiness.formtype.operationFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  formRef.value?.clearValidate()
}

onMounted(() => {
  getFormGroupOptions()
  getFormTypeList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
