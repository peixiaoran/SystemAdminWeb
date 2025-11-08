<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" aria-label="事件信息筛选">
        <!-- 控件代码下拉框 -->
        <el-form-item :label="$t('formbusiness.eventinfo.controlCode')">
          <el-select
            v-model="searchForm.controlCode"
            :placeholder="$t('formbusiness.eventinfo.pleaseSelectControlCode')"
            filterable
            style="width: 180px"
            @change="handleSearch"
          >
            <el-option
              v-for="item in controlOptions"
              :key="item.controlCode"
              :label="item.controlName"
              :value="item.controlCode"
            />
          </el-select>
        </el-form-item>
        
        <!-- 事件代码搜索框 -->
        <el-form-item :label="$t('formbusiness.eventinfo.eventCode')">
          <el-input
            v-model="searchForm.eventCode"
            :placeholder="$t('formbusiness.eventinfo.pleaseInputEventCode')"
            clearable
            style="width: 180px"
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
            {{ $t('formbusiness.eventinfo.addEvent') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table 
          :data="eventList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('formbusiness.eventinfo.index')" width="70" align="center" fixed />
          <el-table-column prop="controlName" :label="$t('formbusiness.eventinfo.controlName')" align="left" min-width="150" />
          <el-table-column prop="eventCode" :label="$t('formbusiness.eventinfo.eventCode')" align="left" min-width="150" />
          <el-table-column prop="eventName" :label="$t('formbusiness.eventinfo.eventName')" align="left" min-width="150" />
          <el-table-column prop="description" :label="$t('formbusiness.eventinfo.description')" align="left" min-width="300" />
          
          <el-table-column :label="$t('common.operation')" min-width="70" fixed="right" align="center">
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
    
    <!-- 新增事件对话框 -->
    <el-dialog 
      v-model="dialogVisible"
      :title="$t('formbusiness.eventinfo.addEvent')"
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
          aria-label="事件信息编辑"
        >
          <div class="form-row">
            <!-- 控件代码选择 -->
            <el-form-item :label="$t('formbusiness.eventinfo.controlCode')" prop="controlCode">
              <el-select
                v-model="form.controlCode"
                :placeholder="$t('formbusiness.eventinfo.pleaseSelectControlCode')"
                filterable
                style="width:100%"
              >
                <el-option
                  v-for="item in controlOptions"
                  :key="item.controlCode"
                  :label="item.controlName"
                  :value="item.controlCode"
                />
              </el-select>
            </el-form-item>
            
            <!-- 事件代码输入 -->
            <el-form-item :label="$t('formbusiness.eventinfo.eventCode')" prop="eventCode">
              <el-input
                v-model="form.eventCode"
                :placeholder="$t('formbusiness.eventinfo.pleaseInputEventCode')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          
          <div class="form-row">
            <!-- 事件名称输入 -->
            <el-form-item :label="$t('formbusiness.eventinfo.eventName')" prop="eventName">
              <el-input
                v-model="form.eventName"
                :placeholder="$t('formbusiness.eventinfo.pleaseInputEventName')"
                style="width:100%"
              />
            </el-form-item>
          </div>
          
          <div class="form-row full-width">
            <!-- 描述输入 -->
            <el-form-item :label="$t('formbusiness.eventinfo.description')" prop="description">
              <el-input 
                v-model="form.description" 
                :placeholder="$t('formbusiness.eventinfo.pleaseInputDescription')"
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
  GET_EVENT_PAGE_API,
  INSERT_EVENT_ENTITY_API,
  DELETE_EVENT_API,
  GET_CONTROL_DROPDOWN_API
} from '@/config/api/formbusiness/form-basicInfo/eventInfo.js'
import { useI18n } from 'vue-i18n'

// 使用i18n
const { t } = useI18n()

// 响应式数据
const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const deletingId = ref(null)
const eventList = ref([])
const controlOptions = ref([])
const dialogVisible = ref(false)
const formRef = ref(null)

// 搜索表单
const searchForm = reactive({
  controlCode: '',
  eventCode: ''
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
  eventCode: '',
  eventName: '',
  description: ''
})

// 表单验证规则
const rules = {
  controlCode: [
    { required: true, message: () => t('formbusiness.eventinfo.pleaseSelectControlCode'), trigger: 'change' }
  ],
  eventCode: [
    { required: true, message: () => t('formbusiness.eventinfo.pleaseInputEventCode'), trigger: 'blur' }
  ],
  eventName: [
    { required: true, message: () => t('formbusiness.eventinfo.pleaseInputEventName'), trigger: 'blur' }
  ]
}

/**
 * 获取控件下拉选项
 * 调用接口获取控件下拉列表数据
 */
const getControlOptions = async () => {
  try {
    const response = await post(GET_CONTROL_DROPDOWN_API, {})
    if (response.code === 200) {
      controlOptions.value = response.data || []
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      controlOptions.value = []
    }
  } catch (error) {
    console.error('获取控件下拉选项失败:', error)
    ElMessage({
      message: t('formbusiness.eventinfo.getControlOptionsFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    controlOptions.value = []
  }
}

/**
 * 获取事件信息列表
 * 调用分页查询接口获取事件信息数据
 */
const getEventList = async () => {
  loading.value = true
  try {
    const params = {
      controlCode: searchForm.controlCode,
      eventCode: searchForm.eventCode,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    }
    
    const response = await post(GET_EVENT_PAGE_API, params)
    if (response.code === 200) {
      eventList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      eventList.value = []
    }
  } catch (error) {
    console.error('获取事件信息列表失败:', error)
    ElMessage({
      message: t('formbusiness.eventinfo.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    eventList.value = []
  } finally {
    loading.value = false
  }
}

// 防抖搜索优化
let searchTimer = null

/**
 * 处理搜索操作
 * 触发事件信息搜索，带有防抖功能
 */
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true // 立即显示加载状态
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    getEventList()
  }, 300) // 300ms防抖
}

/**
 * 重置搜索条件
 * 不清空下拉框值，只清空文本框并重新获取数据
 */
const handleReset = () => {
  searchForm.eventCode = ''
  pagination.pageIndex = 1
  loading.value = true // 立即显示加载状态
  getEventList()
}

/**
 * 处理分页大小改变
 * @param {number} val - 新的分页大小
 */
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getEventList()
}

/**
 * 处理当前页改变
 * @param {number} val - 新的页码
 */
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getEventList()
}

/**
 * 重置表单数据
 * 清空表单字段为初始值
 */
const resetForm = () => {
  form.controlCode = ''
  form.eventCode = ''
  form.eventName = ''
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
 * @param {Object} row - 要删除的事件信息行数据
 */
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.eventinfo.deleteConfirm'),
      t('common.warning'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    deletingId.value = row.eventCode
    
    const params = {
      eventCode: row.eventCode
    }
    
    const response = await post(DELETE_EVENT_API, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      getEventList()
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
      console.error('删除事件信息失败:', error)
      ElMessage({
        message: t('formbusiness.eventinfo.operationFailed'),
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
 * 提交新增的事件信息
 */
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    
    const params = {
      controlCode: form.controlCode,
      eventCode: form.eventCode,
      eventName: form.eventName,
      description: form.description
    }
    
    const response = await post(INSERT_EVENT_ENTITY_API, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
      getEventList()
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
        message: t('formbusiness.eventinfo.operationFailed'),
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
  getControlOptions()
  getEventList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>

