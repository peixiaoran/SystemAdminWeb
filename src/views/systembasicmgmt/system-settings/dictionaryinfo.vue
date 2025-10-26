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
                      <el-select v-model="editForm.dicType"
                                style="width:100%"
                                :placeholder="$t('systembasicmgmt.dictionaryInfo.pleaseSelectDicType')"
                                clearable>
                          <el-option
                              v-for="dicType in dicTypeList"
                              :key="dicType.dicTypeCode"
                              :label="dicType.dicTypeName"
                              :value="dicType.dicTypeCode" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('systembasicmgmt.dictionaryInfo.dicCode')" prop="dicCode">
                      <el-input v-model="editForm.dicCode" 
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
                  <el-button @click="handleDialogClose">{{ $t('common.cancel') }}</el-button>
                  <el-button type="primary" @click="handleSave">{{ $t('common.save') }}</el-button>
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

  // 模块下拉选项
  const moduleList = ref([])

  // 字典类型下拉选项
  const dicTypeList = ref([])

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
      moduleId: '',
      dicType: '',
      dicName: ''
  })

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      dicId: '',
      dicType: '',
      dicCode: '',
      dicNameCn: '',
      dicNameEn: ''
  })

  // 对话框标题
  const dialogTitle = ref(t('systembasicmgmt.dictionaryInfo.editDictionary'))

  // 表单验证规则
  const formRules = reactive({
      dicType: [
          { required: true, message: t('systembasicmgmt.dictionaryInfo.pleaseSelectDicType'), trigger: 'change' }
      ],
      dicCode: [
          { required: true, message: t('systembasicmgmt.dictionaryInfo.pleaseInputDicCode'), trigger: 'blur' }
      ],
      dicNameCn: [
          { required: true, message: t('systembasicmgmt.dictionaryInfo.pleaseInputDicNameCn'), trigger: 'blur' }
      ]
  })

  // 在组件挂载后获取数据
  onMounted(async () => {
      await fetchModuleDropDown()
      await fetchDicTypeDropDown()
      fetchDictionaryPages()
  })

  // 获取模块下拉框数据
  const fetchModuleDropDown = async () => {
      try {
          const res = await post(GET_MODULE_DROP_DOWN_API.GET_MODULE_DROP_DOWN)
          if (res && res.code === 200) {
              moduleList.value = res.data || []
              // 默认选中第一个模块
              if (moduleList.value.length > 0 && !filters.moduleId) {
                  filters.moduleId = moduleList.value[0].moduleId
              }
          } else {
              ElMessage.error(res?.message || t('systembasicmgmt.dictionaryInfo.getModuleDropDownFailed'))
          }
      } catch (error) {
          ElMessage.error(t('systembasicmgmt.dictionaryInfo.getModuleDropDownFailed'))
      }
  }

  // 获取字典类型下拉框数据
  const fetchDicTypeDropDown = async () => {
      try {
          const params = {
              moduleId: filters.moduleId || ''
          }
          
          const res = await post(GET_DIC_TYPE_DROP_DOWN_API.GET_DIC_TYPE_DROP_DOWN, params)
          if (res && res.code === 200) {
              dicTypeList.value = res.data || []
              // 默认选中第一个字典类型
              if (dicTypeList.value.length > 0 && !filters.dicType) {
                  filters.dicType = dicTypeList.value[0].dicTypeCode
              }
          } else {
              ElMessage.error(res?.message || t('systembasicmgmt.dictionaryInfo.getDicTypeDropDownFailed'))
          }
      } catch (error) {
          ElMessage.error(t('systembasicmgmt.dictionaryInfo.getDicTypeDropDownFailed'))
      }
  }

  // 获取字典实体数据
  const fetchDictionaryEntity = async (dicId) => {
      try {
          const res = await post(GET_DICTIONARY_ENTITY_API.GET_DICTIONARY_ENTITY, { dicId })
          if (res && res.code === 200) {
              return res.data
          } else {
              ElMessage.error(res?.message || t('systembasicmgmt.dictionaryInfo.getDictionaryEntityFailed'))
              return null
          }
      } catch (error) {
          ElMessage.error(t('systembasicmgmt.dictionaryInfo.getDictionaryEntityFailed'))
          return null
      }
  }

  // 获取字典列表数据
  const fetchDictionaryPages = async () => {
      try {
          loading.value = true
          const params = {
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
              moduleId: filters.moduleId || '',
              dicType: filters.dicType || '',
              dicName: filters.dicName || ''
          }
          
          const res = await post(GET_DICTIONARY_PAGES_API.GET_DICTIONARY_PAGES, params)
          if (res && res.code === 200) {
              dictionaryList.value = res.data || []
              pagination.totalCount = res.totalCount || 0
          } else {
              ElMessage.error(res?.message || t('systembasicmgmt.dictionaryInfo.getDictionaryPagesFailed'))
          }
      } catch (error) {
          ElMessage.error(t('systembasicmgmt.dictionaryInfo.getDictionaryPagesFailed'))
      } finally {
          loading.value = false
      }
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
      loading.value = true
      filters.moduleId = ''
      filters.dicType = ''
      filters.dicName = ''
      pagination.pageIndex = 1
      fetchDictionaryPages()
  }

  // 处理模块变化
  const handleModuleChange = async () => {
      filters.dicType = ''
      await fetchDicTypeDropDown()
      handleSearch()
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
      editForm.dicId = ''
      editForm.dicType = ''
      editForm.dicCode = ''
      editForm.dicNameCn = ''
      editForm.dicNameEn = ''
      
      if (clearValidation) {
          nextTick(() => {
              if (editFormRef.value) {
                  editFormRef.value.clearValidate()
              }
          })
      }
  }

  // 新增字典数据
  const insertDictionary = async () => {
      try {
          const params = {
              dicType: editForm.dicType,
              dicCode: editForm.dicCode,
              dicNameCn: editForm.dicNameCn,
              dicNameEn: editForm.dicNameEn
          }
          
          const res = await post(INSERT_DICTIONARY_API.INSERT_DICTIONARY, params)
          if (res && res.code === 200) {
              ElMessage.success(t('systembasicmgmt.dictionaryInfo.addDictionarySuccess'))
              dialogVisible.value = false
              resetForm()
              fetchDictionaryPagesImmediate()
          } else {
              ElMessage.error(res?.message || t('systembasicmgmt.dictionaryInfo.addDictionaryFailed'))
          }
      } catch (error) {
          ElMessage.error(t('systembasicmgmt.dictionaryInfo.addDictionaryFailed'))
      }
  }

  // 更新字典数据
  const updateDictionary = async () => {
      try {
          const params = {
              dicId: editForm.dicId,
              dicType: editForm.dicType,
              dicCode: editForm.dicCode,
              dicNameCn: editForm.dicNameCn,
              dicNameEn: editForm.dicNameEn
          }
          
          const res = await post(UPDATE_DICTIONARY_API.UPDATE_DICTIONARY, params)
          if (res && res.code === 200) {
              ElMessage.success(t('systembasicmgmt.dictionaryInfo.updateDictionarySuccess'))
              dialogVisible.value = false
              resetForm()
              fetchDictionaryPagesImmediate()
          } else {
              ElMessage.error(res?.message || t('systembasicmgmt.dictionaryInfo.updateDictionaryFailed'))
          }
      } catch (error) {
          ElMessage.error(t('systembasicmgmt.dictionaryInfo.updateDictionaryFailed'))
      }
  }

  // 删除字典数据
  const deleteDictionary = async (dicId) => {
      try {
          const res = await post(DELETE_DICTIONARY_API.DELETE_DICTIONARY, { dicId })
          if (res && res.code === 200) {
              ElMessage.success(t('systembasicmgmt.dictionaryInfo.deleteDictionarySuccess'))
              
              // 如果当前页没有数据了，回到上一页
              if (dictionaryList.value.length === 1 && pagination.pageIndex > 1) {
                  pagination.pageIndex--
              }
              
              fetchDictionaryPagesImmediate()
          } else {
              ElMessage.error(res?.message || t('systembasicmgmt.dictionaryInfo.deleteDictionaryFailed'))
          }
      } catch (error) {
          ElMessage.error(t('systembasicmgmt.dictionaryInfo.deleteDictionaryFailed'))
      }
  }

  // 处理新增操作
  const handleAdd = () => {
      resetForm()
      dialogTitle.value = t('systembasicmgmt.dictionaryInfo.addDictionary')
      dialogVisible.value = true
      
      nextTick(() => {
          editFormRef.value?.focus()
      })
  }

  // 处理编辑操作
  const handleEdit = async (index, row) => {
      const dictionaryData = await fetchDictionaryEntity(row.dicId)
      if (dictionaryData) {
          Object.assign(editForm, dictionaryData)
          dialogTitle.value = t('systembasicmgmt.dictionaryInfo.editDictionary')
          dialogVisible.value = true
      }
  }

  // 处理删除操作
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('systembasicmgmt.dictionaryInfo.deleteDictionaryConfirm', { dicCode: row.dicCode }),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning'
          }
      ).then(() => {
          deleteDictionary(row.dicId)
      }).catch(() => {
          // 用户取消删除
      })
  }

  // 保存编辑结果
  const handleSave = () => {
      editFormRef.value.validate((valid) => {
          if (valid) {
              if (editForm.dicId) {
                  updateDictionary()
              } else {
                  insertDictionary()
              }
          }
      })
  }

  // 处理对话框关闭
  const handleDialogClose = () => {
      dialogVisible.value = false
      resetForm()
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>
