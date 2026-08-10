<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.smenu.searchFormLabel')">
        <el-form-item :label="$t('systembasicmgmt.smenu.module')">
          <el-select v-model="filters.moduleId"
                     style="width: 220px"
                     :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.smenu.module')"
                     @change="handleFilterModuleChange">
            <el-option v-for="item in moduleOptions"
                       :key="item.moduleId"
                       :label="item.moduleName"
                       :value="item.moduleId"
                       :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.smenu.pmenu')">
          <el-select v-model="filters.parentMenuId"
                     style="width: 220px"
                     :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.smenu.pmenu')"
                     @change="handleFilterParentMenuChange">
            <el-option v-for="item in filterPMenuOptions"
                       :key="item.menuId"
                       :label="item.menuName"
                       :value="item.menuId"
                       :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.smenu.smenuName')">
          <el-input v-model="filters.menuName"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.inputPlaceholder') + $t('systembasicmgmt.smenu.smenuName')" />
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
            {{ $t('systembasicmgmt.smenu.addSMenu') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table :data="smenuList"
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
          <el-table-column :label="$t('systembasicmgmt.operation')" min-width="150" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">{{ $t('common.delete') }}</el-button>
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
      <el-form :inline="true"
               :model="editForm"
               :rules="formRules"
               ref="editFormRef"
               label-width="110px"
               class="dialog-form"
               role="form"
               :aria-label="$t('systembasicmgmt.smenu.editFormLabel')">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.smenu.smenuCode')" prop="menuCode">
            <el-input v-model="editForm.menuCode"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.smenu.pleaseInputSMenuCode')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.smenu.smenuNameCn')" prop="menuNameCn">
            <el-input v-model="editForm.menuNameCn"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.smenu.pleaseInputSMenuNameCn')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.smenu.smenuNameEn')" prop="menuNameEn">
            <el-input v-model="editForm.menuNameEn"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.smenu.pleaseInputSMenuNameEn')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.smenu.smenuIcon')" prop="menuIcon">
            <el-input v-model="editForm.menuIcon"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.smenu.pleaseInputSMenuIcon')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.smenu.module')" prop="moduleId">
            <el-select v-model="editForm.moduleId"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.smenu.pleaseSelectModule')"
                       @change="handleFormModuleChange">
              <el-option v-for="item in moduleOptions"
                         :key="item.moduleId"
                         :label="item.moduleName"
                         :value="item.moduleId"
                         :disabled="item.disabled" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.smenu.pmenu')" prop="parentMenuId">
            <el-select v-model="editForm.parentMenuId"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.smenu.pleaseSelectPMenu')">
              <el-option v-for="item in pmenuOptions"
                         :key="item.menuId"
                         :label="item.menuName"
                         :value="item.menuId"
                         :disabled="item.disabled" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.smenu.sortOrder')" prop="sortOrder">
            <el-input-number v-model="editForm.sortOrder" style="width:100%" :min="1" :precision="0" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.smenu.pagePath')" prop="path">
            <el-input v-model="editForm.path"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.smenu.pleaseInputPagePath')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.smenu.apiRoute')" prop="routePath">
            <el-input v-model="editForm.routePath"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.smenu.pleaseInputApiRoute')" />
          </el-form-item>
          <!-- 占位项：保持与上方两列布局对齐 -->
          <el-form-item />
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
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post } from '@/utils/request'
import {
  GET_SMENU_PAGES_API,
  GET_SMENU_ENTITY_API,
  INSERT_SMENU_API,
  UPDATE_SMENU_API,
  DELETE_SMENU_API,
  GET_MODULE_DROP_API,
  GET_PMENU_DROP_API
} from '@/config/api/systembasicmgmt/system-mgmt/smenu'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

/** 新增时的 menuId 占位值，提交前据此区分新增/编辑 */
const NEW_MENU_ID = '0'

const smenuList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const moduleOptions = ref([])
const pmenuOptions = ref([])
const filterPMenuOptions = ref([])

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

const dialogVisible = ref(false)
const dialogTitle = ref('')

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
  level: 1,
  routePath: '',
  path: '',
  redirect: '',
  remark: ''
})

const formRules = {
  menuCode: [
    { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputSMenuCode'), trigger: 'blur' }
  ],
  menuNameCn: [
    { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputSMenuNameCn'), trigger: 'blur' }
  ],
  menuNameEn: [
    { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputSMenuNameEn'), trigger: 'blur' }
  ],
  moduleId: [
    { required: true, message: () => t('systembasicmgmt.smenu.pleaseSelectModule'), trigger: 'change' }
  ],
  parentMenuId: [
    { required: true, message: () => t('systembasicmgmt.smenu.pleaseSelectPMenu'), trigger: 'change' }
  ],
  menuIcon: [
    { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputSMenuIcon'), trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputSortOrder'), trigger: 'blur' }
  ],
  path: [
    { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputPagePath'), trigger: 'blur' }
  ],
  routePath: [
    { required: true, message: () => t('systembasicmgmt.smenu.pleaseInputApiRoute'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 拉取模块下拉数据，统一供初始化与新增/编辑弹窗复用 */
const fetchModuleDropdown = async () => {
  const res = await post(GET_MODULE_DROP_API.GET_MODULE_DROP)
  moduleOptions.value = res?.data || []
  return moduleOptions.value.find(item => !item.disabled)
}

/** 按模块拉取一级菜单下拉数据 */
const fetchPMenuDropdownByModule = async (moduleId) => {
  if (!moduleId) return []
  const formData = new FormData()
  formData.append('moduleId', String(moduleId))
  const res = await post(GET_PMENU_DROP_API.GET_PMENU_TYPE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    skipDedupe: true
  })
  return res?.data || []
}

const fetchFormPMenuDropdown = async () => {
  try {
    pmenuOptions.value = await fetchPMenuDropdownByModule(editForm.moduleId)
  } catch {
    showMessage(t('systembasicmgmt.getParentMenuDataFailed'))
  }
}

const fetchFilterPMenuDropdown = async () => {
  try {
    filterPMenuOptions.value = await fetchPMenuDropdownByModule(filters.moduleId)
    const firstEnabledPMenu = filterPMenuOptions.value.find(item => !item.disabled)
    if (firstEnabledPMenu) {
      filters.parentMenuId = firstEnabledPMenu.menuId
    }
  } catch {
    showMessage(t('systembasicmgmt.getParentMenuDataFailed'))
  }
}

const fetchSMenuPages = async () => {
  loading.value = true
  try {
    const res = await post(GET_SMENU_PAGES_API.GET_SMENU_PAGES, {
      ...filters,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    })
    smenuList.value = res?.data || []
    pagination.totalCount = res?.totalCount || 0
  } catch {
    showMessage(t('systembasicmgmt.getDataFailed'))
  } finally {
    loading.value = false
  }
}

const fetchSMenuEntity = async (menuId) => {
  try {
    const formData = new FormData()
    formData.append('menuId', menuId)
    const res = await post(GET_SMENU_ENTITY_API.GET_SMENU_ENTITY, formData)
    if (res?.code !== 200) return
    const data = res.data
    const originalParentMenuId = data.parentMenuId
    Object.assign(editForm, {
      menuId: data.menuId,
      moduleId: data.moduleId,
      menuCode: data.menuCode || '',
      menuNameCn: data.menuNameCn || '',
      menuNameEn: data.menuNameEn || '',
      menuType: String(data.menuType || ''),
      menuUrl: data.menuUrl || '',
      menuIcon: data.menuIcon || '',
      sortOrder: Number(data.sortOrder ?? 1),
      level: data.level,
      routePath: data.routePath || '',
      path: data.path || '',
      redirect: data.redirect || '',
      remark: data.remark || ''
    })
    // 需要先按模块拉到一级菜单选项，再回填 parentMenuId，否则下拉选中项为空
    if (editForm.moduleId) {
      await fetchFormPMenuDropdown()
      editForm.parentMenuId = originalParentMenuId
    }
  } catch {
    showMessage(t('systembasicmgmt.getEntityFailed'))
  }
}

const insertSMenu = async () => {
  submitLoading.value = true
  const res = await post(INSERT_SMENU_API.INSERT_SMENU, { ...editForm })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    resetEditForm()
    dialogVisible.value = false
    fetchSMenuPages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
  submitLoading.value = false
}

const updateSMenu = async () => {
  submitLoading.value = true
  const res = await post(UPDATE_SMENU_API.UPDATE_SMENU, { ...editForm })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    resetEditForm()
    dialogVisible.value = false
    fetchSMenuPages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
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
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    fetchSMenuPages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchSMenuPages()
  }, DEBOUNCE_MS)
}

const resetEditForm = () => {
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
    routePath: '',
    remark: ''
  })
}

const handleSearch = () => scheduleSearch()

const handleReset = async () => {
  filters.menuName = ''
  filters.menuCode = ''
  filters.menuNameEn = ''
  filters.menuUrl = ''
  const firstEnabledModule = moduleOptions.value.find(item => !item.disabled)
  if (firstEnabledModule) {
    filters.moduleId = firstEnabledModule.moduleId
    await fetchFilterPMenuDropdown()
  }
  scheduleSearch()
}

const handleFilterModuleChange = async () => {
  loading.value = true
  filters.parentMenuId = ''
  // 先等父菜单下拉拉取完成（其内部会赋默认 parentMenuId），再触发查询，
  // 否则查询可能读到尚未更新的空 parentMenuId，导致结果与所选模块不一致
  await fetchFilterPMenuDropdown()
  scheduleSearch()
}

const handleFilterParentMenuChange = () => scheduleSearch()

const handleFormModuleChange = () => {
  editForm.parentMenuId = null
  nextTick(() => editFormRef.value?.clearValidate('parentMenuId'))
  fetchFormPMenuDropdown()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchSMenuPages()
}

const handlePageChange = () => {
  fetchSMenuPages()
}

const handleAdd = async () => {
  resetEditForm()
  editForm.menuId = NEW_MENU_ID
  dialogTitle.value = t('systembasicmgmt.smenu.addSMenu')
  dialogVisible.value = true
  try {
    const firstEnabledModule = await fetchModuleDropdown()
    if (firstEnabledModule) {
      editForm.moduleId = firstEnabledModule.moduleId
      await fetchFormPMenuDropdown()
    }
  } catch {
    showMessage(t('systembasicmgmt.getModuleDataFailed'))
  }
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.smenu.editSMenu')
  dialogVisible.value = true
  try {
    await fetchModuleDropdown()
  } catch {
    showMessage(t('systembasicmgmt.getModuleDataFailed'))
  }
  await fetchSMenuEntity(row.menuId)
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.smenu.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  await deleteSMenu(row.menuId)
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return
  const isNew = !editForm.menuId || editForm.menuId === NEW_MENU_ID
  if (isNew) {
    await insertSMenu()
  } else {
    await updateSMenu()
  }
}

const handleDialogClose = () => {
  resetEditForm()
  editFormRef.value?.clearValidate()
}

onMounted(async () => {
  try {
    const firstEnabledModule = await fetchModuleDropdown()
    if (firstEnabledModule) {
      filters.moduleId = firstEnabledModule.moduleId
      await fetchFilterPMenuDropdown()
    }
  } catch {
    showMessage(t('systembasicmgmt.initDataFailed'))
  }
  fetchSMenuPages()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
