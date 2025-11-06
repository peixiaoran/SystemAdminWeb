<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">
            <!-- 搜索表单 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="部门搜索表单">
                <el-form-item :label="$t('systembasicmgmt.departmentInfo.filter.departmentCode')">
                    <el-input style="width: 180px;"
                              v-model="filters.departmentCode"
                              :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputCode')" />
                </el-form-item>
                <el-form-item :label="$t('systembasicmgmt.departmentInfo.filter.departmentName')">
                    <el-input style="width: 180px;"
                              v-model="filters.departmentName"
                              :placeholder="$t('systembasicmgmt.departmentInfo.pleaseInputName')" />
                </el-form-item>
                <el-form-item class="form-button-group">
                    <el-button type="primary" @click="handleSearch" plain>
                        {{ $t('common.search') }}
                    </el-button>
                    <el-button @click="handleReset">
                        {{ $t('common.reset') }}
                    </el-button>
                </el-form-item>
                <el-form-item class="form-right-button">
                    <el-button type="primary" @click="handleAdd">
                        {{ $t('systembasicmgmt.departmentInfo.addDepartment') }}
                    </el-button>
                </el-form-item>
            </el-form>
  
            <!-- 表格 -->
            <div class="table-container">
                <el-table :data="departmentList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          v-loading="loading"
                          class="conventional-table"
                          row-key="departmentId"
                          :default-expand-all="true"
                          :tree-props="{ children: 'departmentChildList', hasChildren: 'hasChildren' }">
                        <el-table-column type="index" :label="$t('systembasicmgmt.departmentInfo.index')" width="70" align="center" fixed />
                        <el-table-column prop="departmentCode" :label="$t('systembasicmgmt.departmentInfo.departmentCode')" align="left" min-width="210" />
                        <el-table-column prop="departmentNameCn" :label="$t('systembasicmgmt.departmentInfo.departmentNameCn')" align="left" min-width="200" />
                        <el-table-column prop="departmentNameEn" :label="$t('systembasicmgmt.departmentInfo.departmentNameEn')" align="left" min-width="280" />
                        <el-table-column prop="departmentLevelName" :label="$t('systembasicmgmt.departmentInfo.departmentLevelName')" align="center" min-width="200" />
                        <el-table-column prop="isEnabled" :label="$t('systembasicmgmt.departmentInfo.isEnabled')" align="center" min-width="95">
                            <template #default="scope">
                                <el-tag :type="scope.row.isEnabled === 1 ? 'success' : 'danger'">
                                    {{ scope.row.isEnabled === 1 ? $t('systembasicmgmt.departmentInfo.active') : $t('systembasicmgmt.departmentInfo.inactive') }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="landline" :label="$t('systembasicmgmt.departmentInfo.landline')" align="center" min-width="170" />
                        <el-table-column prop="email" :label="$t('systembasicmgmt.departmentInfo.email')" align="left" min-width="230" />
                        <el-table-column prop="description" :label="$t('systembasicmgmt.departmentInfo.description')" align="left" min-width="230" />
                        <el-table-column :label="$t('systembasicmgmt.departmentInfo.operation')" min-width="300" fixed="right" align="center">
                            <template #default="scope">
                                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
                                <el-button size="small" type="success" @click="handleAddChild(scope.$index, scope.row)">{{ $t('systembasicmgmt.departmentInfo.addChild') }}</el-button>
                                <el-button size="small"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
        </el-card>
  
        <!-- 编辑对话框 -->
        <el-dialog v-model="dialogVisible"
                   :title="dialogTitle"
                   width="55%"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true"
                   @close="handleDialogClose">
            <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="部门编辑表单">
                <div class="form-row">
                    <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentCode')" prop="departmentCode">
                        <el-input v-model="editForm.departmentCode" style="width:100%" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.departmentInfo.sortOrder')" prop="sortOrder">
                        <el-input-number v-model="editForm.sortOrder" :min="1" style="width:60%" />
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentNameCn')" prop="departmentNameCn">
                        <el-input v-model="editForm.departmentNameCn" style="width:100%" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentNameEn')" prop="departmentNameEn">
                        <el-input v-model="editForm.departmentNameEn" style="width:100%" />
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item :label="$t('systembasicmgmt.departmentInfo.landline')" prop="landline">
                        <el-input v-model="editForm.landline" style="width:100%" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.departmentInfo.email')" prop="email">
                        <el-input v-model="editForm.email" style="width:100%" />
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item :label="$t('systembasicmgmt.departmentInfo.parentDepartment')" prop="parentDepartmentId">
                        <el-tree-select
                          v-model="editForm.parentId"
                          :data="departmentOptionsWithNone || []"
                          :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                          check-strictly
                          filterable
                          :filter-node-method="filterNodeMethod"
                          style="width: 100%;"
                          :placeholder="$t('systembasicmgmt.departmentInfo.pleaseSelectParentDepartment')" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.departmentInfo.departmentLevel')" prop="departmentLevelId">
                        <el-select v-model="editForm.departmentLevelId" style="width:100%" :placeholder="$t('systembasicmgmt.departmentInfo.pleaseSelectDepartmentLevel')">
                            <el-option
                              v-for="item in departmentLevelOptions"
                              :key="item.departmentLevelId"
                              :label="item.departmentLevelName"
                              :value="item.departmentLevelId" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item :label="$t('systembasicmgmt.departmentInfo.isEnabled')" prop="isEnabled">
                        <el-switch
                          v-model="editForm.isEnabled"
                          :active-value="1"
                          :inactive-value="0"
                          :active-text="$t('common.yes')"
                          :inactive-text="$t('common.no')"
                          inline-prompt
                          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                    </el-form-item>
                    <el-form-item></el-form-item>
                </div>
                <div class="form-row full-width">
                    <el-form-item :label="$t('systembasicmgmt.departmentInfo.description')" prop="description">
                        <el-input v-model="editForm.description" type="textarea" :rows="3" style="width:100%" />
                    </el-form-item>
                </div>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted, nextTick, computed } from 'vue'
    import { post } from '@/utils/request'
    import { 
    GET_DEPARTMENT_TREE_API, 
    GET_DEPARTMENT_ENTITY_API, 
    INSERT_DEPARTMENT_API, 
    DELETE_DEPARTMENT_API, 
    UPDATE_DEPARTMENT_API,
    GET_DEPARTMENTLEVEL_DROPDOWN_API,
    GET_DEPARTMENT_TREE_DROPDOWN_API 
} from '@/config/api/systembasicmgmt/system-basicdata/department'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useI18n } from 'vue-i18n'
    import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'

    // 初始化i18n
    const { t } = useI18n()

    // 部门数据
    const departmentList = ref([])
    const loading = ref(false)

    // 过滤条件
    const filters = reactive({
        departmentCode: '',
        departmentName: ''
    })

    // 对话框显示状态
    const dialogVisible = ref(false)

    // 表单引用
    const editFormRef = ref(null)

    // 编辑表单
    const editForm = reactive({
        departmentId: '',
        departmentCode: '',
        departmentNameCn: '',
        departmentNameEn: '',
        parentId: '',
        departmentLevelId: '',
        description: '',
        sortOrder: 1,
        landline: '',
        email: '',
        address: '',
        isEnabled: 1
    })

    // 表单验证规则
    const formRules = reactive({
        departmentCode: [
            { required: true, message: () => t('systembasicmgmt.departmentInfo.pleaseInputCode'), trigger: 'blur' }
        ],
        departmentNameCn: [
            { required: true, message: () => t('systembasicmgmt.departmentInfo.pleaseInputNameCn'), trigger: 'blur' }
        ],
        departmentNameEn: [
            { required: true, message: () => t('systembasicmgmt.departmentInfo.pleaseInputNameEn'), trigger: 'blur' }
        ],
        departmentLevelId: [
            // 说明：将触发从 change 改为 blur，避免点击“新增”时初始值变更导致立即校验弹出
            { required: true, message: () => t('systembasicmgmt.departmentInfo.pleaseSelectLevel'), trigger: 'blur' }
        ]
    })

    // 对话框标题
    const dialogTitle = ref('')

    // 是否为编辑模式
    const isEdit = ref(false)

    // 提交加载状态
    const submitLoading = ref(false)

    // 部门选项（用于父部门选择）
    const departmentOptions = ref([])
    
    // 包含"顶级部门"选项的部门数据
    const departmentOptionsWithNone = computed(() => {
      const options = [...departmentOptions.value]
      // 添加"顶级部门"选项，departmentId为0
      options.unshift({
        departmentId: '0',
        departmentName: t('systembasicmgmt.departmentInfo.topLevel'),
        departmentChildList: []
      })
      return options
    })

    // 部门级别选项
    const departmentLevelOptions = ref([])

    // 获取部门树形数据
    const getDepartmentTree = async () => {
        try {
            loading.value = true
            const params = {
                departmentCode: filters.departmentCode,
                departmentName: filters.departmentName
            }
            
            const response = await post(GET_DEPARTMENT_TREE_API.GET_DEPARTMENT_TREE, params)
            if (response.code === 200) {
                departmentList.value = response.data || []
            } else {
                ElMessage({
                    message: response.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
                departmentList.value = []
            }
        } catch (error) {
            console.error('获取部门树形数据失败:', error)
            ElMessage({
                message: t('systembasicmgmt.departmentInfo.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
            departmentList.value = []
        } finally {
            loading.value = false
        }
    }

    // 防抖获取部门数据
    const debouncedGetDepartmentTree = debounce(getDepartmentTree, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

    // 立即获取部门数据（不使用防抖，用于保存后刷新）
    const getDepartmentTreeImmediate = () => {
        getDepartmentTree()
    }

    // 获取部门级别下拉列表
    const getDepartmentLevelDropdown = async () => {
        try {
            const response = await post(GET_DEPARTMENTLEVEL_DROPDOWN_API.GET_DEPARTMENTLEVEL_DROPDOWN, {})
            if (response.code === 200) {
                departmentLevelOptions.value = response.data || []
            } else {
                ElMessage({
                    message: response.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            console.error('获取部门级别下拉列表失败:', error)
            ElMessage({
                message: t('systembasicmgmt.departmentInfo.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }

    // 获取部门下拉框数据（用于父部门选择）
    const getDepartmentDropdown = async () => {
        try {
            const response = await post(GET_DEPARTMENT_TREE_DROPDOWN_API.GET_DEPARTMENT_TREE_DROPDOWN, {})
            if (response.code === 200) {
                departmentOptions.value = response.data || []
            } else {
                ElMessage({
                    message: response.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            console.error('获取部门下拉框数据失败:', error)
            ElMessage({
                message: t('systembasicmgmt.departmentInfo.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }

    // 处理搜索操作（带防抖）
    const handleSearch = () => {
        loading.value = true
        debouncedGetDepartmentTree()
    }

    // 重置
    const handleReset = () => {
        filters.departmentCode = ''
        filters.departmentName = ''
    }

    /**
     * 添加部门
     * 打开对话框前重置表单，打开后清除校验，避免初始值变更触发"change"校验
     */
    const handleAdd = () => {
        resetForm()
        dialogTitle.value = t('systembasicmgmt.departmentInfo.addDepartment')
        isEdit.value = false
        dialogVisible.value = true
        nextTick(() => {
            if (editFormRef.value) {
                try { editFormRef.value.clearValidate() } catch (error) { /* no-op */ }
            }
        })
    }

    /**
     * 添加子部门
     * 预填父部门并打开对话框，打开后清除校验，避免变更触发"change"校验
     */
    const handleAddChild = (index, row) => {
        resetForm()
        editForm.parentId = row.departmentId
        dialogTitle.value = t('systembasicmgmt.departmentInfo.addChild')
        isEdit.value = false
        dialogVisible.value = true
        nextTick(() => {
            if (editFormRef.value) {
                try { editFormRef.value.clearValidate() } catch (error) { /* no-op */ }
            }
        })
    }

    /**
     * 编辑部门
     * 拉取部门详情并填充表单，打开后清除校验，避免变更触发"change"校验
     */
    const handleEdit = async (index, row) => {
        try {
            const params = {
                departmentId: row.departmentId
            }
            
            const response = await post(GET_DEPARTMENT_ENTITY_API.GET_DEPARTMENT_ENTITY, params)
            
            if (response.code === 200) {
                const data = response.data
                Object.assign(editForm, {
                    departmentId: data.departmentId,
                    departmentCode: data.departmentCode,
                    departmentNameCn: data.departmentNameCn,
                    departmentNameEn: data.departmentNameEn,
                    parentId: data.parentId,
                    departmentLevelId: data.departmentLevelId,
                    description: data.description,
                    sortOrder: data.sortOrder,
                    landline: data.landline,
                    email: data.email,
                    address: data.address,
                    isEnabled: data.isEnabled
                })
                
                dialogTitle.value = t('systembasicmgmt.departmentInfo.editDepartment')
                isEdit.value = true
                dialogVisible.value = true
                nextTick(() => {
                    if (editFormRef.value) {
                        try { editFormRef.value.clearValidate() } catch (error) { /* no-op */ }
                    }
                })
            } else {
                ElMessage({
                    message: response.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            console.error('获取部门详情失败:', error)
            ElMessage({
                message: t('systembasicmgmt.departmentInfo.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }

    // 删除部门
    const handleDelete = async (index, row) => {
        try {
            await ElMessageBox.confirm(
                t('systembasicmgmt.departmentInfo.deleteConfirm'),
                t('common.tip'),
                {
                    confirmButtonText: t('common.confirm'),
                    cancelButtonText: t('common.cancel'),
                    type: 'warning'
                }
            )
            
            const params = {
                departmentId: row.departmentId
            }
            
            const response = await post(DELETE_DEPARTMENT_API.DELETE_DEPARTMENT, params)
            
            if (response.code === 200) {
                ElMessage({
                    message: response.message,
                    type: 'success',
                    plain: true,
                    showClose: true
                })
                getDepartmentTreeImmediate()
            } else {
                ElMessage({
                    message: response.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            if (error !== 'cancel') {
                console.error('删除部门失败:', error)
                ElMessage({
                    message: t('systembasicmgmt.departmentInfo.operationFailed'),
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        }
    }

    // 新增部门
    const addDepartment = async () => {
        submitLoading.value = true
        
        try {
            const params = {
                departmentCode: editForm.departmentCode,
                departmentNameCn: editForm.departmentNameCn,
                departmentNameEn: editForm.departmentNameEn,
                parentId: editForm.parentId,
                departmentLevelId: editForm.departmentLevelId,
                description: editForm.description,
                sortOrder: editForm.sortOrder,
                landline: editForm.landline,
                email: editForm.email,
                address: editForm.address,
                isEnabled: editForm.isEnabled
            }
            
            const response = await post(INSERT_DEPARTMENT_API.INSERT_DEPARTMENT, params)
            
            if (response.code === 200) {
                ElMessage({
                    message: response.message,
                    type: 'success',
                    plain: true,
                    showClose: true
                })
                dialogVisible.value = false
                getDepartmentTreeImmediate()
            } else {
                ElMessage({
                    message: response.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            console.error('新增部门失败:', error)
            ElMessage({
                message: t('systembasicmgmt.departmentInfo.operationFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        } finally {
            submitLoading.value = false
        }
    }

    // 修改部门
    const updateDepartment = async () => {
        submitLoading.value = true
        
        try {
            const params = {
                departmentId: editForm.departmentId,
                departmentCode: editForm.departmentCode,
                departmentNameCn: editForm.departmentNameCn,
                departmentNameEn: editForm.departmentNameEn,
                parentId: editForm.parentId,
                departmentLevelId: editForm.departmentLevelId,
                description: editForm.description,
                sortOrder: editForm.sortOrder,
                landline: editForm.landline,
                email: editForm.email,
                address: editForm.address,
                isEnabled: editForm.isEnabled
            }
            
            const response = await post(UPDATE_DEPARTMENT_API.UPDATE_DEPARTMENT, params)
            
            if (response.code === 200) {
                ElMessage({
                    message: response.message,
                    type: 'success',
                    plain: true,
                    showClose: true
                })
                dialogVisible.value = false
                getDepartmentTreeImmediate()
            } else {
                ElMessage({
                    message: response.message,
                    type: 'error',
                    plain: true,
                    showClose: true
                })
            }
        } catch (error) {
            console.error('修改部门失败:', error)
            ElMessage({
                message: t('systembasicmgmt.departmentInfo.operationFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        } finally {
            submitLoading.value = false
        }
    }

    // 提交表单
    const handleSubmit = async () => {
        // 表单验证
        const isValid = await editFormRef.value.validate().catch(error => {
            // 表单验证失败，直接返回，不显示操作失败提示
            return false
        })
        
        if (!isValid) {
            return
        }
        
        // 根据编辑状态调用不同的方法
        if (isEdit.value) {
            await updateDepartment()
        } else {
            await addDepartment()
        }
    }

    /**
     * 重置表单
     * 仅重置字段值，并在 nextTick 清除校验，避免因值变更触发的"change"校验报警
     */
    const resetForm = () => {
        Object.assign(editForm, {
            departmentId: '',
            departmentCode: '',
            departmentNameCn: '',
            departmentNameEn: '',
            parentId: '',
            departmentLevelId: '',
            description: '',
            sortOrder: 1,
            landline: '',
            email: '',
            address: '',
            isEnabled: 1
        })

        nextTick(() => {
            if (editFormRef.value) {
                try { editFormRef.value.clearValidate() } catch (error) { /* no-op */ }
            }
        })
    }

    /**
     * 对话框关闭处理
     * 仅清除校验，不重置字段，避免关闭时因下拉/选择值回退触发"change"校验报警
     */
    const handleDialogClose = () => {
        nextTick(() => {
            if (editFormRef.value) {
                try { editFormRef.value.clearValidate() } catch (error) { /* no-op */ }
            }
        })
    }

    // 树形选择过滤方法
    const filterNodeMethod = (value, data) => {
        if (!value) return true
        return data.departmentName.includes(value)
    }

    // 组件挂载时获取数据
    onMounted(() => {
        getDepartmentTree()
        getDepartmentLevelDropdown()
        getDepartmentDropdown()
    })
</script>

<style scoped>
    @import '@/assets/styles/conventionalTablePage.css';
</style>

