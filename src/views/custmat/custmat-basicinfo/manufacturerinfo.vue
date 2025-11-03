<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="searchForm" class="conventional-filter-form" role="search" aria-label="厂商信息筛选">
        <el-form-item :label="$t('custmat.manufacturer.manufacturerCode')">
          <el-input
            v-model="searchForm.manufacturerCode"
            :placeholder="$t('custmat.manufacturer.pleaseInputManufacturerCode')"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="$t('custmat.manufacturer.manufacturerName')">
          <el-input
            v-model="searchForm.manufacturerName"
            :placeholder="$t('custmat.manufacturer.pleaseInputManufacturerName')"
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
            {{ $t('custmat.manufacturer.addManufacturer') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table 
          :data="manufacturerList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('custmat.manufacturer.index')" width="70" align="center" fixed />
          <el-table-column prop="manufacturerCode" :label="$t('custmat.manufacturer.manufacturerCode')" align="left" min-width="170" />
          <el-table-column prop="manufacturerNameCh" :label="$t('custmat.manufacturer.manufacturerNameCh')" align="left" min-width="260" />
          <el-table-column prop="manufacturerNameEn" :label="$t('custmat.manufacturer.manufacturerNameEn')" align="left" min-width="450" />
          <el-table-column prop="email" :label="$t('custmat.manufacturer.email')" align="left" min-width="220" />
          <el-table-column prop="fax" :label="$t('custmat.manufacturer.fax')" align="left" min-width="180" />
          <el-table-column prop="description" :label="$t('custmat.manufacturer.description')" align="left" min-width="350" />
          <el-table-column :label="$t('common.operation')" min-width="150" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)" :loading="deletingId === scope.row.manufacturerId">
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
      :title="isEdit ? $t('custmat.manufacturer.editManufacturer') : $t('custmat.manufacturer.addManufacturer')"
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
          aria-label="厂商信息编辑"
        >
          <div class="form-row">
            <el-form-item :label="$t('custmat.manufacturer.manufacturerCode')" prop="manufacturerCode">
              <el-input 
                v-model="form.manufacturerCode" 
                :placeholder="$t('custmat.manufacturer.pleaseInputManufacturerCode')"
                style="width:100%" 
              />
            </el-form-item>
            <el-form-item :label="$t('custmat.manufacturer.manufacturerNameCh')" prop="manufacturerNameCh">
              <el-input
                v-model="form.manufacturerNameCh"
                :placeholder="$t('custmat.manufacturer.pleaseInputManufacturerNameCh')"
                style="width:100%" 
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.manufacturer.manufacturerNameEn')" prop="manufacturerNameEn">
              <el-input
                v-model="form.manufacturerNameEn"
                :placeholder="$t('custmat.manufacturer.pleaseInputManufacturerNameEn')"
                style="width:100%" 
              />
            </el-form-item>
            <el-form-item :label="$t('custmat.manufacturer.email')" prop="email">
              <el-input
                v-model="form.email"
                :placeholder="$t('custmat.manufacturer.pleaseInputEmail')"
                style="width:100%" 
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('custmat.manufacturer.fax')" prop="fax">
              <el-input
                v-model="form.fax"
                :placeholder="$t('custmat.manufacturer.pleaseInputFax')"
                style="width:100%" 
              />
            </el-form-item>
          </div>
          <div class="form-row full-width">
            <el-form-item :label="$t('custmat.manufacturer.description')" prop="description">
              <el-input 
                v-model="form.description" 
                :placeholder="$t('custmat.manufacturer.pleaseInputDescription')"
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
  GET_MANUFACTURER_ENTITY_API,
  GET_MANUFACTURER_PAGE_API,
  INSERT_MANUFACTURER_API,
  UPDATE_MANUFACTURER_API,
  DELETE_MANUFACTURER_API
} from '@/config/api/custmat/custmat-basicinfo/manufacturerinfo.js'
import { useI18n } from 'vue-i18n'
import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'

// 使用i18n
const { t } = useI18n()

// 响应式数据
const loading = ref(false)
const dialogLoading = ref(false)
const submitLoading = ref(false)
const deletingId = ref(null)
const manufacturerList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

// 搜索表单
const searchForm = reactive({
  manufacturerCode: '',
  manufacturerName: ''
})

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

// 表单数据
const form = reactive({
  manufacturerId: '',
  manufacturerCode: '',
  manufacturerNameCh: '',
  manufacturerNameEn: '',
  email: '',
  fax: '',
  description: ''
})

// 表单验证规则
const rules = {
  manufacturerCode: [
    { required: true, message: () => t('custmat.manufacturer.pleaseInputManufacturerCode'), trigger: 'blur' }
  ],
  manufacturerNameCh: [
    { required: true, message: () => t('custmat.manufacturer.pleaseInputManufacturerNameCh'), trigger: 'blur' }
  ],
  manufacturerNameEn: [
    { required: true, message: () => t('custmat.manufacturer.pleaseInputManufacturerNameEn'), trigger: 'blur' }
  ]
}

/**
 * 获取厂商列表
 * 调用分页查询接口获取厂商信息列表
 */
const getManufacturerList = async () => {
  loading.value = true
  try {
    const params = {
      manufacturerCode: searchForm.manufacturerCode,
      manufacturerName: searchForm.manufacturerName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    }
    
    const response = await post(GET_MANUFACTURER_PAGE_API.GET_MANUFACTURER_PAGE, params)
    if (response.code === 200) {
      manufacturerList.value = response.data || []
      pagination.totalCount = response.totalCount || 0
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      manufacturerList.value = []
    }
  } catch (error) {
    console.error('获取厂商列表失败:', error)
    ElMessage({
      message: t('custmat.manufacturer.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    manufacturerList.value = []
  } finally {
    loading.value = false
  }
}

// 使用通用防抖工具
const debouncedGetManufacturerList = debounce(() => {
  getManufacturerList()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

/**
 * 处理搜索操作
 * 重置页码并触发厂商列表查询
 */
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedGetManufacturerList()
}

/**
 * 重置搜索条件
 * 清空搜索表单，不触发查询
 */
const handleReset = () => {
  searchForm.manufacturerCode = ''
  searchForm.manufacturerName = ''
}

/**
 * 分页大小改变处理
 * @param {number} val - 新的分页大小
 */
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  getManufacturerList()
}

/**
 * 当前页改变处理
 * @param {number} val - 新的页码
 */
const handleCurrentChange = (val) => {
  pagination.pageIndex = val
  getManufacturerList()
}

/**
 * 重置表单数据
 * 清空表单中的所有字段
 */
const resetForm = () => {
  form.manufacturerId = ''
  form.manufacturerCode = ''
  form.manufacturerNameCh = ''
  form.manufacturerNameEn = ''
  form.email = ''
  form.fax = ''
  form.description = ''
}

/**
 * 新增厂商
 * 打开新增对话框并重置表单
 */
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

/**
 * 编辑厂商
 * 获取厂商详情并打开编辑对话框
 * @param {Object} row - 厂商数据行
 */
const handleEdit = async (row) => {
  dialogLoading.value = true
  dialogVisible.value = true
  isEdit.value = true
  
  try {
    const params = {
      manufacturerId: row.manufacturerId
    }
    
    const response = await post(GET_MANUFACTURER_ENTITY_API.GET_MANUFACTURER_ENTITY, params)
    
    if (response.code === 200) {
      const data = response.data
      form.manufacturerId = data.manufacturerId
      form.manufacturerCode = data.manufacturerCode
      form.manufacturerNameCh = data.manufacturerNameCh
      form.manufacturerNameEn = data.manufacturerNameEn
      form.email = data.email
      form.fax = data.fax
      form.description = data.description
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
    console.error('获取厂商详情失败:', error)
    ElMessage({
      message: t('custmat.manufacturer.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
  }
}

/**
 * 删除厂商
 * 确认删除并调用删除接口
 * @param {Object} row - 厂商数据行
 */
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('custmat.manufacturer.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    
    deletingId.value = row.manufacturerId
    
    const params = {
      manufacturerId: row.manufacturerId
    }
    
    const response = await post(DELETE_MANUFACTURER_API.DELETE_MANUFACTURER, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      getManufacturerList()
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
      console.error('删除厂商失败:', error)
      ElMessage({
        message: t('custmat.manufacturer.operationFailed'),
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
 * 提交表单
 * 验证表单并调用新增或更新接口
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    
    submitLoading.value = true
    
    const params = {
      manufacturerId: form.manufacturerId,
      manufacturerCode: form.manufacturerCode,
      manufacturerNameCh: form.manufacturerNameCh,
      manufacturerNameEn: form.manufacturerNameEn,
      email: form.email,
      fax: form.fax,
      description: form.description
    }
    
    const api = isEdit.value ? UPDATE_MANUFACTURER_API.UPDATE_MANUFACTURER : INSERT_MANUFACTURER_API.INSERT_MANUFACTURER
    const response = await post(api, params)
    
    if (response.code === 200) {
      ElMessage({
        message: response.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
      getManufacturerList()
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
         message: t('custmat.manufacturer.operationFailed'),
         type: 'error',
         plain: true,
         showClose: true
       })
     }
   } finally {
     submitLoading.value = false
   }
}

/**
 * 对话框关闭处理
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
  getManufacturerList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>

