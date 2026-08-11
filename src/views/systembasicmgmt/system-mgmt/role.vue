<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.role.ariaFilterLabel')">
        <el-form-item :label="$t('systembasicmgmt.role.roleCode')">
          <el-input v-model="filters.roleCode"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.role.pleaseInputRoleCode')" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.role.roleName')">
          <el-input v-model="filters.roleName"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.role.pleaseInputRoleName')" />
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
            {{ $t('systembasicmgmt.role.addRole') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table :data="roleList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.index')" width="70" align="center" fixed />
          <el-table-column prop="roleCode" :label="$t('systembasicmgmt.role.roleCode')" align="left" min-width="140" />
          <el-table-column prop="roleNameCn" :label="$t('systembasicmgmt.role.roleNameCn')" align="left" min-width="200" />
          <el-table-column prop="roleNameEn" :label="$t('systembasicmgmt.role.roleNameEn')" align="left" min-width="200" />
          <el-table-column :label="$t('systembasicmgmt.operation')" min-width="220" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small" @click="handleConfigModule(scope.row)">{{ $t('systembasicmgmt.role.configModule') }}</el-button>
              <el-button size="small" @click="handleConfigMenu(scope.row)">{{ $t('systembasicmgmt.role.configMenu') }}</el-button>
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

    <!-- 角色编辑对话框 -->
    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :model="editForm"
               :rules="formRules"
               ref="editFormRef"
               label-width="100px"
               class="dialog-form"
               role="form"
               :aria-label="$t('systembasicmgmt.role.ariaEditLabel')">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.role.roleCode')" prop="roleCode">
            <el-input v-model="editForm.roleCode"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.role.pleaseInputRoleCode')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.role.roleNameCn')" prop="roleNameCn">
            <el-input v-model="editForm.roleNameCn"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.role.pleaseInputRoleNameCn')" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.role.roleNameEn')" prop="roleNameEn">
            <el-input v-model="editForm.roleNameEn"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.role.pleaseInputRoleNameEn')" />
          </el-form-item>
          <!-- 占位项：保持与上方两列布局对齐 -->
          <el-form-item />
        </div>
        <div class="form-row full-width">
          <el-form-item :label="$t('systembasicmgmt.remark')">
            <el-input v-model="editForm.remark" type="textarea" :rows="3" style="width:100%" />
          </el-form-item>
        </div>
        <!-- 是否启用：按企业标准化需求去掉该字段的前端功能（不展示/不允许编辑） -->
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 模块权限配置对话框 -->
    <el-dialog v-model="moduleDialogVisible"
               :title="$t('systembasicmgmt.role.configModule')"
               width="30%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleModuleDialogClose">
      <div class="role-name-display">
        <strong>{{ $t('systembasicmgmt.role.currentRole') }}: {{ currentRoleName }}</strong>
      </div>
      <div class="module-tree-container">
        <el-tree ref="moduleTreeRef"
                 :data="moduleTreeData"
                 show-checkbox
                 node-key="moduleId"
                 :props="MODULE_TREE_PROPS"
                 :default-checked-keys="defaultCheckedModules" />
      </div>
      <template #footer>
        <el-button @click="moduleDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="saveModuleConfig">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>

    <!-- 菜单权限配置对话框 -->
    <el-dialog v-model="menuDialogVisible"
               :title="$t('systembasicmgmt.role.configMenu')"
               width="40%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleMenuDialogClose">
      <div class="role-name-display">
        <strong>{{ $t('systembasicmgmt.role.currentRole') }}: {{ currentRoleName }}</strong>
      </div>
      <div class="menu-config-container">
        <div class="module-select-section">
          <div class="section-title">{{ $t('systembasicmgmt.role.selectModule') }}</div>
          <el-select v-model="selectedModuleId"
                     style="width: 100%"
                     :placeholder="$t('systembasicmgmt.role.selectModule')"
                     @change="handleModuleChange">
            <el-option v-for="item in moduleOptions"
                       :key="item.moduleId"
                       :label="item.moduleName"
                       :value="item.moduleId"
                       :disabled="item.disabled" />
          </el-select>
        </div>

        <div class="menu-tree-section">
          <div class="section-title">{{ $t('systembasicmgmt.role.configMenu') }}</div>
          <el-tree ref="menuTreeRef"
                   :data="menuTreeData"
                   show-checkbox
                   node-key="menuId"
                   :props="MENU_TREE_PROPS"
                   :default-checked-keys="defaultCheckedMenus"
                   :check-strictly="false"
                   check-on-click-node />
        </div>
      </div>
      <template #footer>
        <el-button @click="menuDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="saveMenuConfig">{{ $t('common.confirm') }}</el-button>
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
  GET_ROLE_PAGES_API,
  GET_ROLE_ENTITY_API,
  INSERT_ROLE_API,
  UPDATE_ROLE_API,
  DELETE_ROLE_API,
  GET_ROLE_MODULE_LIST_API,
  GET_ROLE_MODULE_DROPDOWN_API,
  GET_ROLE_MENU_TREE_API,
  UPDATE_ROLE_MODULE_CONFIG_API,
  UPDATE_ROLE_MENU_CONFIG_API
} from '@/config/api/systembasicmgmt/system-mgmt/role'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const MODULE_TREE_PROPS = { label: 'moduleName', children: 'children' }
const MENU_TREE_PROPS = { label: 'menuName', children: 'menuChildren' }

const roleList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const filters = reactive({
  roleCode: '',
  roleName: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref(t('systembasicmgmt.role.editRole'))

const editForm = reactive({
  roleId: '',
  roleCode: '',
  roleNameCn: '',
  roleNameEn: '',
  description: '',
  // 是否启用：前端不提供编辑能力，仍保留字段用于兼容后端（新增默认启用、编辑沿用原值）
  isEnabled: 1,
  remark: ''
})

const formRules = {
  roleCode: [
    { required: true, message: () => t('systembasicmgmt.role.pleaseInputRoleCode'), trigger: 'blur' }
  ],
  roleNameCn: [
    { required: true, message: () => t('systembasicmgmt.role.pleaseInputRoleNameCn'), trigger: 'blur' }
  ],
  roleNameEn: [
    { required: true, message: () => t('systembasicmgmt.role.pleaseInputRoleNameEn'), trigger: 'blur' }
  ]
}

// 当前正在配置权限的角色
const currentRoleId = ref('')
const currentRoleName = ref('')

// 模块权限配置
const moduleDialogVisible = ref(false)
const moduleTreeRef = ref(null)
const moduleTreeData = ref([])
const defaultCheckedModules = ref([])

// 菜单权限配置
const menuDialogVisible = ref(false)
const menuTreeRef = ref(null)
const menuTreeData = ref([])
const defaultCheckedMenus = ref([])
const selectedModuleId = ref('')
const moduleOptions = ref([])

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const fetchRolePages = async () => {
  loading.value = true
  const res = await post(GET_ROLE_PAGES_API.GET_ROLE_PAGES, {
    ...filters,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  })
  roleList.value = res?.data || []
  pagination.totalCount = res?.totalCount || 0
  loading.value = false
}

const fetchRoleEntity = async (roleId) => {
  const formData = new FormData()
  formData.append('roleId', roleId)
  const res = await post(GET_ROLE_ENTITY_API.GET_ROLE_ENTITY, formData)
  if (res?.code !== 200) return
  Object.assign(editForm, {
    roleId: res.data.roleId,
    roleCode: res.data.roleCode || '',
    roleNameCn: res.data.roleNameCn || '',
    roleNameEn: res.data.roleNameEn || '',
    description: res.data.description || '',
    isEnabled: res.data.isEnabled,
    remark: res.data.remark || ''
  })
}

const insertRole = async () => {
  submitLoading.value = true
  const res = await post(INSERT_ROLE_API.INSERT_ROLE, {
    roleId: '',
    roleCode: editForm.roleCode,
    roleNameCn: editForm.roleNameCn,
    roleNameEn: editForm.roleNameEn,
    description: editForm.description,
    isEnabled: 1, // 前端不提供“是否启用”开关：新增默认启用
    remark: editForm.remark
  })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    resetEditForm()
    dialogVisible.value = false
    fetchRolePages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
  submitLoading.value = false
}

const updateRole = async () => {
  submitLoading.value = true
  const res = await post(UPDATE_ROLE_API.UPDATE_ROLE, {
    roleId: editForm.roleId,
    roleCode: editForm.roleCode,
    roleNameCn: editForm.roleNameCn,
    roleNameEn: editForm.roleNameEn,
    description: editForm.description,
    isEnabled: editForm.isEnabled, // 前端不提供“是否启用”开关：编辑时沿用后端原值，避免无意变更
    remark: editForm.remark
  })
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    resetEditForm()
    dialogVisible.value = false
    fetchRolePages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
  submitLoading.value = false
}

const deleteRole = async (roleId) => {
  if (isNaN(roleId)) {
    showMessage(t('systembasicmgmt.invalidId'))
    return
  }
  const formData = new FormData()
  formData.append('roleId', roleId)
  const res = await post(DELETE_ROLE_API.DELETE_ROLE, formData)
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    fetchRolePages()
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchRolePages()
  }, DEBOUNCE_MS)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    roleId: '',
    roleCode: '',
    roleNameCn: '',
    roleNameEn: '',
    description: '',
    isEnabled: 1,
    remark: ''
  })
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.roleCode = ''
  filters.roleName = ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchRolePages()
}

const handlePageChange = () => {
  fetchRolePages()
}

const handleAdd = () => {
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.role.addRole')
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleEdit = async (row) => {
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.role.editRole')
  await fetchRoleEntity(row.roleId)
  dialogVisible.value = true
  nextTick(() => editFormRef.value?.clearValidate())
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.role.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  await deleteRole(row.roleId)
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return
  if (editForm.roleId) {
    await updateRole()
  } else {
    await insertRole()
  }
}

const handleDialogClose = () => {
  resetEditForm()
  editFormRef.value?.clearValidate()
}

/* ---------------- 模块权限配置 ---------------- */

const fetchRoleModuleList = async (roleId) => {
  const res = await post(GET_ROLE_MODULE_LIST_API.GET_ROLE_MODULE_LIST, { roleId })
  if (res?.code === 200) {
    moduleTreeData.value = res.data || []
    defaultCheckedModules.value = (res.data || [])
      .filter(item => item.isChecked)
      .map(item => item.moduleId)
  } else {
    showMessage(res?.message || t('systembasicmgmt.role.fetchModuleListFail'), Number(res?.code) === 400 ? 'warning' : 'error')
  }
}

const handleConfigModule = async (row) => {
  currentRoleId.value = row.roleId
  currentRoleName.value = row.roleNameCn || row.roleName || ''
  await fetchRoleModuleList(row.roleId)
  moduleDialogVisible.value = true
}

const saveModuleConfig = async () => {
  const checkedIds = moduleTreeRef.value?.getCheckedKeys() || []
  const collectModuleIds = (nodes) => nodes.flatMap(node => [
    node.moduleId,
    ...(node.children?.length ? collectModuleIds(node.children) : [])
  ])
  const allModuleIds = collectModuleIds(moduleTreeData.value)
  const res = await post(UPDATE_ROLE_MODULE_CONFIG_API.UPDATE_ROLE_MODULE_CONFIG, {
    roleId: currentRoleId.value,
    SelectedModuleIds: checkedIds,
    UnSelectedModuleIds: allModuleIds.filter(id => !checkedIds.includes(id))
  })
  if (res?.code === 200) {
    moduleDialogVisible.value = false
    showMessage(res?.message || t('systembasicmgmt.role.moduleConfigSuccess'), 'success')
  } else {
    showMessage(res?.message || t('systembasicmgmt.role.moduleConfigFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  }
}

const handleModuleDialogClose = () => {
  moduleTreeData.value = []
  defaultCheckedModules.value = []
  currentRoleId.value = ''
  currentRoleName.value = ''
  nextTick(() => moduleTreeRef.value?.setCheckedKeys([]))
}

/* ---------------- 菜单权限配置 ---------------- */

/** 只返回叶子节点的 ID，确保 el-tree 正确显示半选中状态 */
const collectCheckedLeafMenuIds = (menuList) => {
  let checkedIds = []
  menuList.forEach(menu => {
    const hasChildren = menu.menuChildren && menu.menuChildren.length > 0
    if (menu.isChecked && !hasChildren) {
      checkedIds.push(menu.menuId)
    }
    if (hasChildren) {
      checkedIds = checkedIds.concat(collectCheckedLeafMenuIds(menu.menuChildren))
    }
  })
  return checkedIds
}

const fetchRoleMenuTree = async (roleId, moduleId) => {
  const res = await post(GET_ROLE_MENU_TREE_API.GET_ROLE_MENU_TREE, { roleId, moduleId })
  if (res?.code === 200) {
    menuTreeData.value = res.data || []
    const checkedIds = collectCheckedLeafMenuIds(res.data || [])
    defaultCheckedMenus.value = checkedIds
    nextTick(() => menuTreeRef.value?.setCheckedKeys(checkedIds))
  } else {
    showMessage(res?.message || t('systembasicmgmt.role.fetchMenuTreeFail'), Number(res?.code) === 400 ? 'warning' : 'error')
  }
}

const fetchRoleModuleDropdown = async () => {
  const formData = new FormData()
  formData.append('roleId', String(currentRoleId.value))
  const res = await post(GET_ROLE_MODULE_DROPDOWN_API.GET_ROLE_MODULE_DROPDOWN, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    skipDedupe: true
  })
  if (res?.code === 200) {
    moduleOptions.value = res.data || []
    const firstValidModule = moduleOptions.value.find(item => !item.disabled)
    if (firstValidModule) {
      selectedModuleId.value = firstValidModule.moduleId
      await fetchRoleMenuTree(currentRoleId.value, firstValidModule.moduleId)
    }
  } else {
    showMessage(res?.message || t('systembasicmgmt.role.fetchModuleDropdownFail'), Number(res?.code) === 400 ? 'warning' : 'error')
  }
}

const handleConfigMenu = async (row) => {
  currentRoleId.value = row.roleId
  currentRoleName.value = row.roleNameCn || row.roleName || ''
  await fetchRoleModuleDropdown()
  menuDialogVisible.value = true
}

const handleModuleChange = async (moduleId) => {
  if (!moduleId) return
  await fetchRoleMenuTree(currentRoleId.value, moduleId)
}

const saveMenuConfig = async () => {
  const checkedIds = menuTreeRef.value?.getCheckedKeys() || []
  const halfCheckedIds = menuTreeRef.value?.getHalfCheckedKeys() || []
  const res = await post(UPDATE_ROLE_MENU_CONFIG_API.UPDATE_ROLE_MENU_CONFIG, {
    roleId: currentRoleId.value,
    moduleId: selectedModuleId.value,
    SelectedMenuIds: [...checkedIds, ...halfCheckedIds]
  })
  if (res?.code === 200) {
    menuDialogVisible.value = false
    showMessage(res?.message || t('systembasicmgmt.role.menuConfigSuccess'), 'success')
  } else {
    showMessage(res?.message || t('systembasicmgmt.role.menuConfigFailed'), Number(res?.code) === 400 ? 'warning' : 'error')
  }
}

const handleMenuDialogClose = () => {
  menuTreeData.value = []
  defaultCheckedMenus.value = []
  moduleOptions.value = []
  selectedModuleId.value = ''
  currentRoleId.value = ''
  currentRoleName.value = ''
  nextTick(() => menuTreeRef.value?.setCheckedKeys([]))
}

onMounted(() => {
  fetchRolePages()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.role-name-display {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.role-name-display strong {
  color: #303133;
  font-size: 14px;
}

.menu-config-container {
  display: flex;
  gap: 15px;
  height: 400px;
  max-height: 400px;
}

.module-select-section {
  flex: 0 0 200px;
  padding: 15px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.menu-tree-section {
  flex: 1;
  padding: 15px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.menu-tree-section :deep(.el-tree) {
  flex: 1;
  overflow-y: auto;
  background-color: transparent;
}

.menu-tree-section :deep(.el-tree-node__content) {
  height: 32px;
  line-height: 32px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.module-tree-container {
  padding: 15px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  height: 400px;
  max-height: 400px;
  overflow-y: auto;
}

.module-tree-container :deep(.el-tree) {
  background-color: transparent;
}

.module-tree-container :deep(.el-tree-node__content) {
  height: 32px;
  line-height: 32px;
}
</style>
