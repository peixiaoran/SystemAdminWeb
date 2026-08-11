<template>
  <el-config-provider :locale="elementPlusLocale">
    <div class="conventional-table-container">
      <el-card class="conventional-card">
        <!-- 过滤条件 -->
        <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.userPartTime.ariaFilterLabel')">
          <el-form-item :label="$t('systembasicmgmt.userPartTime.department')">
            <el-tree-select v-model="filters.departmentId"
                            :data="departmentOptions"
                            :props="DEPARTMENT_TREE_PROPS"
                            check-strictly
                            filterable
                            :filter-node-method="filterNodeMethod"
                            @change="handleDepartmentChange"
                            style="width: 220px"
                            popper-class="main-dept-filter-popper"
                            :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectDepartment')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userPartTime.userNo')">
            <el-input v-model="filters.userNo"
                      style="width: 220px"
                      :placeholder="$t('systembasicmgmt.userPartTime.pleaseEnterUserNo')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userPartTime.name')">
            <el-input v-model="filters.userName"
                      style="width: 220px"
                      :placeholder="$t('systembasicmgmt.userPartTime.pleaseEnterUserName')" />
          </el-form-item>
          <el-form-item class="form-button-group">
            <el-button type="primary" @click="handleSearch" plain>
              {{ $t('common.search') }}
            </el-button>
            <el-button @click="handleReset" plain>
              {{ $t('common.reset') }}
            </el-button>
          </el-form-item>
          <el-form-item class="form-right-button">
            <el-button type="primary" @click="handleAdd">
              {{ $t('systembasicmgmt.userPartTime.addPartTime') }}
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 表格区域 -->
        <div class="table-container">
          <el-table :data="userPartTimeList"
                    border
                    stripe
                    :header-cell-style="{ background: '#f5f7fa' }"
                    v-loading="loading"
                    class="conventional-table"
                    :empty-text="$t('common.noData')"
                    >
            <el-table-column type="index" :label="$t('systembasicmgmt.userPartTime.index')" width="70" align="center" fixed />
            <el-table-column prop="userNo" :label="$t('systembasicmgmt.userPartTime.userNo')" align="left" min-width="110" />
            <el-table-column prop="userName" :label="$t('systembasicmgmt.userPartTime.name')" align="left" min-width="170" />
            <el-table-column :label="$t('systembasicmgmt.userPartTime.isReview')" align="center" min-width="110">
              <template #default="scope">
                <el-tag :type="scope.row.isReview === '1' ? 'primary' : 'info'">
                  {{ getIsReviewText(scope.row.isReview) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userPartTime.department')" align="left" min-width="270" />
            <el-table-column prop="positionName" :label="$t('systembasicmgmt.userPartTime.position')" align="left" min-width="150" />
            <el-table-column prop="partTimeDeptName" :label="$t('systembasicmgmt.userPartTime.partTimeDepartment')" align="left" min-width="270" />
            <el-table-column prop="partTimePositionName" :label="$t('systembasicmgmt.userPartTime.partTimePosition')" align="left" min-width="150" />
            <el-table-column prop="startTime"
                             :label="$t('systembasicmgmt.userPartTime.startTime')"
                             align="center"
                             min-width="220"
                             :formatter="(row, col, val) => formatDateTime(val)" />
            <el-table-column prop="endTime"
                             :label="$t('systembasicmgmt.userPartTime.endTime')"
                             align="center"
                             min-width="220"
                             :formatter="(row, col, val) => formatDateTime(val)" />
            <el-table-column :label="$t('systembasicmgmt.userPartTime.operation')" min-width="150" fixed="right" align="center">
              <template #default="scope">
                <el-button size="small" type="primary" @click="handleEdit(scope.row)" plain>
                  {{ $t('systembasicmgmt.userPartTime.editPartTime') }}
                </el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)" plain>
                  {{ $t('systembasicmgmt.userPartTime.deletePartTime') }}
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

      <!-- 合并后的新增/编辑兼任对话框 -->
      <el-dialog v-model="dialogVisible"
                 :title="`${$t('systembasicmgmt.userPartTime.mergedDialogTitle')} - ${isEdit ? $t('systembasicmgmt.userPartTime.editPartTimeTitle') : $t('systembasicmgmt.userPartTime.addPartTimeTitle')}`"
                 width="70%"
                 :close-on-click-modal="false"
                 :append-to-body="true"
                 :lock-scroll="true"
                 class="parttime-dialog"
                 @close="handleDialogClose">
        <div class="parttime-dialog-body">
          <!-- 兼任信息区域 -->
          <el-form ref="editFormRef"
                   :model="editForm"
                   :rules="formRules"
                   label-width="auto"
                   class="parttime-form"
                   role="form"
                   :aria-label="$t('systembasicmgmt.userPartTime.ariaEditLabel')">
            <div class="parttime-form-row">
              <el-form-item :label="$t('systembasicmgmt.userPartTime.partTimeDepartment')" prop="partTimeDeptId">
                <el-tree-select v-model="editForm.partTimeDeptId"
                                :data="departmentOptions"
                                :props="DEPARTMENT_TREE_PROPS"
                                check-strictly
                                filterable
                                :filter-node-method="filterNodeMethod"
                                @change="handleFormDeptChange"
                                style="width: 210px"
                                popper-class="main-dept-filter-popper"
                                :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectPartTimeDepartment')" />
              </el-form-item>
              <el-form-item :label="$t('systembasicmgmt.userPartTime.partTimePosition')" prop="partTimePositionId">
                <el-select v-model="editForm.partTimePositionId"
                           style="width: 210px"
                           :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectPartTimePosition')">
                  <el-option v-for="item in positionOptions"
                             :key="item.positionId"
                             :label="item.positionName"
                             :value="item.positionId" />
                </el-select>
              </el-form-item>
            </div>
            <div class="parttime-form-row">
              <el-form-item :label="$t('systembasicmgmt.userPartTime.startTime')" prop="startTime">
                <el-date-picker v-model="editForm.startTime"
                                type="datetime"
                                style="width: 210px"
                                :clearable="false"
                                :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectStartTime')"
                                :disabled-date="(date) => editForm.endTime && date > new Date(editForm.endTime)"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-format="YYYY-MM-DD HH:mm:ss" />
              </el-form-item>
              <el-form-item :label="$t('systembasicmgmt.userPartTime.endTime')" prop="endTime">
                <el-date-picker v-model="editForm.endTime"
                                type="datetime"
                                style="width: 210px"
                                :clearable="false"
                                :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectEndTime')"
                                :disabled-date="(date) => editForm.startTime && date < new Date(editForm.startTime)"
                                format="YYYY-MM-DD HH:mm:ss"
                                value-format="YYYY-MM-DD HH:mm:ss" />
              </el-form-item>
            </div>
          </el-form>

          <el-divider style="margin: 25px 0 8px" />

          <!-- 搜索区域 -->
          <el-form :inline="true"
                   :model="userSelectFilters"
                   class="conventional-filter-form"
                   style="margin-top: 10px"
                   role="search"
                   :aria-label="$t('systembasicmgmt.userPartTime.ariaUserSelectLabel')">
            <el-form-item :label="$t('systembasicmgmt.userPartTime.department')">
              <el-tree-select v-model="userSelectFilters.departmentId"
                              :data="departmentOptions"
                              :props="DEPARTMENT_TREE_PROPS"
                              check-strictly
                              filterable
                              :filter-node-method="filterNodeMethod"
                              @change="handleUserSelectDeptChange"
                              style="width: 220px"
                              popper-class="main-dept-filter-popper"
                              :clearable="false"
                              :placeholder="$t('systembasicmgmt.userPartTime.pleaseSelectDepartment')" />
            </el-form-item>
            <el-form-item :label="$t('systembasicmgmt.userPartTime.userNo')">
              <el-input v-model="userSelectFilters.userNo"
                        style="width: 220px"
                        :placeholder="$t('systembasicmgmt.userPartTime.pleaseEnterUserNo')"
                        clearable />
            </el-form-item>
            <el-form-item :label="$t('systembasicmgmt.userPartTime.name')">
              <el-input v-model="userSelectFilters.userName"
                        style="width: 220px"
                        :placeholder="$t('systembasicmgmt.userPartTime.pleaseEnterUserName')"
                        clearable />
            </el-form-item>
            <el-form-item class="form-button-group">
              <el-button type="primary" @click="handleUserSelectSearch">{{ $t('common.search') }}</el-button>
              <el-button @click="handleUserSelectReset">{{ $t('common.reset') }}</el-button>
            </el-form-item>
          </el-form>

          <!-- 用户表格 -->
          <el-table :data="userSelectList"
                    border
                    stripe
                    :header-cell-style="{ background: '#f5f7fa' }"
                    v-loading="userSelectLoading || submitLoading"
                    class="conventional-table"
                    height="310"
                    ref="userSelectTableRef"
                    @selection-change="handleSelectionChange"
                    @row-click="handleUserSelectRowClick"
                    :empty-text="$t('common.noData')"
                    >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="userNo" :label="$t('systembasicmgmt.userPartTime.userNo')" align="left" min-width="100" />
            <el-table-column prop="userName" :label="$t('systembasicmgmt.userPartTime.name')" align="left" min-width="160" />
            <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userPartTime.department')" align="left" min-width="240" />
            <el-table-column prop="positionName" :label="$t('systembasicmgmt.userPartTime.position')" align="left" min-width="100" />
            <el-table-column prop="laborName" :label="$t('systembasicmgmt.userPartTime.labor')" align="left" min-width="240" />
            <el-table-column :label="$t('systembasicmgmt.userPartTime.isReview')" align="center" min-width="100">
              <template #default="scope">
                <el-tag :type="scope.row.isReview === '1' ? 'primary' : 'info'">
                  {{ getIsReviewText(scope.row.isReview) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-wrapper">
            <el-pagination v-model:current-page="userSelectPagination.pageIndex"
                           v-model:page-size="userSelectPagination.pageSize"
                           :page-sizes="[10, 20, 50]"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="userSelectPagination.totalCount"
                           @size-change="handleUserSelectSizeChange"
                           @current-change="handleUserSelectPageChange" />
          </div>
        </div>

        <template #footer>
          <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary"
                     @click="handleSave"
                     :loading="submitLoading"
                     :disabled="!editForm.userId || submitLoading">
            {{ $t('common.confirm') }}
          </el-button>
        </template>
      </el-dialog>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useI18n } from 'vue-i18n'
import { post } from '@/utils/request'
import {
  GET_USER_PARTTIME_PAGES_API,
  GET_USER_PARTTIMEENTITY_API,
  GET_USER_PARTTIMEVIEW_API,
  INSERT_USER_PARTTIME_API,
  UPDATE_USER_PARTTIME_API,
  DELETE_USER_PARTTIME_API,
  GET_POSITION_DROPDOWN_API,
  GET_DEPARTMENT_DROPDOWN_API
} from '@/config/api/systembasicmgmt/user-settings/userparttime'

const { t, locale } = useI18n()

/** 与 vue-i18n 一致，保证分页、日期时间面板等 Element Plus 内置文案随语言切换 */
const elementPlusLocale = computed(() => (locale.value === 'en-US' ? en : zhCn))

const DEBOUNCE_MS = 300
let searchTimer = null
let userSelectSearchTimer = null

const DEPARTMENT_TREE_PROPS = {
  value: 'departmentId',
  label: 'departmentName',
  children: 'departmentChildList',
  disabled: 'disabled'
}

const userPartTimeList = ref([])
const loading = ref(false)
const departmentOptions = ref([])
const positionOptions = ref([])

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const filters = reactive({
  departmentId: '',
  userNo: '',
  userName: ''
})

// 新增/编辑对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const editFormRef = ref(null)

const editForm = reactive({
  userId: '',
  old_UserId: '',
  old_PartTimeDeptId: '',
  old_PartTimePositionId: '',
  partTimeDeptId: '',
  partTimePositionId: '',
  startTime: '',
  endTime: '',
  userNo: '',
  userName: '',
  departmentName: '',
  positionName: '',
  laborName: ''
})

const formRules = {
  partTimeDeptId: [
    { required: true, message: () => t('systembasicmgmt.userPartTime.partTimeDepartmentRequired'), trigger: 'change' }
  ],
  partTimePositionId: [
    { required: true, message: () => t('systembasicmgmt.userPartTime.partTimePositionRequired'), trigger: 'change' }
  ],
  startTime: [
    { required: true, message: () => t('systembasicmgmt.userPartTime.startTimeRequired'), trigger: 'change' }
  ],
  endTime: [
    { required: true, message: () => t('systembasicmgmt.userPartTime.endTimeRequired'), trigger: 'change' }
  ]
}

// 对话框内的用户选择列表
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

const formatDateTime = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 统一提交 DateTime：优先保留本地字符串，仅规范为 ISO 本地时间格式 */
const toDateTimePayload = (val) => {
  if (!val) return null
  if (typeof val === 'string') {
    const normalized = val.trim().replace(' ', 'T')
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(normalized)) {
      return `${normalized}:00`
    }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(normalized)) {
      return normalized
    }
  }

  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const getIsReviewText = (val) => {
  if (val === '1' || val === 1) return t('common.yes')
  if (val === '0' || val === 0) return t('common.no')
  return ''
}

/** 后端 isReview 可能返回 isApproval/IsApproval，统一规范为 '1'/'0' 字符串 */
const normalizeRow = (row) => {
  const review = row.isReview ?? row.isApproval ?? row.IsApproval
  return { ...row, isReview: review === '1' || review === 1 ? '1' : '0' }
}

const filterNodeMethod = (value, data) => {
  if (!value) return true
  return !!data.departmentName && data.departmentName.toLowerCase().includes(value.toLowerCase())
}

const findFirstEnabledDepartment = (departments) => {
  for (const dept of departments) {
    if (!dept.disabled) {
      return dept.departmentId
    }
    if (Array.isArray(dept.departmentChildList) && dept.departmentChildList.length > 0) {
      const childResult = findFirstEnabledDepartment(dept.departmentChildList)
      if (childResult) {
        return childResult
      }
    }
  }
  return null
}

const getFirstEnabledPositionId = () => {
  return positionOptions.value.find(item => !item.disabled)?.positionId ?? ''
}

const clearFormValidate = () => {
  try {
    editFormRef.value?.clearValidate()
  } catch {
    // 对话框尚未渲染完成时忽略
  }
}

const fetchDepartmentDropdown = async (setDefaultFilter = false) => {
  try {
    const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
    if (res?.code !== 200) {
      departmentOptions.value = []
      showMessage(res?.message)
      return
    }
    // 验证数据结构并过滤无效数据（递归验证部门树结构）
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

    if (setDefaultFilter && departmentOptions.value.length > 0 && !filters.departmentId) {
      const firstEnabledDept = findFirstEnabledDepartment(departmentOptions.value)
      if (firstEnabledDept) {
        filters.departmentId = firstEnabledDept
      }
    }
  } catch {
    departmentOptions.value = []
    showMessage(t('systembasicmgmt.userPartTime.getDepartmentFailed'))
  }
}

const fetchPositionDropdown = async () => {
  try {
    const res = await post(GET_POSITION_DROPDOWN_API.GET_POSITION_DROPDOWN, {})
    if (res?.code !== 200) {
      positionOptions.value = []
      showMessage(res?.message)
      return
    }
    positionOptions.value = (Array.isArray(res.data) ? res.data : []).filter(item =>
      item && item.positionId !== undefined && item.positionId !== null &&
      item.positionName !== undefined && item.positionName !== null
    )
  } catch {
    positionOptions.value = []
    showMessage(t('systembasicmgmt.userPartTime.getPositionFailed'))
  }
}

const fetchUserPartTimePages = async () => {
  loading.value = true
  try {
    const res = await post(GET_USER_PARTTIME_PAGES_API.GET_USER_PARTTIME_PAGES, {
      departmentId: filters.departmentId,
      userNo: filters.userNo,
      userName: filters.userName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    })
    if (res?.code === 200) {
      userPartTimeList.value = (res.data || []).map(normalizeRow)
      pagination.totalCount = res.totalCount || 0
    } else {
      userPartTimeList.value = []
      showMessage(res?.message)
    }
  } catch {
    userPartTimeList.value = []
    showMessage(t('systembasicmgmt.userPartTime.getFailed'))
  } finally {
    loading.value = false
  }
}

const fetchUserSelectList = async () => {
  userSelectLoading.value = true
  try {
    const res = await post(GET_USER_PARTTIMEVIEW_API.GET_USER_PARTTIMEVIEW, {
      departmentId: userSelectFilters.departmentId,
      userNo: userSelectFilters.userNo,
      userName: userSelectFilters.userName,
      pageIndex: userSelectPagination.pageIndex,
      pageSize: userSelectPagination.pageSize,
      totalCount: userSelectPagination.totalCount
    })
    if (res?.code === 200) {
      userSelectList.value = (res.data || []).map(normalizeRow)
      userSelectPagination.totalCount = res.totalCount || 0
    } else {
      userSelectList.value = []
      showMessage(res?.message)
    }
  } catch {
    userSelectList.value = []
    showMessage(t('systembasicmgmt.userPartTime.getUserFailed'))
  } finally {
    userSelectLoading.value = false
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchUserPartTimePages()
  }, DEBOUNCE_MS)
}

const scheduleUserSelectSearch = () => {
  if (userSelectSearchTimer) clearTimeout(userSelectSearchTimer)
  userSelectSearchTimer = setTimeout(() => {
    userSelectPagination.pageIndex = 1
    fetchUserSelectList()
  }, DEBOUNCE_MS)
}

const resetEditForm = () => {
  Object.assign(editForm, {
    userId: '',
    old_UserId: '',
    old_PartTimeDeptId: '',
    old_PartTimePositionId: '',
    partTimeDeptId: '',
    partTimePositionId: '',
    startTime: '',
    endTime: '',
    userNo: '',
    userName: '',
    departmentName: '',
    positionName: '',
    laborName: ''
  })
}

const handleSearch = () => scheduleSearch()

const handleDepartmentChange = () => scheduleSearch()

const handleReset = () => {
  filters.userNo = ''
  filters.userName = ''
  filters.departmentId = departmentOptions.value.length > 0
    ? (findFirstEnabledDepartment(departmentOptions.value) ?? '')
    : ''
  scheduleSearch()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchUserPartTimePages()
}

const handlePageChange = () => {
  fetchUserPartTimePages()
}

const handleUserSelectSearch = () => scheduleUserSelectSearch()

const handleUserSelectDeptChange = () => {
  userSelectFilters.userNo = ''
  userSelectFilters.userName = ''
  scheduleUserSelectSearch()
}

const handleUserSelectReset = () => {
  Object.assign(userSelectFilters, { userNo: '', userName: '' })
  scheduleUserSelectSearch()
}

const handleUserSelectSizeChange = () => {
  userSelectPagination.pageIndex = 1
  fetchUserSelectList()
}

const handleUserSelectPageChange = () => {
  fetchUserSelectList()
}

/** 兼任只能指定一个用户，多选时只保留最后勾选的一行 */
const handleSelectionChange = (selection) => {
  if (selection.length > 1 && userSelectTableRef.value) {
    const latest = selection[selection.length - 1]
    userSelectTableRef.value.clearSelection()
    userSelectTableRef.value.toggleRowSelection(latest, true)
    editForm.userId = latest.userId ? String(latest.userId) : ''
    return
  }
  editForm.userId = selection.length > 0 ? String(selection[0].userId) : ''
}

const handleUserSelectRowClick = (row) => {
  userSelectTableRef.value?.toggleRowSelection(row)
}

const handleFormDeptChange = () => {
  try {
    editFormRef.value?.clearValidate(['partTimeDeptId'])
  } catch {
    // 对话框尚未渲染完成时忽略
  }
}

const handleAdd = async () => {
  resetEditForm()
  Object.assign(userSelectFilters, { departmentId: '', userNo: '', userName: '' })
  Object.assign(userSelectPagination, { pageIndex: 1, pageSize: 10, totalCount: 0 })
  userSelectList.value = []

  await fetchDepartmentDropdown()
  await fetchPositionDropdown()

  const firstEnabledDept = findFirstEnabledDepartment(departmentOptions.value)
  if (firstEnabledDept) {
    userSelectFilters.departmentId = firstEnabledDept
    editForm.partTimeDeptId = firstEnabledDept
  }
  editForm.partTimePositionId = getFirstEnabledPositionId()

  isEdit.value = false
  dialogVisible.value = true

  await nextTick()
  // 打开对话框后清除一次校验状态，避免保留上次必填错误提示
  clearFormValidate()
  await fetchUserSelectList()
}

const handleEdit = async (row) => {
  try {
    await fetchDepartmentDropdown()
    await fetchPositionDropdown()

    const res = await post(GET_USER_PARTTIMEENTITY_API.GET_USER_PARTTIMEENTITY, {
      userId: row.userId,
      old_PartTimeDeptId: row.partTimeDeptId,
      old_PartTimePositionId: row.partTimePositionId
    })
    if (!(res?.code === 200 && res.data)) {
      showMessage(res?.message)
      return
    }

    const data = res.data
    Object.assign(editForm, {
      userId: data.userId ? String(data.userId) : '',
      old_UserId: data.userId,
      old_PartTimeDeptId: data.partTimeDeptId,
      old_PartTimePositionId: data.partTimePositionId,
      partTimeDeptId: data.partTimeDeptId,
      partTimePositionId: data.partTimePositionId,
      // 处理时间格式，确保与日期选择器兼容
      startTime: data.startTime ? new Date(data.startTime).toISOString().slice(0, 19).replace('T', ' ') : '',
      endTime: data.endTime ? new Date(data.endTime).toISOString().slice(0, 19).replace('T', ' ') : '',
      userNo: row.userNo,
      userName: row.userName,
      departmentName: row.departmentName,
      positionName: row.positionName,
      laborName: row.laborName
    })

    if (!editForm.partTimeDeptId) {
      editForm.partTimeDeptId = findFirstEnabledDepartment(departmentOptions.value) ?? ''
    }
    if (!editForm.partTimePositionId) {
      editForm.partTimePositionId = getFirstEnabledPositionId()
    }

    // 自动填充当前编辑用户的工号、姓名到筛选条件
    Object.assign(userSelectFilters, { userNo: row.userNo, userName: row.userName })
    Object.assign(userSelectPagination, { pageIndex: 1, pageSize: 10, totalCount: 0 })

    isEdit.value = true
    dialogVisible.value = true

    await nextTick()
    // 编辑模式下同样清理一次校验状态，防止上次的必填/格式错误残留
    clearFormValidate()
    await fetchUserSelectList()
  } catch {
    showMessage(t('systembasicmgmt.userPartTime.getPartTimeDetailFailed'))
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.userPartTime.deletePartTimeConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  const res = await post(DELETE_USER_PARTTIME_API.DELETE_USER_PARTTIME, {
    Old_UserId: row.userId,
    old_PartTimeDeptId: row.partTimeDeptId,
    old_PartTimePositionId: row.partTimePositionId
  })
  if (res?.code === 200) {
    showMessage(t('systembasicmgmt.userPartTime.deletePartTimeSuccess'), 'success')
    await fetchUserPartTimePages()
  } else {
    showMessage(res?.message || t('systembasicmgmt.userPartTime.deletePartTimeFailed'))
  }
}

const handleSave = async () => {
  if (!editForm.userId) {
    showMessage(t('systembasicmgmt.userPartTime.pleaseSelectUser'), 'warning')
    return
  }

  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  const userId = String(editForm.userId)
  const baseParams = {
    userId,
    partTimeDeptId: editForm.partTimeDeptId,
    partTimePositionId: editForm.partTimePositionId,
    startTime: toDateTimePayload(editForm.startTime),
    endTime: toDateTimePayload(editForm.endTime)
  }

  const res = isEdit.value
    ? await post(UPDATE_USER_PARTTIME_API.UPDATE_USER_PARTTIME, {
      ...baseParams,
      Old_UserId: editForm.old_UserId,
      old_PartTimeDeptId: editForm.old_PartTimeDeptId,
      old_PartTimePositionId: editForm.old_PartTimePositionId
    })
    : await post(INSERT_USER_PARTTIME_API.INSERT_USER_PARTTIME, baseParams)

  if (res?.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    await fetchUserPartTimePages()
  } else {
    showMessage(res?.message)
  }
  submitLoading.value = false
}

const handleDialogClose = () => {
  resetEditForm()
  editFormRef.value?.clearValidate()
}

onMounted(async () => {
  await fetchDepartmentDropdown(true)
  await fetchUserPartTimePages()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
  if (userSelectSearchTimer) clearTimeout(userSelectSearchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

/* 兼任对话框样式 */
:deep(.parttime-dialog .el-dialog) {
  height: 550px;
  overflow: hidden;
}

:deep(.parttime-dialog .el-dialog__body) {
  height: calc(550px - 120px); /* 减去 header 和 footer 的高度 */
  overflow: auto;
  padding: 0 20px 20px 20px;
}

:deep(.parttime-dialog .el-dialog__header) {
  padding-bottom: 15px;
}

.parttime-dialog-body {
  height: 560px;
}

.parttime-form {
  padding: 12px 16px 0;
}

.parttime-form-row {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 14px;
}

.parttime-form-row .el-form-item {
  margin-bottom: 0;
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
