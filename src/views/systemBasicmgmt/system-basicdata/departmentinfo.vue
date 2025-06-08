<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">
  
            <!-- 过滤条件 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="部门搜索表单">
                <el-form-item :label="$t('systemBasicmgmt.departmentInfo.filter.departmentCode')">
                    <el-input style="width: 180px;"
                              v-model="filters.departmentCode"
                              :placeholder="$t('systemBasicmgmt.departmentInfo.pleaseInputCode')" />
                </el-form-item>
                <el-form-item :label="$t('systemBasicmgmt.departmentInfo.filter.departmentName')">
                    <el-input style="width: 180px;"
                              v-model="filters.departmentName"
                              :placeholder="$t('systemBasicmgmt.departmentInfo.pleaseInputName')" />
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
                        {{ $t('systemBasicmgmt.departmentInfo.addDepartment') }}
                    </el-button>
                </el-form-item>
            </el-form>
  
            <!-- 树形表格区域 -->
            <div class="table-container">
                <el-table :data="departmentList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          v-loading="loading"
                          class="conventional-table"
                          row-key="departmentId"
                          default-expand-all
                          :tree-props="{ children: 'departmentChildList', hasChildren: 'hasChildren' }">
                        <el-table-column type="index" :label="$t('systemBasicmgmt.departmentInfo.index')" width="70" align="center" fixed />
                        <el-table-column prop="departmentCode" :label="$t('systemBasicmgmt.departmentInfo.departmentCode')" align="left" min-width="180" />
                        <el-table-column prop="departmentNameCn" :label="$t('systemBasicmgmt.departmentInfo.departmentNameCn')" align="left" min-width="200" />
                        <el-table-column prop="departmentNameEn" :label="$t('systemBasicmgmt.departmentInfo.departmentNameEn')" align="left" min-width="280" />
                        <el-table-column prop="departmentLevelName" :label="$t('systemBasicmgmt.departmentInfo.departmentLevelName')" align="center" min-width="200" />
                        <el-table-column prop="status" :label="$t('systemBasicmgmt.departmentInfo.status')" align="center" min-width="110">
                            <template #default="scope">
                                <el-tag :type="scope.row.status ? 'success' : 'danger'">
                                    {{ scope.row.status ? $t('systemBasicmgmt.departmentInfo.active') : $t('systemBasicmgmt.departmentInfo.inactive') }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="landline" :label="$t('systemBasicmgmt.departmentInfo.landline')" align="center" min-width="120" />
                        <el-table-column prop="email" :label="$t('systemBasicmgmt.departmentInfo.email')" align="left" min-width="180" />
                        
                        <el-table-column prop="description" :label="$t('systemBasicmgmt.departmentInfo.description')" align="left" min-width="200" />
                        <el-table-column :label="$t('systemBasicmgmt.departmentInfo.operation')" min-width="260" fixed="right">
                            <template #default="scope">
                                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
                                <el-button size="small" type="success" @click="handleAddChild(scope.$index, scope.row)">{{ $t('systemBasicmgmt.departmentInfo.addChild') }}</el-button>
                                <el-button size="small"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
        </el-card>
  
        <!-- 编辑状态对话框 -->
        <el-dialog v-model="dialogVisible"
                   :title="dialogTitle"
                   width="50%"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true"
                   @close="handleDialogClose">
            <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="部门编辑表单">
                <div class="form-row">
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.departmentCode')" prop="departmentCode">
                        <el-input v-model="editForm.departmentCode" style="width:100%" />
                    </el-form-item>
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.sortOrder')" prop="sortOrder">
                        <el-input-number v-model="editForm.sortOrder" :min="1" style="width:60%" />
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.departmentNameCn')" prop="departmentNameCn">
                        <el-input v-model="editForm.departmentNameCn" style="width:100%" />
                    </el-form-item>
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.departmentNameEn')" prop="departmentNameEn">
                        <el-input v-model="editForm.departmentNameEn" style="width:100%" />
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.landline')" prop="landline">
                        <el-input v-model="editForm.landline" style="width:100%" />
                    </el-form-item>
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.email')" prop="email">
                        <el-input v-model="editForm.email" style="width:100%" />
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.departmentLevelId')" prop="departmentLevelId">
                        <el-select v-model="editForm.departmentLevelId" 
                                   style="width:100%" 
                                   clearable
                                   :placeholder="$t('systemBasicmgmt.departmentInfo.pleaseSelectDepartmentLevel')">
                            <el-option v-for="item in departmentLevelList"
                                       :key="`dept-level-${item.departmentLevelId}`" 
                                       :label="item.departmentLevelName" 
                                       :value="item.departmentLevelId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.status')">
                        <el-switch v-model="editForm.status" 
                                   style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
                    </el-form-item>
                </div>
                <div class="form-row full-width">
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.address')" prop="address">
                        <el-input v-model="editForm.address" style="width:100%" />
                    </el-form-item>
                </div>
                <div class="form-row full-width">
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.description')">
                        <el-input v-model="editForm.description" style="width:100%" type="textarea" :rows="3" />
                    </el-form-item>
                </div>
                <div class="form-row full-width">
                    <el-form-item :label="$t('systemBasicmgmt.departmentInfo.remark')">
                        <el-input v-model="editForm.remark" style="width:100%" type="textarea" :rows="2" />
                    </el-form-item>
                </div>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
                    <el-button type="primary" @click="handleSave">{{ $t('common.confirm') }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
  </template>
  
  <script setup>
    import { ref, reactive, onMounted, nextTick } from 'vue'
    import { post } from '@/utils/request'
    import { 
        GET_DEPARTMENT_TREE_API, 
        GET_DEPARTMENT_ENTITY_API, 
        INSERST_DEPARTMENT_API, 
        DELETE_DEPARTMENT_API, 
        UPDATE_DEPARTMENT_API,
        GET_DEPARTMENTLEVEL_DROPDOWN_API 
    } from '@/config/api/systemBasicmgmt/system-basic/department'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useI18n } from 'vue-i18n'
  
    // 初始化i18n
    const { t } = useI18n()
  
    // 部门数据
    const departmentList = ref([])
    const loading = ref(false)
    
    // 部门级别下拉框数据
    const departmentLevelList = ref([])
  
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
        status: true,
        remark: ''
    })
  
    // 表单验证规则
    const formRules = reactive({
        departmentCode: [
            { required: true, message: () => t('systemBasicmgmt.departmentInfo.pleaseInputCode'), trigger: 'blur' }
        ],
        departmentNameCn: [
            { required: true, message: () => t('systemBasicmgmt.departmentInfo.pleaseInputNameCn'), trigger: 'blur' }
        ],
        departmentNameEn: [
            { required: true, message: () => t('systemBasicmgmt.departmentInfo.pleaseInputNameEn'), trigger: 'blur' }
        ],
        sortOrder: [
            { required: true, message: () => t('systemBasicmgmt.departmentInfo.pleaseInputSortOrder'), trigger: 'blur' }
        ],
        landline: [
            { required: true, message: () => t('systemBasicmgmt.departmentInfo.pleaseInputLandline'), trigger: 'blur' }
        ],
        email: [
            { required: true, message: () => t('systemBasicmgmt.departmentInfo.pleaseInputEmail'), trigger: 'blur' }
        ],
        departmentLevelId: [
            { required: true, message: () => t('systemBasicmgmt.departmentInfo.pleaseSelectDepartmentLevel'), trigger: 'change' }
        ],
        address: [
            { required: true, message: () => t('systemBasicmgmt.departmentInfo.pleaseInputAddress'), trigger: 'blur' }
        ]
    })
  
    // 对话框标题
    const dialogTitle = ref('')
  
    // 当前操作类型 add/edit/addChild
    const operationType = ref('add')
  
    // 在组件挂载后获取部门数据
    onMounted(() => {
        fetchDepartmentTree()
        fetchDepartmentLevelDropdown()
    })
    
    // 获取部门级别下拉框数据
    const fetchDepartmentLevelDropdown = async () => {
        const res = await post(GET_DEPARTMENTLEVEL_DROPDOWN_API.GET_DEPARTMENTLEVEL_DROPDOWN, {})
        
        if (res && res.code === '200') {
            departmentLevelList.value = res.data || []
        } else {
            ElMessage.error(res?.message || '获取部门级别下拉框数据失败')
        }
    }
  
    // 获取部门实体数据
    const fetchDepartmentEntity = async (departmentId) => {
        const params = {
            departmentId: departmentId,
            departmentCode: ""
        }
        const res = await post(GET_DEPARTMENT_ENTITY_API.GET_DEPARTMENT_ENTITY, params)

        if (res && res.code === '200') {
            editForm.departmentId = res.data.departmentId
            editForm.departmentCode = res.data.departmentCode
            editForm.departmentNameCn = res.data.departmentNameCn
            editForm.departmentNameEn = res.data.departmentNameEn
            editForm.parentId = res.data.parentId
            editForm.departmentLevelId = res.data.departmentLevelId
            editForm.description = res.data.description
            editForm.sortOrder = res.data.sortOrder
            editForm.landline = res.data.landline
            editForm.email = res.data.email
            editForm.address = res.data.address
            editForm.status = res.data.status
            editForm.remark = res.data.remark
        }
        else {
            ElMessage.error(res.message || t('systemBasicmgmt.departmentInfo.getFailed'))
        }
    }
  
    // 获取部门树形数据
    const fetchDepartmentTree = async () => {
        loading.value = true
        const params = {
            DepartmentCode: filters.departmentCode,
            DepartmentName: filters.departmentName
        }
  
        const res = await post(GET_DEPARTMENT_TREE_API.GET_DEPARTMENT_TREE, params)
  
        if (res && res.code === '200') {
            departmentList.value = res.data || []
        } else {
            ElMessage.error(res.message || t('systemBasicmgmt.departmentInfo.getFailed'))
        }
        loading.value = false
    }
  
    // 处理搜索操作
    const handleSearch = () => {
        fetchDepartmentTree()
    }
  
    // 重置搜索条件
    const handleReset = () => {
        filters.departmentCode = ''
        filters.departmentName = ''
        fetchDepartmentTree()
    }
  
    const resetForm = (clearValidation = true) => {
        // 先清除验证状态（在重置数据之前）
        if (clearValidation && editFormRef.value) {
            try {
                // 针对下拉框字段单独清除验证
                const selectFields = ['departmentLevelId']
                selectFields.forEach(field => {
                    editFormRef.value.clearValidate(field)
                })
                // 然后清除所有验证
                editFormRef.value.clearValidate()
            } catch (error) {
                console.warn('清除表单验证状态失败:', error)
            }
        }
        
        // 重置表单数据
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
            status: true,
            remark: ''
        })
        
        // 数据重置后再次清除验证状态
        if (clearValidation) {
            nextTick(() => {
                if (editFormRef.value) {
                    try {
                        editFormRef.value.clearValidate()
                    } catch (error) {
                        console.warn('清除表单验证状态失败:', error)
                    }
                }
            })
        }
    }
  
    // 新增部门数据
    const insertDepartment = async () => {
        const params = {
            ...editForm
        }
  
        const res = await post(INSERST_DEPARTMENT_API.INSERST_DEPARTMENT, params)
  
        if (res && res.code === '200') {
            resetForm()
            ElMessage.success(res.message || t('systemBasicmgmt.departmentInfo.saveSuccess'))
            dialogVisible.value = false
            fetchDepartmentTree()
        } else {
            ElMessage.error(res.message || t('systemBasicmgmt.departmentInfo.operationFailed'))
        }
    }
  
    // 更新部门数据
    const updateDepartment = async () => {
        const params = {
            ...editForm
        }

        const res = await post(UPDATE_DEPARTMENT_API.UPDATE_DEPARTMENT, params)
  
        if (res && res.code === '200') {
            resetForm()
            ElMessage.success(res.message || t('systemBasicmgmt.departmentInfo.updateSuccess'))
            dialogVisible.value = false
            fetchDepartmentTree()
        } else {
            ElMessage.error(res.message || t('systemBasicmgmt.departmentInfo.operationFailed'))
        }
    }
  
    // 删除部门数据
    const deleteDepartment = async (departmentId) => {
        const params = {
            DepartmentId: departmentId
        }
  
        const res = await post(DELETE_DEPARTMENT_API.DELETE_DEPARTMENT, params)
  
        if (res && res.code === '200') {
            ElMessage.success(res.message || t('systemBasicmgmt.departmentInfo.deleteSuccess'))
            fetchDepartmentTree()
        } else {
            ElMessage.error(res.message || t('systemBasicmgmt.departmentInfo.operationFailed'))
        }
    }
  
    // 处理新增操作
    const handleAdd = () => {
        // 重置表单数据
        resetForm()
        operationType.value = 'add'
        // 设置对话框标题
        dialogTitle.value = t('systemBasicmgmt.departmentInfo.addDepartment')
        // 显示对话框
        dialogVisible.value = true
    }
  
    // 处理编辑操作
    const handleEdit = async (index, row) => {
        // 重置表单数据
        resetForm()
        operationType.value = 'edit'
        // 获取部门实体数据
        await fetchDepartmentEntity(row.departmentId)
        // 设置对话框标题
        dialogTitle.value = t('systemBasicmgmt.departmentInfo.editDepartment')
        // 显示对话框
        dialogVisible.value = true
        
        // 在数据加载完成后再次清除验证状态
        setTimeout(() => {
            if (editFormRef.value) {
                editFormRef.value.clearValidate()
            }
        }, 100)
    }

    // 处理添加子部门操作
    const handleAddChild = (index, row) => {
        // 重置表单数据
        resetForm()
        operationType.value = 'addChild'
        // 设置父部门ID，确保为字符串类型
        editForm.parentId = String(row.departmentId)
        // 设置对话框标题
        dialogTitle.value = t('systemBasicmgmt.departmentInfo.addChildDepartment')
        // 显示对话框
        dialogVisible.value = true
    }
  
    // 处理删除操作
    const handleDelete = (index, row) => {
        // 检查是否有子部门
        if (row.departmentChildList && row.departmentChildList.length > 0) {
            ElMessage.warning(t('systemBasicmgmt.departmentInfo.hasChildrenCannotDelete'))
            return
        }

        ElMessageBox.confirm(
            t('systemBasicmgmt.departmentInfo.deleteConfirm'),
            t('common.tip'),
            {
                confirmButtonText: t('common.confirm'),
                cancelButtonText: t('common.cancel'),
                type: 'warning',
            }
        )
            .then(() => {
                deleteDepartment(row.departmentId)
            })
            .catch(() => {
                // 取消删除
            })
    }
  
    // 保存编辑结果
    const handleSave = () => {
        editFormRef.value.validate((valid) => {
            if (valid) {
                // 判断是新增还是编辑
                if (operationType.value === 'edit') {
                    updateDepartment()
                } else {
                    // add 或 addChild 都是新增操作
                    insertDepartment()
                }
            } else {
                return false
            }
        })
    }

      // 处理对话框关闭
  const handleDialogClose = () => {
      // 使用 nextTick 确保 DOM 更新完成后再清除验证
      nextTick(() => {
          resetForm(true)
      })
  }
  </script>
  
  <style scoped>
    @import '@/assets/styles/conventionalTablePage.css';
    
    .form-row {
        display: flex;
        gap: 20px;
    }
    
    .form-row .el-form-item {
        flex: 1;
    }
    
    .form-row.full-width {
        display: block;
    }
    
    .form-row.full-width .el-form-item {
        width: 100%;
    }
  </style> 