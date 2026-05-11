<template>
    <div>
    <el-config-provider :locale="elementPlusLocale">
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
                        @change="handleDepartmentChange"
                        style="width: 190px;"
                        popper-class="main-dept-filter-popper"
                        :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectDepartment')" />
                </el-form-item>
                <el-form-item :label="$t('systembasicmgmt.userPartTime.userNo')">
                    <el-input 
                        v-model="filters.userNo"
                        style="width: 150px;"
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
                    <el-table-column prop="userName" :label="$t('systembasicmgmt.userPartTime.name')" align="left" min-width="170" />
                    <el-table-column :label="$t('systembasicmgmt.userPartTime.isReview')" align="center" min-width="110">
                        <template #default="scope">
                            <el-tag :type="scope.row.isReview === '1' ? 'primary' : 'info'">
                                {{ getIsReviewText(scope.row.isReview) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userPartTime.department')" align="left" min-width="270" />
                    <el-table-column prop="positionName" :label="$t('systembasicmgmt.userPartTime.position')" align="left" min-width="150" />
                    <el-table-column prop="partTimeDeptName" :label="$t('systembasicmgmt.userPartTime.partTimeDepartment')" align="left" min-width="270" />
                    <el-table-column prop="partTimePositionName" :label="$t('systembasicmgmt.userPartTime.partTimePosition')" align="left" min-width="150" />
                    <el-table-column prop="startTime" :label="$t('systembasicmgmt.userPartTime.startTime')" align="center" min-width="220" :formatter="(row, col, val) => formatDateTime(val)" />
                    <el-table-column prop="endTime" :label="$t('systembasicmgmt.userPartTime.endTime')" align="center" min-width="220" :formatter="(row, col, val) => formatDateTime(val)" />
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
                   :lock-scroll="true"
                   class="parttime-dialog"
                   @close="handleDialogClose">
            <div style="height: 560px;">
                <!-- 兼任信息区域 -->
                <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogFormRules" label-width="auto" style="padding: 12px 16px 0;">
                    <div style="display:flex; align-items:center; gap:24px; margin-bottom:14px;">
                        <el-form-item :label="$t('systembasicmgmt.userPartTime.partTimeDepartment')" prop="partTimeDeptId" style="margin-bottom:0;">
                            <el-tree-select
                                v-model="dialogForm.partTimeDeptId"
                                :data="departmentList || []"
                                :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                                check-strictly
                                filterable
                                @change="handleDialogDeptChange"
                                :filter-node-method="filterNodeMethod"
                                style="width: 210px;"
                                popper-class="main-dept-filter-popper"
                                :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectPartTimeDepartment')" />
                        </el-form-item>
                        <el-form-item :label="$t('systembasicmgmt.userPartTime.partTimePosition')" prop="partTimePositionId" style="margin-bottom:0;">
                            <el-select v-model="dialogForm.partTimePositionId" :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectPartTimePosition')" style="width: 210px;">
                                <el-option v-for="item in positionList" :key="item.positionId" :label="item.positionName" :value="item.positionId" />
                            </el-select>
                        </el-form-item>
                    </div>
                    <div style="display:flex; align-items:center; gap:24px; margin-bottom:10px;">
                        <el-form-item :label="$t('systembasicmgmt.userPartTime.startTime')" prop="startTime" style="margin-bottom:0;">
                            <el-date-picker
                                v-model="dialogForm.startTime"
                                type="datetime"
                                :clearable="false"
                                :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectStartTime')"
                                :disabled-date="(date) => dialogForm.endTime && date > new Date(dialogForm.endTime)"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                style="width: 210px;" />
                        </el-form-item>
                        <el-form-item :label="$t('systembasicmgmt.userPartTime.endTime')" prop="endTime" style="margin-bottom:0;">
                            <el-date-picker
                                v-model="dialogForm.endTime"
                                type="datetime"
                                :clearable="false"
                                :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectEndTime')"
                                :disabled-date="(date) => dialogForm.startTime && date < new Date(dialogForm.startTime)"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                style="width: 210px;" />
                        </el-form-item>
                    </div>
                </el-form>

                <!-- 分隔线 -->
                <el-divider style="margin: 25px 0 8px;"></el-divider>

                <!-- 搜索区域 -->
                <el-form :inline="true" :model="dialogUserFilters" class="conventional-filter-form" style="margin-top: 10px;">
                    <el-form-item :label="$t('systembasicmgmt.userPartTime.department')">
                        <el-tree-select
                            v-model="dialogUserFilters.departmentId"
                            :data="departmentList || []"
                            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                            check-strictly
                            filterable
                            @change="handleDialogDeptFilterChange"
                            :filter-node-method="filterNodeMethod"
                            style="width: 210px;"
                            popper-class="main-dept-filter-popper"
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
                    <el-form-item>
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
                          ref="dialogUserTableRef"
                          @selection-change="handleDialogUserSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column prop="userNo" :label="$t('systembasicmgmt.userPartTime.userNo')" align="left" min-width="100" />
                    <el-table-column prop="userName" :label="$t('systembasicmgmt.userPartTime.name')" align="left" min-width="160" />
                    <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userPartTime.department')" align="left" min-width="240" />
                    <el-table-column prop="positionName" :label="$t('systembasicmgmt.userPartTime.position')" align="left" min-width="100" />
                    <el-table-column prop="laborName" :label="$t('systembasicmgmt.userPartTime.labor')" align="left" min-width="240" />
                    <el-table-column :label="$t('systembasicmgmt.userPartTime.isReview')" align="center" min-width="100">
                        <template #default="scope">
                            <el-tag :type="scope.row.isReview === '1' ? 'primary' : 'info'">
                                {{ getIsReviewText(scope.row.isReview) }}
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
                <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
                <el-button
                  type="primary"
                  @click="handleDialogSubmit"
                  :loading="dialogSubmitLoading"
                  :disabled="!dialogForm.userId || dialogSubmitLoading"
                >
                  {{ $t('common.confirm') }}
                </el-button>
            </template>
        </el-dialog>
    </div>
    </el-config-provider>
    </div>
</template>
  
<script setup>
    import { ref, reactive, computed, onMounted, nextTick } from 'vue'
    import { post } from '@/utils/request'
    import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
    import en from 'element-plus/dist/locale/en.mjs'
    import { 
        GET_USER_PARTTIME_PAGES_API,
        DELETE_USER_PARTTIME_API,
        GET_USER_PARTTIMEVIEW_API,
        INSERT_USER_PARTTIME_API,
        GET_USER_PARTTIMEENTITY_API,
        UPDATE_USER_PARTTIME_API,
        GET_POSITION_DROPDOWN_API,
        GET_DEPARTMENT_DROPDOWN_API
    } from '@/config/api/systembasicmgmt/user-settings/userparttime'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useI18n } from 'vue-i18n'

    const { t, locale } = useI18n()

    /** 与 vue-i18n 一致，保证分页、日期时间面板等 Element Plus 内置文案随语言切换 */
    const elementPlusLocale = computed(() => (locale.value === 'en-US' ? en : zhCn))

    const DEBOUNCE_MS = 300
    let searchTimer = null
    let dialogSearchTimer = null

    const formatDateTime = (val) => {
        if (!val) return ''
        const d = new Date(val)
        if (isNaN(d.getTime())) return val
        const pad = (n) => String(n).padStart(2, '0')
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }

    const getIsReviewText = (val) => {
        if (val === '1' || val === 1) return t('common.yes')
        if (val === '0' || val === 0) return t('common.no')
        return ''
    }
  
    const userPartTimeList = ref([])
    const loading = ref(false)
    
    const departmentList = ref([])
    
    const dialogVisible = ref(false)
    const isEditMode = ref(false)
    const dialogSubmitLoading = ref(false)
    const dialogFormRef = ref(null)
    
    const positionList = ref([])
    
    const dialogUserList = ref([])
    const dialogUserLoading = ref(false)
    const selectedDialogUsers = ref([])
    const dialogUserTableRef = ref(null)
  
    const pagination = reactive({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
    })
  
    const filters = reactive({
        departmentId: '',
        userNo: '',
        userName: ''
    })
    
    const dialogForm = reactive({
        userId: '',
        old_UserId: '',
        old_PartTimeDeptId: '',
        old_PartTimePositionId: '',
        partTimeDeptId: '',
        partTimePositionId: '',
        startTime: '',
        endTime: '',
        userNo: '',
        userName: '',
        departmentName: '',
        positionName: '',
        laborName: ''
    })
    
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
    
    const dialogFormRules = computed(() => ({
        partTimeDeptId: [
            { required: true, message: t('systembasicmgmt.userPartTime.partTimeDepartmentRequired'), trigger: 'change' }
        ],
        partTimePositionId: [
            { required: true, message: t('systembasicmgmt.userPartTime.partTimePositionRequired'), trigger: 'change' }
        ],
        startTime: [
            { required: true, message: t('systembasicmgmt.userPartTime.startTimeRequired'), trigger: 'change' }
        ],
        endTime: [
            { required: true, message: t('systembasicmgmt.userPartTime.endTimeRequired'), trigger: 'change' }
        ]
    }))
  
    onMounted(async () => {
        await fetchDepartmentList(true)
        await fetchUserPartTimePages()
    })
    
    const findFirstEnabledDepartment = (departments) => {
        for (const dept of departments) {
            if (!dept.disabled) {
                return dept.departmentId
            }
            if (dept.departmentChildList && Array.isArray(dept.departmentChildList) && dept.departmentChildList.length > 0) {
                const childResult = findFirstEnabledDepartment(dept.departmentChildList)
                if (childResult) {
                    return childResult
                }
            }
        }
        return null
    }

    const scheduleSearch = () => {
        clearTimeout(searchTimer)
        searchTimer = setTimeout(() => {
            pagination.pageIndex = 1
            fetchUserPartTimePages()
        }, DEBOUNCE_MS)
    }

    const scheduleDialogSearch = () => {
        clearTimeout(dialogSearchTimer)
        dialogSearchTimer = setTimeout(() => {
            dialogUserPagination.pageIndex = 1
            fetchDialogUserPages()
        }, DEBOUNCE_MS)
    }
    
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
                
                if (setDefaultFilter && departmentList.value.length > 0 && !filters.departmentId) {
                    const firstEnabledDept = findFirstEnabledDepartment(departmentList.value)
                    if (firstEnabledDept) {
                        filters.departmentId = firstEnabledDept
                    }
                }
                
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
    
    const fetchPositionList = async (setDefaultForm = false) => {
        try {
            const res = await post(GET_POSITION_DROPDOWN_API.GET_POSITION_DROPDOWN, {})
            
            if (res && res.code === 200) {
                positionList.value = Array.isArray(res.data) ? res.data : []
                
                positionList.value = positionList.value.filter(item => 
                    item && item.positionId !== undefined && item.positionId !== null && 
                    item.positionName !== undefined && item.positionName !== null
                )
                
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
                const mapRow = (row) => ({
                    ...row,
                    isReview: (() => {
                        const v = row.isReview ?? row.isApproval ?? row.IsApproval
                        return v === '1' || v === 1 ? '1' : '0'
                    })()
                })
                userPartTimeList.value = (res.data || []).map(mapRow)
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

    const handleSearch = () => {
        scheduleSearch()
    }
    
    const handleReset = () => {
        filters.userNo = ''
        filters.userName = ''
        
        if (departmentList.value.length > 0) {
            const firstEnabledDept = findFirstEnabledDepartment(departmentList.value)
            filters.departmentId = firstEnabledDept ?? ''
        } else {
            filters.departmentId = ''
        }
        
        scheduleSearch()
    }

    const handleDepartmentChange = () => {
        handleSearch()
    }

    const handlePageChange = () => {
        fetchUserPartTimePages()
    }
  
    const handleSizeChange = () => {
        pagination.pageIndex = 1
        fetchUserPartTimePages()
    }
    
    const filterNodeMethod = (value, data) => {
        if (!value) return true
        return data.departmentName && data.departmentName.toLowerCase().includes(value.toLowerCase())
    }
    
    const handleAdd = async () => {
        Object.assign(dialogForm, {
            userId: '',
            old_UserId: '',
            old_PartTimeDeptId: '',
            old_PartTimePositionId: '',
            partTimeDeptId: '',
            partTimePositionId: '',
            startTime: '',
            endTime: '',
            userNo: '',
            userName: '',
            departmentName: '',
            positionName: '',
            laborName: ''
        })

        Object.assign(dialogUserFilters, {
            departmentId: '',
            userNo: '',
            userName: ''
        })

        if (departmentList.value.length > 0) {
            const firstEnabledDept = findFirstEnabledDepartment(departmentList.value)
            if (firstEnabledDept) {
                dialogUserFilters.departmentId = firstEnabledDept
            }
        }

        Object.assign(dialogUserPagination, {
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0
        })

        dialogUserList.value = []
        selectedDialogUsers.value = []

        await fetchDepartmentList(false, false)
        await fetchPositionList(false)

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

        isEditMode.value = false
        dialogVisible.value = true
        await nextTick()
        // 打开对话框后清除一次校验状态，避免保留上次必填错误提示
        if (dialogFormRef.value) {
            try {
                dialogFormRef.value.clearValidate()
            } catch {
                // ignore
            }
        }
        await fetchDialogUserPages()
    }

    const handleDialogUserSearch = () => {
        scheduleDialogSearch()
    }

    const handleDialogDeptFilterChange = () => {
        dialogUserFilters.userNo = ''
        dialogUserFilters.userName = ''
        scheduleDialogSearch()
    }

    const handleDialogDeptChange = () => {
        if (dialogFormRef.value) {
            try {
                dialogFormRef.value.clearValidate(['partTimeDeptId'])
            } catch {
                // ignore
            }
        }
    }
    
    const handleDialogUserReset = () => {
        Object.assign(dialogUserFilters, {
            userNo: '',
            userName: ''
        })
        scheduleDialogSearch()
    }
    
    const handleDialogUserPageChange = () => {
        fetchDialogUserPages()
    }

    const handleDialogUserSizeChange = () => {
        dialogUserPagination.pageIndex = 1
        fetchDialogUserPages()
    }

    const handleDialogUserSelectionChange = (selection) => {
        if (selection.length > 1 && dialogUserTableRef.value) {
            const latest = selection[selection.length - 1]
            dialogUserTableRef.value.clearSelection()
            dialogUserTableRef.value.toggleRowSelection(latest, true)
            selectedDialogUsers.value = [latest]
            dialogForm.userId = latest.userId ? String(latest.userId) : ''
        } else {
            selectedDialogUsers.value = selection
            dialogForm.userId = selection.length > 0 ? String(selection[0].userId) : ''
        }
    }
    
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
                const mapRow = (row) => ({
                    ...row,
                    isReview: (() => {
                        const v = row.isReview ?? row.isApproval ?? row.IsApproval
                        return v === '1' || v === 1 ? '1' : '0'
                    })()
                })
                dialogUserList.value = (res.data || []).map(mapRow)
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
    
    const handleDialogSubmit = async () => {
        if (!dialogForm.userId) {
            ElMessage({
                message: t('systembasicmgmt.userPartTime.pleaseSelectUser'),
                type: 'warning',
                plain: true,
                showClose: true
            })
            return
        }

        if (!dialogFormRef.value) return
        try {
            await dialogFormRef.value.validate()
        } catch (error) {
            return
        }

        dialogSubmitLoading.value = true
        const currentUserId = String(dialogForm.userId)

        const toDateTimePayload = (val) => {
            if (!val) return null
            if (typeof val === 'string') {
                const normalized = val.trim().replace(' ', 'T')
                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalized)) {
                    return `${normalized}:00`
                }
                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(normalized)) {
                    return normalized
                }
            }

            const d = new Date(val)
            if (isNaN(d.getTime())) return val
            const pad = (n) => String(n).padStart(2, '0')
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        }

        let res
        if (isEditMode.value) {
            const params = {
                Old_UserId: dialogForm.old_UserId,
                userId: currentUserId,
                partTimeDeptId: dialogForm.partTimeDeptId,
                partTimePositionId: dialogForm.partTimePositionId,
                old_PartTimeDeptId: dialogForm.old_PartTimeDeptId,
                old_PartTimePositionId: dialogForm.old_PartTimePositionId,
                startTime: toDateTimePayload(dialogForm.startTime),
                endTime: toDateTimePayload(dialogForm.endTime)
            }
            res = await post(UPDATE_USER_PARTTIME_API.UPDATE_USER_PARTTIME, params)
        } else {
            const params = {
                userId: currentUserId,
                partTimeDeptId: dialogForm.partTimeDeptId,
                partTimePositionId: dialogForm.partTimePositionId,
                startTime: toDateTimePayload(dialogForm.startTime),
                endTime: toDateTimePayload(dialogForm.endTime)
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
    
    const handleEdit = async (index, row) => {
        try {
            await fetchDepartmentList(false, false)
            await fetchPositionList(false)
            
            const params = {
                userId: row.userId,
                old_PartTimeDeptId: row.partTimeDeptId,
                old_PartTimePositionId: row.partTimePositionId
            }
            
            const res = await post(GET_USER_PARTTIMEENTITY_API.GET_USER_PARTTIMEENTITY, params)
            
            if (res && res.code === 200 && res.data) {
                dialogForm.userId = res.data.userId ? String(res.data.userId) : ''
                dialogForm.old_UserId = res.data.userId
                dialogForm.old_PartTimeDeptId = res.data.partTimeDeptId
                dialogForm.old_PartTimePositionId = res.data.partTimePositionId
                dialogForm.partTimeDeptId = res.data.partTimeDeptId
                dialogForm.partTimePositionId = res.data.partTimePositionId
                // 处理时间格式，确保与日期选择器兼容
                dialogForm.startTime = res.data.startTime ? new Date(res.data.startTime).toISOString().slice(0, 19).replace('T', ' ') : ''
                dialogForm.endTime = res.data.endTime ? new Date(res.data.endTime).toISOString().slice(0, 19).replace('T', ' ') : ''
                
                if (!dialogForm.partTimeDeptId && departmentList.value.length > 0) {
                    const firstEnabledDept = findFirstEnabledDepartment(departmentList.value)
                    if (firstEnabledDept) {
                        dialogForm.partTimeDeptId = firstEnabledDept
                    }
                }
                
                if (!dialogForm.partTimePositionId && positionList.value.length > 0) {
                    const firstEnabledPosition = positionList.value.find(item => !item.disabled)
                    if (firstEnabledPosition) {
                        dialogForm.partTimePositionId = firstEnabledPosition.positionId
                    }
                }
                
                dialogForm.userNo = row.userNo
                dialogForm.userName = row.userName
                dialogForm.departmentName = row.departmentName
                dialogForm.positionName = row.positionName
                dialogForm.laborName = row.laborName
                
                // 自动填充当前编辑用户的工号、姓名到筛选条件
                Object.assign(dialogUserFilters, {
                    userNo: row.userNo,
                    userName: row.userName
                })
                Object.assign(dialogUserPagination, {
                    pageIndex: 1,
                    pageSize: 10,
                    totalCount: 0
                })
                
                isEditMode.value = true
                dialogVisible.value = true
                
                await nextTick()
                // 编辑模式下同样清理一次校验状态，防止上次的必填/格式错误残留
                if (dialogFormRef.value) {
                    try {
                        dialogFormRef.value.clearValidate()
                    } catch {
                        // ignore
                    }
                }
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
            ElMessage({
                message: t('systembasicmgmt.userPartTime.getPartTimeDetailFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
    
    const handleDialogClose = () => {
        Object.assign(dialogForm, {
            userId: '', old_UserId: '', old_PartTimeDeptId: '', old_PartTimePositionId: '',
            partTimeDeptId: '', partTimePositionId: '', startTime: '', endTime: '',
            userNo: '', userName: '', departmentName: '', positionName: '', laborName: ''
        })
        dialogFormRef.value?.clearValidate()
    }
    
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
            
            const deleteParams = {
                Old_UserId: row.userId,
                old_PartTimeDeptId: row.partTimeDeptId,
                old_PartTimePositionId: row.partTimePositionId
            }
            
            const res = await post(DELETE_USER_PARTTIME_API.DELETE_USER_PARTTIME, deleteParams)
            
            if (res && res.code === 200) {
                ElMessage({
                    message: t('systembasicmgmt.userPartTime.deletePartTimeSuccess'),
                    type: 'success',
                    plain: true,
                    showClose: true
                })
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

<!-- 部门树下拉项加高、加宽（下拉挂载到 body，需单独样式） -->
<style>
  .main-dept-filter-popper {
    width: auto !important;
    min-width: 280px !important;
  }
  .main-dept-filter-popper .el-select-dropdown__wrap,
  .main-dept-filter-popper .el-scrollbar__view,
  .main-dept-filter-popper .el-tree {
    width: 100% !important;
    min-width: 100% !important;
  }
  .main-dept-filter-popper .el-tree-node__content {
    height: 36px;
    line-height: 36px;
    padding-left: 12px;
    width: 100% !important;
    min-width: 100% !important;
  }
</style>
