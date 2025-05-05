<template>
    <div class="conventional-table-container">
      <el-card class="conventional-card">
        
        <div class="conventional-content">
          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form">
            <el-form-item label="所属网域">
              <el-select v-model="filters.domainId" placeholder="请选择网域" style="width:170px" clearable>
                <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item label="模块编码">
              <el-input v-model="filters.menuCode" placeholder="请输入模块编码" style="width:170px" clearable />
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item label="模块名称">
              <el-input v-model="filters.menuName" placeholder="请输入模块名称" style="width:170px" clearable />
            </el-form-item>
            <el-form-item></el-form-item>
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
                新增模块
              </el-button>
            </div>
          </el-form>
          
          <!-- 日志表格 -->
          <div class="table-pagination-container">
            <div class="table-wrapper">
              <el-table 
                :data="moduleList" 
                style="width: 100%" 
                border 
                stripe
                max-height="calc(100vh - 240px)"
                :header-cell-style="{ background: '#f5f7fa' }"
                v-loading="loading"
                class="conventional-table"
              >
                <el-table-column type="index" label="序号" width="60" align="center" fixed />
                <el-table-column prop="menuCode" label="模块代码" align="left" min-width="200" />
                <el-table-column prop="menuName" label="模块名称" align="left" min-width="170" />
                <el-table-column prop="roleCode" label="权限标识" align="center" min-width="130" />
                <el-table-column prop="path" label="页面Path" align="left" min-width="230" />
                <el-table-column prop="menuIcon" label="模块图标" align="center" min-width="120" />
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
            <el-form-item label="模块代码">
              <el-input v-model="editForm.menuCode" style="width:250px"/>
            </el-form-item>
            <el-form-item label="模块名称" >
              <el-input v-model="editForm.menuName" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="所属网域" >
              <el-select v-model="editForm.domainId" style="width:250px" placeholder="请选择所属网域" clearable>
                <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
              </el-select>
            </el-form-item>
            <el-form-item label="模块图标" >
              <el-input v-model="editForm.menuIcon" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="模块排序" >
              <el-input v-model.number="editForm.sortOrder" type="number" style="width:250px"/>
            </el-form-item>
            <el-form-item label="模块URL" >
              <el-input v-model="editForm.path" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="模块等级" >
              <el-input v-model.number="editForm.level" type="number" style="width:250px"/>
            </el-form-item>
            <el-form-item label="权限标识" >
              <el-input v-model="editForm.roleCode" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="页面Path" >
              <el-input v-model="editForm.path" style="width:250px"/>
            </el-form-item>
            <el-form-item label="组件" >
              <el-input v-model="editForm.component" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="目标" >
              <el-input v-model="editForm.target" style="width:250px"/>
            </el-form-item>
            <el-form-item label="备注" >
              <el-input v-model="editForm.remarks" style="width:250px" type="textarea"/>
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
  import { GET_MODULE_PAGES_API, GET_MODULE_ENTITY_API, INSERST_MODULE_API, DELETE_MODULE_API, GET_DOMAIN_DROP_API, UPDATE_MODULE_API } from '@/config/api/system-admin/system-mgmt/module'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  // 模块数据
  const moduleList = ref([])
  const loading = ref(false)
  const domainDropList = ref([])
  
  // 分页信息
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  
  // 过滤条件
  const filters = reactive({
    menuCode: '',
    menuName: '',
    menuUrl: '',
    domainId: ''
  })
  
  // 对话框显示状态
  const dialogVisible = ref(false)
  
  // 编辑表单
  const editForm = reactive({
    menuId: '',
    parentMenuId: '0',
    domainId: '',
    menuCode: '',
    menuName: '',
    menuType: 1,
    menuUrl: '',
    menuIcon: '',
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
     fetchDomainDrop() // 先获取网域，设置默认值后再查询数据
  })
  
  // 获取网域类型
  const fetchDomainDrop = async () => {
    const res = await post(GET_DOMAIN_DROP_API.GET_DOMAIN_TYPE)
    domainDropList.value = res.data || []
    
    // 默认选中第一个网域
    if (domainDropList.value.length > 0) {
      filters.domainId = domainDropList.value[0].domainId
    }
    
    // 如果是新增操作，默认选中第一个模块
    if (dialogTitle.value === '新增模块' && domainDropList.value.length > 0) {
      editForm.domainId = domainDropList.value[0].domainId
    }
    
    // 应用默认值进行初始查询
    fetchModulePages()
  }
  
  // 获取模块实体数据
  const fetchModuleEntity = async (menuId) => {
    const params = {
      menuId: menuId
    }
    const res = await post(GET_MODULE_ENTITY_API.GET_MODULE_ENTITY, params)
    
    if (res && res.code === '200') {
      editForm.menuId = res.data.menuId
      editForm.menuCode = res.data.menuCode
      editForm.menuName = res.data.menuName
      editForm.parentMenuId = res.data.parentMenuId
      editForm.domainId = res.data.domainId
      editForm.menuType = res.data.menuType
      editForm.menuUrl = res.data.menuUrl
      editForm.menuIcon = res.data.menuIcon
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
  const fetchModulePages = async () => {
    loading.value = true
    const params = {
      ...filters,
      pageNumber: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    const res = await post(GET_MODULE_PAGES_API.GET_MODULE_PAGES, params)
    
    moduleList.value = res.data || []
    pagination.total = res.totalNumber || 0
    loading.value = false
  }
  
  // 处理搜索操作
  const handleSearch = () => {
    pagination.currentPage = 1
    fetchModulePages()
  }
  
  // 重置搜索条件
  const handleReset = () => {
    filters.menuCode = ''
    filters.menuName = ''
    filters.menuUrl = ''
    filters.domainId = ''
    pagination.currentPage = 1
    fetchModulePages()
  }
  
  // 处理页码变化
  const handlePageChange = (page) => {
    pagination.currentPage = page
    fetchModulePages()
  }
  
  // 处理每页记录数变化
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    pagination.currentPage = 1
    fetchModulePages()
  }
  
  const resetForm = () => {
    editForm.menuId = ''
    editForm.parentMenuId = '0'
    editForm.menuCode = ''
    editForm.menuName = ''
    editForm.domainId = ''
    editForm.menuType = 1
    editForm.menuUrl = ''
    editForm.component = ''
    editForm.target = ''
    editForm.path = ''
    editForm.roleCode = ''
    editForm.menuIcon = ''
    editForm.sortOrder = 1
    editForm.isEnabled = true
    editForm.isVisible = true
    editForm.level = 1
    editForm.remarks = ''
  }
  
  // 新增域列表数据
  const insertModule = async () => {
    // 检查必填字段
    if (!editForm.domainId) {
      ElMessage.warning('请选择所属网域')
      return
    }
    
    // 处理数值类型字段
    const params = {
      ...editForm,
    }
    
    
    const res = await post(INSERST_MODULE_API.INSERST_MODULE, params)
    
    if (res && res.code === '200') {
      resetForm()
      fetchModulePages()
    } else {
      ElMessage.error(res.message)
    }
  }
  
  // 更新域列表数据
  const updateModule = async () => {
    // 检查必填字段
    if (!editForm.domainId) {
      ElMessage.warning('请选择所属网域')
      return
    }
    
    // 处理数值类型字段
    const params = {
      ...editForm
    }
    const res = await post(UPDATE_MODULE_API.UPDATE_MODULE, params)

    if (res && res.code === '200') {
      resetForm()
      ElMessage.success(res.message)
      dialogVisible.value = false
      fetchModulePages()
    } else {
      ElMessage.error(res.message)
    }
  }
  
  // 删除域列表数据
  const deleteDomain = async (menuId) => {
    const params = {
      menuId: menuId
    }

    if (isNaN(params.menuId)) {
      ElMessage.error('无效的模块 ID')
      return
    }
    
    const res = await post(DELETE_MODULE_API.DELETE_MODULE, params)
    
    if (res && res.code === '200') {
      ElMessage.success(res.message)
      dialogVisible.value = false
      fetchModulePages()
    } else {
      ElMessage.error(res.message)
    }
  }
  
  // 处理新增操作
  const handleAdd = () => {
    // 重置表单数据
    resetForm()
    // 设置默认值
    editForm.menuId = '0'
    editForm.parentMenuId = '0'
    editForm.menuType = 1
    editForm.sortOrder = 1
    editForm.level = 1
    editForm.isEnabled = true
    editForm.isVisible = true
    
    // 设置对话框标题
    dialogTitle.value = '新增模块'
    
    // 获取网域类型
    fetchDomainDrop()
    // 显示对话框
    dialogVisible.value = true
  }
  
  // 处理编辑操作
  const handleEdit = (index, row) => {
    // 重置表单数据
    resetForm()
    
    // 设置对话框标题
    dialogTitle.value = '编辑网域信息'
    
    // 获取网域类型
    fetchDomainDrop()
    
    // 获取网域实体数据
    fetchModuleEntity(row.menuId)
    
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
        deleteDomain(row.menuId)
        // 重新获取数据
        fetchModulePages()
      })
      .catch(() => {
        // 取消删除
      })
  }
  
  // 保存编辑结果
  const handleSave = () => {
    if (!editForm.menuCode || !editForm.menuName) {
      ElMessage.warning('请填写模块代码和模块名称')
      return
    }

    if (!editForm.domainId) {
      ElMessage.warning('请选择所属网域')
      return
    }
    
    // 判断是新增还是编辑
    const isNewModule = !editForm.menuId || editForm.menuId === '' || editForm.menuId === '0'
  
    if (isNewModule) {
       insertModule()
    } else {
       updateModule()
    }
    dialogVisible.value = false
    
    // 重新获取数据
     fetchModulePages()
  }
  </script>
  
  <style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
  </style> 