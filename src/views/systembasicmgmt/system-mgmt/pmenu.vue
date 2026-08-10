<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.pmenu.searchFormLabel')">
        <el-form-item :label="$t('systembasicmgmt.pmenu.module')">
          <el-select v-model="filters.moduleId"
                     style="width: 220px"
                     :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.pmenu.module')"
                     @change="handleModuleChange">
            <el-option v-for="item in moduleOptions"
                       :key="item.moduleId"
                       :label="item.moduleName"
                       :value="item.moduleId"
                       :disabled="item.disabled" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.pmenu.menuCode')">
          <el-input v-model="filters.menuCode"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.inputPlaceholder') + $t('systembasicmgmt.pmenu.menuCode')" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.pmenu.menuName')">
          <el-input v-model="filters.menuName"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.inputPlaceholder') + $t('systembasicmgmt.pmenu.menuName')" />
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
            {{ $t('systembasicmgmt.pmenu.addPMenu') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table :data="pmenuList"
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
               :aria-label="$t('systembasicmgmt.pmenu.editFormLabel')">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuCode')" prop="menuCode">
            <el-input v-model="editForm.menuCode"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.pmenu.pleaseInputMenuCode')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuNameCn')" prop="menuNameCn">
            <el-input v-model="editForm.menuNameCn"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.pmenu.pleaseInputMenuNameCn')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuNameEn')" prop="menuNameEn">
            <el-input v-model="editForm.menuNameEn"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.pmenu.pleaseInputMenuNameEn')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.pmenu.module')" prop="moduleId">
            <el-select v-model="editForm.moduleId"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.pmenu.pleaseSelectModule')">
              <el-option v-for="item in moduleOptions"
                         :key="item.moduleId"
                         :label="item.moduleName"
                         :value="item.moduleId"
                         :disabled="item.disabled" />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.menuIcon')" prop="menuIcon">
            <el-input v-model="editForm.menuIcon"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.pmenu.pleaseInputMenuIcon')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.pmenu.sortOrder')" prop="sortOrder">
            <el-input-number v-model="editForm.sortOrder" style="width:100%" :min="1" :precision="0" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.pmenu.pagePath')" prop="path">
            <el-input v-model="editForm.path"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.pmenu.pleaseInputPagePath')" />
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
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post } from '@/utils/request'
import {
  GET_PMENU_PAGES_API,
  GET_PMENU_ENTITY_API,
  INSERT_PMENU_API,
  UPDATE_PMENU_API,
  DELETE_PMENU_API,
  GET_MODULE_DROP_API
} from '@/config/api/systembasicmgmt/system-mgmt/pmenu'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

/** 新增时的 menuId 占位值，提交前据此区分新增/编辑 */
const NEW_MENU_ID = '0'

const pmenuList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const moduleOptions = ref([])
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
const dialogTitle = ref('')

const editForm = reactive({
  menuId: '',
  parentMenuId: NEW_MENU_ID,
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
  path: [
    { required: true, message: () => t('systembasicmgmt.pmenu.pleaseInputPagePath'), trigger: 'blur' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const getFirstEnabledModuleId = () => {
  return moduleOptions.value.find(item => !item.disabled)?.moduleId ?? ''
}

const fetchModuleDropdown = async () => {
  const res = await post(GET_MODULE_DROP_API.GET_MODULE_DROP)
  moduleOptions.value = res?.data || []
}

const fetchPMenuPages = async () => {
  loading.value = true
  try {
    const res = await post(GET_PMENU_PAGES_API.GET_PMENU_PAGES, {
      ...filters,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize
    })
    pmenuList.value = res?.data || []
    pagination.totalCount = res?.totalCount || 0
  } catch {
    showMessage(t('systembasicmgmt.getDataFailed'))
  } finally {
    loading.value = false
  }
}

const fetchPMenuEntity = async (menuId) => {
  try {
    const formData = new FormData()
    formData.append('menuId', menuId)
    const res = await post(GET_PMENU_ENTITY_API.GET_PMENU_ENTITY, formData)
    if (res?.code !== 200) return
    const data = res.data
    Object.assign(editForm, {
      menuId: data.menuId,
      parentMenuId: data.parentMenuId,
      moduleId: data.moduleId,
      menuCode: data.menuCode,
      menuNameCn: data.menuNameCn,
      menuNameEn: data.menuNameEn,
      menuType: String(data.menuType || ''),
      menuUrl: data.menuUrl,
      menuIcon: data.menuIcon,
      sortOrder: data.sortOrder,
      path: data.path,
      redirect: data.redirect,
      remark: data.remark
    })
  } catch {
    showMessage(t('systembasicmgmt.getEntityFailed'))
  }
}

const insertPMenu = async () => {
  submitLoading.value = true
  const res = await post(INSERT_PMENU_API.INSERT_PMENU, { ...editForm })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    resetEditForm()
    dialogVisible.value = false
    fetchPMenuPages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
  submitLoading.value = false
}

const updatePMenu = async () => {
  submitLoading.value = true
  const res = await post(UPDATE_PMENU_API.UPDATE_PMENU, { ...editForm })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    resetEditForm()
    dialogVisible.value = false
    fetchPMenuPages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
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
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    fetchPMenuPages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchPMenuPages()
  }, DEBOUNCE_MS)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    menuId: '',
    parentMenuId: NEW_MENU_ID,
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

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.menuCode = ''
  filters.menuName = ''
  filters.moduleId = getFirstEnabledModuleId() || filters.moduleId
  scheduleSearch()
}

const handleModuleChange = () => scheduleSearch()

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchPMenuPages()
}

const handlePageChange = () => {
  fetchPMenuPages()
}

const handleAdd = async () => {
  resetEditForm()
  editForm.menuId = NEW_MENU_ID
  dialogTitle.value = t('systembasicmgmt.pmenu.addPMenu')
  dialogVisible.value = true
  await fetchModuleDropdown()
  editForm.moduleId = getFirstEnabledModuleId()
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.pmenu.editPMenu')
  dialogVisible.value = true
  await fetchModuleDropdown()
  await fetchPMenuEntity(row.menuId)
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.pmenu.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  await deletePMenu(row.menuId)
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return
  const isNew = !editForm.menuId || editForm.menuId === NEW_MENU_ID
  if (isNew) {
    await insertPMenu()
  } else {
    await updatePMenu()
  }
}

const handleDialogClose = () => {
  resetEditForm()
  editFormRef.value?.clearValidate()
}

onMounted(async () => {
  try {
    await fetchModuleDropdown()
    filters.moduleId = getFirstEnabledModuleId()
  } catch {
    showMessage(t('systembasicmgmt.getModuleDataFailed'))
  }
  fetchPMenuPages()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
