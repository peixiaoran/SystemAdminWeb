<template>
<div class="conventional-table-container">
  <el-card class="conventional-card">
    <!-- 搜索 -->
    <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="国籍信息">
      <el-form-item :label="$t('systembasicmgmt.nationalityInfo.filter.nationalityName')">
        <el-input style="width: 180px;"
                  v-model="filters.nationalityName"
                  :placeholder="$t('systembasicmgmt.nationalityInfo.pleaseInputName')"
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
          {{ $t('systembasicmgmt.nationalityInfo.addNationality') }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="nationalityList"
                border
                stripe
                :header-cell-style="{ background: '#f5f7fa' }"
                v-loading="loading"
                class="conventional-table">
        <el-table-column type="index" :label="$t('systembasicmgmt.nationalityInfo.index')" width="70" align="center" fixed />
        <el-table-column prop="nationNameCn" :label="$t('systembasicmgmt.nationalityInfo.nationNameCn')" align="left" min-width="240" />
        <el-table-column prop="nationNameEn" :label="$t('systembasicmgmt.nationalityInfo.nationNameEn')" align="left" min-width="360" />
        <el-table-column prop="remark" :label="$t('systembasicmgmt.nationalityInfo.remark')" align="left" min-width="450" />
        <el-table-column :label="$t('systembasicmgmt.nationalityInfo.operation')" min-width="150" fixed="right" align="center">
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
    <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="编辑国籍信息">
      <div class="form-row">
        <el-form-item :label="$t('systembasicmgmt.nationalityInfo.nationNameCn')" prop="nationNameCn">
          <el-input v-model="editForm.nationNameCn" style="width:100%" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.nationalityInfo.nationNameEn')" prop="nationNameEn">
          <el-input v-model="editForm.nationNameEn" style="width:100%" />
        </el-form-item>
      </div>
      <div class="form-row full-width">
        <el-form-item :label="$t('systembasicmgmt.nationalityInfo.remark')">
          <el-input v-model="editForm.remark" style="width:100%" type="textarea" :rows="3" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import { GET_NATIONALITY_LIST_API, INSERT_NATIONALITY_API, DELETE_NATIONALITY_API, GET_NATIONALITY_ENTITY_API, UPDATE_NATIONALITY_API } from '@/config/api/systembasicmgmt/system-basicdata/nationality'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'

// 初始化i18n
const { t } = useI18n()

// 国籍数据
const nationalityList = ref([])
const loading = ref(false)

// 表单引用
const editFormRef = ref(null)

// 过滤条件
const filters = reactive({
  nationalityName: '',
})

// 分页配置
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

// 对话框显示状态
const dialogVisible = ref(false)

// 提交加载状态
const submitLoading = ref(false)

// 编辑表单
const editForm = reactive({
  nationId: '',
  nationNameCn: '',
  nationNameEn: '',
  remark: ''
})

// 对话框标题
const dialogTitle = ref(t('systembasicmgmt.nationalityInfo.editNationality'))

// 表单验证规则
const formRules = reactive({
  nationNameCn: [
    { required: true, message: () => t('systembasicmgmt.nationalityInfo.pleaseInputNameCn'), trigger: 'blur' }
  ],
  nationNameEn: [
    { required: true, message: () => t('systembasicmgmt.nationalityInfo.pleaseInputNameEn'), trigger: 'blur' }
  ]
})

// 组件挂载后获取国籍数据
onMounted(() => {
  fetchNationalityList()
})

// 获取国籍实体数据
const fetchNationalityEntity = async (nationId) => {
  const params = {
    nationId: nationId
  }
  
  const res = await post(GET_NATIONALITY_ENTITY_API.GET_NATIONALITY_ENTITY, params)

  if (res && res.code === 200) {
    editForm.nationId = res.data.nationId
    editForm.nationNameCn = res.data.nationNameCn
    editForm.nationNameEn = res.data.nationNameEn
    editForm.remark = res.data.remark
  }
}

// 获取国籍列表数据
const fetchNationalityList = async () => {
  loading.value = true
  const params = {}

  const res = await post(GET_NATIONALITY_LIST_API.GET_NATIONALITY_LIST, params)

  if (res && res.code === 200) {
    nationalityList.value = res.data || []
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true,
    })
  }
  loading.value = false
}

// 使用通用防抖工具
const debouncedFetchNationalityList = debounce(() => {
  fetchNationalityList()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

const handleSearch = () => {
  loading.value = true
  debouncedFetchNationalityList()
}

// 立即查询数据（不使用防抖，用于保存后刷新）
const fetchNationalityListImmediate = () => {
  fetchNationalityList()
}

// 重置
const handleReset = () => {
  filters.nationalityName = ''
}

const resetForm = (clearValidation = true) => {
  // 清除验证状态（需要在重置之前）
  if (clearValidation && editFormRef.value) {
    try {
      editFormRef.value.clearValidate()
    } catch (error) {
      
    }
  }
  
  editForm.nationId = ''
  editForm.nationNameCn = ''
  editForm.nationNameEn = ''
  editForm.remark = ''
  
  // 重置完成后再次清除验证状态
  if (clearValidation) {
    nextTick(() => {
      if (editFormRef.value) {
        try {
          editFormRef.value.clearValidate()
        } catch (error) {

        }
      }
    })
  }
}

// 新增国籍操作
const insertNationality = async () => {
  const params = {
    ...editForm
  }

  const res = await post(INSERT_NATIONALITY_API.INSERT_NATIONALITY, params)

  if (res && res.code === 200) {
    resetForm()
    ElMessage({
      message: res.message,
      type: 'success',
      plain: true,
      showClose: true,
    })
    dialogVisible.value = false
    fetchNationalityList()
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true,
    })
  }
  submitLoading.value = false
}

// 更新国籍操作
const updateNationality = async () => {
  const params = {
    ...editForm
  }
  const res = await post(UPDATE_NATIONALITY_API.UPDATE_NATIONALITY, params)

  if (res && res.code === 200) {
    resetForm()
    ElMessage({
      message: res.message,
      type: 'success',
      plain: true,
      showClose: true,
    })
    dialogVisible.value = false
    fetchNationalityList()
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true,
    })
  }
  submitLoading.value = false
}

// 删除国籍操作
const deleteNationality = async (nationId) => {
  const params = {
    nationId: nationId
  }

  const res = await post(DELETE_NATIONALITY_API.DELETE_NATIONALITY, params)

  if (res && res.code === 200) {
    ElMessage({
      message: res.message,
      type: 'success',
      plain: true,
      showClose: true,
    })
    fetchNationalityList()
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true,
    })
  }
}

// 处理添加事件
const handleAdd = () => {
  // 重置表单数据
  resetForm()
  // 设置对话框标题
  dialogTitle.value = t('systembasicmgmt.nationalityInfo.addNationality')
  // 显示对话框
  dialogVisible.value = true
}

// 处理编辑事件
const handleEdit = async (index, row) => {
  // 重置表单数据
  resetForm()
  // 获取国籍实体数据
  await fetchNationalityEntity(row.nationId)
  // 设置对话框标题
  dialogTitle.value = t('systembasicmgmt.nationalityInfo.editNationality')
  // 显示对话框
  dialogVisible.value = true
}

// 处理删除事件
const handleDelete = (index, row) => {
  ElMessageBox.confirm(
      t('systembasicmgmt.nationalityInfo.deleteConfirm'),
      t('common.tip'),
      {
          confirmButtonText: t('common.confirm'),
          cancelButtonText: t('common.cancel'),
          type: 'warning',
      }
  )
      .then(() => {
          deleteNationality(row.nationId)
      })
      .catch(() => {
          // 取消删除
      })
}

// 处理编辑保存
const handleSave = () => {
  editFormRef.value?.validate((valid) => {
      if (valid) {
          submitLoading.value = true
          // 判断是新增还是编辑
          if (!editForm.nationId) {
              insertNationality()
          } else {
              updateNationality()
          }
      }
  })
}

// 处理对话框关闭
const handleDialogClose = () => {
  // 使用 nextTick 确保 DOM 更新完成后清除验证
  nextTick(() => {
      resetForm(true)
  })
}

// 处理分页页码变化
const handlePageChange = (page) => {
  pagination.pageIndex = page
  fetchNationalityList()
}

// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageIndex = 1
  fetchNationalityList()
}
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

