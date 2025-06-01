<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 过滤条件 -->
      <el-form 
        :inline="true" 
        :model="filters" 
        class="conventional-filter-form"
      >
        <el-form-item :label="$t('systemBasicmgmt.systemMgmt.role.roleCode')">
          <el-input 
            v-model="filters.roleCode" 
            :placeholder="$t('systemBasicmgmt.systemMgmt.role.pleaseInputRoleCode')" 
            clearable 
          />
        </el-form-item>
        
        <el-form-item :label="$t('systemBasicmgmt.systemMgmt.role.roleName')">
          <el-input 
            v-model="filters.roleName" 
            :placeholder="$t('systemBasicmgmt.systemMgmt.role.pleaseInputRoleName')" 
            clearable 
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
            {{ $t('systemBasicmgmt.systemMgmt.role.addRole') }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表格区域 -->
      <div class="table-container">
        <el-table 
          :data="roleList" 
          border 
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column 
            type="index" 
            :label="$t('systemBasicmgmt.systemMgmt.index')" 
            width="60" 
            align="center" 
            fixed 
          />
          <el-table-column 
            prop="roleCode" 
            :label="$t('systemBasicmgmt.systemMgmt.role.roleCode')" 
            align="left" 
            min-width="240" 
          />
          <el-table-column 
            prop="roleName" 
            :label="$t('systemBasicmgmt.systemMgmt.role.roleName')" 
            align="left" 
            min-width="200" 
          />
          <el-table-column 
            prop="roleName" 
            :label="$t('systemBasicmgmt.systemMgmt.role.roleName')" 
            align="left" 
            min-width="200" 
          />
          <el-table-column 
            prop="roleName" 
            :label="$t('systemBasicmgmt.systemMgmt.role.roleName')" 
            align="left" 
            min-width="200" 
          />
          <el-table-column 
            prop="roleName" 
            :label="$t('systemBasicmgmt.systemMgmt.role.roleName')" 
            align="left" 
            min-width="200" 
          />
          <el-table-column 
            prop="roleName" 
            :label="$t('systemBasicmgmt.systemMgmt.role.roleName')" 
            align="left" 
            min-width="200" 
          />
          <el-table-column 
            prop="isEnabled" 
            :label="$t('systemBasicmgmt.systemMgmt.isEnabled')" 
            align="center" 
            min-width="80"
          >
            <template #default="scope">
              <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                {{ scope.row.isEnabled ? $t('systemBasicmgmt.systemMgmt.enabled') : $t('systemBasicmgmt.systemMgmt.disabled') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column 
            prop="createdName" 
            :label="$t('systemBasicmgmt.systemMgmt.createdBy')" 
            min-width="120" 
          />
          <el-table-column 
            prop="createdDate" 
            :label="$t('systemBasicmgmt.systemMgmt.createdTime')" 
            min-width="180" 
          />
          <el-table-column 
            :label="$t('systemBasicmgmt.systemMgmt.operation')" 
            min-width="150" 
            fixed="right"
          >
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                {{ $t('common.edit') }}
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >
                {{ $t('common.delete') }}
              </el-button>
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
    </el-card>
    
    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="100px" class="dialog-form">
        <div class="form-row">
          <el-form-item :label="$t('systemBasicmgmt.systemMgmt.role.roleCode')">
            <el-input v-model="editForm.roleCode" />
          </el-form-item>
          <el-form-item :label="$t('systemBasicmgmt.systemMgmt.role.roleName')" >
            <el-input v-model="editForm.roleName" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systemBasicmgmt.systemMgmt.remarks')" >
            <el-input 
              v-model="editForm.remarks" 
              type="textarea" 
              :rows="3"
            />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systemBasicmgmt.systemMgmt.isEnabled')" >
            <el-switch
              v-model="editForm.isEnabled"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
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
import { post, sanitizeHtml } from '@/utils/request'
import { GET_ROLE_PAGES_API, GET_ROLE_ENTITY_API, INSERT_ROLE_API, DELETE_ROLE_API, UPDATE_ROLE_API } from '@/config/api/systemBasicmgmt/system-mgmt/role'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

// 使用i18n
const { t } = useI18n()

// 角色数据
const roleList = ref([])
const loading = ref(false)

// 分页信息
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 过滤条件
const filters = reactive({
  roleCode: '',
  roleName: ''
})

// 对话框显示状态
const dialogVisible = ref(false)

// 编辑表单
const editForm = reactive({
  roleId: '',
  roleCode: '',
  roleName: '',
  description: '',
  isEnabled: true,
  remarks: ''
})
// 对话框标题
const dialogTitle = ref(t('systemBasicmgmt.systemMgmt.role.editRole'))

// 在组件挂载后获取角色数据
onMounted(() => {
  fetchRolePages()
})

// 获取角色列表数据
const fetchRolePages = async () => {
  loading.value = true
  const params = {
    ...filters,
    pageNumber: pagination.currentPage,
    pageSize: pagination.pageSize
  }
  
  const res = await post(GET_ROLE_PAGES_API.GET_ROLE_PAGES, params)
  
  // 在设置数据前，确保使用sanitizeHtml清洗敏感字段
  roleList.value = res.data || []
  pagination.total = res.totalNumber || 0
  loading.value = false
}

// 获取角色实体数据
const fetchRoleEntity = async (roleId) => {
  const params = {
    roleId: roleId
  }
  const res = await post(GET_ROLE_ENTITY_API.GET_ROLE_ENTITY, params)
  
  if (res && res.code === '200') {
    // 对字符串类型字段进行额外的XSS清洗
    editForm.roleId = res.data.roleId
    editForm.roleCode = sanitizeHtml(res.data.roleCode || '')
    editForm.roleName = sanitizeHtml(res.data.roleName || '')
    editForm.description = sanitizeHtml(res.data.description || '')
    editForm.isEnabled = res.data.isEnabled
    editForm.remarks = sanitizeHtml(res.data.remarks || '')
  }
}

// 处理搜索操作
const handleSearch = () => {
  pagination.currentPage = 1
  fetchRolePages()
}

// 重置搜索条件
const handleReset = () => {
  filters.roleCode = ''
  filters.roleName = ''
  pagination.currentPage = 1
  fetchRolePages()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.currentPage = page
  fetchRolePages()
}

// 处理每页记录数变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  fetchRolePages()
}

const resetForm = () => {
  editForm.roleId = ''
  editForm.roleCode = ''
  editForm.roleName = ''
  editForm.description = ''
  editForm.isEnabled = true
  editForm.remarks = ''
}

// 新增角色数据
const insertRole = async () => {
  const params = {
    roleId: '',
    roleCode: editForm.roleCode,
    roleName: editForm.roleName,
    description: editForm.description,
    isEnabled: editForm.isEnabled,
    remarks: editForm.remarks
  }
  const res = await post(INSERT_ROLE_API.INSERST_ROLE, params)
  
  if (res && res.code === '200') {
    resetForm()
    fetchRolePages()
  } else {
    ElMessage.error(res.message)
  }
}

// 更新角色数据
const updateRole = async () => {
  const params = {
    roleId: editForm.roleId,
    roleCode: editForm.roleCode,
    roleName: editForm.roleName,
    description: editForm.description,
    isEnabled: editForm.isEnabled,
    remarks: editForm.remarks
  }
  const res = await post(UPDATE_ROLE_API.UPDATE_ROLE, params)

  if (res && res.code === '200') {
    resetForm()
    ElMessage.success(res.message)
    dialogVisible.value = false
    fetchRolePages()
  } else {
    ElMessage.error(res.message)
  }
}

// 删除角色数据
const deleteRole = async (roleId) => {
  const params = {
    roleId: roleId
  }

  if (isNaN(params.roleId)) {
    ElMessage.error(t('systemBasicmgmt.systemMgmt.invalidId'))
    return
  }
  
  const res = await post(DELETE_ROLE_API.DELETE_ROLE, params)
  
  if (res && res.code === '200') {
    ElMessage.success(res.message)
    dialogVisible.value = false
    fetchRolePages()
  } else {
    ElMessage.error(res.message)
  }
}

// 处理新增操作
const handleAdd = () => {
  // 重置表单数据
  resetForm()
  // 设置默认值
  editForm.roleId = ''
  editForm.isEnabled = true
  
  // 设置对话框标题
  dialogTitle.value = t('systemBasicmgmt.systemMgmt.role.addRole')
  
  // 显示对话框
  dialogVisible.value = true
}

// 处理编辑操作
const handleEdit = (index, row) => {
  // 重置表单数据
  resetForm()
  
  // 设置对话框标题
  dialogTitle.value = t('systemBasicmgmt.systemMgmt.role.editRole')
  
  // 获取角色实体数据
  fetchRoleEntity(row.roleId)
  
  // 显示对话框
  dialogVisible.value = true
}

// 处理删除操作
const handleDelete = (index, row) => {
  ElMessageBox.confirm(
      t('systemBasicmgmt.systemMgmt.role.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
    .then(() => {
      deleteRole(row.roleId)
      // 重新获取数据
      fetchRolePages()
    })
    .catch(() => {
      // 取消删除
    })
}

// 保存编辑结果
const handleSave = () => {
  if (!editForm.roleCode || !editForm.roleName) {
    ElMessage.warning(t('systemBasicmgmt.systemMgmt.fillRequiredInfo'))
    return
  }
  
  // 判断是新增还是编辑
  const isNewRole = !editForm.roleId || editForm.roleId === ''

  if (isNewRole) {
     insertRole()
  } else {
     updateRole()
  }
  dialogVisible.value = false
  
  // 重新获取数据
   fetchRolePages()
}
</script>

<style scoped>

/* 卡片样式 */
.conventional-card {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 筛选表单样式 - 移除背景色，调整标签垂直居中 */
.conventional-filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 16px;
  border-radius: 4px;
}

.conventional-filter-form .el-form-item {
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

.conventional-filter-form .el-form-item :deep(.el-form-item__label) {
  white-space: normal;
  text-align: center;
  line-height: 1.4;
  padding: 0 8px 0 0;
  flex-shrink: 0;
  display: flex;
  align-items: center; /* 标签文字垂直居中 */
}

.form-button-group {
  margin-left: 8px;
}

.form-right-button {
  margin-left: auto;
}

/* 表格容器 - 增加高度 */
.table-container {
  width: 99%;
  margin: 0 auto;
  flex-direction: column;
  /* 添加以下两行 */
  position: relative;
  z-index: 1;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.conventional-table {
  flex: 1;
  width: 100%;
  height: 100%; /* 新增 */
}

.conventional-table :deep(.el-table__body-wrapper) {
  overflow-x: hidden;
}

.conventional-table :deep(.el-table__fixed) {
  height: 100% !important;
}

/* 分页样式 - 确保固定在底部 */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
  background: white;
  flex-shrink: 0;
}

/* 对话框表单样式 */
.dialog-form :deep(.el-form-item) {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.dialog-form :deep(.el-form-item__label) {
  white-space: normal;
  text-align: center;
  line-height: 1.4;
  display: flex;
  align-items: center; /* 标签文字垂直居中 */
  justify-content: flex-end; /* 右对齐 */
  height: auto; /* 允许高度自适应 */
  padding: 0 12px 0 0;
}

.dialog-form .form-row {
  display: flex;
  margin-bottom: 18px;
}

.dialog-form .form-row .el-form-item {
  flex: 1;
  margin-right: 20px;
}

.dialog-form .form-row .el-form-item:last-child {
  margin-right: 0;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .conventional-filter-form {
    gap: 12px;
  }
  
  .conventional-filter-form .el-form-item {
    flex: 0 0 calc(50% - 12px);
  }
  
  .form-button-group,
  .form-right-button {
    flex: 0 0 100%;
    justify-content: flex-end;
    margin-top: 8px;
  }
}

@media (max-width: 768px) {
  .conventional-filter-form .el-form-item {
    flex: 0 0 100%;
  }
  
  .dialog-form .form-row {
    flex-direction: column;
  }
  
  .dialog-form .form-row .el-form-item {
    margin-right: 0;
    margin-bottom: 18px;
  }
  
  .conventional-table-container {
    padding: 8px;
  }
}

/* 滚动条处理 */
.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* 防止浏览器缩放时布局错乱 */
.conventional-table-container {
  min-width: 1024px;
}
</style>