<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">
  
            <!-- 过滤条件 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="汇率搜索表单">
                <el-form-item :label="$t('SystemBasicMgmt.exchangeRateInfo.filter.currencyCode')">
                    <el-select v-model="filters.currencyCode"
                              style="width: 180px;"
                              :placeholder="$t('SystemBasicMgmt.exchangeRateInfo.pleaseSelectCurrencyCode')"
                              clearable>
                        <el-option v-for="item in currencyOptions"
                                   :key="item.currencyCode"
                                   :label="item.currencyName"
                                   :value="item.currencyCode" />
                    </el-select>
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
                        {{ $t('SystemBasicMgmt.exchangeRateInfo.addExchangeRate') }}
                    </el-button>
                </el-form-item>
            </el-form>
  
            <!-- 表格区域 -->
            <div class="table-container">
                <el-table :data="exchangeRateList"
                          border
                          stripe
                          :header-cell-style="{ background: '#f5f7fa' }"
                          v-loading="loading"
                          class="conventional-table">
                    <el-table-column type="index" :label="$t('SystemBasicMgmt.exchangeRateInfo.index')" width="70" align="center" fixed />
                    <el-table-column prop="currencyCode" :label="$t('SystemBasicMgmt.exchangeRateInfo.currencyCode')" align="center" min-width="120"/>
                    <el-table-column prop="exchangeCurrencyCode" :label="$t('SystemBasicMgmt.exchangeRateInfo.exchangeCurrencyCode')" align="center" min-width="150" />
                    <el-table-column prop="exchangeRate" :label="$t('SystemBasicMgmt.exchangeRateInfo.exchangeRate')" align="center" min-width="120">
                        <template #default="scope">
                            {{ scope.row.exchangeRate?.toFixed(6) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" :label="$t('SystemBasicMgmt.exchangeRateInfo.remark')" align="left" min-width="200" />
                    <el-table-column :label="$t('SystemBasicMgmt.exchangeRateInfo.operation')" min-width="130" fixed="right" align="center">
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
  
        <!-- 汇率编辑对话框 -->
        <el-dialog v-model="dialogVisible"
                   :title="dialogTitle"
                   width="55%"
                   :close-on-click-modal="false"
                   :append-to-body="true"
                   :modal-append-to-body="true"
                   :lock-scroll="true"
                   @close="handleDialogClose">
            <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="120px" class="dialog-form" role="form" aria-label="汇率编辑表单">
                <div class="form-row">
                    <el-form-item :label="$t('SystemBasicMgmt.exchangeRateInfo.currencyCode')" prop="currencyCode">
                        <el-select v-model="editForm.currencyCode" 
                                  style="width:100%" 
                                  :placeholder="$t('SystemBasicMgmt.exchangeRateInfo.pleaseSelectCurrencyCode')">
                            <el-option v-for="item in currencyOptions"
                                       :key="item.currencyCode"
                                       :label="item.currencyName"
                                       :value="item.currencyCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('SystemBasicMgmt.exchangeRateInfo.exchangeCurrencyCode')" prop="exchangeCurrencyCode">
                        <el-select v-model="editForm.exchangeCurrencyCode" 
                                  style="width:100%" 
                                  :placeholder="$t('SystemBasicMgmt.exchangeRateInfo.pleaseSelectExchangeCurrencyCode')">
                            <el-option v-for="item in currencyOptions"
                                       :key="item.currencyCode"
                                       :label="item.currencyName"
                                       :value="item.currencyCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('SystemBasicMgmt.exchangeRateInfo.exchangeRate')" prop="exchangeRate">
                        <el-input-number v-model="editForm.exchangeRate" 
                                        style="width:100%" 
                                        :precision="6"
                                        :min="0"
                                        :step="0.000001"
                                        controls-position="right"
                                        :placeholder="$t('SystemBasicMgmt.exchangeRateInfo.pleaseInputExchangeRate')" />
                    </el-form-item>
                </div>
                <div class="form-row">
                    
                    <el-form-item :label="$t('SystemBasicMgmt.exchangeRateInfo.remark')" prop="remark">
                        <el-input v-model="editForm.remark" 
                                 type="textarea" 
                                 :rows="3"
                                 style="width:100%" 
                                 :placeholder="$t('SystemBasicMgmt.exchangeRateInfo.pleaseInputRemark')" />
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
      GET_EXCHANGE_RATE_PAGES_API, 
      GET_CURRENCY_DROPDOWN_API,
      GET_EXCHANGE_RATE_ENTITY_API,
      INSERT_EXCHANGE_RATE_API, 
      UPDATE_EXCHANGE_RATE_API,
      DELETE_EXCHANGE_RATE_API
    } from '@/config/api/SystemBasicMgmt/System-Settings/exchangerateInfo'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useI18n } from 'vue-i18n'
  
    // 初始化i18n
    const { t } = useI18n()
  
    // 汇率数据
    const exchangeRateList = ref([])
    const loading = ref(false)
    
    // 币别下拉选项
    const currencyOptions = ref([])
  
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
    
    // 对话框标题
    const dialogTitle = ref(t('SystemBasicMgmt.exchangeRateInfo.addExchangeRate'))
    
    // 是否为编辑模式
    const isEditMode = ref(false)
  
    // 编辑表单
    const editForm = reactive({
        currencyCode: '',
        exchangeCurrencyCode: '',
        exchangeRate: 1,
        remark: ''
    })

    // 保存原始的兑换币别（用于编辑时的参数）
    const originalExchangeCurrencyCode = ref('')
  
    // 表单验证规则
    const formRules = reactive({
        currencyCode: [
            { required: true, message: () => t('SystemBasicMgmt.exchangeRateInfo.pleaseSelectCurrencyCode'), trigger: 'change' }
        ],
        exchangeCurrencyCode: [
            { required: true, message: () => t('SystemBasicMgmt.exchangeRateInfo.pleaseSelectExchangeCurrencyCode'), trigger: 'change' }
        ],
        exchangeRate: [
            { required: true, message: () => t('SystemBasicMgmt.exchangeRateInfo.pleaseInputExchangeRate'), trigger: 'blur' }
        ]
    })
  
    // 在组件挂载后获取数据
    onMounted(() => {
        fetchCurrencyDropdown()
        fetchExchangeRatePages()
    })

    // 获取币别下拉框数据
    const fetchCurrencyDropdown = async () => {
        const res = await post(GET_CURRENCY_DROPDOWN_API.GET_CURRENCY_DROPDOWN, {})
        
        if (res && res.code === '200') {
            currencyOptions.value = res.data || []
        } else {
            ElMessage({
              message: res.message || t('SystemBasicMgmt.exchangeRateInfo.getFailed'),
              type: 'error',
              plain: true,
              showClose: true,
            })
        }
    }
  
    // 获取汇率列表数据
    const fetchExchangeRatePages = async () => {
        loading.value = true
        const params = {
            currencyCode: filters.currencyCode,
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            totalCount: pagination.totalCount
        }
  
        const res = await post(GET_EXCHANGE_RATE_PAGES_API.GET_EXCHANGE_RATE_PAGES, params)
  
        if (res && res.code === '200') {
            exchangeRateList.value = res.data || []
            pagination.totalCount = res.totalNumber || 0
        } else {
            ElMessage({
              message: res.message || t('SystemBasicMgmt.exchangeRateInfo.getFailed'),
              type: 'error',
              plain: true,
              showClose: true,
            })
        }
        loading.value = false
    }

    // 获取汇率详情数据
    const fetchExchangeRateEntity = async (currencyCode) => {
        const params = {
            currencyCode: currencyCode
        }
        
        const res = await post(GET_EXCHANGE_RATE_ENTITY_API.GET_EXCHANGE_RATE_ENTITY, params)

        if (res && res.code === '200') {
            editForm.currencyCode = res.data.currencyCode
            editForm.exchangeCurrencyCode = res.data.exchangeCurrencyCode
            editForm.exchangeRate = res.data.exchangeRate
            editForm.remark = res.data.remark || ''
            // 保存原始的兑换币别
            originalExchangeCurrencyCode.value = res.data.exchangeCurrencyCode
        } else {
            ElMessage({
              message: res.message || t('SystemBasicMgmt.exchangeRateInfo.getFailed'),
              type: 'error',
              plain: true,
              showClose: true,
            })
        }
    }
  
    // 防抖搜索优化
    let searchTimer = null
    const handleSearch = () => {
        if (searchTimer) clearTimeout(searchTimer)
        searchTimer = setTimeout(() => {
            pagination.pageIndex = 1
            fetchExchangeRatePages()
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
        fetchExchangeRatePages()
    }
  
    // 处理每页记录数变化
    const handleSizeChange = (size) => {
        pagination.pageSize = size
        pagination.pageIndex = 1
        fetchExchangeRatePages()
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
        
        editForm.currencyCode = ''
        editForm.exchangeCurrencyCode = ''
        editForm.exchangeRate = 1
        editForm.remark = ''
        // 清空原始兑换币别
        originalExchangeCurrencyCode.value = ''
        
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
  
    // 新增汇率数据
    const insertExchangeRate = async () => {
        const params = {
            ...editForm
        }
  
        const res = await post(INSERT_EXCHANGE_RATE_API.INSERT_EXCHANGE_RATE, params)
  
        if (res && res.code === '200') {
            resetForm()
            ElMessage({
              message: res.message || t('SystemBasicMgmt.exchangeRateInfo.saveSuccess'),
              type: 'success',
              plain: true,
              showClose: true,
            })
            dialogVisible.value = false
            fetchExchangeRatePages()
        } else {
            ElMessage({
              message: res.message || t('SystemBasicMgmt.exchangeRateInfo.operationFailed'),
              type: 'error',
              plain: true,
              showClose: true,
            })
        }
    }

    // 更新汇率数据
    const updateExchangeRate = async () => {
        const params = {
            ...editForm
        }

        const res = await post(UPDATE_EXCHANGE_RATE_API.UPDATE_EXCHANGE_RATE, params)

        if (res && res.code === '200') {
            resetForm()
            ElMessage({
              message: res.message || t('SystemBasicMgmt.exchangeRateInfo.updateSuccess'),
              type: 'success',
              plain: true,
              showClose: true,
            })
            dialogVisible.value = false
            fetchExchangeRatePages()
        } else {
            ElMessage({
              message: res.message || t('SystemBasicMgmt.exchangeRateInfo.operationFailed'),
              type: 'error',
              plain: true,
              showClose: true,
            })
        }
    }
  
    // 删除汇率数据
    const deleteExchangeRate = async (row) => {
        const params = {
            currencyCode: row.currencyCode,
            exchangeCurrencyCode: row.exchangeCurrencyCode,
            exchangeRate: row.exchangeRate,
            remark: row.remark || ''
        }
  
        const res = await post(DELETE_EXCHANGE_RATE_API.DELETE_EXCHANGE_RATE, params)
  
        if (res && res.code === '200') {
            ElMessage({
              message: res.message || t('SystemBasicMgmt.exchangeRateInfo.deleteSuccess'),
              type: 'success',
              plain: true,
              showClose: true,
            })
            fetchExchangeRatePages()
        } else {
            ElMessage({
              message: res.message || t('SystemBasicMgmt.exchangeRateInfo.operationFailed'),
              type: 'error',
              plain: true,
              showClose: true,
            })
        }
    }
  
    // 处理新增操作
    const handleAdd = () => {
        // 重置表单数据
        resetForm()
        // 设置为新增模式
        isEditMode.value = false
        dialogTitle.value = t('SystemBasicMgmt.exchangeRateInfo.addExchangeRate')
        // 显示对话框
        dialogVisible.value = true
    }

    // 处理编辑操作
    const handleEdit = async (index, row) => {
        // 重置表单数据
        resetForm()
        // 获取汇率详情数据
        await fetchExchangeRateEntity(row.currencyCode)
        // 设置为编辑模式
        isEditMode.value = true
        dialogTitle.value = t('SystemBasicMgmt.exchangeRateInfo.editExchangeRate')
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
            t('SystemBasicMgmt.exchangeRateInfo.deleteConfirm'),
            t('common.tip'),
            {
                confirmButtonText: t('common.confirm'),
                cancelButtonText: t('common.cancel'),
                type: 'warning',
            }
        )
            .then(() => {
                deleteExchangeRate(row)
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
                if (isEditMode.value) {
                    updateExchangeRate()
                } else {
                    insertExchangeRate()
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
  
