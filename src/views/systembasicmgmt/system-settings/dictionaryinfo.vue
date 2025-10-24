<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="字典搜索表单">
              <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.filter.module')">
                  <el-select v-model="filters.moduleId"
                            style="width: 180px;"
                            :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseSelectModule')"
                            @change="handleModuleChange">
                      <el-option
                          v-for="module in moduleList"
                          :key="module.moduleId"
                          :label="module.moduleName"
                          :value="module.moduleId"
                          :disabled="module.disabled" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.filter.dicType')">
                  <el-select v-model="filters.dicType"
                            style="width: 180px;"
                            :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseSelectDicType')"
                            clearable>
                      <el-option
                          v-for="dicType in dicTypeList"
                          :key="dicType.dicTypeCode"
                          :label="dicType.dicTypeName"
                          :value="dicType.dicTypeCode" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.filter.dicNameCn')">
                  <el-input v-model="filters.dicName"
                           style="width: 180px;"
                           :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameCn')"
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
                      {{ $t('systembasicmgmt.dictionaryInfo.addDictionary') }}
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
                  <el-table-column type="index" :label="$t('systembasicmgmt.dictionaryInfo.index')" width="70" align="center" fixed />
                  <el-table-column prop="dicType" :label="$t('systembasicmgmt.dictionaryInfo.dicType')" align="center" min-width="200"/>
                  <el-table-column prop="dicCode" :label="$t('systembasicmgmt.dictionaryInfo.dicCode')" align="left" min-width="180" />
                  <el-table-column prop="dicNameCn" :label="$t('systembasicmgmt.dictionaryInfo.dicNameCn')" align="left" min-width="230" />
                  <el-table-column prop="dicNameEn" :label="$t('systembasicmgmt.dictionaryInfo.dicNameEn')" align="left" min-width="230" />
                  <el-table-column :label="$t('systembasicmgmt.dictionaryInfo.operation')" min-width="130" fixed="right" align="center">
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
                 width="50%"
                 :close-on-click-modal="false"
                 :append-to-body="true"
                 :modal-append-to-body="true"
                 :lock-scroll="true"
                 @close="handleDialogClose">
          <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="字典编辑表单">
              <div class="form-row">
                  <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.dicType')" prop="dicType">
                      <el-input v-model="editForm.dicType" 
                               style="width:100%" 
                               :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseInputDicType')" />
                  </el-form-item>
                  <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.dicCode')" prop="dicCode">
                      <el-input v-model.number="editForm.dicCode" 
                               type="number" 
                               style="width:100%" 
                               :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseInputDicCode')" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.dicNameCn')" prop="dicNameCn">
                      <el-input v-model="editForm.dicNameCn" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.dicNameEn')" prop="dicNameEn">
                      <el-input v-model="editForm.dicNameEn" style="width:100%" />
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
    UPDATE_DICTIONARY_API,
    GET_MODULE_DROP_DOWN_API,
    GET_DIC_TYPE_DROP_DOWN_API
  } from '@/config/api/systembasicmgmt/system-settings/dictionary'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'

  // 初始化i18n
  const { t } = useI18n()

  // 字典数据
  const dictionaryList = ref([])
  const loading = ref(false)

  // 模块和字典类型数据
  const moduleList = ref([])
  const dicTypeList = ref([])

  // 表单引用
  const editFormRef = ref(null)

  // 分页信息
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0
  })

  // 过滤条件
  const filters = reactive({
      moduleId: '',
      dicType: '',
      dicName: '',
  })

  // Composition API

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑模式标志
  const isEditMode = ref(false)

  // 编辑表单
  const editForm = reactive({
      dicId: 1,
      dicType: '',
      dicCode: 0,
      dicNameCn: '',
      dicNameEn: '',
      createdBy: 1,
      createdDate: '',
      modifiedBy: 1,
      modifiedDate: ''
  })

  // 对话框标题
  const dialogTitle = ref(t('systembasicmgmt.dictionaryInfo.editDictionary'))

  // 表单验证规则
  const formRules = reactive({
      dicType: [
          { required: true, message: () => t('systembasicmgmt.dictionaryInfo.pleaseSelectDicType'), trigger: 'change' }
      ],
      dicCode: [
          { required: true, message: () => t('systembasicmgmt.dictionaryInfo.pleaseInputDicCode'), trigger: 'blur' }
      ],
      dicNameCn: [
{ required: true, message: () => t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameCn'), trigger: 'blur' }
],
      dicNameEn: [
          { required: true, message: () => t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameEn'), trigger: 'blur' }
      ]
  })

  // 在组件挂载后获取字典数据
  onMounted(() => {
      getModuleDropDown()
      // 如果有默认的模块ID，则获取对应的字典类型列表
      if (filters.moduleId) {
          getDicTypeDropDown(filters.moduleId)
      }
      fetchDictionaryPages()
  })

  // 获取字典实体数据
  const fetchDictionaryEntity = async (dicId) => {
      const params = {
          dicId: String(dicId)
      }
      
      const res = await post(GET_DICTIONARY_ENTITY_API.GET_DICTIONARY_ENTITY, params)

      if (res && res.code === 200) {
          editForm.dicId = res.data.dicId
          editForm.dicType = res.data.dicType
          editForm.dicCode = res.data.dicCode
          editForm.dicNameCn = res.data.dicNameCn
          editForm.dicNameEn = res.data.dicNameEn
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
          moduleId: filters.moduleId,
          dicType: filters.dicType,
          dicName: filters.dicName,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
      }

      const res = await post(GET_DICTIONARY_PAGES_API.GET_DICTIONARY_PAGES, params)

      if (res && res.code === 200) {
          dictionaryList.value = res.data || []
          pagination.totalCount = res.totalCount || 0
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
      loading.value = false
  }

  // 获取模块下拉列表
  const getModuleDropDown = async () => {
      try {
          const response = await post(GET_MODULE_DROP_DOWN_API.GET_MODULE_DROP_DOWN, {})
          if (response && response.code === 200) {
              moduleList.value = response.data || []
              // 如果有模块数据，自动选择第一个模块并获取对应的字典类型列表
              if (moduleList.value.length > 0) {
                  filters.moduleId = moduleList.value[0].moduleId
                  getDicTypeDropDown(filters.moduleId)
              }
          } else {
              ElMessage.error(response.message)
          }
      } catch (error) {
          console.error('获取模块列表失败:', error)
          ElMessage.error('获取模块列表失败')
      }
  }

  // 获取字典类型下拉列表
  const getDicTypeDropDown = async (moduleId) => {
      if (!moduleId) {
          dicTypeList.value = []
          return
      }
      
      try {
          const params = {
            moduleId: moduleId,
          }
          const response = await post(GET_DIC_TYPE_DROP_DOWN_API.GET_DIC_TYPE_DROP_DOWN, params)
          if (response && response.code === 200) {
              dicTypeList.value = response.data || []
          } else {
              ElMessage.error(response.message)
          }
      } catch (error) {
          console.error('获取字典类型列表失败:', error)
          ElMessage.error('获取字典类型列表失败')
      }
  }

  // 模块变化处理
  const handleModuleChange = (moduleId) => {
      filters.dicType = '' // 清空字典类型选择
      getDicTypeDropDown(moduleId)
  }

  // 使用通用防抖工具
  const debouncedFetchDictionaryPages = debounce(() => {
      fetchDictionaryPages()
  }, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

  // 处理搜索操作（带防抖）
  const handleSearch = () => {
      pagination.pageIndex = 1
      loading.value = true
      debouncedFetchDictionaryPages()
  }

  // 立即查询数据（不使用防抖，用于保存后刷新）
  const fetchDictionaryPagesImmediate = () => {
      fetchDictionaryPages()
  }

  // 重置搜索条件
  const handleReset = () => {
      loading.value = true // 显示加载状态
      filters.moduleId = ''
      filters.dicType = ''
      filters.dicName = ''
      dicTypeList.value = [] // 清空字典类型列表
      pagination.pageIndex = 1
      fetchDictionaryPages()
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      loading.value = true // 显示加载状态
      pagination.pageIndex = page
      fetchDictionaryPages()
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      loading.value = true // 显示加载状态
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
              console.warn('清除表单验证状态失败', error)
          }
      }
      
      editForm.dicId = 1
      editForm.dicType = ''
      editForm.dicCode = 0
      editForm.dicNameCn = ''
      editForm.dicNameEn = ''
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
                      console.warn('清除表单验证状态失败', error)
                  }
              }
          })
      }
  }

  // 新增字典数据
  const insertDictionary = async () => {
      const params = {
          dicType: editForm.dicType,
          dicCode: editForm.dicCode,
          dicNameCn: editForm.dicNameCn,
          dicNameEn: editForm.dicNameEn
      }
      const res = await post(INSERT_DICTIONARY_API.INSERT_DICTIONARY, params)

      if (res && res.code === 200) {
          resetForm()
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          dialogVisible.value = false
          fetchDictionaryPages()
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 更新字典数据
  const updateDictionary = async () => {
      const params = {
          ...editForm
      }
      const res = await post(UPDATE_DICTIONARY_API.UPDATE_DICTIONARY, params)

      if (res && res.code === 200) {
          resetForm()
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          dialogVisible.value = false
          fetchDictionaryPages()
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 删除字典数据
  const deleteDictionary = async (dicId) => {
      const params = {
          dicId: dicId
      }

      const res = await post(DELETE_DICTIONARY_API.DELETE_DICTIONARY, params)

      if (res && res.code === 200) {
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          fetchDictionaryPages()
      } else {
          ElMessage.error(res.message)
      }
  }

  // 处理新增操作
  const handleAdd = () => {
      // 重置表单数据
      resetForm()
      // 设置为新增模式
      isEditMode.value = false
      // 设置对话框标题
      dialogTitle.value = t('systembasicmgmt.dictionaryInfo.addDictionary')
      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑操作
  const handleEdit = async (index, row) => {
      // 重置表单数据
      resetForm()
      // 设置为编辑模式
      isEditMode.value = true
      // 获取字典实体数据
      await fetchDictionaryEntity(row.dicId)
      // 设置对话框标题
      dialogTitle.value = t('systembasicmgmt.dictionaryInfo.editDictionary')
      // 显示对话框
      dialogVisible.value = true
  }

  // 处理删除操作
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('systembasicmgmt.dictionaryInfo.deleteConfirm'),
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
              if (isEditMode.value) {
                  updateDictionary()
              } else {
                  insertDictionary()
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
