<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">
  
            <!-- 过滤条件 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="币别搜索表单">
                <el-form-item :label="$t('SystemBasicMgmt.currencyInfo.filter.currencyCode')">
                    <el-input v-model="filters.currencyCode"
                             style="width: 180px;"
                             :placeholder="$t('SystemBasicMgmt.currencyInfo.pleaseInputCurrencyCode')"
                             clearable />
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
                        {{ $t('SystemBasicMgmt.currencyInfo.addCurrency') }}
                    </el-button>
                </el-form-item>
            </el-form>
  
            <!-- 表格区域 -->
            <div class="table-container">
                <el-table :data="currencyList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          v-loading="loading"
                          class="conventional-table">
                    <el-table-column type="index" :label="$t('SystemBasicMgmt.currencyInfo.index')" width="70" align="center" fixed />
                    <el-table-column prop="currencyCode" :label="$t('SystemBasicMgmt.currencyInfo.currencyCode')" align="center" min-width="120"/>
                    <el-table-column prop="currencyNameCh" :label="$t('SystemBasicMgmt.currencyInfo.currencyNameCh')" align="left" min-width="150" />
                    <el-table-column prop="currencyNameEn" :label="$t('SystemBasicMgmt.currencyInfo.currencyNameEn')" align="left" min-width="150" />
                    <el-table-column prop="currencyState" :label="$t('SystemBasicMgmt.currencyInfo.currencyState')" align="center" min-width="100">
                        <template #default="scope">
                            <el-tag :type="scope.row.currencyState === 1 ? 'success' : 'danger'">
                                {{ scope.row.currencyState === 1 ? $t('common.active') : $t('common.inactive') }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" :label="$t('SystemBasicMgmt.currencyInfo.remark')" align="left" min-width="200" />
                    <el-table-column :label="$t('SystemBasicMgmt.currencyInfo.operation')" min-width="130" fixed="right" align="center">
                        <template #default="scope">
                            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">{{ $t('common.edit') }}</el-button>
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
  
        <!-- 编辑状态对话框 -->
        <el-dialog v-model="dialogVisible"
                   :title="dialogTitle"
                   width="60%"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true"
                   @close="handleDialogClose">
            <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="币别编辑表单">
                <div class="form-row">
                    <el-form-item :label="$t('SystemBasicMgmt.currencyInfo.currencyCode')" prop="currencyCode">
                        <el-input v-model="editForm.currencyCode" 
                                 style="width:100%" 
                                 :placeholder="$t('SystemBasicMgmt.currencyInfo.pleaseInputCurrencyCode')" />
                    </el-form-item>
                    <el-form-item :label="$t('SystemBasicMgmt.currencyInfo.currencyState')" prop="currencyState">
                        <el-switch v-model="editForm.currencyState" 
                                  active-color="#67C23A"
                                  inactive-color="#F56C6C"
                                  :active-value="1"
                                  :inactive-value="0" 
                                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"/>
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item :label="$t('SystemBasicMgmt.currencyInfo.currencyNameCh')" prop="currencyNameCh">
                        <el-input v-model="editForm.currencyNameCh" style="width:100%" />
                    </el-form-item>
                    <el-form-item :label="$t('SystemBasicMgmt.currencyInfo.currencyNameEn')" prop="currencyNameEn">
                        <el-input v-model="editForm.currencyNameEn" style="width:100%" />
                    </el-form-item>
                </div>
                <div class="form-row full-width">
                    <el-form-item :label="$t('SystemBasicMgmt.currencyInfo.remark')" prop="remark">
                        <el-input v-model="editForm.remark" 
                                 type="textarea" 
                                 :rows="3"
                                 style="width:100%" 
                                 :placeholder="$t('SystemBasicMgmt.currencyInfo.pleaseInputRemark')" />
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
      GET_CURRENCY_PAGES_API, 
      INSERT_CURRENCY_API, 
      DELETE_CURRENCY_API, 
      GET_CURRENCY_ENTITY_API, 
      UPDATE_CURRENCY_API 
    } from '@/config/api/SystemBasicMgmt/system-settings/currency'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useI18n } from 'vue-i18n'
  
    // 初始化i18n
    const { t } = useI18n()
  
    // 币别数据
    const currencyList = ref([])
    const loading = ref(false)
  
    // 表单引用
    const editFormRef = ref(null)
  
    // 分页信息
    const pagination = reactive({
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
    })
  
    // 过滤条件
    const filters = reactive({
        currencyCode: '',
    })
  
    // 对话框显示状�?
    const dialogVisible = ref(false)
  
    // 编辑表单
    const editForm = reactive({
        currencyId: '',
        currencyCode: '',
        currencyNameCh: '',
        currencyNameEn: '',
        currencyState: 1,
        remark: ''
    })
  
    // 对话框标�?
    const dialogTitle = ref(t('SystemBasicMgmt.currencyInfo.editCurrency'))
  
    // 表单验证规则
    const formRules = reactive({
        currencyCode: [
            { required: true, message: () => t('SystemBasicMgmt.currencyInfo.pleaseInputCurrencyCode'), trigger: 'blur' }
        ],
        currencyNameCh: [
            { required: true, message: () => t('SystemBasicMgmt.currencyInfo.pleaseInputCurrencyNameCh'), trigger: 'blur' }
        ],
        currencyNameEn: [
            { required: true, message: () => t('SystemBasicMgmt.currencyInfo.pleaseInputCurrencyNameEn'), trigger: 'blur' }
        ]
    })
  
    // 在组件挂载后获取币别数据
    onMounted(() => {
        fetchCurrencyPages()
    })
  
    // 获取币别实体数据
    const fetchCurrencyEntity = async (currencyId) => {
        const params = {
            currencyId: String(currencyId)
        }
        
        const res = await post(GET_CURRENCY_ENTITY_API.GET_CURRENCY_ENTITY, params)
  
        if (res && res.code === '200') {
            editForm.currencyId = res.data.currencyId
            editForm.currencyCode = res.data.currencyCode
            editForm.currencyNameCh = res.data.currencyNameCh
            editForm.currencyNameEn = res.data.currencyNameEn
            editForm.currencyState = res.data.currencyState
            editForm.remark = res.data.remark || ''
        }
    }
  
    // 获取币别列表数据
    const fetchCurrencyPages = async () => {
        loading.value = true
        const params = {
            currencyCode: filters.currencyCode,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            totalCount: pagination.totalCount
        }
  
        const res = await post(GET_CURRENCY_PAGES_API.GET_CURRENCY_PAGES, params)
  
        if (res && res.code === '200') {
            currencyList.value = res.data || []
            pagination.totalCount = res.totalNumber || 0
        } else {
            ElMessage.error(res.message || t('SystemBasicMgmt.currencyInfo.getFailed'))
        }
        loading.value = false
    }
  
    // 防抖搜索优化
    let searchTimer = null
    const handleSearch = () => {
        if (searchTimer) clearTimeout(searchTimer)
        searchTimer = setTimeout(() => {
            pagination.pageIndex = 1
            fetchCurrencyPages()
        }, 300) // 300ms防抖
    }
  
    // 重置搜索条件
    const handleReset = () => {
        filters.currencyCode = ''
        pagination.pageIndex = 1
        fetchCurrencyPages()
    }
  
    // 处理页码变化
    const handlePageChange = (page) => {
        pagination.pageIndex = page
        fetchCurrencyPages()
    }
  
    // 处理每页记录数变�?
    const handleSizeChange = (size) => {
        pagination.pageSize = size
        pagination.pageIndex = 1
        fetchCurrencyPages()
    }
  
    const resetForm = (clearValidation = true) => {
        // 先清除验证状态（在重置数据之前）
        if (clearValidation && editFormRef.value) {
            try {
                editFormRef.value.clearValidate()
            } catch (error) {
                console.warn('清除表单验证状态失�?', error)
            }
        }
        
        editForm.currencyId = ''
        editForm.currencyCode = ''
        editForm.currencyNameCh = ''
        editForm.currencyNameEn = ''
        editForm.currencyState = 1
        editForm.remark = ''
        
        // 数据重置后再次清除验证状�?
        if (clearValidation) {
            nextTick(() => {
                if (editFormRef.value) {
                    try {
                        editFormRef.value.clearValidate()
                    } catch (error) {
                        console.warn('清除表单验证状态失�?', error)
                    }
                }
            })
        }
    }
  
    // 新增币别数据
    const insertCurrency = async () => {
        const params = {
            ...editForm
        }
  
        const res = await post(INSERT_CURRENCY_API.INSERT_CURRENCY, params)
  
        if (res && res.code === '200') {
            resetForm()
            ElMessage.success(res.message || t('SystemBasicMgmt.currencyInfo.saveSuccess'))
            dialogVisible.value = false
            fetchCurrencyPages()
        } else {
            ElMessage.error(res.message || t('SystemBasicMgmt.currencyInfo.operationFailed'))
        }
    }
  
    // 更新币别数据
    const updateCurrency = async () => {
        const params = {
            ...editForm
        }
        const res = await post(UPDATE_CURRENCY_API.UPDATE_CURRENCY, params)
  
        if (res && res.code === '200') {
            resetForm()
            ElMessage.success(res.message || t('SystemBasicMgmt.currencyInfo.updateSuccess'))
            dialogVisible.value = false
            fetchCurrencyPages()
        } else {
            ElMessage.error(res.message || t('SystemBasicMgmt.currencyInfo.operationFailed'))
        }
    }
  
    // 删除币别数据
    const deleteCurrency = async (currencyId) => {
        const params = {
            currencyId: currencyId
        }
  
        const res = await post(DELETE_CURRENCY_API.DELETE_CURRENCY, params)
  
        if (res && res.code === '200') {
            ElMessage.success(res.message || t('SystemBasicMgmt.currencyInfo.deleteSuccess'))
            fetchCurrencyPages()
        } else {
            ElMessage.error(res.message || t('SystemBasicMgmt.currencyInfo.operationFailed'))
        }
    }
  
    // 处理新增操作
    const handleAdd = () => {
        // 重置表单数据
        resetForm()
        // 设置对话框标�?
        dialogTitle.value = t('SystemBasicMgmt.currencyInfo.addCurrency')
        // 显示对话�?
        dialogVisible.value = true
    }
  
    // 处理编辑操作
    const handleEdit = async (index, row) => {
        // 重置表单数据
        resetForm()
        // 获取币别实体数据
        await fetchCurrencyEntity(row.currencyId)
        // 设置对话框标�?
        dialogTitle.value = t('SystemBasicMgmt.currencyInfo.editCurrency')
        // 显示对话�?
        dialogVisible.value = true
        
        // 在数据加载完成后再次清除验证状�?
        setTimeout(() => {
            if (editFormRef.value) {
                editFormRef.value.clearValidate()
            }
        }, 100)
    }
  
    // 处理删除操作
    const handleDelete = (index, row) => {
        ElMessageBox.confirm(
            t('SystemBasicMgmt.currencyInfo.deleteConfirm'),
            t('common.tip'),
            {
                confirmButtonText: t('common.confirm'),
                cancelButtonText: t('common.cancel'),
                type: 'warning',
            }
        )
            .then(() => {
                deleteCurrency(row.currencyId)
            })
            .catch(() => {
                // 取消删除
            })
    }
  
    // 保存编辑结果
    const handleSave = () => {
        editFormRef.value?.validate((valid) => {
            if (valid) {
                // 判断是新增还是编�?
                if (!editForm.currencyId) {
                    insertCurrency()
                } else {
                    updateCurrency()
                }
            }
        })
    }
  
    // 处理对话框关�?
    const handleDialogClose = () => {
        // 使用 nextTick 确保 DOM 更新完成后再清除验证
        nextTick(() => {
            resetForm(true)
        })
    }
</script>
  
<style scoped>
    @import '@/assets/styles/conventionalTablePage.css';
</style>
  
