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
                        clearable
                        :filter-node-method="filterNodeMethod"
                        style="width: 200px;"
                        :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseSelectDepartment')" />
                </el-form-item>
                <el-form-item :label="$t('SystemBasicMgmt.userPartTime.userNo')">
                    <el-input 
                        v-model="filters.userNo"
                        style="width: 200px;"
                        :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseEnterUserNo')"
                        clearable />
                </el-form-item>
                <el-form-item :label="$t('SystemBasicMgmt.userPartTime.userName')">
                    <el-input 
                        v-model="filters.userName"
                        style="width: 200px;"
                        :placeholder="$t('SystemBasicMgmt.userPartTime.pleaseEnterUserName')"
                        clearable />
                </el-form-item>

                <el-form-item class="form-button-group">
                    <el-button type="primary" @click="handleSearch" plain>
                        {{ $t('common.search') }}
                    </el-button>
                    <el-button @click="handleReset" plain>
                        {{ $t('common.reset') }}
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
                    <el-table-column prop="userNo" :label="$t('SystemBasicMgmt.userPartTime.userNo')" align="center" min-width="120" />
                    <el-table-column prop="userName" :label="$t('SystemBasicMgmt.userPartTime.userName')" align="left" min-width="120" />
                    <el-table-column :label="$t('SystemBasicMgmt.userPartTime.isApproval')" align="center" min-width="100">
                        <template #default="scope">
                            <el-tag :type="scope.row.IsApproval === '1' ? 'primary' : 'info'">
                                {{ scope.row.isApprovalName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="departmentName" :label="$t('SystemBasicMgmt.userPartTime.department')" align="left" min-width="150" />
                    <el-table-column prop="positionName" :label="$t('SystemBasicMgmt.userPartTime.position')" align="left" min-width="120" />
                    <el-table-column :label="$t('SystemBasicMgmt.userPartTime.isPartTime')" align="center" min-width="100">
                        <template #default="scope">
                            <el-tag :type="scope.row.isPartTime === '1' ? 'primary' : 'info'">
                                {{ scope.row.isPartTimeName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="partTimeDeptName" :label="$t('SystemBasicMgmt.userPartTime.partTimeDepartment')" align="left" min-width="150" />
                    <el-table-column prop="partTimePositionName" :label="$t('SystemBasicMgmt.userPartTime.partTimePosition')" align="left" min-width="120" />
                    <el-table-column prop="startTime" :label="$t('SystemBasicMgmt.userPartTime.startTime')" align="center" min-width="150" />
                    <el-table-column prop="endTime" :label="$t('SystemBasicMgmt.userPartTime.endTime')" align="center" min-width="150" />
                    <el-table-column :label="$t('SystemBasicMgmt.userPartTime.operation')" min-width="120" fixed="right" align="center">
                        <template #default="scope">
                            <el-button size="small"
                                       type="danger"
                                       @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
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
    </div>
</template>
  
<script setup>
    import { ref, reactive, onMounted } from 'vue'
    import { post } from '@/utils/request'
    import { 
        GET_USER_PARTTIME_PAGES_API,
        DELETE_USER_PARTTIME_API
    } from '@/config/api/SystemBasicMgmt/System-Mgmt/userparttime'
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
  
    // 在组件挂载后获取数据
    onMounted(async () => {
        // 获取部门下拉列表，并默认选中第一个部门
        await fetchDepartmentList(true)
        // 获取员工兼任列表数据
        await fetchUserPartTimePages()
    })
    
    // 获取部门下拉列表
    const fetchDepartmentList = async (setDefaultFilter = false) => {
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
  
    // 处理搜索操作
    const handleSearch = () => {
        pagination.pageIndex = 1
        fetchUserPartTimePages()
    }
  
    // 重置搜索条件
    const handleReset = () => {
        Object.assign(filters, {
            departmentId: '',
            userNo: '',
            userName: ''
        })
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
    
    // 处理删除操作
    const handleDelete = async (index, row) => {
        try {
            await ElMessageBox.confirm(
                t('SystemBasicMgmt.userPartTime.deleteConfirm'),
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
                    message: t('SystemBasicMgmt.userPartTime.deleteSuccess'),
                    type: 'success',
                    plain: true,
                    showClose: true
                })
                // 删除成功后刷新列表
                await fetchUserPartTimePages()
            } else {
                ElMessage({
                    message: res.message || t('SystemBasicMgmt.userPartTime.deleteFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            if (error !== 'cancel') {
                ElMessage({
                    message: t('SystemBasicMgmt.userPartTime.deleteFailed'),
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
</style>
  
  
