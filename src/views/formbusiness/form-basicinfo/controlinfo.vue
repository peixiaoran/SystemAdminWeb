<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" aria-label="控件信息筛选">
          <el-form-item :label="$t('formbusiness.controlinfo.controlCode')">
            <el-input
              v-model="searchForm.controlCode"
              :placeholder="$t('formbusiness.controlinfo.pleaseInputControlCode')"
              clearable
              style="width: 200px"
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
          <el-form-item class="form-right-button">
            <el-button type="primary" @click="handleAdd">
              {{ $t('formbusiness.controlinfo.addControl') }}
            </el-button>
          </el-form-item>
        </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table 
          :data="controlList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.controlinfo.index')" width="70" align="center" fixed />
          <el-table-column prop="controlCode" :label="$t('formbusiness.controlinfo.controlCode')" align="left" min-width="150" />
          <el-table-column prop="controlName" :label="$t('formbusiness.controlinfo.controlName')" align="left" min-width="150" />
          <el-table-column prop="description" :label="$t('formbusiness.controlinfo.description')" align="left" min-width="300" />
          <el-table-column :label="$t('common.operation')" min-width="60" fixed="right" align="center">
            <template #default="scope">
              <el-button 
                size="small" 
                type="danger"
                @click="handleDelete(scope.row)"
              >
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
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <el-dialog 
      v-model="dialogVisible"
      :title="isEdit ? $t('formbusiness.controlinfo.editControl') : $t('formbusiness.controlinfo.addControl')"
      width="50%"
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
          label-width="120px" 
          class="dialog-form"
          role="form" 
          aria-label="控件信息编辑"
        >
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.controlinfo.controlCode')" prop="controlCode">
              <el-input 
                v-model="form.controlCode" 
                :placeholder="$t('formbusiness.controlinfo.pleaseInputControlCode')"
                style="width:100%" 
                :disabled="isEdit"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.controlinfo.controlName')" prop="controlName">
              <el-input
                v-model="form.controlName"
                :placeholder="$t('formbusiness.controlinfo.pleaseInputControlName')"
                style="width:100%" 
              />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('formbusiness.controlinfo.description')" prop="description">
              <el-input 
                v-model="form.description" 
                :placeholder="$t('formbusiness.controlinfo.pleaseInputDescription')"
                style="width:100%" 
                type="textarea" 
                :rows="3" 
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import { 
  GET_CONTROL_PAGE_API,
  INSERT_CONTROL_ENTITY_API,
  DELETE_CONTROL_API
} from '@/config/api/formbusiness/form-basicInfo/controlinfo.js'
import { useI18n } from 'vue-i18n'

// 使用i18n
const { t } = useI18n()

// 响应式数据
const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const deletingId = ref(null)
const controlList = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)

// 搜索表单
const searchForm = reactive({
  controlCode: ''
})

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

// 表单数据
const form = reactive({
  controlCode: '',
  controlName: '',
  description: ''
})

// 表单验证规则
const rules = {
  controlCode: [
    { required: true, message: () => t('formbusiness.controlinfo.pleaseInputControlCode'), trigger: 'blur' }
  ],
  controlName: [
    { required: true, message: () => t('formbusiness.controlinfo.pleaseInputControlName'), trigger: 'blur' }
  ]
}

/**
 * 获取控件信息列表
 * 调用分页查询接口获取控件信息数据
 */
const getControlList = async () => {
  loading.value = true
  try {
    const params = {
      controlCode: searchForm.controlCode,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    }
    
    const response = await post(GET_CONTROL_PAGE_API, params)
    if (response.code === 200) {
      controlList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      controlList.value = []
    }
  } catch (error) {
    console.error('获取控件信息列表失败:', error)
    ElMessage({
      message: t('formbusiness.controlinfo.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    controlList.value = []
  } finally {
    loading.value = false
  }
}

// 防抖搜索优化
let searchTimer = null

/**
 * 处理搜索操作
 * 触发控件信息搜索，带有防抖功能
 */
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true // 立即显示加载状态
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    getControlList()
  }, 300) // 300ms防抖
}

/**
 * 重置搜索条件
 * 清空搜索表单并重新获取数据
 */
const handleReset = () => {
  searchForm.controlCode = ''
  pagination.pageIndex = 1
  getControlList()
}

/**
 * 处理分页大小改变
 * @param {number} val - 新的分页大小
 */
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getControlList()
}

/**
 * 处理当前页改变
 * @param {number} val - 新的页码
 */
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getControlList()
}

/**
 * 重置表单数据
 * 清空表单字段为初始值
 */
const resetForm = () => {
  form.controlCode = ''
  form.controlName = ''
  form.description = ''
}

/**
 * 处理新增操作
 * 打开新增对话框并重置表单
 */
const handleAdd = () => {
  resetForm()
  dialogVisible.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}



/**
 * 处理删除操作
 * @param {Object} row - 要删除的控件信息行数据
 */
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.controlinfo.deleteConfirm'),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    deletingId.value = row.controlCode
    
    const params = {
      controlCode: row.controlCode
    }
    
    const response = await post(DELETE_CONTROL_API, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      getControlList()
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除控件信息失败:', error)
      ElMessage({
        message: t('formbusiness.controlinfo.operationFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } finally {
    deletingId.value = null
  }
}

/**
 * 处理表单提交
 * 提交新增的控件信息
 */
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    
    const params = {
      controlCode: form.controlCode,
      controlName: form.controlName,
      description: form.description
    }
    
    const response = await post(INSERT_CONTROL_ENTITY_API, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
      getControlList()
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    // 如果是表单验证失败，不显示错误提示，让Element Plus自己处理
    if (error !== false && typeof error === 'object' && error.message) {
      console.error('提交表单失败:', error)
      ElMessage({
        message: t('formbusiness.controlinfo.operationFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
    // 表单验证失败时，error通常是false或者验证错误对象，不显示Operation Failed
  } finally {
    submitLoading.value = false
  }
}

/**
 * 处理对话框关闭
 * 重置表单数据
 */
const handleDialogClose = () => {
  resetForm()
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getControlList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>

