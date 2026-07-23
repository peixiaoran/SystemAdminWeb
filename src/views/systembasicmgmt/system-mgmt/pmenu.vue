<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
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

      <div class="table-container">
        <el-table :data="moduleList"
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
          <el-table-column prop="menuCode" :label="$t('systembasicmgmt.pmenu.menuCode')" align="left" min-width="180" />
          <el-table-column prop="menuNameCn" :label="$t('systembasicmgmt.pmenu.menuNameCn')" align="left" min-width="230" />
          <el-table-column prop="menuNameEn" :label="$t('systembasicmgmt.pmenu.menuNameEn')" align="left" min-width="200" />
          <el-table-column prop="menuTypeName" :label="$t('systembasicmgmt.pmenu.menuType')" align="center" min-width="150" />
          <el-table-column prop="path" :label="$t('systembasicmgmt.pmenu.pagePath')" align="left" min-width="280" />
          <el-table-column prop="menuIcon" :label="$t('systembasicmgmt.pmenu.menuIcon')" align="center" min-width="180" />
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
      <el-form :inline="true" :model="editForm" :rules="formRules" ref="editFormRef" label-width="110px" class="dialog-form" role="form" aria-label="模块编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuCode')" prop="menuCode">
            <el-input v-model="editForm.menuCode" style="width:100%" :placeholder="$t('systembasicmgmt.pmenu.pleaseInputMenuCode')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuNameCn')" prop="menuNameCn">
            <el-input v-model="editForm.menuNameCn" style="width:100%" :placeholder="$t('systembasicmgmt.pmenu.pleaseInputMenuNameCn')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuNameEn')" prop="menuNameEn">
            <el-input v-model="editForm.menuNameEn" style="width:100%" :placeholder="$t('systembasicmgmt.pmenu.pleaseInputMenuNameEn')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.pmenu.module')" prop="moduleId">
            <el-select v-model="editForm.moduleId" style="width:100%" :placeholder="$t('systembasicmgmt.pmenu.pleaseSelectModule')">
              <el-option v-for="item in moduleDropList" :key="item.moduleId" :label="item.moduleName" :value="item.moduleId" :disabled="item.disabled" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuIcon')" prop="menuIcon">
            <el-input v-model="editForm.menuIcon" style="width:100%" :placeholder="$t('systembasicmgmt.pmenu.pleaseInputMenuIcon')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.pmenu.sortOrder')" prop="sortOrder">
            <el-input-number v-model="editForm.sortOrder" style="width:100%" :min="1" :precision="0" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.pagePath')" prop="path">
            <el-input v-model="editForm.path" style="width:100%" :placeholder="$t('systembasicmgmt.pmenu.pleaseInputPagePath')" />
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
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { post } from '@/utils/request'
import { GET_PMENU_PAGES_API, GET_PMENU_ENTITY_API, INSERT_PMENU_API, DELETE_PMENU_API, GET_MODULE_DROP_API, UPDATE_PMENU_API } from '@/config/api/systembasicmgmt/system-mgmt/pmenu'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const moduleList = ref([])
const loading = ref(false)
const moduleDropList = ref([])
const menuTypeOptions = ref([])
const submitLoading = ref(false)

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
  moduleId: ''
})

const dialogVisible = ref(false)

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
  path: '',
  redirect: '',
  remark: ''
})

const dialogTitle = ref('')

const formRules = {
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
  ]
}

const showMessage = (message, type = 'error') => ElMessage({ message, type, plain: true, showClose: true })

onMounted(() => {
  initPageData()
  fetchMenuTypeOptions()
})

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchPMenuPages()
  }, DEBOUNCE_MS)
}

const initPageData = async () => {
  try {
    const res = await post(GET_MODULE_DROP_API.GET_MODULE_DROP)
    moduleDropList.value = res.data || []
    if (moduleDropList.value.length > 0) {
      const firstEnabledModule = moduleDropList.value.find(item => !item.disabled)
      if (firstEnabledModule) {
        filters.moduleId = firstEnabledModule.moduleId
      }
    }
    fetchPMenuPages()
  } catch (error) {
    showMessage('获取模块数据失败，请刷新页面重试')
  }
}

const fetchModuleDropList = async () => {
  try {
    const res = await post(GET_MODULE_DROP_API.GET_MODULE_DROP)
    moduleDropList.value = res.data || []
    if (dialogTitle.value === t('systembasicmgmt.pmenu.addPMenu') && moduleDropList.value.length > 0) {
      const firstEnabledModule = moduleDropList.value.find(item => !item.disabled)
      if (firstEnabledModule) {
        editForm.moduleId = firstEnabledModule.moduleId
      }
    }
  } catch (error) {
    showMessage('获取模块数据失败，请刷新页面重试')
  }
}

const fetchMenuTypeOptions = async () => {
  menuTypeOptions.value = [
    { menuTypeCode: '1', menuTypeName: '目录' },
    { menuTypeCode: '2', menuTypeName: '菜单' },
    { menuTypeCode: '3', menuTypeName: '按钮' }
  ]
}

const fetchPMenuEntity = async (menuId) => {
  try {
    const formData = new FormData()
    formData.append('menuId', menuId)
    const res = await post(GET_PMENU_ENTITY_API.GET_PMENU_ENTITY, formData)
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
    }
  } catch (error) {
    showMessage('获取模块数据失败，请重试')
  }
}

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
    showMessage('获取数据失败，请重试')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  scheduleSearch()
}

const handleReset = () => {
  filters.menuCode = ''
  filters.menuName = ''
  if (moduleDropList.value.length > 0) {
    const firstEnabledModule = moduleDropList.value.find(item => !item.disabled)
    if (firstEnabledModule) {
      filters.moduleId = firstEnabledModule.moduleId
    }
  }
  scheduleSearch()
}

const handlePageChange = () => {
  fetchPMenuPages()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchPMenuPages()
}

const handleModuleChange = () => {
  pagination.pageIndex = 1
  scheduleSearch()
}

const resetForm = () => {
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
    remark: ''
  })
}

const insertPMenu = async () => {
  submitLoading.value = true
  const res = await post(INSERT_PMENU_API.INSERT_PMENU, { ...editForm })
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    resetForm()
    dialogVisible.value = false
    fetchPMenuPages()
  } else {
    showMessage(res.message)
  }
  submitLoading.value = false
}

const updatePMenu = async () => {
  submitLoading.value = true
  const res = await post(UPDATE_PMENU_API.UPDATE_PMENU, { ...editForm })
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    resetForm()
    dialogVisible.value = false
    fetchPMenuPages()
  } else {
    showMessage(res.message)
  }
  submitLoading.value = false
}

const deletePMenu = async (menuId) => {
  if (isNaN(menuId)) {
    showMessage(t('systembasicmgmt.invalidId'))
    return
  }
  const formData = new FormData()
  formData.append('menuId', menuId)
  const res = await post(DELETE_PMENU_API.DELETE_PMENU, formData)
  if (res && res.code === 200) {
    showMessage(res.message, 'success')
    fetchPMenuPages()
  } else {
    showMessage(res.message)
  }
}

const handleAdd = () => {
  resetForm()
  editForm.menuId = '0'
  editForm.parentMenuId = '0'
  editForm.sortOrder = 1
  dialogTitle.value = t('systembasicmgmt.pmenu.addPMenu')
  fetchModuleDropList()
  fetchMenuTypeOptions()
  dialogVisible.value = true
}

const handleEdit = (index, row) => {
  resetForm()
  dialogTitle.value = t('systembasicmgmt.pmenu.editPMenu')
  fetchModuleDropList()
  fetchMenuTypeOptions()
  fetchPMenuEntity(row.menuId)
  dialogVisible.value = true
}

const handleDialogClose = () => {
  resetForm()
  editFormRef.value?.clearValidate()
}

const handleDelete = async (index, row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.pmenu.deleteConfirm'),
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
  await deletePMenu(row.menuId)
}

const handleSave = async () => {
  try {
    await editFormRef.value.validate()
  } catch {
    return
  }
  const isNew = !editForm.menuId || editForm.menuId === '' || editForm.menuId === '0'
  if (isNew) {
    await insertPMenu()
  } else {
    await updatePMenu()
  }
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
