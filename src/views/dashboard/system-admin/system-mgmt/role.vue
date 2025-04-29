<template>
    <div class="conventional-table-container">
      <el-card class="conventional-card">
        
        <div class="conventional-content">
          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form">
            <el-form-item label="角色编码">
              <el-input v-model="filters.roleCode" placeholder="请输入角色编码" style="width:180px" clearable />
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item label="角色名称">
              <el-input v-model="filters.roleName" placeholder="请输入角色名称" style="width:180px" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch" class="conventional-filter-form-button" plain>
                查询
              </el-button>
              <el-button @click="handleReset">
                重置
              </el-button>
            </el-form-item>
            <div class="conventional-form-right-area">
              <el-button type="primary" @click="handleAdd">
                新增角色
              </el-button>
            </div>
          </el-form>
          
          <!-- 日志表格 -->
          <div class="conventional-table-container">
            <el-table 
              :data="roleList" 
              style="width: 100%" 
              border 
              stripe
              height="600"
              :header-cell-style="{ background: '#f5f7fa' }"
              v-loading="loading"
              class="conventional-table"
            >
              <el-table-column type="index" label="序号" width="60" align="center" fixed />
              <el-table-column prop="roleCode" label="角色代码" align="left" min-width="240" />
              <el-table-column prop="roleName" label="角色名称" align="left" min-width="200" />
              <el-table-column prop="isEnabled" label="是否启用" align="center" min-width="90">
                <template #default="scope">
                  <div class="flex">
                    <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                      {{ scope.row.isEnabled ? '启用' : '禁用' }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="createdName" label="创建人" min-width="120" />
              <el-table-column prop="createdDate" label="创建时间" min-width="180" />
              <el-table-column label="操作" min-width="150" fixed="right">
                  <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      size="small"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)"
                      >删除</el-button
                    >
                  </template>
              </el-table-column>
            </el-table>
            
          </div>
          
          <!-- 分页 -->
          <div class="pagination-container">
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
            <el-form-item label="角色代码">
              <el-input v-model="editForm.roleCode" style="width:250px"/>
            </el-form-item>
            <el-form-item label="角色名称" >
              <el-input v-model="editForm.roleName" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="备注" >
              <el-input v-model="editForm.remarks" style="width:632px" type="textarea"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="是否启用" >
              <el-switch
                v-model="editForm.isEnabled"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              />
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSave">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { post, sanitizeHtml } from '@/utils/request'
  import { GET_ROLE_PAGES_API, GET_ROLE_ENTITY_API, INSERT_ROLE_API, DELETE_ROLE_API, UPDATE_ROLE_API } from '@/config/api/system-admin/system-mgmt/role'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { containsXssRisk } from '@/utils/xssUtils'
  
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
  const dialogTitle = ref('编辑角色信息')
  
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
      ElMessage.error('无效的角色 ID')
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
    dialogTitle.value = '新增角色信息'
    
    // 显示对话框
    dialogVisible.value = true
  }
  
  // 处理编辑操作
  const handleEdit = (index, row) => {
    // 重置表单数据
    resetForm()
    
    // 设置对话框标题
    dialogTitle.value = '编辑角色信息'
    
    // 获取角色实体数据
    fetchRoleEntity(row.roleId)
    
    // 显示对话框
    dialogVisible.value = true
  }
  
  // 处理删除操作
  const handleDelete = (index, row) => {
    ElMessageBox.confirm(
        '确定要删除该条记录吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
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
      ElMessage.warning('请填写角色代码和角色名称')
      return
    }
    
    // 检查输入是否包含XSS风险
    const inputFields = [
      { name: '角色代码', value: editForm.roleCode },
      { name: '角色名称', value: editForm.roleName },
      { name: '角色描述', value: editForm.description },
      { name: '备注', value: editForm.remarks }
    ]
    
    for (const field of inputFields) {
      if (field.value && containsXssRisk(field.value)) {
        ElMessage.error(`${field.name}中包含潜在的XSS攻击代码，请检查输入`)
        return
      }
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
  @import '@/assets/styles/conventionalTablePage.css';
  </style> 