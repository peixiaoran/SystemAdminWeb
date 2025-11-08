<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 过滤条件 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="模块搜索表单">
        <el-form-item :label="$t('systembasicmgmt.pmenu.module')">
          <el-select style="width: 180px" 
                     v-model="filters.moduleId" 
                     :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.pmenu.module')"
                     @change="handleModuleChange">
            <el-option v-for="item in moduleDropList" :key="item.moduleId" :label="item.moduleName" :value="item.moduleId" :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.pmenu.menuCode')">
          <el-input v-model="filters.menuCode" :placeholder="$t('systembasicmgmt.inputPlaceholder') + $t('systembasicmgmt.pmenu.menuCode')" style="width:170px" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.pmenu.menuName')">
          <el-input v-model="filters.menuName" :placeholder="$t('systembasicmgmt.inputPlaceholder') + $t('systembasicmgmt.pmenu.menuName')" style="width:200px" />
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
            {{ $t('systembasicmgmt.pmenu.addPMenu') }}
          </el-button>
        </div>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="moduleList"
                  style="width: 100%"
                  border
                  stripe
                  max-height="calc(100vh - 240px)"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table">
          <el-table-column type="index" :label="$t('systembasicmgmt.index')" width="70" align="center" fixed />
          <el-table-column prop="menuCode" :label="$t('systembasicmgmt.pmenu.menuCode')" align="left" min-width="180" />
          <el-table-column prop="menuNameCn" :label="$t('systembasicmgmt.pmenu.menuNameCn')" align="left" min-width="230" />
          <el-table-column prop="menuNameEn" :label="$t('systembasicmgmt.pmenu.menuNameEn')" align="left" min-width="200" />
          <el-table-column prop="menuTypeName" :label="$t('systembasicmgmt.pmenu.menuType')" align="center" min-width="150" />
          <el-table-column prop="path" :label="$t('systembasicmgmt.pmenu.pagePath')" align="left" min-width="280" />
          <el-table-column prop="menuIcon" :label="$t('systembasicmgmt.pmenu.menuIcon')" align="center" min-width="180" />
          <el-table-column :label="$t('systembasicmgmt.isEnabled')" align="center" min-width="120">
            <template #default="scope">
              <div class="flex">
                <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                  {{ scope.row.isEnabled ? $t('systembasicmgmt.enabled') : $t('systembasicmgmt.disabled') }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('systembasicmgmt.isVisible')" align="center" min-width="90">
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

    <!-- 编辑状态对话框 -->
    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :modal-append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="110px" class="dialog-form" role="form" aria-label="模块编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuCode')" prop="menuCode">
            <el-input v-model="editForm.menuCode" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuNameCn')" prop="menuNameCn">
            <el-input v-model="editForm.menuNameCn" style="width:100%" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuNameEn')" prop="menuNameEn">
            <el-input v-model="editForm.menuNameEn" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.pmenu.module')" prop="moduleId">
            <el-select v-model="editForm.moduleId" style="width:100%" :placeholder="$t('systembasicmgmt.pmenu.pleaseSelectModule')">
              <el-option v-for="item in moduleDropList" :key="item.moduleId" :label="item.moduleName" :value="item.moduleId" :disabled="item.disabled" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuIcon')" prop="menuIcon">
            <el-input v-model="editForm.menuIcon" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.pmenu.sortOrder')" prop="sortOrder">
            <el-input-number v-model="editForm.sortOrder" style="width:100%" :min="1" :precision="0" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.pagePath')" prop="path">
            <el-input v-model="editForm.path" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.pmenu.redirect')" prop="redirect">
            <el-input v-model="editForm.redirect" style="width:100%" />
          </el-form-item>
        </div>
        <div class="form-row full-width">
          <el-form-item :label="$t('systembasicmgmt.remark')">
            <el-input v-model="editForm.remark" style="width:100%" type="textarea" :rows="3" />
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
          <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'
import { GET_PMENU_PAGES_API, GET_PMENU_ENTITY_API, INSERT_PMENU_API, DELETE_PMENU_API, GET_MODULE_DROP_API, UPDATE_PMENU_API } from '@/config/api/systembasicmgmt/system-mgmt/pmenu'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 模块数据
const moduleList = ref([])
const loading = ref(false)
const moduleDropList = ref([])
const menuTypeOptions = ref([])
// 提交加载状态
const submitLoading = ref(false)

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
  menuCode: '',
  menuName: '',
  menuNameEn: '',
  menuUrl: '',
  moduleId: ''
})

// 对话框显示状态
const dialogVisible = ref(false)

// 编辑表单
const editForm = reactive({
  menuId: '',
  parentMenuId: '0',
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
  path: '',
  redirect: '',
  remark: ''
})
// 对话框标题
const dialogTitle = ref('')

// 表单验证规则
const formRules = reactive({
  menuCode: [
    { required: true, message: () => t('systembasicmgmt.pmenu.pleaseInputMenuCode'), trigger: 'blur' }
  ],
  menuNameCn: [
    { required: true, message: () => t('systembasicmgmt.pmenu.pleaseInputMenuNameCn'), trigger: 'blur' }
  ],
  menuNameEn: [
    { required: true, message: () => t('systembasicmgmt.pmenu.pleaseInputMenuNameEn'), trigger: 'blur' }
  ],
  moduleId: [
    { required: true, message: () => t('systembasicmgmt.pmenu.pleaseSelectModule'), trigger: 'change' }
  ],
  menuIcon: [
    { required: true, message: () => t('systembasicmgmt.pmenu.pleaseInputMenuIcon'), trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: () => t('systembasicmgmt.pmenu.pleaseInputSortOrder'), trigger: 'blur' }
  ],

  menuType: [
    { required: true, message: () => t('systembasicmgmt.pmenu.pleaseSelectMenuType'), trigger: 'change' }
  ],
  path: [
    { required: true, message: () => t('systembasicmgmt.pmenu.pleaseInputPagePath'), trigger: 'blur' }
  ],
  redirect: [
    // redirect 可为空，移除必填验证
  ]
})

// 在组件挂载后获取日志数据
onMounted(() => {
  initPageData() // 初始化页面数据，设置查询表单默认值
  fetchMenuTypeOptions() // 获取菜单类型选项
})

// 初始化页面数据（只在页面加载时调用）
const initPageData = async () => {
  try {
    const res = await post(GET_MODULE_DROP_API.GET_MODULE_DROP)
    moduleDropList.value = res.data || []

    // 默认选中第一个未禁用的模块（用于查询表单）
    if (moduleDropList.value.length > 0) {
      const firstEnabledModule = moduleDropList.value.find(item => !item.disabled)
      if (firstEnabledModule) {
        filters.moduleId = firstEnabledModule.moduleId
      }
    }

    // 应用默认值进行初始查询
    fetchPMenuPages()
  } catch (error) {
    console.error('获取模块数据失败:', error)
    ElMessage({
      message: '获取模块数据失败，请刷新页面重试',
      type: 'error',
      plain: true,
      showClose: true,
    })
  }
}

// 获取模块类型（不会影响查询表单的值）
const fetchModuleDropList = async () => {
  try {
    const res = await post(GET_MODULE_DROP_API.GET_MODULE_DROP)
    moduleDropList.value = res.data || []

    // 如果是新增操作，默认选中第一个未禁用的模块
    if (dialogTitle.value === t('systembasicmgmt.pmenu.addPMenu') && moduleDropList.value.length > 0) {
      const firstEnabledModule = moduleDropList.value.find(item => !item.disabled)
      if (firstEnabledModule) {
        editForm.moduleId = firstEnabledModule.moduleId
      }
    }
  } catch (error) {
        ElMessage({
          message: '获取模块数据失败，请刷新页面重试',
          type: 'error',
          plain: true,
          showClose: true,
      })
    }
}

// 获取菜单类型选项
const fetchMenuTypeOptions = async () => {
  // 菜单类型选项暂时使用固定数据
  menuTypeOptions.value = [
    { menuTypeCode: '1', menuTypeName: '目录' },
    { menuTypeCode: '2', menuTypeName: '菜单' },
    { menuTypeCode: '3', menuTypeName: '按钮' }
  ]
}

// 获取一级菜单实体数据
const fetchPMenuEntity = async (menuId) => {
  try {
    const params = {
      menuId: menuId
    }
    const res = await post(GET_PMENU_ENTITY_API.GET_PMENU_ENTITY, params)

    if (res && res.code === 200) {
      editForm.menuId = res.data.menuId
      editForm.menuCode = res.data.menuCode
      editForm.menuNameCn = res.data.menuNameCn
      editForm.menuNameEn = res.data.menuNameEn
      editForm.parentMenuId = res.data.parentMenuId
      editForm.moduleId = res.data.moduleId
      editForm.menuType = String(res.data.menuType || '')
      editForm.menuUrl = res.data.menuUrl
      editForm.menuIcon = res.data.menuIcon
      editForm.sortOrder = res.data.sortOrder

      editForm.path = res.data.path
      editForm.redirect = res.data.redirect
      editForm.remark = res.data.remark
      editForm.isEnabled = res.data.isEnabled
      editForm.isVisible = res.data.isVisible
    }
  } catch (error) {
    console.error('获取模块实体数据失败:', error)
    ElMessage({
      message: '获取模块数据失败，请重试',
      type: 'error',
      plain: true,
      showClose: true,
    })
  }
}

// 获取一级菜单列表数据
const fetchPMenuPages = async () => {
  loading.value = true
  try {
    const params = {
      ...filters,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    }
    const res = await post(GET_PMENU_PAGES_API.GET_PMENU_PAGES, params)

    moduleList.value = res.data || []
    pagination.totalCount = res.totalCount || 0
  } catch (error) {
    console.error('获取模块列表失败:', error)
    ElMessage({
      message: '获取数据失败，请重试',
      type: 'error',
      plain: true,
      showClose: true,
    })
  } finally {
    loading.value = false
  }
}

// 使用通用防抖工具
const debouncedFetchPMenuPages = debounce(() => {
  fetchPMenuPages()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

// 处理搜索操作（带防抖）
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedFetchPMenuPages()
}

// 立即查询数据（不使用防抖，用于保存后刷新）
const fetchPMenuPagesImmediate = () => {
  fetchPMenuPages()
}

// 重置搜索条件（只重置输入字段，保留下拉框值）
const handleReset = () => {
  filters.menuCode = ''
  filters.menuName = ''
  
  // 重置后自动触发查询（使用防抖）
  pagination.pageIndex = 1
  loading.value = true
  debouncedFetchPMenuPages()
}

// 处理页码变化
const handlePageChange = (page) => {
  pagination.pageIndex = page
  fetchPMenuPages()
}

// 处理每页记录数变化
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageIndex = 1
  fetchPMenuPages()
}

// 处理模块下拉框变化
const handleModuleChange = () => {
  // 模块变化时重置页码并自动查询数据
  pagination.pageIndex = 1
  handleSearch()
}

const resetForm = (clearValidation = true) => {
  // 先清除验证状态（在重置数据之前）
  if (clearValidation && editFormRef.value) {
    try {
      // 针对下拉框字段单独清除验证
      const selectFields = ['moduleId', 'menuType']
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
    menuId: '',
    parentMenuId: '0',
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

// 新增一级菜单
const insertPMenu = async () => {
  submitLoading.value = true
  
  // 检查必填字段
  if (!editForm.moduleId) {
    ElMessage({
      message: t('systembasicmgmt.pmenu.pleaseSelectModule'),
      type: 'warning',
      plain: true,
      showClose: true,
    })
    submitLoading.value = false
    return
  }

  // 处理数值类型字段
  const params = {
    ...editForm,
    redirect: editForm.redirect
  }
  const res = await post(INSERT_PMENU_API.INSERT_PMENU, params)

  if (res && res.code === 200) {
    resetForm()
    ElMessage({
      message: res.message,
      type: 'success',
      plain: true,
      showClose: true,
    })
    fetchPMenuPagesImmediate()
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true,
    })
  }
  submitLoading.value = false
}

// 更新一级菜单
const updatePMenu = async () => {
  submitLoading.value = true
  
  // 检查必填字段
  if (!editForm.moduleId) {
    ElMessage({
      message: t('systembasicmgmt.pmenu.pleaseSelectModule'),
      type: 'warning',
      plain: true,
      showClose: true,
    })
    submitLoading.value = false
    return
  }

  // 处理数值类型字段
  const params = {
    ...editForm,
    redirect: editForm.redirect
  }
  const res = await post(UPDATE_PMENU_API.UPDATE_PMENU, params)

  if (res && res.code === 200) {
    resetForm()
    ElMessage({
      message: res.message,
      type: 'success',
      plain: true,
      showClose: true,
    })
    dialogVisible.value = false
    fetchPMenuPagesImmediate()
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true,
    })
  }
  submitLoading.value = false
}

// 删除一级菜单
const deletePMenu = async (menuId) => {
  const params = {
    menuId: menuId
  }

  if (isNaN(params.menuId)) {
    ElMessage({
      message: t('systembasicmgmt.invalidId'),
      type: 'error',
      plain: true,
      showClose: true,
    })
    return
  }

  const res = await post(DELETE_PMENU_API.DELETE_PMENU, params)

  if (res && res.code === 200) {
    ElMessage({
      message: res.message,
      type: 'success',
      plain: true,
      showClose: true,
    })
    dialogVisible.value = false
    fetchPMenuPagesImmediate()
  } else {
    ElMessage({
      message: res.message,
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
  // 设置默认值
  editForm.menuId = '0'
  editForm.parentMenuId = '0'
  editForm.sortOrder = 1
  editForm.isEnabled = 1
  editForm.isVisible = 1

  // 设置对话框标题
  dialogTitle.value = t('systembasicmgmt.pmenu.addPMenu')

  // 获取模块类型和菜单类型
  fetchModuleDropList()
  fetchMenuTypeOptions()
  // 显示对话框
  dialogVisible.value = true
}

// 处理编辑操作
const handleEdit = (index, row) => {
  // 重置表单数据
  resetForm()

  // 设置对话框标题
  dialogTitle.value = t('systembasicmgmt.pmenu.editPMenu')

  // 获取模块类型和菜单类型
  fetchModuleDropList()
  fetchMenuTypeOptions()

  // 获取模块实体数据
  fetchPMenuEntity(row.menuId)

  // 显示对话框
  dialogVisible.value = true
}

// 处理对话框关闭
const handleDialogClose = () => {
  // 使用 nextTick 确保 DOM 更新完成后再清除验证
  nextTick(() => {
    resetForm(true)
  })
}

// 处理删除操作
const handleDelete = (index, row) => {
  ElMessageBox.confirm(
    t('systembasicmgmt.pmenu.deleteConfirm'),
    t('common.tip'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning',
    }
  )
    .then(() => {
      deletePMenu(row.menuId)
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
      const isNewModule = !editForm.menuId || editForm.menuId === '' || editForm.menuId === '0'

      if (isNewModule) {
        insertPMenu()
      } else {
        updatePMenu()
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>

