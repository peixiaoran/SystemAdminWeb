<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 搜索表单 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="搜索表单">
              <el-form-item :label="$t('systembasicmgmt.smenu.module')">
                      <el-select v-model="filters.moduleId" :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.smenu.module')" style="width:180px" @change="handleFiltermoduleChange">
                      <el-option v-for="item in moduleDropList" :key="item.moduleId" :label="item.moduleName" :value="item.moduleId" :disabled="item.disabled" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('systembasicmgmt.smenu.module')">
                      <el-select v-model="filters.parentMenuId" :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.smenu.module')" style="width:180px">
                      <el-option v-for="item in filterPMenuList" :key="item.menuId" :label="item.menuName" :value="item.menuId" :disabled="item.disabled" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('systembasicmgmt.smenu.smenuName')">
                  <el-input style="width: 200px" 
                            v-model="filters.smenuName" 
                            :placeholder="$t('systembasicmgmt.inputPlaceholder') + $t('systembasicmgmt.smenu.smenuName')" 
                            />
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="handleSearch" class="conventional-filter-form-button" plain>
                      {{ $t('common.search') }}
                  </el-button>
                  <el-button @click="handleReset">
                      {{ $t('common.reset') }}
                  </el-button>
              </el-form-item>
              <div class="form-right-button">
                  <el-button type="primary" @click="handleAdd">
<<<<<<< HEAD
                      {{ $t('systembasicmgmt.smenu.addSMenu') }}
=======
                      {{ $t('common.add') }}
>>>>>>> 0b4a429d474f7aa0cde76ccca9f663c67ce74256
                  </el-button>
              </div>
          </el-form>

          <!-- 表格 -->
          <div class="table-container">
              <el-table :data="smenuList"
                        style="width: 100%"
                        border
                        stripe
                        max-height="calc(100vh - 240px)"
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('systembasicmgmt.index')" width="70" align="center" fixed />
<<<<<<< HEAD
                  <el-table-column prop="menuCode" :label="$t('systembasicmgmt.smenu.smenuCode')" align="left" min-width="180" />
                  <el-table-column prop="menuNameCn" :label="$t('systembasicmgmt.smenu.smenuNameCn')" align="left" min-width="230" />
                  <el-table-column prop="menuNameEn" :label="$t('systembasicmgmt.smenu.smenuNameEn')" align="left" min-width="200" />
                  <el-table-column prop="menuTypeName" :label="$t('systembasicmgmt.smenu.menuType')" align="center" min-width="150" />
=======
                  <el-table-column prop="menuCode" :label="$t('systembasicmgmt.smenu.smenuCode')" align="left" min-width="200" />
                  <el-table-column prop="menuNameCn" :label="$t('systembasicmgmt.smenu.smenuNameCn')" align="left" min-width="260" />
                  <el-table-column prop="menuNameEn" :label="$t('systembasicmgmt.smenu.smenuNameEn')" align="left" min-width="230" />
>>>>>>> 0b4a429d474f7aa0cde76ccca9f663c67ce74256
                  <el-table-column prop="path" :label="$t('systembasicmgmt.smenu.pagePath')" align="left" min-width="420" />
                  <el-table-column prop="menuIcon" :label="$t('systembasicmgmt.smenu.smenuIcon')" align="center" min-width="180" />
                  <el-table-column prop="isEnabled" :label="$t('systembasicmgmt.isEnabled')" align="center" min-width="90">
                      <template #default="scope">
                          <div class="flex">
                              <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                                  {{ scope.row.isEnabled ? $t('systembasicmgmt.enabled') : $t('systembasicmgmt.disabled') }}
                              </el-tag>
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="isVisible" :label="$t('systembasicmgmt.isVisible')" align="center" min-width="90">
                      <template #default="scope">
                          <div class="flex">
                              <el-tag :type="scope.row.isVisible ? 'success' : 'danger'">
                                  {{ scope.row.isVisible ? $t('systembasicmgmt.visible') : $t('systembasicmgmt.hidden') }}
                              </el-tag>
                          </div>
                      </template>
                  </el-table-column>
                <el-table-column :label="$t('systembasicmgmt.operation')" min-width="150" fixed="right" align="center">
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

      <!-- 编辑弹窗 -->
      <el-dialog v-model="dialogVisible"
                 :title="dialogTitle"
                 width="50%"
                 :close-on-click-modal="false"
                 :append-to-body="true"
                 :modal-append-to-body="true"
                 :lock-scroll="true"
                 @close="handleDialogClose">
          <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="110px" class="dialog-form" role="form" aria-label="编辑表单">
              <div class="form-row">
                  <el-form-item :label="$t('systembasicmgmt.smenu.smenuCode')" prop="menuCode">
                      <el-input v-model="editForm.menuCode" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systembasicmgmt.smenu.smenuNameCn')" prop="menuNameCn">
                      <el-input v-model="editForm.menuNameCn" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systembasicmgmt.smenu.smenuNameEn')" prop="menuNameEn">
                      <el-input v-model="editForm.menuNameEn" style="width:100%" />
                  </el-form-item>
                  <el-form-item :label="$t('systembasicmgmt.smenu.module')" prop="moduleId">
                      <el-select v-model="editForm.moduleId" style="width:100%" clearable :placeholder="$t('systembasicmgmt.smenu.pleaseSelectmodule')" @change="handlemoduleChange">
                          <el-option v-for="item in moduleDropList" :key="item.moduleId" :label="item.moduleName" :value="item.moduleId" :disabled="item.disabled" />
                      </el-select>
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systembasicmgmt.smenu.module')" prop="parentMenuId">
                      <el-select v-model="editForm.parentMenuId" style="width:100%" clearable :placeholder="$t('systembasicmgmt.smenu.pleaseSelectModule')">
                          <el-option v-for="item in pmenuDropList" :key="item.menuId" :label="item.menuName" :value="item.menuId" :disabled="item.disabled" />
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('systembasicmgmt.smenu.smenuIcon')" prop="menuIcon">
                      <el-input v-model="editForm.menuIcon" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systembasicmgmt.smenu.sortOrder')" prop="sortOrder">
                      <el-input-number v-model="editForm.sortOrder" style="width:100%" :min="1" :precision="0" />
                  </el-form-item>
                  <el-form-item :label="$t('systembasicmgmt.smenu.pagePath')" prop="path">
                      <el-input v-model="editForm.path" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('systembasicmgmt.smenu.apiRoute')" prop="routePath">
                      <el-input v-model="editForm.routePath" style="width:100%" />
                  </el-form-item>
              </div>
              <div class="form-row full-width">
                                     <el-form-item :label="$t('systembasicmgmt.remarks')">
                      <el-input v-model="editForm.remarks" style="width:100%" type="textarea" :rows="3" />
                  </el-form-item>
              </div>
              <div class="form-row">
                <el-form-item :label="$t('systembasicmgmt.isEnabled')">
                      <el-switch v-model="editForm.isEnabled"
                                 :active-value="1"
                                 :inactive-value="0"
                                 :active-text="$t('common.yes')"
                                 :inactive-text="$t('common.no')"
                                 inline-prompt
                                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
                  </el-form-item>
                  <el-form-item :label="$t('systembasicmgmt.isVisible')">
                      <el-switch v-model="editForm.isVisible"
                                 :active-value="1"
                                 :inactive-value="0"
                                 :active-text="$t('common.yes')"
                                 :inactive-text="$t('common.no')"
                                 inline-prompt
                                 style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
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
  import { GET_SMENU_PAGES_API, GET_SMENU_ENTITY_API, INSERT_SMENU_API, DELETE_SMENU_API, GET_MODULE_DROP_API, GET_PMENU_DROP_API, UPDATE_SMENU_API, GET_MENU_TYPE_API } from '@/config/api/systembasicmgmt/system-mgmt/smenu'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'

  // 使用i18n
  const { t } = useI18n()

  // 二级菜单数据
  const smenuList = ref([])
  const loading = ref(false)
  const moduleDropList = ref([])
  const pmenuDropList = ref([])
  const menuTypeOptions = ref([])

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
      smenuCode: '',
      smenuName: '',
      smenuNameEn: '',
      smenuUrl: '',
      moduleId: '',
      parentMenuId: ''
  })

  // 过滤模块列表
  const filterPMenuList = ref([])

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      menuId: '',
      parentMenuId: '',
      moduleId: '',
      menuCode: '',
      menuNameCn: '',
      menuNameEn: '',
      menuType: '',
      menuUrl: '',
      menuIcon: '',
      sortOrder: 1,

      isEnabled: 1,
      isVisible: 1,
      level: 1,
      routePath: '',
      path: '',
      redirect: '',
      remarks: ''
  })
  // 对话框标题
  const dialogTitle = ref('')

  // 表单验证规则
  const formRules = reactive({
      menuCode: [
          { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputSmenuCode'), trigger: 'blur' }
      ],
      menuNameCn: [
{ required: true, message: () => t('systembasicmgmt.smenu.pleaseInputSmenuNameCn'), trigger: 'blur' }
      ],
      menuNameEn: [
          { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputSmenuNameEn'), trigger: 'blur' }
      ],
      moduleId: [
          { required: true, message: () => t('systembasicmgmt.smenu.pleaseSelectModule'), trigger: 'change' }
      ],
      parentMenuId: [
          { required: true, message: () => t('systembasicmgmt.smenu.pleaseSelectModule'), trigger: 'change' }
      ],
      menuIcon: [
          { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputSmenuIcon'), trigger: 'blur' }
      ],
      sortOrder: [
          { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputSortOrder'), trigger: 'blur' }
      ],
      path: [
          { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputPagePath'), trigger: 'blur' }
      ],
      menuType: [
          { required: true, message: () => t('systembasicmgmt.smenu.pleaseSelectSmenuType'), trigger: 'change' }
      ],
      
      routePath: [
          { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputApiRoute'), trigger: 'blur' }
      ],
      redirect: [
          // redirect 可为空，移除必填验证
      ]
  })

  // 组件挂载后获取网域数据
  onMounted(() => {
      initPageData() // 初始化页面数据，设置查询条件默认值
      fetchMenuTypeOptions() // 获取菜单类型选项
  })

  // 初始化页面数据（只在页面加载时调用）
  const initPageData = async () => {
      try {
          const res = await post(GET_MODULE_DROP_API.GET_MODULE_DROP)
          // 对获取的数据进行XSS清洗
          moduleDropList.value = res.data || []

          // 默认选中第一个未禁用的网域（用于查询条件）
          if (moduleDropList.value.length > 0) {
              const firstEnabledmodule = moduleDropList.value.find(item => !item.disabled)
              if (firstEnabledmodule) {
                  filters.moduleId = firstEnabledmodule.moduleId
                  // 获取对应的模块列表
                  await fetchFilterPMenuDrop()
              }
          }

          // 应用默认值进行初始查询
          fetchSMenuPages()
      } catch (error) {
          console.error('初始化页面数据失败:', error)
          ElMessage({
              message: '初始化页面数据失败，请刷新页面重试',
              type: 'error',
              plain: true,
              duration: 3000
          })
      }
  }

  // 获取模块数据（用于新增时设置默认值）
  const fetchModuleDrop = async () => {
      try {
          const res = await post(GET_MODULE_DROP_API.GET_MODULE_DROP)
          // 对获取的数据进行XSS清洗
          moduleDropList.value = res.data || []

          // 新增时默认选中第一个未禁用的模块
          if (dialogTitle.value === t('systembasicmgmt.smenu.addSMenu') && moduleDropList.value.length > 0) {
              const firstEnabledModule = moduleDropList.value.find(item => !item.disabled)
              if (firstEnabledModule) {
                  editForm.moduleId = firstEnabledModule.moduleId
                  // 根据选中的模块获取父菜单列表
                  fetchPMenuDrop(true)
              }
          }
      } catch (error) {
          console.error('获取模块数据失败:', error)
          ElMessage({
              message: '获取模块数据失败，请刷新页面重试',
              type: 'error',
              plain: true,
              duration: 3000
          })
      }
  }

  // 获取模块数据
  const fetchPMenuDrop = async (setDefaultValue = false) => {
      if (!editForm.moduleId) {
          pmenuDropList.value = []
          return
      }

      try {
          const params = {
              moduleId: editForm.moduleId
          }
          const res = await post(GET_PMENU_DROP_API.GET_PMENU_TYPE, params)
          // 对获取的数据进行XSS清洗
          pmenuDropList.value = res.data || []

          // 只有当需要设置默认值且是新增时才设置默认值
          if (setDefaultValue && dialogTitle.value === t('systembasicmgmt.smenu.addSMenu') && pmenuDropList.value.length > 0) {
                const firstEnabledPMenu = pmenuDropList.value.find(item => !item.disabled)
                if (firstEnabledPMenu) {
                    editForm.parentMenuId = firstEnabledPMenu.menuId
                }
          }
      } catch (error) {
          console.error('获取父菜单数据失败:', error)
          ElMessage({
              message: '获取父菜单数据失败，请刷新页面重试',
              type: 'error',
              plain: true,
              duration: 3000
          })
      }
  }

  // 获取实体数据
  const fetchSMenuEntity = async (menuId) => {
      try {
          const params = {
              menuId: menuId
          }
          const res = await post(GET_SMENU_ENTITY_API.GET_SMENU_ENTITY, params)

          if (res && res.code === 200) {
              // 还原原始的 parentMenuId 值
              const originalParentMenuId = res.data.parentMenuId
              
              // 填充表单数据
              editForm.menuId = res.data.menuId
              editForm.menuCode = res.data.menuCode || ''
              editForm.menuNameCn = res.data.menuNameCn || ''
              editForm.menuNameEn = res.data.menuNameEn || ''
              editForm.moduleId = res.data.moduleId
              editForm.menuType = String(res.data.menuType || '')
              editForm.menuUrl = res.data.menuUrl || ''
              editForm.menuIcon = res.data.menuIcon || ''
              editForm.sortOrder = res.data.sortOrder

              editForm.path = res.data.path || ''
              editForm.redirect = res.data.redirect || ''
              editForm.remarks = res.data.remarks || ''
              editForm.isEnabled = res.data.isEnabled
              editForm.isVisible = res.data.isVisible
              editForm.level = res.data.level
              editForm.routePath = res.data.routePath || ''

              // 当编辑时，需要重新获取模块列表，并还原 parentMenuId
              if (editForm.moduleId) {
                  await fetchPMenuDrop(false)
                  // 模块列表加载完成后，还原 parentMenuId
                  editForm.parentMenuId = originalParentMenuId
              }
          }
      } catch (error) {
          console.error('获取实体数据失败:', error)
          ElMessage({
              message: '获取实体数据失败，请刷新页面重试',
              type: 'error',
              plain: true,
              duration: 3000
          })
      }
  }

  // 获取列表数据
  const fetchSMenuPages = async () => {
      loading.value = true
      try {
          const params = {
              ...filters,
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize
          }

          const res = await post(GET_SMENU_PAGES_API.GET_SMENU_PAGES, params)

          // 确保使用sanitizeHtml清洗数据
          smenuList.value = res.data || []
          pagination.totalCount = res.totalCount || 0
      } catch (error) {
          // 如果是请求被取消的错误，不显示错误信息
          if (axios.isCancel(error)) {
              return
          }
          console.error('获取列表数据失败:', error)
          ElMessage({
              message: '获取列表数据失败，请刷新页面重试',
              type: 'error',
              plain: true,
              duration: 3000
          })
      } finally {
          loading.value = false
      }
  }

  // 搜索
  const handleSearch = () => {
      pagination.pageIndex = 1
      fetchSMenuPages()
  }

  // 重置
  const handleReset = async () => {
      filters.smenuCode = ''
      filters.smenuName = ''
      filters.smenuUrl = ''
      
      // 设置为默认的第一个未禁用的网域
      if (moduleDropList.value.length > 0) {
          const firstEnabledmodule = moduleDropList.value.find(item => !item.disabled)
          if (firstEnabledmodule) {
              filters.moduleId = firstEnabledmodule.moduleId
              // 获取对应的模块列表
              await fetchFilterPMenuDrop()
          } else {
              filters.moduleId = ''
              filters.parentMenuId = ''
              filterPMenuList.value = []
          }
      } else {
          filters.moduleId = ''
          filters.parentMenuId = ''
          filterPMenuList.value = []
      }
      
      pagination.pageIndex = 1
  }

  // 分页变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchSMenuPages()
  }

  // 每页条数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchSMenuPages()
  }

  const resetForm = (clearValidation = true) => {
      // 清除表单验证状态，在重新设置表单值之前
      if (clearValidation && editFormRef.value) {
          try {
              // 清除表单中选择框的验证
              const selectFields = ['moduleId', 'parentMenuId', 'menuType']
              selectFields.forEach(field => {
                  editFormRef.value.clearValidate(field)
              })
              // 然后清除所有验证
              editFormRef.value.clearValidate()
          } catch (error) {
              console.warn('重置表单验证状态失败:', error)
          }
      }
      
      // 重置表单值
      Object.assign(editForm, {
          menuId: '',
          menuCode: '',
          menuNameCn: '',
          menuNameEn: '',
          menuType: '',
          menuUrl: '',
          redirect: '',
          path: '',
          menuIcon: '',
          sortOrder: 1,
          isEnabled: 1,
          isVisible: 1,
          routePath: '',
          remarks: ''
      })
      
      // 重新设置表单验证状态
      if (clearValidation) {
          nextTick(() => {
              if (editFormRef.value) {
                  try {
                      editFormRef.value.clearValidate()
                  } catch (error) {
                      console.warn('重置表单验证状态失败:', error)
                  }
              }
          })
      }
  }

  // 新增程序
  const insertSMenu = async () => {
      try {
          // 验证必填项
          if (!editForm.moduleId) {
              ElMessage({
                  message: t('systembasicmgmt.smenu.pleaseSelectmodule'),
                  type: 'warning',
                  plain: true,
                  showClose: true
              })
              return
          }

          // 设置必填项
          const params = {
              ...editForm,
              redirect: editForm.redirect
          }
          const res = await post(INSERT_SMENU_API.INSERT_SMENU, params)

          if (res && res.code === 200) {
              resetForm()
              ElMessage({
                  message: res.message,
                  type: 'success',
                  plain: true,
                  showClose: true
              })
              fetchSMenuPages()
              dialogVisible.value = false
          } else {
              ElMessage({
                  message: res.message,
                  type: 'error',
                  plain: true,
                  showClose: true
              })
          }
      } catch (error) {
          console.error('新增二级菜单失败:', error)
          ElMessage({
              message: '新增二级菜单失败，请重试',
              type: 'error',
              plain: true,
              duration: 3000
          })
      }
  }

  // 更新程序
  const updateSMenu = async () => {
      try {
          // 验证必填项
          if (!editForm.moduleId) {
              ElMessage({
                  message: t('systembasicmgmt.smenu.pleaseSelectmodule'),
                  type: 'warning',
                  plain: true,
                  showClose: true
              })
              return
          }

          // 设置必填项
          const params = {
              ...editForm,
              redirect: editForm.redirect
          }

          const res = await post(UPDATE_SMENU_API.UPDATE_SMENU, params)

          if (res && res.code === 200) {
              resetForm()
              ElMessage({
                  message: res.message,
                  type: 'success',
                  plain: true,
                  showClose: true
              })
              dialogVisible.value = false
              fetchSMenuPages()
          } else {
              ElMessage({
                  message: res.message,
                  type: 'error',
                  plain: true,
                  showClose: true
              })
          }
      } catch (error) {
          console.error('更新二级菜单失败:', error)
          ElMessage({
              message: '更新二级菜单失败，请重试',
              type: 'error',
              plain: true,
              duration: 3000
          })
      }
  }

  // 删除程序
  const deleteSMenu = async (menuId) => {
      try {
          const params = {
              menuId: menuId
          }

          if (isNaN(params.menuId)) {
              ElMessage({
                  message: t('systembasicmgmt.invalidId'),
                  type: 'error',
                  plain: true,
                  showClose: true
              })
              return
          }

          const res = await post(DELETE_SMENU_API.DELETE_SMENU, params)

          if (res && res.code === 200) {
              ElMessage({
                  message: res.message,
                  type: 'success',
                  plain: true,
                  showClose: true
              })
              dialogVisible.value = false
              fetchSMenuPages()
          } else {
              ElMessage({
                  message: res.message,
                  type: 'error',
                  plain: true,
                  showClose: true
              })
          }
      } catch (error) {
          console.error('删除二级菜单失败:', error)
          ElMessage({
              message: '删除二级菜单失败，请重试',
              type: 'error',
              plain: true,
              duration: 3000
          })
      }
  }

  // 新增程序
  const handleAdd = () => {
      // 重置表单
      resetForm()
      // 设置默认值
      editForm.menuId = '0'
      editForm.sortOrder = 1
      editForm.isEnabled = 1
      editForm.isVisible = 1

      // 设置对话框标题
      dialogTitle.value = t('systembasicmgmt.smenu.addSMenu')

      // 获取网域和菜单类型选项
      fetchModuleDrop()
      fetchMenuTypeOptions()

      // 显示对话框
      dialogVisible.value = true
  }

  // 编辑程序
  const handleEdit = async (index, row) => {
      // 重置表单
      resetForm()

      // 设置对话框标题
      dialogTitle.value = t('systembasicmgmt.smenu.editSMenu')

      // 先获取网域和菜单类型选项
      await fetchModuleDrop()
      await fetchMenuTypeOptions()
      
      // 然后获取实体数据，并自动填充对应的模块列表
      await fetchSMenuEntity(row.menuId)

      // 显示对话框
      dialogVisible.value = true
      
      // 延迟清除表单验证状态
      setTimeout(() => {
          if (editFormRef.value) {
              editFormRef.value.clearValidate()
          }
      }, 100)
  }

  // 关闭对话框
  const handleDialogClose = () => {
      // 使用nextTick确保DOM渲染完成后再清除验证
      nextTick(() => {
          resetForm(true)
      })
  }

  // 删除程序
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
            t('systembasicmgmt.smenu.deleteConfirm'),
            t('systembasicmgmt.tip'),
          {
              confirmButtonText: t('systembasicmgmt.confirm'),
              cancelButtonText: t('systembasicmgmt.cancel'),
              type: 'warning',
          }
      )
          .then(() => {
              deleteSMenu(row.menuId)
              // 刷新列表
              fetchSMenuPages()
          })
          .catch(() => {
              // 取消删除
          })
  }

  // 保存
  const handleSave = () => {
      editFormRef.value?.validate((valid) => {
          if (valid) {
              // 判断是新增还是编辑
              const isNewModule = !editForm.menuId || editForm.menuId === '' || editForm.menuId === '0'

              if (isNewModule) {
                  insertSMenu()
              } else {
                  updateSMenu()
              }
              dialogVisible.value = false

              // 刷新列表
              fetchSMenuPages()
          }
      })
  }

  // 域名变化
  const handlemoduleChange = () => {
      // 清除模块选择
      editForm.parentMenuId = ''
      // 当模块选择变化时，设置默认值
      fetchPMenuDrop(true)
  }

  // 过滤域名变化
  const handleFiltermoduleChange = () => {
      // 清除模块选择
      filters.parentMenuId = ''
      // 当模块选择变化时，设置默认值
      fetchFilterPMenuDrop()
  }

  // 获取过滤条件下的模块数据
  const fetchFilterPMenuDrop = async () => {
      if (!filters.moduleId) {
          filterPMenuList.value = []
          return
      }

      try {
          const params = {
              moduleId: filters.moduleId
          }
          const res = await post(GET_PMENU_DROP_API.GET_PMENU_TYPE, params)
          filterPMenuList.value = res.data || []

          // 默认选中第一个未禁用的模块
            if (filterPMenuList.value.length > 0) {
                const firstEnabledPMenu = filterPMenuList.value.find(item => !item.disabled)
                if (firstEnabledPMenu) {
                    filters.parentMenuId = firstEnabledPMenu.menuId
                }
          }
      } catch (error) {
          console.error('获取过滤条件下的模块数据失败:', error)
          ElMessage({
              message: '获取过滤条件下的模块数据失败，请刷新页面重试',
              type: 'error',
              plain: true,
              duration: 3000
          })
      }
  }

  // 获取菜单类型选项
  const fetchMenuTypeOptions = async () => {
      try {
          const res = await post(GET_MENU_TYPE_API.GET_MENU_TYPE)
          if (res && res.code === 200) {
              // 确保 menuTypeCode 为字符串
              menuTypeOptions.value = (res.data || []).map(item => ({
                  ...item,
                  menuTypeCode: String(item.menuTypeCode)
              }))
          } else {
              menuTypeOptions.value = []
          }
      } catch (error) {
          console.error('获取菜单类型选项失败:', error)
          menuTypeOptions.value = []
      }
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

