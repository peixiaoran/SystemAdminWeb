<template>
<div class="conventional-table-container">
  <el-card class="conventional-card">
    <!-- 搜索 -->
    <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="搜索部门级别">
      <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelCode')">
        <el-input v-model="filters.departmentLevelCode" :placeholder="$t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelCode')" style="width:170px" />
      </el-form-item>
      <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelName')">
        <el-input v-model="filters.departmentLevelName" :placeholder="$t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelName')" style="width:170px" />
      </el-form-item>
      <el-form-item class="form-button-group">
        <el-button type="primary" @click="handleSearch" class="conventional-filter-form-button" plain>
          {{ $t('common.search') }}
        </el-button>
        <el-button @click="handleReset">
          {{ $t('common.reset') }}
        </el-button>
      </el-form-item>
      <el-form-item class="form-right-button">
        <el-button type="primary" @click="handleAdd">
          {{ $t('systembasicmgmt.departmentLevel.addDepartmentLevel') }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="departmentLevelList"
                style="width: 100%"
                border
                stripe
                height="100%"
                :header-cell-style="{ background: '#f5f7fa' }"
                v-loading="loading"
                class="conventional-table">
        <el-table-column type="index" :label="$t('systembasicmgmt.departmentLevel.index')" width="70" align="center" fixed />
        <el-table-column prop="departmentLevelCode" :label="$t('systembasicmgmt.departmentLevel.departmentLevelCode')" align="center" min-width="150" />
        <el-table-column prop="departmentLevelNameCn" :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameCn')" align="left" min-width="200" />
        <el-table-column prop="departmentLevelNameEn" :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameEn')" align="left" min-width="200" />
        <el-table-column prop="description" :label="$t('systembasicmgmt.departmentLevel.description')" align="left" min-width="250" />
        <el-table-column :label="$t('systembasicmgmt.departmentLevel.operation')" min-width="130" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
            <el-button size="small"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <el-pagination v-model:current-page="pagination.pageIndex"
                     v-model:page-size="pagination.pageSize"
                     :page-sizes="[10, 20, 50, 100]"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pagination.totalCount"
                     @size-change="handleSizeChange"
                     @current-change="handlePageChange"/>
    </div>
  </el-card>

  <!-- 编辑弹窗 -->
  <el-dialog v-model="dialogVisible"
             :title="dialogTitle"
             width="50%"
             :close-on-click-modal="false"
             :append-to-body="true"
             :modal-append-to-body="true"
             :lock-scroll="true"
             @close="handleDialogClose">
    <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="编辑部门级别">
      <div class="form-row">
        <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelCode')" prop="departmentLevelCode">
          <el-input v-model="editForm.departmentLevelCode" style="width:100%" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameCn')" prop="departmentLevelNameCn">
          <el-input v-model="editForm.departmentLevelNameCn" style="width:100%" />
        </el-form-item>
      </div>
      <div class="form-row">
        <el-form-item :label="$t('systembasicmgmt.departmentLevel.departmentLevelNameEn')" prop="departmentLevelNameEn">
          <el-input v-model="editForm.departmentLevelNameEn" style="width:100%" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.departmentLevel.sortOrder')" prop="sortOrder">
          <el-input-number v-model="editForm.sortOrder" :min="1" style="width:100%" />
        </el-form-item>
      </div>
      <div class="form-row full-width">
        <el-form-item :label="$t('systembasicmgmt.departmentLevel.description')">
          <el-input v-model="editForm.description" style="width:100%" type="textarea" :rows="3" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave">{{ $t('common.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import { 
  GET_DEPARTMENT_LEVEL_LIST_API, 
  GET_DEPARTMENT_LEVEL_ENTITY_API, 
  INSERT_DEPARTMENT_LEVEL_API, 
  DELETE_DEPARTMENT_LEVEL_API, 
  UPDATE_DEPARTMENT_LEVEL_API 
} from '@/config/api/systembasicmgmt/system-basicdata/departmentlevel'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'

// 使用i18n
const { t } = useI18n()

// 级别列表
const departmentLevelList = ref([])
const loading = ref(false)

// 表单引用
const editFormRef = ref(null)

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

// 过滤条件
const filters = reactive({
  departmentLevelCode: '',
  departmentLevelName: ''
})

// 对话框显示状态
const dialogVisible = ref(false)

// 编辑表单
const editForm = reactive({
  departmentLevelId: '',
  departmentLevelCode: '',
  departmentLevelNameCn: '',
  departmentLevelNameEn: '',
  description: '',
  sortOrder: 1
})

// 对话框标题
const dialogTitle = ref('')

// 表单验证规则
const formRules = reactive({
  departmentLevelCode: [
    { required: true, message: () => t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelCode'), trigger: 'blur' }
  ],
  departmentLevelNameCn: [
    { required: true, message: () => t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelNameCn'), trigger: 'blur' }
  ],
  departmentLevelNameEn: [
    { required: true, message: () => t('systembasicmgmt.departmentLevel.pleaseInputDepartmentLevelNameEn'), trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: () => t('systembasicmgmt.departmentLevel.pleaseInputSortOrder'), trigger: 'blur' }
  ]
})

// 组件挂载后获取数据
onMounted(() => {
  fetchDepartmentLevelList()
})

// 获取部门级别实体数据
const fetchDepartmentLevelEntity = async (departmentLevelId) => {
  const params = {
    departmentLevelId: departmentLevelId
  }
  const res = await post(GET_DEPARTMENT_LEVEL_ENTITY_API.GET_DEPARTMENT_LEVEL_ENTITY, params)

  if (res && res.code === 200) {
    editForm.departmentLevelId = res.data.departmentLevelId
    editForm.departmentLevelCode = res.data.departmentLevelCode
    editForm.departmentLevelNameCn = res.data.departmentLevelNameCn
    editForm.departmentLevelNameEn = res.data.departmentLevelNameEn
    editForm.description = res.data.description
    editForm.sortOrder = res.data.sortOrder
  }
}

// 获取部门级别列表数据
const fetchDepartmentLevelList = async () => {
  loading.value = true
  try {
    const params = {
      departmentLevelCode: filters.departmentLevelCode,
      departmentLevelName: filters.departmentLevelName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    }

    const res = await post(GET_DEPARTMENT_LEVEL_LIST_API.GET_DEPARTMENT_LEVEL_LIST, params)

    if (res && res.code === 200) {
      departmentLevelList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      ElMessage({
        message: res.message || t('systembasicmgmt.departmentLevel.getFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
      departmentLevelList.value = []
    }
  } catch (error) {
    console.error('获取部门级别列表失败:', error)
    ElMessage({
      message: t('systembasicmgmt.departmentLevel.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
    departmentLevelList.value = []
  } finally {
    loading.value = false
  }
}

// 防抖获取列表
const debouncedFetchDepartmentLevelList = debounce(fetchDepartmentLevelList, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

// 立即获取部门级别列表（不使用防抖，用于保存后刷新）
const fetchDepartmentLevelListImmediate = () => {
  fetchDepartmentLevelList()
}

// 处理搜索操作（带防抖）
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedFetchDepartmentLevelList()
}

// 重置
const handleReset = () => {
  filters.departmentLevelCode = ''
  filters.departmentLevelName = ''
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.pageIndex = 1
  fetchDepartmentLevelListImmediate()
}

// 页码改变
const handlePageChange = (val) => {
  pagination.pageIndex = val
  fetchDepartmentLevelListImmediate()
}

// 添加
const handleAdd = () => {
  dialogTitle.value = t('systembasicmgmt.departmentLevel.addDepartmentLevel')
  editForm.departmentLevelId = ''
  editForm.departmentLevelCode = ''
  editForm.departmentLevelNameCn = ''
  editForm.departmentLevelNameEn = ''
  editForm.description = ''
  editForm.sortOrder = 1
  dialogVisible.value = true
  
  nextTick(() => {
    if (editFormRef.value) {
      editFormRef.value.clearValidate()
    }
  })
}

// 编辑
const handleEdit = async (index, row) => {
  dialogTitle.value = t('systembasicmgmt.departmentLevel.editDepartmentLevel')
  await fetchDepartmentLevelEntity(row.departmentLevelId)
  dialogVisible.value = true
  
  nextTick(() => {
    if (editFormRef.value) {
      editFormRef.value.clearValidate()
    }
  })
}

// 删除
const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.departmentLevel.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )

    const params = {
      departmentLevelId: row.departmentLevelId
    }

    const res = await post(DELETE_DEPARTMENT_LEVEL_API.DELETE_DEPARTMENT_LEVEL, params)

    if (res && res.code === 200) {
      ElMessage({
        message: res.message || t('systembasicmgmt.departmentLevel.deleteSuccess'),
        type: 'success',
        plain: true,
        showClose: true
      })
      fetchDepartmentLevelListImmediate()
    } else {
      ElMessage({
        message: res.message || t('systembasicmgmt.departmentLevel.deleteFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除部门级别失败:', error)
      ElMessage({
        message: t('systembasicmgmt.departmentLevel.deleteFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  }
}

// 保存
const handleSave = async () => {
  try {
    await editFormRef.value.validate()

    const params = {
      departmentLevelId: editForm.departmentLevelId,
      departmentLevelCode: editForm.departmentLevelCode,
      departmentLevelNameCn: editForm.departmentLevelNameCn,
      departmentLevelNameEn: editForm.departmentLevelNameEn,
      description: editForm.description,
      sortOrder: editForm.sortOrder
    }

    const api = editForm.departmentLevelId ? UPDATE_DEPARTMENT_LEVEL_API.UPDATE_DEPARTMENT_LEVEL : INSERT_DEPARTMENT_LEVEL_API.INSERT_DEPARTMENT_LEVEL
    const res = await post(api, params)

    if (res && res.code === 200) {
      ElMessage({
        message: res.message || t('systembasicmgmt.departmentLevel.saveSuccess'),
        type: 'success',
        plain: true,
        showClose: true
      })
      dialogVisible.value = false
      fetchDepartmentLevelListImmediate()
    } else {
      ElMessage({
        message: res.message || t('systembasicmgmt.departmentLevel.saveFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    if (error !== false) {
      console.error('保存部门级别失败:', error)
      ElMessage({
        message: t('systembasicmgmt.departmentLevel.saveFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  }
}

// 对话框关闭
const handleDialogClose = () => {
  if (editFormRef.value) {
    editFormRef.value.clearValidate()
  }
}
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

