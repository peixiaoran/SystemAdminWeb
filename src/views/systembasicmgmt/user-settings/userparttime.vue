<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">
  
            <!-- 过滤条件 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="员工兼任搜索表单">
                <el-form-item :label="$t('systembasicmgmt.userPartTime.department')">
                    <el-tree-select
                        v-model="filters.departmentId"
                        :data="departmentList || []"
                        :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                        check-strictly
                        filterable
                        :filter-node-method="filterNodeMethod"
                        style="width: 200px;"
                        @change="handleDepartmentChange"
                        :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectDepartment')" />
                </el-form-item>
                <el-form-item :label="$t('systembasicmgmt.userPartTime.userNo')">
                    <el-input 
                        v-model="filters.userNo"
                        style="width: 180px;"
                        :placeholder="$t('systembasicmgmt.userPartTime.pleaseEnterUserNo')" />
                </el-form-item>
                <el-form-item :label="$t('systembasicmgmt.userPartTime.name')">
                    <el-input 
                        v-model="filters.userName"
                        style="width: 180px;"
                        :placeholder="$t('systembasicmgmt.userPartTime.pleaseEnterUserName')" />
                </el-form-item>
                <el-form-item class="form-button-group">
                    <el-button type="primary" @click="handleSearch" plain>
                        {{ $t('common.search') }}
                    </el-button>
                    <el-button @click="handleReset" plain>
                        {{ $t('common.reset') }}
                    </el-button>
                </el-form-item>
                <el-form-item class="form-right-button">
                    <el-button type="primary" @click="handleAdd">
                        {{ $t('systembasicmgmt.userPartTime.addPartTime') }}
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
                    <el-table-column type="index" :label="$t('systembasicmgmt.userPartTime.index')" width="70" align="center" fixed />
                    <el-table-column prop="userNo" :label="$t('systembasicmgmt.userPartTime.userNo')" align="left" min-width="110" />
                    <el-table-column prop="userName" :label="$t('systembasicmgmt.userPartTime.name')" align="left" min-width="200" />
                    <el-table-column :label="$t('systembasicmgmt.userPartTime.isApproval')" align="center" min-width="150">
                        <template #default="scope">
                            <el-tag :type="scope.row.isApproval === '1' ? 'primary' : 'info'">
                                {{ scope.row.isApprovalName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userPartTime.department')" align="left" min-width="200" />
                    <el-table-column prop="positionName" :label="$t('systembasicmgmt.userPartTime.position')" align="left" min-width="150" />
                    <el-table-column prop="partTimeDeptName" :label="$t('systembasicmgmt.userPartTime.partTimeDepartment')" align="left" min-width="200" />
                    <el-table-column prop="partTimePositionName" :label="$t('systembasicmgmt.userPartTime.partTimePosition')" align="left" min-width="150" />
                    <el-table-column prop="partTimeLaborName" :label="$t('systembasicmgmt.userPartTime.partTimeLabor')" align="left" min-width="150" />
                    <el-table-column prop="startTime" :label="$t('systembasicmgmt.userPartTime.startTime')" align="center" min-width="160" />
                    <el-table-column prop="endTime" :label="$t('systembasicmgmt.userPartTime.endTime')" align="center" min-width="160" />
                    <el-table-column :label="$t('systembasicmgmt.userPartTime.operation')" min-width="150" fixed="right" align="center">
                        <template #default="scope">
                            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)" plain>
                                {{ $t('systembasicmgmt.userPartTime.editPartTime') }}
                            </el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" plain>
                                {{ $t('systembasicmgmt.userPartTime.deletePartTime') }}
                            </el-button>
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

        <!-- 合并后的新增/编辑兼任对话框 -->
        <el-dialog v-model="dialogVisible"
                   :title="`${$t('systembasicmgmt.userPartTime.mergedDialogTitle')} - ${isEditMode ? $t('systembasicmgmt.userPartTime.editPartTimeTitle') : $t('systembasicmgmt.userPartTime.addPartTimeTitle')}`"
                   width="70%"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true"
                   append-to-body
                   class="parttime-dialog">
            <div style="height: 560px;">
                <!-- 兼任信息区域 -->
                <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogFormRules" :inline="true" class="conventional-filter-form">
                    <el-form-item :label="$t('systembasicmgmt.userPartTime.partTimeDepartment')" prop="partTimeDeptId" style="margin-bottom:20px;">
                        <el-tree-select
                            v-model="dialogForm.partTimeDeptId"
                            :data="departmentList || []"
                            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                            check-strictly
                            filterable
                            @change="handleDialogDeptChange"
                            :filter-node-method="filterNodeMethod"
                            style="width: 200px;"
                            :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectPartTimeDepartment')" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.userPartTime.partTimePosition')" prop="partTimePositionId" style="margin-bottom:20px;">
                        <el-select v-model="dialogForm.partTimePositionId" :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectPartTimePosition')" style="width: 200px;">
                            <el-option v-for="item in positionList" :key="item.positionId" :label="item.positionName" :value="item.positionId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.userPartTime.partTimeLabor')" prop="partTimeLaborId" style="margin-bottom:20px;">
                        <el-select v-model="dialogForm.partTimeLaborId" :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectPartTimeLabor')" style="width: 200px;">
                            <el-option v-for="item in laborList" :key="item.laborId" :label="item.laborName" :value="item.laborId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.userPartTime.startTime')" prop="startTime">
                        <el-date-picker
                            v-model="dialogForm.startTime"
                            type="datetime"
                            :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectStartTime')"
                            :disabled-date="(date) => dialogForm.endTime && date > new Date(dialogForm.endTime)"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            style="width: 200px;" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.userPartTime.endTime')" prop="endTime">
                        <el-date-picker
                            v-model="dialogForm.endTime"
                            type="datetime"
                            :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectEndTime')"
                            :disabled-date="(date) => dialogForm.startTime && date < new Date(dialogForm.startTime)"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            style="width: 200px;" />
                    </el-form-item>
                </el-form>

                <!-- 分隔线 -->
                <el-divider style="margin: 10px 0 8px;"></el-divider>

                <!-- 搜索区域 -->
                <el-form :inline="true" :model="dialogUserFilters" class="conventional-filter-form" style="margin-top: 10px;">
                    <el-form-item :label="$t('systembasicmgmt.userPartTime.department')">
                        <el-tree-select
                            v-model="dialogUserFilters.departmentId"
                            :data="departmentList || []"
                            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                            check-strictly
                            filterable
                            @change="handleDialogUserSearch"
                            :filter-node-method="filterNodeMethod"
                            style="width: 200px;"
                            :clearable="false"
                            :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectDepartment')" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.userPartTime.userNo')">
                        <el-input
                            v-model="dialogUserFilters.userNo"
                            style="width: 180px;"
                            :placeholder="$t('systembasicmgmt.userPartTime.pleaseEnterUserNo')"
                            clearable />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.userPartTime.name')">
                        <el-input
                            v-model="dialogUserFilters.userName"
                            style="width: 180px;"
                            :placeholder="$t('systembasicmgmt.userPartTime.pleaseEnterUserName')"
                            clearable />
                    </el-form-item>
                    <el-form-item v-if="!isEditMode">
                        <el-button type="primary" @click="handleDialogUserSearch">{{ $t('common.search') }}</el-button>
                        <el-button @click="handleDialogUserReset">{{ $t('common.reset') }}</el-button>
                    </el-form-item>
                </el-form>

                <!-- 员工表格 -->
                <el-table :data="dialogUserList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          v-loading="dialogUserLoading || dialogSubmitLoading"
                          class="conventional-table"
                          height="310"
                          @selection-change="handleDialogUserSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="userNo" :label="$t('systembasicmgmt.userPartTime.userNo')" align="left" min-width="100" />
                    <el-table-column prop="userName" :label="$t('systembasicmgmt.userPartTime.name')" align="left" min-width="160" />
                    <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userPartTime.department')" align="left" min-width="240" />
                    <el-table-column prop="positionName" :label="$t('systembasicmgmt.userPartTime.position')" align="left" min-width="100" />
                    <el-table-column prop="laborName" :label="$t('systembasicmgmt.userPartTime.labor')" align="left" min-width="240" />
                    <el-table-column :label="$t('systembasicmgmt.userPartTime.isApproval')" align="center" min-width="100">
                        <template #default="scope">
                            <el-tag :type="scope.row.isApproval === '1' ? 'primary' : 'info'">
                                {{ scope.row.isApprovalName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="dialogUserPagination.pageIndex"
                                   v-model:page-size="dialogUserPagination.pageSize"
                                   :page-sizes="[10, 20, 50]"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="dialogUserPagination.totalCount"
                                   @size-change="handleDialogUserSizeChange"
                                   @current-change="handleDialogUserPageChange" />
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
                    <el-button type="primary" @click="handleDialogSubmit" :loading="dialogSubmitLoading">{{ $t('common.confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
  
<script setup>
    import { ref, reactive, onMounted, nextTick } from 'vue'
    import { post } from '@/utils/request'
    import { 
        GET_USER_PARTTIME_PAGES_API,
        DELETE_USER_PARTTIME_API,
        GET_USER_PARTTIMEVIEW_API,
        INSERT_USER_PARTTIME_API,
        GET_USER_PARTTIMEENTITY_API,
        UPDATE_USER_PARTTIME_API,
        GET_POSITION_DROPDOWN_API,
        GET_LABOR_DROPDOWN_API
    } from '@/config/api/systembasicmgmt/user-settings/userparttime'
    import {
        GET_DEPARTMENT_DROPDOWN_API
    } from '@/config/api/systembasicmgmt/user-settings/userparttime'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useI18n } from 'vue-i18n'
    import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'
  
    // 初始化i18n
    const { t } = useI18n()
  
    // 员工兼任数据
    const userPartTimeList = ref([])
    const loading = ref(false)
    
    // 部门下拉列表
    const departmentList = ref([])
    
    // 合并后的通用对话框状态
    const dialogVisible = ref(false)
    const isEditMode = ref(false)
    const dialogSubmitLoading = ref(false)
    const dialogFormRef = ref(null)
    
    // 职级下拉列表
    const positionList = ref([])
    
    // 职业下拉列表
    const laborList = ref([])
    
    // 通用对话框内的用户信息列表与加载状态
    const dialogUserList = ref([])
    const dialogUserLoading = ref(false)
    const selectedDialogUsers = ref([])
  
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
    
    // 合并后的通用表单数据（包含新增与编辑所需字段）
    const dialogForm = reactive({
        userId: '',
        old_UserId: '',
        old_PartTimeDeptId: '',
        old_PartTimePositionId: '',
        old_PartTimeLaborId: '',
        partTimeDeptId: '',
        partTimePositionId: '',
        partTimeLaborId: '',
        startTime: '',
        endTime: '',
        userNo: '',
        userName: '',
        departmentName: '',
        positionName: '',
        laborName: ''
    })
    
    // 合并后的对话框内用户搜索条件与分页
    const dialogUserFilters = reactive({
        departmentId: '',
        userNo: '',
        userName: ''
    })
    const dialogUserPagination = reactive({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
    })
    
    // 通用表单验证规则（新增/编辑一致）
    const dialogFormRules = reactive({
        partTimeDeptId: [
            { required: true, message: t('systembasicmgmt.userPartTime.partTimeDepartmentRequired'), trigger: 'change' }
        ],
        partTimePositionId: [
            { required: true, message: t('systembasicmgmt.userPartTime.partTimePositionRequired'), trigger: 'change' }
        ],
        partTimeLaborId: [
            { required: true, message: t('systembasicmgmt.userPartTime.partTimeLaborRequired'), trigger: 'change' }
        ],
        startTime: [
            { required: true, message: t('systembasicmgmt.userPartTime.startTimeRequired'), trigger: 'change' }
        ],
        endTime: [
            { required: true, message: t('systembasicmgmt.userPartTime.endTimeRequired'), trigger: 'change' }
        ]
    })
  
    // 在组件挂载后获取数据
    onMounted(async () => {
        // 获取部门下拉列表，并默认选中第一个部门
        await fetchDepartmentList(true)
        
        // 等待默认值设置完成后再获取数据
        setTimeout(async () => {
            // 获取员工兼任列表数据
            await fetchUserPartTimePages()
        }, 200) // 稍微延长等待时间，确保默认值设置完成
    })
    
    /**
     * 递归查找第一个未禁用的部门ID
     * @param {Array} departments 部门树形列表
     * @returns {string|null} 返回第一个未禁用的部门ID，若不存在返回 null
     */
    const findFirstEnabledDepartment = (departments) => {
        for (const dept of departments) {
            // 检查当前部门是否未禁用
            if (!dept.disabled) {
                return dept.departmentId
            }
            // 如果当前部门禁用，检查子部门
            if (dept.departmentChildList && Array.isArray(dept.departmentChildList) && dept.departmentChildList.length > 0) {
                const childResult = findFirstEnabledDepartment(dept.departmentChildList)
                if (childResult) {
                    return childResult
                }
            }
        }
        return null
    }
    
    /**
     * 获取部门下拉列表
     * @param {boolean} [setDefaultFilter=false] 是否为主列表筛选设置默认值
     * @param {boolean} [setDefaultForm=false] 是否为对话框表单设置默认值
     * @returns {Promise<void>}
     */
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
                    const firstEnabledDept = findFirstEnabledDepartment(departmentList.value)
                    if (firstEnabledDept) {
                        filters.departmentId = firstEnabledDept
                    }
                }
                
                // 设置表单默认值 - 选择第一个未禁用的选项
                if (setDefaultForm && departmentList.value.length > 0 && !dialogForm.partTimeDeptId) {
                    const firstEnabledDept = findFirstEnabledDepartment(departmentList.value)
                    if (firstEnabledDept) {
                        dialogForm.partTimeDeptId = firstEnabledDept
                    }
                }
            } else {
                departmentList.value = []
                ElMessage({
                    message: res.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            departmentList.value = []
            ElMessage({
                message: t('systembasicmgmt.userPartTime.getDepartmentFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
    
    /**
     * 获取职级下拉列表
     * @param {boolean} [setDefaultForm=false] 是否为对话框表单设置默认值
     * @returns {Promise<void>}
     */
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
                if (setDefaultForm && positionList.value.length > 0 && !dialogForm.partTimePositionId) {
                    const firstEnabledPosition = positionList.value.find(item => !item.disabled)
                    if (firstEnabledPosition) {
                        dialogForm.partTimePositionId = firstEnabledPosition.positionId
                    }
                }
            } else {
                positionList.value = []
                ElMessage({
                    message: res.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            positionList.value = []
            ElMessage({
                message: t('systembasicmgmt.userPartTime.getPositionFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
    
    /**
     * 获取职业下拉列表
     * @param {boolean} [setDefaultForm=false] 是否为对话框表单设置默认值
     * @returns {Promise<void>}
     */
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
                if (setDefaultForm && laborList.value.length > 0 && !dialogForm.partTimeLaborId) {
                    const firstEnabledLabor = laborList.value.find(item => !item.disabled)
                    if (firstEnabledLabor) {
                        dialogForm.partTimeLaborId = firstEnabledLabor.laborId
                    }
                }
            } else {
                laborList.value = []
                ElMessage({
                    message: res.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            laborList.value = []
            ElMessage({
                message: t('systembasicmgmt.userPartTime.getLaborFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
  
    /**
     * 获取员工兼任主列表数据
     * @returns {Promise<void>}
     */
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
                pagination.totalCount = res.totalCount || 0
            } else {
                userPartTimeList.value = []
                ElMessage({
                    message: res.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            userPartTimeList.value = []
            ElMessage({
                message: t('systembasicmgmt.userPartTime.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        } finally {
            loading.value = false
        }
    }
    
    // 已合并为 fetchDialogUserPages，移除旧的 fetchUserPages 以避免未定义变量引用
  
    /**
     * 主列表查询的防抖函数
     * 通过防抖避免频繁请求接口
     */
    const debouncedFetchUserPartTimePages = debounce(() => {
        fetchUserPartTimePages()
    }, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

    /**
     * 处理主列表搜索（使用防抖）
     * 重置到第一页并触发查询
     */
    const handleSearch = () => {
        pagination.pageIndex = 1
        loading.value = true // 立即显示加载状态
        debouncedFetchUserPartTimePages()
    }

    /**
     * 立即查询主列表（不使用防抖，用于保存后刷新）
     */
    const fetchUserPartTimePagesImmediate = () => {
        loading.value = true
        fetchUserPartTimePages()
    }
    
    /**
     * 重置主列表筛选条件，清空输入框并重置下拉框为第一个选项
     */
    const handleReset = () => {
        // 清空输入框内容
        filters.userNo = ''
        filters.userName = ''
        
        // 重置部门下拉框为第一个未禁用的选项
        if (departmentList.value.length > 0) {
            const firstEnabledDept = findFirstEnabledDepartment(departmentList.value)
            if (firstEnabledDept) {
                filters.departmentId = firstEnabledDept
            } else {
                filters.departmentId = ''
            }
        } else {
            filters.departmentId = ''
        }
        
        // 重置分页到第一页并触发查询
        pagination.pageIndex = 1
        loading.value = true
        debouncedFetchUserPartTimePages()
    }

    /**
     * 处理主列表部门下拉框变化，重新触发查询
     */
    const handleDepartmentChange = () => {
        handleSearch()
    }

    /**
     * 处理主列表页码变化
     * @param {number} page 新页码
     */
    const handlePageChange = (page) => {
        loading.value = true // 显示加载状态
        pagination.pageIndex = page
        fetchUserPartTimePages()
    }
  
    /**
     * 处理主列表每页记录数变化
     * @param {number} size 新的每页条数
     */
    const handleSizeChange = (size) => {
        loading.value = true // 显示加载状态
        pagination.pageSize = size
        pagination.pageIndex = 1
        fetchUserPartTimePages()
    }
    
    /**
     * 部门树选择器过滤方法
     * @param {string} value 输入值
     * @param {object} data 节点数据
     * @returns {boolean} 是否匹配
     */
    const filterNodeMethod = (value, data) => {
        if (!value) return true
        return data.departmentName && data.departmentName.toLowerCase().includes(value.toLowerCase())
    }
    
    /**
     * 打开新增模式：初始化对话框表单、搜索与分页，并加载数据
     * @returns {Promise<void>}
     */
    const handleAdd = async () => {
        // 重置通用表单
        Object.assign(dialogForm, {
            userId: '',
            old_UserId: '',
            old_PartTimeDeptId: '',
            old_PartTimePositionId: '',
            old_PartTimeLaborId: '',
            partTimeDeptId: '',
            partTimePositionId: '',
            partTimeLaborId: '',
            startTime: '',
            endTime: '',
            userNo: '',
            userName: '',
            departmentName: '',
            positionName: '',
            laborName: ''
        })

        // 重置搜索条件
        Object.assign(dialogUserFilters, {
            departmentId: '',
            userNo: '',
            userName: ''
        })

        // 设置用户搜索部门默认值
        if (departmentList.value.length > 0) {
            const firstEnabledDept = findFirstEnabledDepartment(departmentList.value)
            if (firstEnabledDept) {
                dialogUserFilters.departmentId = firstEnabledDept
            }
        }

        // 重置分页
        Object.assign(dialogUserPagination, {
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0
        })

        // 清空列表与选择
        dialogUserList.value = []
        selectedDialogUsers.value = []

        // 加载下拉数据
        await fetchDepartmentList(false, false)
        await fetchPositionList(false)
        await fetchLaborList(false)

        // 设置默认值
        if (departmentList.value.length > 0) {
            const firstEnabledDept = findFirstEnabledDepartment(departmentList.value)
            if (firstEnabledDept) {
                dialogForm.partTimeDeptId = firstEnabledDept
            }
        }
        if (positionList.value.length > 0) {
            const firstEnabledPosition = positionList.value.find(item => !item.disabled)
            if (firstEnabledPosition) {
                dialogForm.partTimePositionId = firstEnabledPosition.positionId
            }
        }
        if (laborList.value.length > 0) {
            const firstEnabledLabor = laborList.value.find(item => !item.disabled)
            if (firstEnabledLabor) {
                dialogForm.partTimeLaborId = firstEnabledLabor.laborId
            }
        }

        // 打开对话框并加载列表
        isEditMode.value = false
        dialogVisible.value = true
        await nextTick()
        await fetchDialogUserPages()
    }
    
    /**
     * 对话框用户列表查询的防抖函数
     */
    const debouncedFetchDialogUserPages = debounce(() => {
        fetchDialogUserPages()
    }, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

    /**
     * 处理对话框用户搜索（使用防抖）
     */
    const handleDialogUserSearch = () => {
        dialogUserPagination.pageIndex = 1
        dialogUserLoading.value = true
        debouncedFetchDialogUserPages()
    }

    /**
     * 处理对话框表单部门变化
     * 新增模式加载默认职位/工种，编辑模式保持现有选择
     */
    const handleDialogDeptChange = () => {
        dialogForm.partTimePositionId = ''
        dialogForm.partTimeLaborId = ''
        if (isEditMode.value) {
            fetchPositionList(false)
            fetchLaborList(false)
        } else {
            fetchPositionList(true)
            fetchLaborList(true)
        }
    }
    
    /**
     * 重置对话框用户搜索条件，并重新查询
     */
    const handleDialogUserReset = () => {
        Object.assign(dialogUserFilters, {
            userNo: '',
            userName: ''
        })
        dialogUserPagination.pageIndex = 1
        dialogUserLoading.value = true
        debouncedFetchDialogUserPages()
    }
    
    /**
     * 处理对话框用户分页页码变化
     * @param {number} page 新页码
     */
    const handleDialogUserPageChange = (page) => {
        dialogUserPagination.pageIndex = page
        fetchDialogUserPages()
    }

    /**
     * 处理对话框用户每页大小变化
     * @param {number} size 新的每页条数
     */
    const handleDialogUserSizeChange = (size) => {
        dialogUserPagination.pageSize = size
        dialogUserPagination.pageIndex = 1
        fetchDialogUserPages()
    }

    /**
     * 处理对话框用户选择变化（单选）
     * @param {Array} selection 当前选中的用户列表
     */
    const handleDialogUserSelectionChange = (selection) => {
        selectedDialogUsers.value = selection
        dialogForm.userId = selection.length > 0 ? selection[0].userId : ''
    }
    
    /**
     * 获取对话框用户列表数据
     * @returns {Promise<void>}
     */
    const fetchDialogUserPages = async () => {
        dialogUserLoading.value = true
        try {
            const params = {
                departmentId: dialogUserFilters.departmentId,
                userNo: dialogUserFilters.userNo,
                userName: dialogUserFilters.userName,
                pageIndex: dialogUserPagination.pageIndex,
                pageSize: dialogUserPagination.pageSize,
                totalCount: dialogUserPagination.totalCount
            }
            const res = await post(GET_USER_PARTTIMEVIEW_API.GET_USER_PARTTIMEVIEW, params)
            if (res && res.code === 200) {
                dialogUserList.value = res.data || []
                dialogUserPagination.totalCount = res.totalCount || 0
            } else {
                dialogUserList.value = []
                ElMessage({
                    message: res.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            dialogUserList.value = []
            ElMessage({
                message: t('systembasicmgmt.userPartTime.getUserFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        } finally {
            dialogUserLoading.value = false
        }
    }
    
    // 以下编辑对话框专用方法已合并至通用方法（handleDialogUserSearch/Reset/PageChange/SizeChange/SelectionChange）
    
    /**
     * 提交对话框（支持新增与编辑模式）
     * @returns {Promise<void>}
     */
    const handleDialogSubmit = async () => {
        // 检查用户选择
        if (!dialogForm.userId) {
            ElMessage({
                message: t('systembasicmgmt.userPartTime.pleaseSelectUser'),
                type: 'warning',
                plain: true,
                showClose: true
            })
            return
        }

        // 验证表单
        if (!dialogFormRef.value) return
        try {
            await dialogFormRef.value.validate()
        } catch (error) {
            return
        }

        dialogSubmitLoading.value = true

        let res
        if (isEditMode.value) {
            const params = {
                Old_UserId: dialogForm.old_UserId,
                userId: dialogForm.userId,
                partTimeDeptId: dialogForm.partTimeDeptId,
                partTimePositionId: dialogForm.partTimePositionId,
                partTimeLaborId: dialogForm.partTimeLaborId,
                old_PartTimeDeptId: dialogForm.old_PartTimeDeptId,
                old_PartTimePositionId: dialogForm.old_PartTimePositionId,
                old_PartTimeLaborId: dialogForm.old_PartTimeLaborId,
                startTime: dialogForm.startTime,
                endTime: dialogForm.endTime
            }
            res = await post(UPDATE_USER_PARTTIME_API.UPDATE_USER_PARTTIME, params)
        } else {
            const params = {
                userId: dialogForm.userId,
                partTimeDeptId: dialogForm.partTimeDeptId,
                partTimePositionId: dialogForm.partTimePositionId,
                partTimeLaborId: dialogForm.partTimeLaborId,
                startTime: dialogForm.startTime,
                endTime: dialogForm.endTime
            }
            res = await post(INSERT_USER_PARTTIME_API.INSERT_USER_PARTTIME, params)
        }

        if (res && res.code === 200) {
            ElMessage({
                message: res.message,
                type: 'success',
                plain: true,
                showClose: true
            })
            dialogVisible.value = false
            await fetchUserPartTimePages()
        } else {
            ElMessage({
                message: res.message,
                type: 'error',
                plain: true,
                showClose: true
            })
        }
        dialogSubmitLoading.value = false
    }
    
    /**
     * 打开编辑模式并加载当前记录详情
     * @param {number} index 表格行索引
     * @param {object} row 当前行数据
     * @returns {Promise<void>}
     */
    const handleEdit = async (index, row) => {
        try {
            // 先获取下拉列表数据
            await fetchDepartmentList(false, false)
            await fetchPositionList(false)
            await fetchLaborList(false)
            
            // 调用获取兼任实体接口
            const params = {
                userId: row.userId,
                old_PartTimeDeptId: row.partTimeDeptId,
                old_PartTimePositionId: row.partTimePositionId,
                old_PartTimeLaborId: row.partTimeLaborId
            }
            
            const res = await post(GET_USER_PARTTIMEENTITY_API.GET_USER_PARTTIMEENTITY, params)
            
            if (res && res.code === 200 && res.data) {
                // 填充通用表单为编辑模式数据
                dialogForm.userId = ''
                dialogForm.old_UserId = res.data.userId
                dialogForm.old_PartTimeDeptId = res.data.partTimeDeptId
                dialogForm.old_PartTimePositionId = res.data.partTimePositionId
                dialogForm.old_PartTimeLaborId = res.data.partTimeLaborId
                dialogForm.partTimeDeptId = res.data.partTimeDeptId
                dialogForm.partTimePositionId = res.data.partTimePositionId
                dialogForm.partTimeLaborId = res.data.partTimeLaborId
                // 处理时间格式，确保与日期选择器兼容
                dialogForm.startTime = res.data.startTime ? new Date(res.data.startTime).toISOString().slice(0, 19).replace('T', ' ') : ''
                dialogForm.endTime = res.data.endTime ? new Date(res.data.endTime).toISOString().slice(0, 19).replace('T', ' ') : ''
                
                // 检查并设置部门默认值
                if (!dialogForm.partTimeDeptId && departmentList.value.length > 0) {
                    const firstEnabledDept = findFirstEnabledDepartment(departmentList.value)
                    if (firstEnabledDept) {
                        dialogForm.partTimeDeptId = firstEnabledDept
                    }
                }
                
                // 检查并设置职位默认值
                if (!dialogForm.partTimePositionId && positionList.value.length > 0) {
                    const firstEnabledPosition = positionList.value.find(item => !item.disabled)
                    if (firstEnabledPosition) {
                        dialogForm.partTimePositionId = firstEnabledPosition.positionId
                    }
                }
                
                // 检查并设置工种默认值
                if (!dialogForm.partTimeLaborId && laborList.value.length > 0) {
                    const firstEnabledLabor = laborList.value.find(item => !item.disabled)
                    if (firstEnabledLabor) {
                        dialogForm.partTimeLaborId = firstEnabledLabor.laborId
                    }
                }
                
                // 填充用户信息
                dialogForm.userNo = row.userNo
                dialogForm.userName = row.userName
                dialogForm.departmentName = row.departmentName
                dialogForm.positionName = row.positionName
                dialogForm.laborName = row.laborName
                
                // 初始化编辑对话框的用户搜索条件和分页
                // 自动填充当前编辑用户的工号、姓名到筛选条件（不需要绑定部门ID到下拉框）
                Object.assign(dialogUserFilters, {
                    userNo: row.userNo,
                    userName: row.userName
                })
                Object.assign(dialogUserPagination, {
                    pageIndex: 1,
                    pageSize: 10,
                    totalCount: 0
                })
                
                // 打开通用对话框（编辑模式）
                isEditMode.value = true
                dialogVisible.value = true
                
                // 等待对话框打开后再获取用户列表数据
                await nextTick()
                await fetchDialogUserPages()
            } else {
                ElMessage({
                    message: res.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            console.error('获取兼任实体失败:', error)
            ElMessage({
                message: t('systembasicmgmt.userPartTime.getPartTimeDetailFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
    
    // 编辑提交逻辑已合并至 handleDialogSubmit
    
    /**
     * 删除员工兼任记录
     * @param {number} index 表格行索引
     * @param {object} row 当前行数据
     * @returns {Promise<void>}
     */
    const handleDelete = async (index, row) => {
        try {
            await ElMessageBox.confirm(
                t('systembasicmgmt.userPartTime.deletePartTimeConfirm'),
                t('common.tip'),
                {
                    confirmButtonText: t('common.confirm'),
                    cancelButtonText: t('common.cancel'),
                    type: 'warning'
                }
            )
            
            // 根据需求文档构建删除参数
            const deleteParams = {
                Old_UserId: row.userId,
                old_PartTimeDeptId: row.partTimeDeptId,
                old_PartTimePositionId: row.partTimePositionId,
                old_PartTimeLaborId: row.partTimeLaborId
            }
            
            const res = await post(DELETE_USER_PARTTIME_API.DELETE_USER_PARTTIME, deleteParams)
            
            if (res && res.code === 200) {
                ElMessage({
                    message: t('systembasicmgmt.userPartTime.deletePartTimeSuccess'),
                    type: 'success',
                    plain: true,
                    showClose: true
                })
                // 删除成功后刷新列表
                await fetchUserPartTimePages()
            } else {
                ElMessage({
                    message: res.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            if (error !== 'cancel') {
                ElMessage({
                    message: t('systembasicmgmt.userPartTime.deletePartTimeFailed'),
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
  
  
