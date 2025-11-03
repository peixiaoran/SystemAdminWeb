<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" aria-label="员工职业筛选">
        <el-form-item :label="$t('systembasicmgmt.userLabor.laborName')">
          <el-input
            v-model="searchForm.laborName"
            :placeholder="$t('systembasicmgmt.userLabor.pleaseInputLaborName')"
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
            {{ $t('systembasicmgmt.userLabor.addLabor') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table 
          :data="laborList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('systembasicmgmt.userLabor.index')" width="70" align="center" fixed />
          <el-table-column prop="laborNameCn" :label="$t('systembasicmgmt.userLabor.laborNameCn')" align="left" min-width="200" />
          <el-table-column prop="laborNameEn" :label="$t('systembasicmgmt.userLabor.laborNameEn')" align="left" min-width="200" />
          <el-table-column prop="laborDescription" :label="$t('systembasicmgmt.userLabor.laborDescription')" align="left" min-width="250" />
          <el-table-column :label="$t('common.operation')" min-width="100" fixed="right" align="center"><template #default="scope"><el-button size="small" @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button><el-button size="small" type="danger" @click="handleDelete(scope.row)" :loading="deletingId === scope.row.laborId">{{ $t('common.delete') }}</el-button></template></el-table-column>
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
      :title="isEdit ? $t('systembasicmgmt.userLabor.editLabor') : $t('systembasicmgmt.userLabor.addLabor')"
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
          label-width="100px" 
          class="dialog-form"
          role="form" 
          aria-label="员工职业编辑"
        >
          <div class="form-row">
            <el-form-item :label="$t('systembasicmgmt.userLabor.laborNameCn')" prop="laborNameCn">
              <el-input 
                v-model="form.laborNameCn" 
                :placeholder="$t('systembasicmgmt.userLabor.pleaseInputLaborNameCn')"
                style="width:100%" 
              />
            </el-form-item>
            <el-form-item :label="$t('systembasicmgmt.userLabor.laborNameEn')" prop="laborNameEn">
              <el-input
                v-model="form.laborNameEn"
                :placeholder="$t('systembasicmgmt.userLabor.pleaseInputLaborNameEn')"
                style="width:100%" 
              />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('systembasicmgmt.userLabor.laborDescription')" prop="laborDescription">
              <el-input 
                v-model="form.laborDescription" 
                :placeholder="$t('systembasicmgmt.userLabor.pleaseInputLaborDescription')"
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
  GET_USERLABOR_LIST_API,
  GET_USER_LABOR_ENTITY_API,
  INSERT_USER_LABOR_API,
  UPDATE_USER_LABOR_API,
  DELETE_USER_LABOR_API
} from '@/config/api/systembasicmgmt/system-basicdata/userlabor.js'
import { useI18n } from 'vue-i18n'
import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'

// 使用i18n
const { t } = useI18n()

// 响应式数据
const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const deletingId = ref(null)
const laborList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

// 搜索表单
const searchForm = reactive({
  laborName: ''
})

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

// 表单数据
const form = reactive({
  laborId: '',
  laborNameCn: '',
  laborNameEn: '',
  laborDescription: ''
})

// 表单验证规则
const rules = {
  laborNameCn: [
    { required: true, message: () => t('systembasicmgmt.userLabor.pleaseInputLaborNameCn'), trigger: 'blur' }
  ],
  laborNameEn: [
    { required: true, message: () => t('systembasicmgmt.userLabor.pleaseInputLaborNameEn'), trigger: 'blur' }
  ]
}

// 获取职业列表
const getLaborList = async () => {
  loading.value = true
  try {
  const params = {
    laborName: searchForm.laborName,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    totalCount: pagination.total
  }
  
  const response = await post(GET_USERLABOR_LIST_API.GET_USERLABOR_LIST, params)
  if (response.code === 200) {
    laborList.value = response.data || []
    pagination.totalCount = response.totalCount || 0
  } else {
    ElMessage({
      message: response.message,
      type: 'error',
      plain: true,
      showClose: true
    })
    laborList.value = []
  }
  } catch (error) {
    console.error('获取职业列表失败:', error)
    ElMessage({
      message: t('systembasicmgmt.userLabor.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    laborList.value = []
  } finally {
    loading.value = false
  }
}

// 使用通用防抖工具
const debouncedGetLaborList = debounce(() => {
  getLaborList()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

// 处理搜索操作（带防抖）
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedGetLaborList()
}

// 重置搜索
const handleReset = () => {
  searchForm.laborName = ''
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getLaborList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getLaborList()
}

// 新增
const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}

// 编辑
const handleEdit = async (row) => {
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true
  
  try {
    const params = {
      laborId: row.laborId
    }
    
    const response = await post(GET_USER_LABOR_ENTITY_API.GET_USER_LABOR_ENTITY, params)
    
    if (response.code === 200) {
      const data = response.data
      form.laborId = data.laborId
      form.laborNameCn = data.laborNameCn
      form.laborNameEn = data.laborNameEn
      form.laborDescription = data.laborDescription
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
    }
  } catch (error) {
    console.error('获取职业详情失败:', error)
    ElMessage({
      message: t('systembasicmgmt.userLabor.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
  }
}

// 删除
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.userLabor.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    deletingId.value = row.laborId
    
    const params = {
      laborId: row.laborId
    }
    
    const response = await post(DELETE_USER_LABOR_API.DELETE_USER_LABOR, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      getLaborList()
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
      console.error('删除职业失败:', error)
      ElMessage({
        message: t('systembasicmgmt.userLabor.operationFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } finally {
    deletingId.value = null
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    
    const params = {
      laborId: form.laborId,
      laborNameCn: form.laborNameCn,
      laborNameEn: form.laborNameEn,
      laborDescription: form.laborDescription
    }
    
    const api = isEdit.value ? UPDATE_USER_LABOR_API.UPDATE_USER_LABOR : INSERT_USER_LABOR_API.INSERT_USER_LABOR
    const response = await post(api, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
      getLaborList()
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
   } catch (error) {
     if (error !== false) {
       console.error('提交表单失败:', error)
       ElMessage({
         message: t('systembasicmgmt.userLabor.operationFailed'),
         type: 'error',
         plain: true,
         showClose: true
       })
     }
   } finally {
     submitLoading.value = false
   }
}

// 重置表单
const resetForm = () => {
  form.laborId = ''
  form.laborNameCn = ''
  form.laborNameEn = ''
  form.laborDescription = ''
}

// 对话框关闭
const handleDialogClose = () => {
  resetForm()
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getLaborList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>

