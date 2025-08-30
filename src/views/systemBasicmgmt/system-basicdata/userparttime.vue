<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">
  
            <!-- 过滤条件 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="员工兼任搜索表单">
                <el-form-item :label="$t('SystemBasicMgmt.userPartTime.department')">
                    <el-tree-select 
                        v-model="filters.departmentId"
                        :data="departmentList || []"
                        :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                        check-strictly
                        filterable
                        :filter-node-method="filterNodeMethod"
                        style="width: 200px;"
                        :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseSelectDepartment')" />
                </el-form-item>
                <el-form-item :label="$t('SystemBasicMgmt.userPartTime.userNo')">
                    <el-input 
                        v-model="filters.userNo"
                        style="width: 180px;"
                        :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseEnterUserNo')" />
                </el-form-item>
                <el-form-item :label="$t('SystemBasicMgmt.userPartTime.userName')">
                    <el-input 
                        v-model="filters.userName"
                        style="width: 180px;"
                        :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseEnterUserName')" />
                </el-form-item>
                <el-form-item class="form-button-group">
                    <el-button type="primary" @click="handleSearch" plain>
                        {{ $t('common.search') }}
                    </el-button>
                </el-form-item>
                <el-form-item class="form-right-button">
                    <el-button type="primary" @click="handleAdd">
                        {{ $t('SystemBasicMgmt.userPartTime.addPartTime') }}
                    </el-button>
                </el-form-item>
            </el-form>
  
            <!-- 表格区域 -->
            <div class="table-container">
                <el-table :data="userPartTimeList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          v-loading="loading"
                          class="conventional-table">
                    <el-table-column type="index" :label="$t('SystemBasicMgmt.userPartTime.index')" width="70" align="center" fixed />
                    <el-table-column prop="userNo" :label="$t('SystemBasicMgmt.userPartTime.userNo')" align="center" min-width="130" />
                    <el-table-column prop="userName" :label="$t('SystemBasicMgmt.userPartTime.userName')" align="left" min-width="150" />
                    <el-table-column :label="$t('SystemBasicMgmt.userPartTime.isApproval')" align="center" min-width="110">
                        <template #default="scope">
                            <el-tag :type="scope.row.isApproval === '1' ? 'primary' : 'info'">
                                {{ scope.row.isApprovalName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="departmentName" :label="$t('SystemBasicMgmt.userPartTime.department')" align="left" min-width="240" />
                    <el-table-column prop="positionName" :label="$t('SystemBasicMgmt.userPartTime.position')" align="left" min-width="120" />
                    <el-table-column :label="$t('SystemBasicMgmt.userPartTime.isPartTime')" align="center" min-width="120">
                        <template #default="scope">
                            <el-tag :type="scope.row.isPartTime === '1' ? 'primary' : 'info'">
                                {{ scope.row.isPartTimeName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="partTimeDeptName" :label="$t('SystemBasicMgmt.userPartTime.partTimeDepartment')" align="left" min-width="200" />
                    <el-table-column prop="partTimePositionName" :label="$t('SystemBasicMgmt.userPartTime.partTimePosition')" align="left" min-width="180" />
                    <el-table-column prop="startTime" :label="$t('SystemBasicMgmt.userPartTime.startTime')" align="center" min-width="150" />
                    <el-table-column prop="endTime" :label="$t('SystemBasicMgmt.userPartTime.endTime')" align="center" min-width="150" />
                    <el-table-column :label="$t('SystemBasicMgmt.userPartTime.operation')" min-width="140" fixed="right" align="center">
                        <template #default="scope">
                            <el-button v-if="scope.row.isPartTime === '1'"
                                       size="small"
                                       type="danger"
                                       @click="handleDelete(scope.$index, scope.row)">{{ $t('SystemBasicMgmt.userPartTime.deletePartTime') }}</el-button>
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

        <!-- 新增兼任对话框 -->
        <el-dialog v-model="addDialogVisible" 
                   :title="$t('SystemBasicMgmt.userPartTime.addPartTime')" 
                   width="70%" 
                   :close-on-click-modal="false" 
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true"
                   append-to-body
                   class="parttime-dialog">
            <div v-loading="submitLoading" style="height: 560px;">
                <!-- 兼任信息区域 -->
                <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" :inline="true" class="conventional-filter-form" >
                   <el-form-item :label="$t('SystemBasicMgmt.userPartTime.partTimeDepartment')" prop="partTimeDeptId" style="margin-bottom:20px;">
                            <el-tree-select 
                                v-model="addForm.partTimeDeptId"
                                :data="departmentList || []"
                                :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                                check-strictly
                                filterable
                                clearable
                                :filter-node-method="filterNodeMethod"
                                style="width: 200px;"
                                :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseSelectPartTimeDepartment')" />
                        </el-form-item>
                        <el-form-item :label="$t('SystemBasicMgmt.userPartTime.partTimePosition')" prop="partTimePositionId" style="margin-bottom:20px;">
                            <el-select v-model="addForm.partTimePositionId" :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseSelectPartTimePosition')" style="width: 200px;" clearable>
                                <el-option v-for="item in positionList" :key="item.positionId" :label="item.positionName" :value="item.positionId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('SystemBasicMgmt.userPartTime.partTimeLabor')" prop="partTimeLaborId" style="margin-bottom:20px;">
                            <el-select v-model="addForm.partTimeLaborId" :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseSelectPartTimeLabor')" style="width: 200px;" clearable>
                                <el-option v-for="item in laborList" :key="item.laborId" :label="item.laborName" :value="item.laborId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('SystemBasicMgmt.userPartTime.startTime')" prop="startTime">
                            <el-date-picker
                                v-model="addForm.startTime"
                                type="datetime"
                                :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseSelectStartTime')"
                                :disabled-date="(date) => addForm.endTime && date > new Date(addForm.endTime)"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                style="width: 200px;" />
                        </el-form-item>
                        <el-form-item :label="$t('SystemBasicMgmt.userPartTime.endTime')" prop="endTime">
                            <el-date-picker
                                v-model="addForm.endTime"
                                type="datetime"
                                :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseSelectEndTime')"
                                :disabled-date="(date) => addForm.startTime && date < new Date(addForm.startTime)"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                style="width: 200px;" />
                        </el-form-item>
                </el-form>
                
                <!-- 分隔线 -->
                <el-divider style="margin: 10px 0;"></el-divider>

                <!-- 搜索区域 -->
                <el-form :inline="true" :model="userFilters" class="conventional-filter-form" style="margin-top: 10px;">
                    <el-form-item :label="$t('SystemBasicMgmt.userPartTime.department')">
                        <el-tree-select 
                            v-model="userFilters.departmentId"
                            :data="departmentList || []"
                            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                            check-strictly
                            filterable
                            clearable
                            :filter-node-method="filterNodeMethod"
                            style="width: 200px;"
                            :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseSelectDepartment')" />
                    </el-form-item>
                    <el-form-item :label="$t('SystemBasicMgmt.userPartTime.userNo')">
                        <el-input 
                            v-model="userFilters.userNo"
                            style="width: 180px;"
                            :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseEnterUserNo')"
                            clearable />
                    </el-form-item>
                    <el-form-item :label="$t('SystemBasicMgmt.userPartTime.userName')">
                        <el-input 
                            v-model="userFilters.userName"
                            style="width: 180px;"
                            :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseEnterUserName')"
                            clearable />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleUserSearch">{{ $t('common.search') }}</el-button>
                        <el-button @click="handleUserReset">{{ $t('common.reset') }}</el-button>
                    </el-form-item>
                </el-form>

                <!-- 员工表格 -->
                <el-table :data="userList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          class="conventional-table"
                          height="280"
                          @selection-change="handleUserSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="userNo" :label="$t('SystemBasicMgmt.userPartTime.userNo')" align="center" min-width="100" />
                    <el-table-column prop="userNameCn" :label="$t('SystemBasicMgmt.userPartTime.userName')" align="left" min-width="120" />
                    <el-table-column prop="departmentName" :label="$t('SystemBasicMgmt.userPartTime.department')" align="left" min-width="120" />
                    <el-table-column prop="positionName" :label="$t('SystemBasicMgmt.userPartTime.position')" align="left" min-width="100" />
                    <el-table-column :label="$t('SystemBasicMgmt.userPartTime.isApproval')" align="center" min-width="110">
                        <template #default="scope">
                            <el-tag :type="scope.row.isApproval === 1 ? 'primary' : 'info'">
                                {{ scope.row.isApprovalName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="userPagination.pageIndex"
                                   v-model:page-size="userPagination.pageSize"
                                   :page-sizes="[10, 20, 50]"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="userPagination.totalCount"
                                   @size-change="handleUserSizeChange"
                                   @current-change="handleUserPageChange" />
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addDialogVisible = false">{{ $t('common.cancel') }}</el-button>
                    <el-button type="primary" @click="handleSubmitAdd" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import { post } from '@/utils/request'
    import { 
        GET_USER_PARTTIME_PAGES_API,
        DELETE_USER_PARTTIME_API,
        GET_USER_PAGES_API,
        INSERT_USER_PARTTIME_API,
        GET_POSITION_DROPDOWN_API,
        GET_LABOR_DROPDOWN_API
    } from '@/config/api/SystemBasicMgmt/System-BasicData/userparttime'
    import {
        GET_DEPARTMENT_DROPDOWN_API
    } from '@/config/api/SystemBasicMgmt/System-BasicData/user'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useI18n } from 'vue-i18n'
  
    // 初始化i18n
    const { t } = useI18n()
  

  
    // 员工兼任数据
    const userPartTimeList = ref([])
    const loading = ref(false)
    
    // 部门下拉列表
    const departmentList = ref([])
    
    // 新增兼任相关数据
    const addDialogVisible = ref(false)
    const submitLoading = ref(false)
    const addFormRef = ref(null)
    
    // 职级下拉列表
    const positionList = ref([])
    
    // 职业下拉列表
    const laborList = ref([])
    
    // 用户信息相关数据
    const userList = ref([])
    const userLoading = ref(false)
    const selectedUsers = ref([])
  
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
        userName: ''
    })
    
    // 新增表单数据
    const addForm = reactive({
        partTimeDeptId: '',
        partTimePositionId: '',
        partTimeLaborId: '',
        startTime: '',
        endTime: '',
        userId: ''
    })
    
    // 用户搜索条件
    const userFilters = reactive({
        departmentId: '',
        userNo: '',
        userName: ''
    })
    
    // 用户分页信息
    const userPagination = reactive({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
    })
    
    // 表单验证规则
    const addFormRules = reactive({
        partTimeDeptId: [
            { required: true, message: t('SystemBasicMgmt.userPartTime.partTimeDepartmentRequired'), trigger: 'change' }
        ],
        partTimePositionId: [
            { required: true, message: t('SystemBasicMgmt.userPartTime.partTimePositionRequired'), trigger: 'change' }
        ],
        partTimeLaborId: [
            { required: true, message: t('SystemBasicMgmt.userPartTime.partTimeLaborRequired'), trigger: 'change' }
        ],
        startTime: [
            { required: true, message: t('SystemBasicMgmt.userPartTime.startTimeRequired'), trigger: 'change' }
        ],
        endTime: [
            { required: true, message: t('SystemBasicMgmt.userPartTime.endTimeRequired'), trigger: 'change' }
        ]
    })
  
    // 在组件挂载后获取数据
    onMounted(async () => {
        // 获取部门下拉列表，并默认选中第一个部门
        await fetchDepartmentList(true)
        // 获取员工兼任列表数据
        await fetchUserPartTimePages()
        // 初始化获取用户列表数据
        await fetchUserPages()
    })
    
    // 获取部门下拉列表
    const fetchDepartmentList = async (setDefaultFilter = false, setDefaultForm = false) => {
        try {
            const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
            
            if (res && res.code === 200) {
                departmentList.value = Array.isArray(res.data) ? res.data : []
                
                // 验证数据结构并过滤无效数据（递归验证部门树结构）
                const validateDepartment = (dept) => {
                    if (!dept || dept.departmentId === undefined || dept.departmentId === null || 
                        dept.departmentName === undefined || dept.departmentName === null) {
                        return false
                    }
                    if (dept.departmentChildList && Array.isArray(dept.departmentChildList)) {
                        dept.departmentChildList = dept.departmentChildList.filter(validateDepartment)
                    }
                    return true
                }
                departmentList.value = departmentList.value.filter(validateDepartment)
                
                // 设置筛选条件默认值 - 选择第一个未禁用的选项
                if (setDefaultFilter && departmentList.value.length > 0 && !filters.departmentId) {
                    const firstEnabledDept = departmentList.value.find(item => !item.disabled)
                    if (firstEnabledDept) {
                        filters.departmentId = firstEnabledDept.departmentId
                    }
                }
                
                // 设置表单默认值 - 选择第一个未禁用的选项
                if (setDefaultForm && departmentList.value.length > 0 && !addForm.partTimeDeptId) {
                    const firstEnabledDept = departmentList.value.find(item => !item.disabled)
                    if (firstEnabledDept) {
                        addForm.partTimeDeptId = firstEnabledDept.departmentId
                    }
                }
            } else {
                departmentList.value = []
                ElMessage({
                    message: res.message || t('SystemBasicMgmt.userPartTime.getDepartmentFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            departmentList.value = []
            ElMessage({
                message: t('SystemBasicMgmt.userPartTime.getDepartmentFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
    
    // 获取职级下拉列表
    const fetchPositionList = async (setDefaultForm = false) => {
        try {
            const res = await post(GET_POSITION_DROPDOWN_API.GET_POSITION_DROPDOWN, {})
            
            if (res && res.code === 200) {
                positionList.value = Array.isArray(res.data) ? res.data : []
                
                // 验证数据结构并过滤无效数据
                positionList.value = positionList.value.filter(item => 
                    item && item.positionId !== undefined && item.positionId !== null && 
                    item.positionName !== undefined && item.positionName !== null
                )
                
                // 设置表单默认值 - 选择第一个未禁用的选项
                if (setDefaultForm && positionList.value.length > 0 && !addForm.partTimePositionId) {
                    const firstEnabledPosition = positionList.value.find(item => !item.disabled)
                    if (firstEnabledPosition) {
                        addForm.partTimePositionId = firstEnabledPosition.positionId
                    }
                }
            } else {
                positionList.value = []
                ElMessage({
                    message: res.message || t('SystemBasicMgmt.userPartTime.getPositionFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            positionList.value = []
            ElMessage({
                message: t('SystemBasicMgmt.userPartTime.getPositionFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
    
    // 获取职业下拉列表
    const fetchLaborList = async (setDefaultForm = false) => {
        try {
            const res = await post(GET_LABOR_DROPDOWN_API.GET_LABOR_DROPDOWN, {})
            
            if (res && res.code === 200) {
                laborList.value = Array.isArray(res.data) ? res.data : []
                
                // 验证数据结构并过滤无效数据
                laborList.value = laborList.value.filter(item => 
                    item && item.laborId !== undefined && item.laborId !== null && 
                    item.laborName !== undefined && item.laborName !== null
                )
                
                // 设置表单默认值 - 选择第一个未禁用的选项
                if (setDefaultForm && laborList.value.length > 0 && !addForm.partTimeLaborId) {
                    const firstEnabledLabor = laborList.value.find(item => !item.disabled)
                    if (firstEnabledLabor) {
                        addForm.partTimeLaborId = firstEnabledLabor.laborId
                    }
                }
            } else {
                laborList.value = []
                ElMessage({
                    message: res.message || t('SystemBasicMgmt.userPartTime.getLaborFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            laborList.value = []
            ElMessage({
                message: t('SystemBasicMgmt.userPartTime.getLaborFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
  
    // 获取员工兼任列表数据
    const fetchUserPartTimePages = async () => {
        loading.value = true
        try {
            const params = {
                departmentId: filters.departmentId,
                userNo: filters.userNo,
                userName: filters.userName,
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                totalCount: pagination.totalCount
            }
            const res = await post(GET_USER_PARTTIME_PAGES_API.GET_USER_PARTTIME_PAGES, params)

            if (res && res.code === 200) {
                userPartTimeList.value = res.data || []
                console.log('userPartTimeList.value', userPartTimeList.value)
                pagination.totalCount = res.totalCount || 0
            } else {
                userPartTimeList.value = []
                ElMessage({
                    message: res.message || t('SystemBasicMgmt.userPartTime.getFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            userPartTimeList.value = []
            ElMessage({
                message: t('SystemBasicMgmt.userPartTime.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        } finally {
            loading.value = false
        }
    }
    
    // 获取用户信息列表数据
    const fetchUserPages = async () => {
        userLoading.value = true
        try {
            const params = {
                departmentId: userFilters.departmentId,
                userNo: userFilters.userNo,
                userName: userFilters.userName,
                pageIndex: userPagination.pageIndex,
                pageSize: userPagination.pageSize,
                totalCount: userPagination.totalCount
            }
            const res = await post(GET_USER_PAGES_API.GET_USER_PAGES, params)

            if (res && res.code === 200) {
                userList.value = res.data || []
                userPagination.totalCount = res.totalCount || 0
            } else {
                userList.value = []
                ElMessage({
                    message: res.message || t('SystemBasicMgmt.userPartTime.getUserFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            userList.value = []
            ElMessage({
                message: t('SystemBasicMgmt.userPartTime.getUserFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        } finally {
            userLoading.value = false
        }
    }
  
    // 处理搜索操作
    const handleSearch = () => {
        pagination.pageIndex = 1
        fetchUserPartTimePages()
    }
  

  
    // 处理页码变化
    const handlePageChange = (page) => {
        pagination.pageIndex = page
        fetchUserPartTimePages()
    }
  
    // 处理每页记录数变化
    const handleSizeChange = (size) => {
        pagination.pageSize = size
        pagination.pageIndex = 1
        fetchUserPartTimePages()
    }
    
    // 部门树形选择器过滤方法
    const filterNodeMethod = (value, data) => {
        if (!value) return true
        return data.departmentName && data.departmentName.toLowerCase().includes(value.toLowerCase())
    }
    
    // 处理新增操作
    const handleAdd = async () => {
        // 重置表单数据
        Object.assign(addForm, {
            partTimeDeptId: '',
            partTimePositionId: '',
            partTimeLaborId: '',
            startTime: '',
            endTime: '',
            userId: ''
        })
        
        // 重置用户搜索条件
        Object.assign(userFilters, {
            departmentId: '',
            userNo: '',
            userName: ''
        })
        
        // 重置用户分页
        userPagination.pageIndex = 1
        userPagination.pageSize = 10
        userPagination.totalCount = 0
        
        // 清空用户列表和选中状态
        userList.value = []
        selectedUsers.value = []
        
        // 获取下拉列表数据并设置默认值
        await fetchDepartmentList(false, true)
        await fetchPositionList(true)
        await fetchLaborList(true)
        
        // 显示对话框
        addDialogVisible.value = true
    }
    
    // 处理用户搜索操作
    const handleUserSearch = () => {
        userPagination.pageIndex = 1
        fetchUserPages()
    }
    
    // 重置用户搜索条件
    const handleUserReset = () => {
        Object.assign(userFilters, {
            departmentId: '',
            userNo: '',
            userName: ''
        })
        userPagination.pageIndex = 1
        fetchUserPages()
    }
    
    // 处理用户页码变化
    const handleUserPageChange = (page) => {
        userPagination.pageIndex = page
        fetchUserPages()
    }
    
    // 处理用户每页记录数变化
    const handleUserSizeChange = (size) => {
        userPagination.pageSize = size
        userPagination.pageIndex = 1
        fetchUserPages()
    }
    
    // 处理用户选择变化
    const handleUserSelectionChange = (selection) => {
        selectedUsers.value = selection
        // 只允许选择一个用户
        if (selection.length > 0) {
            addForm.userId = selection[0].userId
        } else {
            addForm.userId = ''
        }
    }
    
    // 提交新增
    const handleSubmitAdd = async () => {
        // 验证是否选择了用户
        if (!addForm.userId) {
            return
        }
        
        
        // 验证表单
        if (!addFormRef.value) return
        
        try {
            await addFormRef.value.validate()
            
            submitLoading.value = true
            
            const params = {
                userId: addForm.userId,
                partTimeDeptId: addForm.partTimeDeptId,
                partTimePositionId: addForm.partTimePositionId,
                partTimeLaborId: addForm.partTimeLaborId,
                startTime: addForm.startTime,
                endTime: addForm.endTime
            }
            console.log(params)
            const res = await post(INSERT_USER_PARTTIME_API.INSERT_USER_PARTTIME, params)
            
            if (res && res.code === 200) {
                ElMessage({
                    message: res.message || t('SystemBasicMgmt.userPartTime.addPartTimeSuccess'),
                    type: 'success',
                    plain: true,
                    showClose: true
                })
                
                // 关闭对话框
                addDialogVisible.value = false
                
                // 刷新列表
                await fetchUserPartTimePages()
            } else {
                ElMessage({
                    message: res.message || t('SystemBasicMgmt.userPartTime.addPartTimeFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            // 表单验证失败时静默返回，不显示任何提示
            return
        } finally {
            submitLoading.value = false
        }
    }
    
    // 处理删除操作
    const handleDelete = async (index, row) => {
        try {
            await ElMessageBox.confirm(
                t('SystemBasicMgmt.userPartTime.deletePartTimeConfirm'),
                t('common.warning'),
                {
                    confirmButtonText: t('common.confirm'),
                    cancelButtonText: t('common.cancel'),
                    type: 'warning'
                }
            )
            
            // 根据需求文档构建删除参数
            const deleteParams = {
                userId: row.userId,
                old_PartTimeDeptId: row.partTimeDeptId,
                old_PartTimePositionId: row.partTimePositionId,
                old_PartTimeLaborId: row.partTimeLaborId
            }
            
            const res = await post(DELETE_USER_PARTTIME_API.DELETE_USER_PARTTIME, deleteParams)
            
            if (res && res.code === 200) {
                ElMessage({
                    message: t('SystemBasicMgmt.userPartTime.deletePartTimeSuccess'),
                    type: 'success',
                    plain: true,
                    showClose: true
                })
                // 删除成功后刷新列表
                await fetchUserPartTimePages()
            } else {
                ElMessage({
                    message: res.message || t('SystemBasicMgmt.userPartTime.deletePartTimeFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            if (error !== 'cancel') {
                ElMessage({
                    message: t('SystemBasicMgmt.userPartTime.deletePartTimeFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        }
    }
</script>

<style scoped>
 @import '@/assets/styles/conventionalTablePage.css';

  /* 兼任对话框样式 */
  :deep(.parttime-dialog .el-dialog) {
    height: 550px;
    overflow: hidden;
  }

  :deep(.parttime-dialog .el-dialog__body) {
    height: calc(550px - 120px); /* 减去header和footer的高度 */
    overflow: auto;
    padding: 0 20px 20px 20px;
  }

  :deep(.parttime-dialog .el-dialog__header) {
    padding-bottom: 15px;
  }

  /* 三列布局样式 */
  .dialog-form .form-row.three-columns {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }

  .dialog-form .form-row.three-columns .el-form-item {
    flex: 0 0 calc(33.333% - 14px);
    margin-right: 20px;
    margin-bottom: 0;
  }

  .dialog-form .form-row.three-columns .el-form-item:last-child {
    margin-right: 0;
  }

  /* 四列布局样式 */
  .dialog-form .form-row.four-columns {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }

  .dialog-form .form-row.four-columns .el-form-item {
    flex: 0 0 calc(25% - 15px);
    margin-right: 20px;
    margin-bottom: 0;
  }

  .dialog-form .form-row.four-columns .el-form-item:last-child {
    margin-right: 0;
  }
</style>
  
  
