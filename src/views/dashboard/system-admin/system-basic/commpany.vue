<template>
    <div class="conventional-table-container">
      <el-card class="conventional-card">
        
        <div class="conventional-content">
          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form">
            <el-form-item label="网域编码">
              <el-input v-model="filters.domainCode" placeholder="请输入网域编码" style="width:180px" clearable />
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item label="网域名称">
              <el-input v-model="filters.domainName" placeholder="请输入网域名称" style="width:180px" clearable />
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
                新增网域
              </el-button>
            </div>
          </el-form>
          
          <!-- 日志表格 -->
          <div class="conventional-table-container">
            <el-table 
              :data="domainList" 
              style="width: 100%" 
              border 
              stripe
              height="600"
              :header-cell-style="{ background: '#f5f7fa' }"
              v-loading="loading"
              class="conventional-table"
            >
              <el-table-column type="index" label="序号" width="60" align="center" fixed />
              <el-table-column prop="domainCode" label="网域代码" align="left" min-width="230" />
              <el-table-column prop="domainName" label="网域名称" align="left" min-width="170" />
              <el-table-column prop="roleCode" label="权限标识" align="center" min-width="130" />
              <el-table-column prop="path" label="页面Path" align="left" min-width="230" />
              <el-table-column prop="domainIcon" label="网域图标" align="center" min-width="120" />
              <el-table-column prop="isEnabled" label="是否启用" align="center" min-width="90">
                <template #default="scope">
                  <div class="flex">
                    <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                      {{ scope.row.isEnabled ? '启用' : '禁用' }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="isVisible" label="是否显示" align="center" min-width="90">
                <template #default="scope">
                  <div class="flex">
                    <el-tag :type="scope.row.isVisible ? 'success' : 'danger'">
                      {{ scope.row.isVisible ? '显示' : '隐藏' }}
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
            <el-form-item label="网域代码">
              <el-input v-model="editForm.domainCode" style="width:250px"/>
            </el-form-item>
            <el-form-item label="网域名称" >
              <el-input v-model="editForm.domainName" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="网域图标" >
              <el-input v-model="editForm.domainIcon" style="width:250px"/>
            </el-form-item>
            <el-form-item label="网域排序" >
              <el-input v-model="editForm.sortOrder" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="权限标识" >
              <el-input v-model="editForm.roleCode" style="width:250px"/>
            </el-form-item>
            <el-form-item label="页面Path" >
              <el-input v-model="editForm.path" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="组件" >
              <el-input v-model="editForm.component" style="width:250px"/>
            </el-form-item>
            <el-form-item label="目标" >
              <el-input v-model="editForm.target" style="width:250px"/>
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
            <el-form-item label="是否显示" >
              <el-switch
                v-model="editForm.isVisible"
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
  import { post } from '@/utils/request'
  import { GET_DOMAIN_PAGES_API, INSERST_DOMAIN_API, DELETE_DOMAIN_API, GET_DOMAIN_ENTITY_API, UPDATE_DOMAIN_API } from '@/config/api/system-admin/system-mgmt/domain'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  // 日志数据
  const domainList = ref([])
  const loading = ref(false)
  const domainTypeList = ref([])
  
  // 分页信息
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  
  // 过滤条件
  const filters = reactive({
    domainCode: '',
    domainName: '',
    domainUrl: ''
  })
  
  // 对话框显示状态
  const dialogVisible = ref(false)
  
  // 编辑表单
  const editForm = reactive({
    domainId: '0',
    domainCode: '',
    domainName: '',
    domainIcon: '',
    sortOrder: 1,
    roleCode: '',
    isEnabled: true,
    isVisible: true,
    level: 1,
    path: '',
    component: '',
    target: '',
    remarks: ''
  })
  // 对话框标题
  const dialogTitle = ref('编辑网域信息')
  
  // 在组件挂载后获取日志数据
  onMounted(() => {
     fetchDomainPages()
  })
  
  // 获取网域实体数据
  const fetchDomainEntity = async (domainId) => {
    const params = {
      domainId: domainId
    }
    const res = await post(GET_DOMAIN_ENTITY_API.GET_DOMAIN_ENTITY, params)
    
    if (res && res.code === '200') {
      editForm.domainId = res.data.domainId
      editForm.domainCode = res.data.domainCode
      editForm.domainName = res.data.domainName
      editForm.domainIcon = res.data.domainIcon
      editForm.sortOrder = res.data.sortOrder
      editForm.roleCode = res.data.roleCode
      editForm.path = res.data.path
      editForm.component = res.data.component
      editForm.target = res.data.target
      editForm.remarks = res.data.remarks
      editForm.isEnabled = res.data.isEnabled
      editForm.isVisible = res.data.isVisible
      editForm.level = res.data.level
    }
  }
  
  // 获取域列表数据
  const fetchDomainPages = async () => {
    loading.value = true
    const params = {
      ...filters,
      pageNumber: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    
    const res = await post(GET_DOMAIN_PAGES_API.GET_DOMAIN_PAGES, params)
    
    if (res && res.code === '200') {
      domainList.value = res.data || []
      pagination.total = res.totalNumber || 0
    } else {
      ElMessage.error(res.message)
    }
    loading.value = false
  }
  
  // 处理搜索操作
  const handleSearch = () => {
    pagination.currentPage = 1
    fetchDomainPages()
  }
  
  // 重置搜索条件
  const handleReset = () => {
    filters.domainCode = ''
    filters.domainName = ''
    filters.domainUrl = ''
    pagination.currentPage = 1
    fetchDomainPages()
  }
  
  // 处理页码变化
  const handlePageChange = (page) => {
    pagination.currentPage = page
    fetchDomainPages()
  }
  
  // 处理每页记录数变化
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    pagination.currentPage = 1
    fetchDomainPages()
  }
  
  const resetForm = () => {
    editForm.component = ''
    editForm.target = ''
    editForm.path = ''
    editForm.roleCode = ''
    editForm.domainIcon = ''
    editForm.sortOrder = 1
    editForm.isEnabled = true
    editForm.isVisible = true
    editForm.domainId = '0'
    editForm.domainCode = ''
    editForm.domainName = ''
  }
  
  // 新增域列表数据
  const insertDomain = async () => {
    const params = {
      ...editForm
    }
    
    const res = await post(INSERST_DOMAIN_API.INSERST_DOMAIN, params)
    
    if (res && res.code === '200') {
      resetForm()
      ElMessage.success(res.message)
      dialogVisible.value = false
      fetchDomainPages()
      
    } else {
      ElMessage.error(res.message)
    }
  }
  
  // 更新域列表数据
  const updateDomain = async () => {
    const params = {
      ...editForm
    }
    const res = await post(UPDATE_DOMAIN_API.UPDATE_DOMAIN, params)
  
    if (res && res.code === '200') {
      resetForm()
      ElMessage.success(res.message)
      dialogVisible.value = false
      fetchDomainPages()
    } else {
      ElMessage.error(res.message)
    }
  }
  
  // 删除域列表数据
  const deleteDomain = async (domainId) => {
    const params = {
      domainId: domainId
    }
  
    if (isNaN(params.domainId)) {
      ElMessage.error('无效的域 ID')
      return
    }
    
    const res = await post(DELETE_DOMAIN_API.DELETE_DOMAIN, params)
    
    if (res && res.code === '200') {
      ElMessage.success(res.message)
      dialogVisible.value = false
      fetchDomainPages()
    } else {
      ElMessage.error(res.message)
    }
  }
  
  // 处理新增操作
  const handleAdd = () => {
    // 重置表单数据
    resetForm()
    // 设置对话框标题
    dialogTitle.value = '新增网域'
    // 显示对话框
    dialogVisible.value = true
  }
  
  // 处理编辑操作
  const handleEdit = (index, row) => {
    // 重置表单数据
    resetForm()
    // 获取网域实体数据
    fetchDomainEntity(row.domainId)
  
    // 设置对话框标题
    dialogTitle.value = '编辑网域信息'
    
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
        deleteDomain(row.domainId)
        // 重新获取数据
        fetchDomainPages()
      })
      .catch(() => {
        // 取消删除
      })
  }
  
  // 保存编辑结果
  const handleSave = () => {
    if (!editForm.domainCode || !editForm.domainName) {
      ElMessage.warning('请填写必要信息')
      return
    }
    // 判断是新增还是编辑
    const actionType = editForm.domainId === '0' ? '新增' : '编辑'
  
    if (actionType === '新增') {
       insertDomain()
    } else {
       updateDomain()
    }
    dialogVisible.value = false
    
    // 重新获取数据
     fetchDomainPages()
  }
  </script>
  
  <style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
  </style> 