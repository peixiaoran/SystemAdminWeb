<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="字典搜索表单">
              <el-form-item :label="$t('systemBasicmgmt.dictionaryInfo.filter.dicType')">
                  <el-select style="width: 180px;"
                            v-model="filters.dicType"
                            :placeholder="$t('systemBasicmgmt.dictionaryInfo.pleaseSelectDicType')"
                            clearable>
                      <el-option
                          v-for="(label, value) in $t('systemBasicmgmt.dictionaryInfo.dicTypes')"
                          :key="value"
                          :label="label"
                          :value="value">
                      </el-option>
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
                      {{ $t('systemBasicmgmt.dictionaryInfo.addDictionary') }}
                  </el-button>
              </el-form-item>
          </el-form>

          <!-- 表格区域 -->
          <div class="table-container">
              <el-table :data="dictionaryList"
                        border
                        stripe
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('systemBasicmgmt.dictionaryInfo.index')" width="60" align="center" fixed />
                  <el-table-column prop="dicType" :label="$t('systemBasicmgmt.dictionaryInfo.dicType')" align="center" min-width="120">
                      <template #default="scope">
                          {{ $t(`systemBasicmgmt.dictionaryInfo.dicTypes.${scope.row.dicType}`) }}
                      </template>
                  </el-table-column>
                  <el-table-column prop="dicCode" :label="$t('systemBasicmgmt.dictionaryInfo.dicCode')" align="left" min-width="150" />
                  <el-table-column prop="dicName" :label="$t('systemBasicmgmt.dictionaryInfo.dicName')" align="left" min-width="200" />
                  <el-table-column prop="createdDate" :label="$t('systemBasicmgmt.dictionaryInfo.createdDate')" min-width="180" />
                  <el-table-column :label="$t('systemBasicmgmt.dictionaryInfo.operation')" min-width="150" fixed="right">
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
                             :total="pagination.total"
                             @size-change="handleSizeChange"
                             @current-change="handlePageChange" />
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
          <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="字典编辑表单">
              <div class="form-row">
                  <el-form-item :label="$t('systemBasicmgmt.dictionaryInfo.dicType')" prop="dicType">
                      <el-select v-model="editForm.dicType" style="width:100%" :placeholder="$t('systemBasicmgmt.dictionaryInfo.pleaseSelectDicType')">
                          <el-option
                              v-for="(label, value) in $t('systemBasicmgmt.dictionaryInfo.dicTypes')"
                              :key="value"
                              :label="label"
                              :value="value">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('systemBasicmgmt.dictionaryInfo.dicCode')" prop="dicCode">
                      <el-input v-model="editForm.dicCode" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row full-width">
                  <el-form-item :label="$t('systemBasicmgmt.dictionaryInfo.dicName')" prop="dicName">
                      <el-input v-model="editForm.dicName" style="width:100%" />
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
    GET_DICTIONARY_PAGES_API, 
    INSERT_DICTIONARY_API, 
    DELETE_DICTIONARY_API, 
    GET_DICTIONARY_ENTITY_API, 
    UPDATE_DICTIONARY_API 
  } from '@/config/api/systemBasicmgmt/syssettings-module/dictionary'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  // 初始化i18n
  const { t } = useI18n()

  // 字典数据
  const dictionaryList = ref([])
  const loading = ref(false)

  // 表单引用
  const editFormRef = ref(null)

  // 分页信息
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
      total: 0
  })

  // 过滤条件
  const filters = reactive({
      dicType: '',
  })

  // Composition API

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      dicId: '',
      dicType: '',
      dicCode: '',
      dicName: '',
      createdBy: 1,
      createdDate: '',
      modifiedBy: 1,
      modifiedDate: ''
  })

  // 对话框标题
  const dialogTitle = ref(t('systemBasicmgmt.dictionaryInfo.editDictionary'))

  // 表单验证规则
  const formRules = reactive({
      dicType: [
          { required: true, message: () => t('systemBasicmgmt.dictionaryInfo.pleaseSelectDicType'), trigger: 'change' }
      ],
      dicCode: [
          { required: true, message: () => t('systemBasicmgmt.dictionaryInfo.pleaseInputDicCode'), trigger: 'blur' }
      ],
      dicName: [
          { required: true, message: () => t('systemBasicmgmt.dictionaryInfo.pleaseInputDicName'), trigger: 'blur' }
      ]
  })

  // 在组件挂载后获取字典数据
  onMounted(() => {
      fetchDictionaryPages()
  })

  // 获取字典实体数据
  const fetchDictionaryEntity = async (dictionaryInfoId) => {
      const params = {
          dictionaryInfoId: dictionaryInfoId
      }
      
      const res = await post(GET_DICTIONARY_ENTITY_API.GET_DICTIONARY_ENTITY, params)

      if (res && res.code === '200') {
          editForm.dicId = res.data.dicId
          editForm.dicType = res.data.dicType
          editForm.dicCode = res.data.dicCode
          editForm.dicName = res.data.dicName
          editForm.createdBy = res.data.createdBy
          editForm.createdDate = res.data.createdDate
          editForm.modifiedBy = res.data.modifiedBy
          editForm.modifiedDate = res.data.modifiedDate
      }
  }

  // 获取字典列表数据
  const fetchDictionaryPages = async () => {
      loading.value = true
      const params = {
          dicType: filters.dicType,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalCount: pagination.total
      }

      const res = await post(GET_DICTIONARY_PAGES_API.GET_DICTIONARY_PAGES, params)

      if (res && res.code === '200') {
          dictionaryList.value = res.data || []
          pagination.total = res.totalNumber || 0
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.dictionaryInfo.getFailed'))
      }
      loading.value = false
  }

  // 防抖搜索优化
  let searchTimer = null
  const handleSearch = () => {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
          pagination.pageIndex = 1
          fetchDictionaryPages()
      }, 300) // 300ms防抖
  }

  // 重置搜索条件
  const handleReset = () => {
      filters.dicType = ''
      pagination.pageIndex = 1
      fetchDictionaryPages()
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchDictionaryPages()
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchDictionaryPages()
  }

  const resetForm = (clearValidation = true) => {
      // 先清除验证状态（在重置数据之前）
      if (clearValidation && editFormRef.value) {
          try {
              editFormRef.value.clearValidate()
          } catch (error) {
              console.warn('清除表单验证状态失败:', error)
          }
      }
      
      editForm.dicId = ''
      editForm.dicType = ''
      editForm.dicCode = ''
      editForm.dicName = ''
      editForm.createdBy = 1
      editForm.createdDate = ''
      editForm.modifiedBy = 1
      editForm.modifiedDate = ''
      
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

  // 新增字典数据
  const insertDictionary = async () => {
      const params = {
          ...editForm
      }

      const res = await post(INSERT_DICTIONARY_API.INSERT_DICTIONARY, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message || t('systemBasicmgmt.dictionaryInfo.saveSuccess'))
          dialogVisible.value = false
          fetchDictionaryPages()
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.dictionaryInfo.operationFailed'))
      }
  }

  // 更新字典数据
  const updateDictionary = async () => {
      const params = {
          ...editForm
      }
      const res = await post(UPDATE_DICTIONARY_API.UPDATE_DICTIONARY, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message || t('systemBasicmgmt.dictionaryInfo.updateSuccess'))
          dialogVisible.value = false
          fetchDictionaryPages()
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.dictionaryInfo.operationFailed'))
      }
  }

  // 删除字典数据
  const deleteDictionary = async (dicId) => {
      const params = {
          DicId: dicId
      }

      const res = await post(DELETE_DICTIONARY_API.DELETE_DICTIONARY, params)

      if (res && res.code === '200') {
          ElMessage.success(res.message || t('systemBasicmgmt.dictionaryInfo.deleteSuccess'))
          fetchDictionaryPages()
      } else {
          ElMessage.error(res.message || t('systemBasicmgmt.dictionaryInfo.operationFailed'))
      }
  }

  // 处理新增操作
  const handleAdd = () => {
      // 重置表单数据
      resetForm()
      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.dictionaryInfo.addDictionary')
      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑操作
  const handleEdit = async (index, row) => {
      // 重置表单数据
      resetForm()
      // 获取字典实体数据
      await fetchDictionaryEntity(row.dicId)
      // 设置对话框标题
      dialogTitle.value = t('systemBasicmgmt.dictionaryInfo.editDictionary')
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
          t('systemBasicmgmt.dictionaryInfo.deleteConfirm'),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning',
          }
      )
          .then(() => {
              deleteDictionary(row.dicId)
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
              if (!editForm.dicId) {
                  insertDictionary()
              } else {
                  updateDictionary()
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
