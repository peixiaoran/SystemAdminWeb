<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="搜索表单">
        <el-form-item :label="$t('systembasicmgmt.smenu.module')">
          <el-select v-model="filters.moduleId" :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.smenu.module')" style="width:180px" @change="handleFiltermoduleChange">
            <el-option v-for="item in moduleDropList" :key="item.moduleId" :label="item.moduleName" :value="item.moduleId" :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.smenu.pmenu')">
          <el-select v-model="filters.parentMenuId" :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.smenu.pmenu')" style="width:180px" @change="handleFilterParentMenuChange">
            <el-option v-for="item in filterPMenuList" :key="item.menuId" :label="item.menuName" :value="item.menuId" :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.smenu.smenuName')">
          <el-input style="width: 180px"
                    v-model="filters.menuName"
                    :placeholder="$t('systembasicmgmt.inputPlaceholder') + $t('systembasicmgmt.smenu.smenuName')" />
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
            {{ $t('systembasicmgmt.smenu.addSMenu') }}
          </el-button>
        </div>
      </el-form>

      <div class="table-container">
        <el-table :data="smenuList"
                  style="width: 100%"
                  border
                  stripe
                  max-height="calc(100vh - 240px)"
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.index')" width="70" align="center" fixed />
          <el-table-column prop="menuCode" :label="$t('systembasicmgmt.smenu.smenuCode')" align="left" min-width="180" />
          <el-table-column prop="menuNameCn" :label="$t('systembasicmgmt.smenu.smenuNameCn')" align="left" min-width="230" />
          <el-table-column prop="menuNameEn" :label="$t('systembasicmgmt.smenu.smenuNameEn')" align="left" min-width="200" />
          <el-table-column prop="menuTypeName" :label="$t('systembasicmgmt.smenu.menuType')" align="center" min-width="150" />
          <el-table-column prop="path" :label="$t('systembasicmgmt.smenu.pagePath')" align="left" min-width="420" />
          <el-table-column prop="menuIcon" :label="$t('systembasicmgmt.smenu.smenuIcon')" align="center" min-width="180" />
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
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">{{ $t('common.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

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

    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="110px" class="dialog-form" role="form" aria-label="编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.smenu.smenuCode')" prop="menuCode">
            <el-input v-model="editForm.menuCode" style="width:100%" :placeholder="$t('systembasicmgmt.smenu.pleaseInputSmenuCode')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.smenu.smenuNameCn')" prop="menuNameCn">
            <el-input v-model="editForm.menuNameCn" style="width:100%" :placeholder="$t('systembasicmgmt.smenu.pleaseInputSmenuNameCn')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.smenu.smenuNameEn')" prop="menuNameEn">
            <el-input v-model="editForm.menuNameEn" style="width:100%" :placeholder="$t('systembasicmgmt.smenu.pleaseInputSmenuNameEn')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.smenu.smenuIcon')" prop="menuIcon">
            <el-input v-model="editForm.menuIcon" style="width:100%" :placeholder="$t('systembasicmgmt.smenu.pleaseInputSmenuIcon')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.smenu.module')" prop="moduleId">
            <el-select v-model="editForm.moduleId" style="width:100%" :placeholder="$t('systembasicmgmt.smenu.pleaseSelectmodule')" @change="handlemoduleChange">
              <el-option v-for="item in moduleDropList" :key="item.moduleId" :label="item.moduleName" :value="item.moduleId" :disabled="item.disabled" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.smenu.pmenu')" prop="parentMenuId">
            <el-select v-model="editForm.parentMenuId" style="width:100%" :placeholder="$t('systembasicmgmt.smenu.pleaseSelectModule')">
              <el-option v-for="item in pmenuDropList" :key="item.menuId" :label="item.menuName" :value="item.menuId" :disabled="item.disabled" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.smenu.sortOrder')" prop="sortOrder">
            <el-input-number v-model="editForm.sortOrder" style="width:100%" :min="1" :precision="0" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.smenu.pagePath')" prop="path">
            <el-input v-model="editForm.path" style="width:100%" :placeholder="$t('systembasicmgmt.smenu.pleaseInputPagePath')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.smenu.apiRoute')" prop="routePath">
            <el-input v-model="editForm.routePath" style="width:100%" :placeholder="$t('systembasicmgmt.smenu.pleaseInputApiRoute')" />
          </el-form-item>
        </div>
        <div class="form-row full-width">
          <el-form-item :label="$t('systembasicmgmt.remark')">
            <el-input v-model="editForm.remark" style="width:100%" type="textarea" :rows="3" />
          </el-form-item>
        </div>
        <div class="form-row">
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
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import { GET_SMENU_PAGES_API, GET_SMENU_ENTITY_API, INSERT_SMENU_API, DELETE_SMENU_API, GET_MODULE_DROP_API, GET_PMENU_DROP_API, UPDATE_SMENU_API } from '@/config/api/systembasicmgmt/system-mgmt/smenu'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const smenuList = ref([])
const loading = ref(false)
const submitLoading = ref(false)

const moduleDropList = ref([])
const pmenuDropList = ref([])

const editFormRef = ref(null)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const filters = reactive({
  menuCode: '',
  menuName: '',
  menuNameEn: '',
  menuUrl: '',
  moduleId: '',
  parentMenuId: ''
})

const filterPMenuList = ref([])

const dialogVisible = ref(false)

const editForm = reactive({
  menuId: '',
  parentMenuId: null,
  moduleId: '',
  menuCode: '',
  menuNameCn: '',
  menuNameEn: '',
  menuType: '',
  menuUrl: '',
  menuIcon: '',
  sortOrder: 1,
  isVisible: 1,
  level: 1,
  routePath: '',
  path: '',
  redirect: '',
  remark: ''
})

const dialogTitle = ref('')

const formRules = {
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
  ]
}

const showMessage = (message, type = 'error') => ElMessage({ message, type, plain: true, showClose: true })

onMounted(() => {
  initPageData()
})

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchSMenuPages()
  }, DEBOUNCE_MS)
}

// 拉取模块下拉数据，统一供初始化与新增弹窗复用
const fetchModuleDropList = async () => {
  const res = await post(GET_MODULE_DROP_API.GET_MODULE_DROP)
  moduleDropList.value = res.data || []
  return moduleDropList.value.find(item => !item.disabled)
}

const initPageData = async () => {
  try {
    const firstEnabledModule = await fetchModuleDropList()
    if (firstEnabledModule) {
      filters.moduleId = firstEnabledModule.moduleId
      await fetchFilterPMenuDrop()
    }
    fetchSMenuPages()
  } catch {
    showMessage('初始化页面数据失败，请刷新页面重试')
  }
}

const fetchModuleDrop = async () => {
  try {
    const firstEnabledModule = await fetchModuleDropList()
    if (dialogTitle.value === t('systembasicmgmt.smenu.addSMenu') && firstEnabledModule) {
      editForm.moduleId = firstEnabledModule.moduleId
      fetchPMenuDrop()
    }
  } catch {
    showMessage('获取模块数据失败，请刷新页面重试')
  }
}

const fetchPMenuDrop = async () => {
  if (!editForm.moduleId) {
    pmenuDropList.value = []
    return
  }
  try {
    const formData = new FormData()
    formData.append('moduleId', String(editForm.moduleId))
    const res = await post(GET_PMENU_DROP_API.GET_PMENU_TYPE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    pmenuDropList.value = res.data || []
  } catch {
    showMessage('获取父菜单数据失败，请刷新页面重试')
  }
}

const fetchSMenuEntity = async (menuId) => {
  try {
    const formData = new FormData()
    formData.append('menuId', menuId)
    const res = await post(GET_SMENU_ENTITY_API.GET_SMENU_ENTITY, formData)
    if (res && res.code === 200) {
      const originalParentMenuId = res.data.parentMenuId
      editForm.menuId = res.data.menuId
      editForm.menuCode = res.data.menuCode || ''
      editForm.menuNameCn = res.data.menuNameCn || ''
      editForm.menuNameEn = res.data.menuNameEn || ''
      editForm.moduleId = res.data.moduleId
      editForm.menuType = String(res.data.menuType || '')
      editForm.menuUrl = res.data.menuUrl || ''
      editForm.menuIcon = res.data.menuIcon || ''
      editForm.sortOrder = Number(res.data.sortOrder ?? 1)
      editForm.path = res.data.path || ''
      editForm.redirect = res.data.redirect || ''
      editForm.remark = res.data.remark || ''
      editForm.isVisible = res.data.isVisible
      editForm.level = res.data.level
      editForm.routePath = res.data.routePath || ''
      if (editForm.moduleId) {
        await fetchPMenuDrop()
        editForm.parentMenuId = originalParentMenuId
      }
    }
  } catch {
    showMessage('获取实体数据失败，请刷新页面重试')
  }
}

const fetchSMenuPages = async () => {
  loading.value = true
  try {
    const params = {
      ...filters,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    }
    const res = await post(GET_SMENU_PAGES_API.GET_SMENU_PAGES, params)
    smenuList.value = res.data || []
    pagination.totalCount = res.totalCount || 0
  } catch {
    showMessage('获取列表数据失败，请刷新页面重试')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  scheduleSearch()
}

const handleReset = async () => {
  filters.menuName = ''
  filters.menuCode = ''
  filters.menuNameEn = ''
  filters.menuUrl = ''
  if (moduleDropList.value.length > 0) {
    const firstEnabledModule = moduleDropList.value.find(item => !item.disabled)
    if (firstEnabledModule) {
      filters.moduleId = firstEnabledModule.moduleId
      await fetchFilterPMenuDrop()
    }
  }
  scheduleSearch()
}

const handlePageChange = () => {
  fetchSMenuPages()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchSMenuPages()
}

const resetForm = () => {
  Object.assign(editForm, {
    menuId: '',
    parentMenuId: null,
    menuCode: '',
    menuNameCn: '',
    menuNameEn: '',
    menuType: '',
    menuUrl: '',
    redirect: '',
    path: '',
    menuIcon: '',
    sortOrder: 1,
    isVisible: 1,
    routePath: '',
    remark: ''
  })
}

const insertSMenu = async () => {
  submitLoading.value = true
  const res = await post(INSERT_SMENU_API.INSERT_SMENU, { ...editForm })
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    resetForm()
    dialogVisible.value = false
    fetchSMenuPages()
  } else {
    showMessage(res.message)
  }
  submitLoading.value = false
}

const updateSMenu = async () => {
  submitLoading.value = true
  const res = await post(UPDATE_SMENU_API.UPDATE_SMENU, { ...editForm })
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    resetForm()
    dialogVisible.value = false
    fetchSMenuPages()
  } else {
    showMessage(res.message)
  }
  submitLoading.value = false
}

const deleteSMenu = async (menuId) => {
  if (isNaN(menuId)) {
    showMessage(t('systembasicmgmt.invalidId'))
    return
  }
  const formData = new FormData()
  formData.append('menuId', menuId)
  const res = await post(DELETE_SMENU_API.DELETE_SMENU, formData)
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    fetchSMenuPages()
  } else {
    showMessage(res.message)
  }
}

const handleAdd = () => {
  resetForm()
  editForm.menuId = '0'
  editForm.sortOrder = 1
  editForm.isVisible = 1
  dialogTitle.value = t('systembasicmgmt.smenu.addSMenu')
  fetchModuleDrop()
  dialogVisible.value = true
}

const handleEdit = async (index, row) => {
  resetForm()
  dialogTitle.value = t('systembasicmgmt.smenu.editSMenu')
  await fetchModuleDrop()
  await fetchSMenuEntity(row.menuId)
  dialogVisible.value = true
  nextTick(() => {
    editFormRef.value?.clearValidate()
  })
}

const handleDialogClose = () => {
  resetForm()
  editFormRef.value?.clearValidate()
}

const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.smenu.deleteConfirm'),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
  } catch {
    return
  }
  await deleteSMenu(row.menuId)
}

const handleSave = async () => {
  try {
    await editFormRef.value.validate()
  } catch {
    return
  }
  const isNew = !editForm.menuId || editForm.menuId === '' || editForm.menuId === '0'
  if (isNew) {
    await insertSMenu()
  } else {
    await updateSMenu()
  }
}

const handlemoduleChange = () => {
  editForm.parentMenuId = null
  nextTick(() => editFormRef.value?.clearValidate('parentMenuId'))
  fetchPMenuDrop()
}

const handleFiltermoduleChange = async () => {
  loading.value = true
  filters.parentMenuId = ''
  // 先等父菜单下拉拉取完成（其内部会赋默认 parentMenuId），再触发查询，
  // 否则查询可能读到尚未更新的空 parentMenuId，导致结果与所选模块不一致
  await fetchFilterPMenuDrop()
  scheduleSearch()
}

const handleFilterParentMenuChange = () => {
  scheduleSearch()
}

const fetchFilterPMenuDrop = async () => {
  if (!filters.moduleId) {
    filterPMenuList.value = []
    return
  }
  try {
    const formData = new FormData()
    formData.append('moduleId', String(filters.moduleId))
    const res = await post(GET_PMENU_DROP_API.GET_PMENU_TYPE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    filterPMenuList.value = res.data || []
    if (filterPMenuList.value.length > 0) {
      const firstEnabledPMenu = filterPMenuList.value.find(item => !item.disabled)
      if (firstEnabledPMenu) {
        filters.parentMenuId = firstEnabledPMenu.menuId
      }
    }
  } catch {
    showMessage('获取过滤条件下的模块数据失败，请刷新页面重试')
  }
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
