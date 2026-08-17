<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('custmat.salesuser.ariaFilterLabel')">
        <el-form-item :label="$t('custmat.salesuser.department')">
          <el-tree-select v-model="filters.salesDeptId"
                          :data="departmentOptions"
                          :props="DEPARTMENT_TREE_PROPS"
                          check-strictly
                          filterable
                          clearable
                          :filter-node-method="filterNodeMethod"
                          style="width: 220px"
                          popper-class="main-dept-filter-popper"
                          :placeholder="$t('custmat.salesuser.pleaseSelectDepartment')" />
        </el-form-item>
        <el-form-item :label="$t('custmat.salesuser.salesType')">
          <el-select v-model="filters.salesType"
                     style="width: 160px"
                     clearable
                     :placeholder="$t('custmat.salesuser.pleaseSelectSalesType')">
            <el-option v-for="item in salesTypeOptions" :key="item.salesType" :label="item.salesTypeName" :value="item.salesType" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('custmat.salesuser.userNo')">
          <el-input v-model="filters.userNo"
                    style="width: 160px"
                    clearable
                    :placeholder="$t('custmat.salesuser.pleaseInputUserNo')" />
        </el-form-item>
        <el-form-item :label="$t('custmat.salesuser.userName')">
          <el-input v-model="filters.userName"
                    style="width: 160px"
                    clearable
                    :placeholder="$t('custmat.salesuser.pleaseInputUserName')" />
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
            {{ $t('custmat.salesuser.addSalesUser') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="salesUserList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('custmat.salesuser.index')" width="70" align="center" fixed />
          <el-table-column prop="departmentName" :label="$t('custmat.salesuser.department')" align="left" min-width="220" />
          <el-table-column prop="userNo" :label="$t('custmat.salesuser.userNo')" align="left" min-width="120" />
          <el-table-column prop="userNameCn" :label="$t('custmat.salesuser.userName')" align="left" min-width="140" />
          <el-table-column prop="salesTypeName" :label="$t('custmat.salesuser.salesType')" align="left" min-width="140" />
          <el-table-column prop="description" :label="$t('custmat.salesuser.description')" align="left" min-width="200" show-overflow-tooltip />
          <el-table-column :label="$t('custmat.salesuser.operation')" width="180" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">
                {{ $t('common.delete') }}
              </el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible"
               :title="`${$t('custmat.salesuser.mergedDialogTitle')} - ${isEdit ? $t('custmat.salesuser.editSalesUserTitle') : $t('custmat.salesuser.addSalesUserTitle')}`"
               width="760px"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <div v-loading="dialogLoading">
        <el-form ref="editFormRef"
                 :model="editForm"
                 :rules="formRules"
                 label-width="90px"
                 class="dialog-top-form"
                 role="form"
                 :aria-label="$t('custmat.salesuser.ariaEditLabel')">
          <div class="dialog-top-row">
            <el-form-item :label="$t('custmat.salesuser.salesType')" prop="salesType">
              <el-select v-model="editForm.salesType"
                         style="width: 220px"
                         :placeholder="$t('custmat.salesuser.pleaseSelectSalesType')">
                <el-option v-for="item in salesTypeOptions" :key="item.salesType" :label="item.salesTypeName" :value="item.salesType" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('custmat.salesuser.description')" prop="description">
              <el-input v-model="editForm.description"
                        style="width: 340px"
                        clearable
                        :placeholder="$t('custmat.salesuser.pleaseInputDescription')" />
            </el-form-item>
          </div>
        </el-form>

        <el-divider style="margin: 20px 0" />

        <!-- 新增：人员选择区域 -->
        <template v-if="!isEdit">
          <el-form :inline="true"
                   :model="userSelectFilters"
                   class="conventional-filter-form"
                   role="search"
                   :aria-label="$t('custmat.salesuser.ariaUserSelectLabel')">
            <el-form-item :label="$t('custmat.salesuser.department')">
              <el-tree-select v-model="userSelectFilters.departmentId"
                              :data="departmentOptions"
                              :props="DEPARTMENT_TREE_PROPS"
                              check-strictly
                              filterable
                              clearable
                              :filter-node-method="filterNodeMethod"
                              @change="handleUserSelectSearch"
                              style="width: 220px"
                              popper-class="main-dept-filter-popper"
                              :placeholder="$t('custmat.salesuser.pleaseSelectDepartment')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.salesuser.userNo')">
              <el-input v-model="userSelectFilters.userNo"
                        style="width: 160px"
                        clearable
                        :placeholder="$t('custmat.salesuser.pleaseInputUserNo')" />
            </el-form-item>
            <el-form-item :label="$t('custmat.salesuser.userName')">
              <el-input v-model="userSelectFilters.userName"
                        style="width: 160px"
                        clearable
                        :placeholder="$t('custmat.salesuser.pleaseInputUserName')" />
            </el-form-item>
            <el-form-item class="form-button-group">
              <el-button type="primary" @click="handleUserSelectSearch">{{ $t('common.search') }}</el-button>
              <el-button @click="handleUserSelectReset">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="userSelectList"
                    border
                    stripe
                    :header-cell-style="{ background: '#f5f7fa' }"
                    v-loading="userSelectLoading"
                    class="conventional-table"
                    height="280"
                    ref="userSelectTableRef"
                    @selection-change="handleSelectionChange"
                    @row-click="handleUserSelectRowClick"
                    :empty-text="$t('common.noData')"
                    >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="departmentName" :label="$t('custmat.salesuser.department')" align="left" min-width="220" />
            <el-table-column prop="userNo" :label="$t('custmat.salesuser.userNo')" align="left" min-width="120" />
            <el-table-column prop="userNameCn" :label="$t('custmat.salesuser.userName')" align="left" min-width="140" />
          </el-table>

          <div class="pagination-wrapper">
            <el-pagination v-model:current-page="userSelectPagination.pageIndex"
                           v-model:page-size="userSelectPagination.pageSize"
                           :page-sizes="[10, 20, 50]"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="userSelectPagination.totalCount"
                           @size-change="handleUserSelectSizeChange"
                           @current-change="handleUserSelectPageChange" />
          </div>

          <div class="selected-user-hint">
            <span v-if="editForm.salesUserId">
              {{ $t('custmat.salesuser.selectedUser') }}：{{ editForm.departmentName }} - {{ editForm.userNo }} - {{ editForm.userNameCn }}
            </span>
            <span v-else class="selected-user-hint--empty">{{ $t('custmat.salesuser.noUserSelected') }}</span>
          </div>
        </template>

        <!-- 编辑：只读展示当前人员信息 -->
        <el-form v-else :inline="true" label-width="90px" class="dialog-top-form">
          <div class="dialog-top-row">
            <el-form-item :label="$t('custmat.salesuser.department')">
              <el-input :model-value="editForm.departmentName" style="width: 220px" disabled />
            </el-form-item>
            <el-form-item :label="$t('custmat.salesuser.userNo')">
              <el-input :model-value="editForm.userNo" style="width: 140px" disabled />
            </el-form-item>
            <el-form-item :label="$t('custmat.salesuser.userName')">
              <el-input :model-value="editForm.userNameCn" style="width: 140px" disabled />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary"
                   @click="handleSave"
                   :loading="submitLoading"
                   :disabled="!editForm.salesUserId || submitLoading">
          {{ $t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { post, isHandled } from '@/utils/request'
import {
  GET_SALES_USER_PAGE_API,
  GET_SALES_USER_ENTITY_API,
  INSERT_SALES_USER_API,
  UPDATE_SALES_USER_API,
  DELETE_SALES_USER_API,
  GET_SALES_TYPE_DROP_API,
  GET_DEPARTMENT_DROP_API,
  GET_USER_PAGE_API
} from '@/config/api/custmat/salesmgmt/salesuser'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let userSelectSearchTimer = null

/** 实体查询/删除接口按 form-urlencoded 提交 */
const FORM_URLENCODED = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }

const DEPARTMENT_TREE_PROPS = {
  value: 'departmentId',
  label: 'departmentName',
  children: 'departmentChildList'
}

const salesUserList = ref([])
const loading = ref(false)
const departmentOptions = ref([])
const salesTypeOptions = ref([])

const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

const filters = reactive({
  salesDeptId: '',
  salesType: '',
  userNo: '',
  userName: ''
})

// 新增/编辑对话框
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const editForm = reactive({
  salesUserId: '',
  salesDeptId: '',
  salesType: '',
  description: '',
  departmentName: '',
  userNo: '',
  userNameCn: ''
})

const formRules = {
  salesType: [
    { required: true, message: () => t('custmat.salesuser.salesTypeRequired'), trigger: 'change' }
  ]
}

// 对话框内的人员选择列表（仅新增时使用）
const userSelectList = ref([])
const userSelectLoading = ref(false)
const userSelectTableRef = ref(null)

const userSelectFilters = reactive({
  departmentId: '',
  userNo: '',
  userName: ''
})

const userSelectPagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const filterNodeMethod = (value, data) => {
  if (!value) return true
  return !!data.departmentName && data.departmentName.toLowerCase().includes(value.toLowerCase())
}

const resetEditForm = () => {
  Object.assign(editForm, {
    salesUserId: '',
    salesDeptId: '',
    salesType: '',
    description: '',
    departmentName: '',
    userNo: '',
    userNameCn: ''
  })
}

const fetchDepartmentOptions = async () => {
  try {
    const res = await post(GET_DEPARTMENT_DROP_API.GET_DEPARTMENT_DROP, {})
    if (isHandled(res)) {
      departmentOptions.value = []
      return
    }
    if (res?.code === 200) {
      const validateDepartment = (dept) => {
        if (!dept || dept.departmentId === undefined || dept.departmentId === null ||
            dept.departmentName === undefined || dept.departmentName === null) {
          return false
        }
        if (Array.isArray(dept.departmentChildList)) {
          dept.departmentChildList = dept.departmentChildList.filter(validateDepartment)
        }
        return true
      }
      departmentOptions.value = (Array.isArray(res.data) ? res.data : []).filter(validateDepartment)
    } else {
      departmentOptions.value = []
      showMessage(res?.message || t('custmat.salesuser.getDepartmentFailed'))
    }
  } catch {
    departmentOptions.value = []
    showMessage(t('custmat.salesuser.getDepartmentFailed'))
  }
}

/** 业务类型下拉：按 salesType 去重取 {salesType, salesTypeName} */
const fetchSalesTypeOptions = async () => {
  try {
    const res = await post(GET_SALES_TYPE_DROP_API.GET_SALES_TYPE_DROP, {})
    if (isHandled(res)) {
      salesTypeOptions.value = []
      return
    }
    if (res?.code === 200) {
      const seen = new Map()
      for (const item of (Array.isArray(res.data) ? res.data : [])) {
        if (item?.salesType !== undefined && item?.salesType !== null && !seen.has(item.salesType)) {
          seen.set(item.salesType, { salesType: item.salesType, salesTypeName: item.salesTypeName })
        }
      }
      salesTypeOptions.value = Array.from(seen.values())
    } else {
      salesTypeOptions.value = []
      showMessage(res?.message || t('custmat.salesuser.getSalesTypeFailed'))
    }
  } catch {
    salesTypeOptions.value = []
    showMessage(t('custmat.salesuser.getSalesTypeFailed'))
  }
}

const fetchSalesUserList = async () => {
  loading.value = true
  try {
    const res = await post(GET_SALES_USER_PAGE_API.GET_SALES_USER_PAGE, {
      salesDeptId: filters.salesDeptId,
      salesType: filters.salesType,
      userNo: filters.userNo,
      userName: filters.userName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    })

    if (isHandled(res)) {
      salesUserList.value = []
      return
    }

    if (res?.code === 200) {
      salesUserList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      showMessage(res?.message || t('custmat.salesuser.getFailed'))
      salesUserList.value = []
    }
  } catch {
    showMessage(t('custmat.salesuser.getFailed'))
    salesUserList.value = []
  } finally {
    loading.value = false
  }
}

const fetchUserSelectList = async () => {
  userSelectLoading.value = true
  try {
    const res = await post(GET_USER_PAGE_API.GET_USER_PAGE, {
      departmentId: userSelectFilters.departmentId,
      userNo: userSelectFilters.userNo,
      userName: userSelectFilters.userName,
      pageIndex: userSelectPagination.pageIndex,
      pageSize: userSelectPagination.pageSize,
      totalCount: userSelectPagination.totalCount
    })

    if (isHandled(res)) {
      userSelectList.value = []
      return
    }

    if (res?.code === 200) {
      userSelectList.value = res.data || []
      userSelectPagination.totalCount = res.totalCount || 0
    } else {
      userSelectList.value = []
      showMessage(res?.message || t('custmat.salesuser.getUserFailed'))
    }
  } catch {
    userSelectList.value = []
    showMessage(t('custmat.salesuser.getUserFailed'))
  } finally {
    userSelectLoading.value = false
  }
}

const scheduleUserSelectSearch = () => {
  if (userSelectSearchTimer) clearTimeout(userSelectSearchTimer)
  userSelectSearchTimer = setTimeout(() => {
    userSelectPagination.pageIndex = 1
    fetchUserSelectList()
  }, DEBOUNCE_MS)
}

const handleSearch = () => {
  pagination.pageIndex = 1
  fetchSalesUserList()
}

const handleReset = () => {
  Object.assign(filters, { salesDeptId: '', salesType: '', userNo: '', userName: '' })
  handleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchSalesUserList()
}

const handlePageChange = () => {
  fetchSalesUserList()
}

const handleUserSelectSearch = () => scheduleUserSelectSearch()

const handleUserSelectReset = () => {
  Object.assign(userSelectFilters, { departmentId: '', userNo: '', userName: '' })
  scheduleUserSelectSearch()
}

const handleUserSelectSizeChange = () => {
  userSelectPagination.pageIndex = 1
  fetchUserSelectList()
}

const handleUserSelectPageChange = () => {
  fetchUserSelectList()
}

/** 新增时只能指定一名人员，多选时只保留最后勾选的一行 */
const handleSelectionChange = (selection) => {
  if (selection.length > 1 && userSelectTableRef.value) {
    const latest = selection[selection.length - 1]
    userSelectTableRef.value.clearSelection()
    userSelectTableRef.value.toggleRowSelection(latest, true)
    return
  }
  const row = selection[0]
  if (row) {
    editForm.salesUserId = String(row.userId)
    editForm.salesDeptId = row.departmentId
    editForm.departmentName = row.departmentName
    editForm.userNo = row.userNo
    editForm.userNameCn = row.userNameCn
  } else {
    editForm.salesUserId = ''
    editForm.salesDeptId = ''
    editForm.departmentName = ''
    editForm.userNo = ''
    editForm.userNameCn = ''
  }
}

const handleUserSelectRowClick = (row) => {
  userSelectTableRef.value?.toggleRowSelection(row)
}

const handleAdd = async () => {
  resetEditForm()
  Object.assign(userSelectFilters, { departmentId: '', userNo: '', userName: '' })
  Object.assign(userSelectPagination, { pageIndex: 1, pageSize: 10, totalCount: 0 })
  userSelectList.value = []

  isEdit.value = false
  dialogVisible.value = true
  dialogLoading.value = true

  if (departmentOptions.value.length === 0) await fetchDepartmentOptions()
  if (salesTypeOptions.value.length === 0) await fetchSalesTypeOptions()

  await nextTick()
  editFormRef.value?.clearValidate()
  dialogLoading.value = false
  await fetchUserSelectList()
}

const handleEdit = async (row) => {
  isEdit.value = true
  dialogVisible.value = true
  dialogLoading.value = true

  try {
    if (departmentOptions.value.length === 0) await fetchDepartmentOptions()
    if (salesTypeOptions.value.length === 0) await fetchSalesTypeOptions()

    const res = await post(
      GET_SALES_USER_ENTITY_API.GET_SALES_USER_ENTITY,
      new URLSearchParams({ salesUserId: String(row.salesUserId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) {
      dialogVisible.value = false
      return
    }

    if (res?.code === 200 && res.data) {
      const data = Array.isArray(res.data) ? res.data[0] : res.data
      Object.assign(editForm, {
        salesUserId: data.salesUserId ? String(data.salesUserId) : '',
        salesDeptId: data.salesDeptId,
        salesType: data.salesType,
        description: data.description,
        departmentName: data.departmentName,
        userNo: data.userNo,
        userNameCn: data.userNameCn
      })
    } else {
      showMessage(res?.message || t('custmat.salesuser.getSalesUserDetailFailed'))
      dialogVisible.value = false
      return
    }

    await nextTick()
    editFormRef.value?.clearValidate()
  } catch {
    showMessage(t('custmat.salesuser.getSalesUserDetailFailed'))
    dialogVisible.value = false
  } finally {
    dialogLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('custmat.salesuser.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  try {
    const res = await post(
      DELETE_SALES_USER_API.DELETE_SALES_USER,
      new URLSearchParams({ salesUserId: String(row.salesUserId) }),
      FORM_URLENCODED
    )

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || t('custmat.salesuser.deleteSalesUserSuccess'), 'success')
      fetchSalesUserList()
    } else {
      showMessage(res?.message || t('custmat.salesuser.operationFailed'))
    }
  } catch {
    showMessage(t('custmat.salesuser.operationFailed'))
  }
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return

  if (!editForm.salesUserId) {
    showMessage(t('custmat.salesuser.pleaseSelectUser'), 'warning')
    return
  }

  submitLoading.value = true
  try {
    const api = isEdit.value
      ? UPDATE_SALES_USER_API.UPDATE_SALES_USER
      : INSERT_SALES_USER_API.INSERT_SALES_USER
    const res = await post(api, {
      salesUserId: editForm.salesUserId,
      salesDeptId: editForm.salesDeptId,
      salesType: editForm.salesType,
      description: editForm.description
    })

    if (isHandled(res)) return

    if (res?.code === 200) {
      showMessage(res.message || (isEdit.value ? t('custmat.salesuser.editSalesUserSuccess') : t('custmat.salesuser.addSalesUserSuccess')), 'success')
      dialogVisible.value = false
      fetchSalesUserList()
    } else {
      showMessage(res?.message || t('custmat.salesuser.operationFailed'))
    }
  } catch {
    showMessage(t('custmat.salesuser.operationFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDialogClose = () => {
  resetEditForm()
  dialogLoading.value = false
  editFormRef.value?.clearValidate()
}

onMounted(async () => {
  await Promise.all([fetchDepartmentOptions(), fetchSalesTypeOptions()])
  fetchSalesUserList()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.dialog-top-form {
  padding: 4px 0 0;
}

.dialog-top-row {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.dialog-top-row .el-form-item {
  margin-bottom: 0;
}

.selected-user-hint {
  margin-top: 12px;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.selected-user-hint--empty {
  color: var(--el-text-color-placeholder);
}
</style>

<!-- 部门树下拉项加高、加宽（下拉挂载到 body，需单独样式） -->
<style>
.main-dept-filter-popper {
  width: auto !important;
  min-width: 280px !important;
}

.main-dept-filter-popper .el-select-dropdown__wrap,
.main-dept-filter-popper .el-scrollbar__view,
.main-dept-filter-popper .el-tree {
  width: 100% !important;
  min-width: 100% !important;
}

.main-dept-filter-popper .el-tree-node__content {
  height: 36px;
  line-height: 36px;
  padding-left: 12px;
  width: 100% !important;
  min-width: 100% !important;
}
</style>
