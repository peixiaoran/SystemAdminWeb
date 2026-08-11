<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 过滤条件 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.userAgent.ariaFilterLabel')">
        <el-form-item :label="$t('systembasicmgmt.userAgent.filter.department')">
          <el-tree-select v-model="filters.departmentId"
                          :data="departmentOptions"
                          :props="DEPARTMENT_TREE_PROPS"
                          check-strictly
                          filterable
                          :filter-node-method="filterNodeMethod"
                          @change="handleDepartmentChange"
                          style="width: 220px"
                          popper-class="main-dept-filter-popper"
                          :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectDepartment')" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userAgent.userNo')">
          <el-input v-model="filters.userNo"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.userAgent.pleaseEnterUserNo')"
                    clearable />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userAgent.userName')">
          <el-input v-model="filters.userName"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.userAgent.pleaseEnterUserName')"
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
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="userList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.userAgent.index')" width="70" align="center" fixed />
          <el-table-column prop="userNo" :label="$t('systembasicmgmt.userAgent.userNo')" align="left" min-width="120" />
          <el-table-column prop="userName" :label="$t('systembasicmgmt.userAgent.userName')" align="left" min-width="180" />
          <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userAgent.department')" align="left" min-width="230" />
          <el-table-column prop="positionName" :label="$t('systembasicmgmt.userAgent.position')" align="left" min-width="120" />
          <el-table-column :label="$t('systembasicmgmt.userAgent.isReview')" align="center" min-width="110">
            <template #default="scope">
              <el-tag :type="scope.row.isReview === '1' ? 'primary' : 'info'">
                {{ scope.row.isReview === '1' ? $t('common.yes') : $t('common.no') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('systembasicmgmt.userAgent.isAgent')" align="center" min-width="110">
            <template #default="scope">
              <el-tag :type="scope.row.isAgent === '1' ? 'primary' : 'info'">
                {{ scope.row.isAgent === '1' ? $t('common.yes') : $t('common.no') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('systembasicmgmt.userAgent.operation')" min-width="320" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" type="success" @click="handleAddAgentForUser(scope.row)" plain>
                {{ $t('systembasicmgmt.userAgent.addAgent') }}
              </el-button>
              <el-button size="small" type="primary" @click="handleViewProactiveAgent(scope.row)" plain>
                {{ $t('systembasicmgmt.userAgent.viewAgentList') }}
              </el-button>
              <el-button size="small" type="info" @click="handleViewAgent(scope.row)" plain>
                {{ $t('systembasicmgmt.userAgent.viewProactiveAgent') }}
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

    <!-- 代理人列表对话框 -->
    <el-dialog v-model="agentDialogVisible"
               :title="agentDialogTitle"
               width="65%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               class="agent-dialog"
               @closed="handleAgentDialogClosed">
      <div class="dialog-table-wrapper">
        <el-table :data="agentList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="agentLoading"
                  height="370"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.userAgent.index')" width="70" align="center" />
          <el-table-column prop="agentUserNo" :label="$t('systembasicmgmt.userAgent.agentUserNo')" align="left" min-width="110" />
          <el-table-column prop="agentUserName" :label="$t('systembasicmgmt.userAgent.agentUser')" align="left" min-width="200" />
          <el-table-column prop="startTime"
                           :label="$t('systembasicmgmt.userAgent.startTime')"
                           align="center"
                           min-width="160"
                           :formatter="(row, col, val) => formatDateTime(val)" />
          <el-table-column prop="endTime"
                           :label="$t('systembasicmgmt.userAgent.endTime')"
                           align="center"
                           min-width="160"
                           :formatter="(row, col, val) => formatDateTime(val)" />
          <el-table-column :label="$t('common.operation')" align="center" width="120">
            <template #default="scope">
              <el-button size="small" type="danger" @click="handleDeleteAgent(scope.$index)">
                {{ $t('common.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="agentDialogVisible = false">{{ $t('common.close') }}</el-button>
      </template>
    </el-dialog>

    <!-- 用户选择对话框 -->
    <el-dialog v-model="userSelectDialogVisible"
               :title="`${$t('systembasicmgmt.userAgent.addAgent')} - ${currentUserInfo.userName || ''}`"
               width="70%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               @closed="handleUserSelectDialogClosed">
      <div class="user-select-body">
        <!-- 时间选择区域 -->
        <el-form ref="agentTimeFormRef"
                 :model="agentTimeRange"
                 :rules="agentTimeFormRules"
                 :inline="true"
                 class="conventional-filter-form"
                 role="form"
                 :aria-label="$t('systembasicmgmt.userAgent.ariaAgentTimeLabel')">
          <el-form-item :label="$t('systembasicmgmt.userAgent.startTime')" prop="startTime">
            <el-date-picker v-model="agentTimeRange.startTime"
                            type="datetime"
                            style="width: 220px"
                            :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectStartTime')"
                            :disabled-date="(date) => agentTimeRange.endTime && date > new Date(agentTimeRange.endTime)"
                            @change="handleStartTimeChange"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userAgent.endTime')" prop="endTime">
            <el-date-picker v-model="agentTimeRange.endTime"
                            type="datetime"
                            style="width: 220px"
                            :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectEndTime')"
                            :disabled-date="(date) => agentTimeRange.startTime && date < new Date(agentTimeRange.startTime)"
                            @change="handleEndTimeChange"
                            format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
        </el-form>

        <el-divider style="margin: 10px 0" />

        <!-- 搜索区域 -->
        <el-form :inline="true"
                 :model="userSelectFilters"
                 class="conventional-filter-form"
                 style="margin-top: 10px"
                 role="search"
                 :aria-label="$t('systembasicmgmt.userAgent.ariaUserSelectLabel')">
          <el-form-item :label="$t('systembasicmgmt.userAgent.filter.department')">
            <el-tree-select v-model="userSelectFilters.departmentId"
                            :data="departmentOptions"
                            :props="DEPARTMENT_TREE_PROPS"
                            check-strictly
                            filterable
                            :filter-node-method="filterNodeMethod"
                            @change="handleUserSelectSearch"
                            style="width: 220px"
                            popper-class="main-dept-filter-popper"
                            :clearable="false"
                            :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectDepartment')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userAgent.userNo')">
            <el-input v-model="userSelectFilters.userNo"
                      style="width: 220px"
                      :placeholder="$t('systembasicmgmt.userAgent.pleaseInputUserNo')"
                      clearable />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userAgent.userNameCn')">
            <el-input v-model="userSelectFilters.userName"
                      style="width: 220px"
                      :placeholder="$t('systembasicmgmt.userAgent.pleaseInputUserName')"
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
                  v-loading="userSelectLoading"
                  class="conventional-table"
                  ref="userSelectTableRef"
                  height="300"
                  @selection-change="handleSelectionChange"
                  @row-click="handleUserSelectRowClick"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="userNo" :label="$t('systembasicmgmt.userAgent.userNo')" align="center" min-width="80" />
          <el-table-column prop="userName" :label="$t('systembasicmgmt.userAgent.userNameCn')" align="left" min-width="120" />
          <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userAgent.department')" align="left" min-width="120" />
          <el-table-column prop="positionName" :label="$t('systembasicmgmt.userAgent.position')" align="left" min-width="100" />
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
        <el-button @click="userSelectDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary"
                   @click="handleConfirmUserSelect"
                   :disabled="selectedUsers.length === 0"
                   :loading="confirmLoading">
          {{ $t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 查看用户代理了哪些人对话框 -->
    <el-dialog v-model="proactiveAgentDialogVisible"
               :title="proactiveAgentDialogTitle"
               width="65%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :lock-scroll="true"
               class="proactive-agent-dialog"
               @closed="handleProactiveAgentDialogClosed">
      <div class="dialog-table-wrapper">
        <el-table :data="proactiveAgentList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="proactiveAgentLoading"
                  height="370"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.userAgent.index')" width="70" align="center" />
          <el-table-column prop="substituteUserNo" :label="$t('systembasicmgmt.userAgent.substituteUserNo')" align="left" min-width="110" />
          <el-table-column prop="substituteUserName" :label="$t('systembasicmgmt.userAgent.substituteUserName')" align="left" min-width="200" />
          <el-table-column prop="startTime"
                           :label="$t('systembasicmgmt.userAgent.startTime')"
                           align="center"
                           min-width="160"
                           :formatter="(row, col, val) => formatDateTime(val)" />
          <el-table-column prop="endTime"
                           :label="$t('systembasicmgmt.userAgent.endTime')"
                           align="center"
                           min-width="160"
                           :formatter="(row, col, val) => formatDateTime(val)" />
        </el-table>
      </div>
      <template #footer>
        <el-button @click="proactiveAgentDialogVisible = false">{{ $t('common.close') }}</el-button>
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
  GET_USER_PAGES_API,
  GET_USER_AGENT_API,
  GET_USER_AGENT_INSERT_API,
  GET_USER_AGENT_DELETE_API,
  GET_USER_VIEW_API,
  GET_DEPARTMENT_DROPDOWN_API
} from '@/config/api/systembasicmgmt/user-settings/useragent'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null
let userSelectSearchTimer = null

const DEPARTMENT_TREE_PROPS = {
  value: 'departmentId',
  label: 'departmentName',
  children: 'departmentChildList',
  disabled: 'disabled'
}

const userList = ref([])
const loading = ref(false)
const departmentOptions = ref([])

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

// 代理人列表对话框
const agentDialogVisible = ref(false)
const agentDialogTitle = ref('')
const agentList = ref([])
const agentLoading = ref(false)
const currentUserId = ref('')
const currentUserInfo = ref({})

// 用户选择（新增代理人）对话框
const userSelectDialogVisible = ref(false)
const userSelectLoading = ref(false)
const userSelectList = ref([])
const selectedUsers = ref([])
const userSelectTableRef = ref(null)
const agentTimeFormRef = ref(null)
const confirmLoading = ref(false)

const agentTimeRange = reactive({
  startTime: '',
  endTime: ''
})

const agentTimeFormRules = {
  startTime: [
    { required: true, message: () => t('systembasicmgmt.userAgent.pleaseSelectStartTime'), trigger: 'change' }
  ],
  endTime: [
    { required: true, message: () => t('systembasicmgmt.userAgent.pleaseSelectEndTime'), trigger: 'change' }
  ]
}

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

// 查看“该用户代理了哪些人”对话框
const proactiveAgentDialogVisible = ref(false)
const proactiveAgentDialogTitle = ref('')
const proactiveAgentList = ref([])
const proactiveAgentLoading = ref(false)

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

const filterNodeMethod = (value, data) => {
  if (!value) return true
  return data.departmentName.includes(value)
}

const findFirstEnabledDepartment = (departments) => {
  for (const dept of departments) {
    if (!dept.disabled) {
      return dept.departmentId
    }
    if (dept.departmentChildList && dept.departmentChildList.length > 0) {
      const childResult = findFirstEnabledDepartment(dept.departmentChildList)
      if (childResult) {
        return childResult
      }
    }
  }
  return null
}

const clearAgentTimeValidate = () => {
  try {
    agentTimeFormRef.value?.clearValidate()
  } catch {
    // 对话框尚未渲染完成时忽略
  }
}

const fetchDepartmentDropdown = async (setDefaultFilter = false) => {
  try {
    const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
    if (res?.code === 200) {
      departmentOptions.value = res.data || []
      if (setDefaultFilter && departmentOptions.value.length > 0) {
        const firstDepartmentId = findFirstEnabledDepartment(departmentOptions.value)
        if (firstDepartmentId) {
          filters.departmentId = firstDepartmentId
        }
      }
    } else {
      departmentOptions.value = []
      showMessage(res?.message)
    }
  } catch {
    departmentOptions.value = []
    showMessage(t('systembasicmgmt.userAgent.getDepartmentFailed'))
  }
}

const fetchUserPages = async () => {
  loading.value = true
  const res = await post(GET_USER_PAGES_API.GET_USER_PAGES, {
    departmentId: filters.departmentId,
    userNo: filters.userNo,
    userName: filters.userName,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    totalCount: pagination.totalCount
  })
  if (res?.code === 200) {
    userList.value = (res.data || []).map((row) => {
      const review = row.isReview ?? row.isApproval ?? row.IsApproval
      return { ...row, isReview: review === '1' || review === 1 ? '1' : '0' }
    })
    pagination.totalCount = res.totalCount || 0
  } else {
    showMessage(res?.message)
  }
  loading.value = false
}

const fetchUserAgentList = async (substituteUserId) => {
  agentLoading.value = true
  try {
    const formData = new FormData()
    formData.append('substituteUserId', substituteUserId)
    const res = await post(GET_USER_AGENT_API.GET_USER_AGENT, formData)
    if (res?.code === 200) {
      agentList.value = res.data || []
    } else {
      agentList.value = []
      showMessage(res?.message)
    }
  } catch {
    agentList.value = []
    showMessage(t('systembasicmgmt.userAgent.getFailed'))
  } finally {
    agentLoading.value = false
  }
}

const fetchUserSelectList = async () => {
  userSelectLoading.value = true
  try {
    const res = await post(GET_USER_VIEW_API.GET_USER_VIEW, {
      departmentId: userSelectFilters.departmentId,
      userNo: userSelectFilters.userNo,
      userName: userSelectFilters.userName,
      pageIndex: userSelectPagination.pageIndex,
      pageSize: userSelectPagination.pageSize,
      totalCount: userSelectPagination.totalCount,
      SubstituteUserId: currentUserId.value
    })
    if (res?.code === 200) {
      userSelectList.value = res.data || []
      userSelectPagination.totalCount = res.totalCount || 0
    } else {
      userSelectList.value = []
      userSelectPagination.totalCount = 0
      showMessage(res?.message)
    }
  } catch {
    userSelectList.value = []
    userSelectPagination.totalCount = 0
    showMessage(t('systembasicmgmt.userAgent.getFailed'))
  } finally {
    userSelectLoading.value = false
  }
}

const fetchProactiveAgentList = async (userId) => {
  proactiveAgentLoading.value = true
  try {
    const res = await post(GET_USER_AGENT_API.GET_USER_PRO_AGENT, { userId })
    if (res?.code === 200) {
      proactiveAgentList.value = res.data || []
    } else {
      proactiveAgentList.value = []
      showMessage(res?.message)
    }
  } catch {
    proactiveAgentList.value = []
    showMessage(t('systembasicmgmt.userAgent.getFailed'))
  } finally {
    proactiveAgentLoading.value = false
  }
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchUserPages()
  }, DEBOUNCE_MS)
}

const scheduleUserSelectSearch = () => {
  if (userSelectSearchTimer) clearTimeout(userSelectSearchTimer)
  userSelectSearchTimer = setTimeout(() => {
    userSelectPagination.pageIndex = 1
    fetchUserSelectList()
  }, DEBOUNCE_MS)
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
  fetchUserPages()
}

const handlePageChange = () => {
  fetchUserPages()
}

const handleViewAgent = async (row) => {
  currentUserId.value = row.userId
  agentDialogTitle.value = `${t('systembasicmgmt.userAgent.agentDetails')} - ${row.userName || ''}`
  agentDialogVisible.value = true
  await fetchUserAgentList(row.userId)
}

const handleViewProactiveAgent = async (row) => {
  proactiveAgentDialogTitle.value = `${t('systembasicmgmt.userAgent.proactiveAgentDetails')} - ${row.userName || ''}`
  proactiveAgentDialogVisible.value = true
  await fetchProactiveAgentList(row.userId)
}

const handleAddAgentForUser = async (row) => {
  currentUserId.value = row.userId
  currentUserInfo.value = row
  selectedUsers.value = []
  Object.assign(agentTimeRange, { startTime: '', endTime: '' })
  Object.assign(userSelectFilters, { departmentId: '', userNo: '', userName: '' })
  userSelectPagination.pageIndex = 1

  if (departmentOptions.value.length > 0) {
    const firstDepartmentId = findFirstEnabledDepartment(departmentOptions.value)
    if (firstDepartmentId) {
      userSelectFilters.departmentId = firstDepartmentId
    }
  }

  userSelectDialogVisible.value = true

  await nextTick()
  // 打开对话框后清除时间校验状态，避免保留上一次的必填错误提示
  clearAgentTimeValidate()
  await fetchUserSelectList()
}

const handleAgentDialogClosed = () => {
  agentList.value = []
  currentUserId.value = ''
  agentDialogTitle.value = ''
}

const handleProactiveAgentDialogClosed = () => {
  proactiveAgentList.value = []
  proactiveAgentDialogTitle.value = ''
}

const handleUserSelectDialogClosed = () => {
  currentUserInfo.value = {}
  currentUserId.value = ''
  selectedUsers.value = []
  Object.assign(agentTimeRange, { startTime: '', endTime: '' })
  Object.assign(userSelectFilters, { departmentId: '', userNo: '', userName: '' })
  clearAgentTimeValidate()
  userSelectTableRef.value?.clearSelection()
}

const handleDeleteAgent = async (index) => {
  const agent = agentList.value[index]
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.userAgent.confirmDeleteAgent', { name: agent.agentUserName }),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }

  const formData = new FormData()
  formData.append('agentUserId', agent.agentUserId)
  const res = await post(GET_USER_AGENT_DELETE_API.GET_USER_AGENT_DELETE, formData)
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    await fetchUserAgentList(currentUserId.value)
    agentDialogVisible.value = false
    await fetchUserPages()
  } else {
    showMessage(res?.message)
  }
}

const handleUserSelectSearch = () => scheduleUserSelectSearch()

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

const handleSelectionChange = (selection) => {
  selectedUsers.value = selection
}

const handleUserSelectRowClick = (row) => {
  userSelectTableRef.value?.toggleRowSelection(row)
}

const handleStartTimeChange = (value) => {
  if (value && agentTimeRange.endTime && new Date(value) > new Date(agentTimeRange.endTime)) {
    showMessage(t('systembasicmgmt.userAgent.startTimeCannotLaterThanEndTime'), 'warning')
    agentTimeRange.startTime = ''
  }
}

const handleEndTimeChange = (value) => {
  if (value && agentTimeRange.startTime && new Date(value) < new Date(agentTimeRange.startTime)) {
    showMessage(t('systembasicmgmt.userAgent.endTimeCannotEarlierThanStartTime'), 'warning')
    agentTimeRange.endTime = ''
  }
}

const handleConfirmUserSelect = async () => {
  if (selectedUsers.value.length === 0) {
    showMessage(t('systembasicmgmt.userAgent.pleaseSelectUsers'), 'warning')
    return
  }

  const valid = await agentTimeFormRef.value?.validate().catch(() => false)
  if (!valid) return

  confirmLoading.value = true
  const startTime = toDateTimePayload(agentTimeRange.startTime)
  const endTime = toDateTimePayload(agentTimeRange.endTime)

  for (const user of selectedUsers.value) {
    const res = await post(GET_USER_AGENT_INSERT_API.GET_USER_AGENT_INSERT, {
      agentUserId: user.userId,
      substituteUserId: currentUserId.value,
      startTime,
      endTime
    })
    if (res?.code !== 200) {
      showMessage(res?.message)
      confirmLoading.value = false
      return
    }
  }

  showMessage(t('common.saveSuccess'), 'success')
  userSelectDialogVisible.value = false

  selectedUsers.value = []
  Object.assign(agentTimeRange, { startTime: '', endTime: '' })
  userSelectTableRef.value?.clearSelection()

  await fetchUserAgentList(currentUserId.value)
  currentUserInfo.value = {}
  await fetchUserPages()

  confirmLoading.value = false
}

onMounted(async () => {
  await fetchDepartmentDropdown(true)
  await fetchUserPages()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
  if (userSelectSearchTimer) clearTimeout(userSelectSearchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.dialog-table-wrapper {
  height: 380px;
  padding-top: 20px;
}

.user-select-body {
  min-height: 500px;
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
