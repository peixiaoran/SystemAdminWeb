<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">
  
            <!-- 过滤条件 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="用户搜索表单">
                <el-form-item :label="$t('systembasicmgmt.userAgent.filter.department')">
                    <el-tree-select 
                        v-model="filters.departmentId"
                        :data="departmentOptions || []"
                        :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                        check-strictly
                        filterable
                        :filter-node-method="filterNodeMethod"
                        @change="handleSearch"
                        style="width: 200px;"
                        :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectDepartment')" />
                </el-form-item>
                <el-form-item :label="$t('systembasicmgmt.userAgent.userNo')">
                    <el-input 
                        v-model="filters.userNo"
                        style="width: 200px;"
                        :placeholder="$t('systembasicmgmt.userAgent.pleaseEnterUserNo')"
                        clearable />
                </el-form-item>
                <el-form-item :label="$t('systembasicmgmt.userAgent.userName')">
                    <el-input 
                        v-model="filters.userName"
                        style="width: 200px;"
                        :placeholder="$t('systembasicmgmt.userAgent.pleaseEnterUserName')"
                        clearable />
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
                    <el-table-column type="index" :label="$t('systembasicmgmt.userAgent.index')" width="70" align="center" fixed />
                    <el-table-column prop="userNo" :label="$t('systembasicmgmt.userAgent.userNo')" align="center" min-width="150" />
                    <el-table-column prop="userName" :label="$t('systembasicmgmt.userAgent.userName')" align="left" min-width="180" />
                    <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userAgent.department')" align="left" min-width="230" />
                    <el-table-column prop="positionName" :label="$t('systembasicmgmt.userAgent.position')" align="left" min-width="120" />
                    <el-table-column prop="laborName" :label="$t('systembasicmgmt.userAgent.laborName')" align="center" min-width="270" />
                    <el-table-column :label="$t('systembasicmgmt.userAgent.isApproval')" align="center" min-width="160">
                        <template #default="scope">
                            <el-tag :type="scope.row.isApproval === '1' ? 'primary' : 'info'">
                                {{ scope.row.isApprovalName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('systembasicmgmt.userAgent.isAgent')" align="center" min-width="120">
                        <template #default="scope">
                            <el-tag :type="scope.row.isAgent === '1' ? 'primary' : 'info'">
                                {{ scope.row.isAgentName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('systembasicmgmt.userAgent.operation')" min-width="320" fixed="right" align="center">
                        <template #default="scope">
                            <el-button size="small" type="success" @click="handleAddAgentForUser(scope.$index, scope.row)">{{ $t('systembasicmgmt.userAgent.addAgent') }}</el-button>
                            <el-button size="small" type="primary" @click="handleViewProactiveAgent(scope.$index, scope.row)">{{ $t('systembasicmgmt.userAgent.viewAgentList') }}</el-button>
                            <el-button size="small" type="info" @click="handleConfigureAgent(scope.$index, scope.row)">{{ $t('systembasicmgmt.userAgent.viewProactiveAgent') }}</el-button>
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
            <div v-loading="agentLoading" style="height: 380px; padding-top: 20px;">
                <el-table :data="agentList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          height="370"
                          class="conventional-table">
                    <el-table-column type="index" :label="$t('systembasicmgmt.userAgent.index')" width="70" align="center" />
                    <el-table-column prop="agentUserNo" :label="$t('systembasicmgmt.userAgent.agentUserNo')" align="left" min-width="110" />
                    <el-table-column prop="agentUserName" :label="$t('systembasicmgmt.userAgent.agentUser')" align="left" min-width="200" />
                    <el-table-column prop="startTime" :label="$t('systembasicmgmt.userAgent.startTime')" align="center" min-width="110" />
                    <el-table-column prop="endTime" :label="$t('systembasicmgmt.userAgent.endTime')" align="center" min-width="110" />
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
                    <el-button @click="agentDialogVisible = false">{{ $t('common.close') }}</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 员工选择对话框 -->
        <el-dialog v-model="userSelectDialogVisible"
                   :title="`${$t('systembasicmgmt.userAgent.addAgent')} - ${currentUserInfo.userName || ''}`"
                   width="70%"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true"
                   @closed="handleUserSelectDialogClosed">
            <div v-loading="userSelectLoading" style="min-height: 500px;">
                <!-- 时间选择区域 -->
                <el-form ref="agentTimeFormRef" :model="agentTimeRange" :rules="agentTimeFormRules" :inline="true" class="conventional-filter-form"  >
                    <el-form-item :label="$t('systembasicmgmt.userAgent.startTime')" prop="startTime" required>
                        <el-date-picker
                            v-model="agentTimeRange.startTime"
                            type="datetime"
                            :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectStartTime')"
                            :disabled-date="(date) => agentTimeRange.endTime && date > new Date(agentTimeRange.endTime)"
                            @change="handleStartTimeChange"
                            style="width: 200px;"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.userAgent.endTime')" prop="endTime" required>
                        <el-date-picker
                            v-model="agentTimeRange.endTime"
                            type="datetime"
                            :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectEndTime')"
                            :disabled-date="(date) => agentTimeRange.startTime && date < new Date(agentTimeRange.startTime)"
                            @change="handleEndTimeChange"
                            style="width: 200px;"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                </el-form>
                
                <!-- 分隔线 -->
                <el-divider style="margin: 10px 0;"></el-divider>

                <!-- 搜索区域 -->
                <el-form :inline="true" :model="userSelectFilters" class="conventional-filter-form" style="margin-top: 10px;">
                    <el-form-item :label="$t('systembasicmgmt.userAgent.filter.department')">
                        <el-tree-select 
                            v-model="userSelectFilters.departmentId"
                            :data="departmentOptions || []"
                            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                            check-strictly
                            filterable
                            @change="handleUserSelectSearch"
                            :filter-node-method="filterNodeMethod"
                            style="width: 200px;"
                            :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectDepartment')" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.userAgent.userNo')">
                        <el-input 
                            v-model="userSelectFilters.userNo" 
                            style="width: 200px;"
                            :placeholder="$t('systembasicmgmt.userAgent.pleaseInputUserNo')" 
                            clearable />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.userAgent.userNameCn')">
                        <el-input 
                            v-model="userSelectFilters.userName" 
                            style="width: 200px;"
                            :placeholder="$t('systembasicmgmt.userAgent.pleaseInputUserName')" 
                            clearable />
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
                          v-loading="userSelectLoading"
                          class="conventional-table"
                          ref="userSelectTableRef"
                          height="300"
                          @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="userNo" :label="$t('systembasicmgmt.userAgent.userNo')" align="center" min-width="80" />
                    <el-table-column prop="userName" :label="$t('systembasicmgmt.userAgent.userNameCn')" align="left" min-width="120" />
                    <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userAgent.department')" align="left" min-width="120" />
                    <el-table-column prop="positionName" :label="$t('systembasicmgmt.userAgent.position')" align="left" min-width="100" />
                </el-table>

                <!-- 分页 -->
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="userSelectPagination.pageIndex"
                                   v-model:page-size="userSelectPagination.pageSize"
                                   :page-sizes="[10, 20, 50]"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="userSelectPagination.totalCount"
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

        <!-- 查看员工代理了哪些人对话框 -->
        <el-dialog v-model="proactiveAgentDialogVisible"
                   :title="proactiveAgentDialogTitle"
                   width="65%"
                   height="500px"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true"
                   @closed="handleProactiveAgentDialogClosed"
                   class="proactive-agent-dialog">
            <div v-loading="proactiveAgentLoading" style="height: 380px; padding-top: 20px;">
                <el-table :data="proactiveAgentList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          height="370"
                          class="conventional-table">
                    <el-table-column type="index" :label="$t('systembasicmgmt.userAgent.index')" width="70" align="center" />
                    <el-table-column prop="substituteUserNo" :label="$t('systembasicmgmt.userAgent.substituteUserNo')" align="left" min-width="110" />
                    <el-table-column prop="substituteUserName" :label="$t('systembasicmgmt.userAgent.substituteUserName')" align="left" min-width="200" />
                    <el-table-column prop="startTime" :label="$t('systembasicmgmt.userAgent.startTime')" align="center" min-width="110" />
                    <el-table-column prop="endTime" :label="$t('systembasicmgmt.userAgent.endTime')" align="center" min-width="110" />
                </el-table>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="proactiveAgentDialogVisible = false">{{ $t('common.close') }}</el-button>
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
        GET_USER_AGENT_API,
        GET_USER_AGENT_INSERT_API,
        GET_USER_AGENT_DELETE_API,
        GET_USER_VIEW_API,
        GET_DEPARTMENT_DROPDOWN_API
    } from '@/config/api/systembasicmgmt/system-userconfig/useragent'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useI18n } from 'vue-i18n'
  
    // 初始化i18n
    const { t } = useI18n()
  
        // 员工数据
    const userList = ref([])
    const loading = ref(false)
  
    // 分页信息
    const pagination = reactive({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
    })
  
    // 过滤条件
    const filters = reactive({
        departmentId: '',
        userNo: '',
        userName: '',
    })

    // 部门选项数据
    const departmentOptions = ref([])
  
    // 代理人相关数据
    const agentDialogVisible = ref(false)
    const agentDialogTitle = ref('')
    const agentList = ref([])
    const agentLoading = ref(false)
    const currentUserId = ref('')
    const currentUserInfo = ref({})
    // 员工选择对话框相关数据
    const userSelectDialogVisible = ref(false)
    const userSelectLoading = ref(false)
    const userSelectList = ref([])
    const selectedUsers = ref([])
    const userSelectTableRef = ref(null)
    const agentTimeFormRef = ref(null)
    
    // 代理时间表单验证规则
    const agentTimeFormRules = reactive({
        startTime: [
            { required: true, message: t('systembasicmgmt.userAgent.pleaseSelectStartTime'), trigger: 'change' }
        ],
        endTime: [
            { required: true, message: t('systembasicmgmt.userAgent.pleaseSelectEndTime'), trigger: 'change' }
        ]
    })
    
    // 代理时间范围
    const agentTimeRange = reactive({
        startTime: '',
        endTime: ''
    })
    
    // 员工选择筛选条件
    const userSelectFilters = reactive({
        departmentId: '',
        userNo: '',
        userName: ''
    })
    
    // 员工选择分页信息
    const userSelectPagination = reactive({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
    })
    
    // 查看员工代理了哪些人对话框相关数据
    const proactiveAgentDialogVisible = ref(false)
    const proactiveAgentDialogTitle = ref('')
    const proactiveAgentList = ref([])
    const proactiveAgentLoading = ref(false)
    

    const currentProactiveUserId = ref('')
  
    // 在组件挂载后获取数据
    onMounted(async () => {
        // 获取部门下拉数据
        await fetchDepartmentDropdown(true)
        // 获取员工列表数据
        await fetchUserPages()
    })

    // 部门树过滤方法
    const filterNodeMethod = (value, data) => {
        if (!value) return true
        return data.departmentName.includes(value)
    }

    // 获取部门下拉数据
    const fetchDepartmentDropdown = async (setDefaultFilter = false) => {
        try {
            const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
            
            if (res && res.code === 200) {
                departmentOptions.value = res.data || []
                
                // 设置默认筛选条件
                if (setDefaultFilter && departmentOptions.value.length > 0) {
                    // 查找第一个未禁用的部门
                    const findFirstEnabledDepartment = (departments) => {
                        for (const dept of departments) {
                            if (!dept.disabled) {
                                return dept.departmentId
                            }
                            if (dept.departmentChildList && dept.departmentChildList.length > 0) {
                                const childResult = findFirstEnabledDepartment(dept.departmentChildList)
                                if (childResult) {
                                    return childResult
                                }
                            }
                        }
                        return null
                    }
                    
                    const firstDepartmentId = findFirstEnabledDepartment(departmentOptions.value)
                    if (firstDepartmentId) {
                        filters.departmentId = firstDepartmentId
                    }
                }
            } else {
                departmentOptions.value = []
                ElMessage({
                    message: res.message || t('systembasicmgmt.userAgent.getDepartmentFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            departmentOptions.value = []
            ElMessage({
                message: t('systembasicmgmt.userAgent.getDepartmentFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
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
            
            if (res && res.code === 200) {
                agentList.value = res.data || []
            } else {
                agentList.value = []
                ElMessage({
                    message: res.message || t('systembasicmgmt.userAgent.getFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            agentList.value = []
            ElMessage({
                message: t('systembasicmgmt.userAgent.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        } finally {
            agentLoading.value = false
        }
    }

    // 获取员工列表数据
    const fetchUserPages = async () => {
        loading.value = true
        const params = {
            departmentId: filters.departmentId,
            userNo: filters.userNo,
            userName: filters.userName,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            totalCount: pagination.totalCount
        }
        const res = await post(GET_USER_PAGES_API.GET_USER_PAGES, params)

        if (res && res.code === 200) {
            userList.value = res.data || []
            pagination.totalCount = res.totalCount || 0
        } else {
            ElMessage({
                message: res.message || t('systembasicmgmt.userAgent.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
        loading.value = false
    }
  
    // 防抖搜索定时器
    let searchTimer = null
    // 用户选择搜索防抖定时器
    let userSelectSearchTimer = null

    // 处理搜索操作（带防抖）
    const handleSearch = () => {
        if (searchTimer) clearTimeout(searchTimer)
        loading.value = true // 立即显示加载状态
        searchTimer = setTimeout(() => {
            pagination.pageIndex = 1
            fetchUserPages()
        }, 300) // 300ms防抖
    }
  
    // 重置搜索条件
    const handleReset = () => {
        loading.value = true // 显示加载状态
        Object.assign(filters, {
            departmentId: '',
            userNo: '',
            userName: ''
        })
        pagination.pageIndex = 1
        fetchUserPages()
    }
  

  
  
  
    // 处理页码变化
    const handlePageChange = (page) => {
        loading.value = true // 显示加载状态
        pagination.pageIndex = page
        fetchUserPages()
    }
  
    // 处理每页记录数变化
    const handleSizeChange = (size) => {
        loading.value = true // 显示加载状态
        pagination.pageSize = size
        pagination.pageIndex = 1
        fetchUserPages()
    }
  
    
  
        // 处理配置代理人操作
    const handleConfigureAgent = async (index, row) => {
        currentUserId.value = row.userId
        agentDialogTitle.value = `${t('systembasicmgmt.userAgent.agentDetails')} - ${row.userName || ''}`
        agentDialogVisible.value = true
        // 获取代理人列表
        await fetchUserAgentList(row.userId)
    }

    // 处理主页面新增代理人操作
    const handleAddAgentForUser = async (index, row) => {
        currentUserId.value = row.userId
        currentUserInfo.value = row
        // 重置时间选择
        Object.assign(agentTimeRange, {
            startTime: '',
            endTime: ''
        })
        // 重置用户选择
        selectedUsers.value = []
        
        // 重置搜索条件
        Object.assign(userSelectFilters, {
            departmentId: '',
            userNo: '',
            userName: ''
        })
        userSelectPagination.pageIndex = 1
        
        // 设置默认部门筛选条件
        if (departmentOptions.value.length > 0) {
            // 查找第一个未禁用的部门
            const findFirstEnabledDepartment = (departments) => {
                for (const dept of departments) {
                    if (!dept.disabled) {
                        return dept.departmentId
                    }
                    if (dept.departmentChildList && dept.departmentChildList.length > 0) {
                        const childResult = findFirstEnabledDepartment(dept.departmentChildList)
                        if (childResult) {
                            return childResult
                        }
                    }
                }
                return null
            }
            
            const firstDepartmentId = findFirstEnabledDepartment(departmentOptions.value)
            if (firstDepartmentId) {
                userSelectFilters.departmentId = firstDepartmentId
            }
        }
        
        userSelectDialogVisible.value = true
        
        // 等待对话框打开后获取用户列表
        await nextTick()
        await fetchUserSelectList()
    }

    // 处理代理人对话框完全关闭后的清理
    const handleAgentDialogClosed = async () => {
        agentList.value = []
        currentUserId.value = ''
        agentDialogTitle.value = ''
        // 刷新主页面数据
        await fetchUserPages()
    }

    // 处理员工选择对话框关闭后的清理
    const handleUserSelectDialogClosed = () => {
        currentUserInfo.value = {}
        currentUserId.value = ''
        selectedUsers.value = []
        Object.assign(agentTimeRange, {
            startTime: '',
            endTime: ''
        })
        Object.assign(userSelectFilters, {
            departmentId: '',
            userNo: '',
            userName: ''
        })
        // 清空表格选择
        if (userSelectTableRef.value) {
            userSelectTableRef.value.clearSelection()
        }
    }



    // 处理删除代理人
    const handleDeleteAgent = async (index) => {
        try {
            const agent = agentList.value[index]
            
            // 确认删除
            await ElMessageBox.confirm(
                t('systembasicmgmt.userAgent.confirmDeleteAgent', { name: agent.agentUserName }),
                t('common.confirmDelete'),
                {
                    confirmButtonText: t('common.confirm'),
                    cancelButtonText: t('common.cancel'),
                    type: 'warning',
                }
            )
            
            // 调用删除接口
            const params = {
                substituteUserId: currentUserId.value,
                agentUserId: agent.agentUserId
            }
            
            const res = await post(GET_USER_AGENT_DELETE_API.GET_USER_AGENT_DELETE, params)
            
            if (res && res.code === 200) {
                ElMessage({
                    message: res.message || t('common.deleteSuccess'),
                    type: 'success',
                    plain: true,
                    showClose: true
                })
                // 重新获取代理人列表
                await fetchUserAgentList(currentUserId.value)
                // 关闭弹出框并刷新主页面
                agentDialogVisible.value = false
                await fetchUserPages()
            } else {
                ElMessage({
                    message: res.message || t('common.operationFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            if (error === 'cancel') {
                // 用户取消删除
                return
            }
            ElMessage({
                message: t('common.operationFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }

    // 获取用户选择列表
    const fetchUserSelectList = async () => {
        userSelectLoading.value = true
        try {
            const params = {
                departmentId: userSelectFilters.departmentId,
                userNo: userSelectFilters.userNo,
                userName: userSelectFilters.userName,
                pageIndex: userSelectPagination.pageIndex,
                pageSize: userSelectPagination.pageSize,
                totalCount: userSelectPagination.totalCount,
                SubstituteUserId: currentUserId.value // 排除自己不能代理自己
            }
            const res = await post(GET_USER_VIEW_API.GET_USER_VIEW, params)
            
            if (res && res.code === 200) {
                userSelectList.value = res.data || []
                userSelectPagination.totalCount = res.totalCount || 0
            } else {
                userSelectList.value = []
                userSelectPagination.totalCount = 0
                ElMessage({
                    message: res.message || t('systembasicmgmt.userAgent.getFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            userSelectList.value = []
            userSelectPagination.totalCount = 0
            ElMessage({
                message: t('systembasicmgmt.userAgent.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        } finally {
            userSelectLoading.value = false
        }
    }

    // 处理用户选择搜索（带防抖）
    const handleUserSelectSearch = () => {
        if (userSelectSearchTimer) clearTimeout(userSelectSearchTimer)
        userSelectLoading.value = true // 立即显示加载状态
        userSelectSearchTimer = setTimeout(() => {
            userSelectPagination.pageIndex = 1
            fetchUserSelectList()
        }, 300) // 300ms防抖
    }

    // 重置用户选择搜索
    const handleUserSelectReset = () => {
        Object.assign(userSelectFilters, {
            departmentId: '',
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

    // 处理开始时间变化
    const handleStartTimeChange = (value) => {
        if (value && agentTimeRange.endTime && new Date(value) > new Date(agentTimeRange.endTime)) {
            ElMessage({
                message: t('systembasicmgmt.userAgent.startTimeCannotLaterThanEndTime'),
                type: 'warning',
                plain: true,
                showClose: true
            })
            agentTimeRange.startTime = ''
        }
    }

    // 处理结束时间变化
    const handleEndTimeChange = (value) => {
        if (value && agentTimeRange.startTime && new Date(value) < new Date(agentTimeRange.startTime)) {
            ElMessage({
                message: t('systembasicmgmt.userAgent.endTimeCannotEarlierThanStartTime'),
                type: 'warning',
                plain: true,
                showClose: true
            })
            agentTimeRange.endTime = ''
        }
    }

    // 确认用户选择
    const handleConfirmUserSelect = async () => {
        if (selectedUsers.value.length === 0) {
            ElMessage({
                message: t('systembasicmgmt.userAgent.pleaseSelectUsers'),
                type: 'warning',
                plain: true,
                showClose: true
            })
            return
        }

        // 验证表单
        try {
            await agentTimeFormRef.value.validate()
        } catch (error) {
            return
        }

        try {
            // 格式化时间
            const startTime = new Date(agentTimeRange.startTime).toISOString().slice(0, 19).replace('T', ' ')
            const endTime = new Date(agentTimeRange.endTime).toISOString().slice(0, 19).replace('T', ' ')

            // 逐个调用新增接口
            for (const user of selectedUsers.value) {
                const params = {
                    substituteUserId: user.userId,
                    agentUserId: currentUserId.value,
                    startTime: startTime,
                    endTime: endTime
                }
                
                const res = await post(GET_USER_AGENT_INSERT_API.GET_USER_AGENT_INSERT, params)
                
                if (res && res.code === 200) {
                    // 成功添加代理人
                } else {
                    ElMessage({
                        message: res.message || `添加代理人失败 ${user.userNameCn || user.userNameEn}`,
                        type: 'error',
                        plain: true,
                        showClose: true
                    })
                    return
                }
            }

            ElMessage({
                message: t('common.saveSuccess'),
                type: 'success',
                plain: true,
                showClose: true
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

            // 重新获取代理人列表
            await fetchUserAgentList(currentUserId.value)
            
            // 清理当前用户信息
            currentUserInfo.value = {}
            
            // 刷新主页面数据
            await fetchUserPages()
            
        } catch (error) {
            ElMessage({
                message: t('common.operationFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }

    // 获取员工代理了哪些人的列表数据
    const fetchProactiveAgentList = async (userId) => {
        proactiveAgentLoading.value = true
        try {
            const params = {
                userId: userId
            }
            const res = await post(GET_USER_AGENT_API.GET_USER_PRO_AGENT, params)
            
            if (res && res.code === 200) {
                proactiveAgentList.value = res.data || []
            } else {
                proactiveAgentList.value = []
                ElMessage({
                    message: res.message || t('systembasicmgmt.userAgent.getFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            proactiveAgentList.value = []
            ElMessage({
                message: t('systembasicmgmt.userAgent.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        } finally {
            proactiveAgentLoading.value = false
        }
    }

    // 处理查看员工代理了哪些人操作
    const handleViewProactiveAgent = async (index, row) => {
        currentProactiveUserId.value = row.userId
        proactiveAgentDialogTitle.value = `${t('systembasicmgmt.userAgent.proactiveAgentDetails')} - ${row.userName || ''}`
        proactiveAgentDialogVisible.value = true
        // 获取员工代理了哪些人的列表
        await fetchProactiveAgentList(row.userId)
    }

    // 处理查看员工代理了哪些人对话框完全关闭后的清理
    const handleProactiveAgentDialogClosed = async () => {
        proactiveAgentList.value = []
        currentProactiveUserId.value = ''
        proactiveAgentDialogTitle.value = ''
        // 刷新主页面数据
        await fetchUserPages()
    }

  </script>
  
  <style scoped>
    @import '@/assets/styles/conventionalTablePage.css';
  </style>
  
  
