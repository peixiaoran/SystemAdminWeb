<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">
  
            <!-- 过滤条件 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="用户搜索表单">
               <el-form-item :label="$t('systemBasicmgmt.userInfo.filter.department')">
                  <el-tree-select 
                        v-model="filters.departmentId"
                        :data="departmentOptions || []"
                        :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList' }"
                        check-strictly
                        filterable
                        :filter-node-method="filterNodeMethod"
                        style="width: 200px;"
                        :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectDepartment')" />
                </el-form-item>
                <el-form-item :label="$t('systemBasicmgmt.userInfo.filter.position')">
                    <el-select 
                        v-model="filters.positionId" 
                        style="width: 180px;"
                        :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectPosition')">
                        <el-option
                            v-for="item in positionOptions"
                            :key="`position-filter-${item.positionId}`"
                            :label="item.positionName"
                            :value="item.positionId" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('systemBasicmgmt.userInfo.filter.role')">
                    <el-select 
                        v-model="filters.roleId" 
                        style="width: 180px;"
                        :placeholder="$t('systemBasicmgmt.userInfo.pleaseSelectRole')">
                        <el-option
                            v-for="item in roleOptions"
                            :key="`role-filter-${item.roleId}`"
                            :label="item.roleName"
                            :value="item.roleId" />
                    </el-select>
                </el-form-item>
                <el-form-item class="form-button-group">
                    <el-button type="primary" @click="handleSearch" plain>
                        {{ $t('common.search') }}
                    </el-button>
                </el-form-item>
            </el-form>
  
            <!-- 表格区域 -->
            <div class="table-container">
                <el-table :data="userList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          v-loading="loading"
                          class="conventional-table">
                    <el-table-column type="index" :label="$t('systemBasicmgmt.userInfo.index')" width="60" align="center" fixed />
                    <el-table-column prop="userNo" :label="$t('systemBasicmgmt.userInfo.userNo')" align="center" min-width="150" />
                    <el-table-column prop="userNameCh" :label="$t('systemBasicmgmt.userInfo.userNameCh')" align="left" min-width="180" />
                    <el-table-column prop="userNameEn" :label="$t('systemBasicmgmt.userInfo.userNameEn')" align="left" min-width="180" />
                    <el-table-column prop="departmentName" :label="$t('systemBasicmgmt.userInfo.department')" align="left" min-width="150" />
                    <el-table-column prop="positionName" :label="$t('systemBasicmgmt.userInfo.position')" align="left" min-width="120" />
                    <el-table-column prop="genderName" :label="$t('systemBasicmgmt.userInfo.gender')" align="center" min-width="100" />
                    <el-table-column prop="email" :label="$t('systemBasicmgmt.userInfo.email')" align="left" min-width="200" />
                    <el-table-column prop="phoneNumber" :label="$t('systemBasicmgmt.userInfo.phoneNumber')" align="center" min-width="170" />
                    <el-table-column prop="isEmployedName" :label="$t('systemBasicmgmt.userInfo.isEmployed')" align="center" min-width="130" />
                    <el-table-column prop="isSignName" :label="$t('systemBasicmgmt.userInfo.isSign')" align="center" min-width="120" />
                    <el-table-column prop="isPartTimeName" :label="$t('systemBasicmgmt.userInfo.isPartTime')" align="center" min-width="120" />
                    <el-table-column prop="isFreezeName" :label="$t('systemBasicmgmt.userInfo.isFreeze')" align="center" min-width="130" />
                    <el-table-column prop="employmentTypeName" :label="$t('systemBasicmgmt.userInfo.employmentType')" align="center" min-width="180" />
                    <el-table-column :label="$t('systemBasicmgmt.userInfo.operation')" min-width="170" fixed="right" align="center">
                        <template #default="scope">
                            <el-button size="small" type="primary" @click="handleConfigureAgent(scope.$index, scope.row)">{{ $t('systemBasicmgmt.userAgent.configureAgent') }}</el-button>
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
                               :total="pagination.total"
                               @size-change="handleSizeChange"
                               @current-change="handlePageChange" />
            </div>
        </el-card>

        <!-- 代理人列表对话框 -->
        <el-dialog v-model="agentDialogVisible"
                   :title="agentDialogTitle"
                   width="65%"
                   height="500px"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true"
                   @closed="handleAgentDialogClosed"
                   class="agent-dialog">
            <div v-loading="agentLoading" style="height: 360px; padding-top: 20px;">
                <!-- 新增代理人按钮 -->
                <div style="margin-bottom: 16px;">
                    <el-button type="primary" style="height: 30px;" @click="handleAddAgent">{{ $t('systemBasicmgmt.userAgent.addAgent') }}</el-button>
                </div>
                
                <el-table :data="agentList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          height="280"
                          class="conventional-table">
                    <el-table-column type="index" :label="$t('systemBasicmgmt.userAgent.index')" width="60" align="center" />
                    
                    <el-table-column prop="agentUserName" :label="$t('systemBasicmgmt.userAgent.agentUser')" align="left" min-width="150" />
                    <el-table-column prop="startTime" :label="$t('systemBasicmgmt.userAgent.startTime')" align="center" min-width="180" />
                    <el-table-column prop="endTime" :label="$t('systemBasicmgmt.userAgent.endTime')" align="center" min-width="180" />
                    <el-table-column :label="$t('common.operation')" align="center" width="120">
                        <template #default="scope">
                            <el-button size="small" type="danger" @click="handleDeleteAgent(scope.$index)">
                                {{ $t('common.delete') }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="agentDialogVisible = false">{{ $t('common.cancel') }}</el-button>
                    <el-button type="primary" @click="handleSaveAgentConfig" :loading="saveLoading">{{ $t('common.confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 员工选择对话框 -->
        <el-dialog v-model="userSelectDialogVisible"
                   :title="$t('systemBasicmgmt.userAgent.addAgent')"
                   width="70%"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true">
            <div v-loading="userSelectLoading" style="min-height: 400px;">
                <!-- 时间选择区域 -->
                <el-form :inline="true" class="conventional-filter-form" style="margin-bottom: 20px; padding: 20px 16px;">
                    <el-form-item :label="$t('systemBasicmgmt.userAgent.startTime')">
                        <el-date-picker
                            v-model="agentTimeRange.startTime"
                            type="datetime"
                            :placeholder="$t('systemBasicmgmt.userAgent.pleaseSelectStartTime')"
                            style="width: 200px;" />
                    </el-form-item>
                    <el-form-item :label="$t('systemBasicmgmt.userAgent.endTime')">
                        <el-date-picker
                            v-model="agentTimeRange.endTime"
                            type="datetime"
                            :placeholder="$t('systemBasicmgmt.userAgent.pleaseSelectEndTime')"
                            style="width: 200px;" />
                    </el-form-item>
                </el-form>

                <!-- 搜索区域 -->
                <el-form :inline="true" :model="userSelectFilters" class="conventional-filter-form">
                    <el-form-item :label="$t('systemBasicmgmt.userInfo.userNo')">
                        <el-input 
                            v-model="userSelectFilters.userNo" 
                            style="width: 180px;"
                            :placeholder="$t('systemBasicmgmt.userInfo.pleaseInputUserNo')" />
                    </el-form-item>
                    <el-form-item :label="$t('systemBasicmgmt.userInfo.userNameCh')">
                        <el-input 
                            v-model="userSelectFilters.userName" 
                            style="width: 180px;"
                            :placeholder="$t('systemBasicmgmt.userInfo.pleaseInputUserName')" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleUserSelectSearch">{{ $t('common.search') }}</el-button>
                        <el-button @click="handleUserSelectReset">{{ $t('common.reset') }}</el-button>
                    </el-form-item>
                </el-form>

                <!-- 员工表格 -->
                <el-table :data="userSelectList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          class="conventional-table"
                          ref="userSelectTableRef"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="userNo" :label="$t('systemBasicmgmt.userInfo.userNo')" align="center" min-width="120" />
                    <el-table-column prop="userNameCh" :label="$t('systemBasicmgmt.userInfo.userNameCh')" align="left" min-width="120" />
                    <el-table-column prop="userNameEn" :label="$t('systemBasicmgmt.userInfo.userNameEn')" align="left" min-width="120" />
                    <el-table-column prop="departmentName" :label="$t('systemBasicmgmt.userInfo.department')" align="left" min-width="120" />
                    <el-table-column prop="positionName" :label="$t('systemBasicmgmt.userInfo.position')" align="left" min-width="100" />
                </el-table>

                <!-- 分页 -->
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="userSelectPagination.pageIndex"
                                   v-model:page-size="userSelectPagination.pageSize"
                                   :page-sizes="[10, 20, 50]"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="userSelectPagination.total"
                                   @size-change="handleUserSelectSizeChange"
                                   @current-change="handleUserSelectPageChange" />
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="userSelectDialogVisible = false">{{ $t('common.cancel') }}</el-button>
                    <el-button type="primary" @click="handleConfirmUserSelect" :disabled="selectedUsers.length === 0">{{ $t('common.confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
  </template>
  
  <script setup>
    import { ref, reactive, onMounted, nextTick } from 'vue'
    import { post } from '@/utils/request'
    import { 
        GET_USER_PAGES_API, 
        GET_DEPARTMENT_DROPDOWN_API,
        GET_USER_POSITION_DROPDOWN_API,
        GET_ROLE_DROPDOWN_API
    } from '@/config/api/systemBasicmgmt/system-basic/user'
    import { 
        GET_USER_AGENT_API,
        GET_USER_AGENT_CONFIG_API,
        GET_USER_VIEW_API
    } from '@/config/api/systemBasicmgmt/system-basic/useragent'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useI18n } from 'vue-i18n'
  
    // 初始化i18n
    const { t } = useI18n()
  
        // 员工数据
    const userList = ref([])
    const loading = ref(false)

    // 下拉框选项（仅用于筛选）
    const departmentOptions = ref([])
    const positionOptions = ref([])
    const roleOptions = ref([])
  
    // 分页信息
    const pagination = reactive({
        pageIndex: 1,
        pageSize: 10,
        total: 0
    })
  
    // 过滤条件
    const filters = reactive({
        departmentId: '',
        positionId: '',
        roleId: '',
    })
  
        // 代理人相关数据
    const agentDialogVisible = ref(false)
    const agentDialogTitle = ref('')
    const agentList = ref([])
    const agentLoading = ref(false)
    const currentUserId = ref('')
    const saveLoading = ref(false)

    // 员工选择对话框相关数据
    const userSelectDialogVisible = ref(false)
    const userSelectLoading = ref(false)
    const userSelectList = ref([])
    const selectedUsers = ref([])
    const userSelectTableRef = ref(null)
    
    // 代理时间范围
    const agentTimeRange = reactive({
        startTime: '',
        endTime: ''
    })
    
    // 员工选择筛选条件
    const userSelectFilters = reactive({
        userNo: '',
        userName: ''
    })
    
    // 员工选择分页信息
    const userSelectPagination = reactive({
        pageIndex: 1,
        pageSize: 10,
        total: 0
    })
  
    // 部门搜索过滤方法
    const filterNodeMethod = (value, data) => data.departmentName.includes(value)
  
    // 在组件挂载后获取数据
    onMounted(async () => {
        // 获取下拉框数据并设置筛选条件默认值
        await fetchDepartmentDropdown(true)
        await fetchPositionDropdown(true)
        await fetchRoleDropdown(true)
        // 获取员工列表数据
        fetchUserPages()
    })
  
    // 获取部门下拉框数据
    const fetchDepartmentDropdown = async (setDefaultFilter = false) => {
        try {
            const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
            if (res && res.code === '200') {
                departmentOptions.value = Array.isArray(res.data) ? res.data : []
                // 设置筛选条件默认值
                if (setDefaultFilter && departmentOptions.value.length > 0 && !filters.departmentId) {
                    filters.departmentId = departmentOptions.value[0].departmentId
                }
            } else {
                departmentOptions.value = []
            }
        } catch (error) {
            departmentOptions.value = []
        }
    }
  
    // 获取职位下拉框数据
    const fetchPositionDropdown = async (setDefaultFilter = false) => {
        const res = await post(GET_USER_POSITION_DROPDOWN_API.GET_USER_POSITION_DROPDOWN, {})
        if (res && res.code === '200') {
            positionOptions.value = res.data || []
            // 设置筛选条件默认值
            if (setDefaultFilter && positionOptions.value.length > 0 && !filters.positionId) {
                filters.positionId = positionOptions.value[0].positionId
            }
        }
    }
  
    // 获取角色下拉框数据
    const fetchRoleDropdown = async (setDefaultFilter = false) => {
        const res = await post(GET_ROLE_DROPDOWN_API.GET_ROLE_DROPDOWN, {})
        if (res && res.code === '200') {
            roleOptions.value = res.data || []
            // 设置筛选条件默认值
            if (setDefaultFilter && roleOptions.value.length > 0 && !filters.roleId) {
                filters.roleId = roleOptions.value[0].roleId
            }
        }
    }
  
    
  
    // 获取代理人列表数据
    const fetchUserAgentList = async (substituteUserId) => {
        agentLoading.value = true
        try {
            const params = {
                substituteUserId: substituteUserId
            }
            const res = await post(GET_USER_AGENT_API.GET_USER_AGENT, params)
            
            if (res && res.code === '200') {
                agentList.value = res.data || []
            } else {
                agentList.value = []
                ElMessage.error(res.message || t('systemBasicmgmt.userAgent.getFailed'))
            }
        } catch (error) {
            console.error('获取代理人列表失败:', error)
            agentList.value = []
            ElMessage.error(t('systemBasicmgmt.userAgent.getFailed'))
        } finally {
            agentLoading.value = false
        }
    }

    // 获取员工列表数据
    const fetchUserPages = async () => {
        loading.value = true
        const params = {
            departmentId: filters.departmentId,
            roleId: filters.roleId,
            positionId: filters.positionId,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize
        }
        const res = await post(GET_USER_PAGES_API.GET_USER_PAGES, params)
  
        if (res && res.code === '200') {
  
            userList.value = res.data || []
            pagination.total = res.totalNumber || 0
        } else {
            ElMessage.error(res.message || t('systemBasicmgmt.userInfo.getFailed'))
        }
        loading.value = false
    }
  
    // 处理搜索操作
    const handleSearch = () => {
        pagination.pageIndex = 1
        fetchUserPages()
    }
  
    // 重置搜索条件
    const handleReset = () => {
        Object.assign(filters, {
            departmentId: '',
            positionId: '',
            roleId: '',
            userNo: '',
            userName: '',
            gender: ''
        })
        pagination.pageIndex = 1
        fetchUserPages()
    }
  

  
  
  
    // 处理页码变化
    const handlePageChange = (page) => {
        pagination.pageIndex = page
        fetchUserPages()
    }
  
    // 处理每页记录数变化
    const handleSizeChange = (size) => {
        pagination.pageSize = size
        pagination.pageIndex = 1
        fetchUserPages()
    }
  
    
  
        // 处理配置代理人操作
    const handleConfigureAgent = async (index, row) => {
        currentUserId.value = row.userId
        agentDialogTitle.value = `${t('systemBasicmgmt.userAgent.agentDetails')} - ${row.userNameCh || row.userNameEn}`
        agentDialogVisible.value = true
        // 获取代理人列表
        await fetchUserAgentList(row.userId)
    }

    // 处理代理人对话框完全关闭后的清理
    const handleAgentDialogClosed = () => {
        agentList.value = []
        currentUserId.value = ''
        agentDialogTitle.value = ''
    }

    // 处理新增代理人
    const handleAddAgent = () => {
        // 重置时间选择
        Object.assign(agentTimeRange, {
            startTime: '',
            endTime: ''
        })
        // 重置用户选择
        selectedUsers.value = []
        userSelectDialogVisible.value = true
        // 重置搜索条件并获取用户列表
        Object.assign(userSelectFilters, {
            userNo: '',
            userName: ''
        })
        userSelectPagination.pageIndex = 1
        fetchUserSelectList()
    }

    // 处理删除代理人
    const handleDeleteAgent = (index) => {
        agentList.value.splice(index, 1)
    }

    // 获取用户选择列表
    const fetchUserSelectList = async () => {
        userSelectLoading.value = true
        try {
            const params = {
                userNo: userSelectFilters.userNo,
                userName: userSelectFilters.userName,
                pageIndex: userSelectPagination.pageIndex,
                pageSize: userSelectPagination.pageSize,
                totalCount: userSelectPagination.total
            }
            const res = await post(GET_USER_VIEW_API.GET_USER_VIEW, params)
            
            if (res && res.code === '200') {
                userSelectList.value = res.data || []
                userSelectPagination.total = res.totalNumber || 0
            } else {
                userSelectList.value = []
                userSelectPagination.total = 0
                ElMessage.error(res.message || t('systemBasicmgmt.userInfo.getFailed'))
            }
        } catch (error) {
            console.error('获取用户列表失败:', error)
            userSelectList.value = []
            userSelectPagination.total = 0
            ElMessage.error(t('systemBasicmgmt.userInfo.getFailed'))
        } finally {
            userSelectLoading.value = false
        }
    }

    // 处理用户选择搜索
    const handleUserSelectSearch = () => {
        userSelectPagination.pageIndex = 1
        fetchUserSelectList()
    }

    // 重置用户选择搜索
    const handleUserSelectReset = () => {
        Object.assign(userSelectFilters, {
            userNo: '',
            userName: ''
        })
        userSelectPagination.pageIndex = 1
        fetchUserSelectList()
    }

    // 处理用户选择分页
    const handleUserSelectPageChange = (page) => {
        userSelectPagination.pageIndex = page
        fetchUserSelectList()
    }

    // 处理用户选择每页大小变化
    const handleUserSelectSizeChange = (size) => {
        userSelectPagination.pageSize = size
        userSelectPagination.pageIndex = 1
        fetchUserSelectList()
    }

    // 处理多选变化
    const handleSelectionChange = (selection) => {
        selectedUsers.value = selection
    }

    // 确认用户选择
    const handleConfirmUserSelect = () => {
        if (selectedUsers.value.length === 0) {
            ElMessage.warning(t('systemBasicmgmt.userAgent.pleaseSelectUsers'))
            return
        }

        if (!agentTimeRange.startTime || !agentTimeRange.endTime) {
            ElMessage.warning(t('systemBasicmgmt.userAgent.pleaseSelectTimeRange'))
            return
        }

        // 格式化时间
        const startTime = new Date(agentTimeRange.startTime).toISOString().slice(0, 19).replace('T', ' ')
        const endTime = new Date(agentTimeRange.endTime).toISOString().slice(0, 19).replace('T', ' ')

        // 添加选中的用户到代理人列表
        selectedUsers.value.forEach(user => {
            const newAgent = {
                substituteUserId: currentUserId.value,
                substituteUserName: '', // 这个会在刷新时从接口获取
                agentUserId: user.userId,
                agentUserName: user.userNameCh || user.userNameEn,
                startTime: startTime,
                endTime: endTime
            }
            agentList.value.push(newAgent)
        })

        userSelectDialogVisible.value = false
        
        // 重置数据
        selectedUsers.value = []
        Object.assign(agentTimeRange, {
            startTime: '',
            endTime: ''
        })
        
        // 清空表格选择
        if (userSelectTableRef.value) {
            userSelectTableRef.value.clearSelection()
        }
    }

    // 保存代理配置
    const handleSaveAgentConfig = async () => {
        try {
            saveLoading.value = true
            
            // 构建请求参数
            const userAgentUpserts = agentList.value.map(item => ({
                substituteUserId: currentUserId.value,
                agentUserId: item.agentUserId || '',
                startTime: item.startTime || '',
                endTime: item.endTime || ''
            }))

            const params = {
                userAgentUpserts: userAgentUpserts
            }

            const res = await post(GET_USER_AGENT_CONFIG_API.GET_USER_AGENT_CONFIG, params)
            
            if (res && res.code === '200') {
                ElMessage.success(res.message || t('common.saveSuccess'))
                agentDialogVisible.value = false
                // 重新获取代理人列表
                await fetchUserAgentList(currentUserId.value)
            } else {
                ElMessage.error(res.message || t('common.operationFailed'))
            }
        } catch (error) {
            console.error('保存代理配置失败:', error)
            ElMessage.error(t('common.operationFailed'))
        } finally {
            saveLoading.value = false
        }
    }
  
    
  </script>
  
  <style scoped>
    @import '@/assets/styles/conventionalTablePage.css';

    /* 代理人对话框样式 */
    :deep(.agent-dialog .el-dialog) {
      height: 500px;
      overflow: hidden;
    }

    :deep(.agent-dialog .el-dialog__body) {
      height: calc(500px - 120px); /* 减去header和footer的高度 */
      overflow: auto;
      padding: 0 20px 20px 20px;
    }

    :deep(.agent-dialog .el-dialog__header) {
      padding-bottom: 15px;
    }
  </style>
  
  