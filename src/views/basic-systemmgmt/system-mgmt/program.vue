<template>
    <div class="conventional-table-container">
      <el-card class="conventional-card">
        
        <div class="conventional-content">
          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form">
            <el-form-item label="程序编码">
              <el-input v-model="filters.programCode" placeholder="请输入程序编码" style="width:170px" clearable />
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item label="程序名称">
              <el-input v-model="filters.programName" placeholder="请输入程序名称" style="width:170px" clearable />
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item label="所属网域">
              <el-select v-model="filters.domainId" placeholder="请选择网域" style="width:170px" clearable @change="handleFilterDomainChange">
                <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item label="所属模块">
              <el-select v-model="filters.parentMenuId" placeholder="请选择模块" style="width:170px" clearable>
                <el-option v-for="item in filterModuleList" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
              </el-select>
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
                新增程序
              </el-button>
            </div>
          </el-form>
          
          <!-- 日志表格 -->
          <div class="table-pagination-container">
            <div class="table-wrapper">
              <el-table 
                :data="programList" 
                style="width: 100%" 
                border 
                stripe
                max-height="calc(100vh - 240px)"
                :header-cell-style="{ background: '#f5f7fa' }"
                v-loading="loading"
                class="conventional-table"
              >
                <el-table-column type="index" label="序号" width="60" align="center" fixed />
                <el-table-column prop="menuCode" label="程序代码" align="left" min-width="240" />
                <el-table-column prop="menuName" label="程序名称" align="left" min-width="200" />
                <el-table-column prop="roleCode" label="权限标识" align="center" min-width="130" />
                <el-table-column prop="path" label="页面Path" align="left" min-width="230" />
                <el-table-column prop="menuIcon" label="程序图标" align="center" min-width="120" />
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
            <el-form-item label="程序代码">
              <el-input v-model="editForm.menuCode" style="width:250px"/>
            </el-form-item>
            <el-form-item label="程序名称" >
              <el-input v-model="editForm.menuName" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="所属网域" >
              <el-select v-model="editForm.domainId" style="width:250px" placeholder="请选择所属网域" clearable @change="handleDomainChange">
                <el-option v-for="item in domainDropList" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属模块" >
              <el-select v-model="editForm.parentMenuId" style="width:250px" placeholder="请选择所属模块" clearable>
                <el-option v-for="item in moduleDropList" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="程序图标" >
              <el-input v-model="editForm.menuIcon" style="width:250px"/>
            </el-form-item>
            <el-form-item label="程序排序" >
              <el-input v-model.number="editForm.sortOrder" type="number" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="页面Path" >
              <el-input v-model="editForm.path" style="width:250px"/>
            </el-form-item>
            <el-form-item label="程序类型" >
              <el-input v-model.number="editForm.menuType" type="number" style="width:250px"/>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="权限标识" >
              <el-input v-model="editForm.roleCode" style="width:250px"/>
            </el-form-item>
            <el-form-item label="AIP路由" >
              <el-input v-model="editForm.routePath" style="width:250px"/>
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
  import { post, sanitizeHtml } from '@/utils/request'
  import { GET_PROGRAM_PAGES_API, GET_PROGRAM_ENTITY_API, INSERST_PROGRAM_API, DELETE_PROGRAM_API, GET_DOMAIN_DROP_API, GET_MODULE_DROP_API, UPDATE_PROGRAM_API } from '@/config/api/system-admin/system-mgmt/program'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  // 程序数据
  const programList = ref([])
  const loading = ref(false)
  const domainDropList = ref([])
  const moduleDropList = ref([])
  
  // 分页信息
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  
  // 过滤条件
  const filters = reactive({
    programCode: '',
    programName: '',
    programUrl: '',
    domainId: '',
    parentMenuId: ''
  })
  
  // 过滤用模块列表
  const filterModuleList = ref([])
  
  // 对话框显示状态
  const dialogVisible = ref(false)
  
  // 编辑表单
  const editForm = reactive({
    menuId: '',
    parentMenuId: '',
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
    routePath: '',
    path: '',
    component: '',
    target: '',
    remarks: ''
  })
  // 对话框标题
  const dialogTitle = ref('编辑程序信息')
  
  // 在组件挂载后获取日志数据
  onMounted(() => {
     fetchDomainDrop() // 先获取网域和模块，设置默认值后再查询数据
  })
  
  // 获取网域类型
  const fetchDomainDrop = async () => {
    const res = await post(GET_DOMAIN_DROP_API.GET_DOMAIN_TYPE)
    // 对获取的数据进行XSS清洗
    domainDropList.value = res.data || []
    
    // 默认选中第一个网域（用于查询表单）
    if (domainDropList.value.length > 0) {
      filters.domainId = domainDropList.value[0].domainId
      // 获取对应的模块列表
      await fetchFilterModuleDrop()
    }
    
    // 如果是新增操作，默认选中第一个网域
    if (dialogTitle.value === '新增程序' && domainDropList.value.length > 0) {
      editForm.domainId = domainDropList.value[0].domainId
      // 网域选择后联动获取模块数据
      fetchModuleDrop()
    }
    
    // 应用默认值进行初始查询
    fetchProgramPages()
  }

  // 获取模块下拉框
  const fetchModuleDrop = async () => {
    if (!editForm.domainId) {
      moduleDropList.value = []
      return
    }
    
    const params = {
      domainId: editForm.domainId
    }
    const res = await post(GET_MODULE_DROP_API.GET_MODULE_TYPE, params)
    // 对获取的数据进行XSS清洗
    moduleDropList.value = res.data || []
    
    // 如果是新增操作且有模块数据，默认选中第一个模块
    if (dialogTitle.value === '新增程序' && moduleDropList.value.length > 0) {
      editForm.parentMenuId = moduleDropList.value[0].menuId
    }
  }
  
  // 获取程序实体数据
  const fetchProgramEntity = async (menuId) => {
    const params = {
      menuId: menuId
    }
    const res = await post(GET_PROGRAM_ENTITY_API.GET_PROGRAM_ENTITY, params)
    
    if (res && res.code === '200') {
      // 对字符串类型字段进行额外的XSS清洗
      editForm.menuId = res.data.menuId
      editForm.menuCode = sanitizeHtml(res.data.menuCode || '')
      editForm.menuName = sanitizeHtml(res.data.menuName || '')
      editForm.parentMenuId = res.data.parentMenuId
      editForm.domainId = res.data.domainId
      editForm.menuType = res.data.menuType
      editForm.menuUrl = sanitizeHtml(res.data.menuUrl || '')
      editForm.menuIcon = sanitizeHtml(res.data.menuIcon || '')
      editForm.sortOrder = res.data.sortOrder
      editForm.roleCode = sanitizeHtml(res.data.roleCode || '')
      editForm.path = sanitizeHtml(res.data.path || '')
      editForm.component = sanitizeHtml(res.data.component || '')
      editForm.target = sanitizeHtml(res.data.target || '')
      editForm.remarks = sanitizeHtml(res.data.remarks || '')
      editForm.isEnabled = res.data.isEnabled
      editForm.isVisible = res.data.isVisible
      editForm.level = res.data.level
      editForm.routePath = sanitizeHtml(res.data.routePath || '')

      // 加载网域后，联动获取模块列表
      if (editForm.domainId) {
        fetchModuleDrop()
      }
    }
  }
  
  // 获取域列表数据
  const fetchProgramPages = async () => {
    loading.value = true
    const params = {
      ...filters,
      pageNumber: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    
    const res = await post(GET_PROGRAM_PAGES_API.GET_PROGRAM_PAGES, params)
    
    // 在设置数据前，确保使用sanitizeHtml清洗敏感字段
    programList.value = res.data || []
    pagination.total = res.totalNumber || 0
    loading.value = false
  }
  
  // 处理搜索操作
  const handleSearch = () => {
    pagination.currentPage = 1
    fetchProgramPages()
  }
  
  // 重置搜索条件
  const handleReset = () => {
    filters.programCode = ''
    filters.programName = ''
    filters.programUrl = ''
    filters.domainId = ''
    filters.parentMenuId = ''
    filterModuleList.value = []
    pagination.currentPage = 1
    fetchProgramPages()
  }
  
  // 处理页码变化
  const handlePageChange = (page) => {
    pagination.currentPage = page
    fetchProgramPages()
  }
  
  // 处理每页记录数变化
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    pagination.currentPage = 1
    fetchProgramPages()
  }
  
  const resetForm = () => {
    editForm.menuId = ''
    editForm.parentMenuId = ''
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
    editForm.routePath = ''
    editForm.remarks = ''
  }
  
  // 新增程序列表数据
  const insertProgram = async () => {
    // 检查必填字段
    if (!editForm.domainId) {
      ElMessage.warning('请选择所属网域')
      return
    }
    
    // 处理数值类型字段
    const params = {
      ...editForm,
    }
    const res = await post(INSERST_PROGRAM_API.INSERST_PROGRAM, params)
    
    if (res && res.code === '200') {
      resetForm()
      ElMessage.success(res.message)
      fetchProgramPages()
      dialogVisible.value = false
    } else {
      ElMessage.error(res.message)
    }
  }
  
  // 更新程序列表数据
  const updateProgram = async () => {
    // 检查必填字段
    if (!editForm.domainId) {
      ElMessage.warning('请选择所属网域')
      return
    }
    
    // 处理数值类型字段
    const params = {
      ...editForm
    }
    
    const res = await post(UPDATE_PROGRAM_API.UPDATE_PROGRAM, params)

    if (res && res.code === '200') {
      resetForm()
      ElMessage.success(res.message)
      dialogVisible.value = false
      fetchProgramPages()
    } else {
      ElMessage.error(res.message)
    }
  }
  
  // 删除程序列表数据
  const deleteProgram = async (menuId) => {
    const params = {
      menuId: menuId
    }

    if (isNaN(params.menuId)) {
      ElMessage.error('无效的程序 ID')
      return
    }
    
    const res = await post(DELETE_PROGRAM_API.DELETE_PROGRAM, params)
    
    if (res && res.code === '200') {
      ElMessage.success(res.message)
      dialogVisible.value = false
      fetchProgramPages()
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
    editForm.menuType = 1
    editForm.sortOrder = 1
    editForm.level = 1
    editForm.isEnabled = true
    editForm.isVisible = true
    
    // 设置对话框标题
    dialogTitle.value = '新增程序'
    
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
    dialogTitle.value = '编辑程序信息'
    
    // 获取程序实体数据
    fetchProgramEntity(row.menuId)
    
    // 获取网域类型
    fetchDomainDrop()
    
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
        deleteProgram(row.menuId)
        // 重新获取数据
        fetchProgramPages()
      })
      .catch(() => {
        // 取消删除
      })
  }
  
  // 保存编辑结果
  const handleSave = () => {
    if (!editForm.menuCode || !editForm.menuName) {
      ElMessage.warning('请填写程序代码和程序名称')
      return
    }

    if (!editForm.domainId) {
      ElMessage.warning('请选择所属网域')
      return
    }

    if (!editForm.parentMenuId) {
      ElMessage.warning('请选择所属模块')
      return
    }
    
    // 判断是新增还是编辑
    const isNewModule = !editForm.menuId || editForm.menuId === '' || editForm.menuId === '0'
  
    if (isNewModule) {
       insertProgram()
    } else {
       updateProgram()
    }
    dialogVisible.value = false
    
    // 重新获取数据
     fetchProgramPages()
  }
  
  // 处理网域变化事件
  const handleDomainChange = () => {
    // 清空模块选择
    editForm.parentMenuId = ''
    // 重新获取模块列表
    fetchModuleDrop()
  }
  
  // 处理查询表单中网域变化
  const handleFilterDomainChange = () => {
    // 清空模块选择
    filters.parentMenuId = ''
    // 重新获取模块列表
    fetchFilterModuleDrop()
  }
  
  // 获取查询表单中的模块下拉框数据
  const fetchFilterModuleDrop = async () => {
    if (!filters.domainId) {
      filterModuleList.value = []
      return
    }
    
    const params = {
      domainId: filters.domainId
    }
    const res = await post(GET_MODULE_DROP_API.GET_MODULE_TYPE, params)
    filterModuleList.value = res.data || []
    
    // 默认选中第一个模块
    if (filterModuleList.value.length > 0) {
      filters.parentMenuId = filterModuleList.value[0].menuId
    }
  }
  </script>
  
  <style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
  </style> 