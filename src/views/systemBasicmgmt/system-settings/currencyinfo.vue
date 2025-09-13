<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">
            <!-- 搜索 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="搜索">
                <el-form-item :label="$t('systembasicmgmt.currencyInfo.filter.currencyCode')">
                    <el-input v-model="filters.currencyCode" :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode')" style="width:170px" />
                </el-form-item>
                <el-form-item style="visibility: hidden; width: 0; margin: 0; padding: 0;">
                    <el-input style="width: 0; height: 0; border: none; padding: 0; margin: 0;" />
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
                        {{ $t('systembasicmgmt.currencyInfo.addCurrency') }}
                    </el-button>
                </el-form-item>
            </el-form>
  
            <!-- 表格 -->
            <div class="table-container">
                <el-table :data="currencyList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          v-loading="loading"
                          class="conventional-table">
                    <el-table-column type="index" :label="$t('systembasicmgmt.currencyInfo.index')" width="70" align="center" fixed />
                    <el-table-column prop="currencyCode" :label="$t('systembasicmgmt.currencyInfo.currencyCode')" align="center" min-width="120"/>
                    <el-table-column prop="currencyNameCn" :label="$t('systembasicmgmt.currencyInfo.currencyNameCn')" align="left" min-width="150" />
                    <el-table-column prop="currencyNameEn" :label="$t('systembasicmgmt.currencyInfo.currencyNameEn')" align="left" min-width="150" />
                    <el-table-column prop="currencyState" :label="$t('systembasicmgmt.currencyInfo.currencyState')" align="center" min-width="100">
                        <template #default="scope">
                            <el-tag :type="scope.row.currencyState === 1 ? 'success' : 'danger'">
                                {{ scope.row.currencyState === 1 ? $t('common.active') : $t('common.inactive') }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" :label="$t('systembasicmgmt.currencyInfo.remark')" align="left" min-width="200" />
                    <el-table-column :label="$t('systembasicmgmt.currencyInfo.operation')" min-width="130" fixed="right" align="center">
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
                               @current-change="handlePageChange"/>
            </div>
        </el-card>
  
        <!-- 编辑状态弹窗 -->
        <el-dialog v-model="dialogVisible"
                   :title="dialogTitle"
                   width="50%"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true"
                   @close="handleDialogClose">
            <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="编辑表单">
                <div class="form-row">
                    <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyCode')" prop="currencyCode">
                        <el-input v-model="editForm.currencyCode" 
                                 style="width:100%" 
                                 :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode')" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyState')" prop="currencyState">
                        <el-switch v-model="editForm.currencyState" 
                                  :active-value="1"
                                  :inactive-value="0"
                                  :active-text="$t('common.yes')"
                                  :inactive-text="$t('common.no')"
                                  inline-prompt
                                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399"/>
                    </el-form-item>
                </div>
                <div class="form-row">
                    <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyNameCn')" prop="currencyNameCn">
                    <el-input v-model="editForm.currencyNameCn" style="width:100%" />
                    </el-form-item>
                    <el-form-item :label="$t('systembasicmgmt.currencyInfo.currencyNameEn')" prop="currencyNameEn">
                        <el-input v-model="editForm.currencyNameEn" style="width:100%" />
                    </el-form-item>
                </div>
                <div class="form-row full-width">
                    <el-form-item :label="$t('systembasicmgmt.currencyInfo.remark')" prop="remark">
                        <el-input v-model="editForm.remark" 
                                 type="textarea" 
                                 :rows="3"
                                 style="width:100%" 
                                 :placeholder="$t('systembasicmgmt.currencyInfo.pleaseInputRemark')" />
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
    } from '@/config/api/systembasicmgmt/System-Settings/currency'
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
  
    // 对话框显示状态
    const dialogVisible = ref(false)
  
    // 编辑表单
    const editForm = reactive({
        currencyId: '',
        currencyCode: '',
        currencyNameCn: '',
        currencyNameEn: '',
        currencyState: 1,
        remark: ''
    })
  
    // 对话框标题
    const dialogTitle = ref(t('systembasicmgmt.currencyInfo.editCurrency'))
  
    // 表单验证规则
    const formRules = reactive({
        currencyCode: [
            { required: true, message: () => t('systembasicmgmt.currencyInfo.pleaseInputCurrencyCode'), trigger: 'blur' }
        ],
        currencyNameCn: [
{ required: true, message: () => t('systembasicmgmt.currencyInfo.pleaseInputCurrencyNameCn'), trigger: 'blur' }
],
        currencyNameEn: [
            { required: true, message: () => t('systembasicmgmt.currencyInfo.pleaseInputCurrencyNameEn'), trigger: 'blur' }
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
  
        if (res && res.code === 200) {
            editForm.currencyId = res.data.currencyId
            editForm.currencyCode = res.data.currencyCode
            editForm.currencyNameCn = res.data.currencyNameCn
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
  
        if (res && res.code === 200) {
            currencyList.value = res.data || []
            pagination.totalCount = res.totalCount || 0
        } else {
            ElMessage({
                message: res.message || t('systembasicmgmt.currencyInfo.getFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
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
    }
  
    // 处理页码变化
    const handlePageChange = (page) => {
        pagination.pageIndex = page
        fetchCurrencyPages()
    }
  
    // 处理每页记录数变化
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
                console.warn('清除表单验证状态失败', error)
            }
        }
        
        editForm.currencyId = ''
        editForm.currencyCode = ''
        editForm.currencyNameCn = ''
        editForm.currencyNameEn = ''
        editForm.currencyState = 1
        editForm.remark = ''
        
        // 数据重置后再次清除验证状态
        if (clearValidation) {
            nextTick(() => {
                if (editFormRef.value) {
                    try {
                        editFormRef.value.clearValidate()
                    } catch (error) {
                        console.warn('清除表单验证状态失败', error)
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
  
        if (res && res.code === 200) {
            resetForm()
            ElMessage({
                message: res.message || t('systembasicmgmt.currencyInfo.saveSuccess'),
                type: 'success',
                plain: true,
                showClose: true
            })
            dialogVisible.value = false
            fetchCurrencyPages()
        } else {
            ElMessage({
                message: res.message || t('systembasicmgmt.currencyInfo.operationFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
  
    // 更新币别数据
    const updateCurrency = async () => {
        const params = {
            ...editForm
        }
        const res = await post(UPDATE_CURRENCY_API.UPDATE_CURRENCY, params)
  
        if (res && res.code === 200) {
            resetForm()
            ElMessage({
                message: res.message || t('systembasicmgmt.currencyInfo.updateSuccess'),
                type: 'success',
                plain: true,
                showClose: true
            })
            dialogVisible.value = false
            fetchCurrencyPages()
        } else {
            ElMessage({
                message: res.message || t('systembasicmgmt.currencyInfo.operationFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
  
    // 删除币别数据
    const deleteCurrency = async (currencyId) => {
        const params = {
            currencyId: currencyId
        }
  
        const res = await post(DELETE_CURRENCY_API.DELETE_CURRENCY, params)
  
        if (res && res.code === 200) {
            ElMessage({
                message: res.message || t('systembasicmgmt.currencyInfo.deleteSuccess'),
                type: 'success',
                plain: true,
                showClose: true
            })
            fetchCurrencyPages()
        } else {
            ElMessage({
                message: res.message || t('systembasicmgmt.currencyInfo.operationFailed'),
                type: 'error',
                plain: true,
                showClose: true
            })
        }
    }
  
    // 处理新增操作
    const handleAdd = () => {
        // 重置表单数据
        resetForm()
        // 设置对话框标题
        dialogTitle.value = t('systembasicmgmt.currencyInfo.addCurrency')
        // 显示对话框
        dialogVisible.value = true
    }
  
    // 处理编辑操作
    const handleEdit = async (index, row) => {
        // 重置表单数据
        resetForm()
        // 获取币别实体数据
        await fetchCurrencyEntity(row.currencyId)
        // 设置对话框标题
        dialogTitle.value = t('systembasicmgmt.currencyInfo.editCurrency')
        // 显示对话框
        dialogVisible.value = true
        
        // 在数据加载完成后再次清除验证状态
        setTimeout(() => {
            if (editFormRef.value) {
                editFormRef.value.clearValidate()
            }
        }, 100)
    }
  
    // 处理删除操作
    const handleDelete = (index, row) => {
        ElMessageBox.confirm(
            t('systembasicmgmt.currencyInfo.deleteConfirm'),
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
                // 判断是新增还是编辑
                if (!editForm.currencyId) {
                    insertCurrency()
                } else {
                    updateCurrency()
                }
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
</style>
  
