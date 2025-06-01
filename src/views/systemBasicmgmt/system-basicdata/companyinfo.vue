<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      
      <div class="conventional-content">
        <!-- 过滤条件 -->
        <el-form :inline="true" :model="filters" class="conventional-filter-form">
          <el-form-item :label="$t('systemBasicmgmt.companyInfo.companyNameCh')">
            <el-input v-model="filters.companyNameCh" :placeholder="$t('systemBasicmgmt.companyInfo.pleaseInputNameCh')" style="width:170px" clearable />
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item :label="$t('systemBasicmgmt.companyInfo.companyNameEn')">
            <el-input v-model="filters.companyNameEn" :placeholder="$t('systemBasicmgmt.companyInfo.pleaseInputNameEn')" style="width:170px" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" class="conventional-filter-form-button" plain>
              {{ $t('common.search') }}
            </el-button>
            <el-button @click="handleReset">
              {{ $t('common.reset') }}
            </el-button>
          </el-form-item>
          <div class="conventional-form-right-area">
            <el-button type="primary" @click="handleAdd">
              {{ $t('systemBasicmgmt.companyInfo.addCompany') }}
            </el-button>
          </div>
        </el-form>
        
        <!-- 日志表格和分页的整体容器 -->
        <div class="table-pagination-container">
          <!-- 日志表格 -->
          <div class="table-wrapper">
            <el-table 
              :data="companyList" 
              style="width: 100%" 
              border 
              stripe
              max-height="calc(100vh - 240px)"
              :header-cell-style="{ background: '#f5f7fa' }"
              v-loading="loading"
              class="conventional-table"
            >
              <el-table-column type="index" :label="$t('systemBasicmgmt.companyInfo.index')" width="60" align="center" fixed />
              <el-table-column prop="companyNameCh" :label="$t('systemBasicmgmt.companyInfo.companyNameCh')" align="left" min-width="350" />
              <el-table-column prop="companyNameEn" :label="$t('systemBasicmgmt.companyInfo.companyNameEn')" align="left" min-width="350" />
              <el-table-column prop="companyiPhone" :label="$t('systemBasicmgmt.companyInfo.companyPhone')" align="center" min-width="130" />
              <el-table-column prop="companyFax" :label="$t('systemBasicmgmt.companyInfo.companyFax')" align="center" min-width="300" />
              <el-table-column prop="createdDate" :label="$t('systemBasicmgmt.companyInfo.createdTime')" min-width="180" />
              <el-table-column prop="remark" :label="$t('systemBasicmgmt.companyInfo.remark')" align="left" min-width="450" />
              <el-table-column :label="$t('systemBasicmgmt.companyInfo.operation')" min-width="150" fixed="right">
                  <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                      >{{ $t('common.edit') }}</el-button
                    >
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)"
                      >{{ $t('common.delete') }}</el-button
                    >
                  </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 分页 -->
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 编辑状态对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :inline="true" :model="editForm" label-width="100px" class="dialog-form">
        <div class="form-row">
          <el-form-item :label="$t('systemBasicmgmt.companyInfo.companyNameCh')">
            <el-input v-model="editForm.companyNameCh" style="width:250px"/>
          </el-form-item>
          <el-form-item :label="$t('systemBasicmgmt.companyInfo.companyNameEn')" >
            <el-input v-model="editForm.companyNameEn" style="width:250px"/>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systemBasicmgmt.companyInfo.companyPhone')" >
            <el-input v-model="editForm.companyiPhone" style="width:250px"/>
          </el-form-item>
          <el-form-item :label="$t('systemBasicmgmt.companyInfo.companyFax')" >
            <el-input v-model="editForm.companyFax" style="width:250px"/>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systemBasicmgmt.companyInfo.remark')" >
            <el-input v-model="editForm.remark" style="width:632px" type="textarea"/>
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
import { ref, reactive, onMounted } from 'vue'
import { post } from '@/utils/request'
import { GET_COMPANY_PAGES_API, INSERST_COMPANY_API, DELETE_COMPANY_API, GET_COMPANY_ENTITY_API, UPDATE_COMPANY_API } from '@/config/api/systemBasicmgmt/system-basic/company'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

// 初始化i18n
const { t } = useI18n()

// 公司数据
const companyList = ref([])
const loading = ref(false)

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 过滤条件
const filters = reactive({
  companyNameCh: '',
  companyNameEn: ''
})

// Composition API

// 对话框显示状态
const dialogVisible = ref(false)

// 编辑表单
const editForm = reactive({
  companyId: '',
  companyNameCh: '',
  companyNameEn: '',
  companyiPhone: '',
  companyFax: '',
  createdBy: 1,
  createdDate: '',
  modifiedBy: 1,
  modifiedDate: '',
  remark: ''
})

// 对话框标题
const dialogTitle = ref(t('systemBasicmgmt.companyInfo.editCompany'))

// 在组件挂载后获取公司数据
onMounted(() => {
  fetchCompanyPages()
})

// 获取公司实体数据
const fetchCompanyEntity = async (companyId) => {
  const params = {
    companyId: companyId
  }
  console.log(params)
  const res = await post(GET_COMPANY_ENTITY_API.GET_COMPANY_ENTITY, params)
  
  if (res && res.code === '200') {
    editForm.companyId = res.data.companyId
    editForm.companyNameCh = res.data.companyNameCh
    editForm.companyNameEn = res.data.companyNameEn
    editForm.companyiPhone = res.data.companyiPhone
    editForm.companyFax = res.data.companyFax
    editForm.createdBy = res.data.createdBy
    editForm.createdDate = res.data.createdDate
    editForm.modifiedBy = res.data.modifiedBy
    editForm.modifiedDate = res.data.modifiedDate
    editForm.remark = res.data.remark
  }
}

// 获取公司列表数据
const fetchCompanyPages = async () => {
  loading.value = true
  const params = {
    companyNameCh: filters.companyNameCh,
    companyNameEn: filters.companyNameEn,
    pageNumber: pagination.currentPage,
    pageSize: pagination.pageSize
  }
  
  const res = await post(GET_COMPANY_PAGES_API.GET_COMPANY_PAGES, params)
  
  if (res && res.code === '200') {
    companyList.value = res.data || []
    pagination.total = res.totalNumber || 0
  } else {
    ElMessage.error(res.message || t('systemBasicmgmt.companyInfo.getFailed'))
  }
  loading.value = false
}

// 处理搜索操作
const handleSearch = () => {
  pagination.currentPage = 1
  fetchCompanyPages()
}

// 重置搜索条件
const handleReset = () => {
  filters.companyNameCh = ''
  filters.companyNameEn = ''
  pagination.currentPage = 1
  fetchCompanyPages()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.currentPage = page
  fetchCompanyPages()
}

// 处理每页记录数变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  fetchCompanyPages()
}

const resetForm = () => {
  editForm.companyId = ''
  editForm.companyNameCh = ''
  editForm.companyNameEn = ''
  editForm.companyiPhone = ''
  editForm.companyFax = ''
  editForm.createdBy = 1
  editForm.createdDate = ''
  editForm.modifiedBy = 1
  editForm.modifiedDate = ''
  editForm.remark = ''
}

// 新增公司数据
const insertCompany = async () => {
  const params = {
    ...editForm
  }
  
  const res = await post(INSERST_COMPANY_API.INSERST_COMPANY, params)
  
  if (res && res.code === '200') {
    resetForm()
    ElMessage.success(res.message || t('systemBasicmgmt.companyInfo.saveSuccess'))
    dialogVisible.value = false
    fetchCompanyPages()
  } else {
    ElMessage.error(res.message || t('systemBasicmgmt.companyInfo.operationFailed'))
  }
}

// 更新公司数据
const updateCompany = async () => {
  const params = {
    ...editForm
  }
  const res = await post(UPDATE_COMPANY_API.UPDATE_COMPANY, params)

  if (res && res.code === '200') {
    resetForm()
    ElMessage.success(res.message || t('systemBasicmgmt.companyInfo.updateSuccess'))
    dialogVisible.value = false
    fetchCompanyPages()
  } else {
    ElMessage.error(res.message || t('systemBasicmgmt.companyInfo.operationFailed'))
  }
}

// 删除公司数据
const deleteCompany = async (companyId) => {
  const params = {
    CompanyId: companyId
  }
  
  const res = await post(DELETE_COMPANY_API.DELETE_COMPANY, params)
  
  if (res && res.code === '200') {
    ElMessage.success(res.message || t('systemBasicmgmt.companyInfo.deleteSuccess'))
    fetchCompanyPages()
  } else {
    ElMessage.error(res.message || t('systemBasicmgmt.companyInfo.operationFailed'))
  }
}

// 处理新增操作
const handleAdd = () => {
  // 重置表单数据
  resetForm()
  // 设置对话框标题
  dialogTitle.value = t('systemBasicmgmt.companyInfo.addCompany')
  // 显示对话框
  dialogVisible.value = true
}

// 处理编辑操作
const handleEdit = (index, row) => {
  // 重置表单数据
  resetForm()
  // 获取公司实体数据
  fetchCompanyEntity(row.companyId)
  // 设置对话框标题
  dialogTitle.value = t('systemBasicmgmt.companyInfo.editCompany')
  // 显示对话框
  dialogVisible.value = true
}

// 处理删除操作
const handleDelete = (index, row) => {
  ElMessageBox.confirm(
      t('systemBasicmgmt.companyInfo.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
    .then(() => {
      deleteCompany(row.companyId)
    })
    .catch(() => {
      // 取消删除
    })
}

// 保存编辑结果
const handleSave = () => {
  if (!editForm.companyNameCh) {
    ElMessage.warning(t('systemBasicmgmt.companyInfo.pleaseInputNameCh'))
    return
  }
  
  // 判断是新增还是编辑
  if (!editForm.companyId) {
    insertCompany()
  } else {
    updateCompany()
  }
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style> 