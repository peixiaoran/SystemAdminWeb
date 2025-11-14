<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="表单类型筛选">
      <el-form-item :label="$t('formbusiness.formtype.formGroupName')">
        <el-select 
          v-model="searchForm.formGroupId" 
          :placeholder="$t('formbusiness.formtype.pleaseSelectFormGroup')"
          filterable
          style="width: 180px"
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
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item class="form-button-group">
        <el-button type="primary" @click="handleSearch" plain>
          {{ $t('common.search') }}
        </el-button>
        <el-button @click="handleReset">
          {{ $t('common.reset') }}
        </el-button>
      </el-form-item>
    </el-form>

      <!-- 表格区域 -->
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
          <el-table-column :label="$t('formbusiness.formtype.apply')" align="center" width="80">
            <template #default="scope">
              <a 
                v-if="scope.row.approvalPath" 
                :href="'#' + scope.row.approvalPath + '?formTypeId=' + scope.row.formTypeId"
                style="color: #1890ff; text-decoration: none;"
                target="_blank"
                @click="handleApprovalPathClick(scope.row)"
              >
                {{ $t('formbusiness.formtype.apply') }}
              </a>
              <span v-else style="color: #999;">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="formTypeName" :label="$t('formbusiness.formtype.formName')" align="center" min-width="80" />
          <el-table-column prop="description" :label="$t('formbusiness.formtype.description')" align="left" min-width="450" />
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
      :title="isEdit ? $t('formbusiness.formtype.editFormType') : $t('formbusiness.formtype.addFormType')"
      width="55%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :modal-append-to-body="true"
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
              <el-select
                v-model="form.formGroupId"
                :placeholder="$t('formbusiness.formtype.pleaseSelectFormGroup')"
                style="width:100%"
              >
                <el-option
                  v-for="item in formGroupOptions"
                  :key="item.formGroupId"
                  :label="item.formGroupName"
                  :value="item.formGroupId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.formtype.prefix')" prop="prefix">
              <el-input 
                v-model="form.prefix" 
                :placeholder="$t('formbusiness.formtype.pleaseInputPrefix')"
                style="width:100%" 
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formtype.formTypeNameCn')" prop="formTypeNameCn">
              <el-input 
                v-model="form.formTypeNameCn" 
                :placeholder="$t('formbusiness.formtype.pleaseInputFormTypeNameCn')"
                style="width:100%" 
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.formtype.formTypeNameEn')" prop="formTypeNameEn">
              <el-input
                v-model="form.formTypeNameEn"
                :placeholder="$t('formbusiness.formtype.pleaseInputFormTypeNameEn')"
                style="width:100%" 
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formtype.reviewPath')" prop="reviewPath">
              <el-input 
                v-model="form.reviewPath" 
                :placeholder="$t('formbusiness.formtype.pleaseInputReviewPath')"
                style="width:100%" 
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.formtype.viewPath')" prop="viewPath">
              <el-input 
                v-model="form.viewPath" 
                :placeholder="$t('formbusiness.formtype.pleaseInputViewPath')"
                style="width:100%" 
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.formtype.sortOrder')" prop="sortOrder">
              <el-input-number 
                v-model="form.sortOrder" 
                :min="0"
                :max="999"
                style="width:100%" 
              />
            </el-form-item>
            <el-form-item>
              
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('formbusiness.formtype.descriptionCn')" prop="descriptionCn">
              <el-input 
                v-model="form.descriptionCn" 
                :placeholder="$t('formbusiness.formtype.pleaseInputDescriptionCn')"
                style="width:100%" 
                type="textarea" 
                :rows="2" 
              />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('formbusiness.formtype.descriptionEn')" prop="descriptionEn">
              <el-input 
                v-model="form.descriptionEn" 
                :placeholder="$t('formbusiness.formtype.pleaseInputDescriptionEn')"
                style="width:100%" 
                type="textarea" 
                :rows="2" 
              />
            </el-form-item>
          </div>

        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
    -->
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import { 
  GET_APPLYFORM_API,
  GET_FORMGROUP_DROPDOWN_API
} from '@/config/api/formbusiness/form-operate/applyform.js'
import { useI18n } from 'vue-i18n'

// 使用i18n
const { t } = useI18n()

// 响应式数据
const loading = ref(false)
// 移除对话框相关的响应式变量
// const dialogLoading = ref(false)
// const submitLoading = ref(false)
// const dialogVisible = ref(false)
// const isEdit = ref(false)
// const formRef = ref(null)
const formTypeList = ref([])
const formGroupOptions = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

// 搜索表单
const searchForm = reactive({
  formGroupId: '',
  formTypeName: ''
})

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

// 表单数据
const form = reactive({
  formTypeId: '',
  formGroupId: '',
  formTypeNameCn: '',
  formTypeNameEn: '',
  prefix: '',
  sortOrder: 0,
  descriptionCn: '',
  descriptionEn: '',
  reviewPath: '',
  viewPath: ''
})

// 表单验证规则
const rules = {
  formGroupId: [
    { required: true, message: () => t('formbusiness.formtype.pleaseSelectFormGroup'), trigger: 'change' }
  ],
  formTypeNameCn: [
    { required: true, message: () => t('formbusiness.formtype.pleaseInputFormTypeNameCn'), trigger: 'blur' }
  ],
  formTypeNameEn: [
    { required: true, message: () => t('formbusiness.formtype.pleaseInputFormTypeNameEn'), trigger: 'blur' }
  ],
  prefix: [
    { required: true, message: () => t('formbusiness.formtype.pleaseInputPrefix'), trigger: 'blur' }
  ],
  reviewPath: [
    { required: false, trigger: 'blur' }
  ],
  viewPath: [
    { required: false, trigger: 'blur' }
  ]
}

/**
 * 获取表单组别下拉选项
 */
const getFormGroupOptions = async () => {
  try {
    const response = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (response.code === 200) {
      formGroupOptions.value = response.data || []
      // 默认选中第一个选项
      if (formGroupOptions.value.length > 0 && !searchForm.formGroupId) {
        searchForm.formGroupId = formGroupOptions.value[0].value
      }
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    console.error('获取表单组别下拉选项失败:', error)
    ElMessage({
      message: t('formbusiness.formtype.getFormGroupFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  }
}

/**
 * 获取申请表单列表
 */
const getFormTypeList = async () => {
  loading.value = true
  try {
    const params = {
      formGroupId: searchForm.formGroupId,
      formTypeName: searchForm.formTypeName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    }
    
    const response = await post(GET_APPLYFORM_API, params)
    if (response.code === 200) {
      formTypeList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      formTypeList.value = []
    }
  } catch (error) {
    console.error('获取申请表单列表失败:', error)
    ElMessage({
      message: t('formbusiness.formtype.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    formTypeList.value = []
  } finally {
    loading.value = false
  }
}

// 防抖搜索优化
let searchTimer = null

/**
 * 搜索
 */
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true // 立即显示加载状态
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    getFormTypeList()
  }, 300) // 300ms防抖
}

/**
 * 重置搜索
 * 清空文本框，下拉框恢复到默认第一个值，并重新获取数据
 */
const handleReset = () => {
  searchForm.formTypeName = ''
  // 下拉框恢复到默认第一个值
  if (formGroupOptions.value.length > 0) {
    searchForm.formGroupId = formGroupOptions.value[0].formGroupId
  }
  pagination.pageIndex = 1
  loading.value = true // 立即显示加载状态
  getFormTypeList()
}

/**
 * 分页大小改变
 */
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getFormTypeList()
}

/**
 * 当前页改变
 */
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getFormTypeList()
}

/**
 * 重置表单
 */
const resetForm = () => {
  form.formTypeId = ''
  form.formGroupId = ''
  form.formTypeNameCn = ''
  form.formTypeNameEn = ''
  form.prefix = ''
  form.sortOrder = 0
  form.descriptionCn = ''
  form.descriptionEn = ''
  form.reviewPath = ''
  form.viewPath = ''
}

/**
 * 提交表单
 * 只进行非空验证判断，验证失败时不显示弹出框
 */
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    // 只进行表单验证，不显示错误消息
    await formRef.value.validate()
    
    submitLoading.value = true
    
    const params = {
      formTypeId: form.formTypeId,
      formGroupId: form.formGroupId,
      formTypeNameCn: form.formTypeNameCn,
      formTypeNameEn: form.formTypeNameEn,
      prefix: form.prefix,
      sortOrder: form.sortOrder,
      descriptionCn: form.descriptionCn,
      descriptionEn: form.descriptionEn,
      reviewPath: form.reviewPath,
      viewPath: form.viewPath
    }
    
    const api = isEdit.value ? UPDATE_FORMTYPE_API : INSERT_FORMTYPE_ENTITY_API
    const response = await post(api, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
      getFormTypeList()
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    // 验证失败时只进行非空判断，不显示弹出框错误消息
    if (error !== false) {
      console.error('表单验证失败:', error)
      // 这里不显示错误消息，只进行非空判断
    }
  } finally {
    submitLoading.value = false
  }
}

/**
 * 处理审批路径点击事件
 * @param {Object} row - 当前行数据
 */
const handleApprovalPathClick = (row) => {
  console.log('跳转到审批页面:', row.approvalPath, 'formTypeId:', row.formTypeId)
  // 这里可以添加额外的跳转逻辑，比如路由跳转等
}

/**
 * 对话框关闭
 */
const handleDialogClose = () => {
  resetForm()
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getFormGroupOptions()
  getFormTypeList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>

