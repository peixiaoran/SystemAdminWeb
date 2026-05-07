<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 过滤条件 -->
      <el-form 
        :inline="true" 
        :model="filters" 
        class="conventional-filter-form" 
        role="search" 
        aria-label="用户搜索表单"
      >
        <el-form-item :label="$t('systembasicmgmt.userAgent.filter.department')">
          <el-tree-select 
            v-model="filters.departmentId"
            :data="departmentOptions || []"
            :props="{
              value: 'departmentId', 
              label: 'departmentName', 
              children: 'departmentChildList', 
              disabled: 'disabled' 
            }"
            check-strictly
            filterable
            :filter-node-method="filterNodeMethod"
            @change="handleDepartmentChange"
            style="width: 190px;"
            popper-class="main-dept-filter-popper"
            :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectDepartment')"
          />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userAgent.userNo')">
          <el-input 
            v-model="filters.userNo"
            style="width: 150px;"
            :placeholder="$t('systembasicmgmt.userAgent.pleaseEnterUserNo')"
            clearable 
          />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userAgent.userName')">
          <el-input 
            v-model="filters.userName"
            style="width: 200px;"
            :placeholder="$t('systembasicmgmt.userAgent.pleaseEnterUserName')"
            clearable 
          />
        </el-form-item>
        <el-form-item class="form-button-group">
          <el-button 
            type="primary" 
            @click="handleSearch" 
            plain
          >
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table :data="userList" border stripe :header-cell-style="{ background: '#f5f7fa' }" v-loading="loading" class="conventional-table">
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
              <el-button size="small" type="success" @click="handleAddAgentForUser(scope.$index, scope.row)" plain>{{ $t('systembasicmgmt.userAgent.addAgent') }}</el-button>
              <el-button size="small" type="primary" @click="handleViewProactiveAgent(scope.$index, scope.row)" plain>{{ $t('systembasicmgmt.userAgent.viewAgentList') }}</el-button>
              <el-button size="small" type="info" @click="handleConfigureAgent(scope.$index, scope.row)" plain>{{ $t('systembasicmgmt.userAgent.viewProactiveAgent') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination 
          v-model:current-page="pagination.pageIndex"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.totalCount"
          @size-change="handleSizeChange"
          @current-change="handlePageChange" 
        />
      </div>
    </el-card>

    <!-- 代理人列表对话框 -->
    <el-dialog 
      v-model="agentDialogVisible"
      :title="agentDialogTitle"
      width="65%"
      height="500px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="true"
      @closed="handleAgentDialogClosed"
      class="agent-dialog"
    >
      <div style="height: 380px; padding-top: 20px;">
        <el-table :data="agentList" border stripe :header-cell-style="{ background: '#f5f7fa' }" v-loading="agentLoading" height="370" class="conventional-table">
          <el-table-column type="index" :label="$t('systembasicmgmt.userAgent.index')" width="70" align="center" />
          <el-table-column prop="agentUserNo" :label="$t('systembasicmgmt.userAgent.agentUserNo')" align="left" min-width="110" />
          <el-table-column prop="agentUserName" :label="$t('systembasicmgmt.userAgent.agentUser')" align="left" min-width="200" />
          <el-table-column prop="startTime" :label="$t('systembasicmgmt.userAgent.startTime')" align="center" min-width="160" :formatter="(row, col, val) => formatDateTime(val)" />
          <el-table-column prop="endTime" :label="$t('systembasicmgmt.userAgent.endTime')" align="center" min-width="160" :formatter="(row, col, val) => formatDateTime(val)" />
          <el-table-column 
            :label="$t('common.operation')" 
            align="center" 
            width="120"
          >
            <template #default="scope">
              <el-button 
                size="small" 
                type="danger" 
                @click="handleDeleteAgent(scope.$index)"
              >
                {{ $t('common.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <el-button @click="agentDialogVisible = false">
          {{ $t('common.close') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 员工选择对话框 -->
    <el-dialog 
      v-model="userSelectDialogVisible"
      :title="`${$t('systembasicmgmt.userAgent.addAgent')} - ${currentUserInfo.userName || ''}`"
      width="70%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="true"
      @closed="handleUserSelectDialogClosed"
    >
      <div style="min-height: 500px;">
        <!-- 时间选择区域 -->
        <el-form 
          ref="agentTimeFormRef" 
          :model="agentTimeRange" 
          :rules="agentTimeFormRules" 
          :inline="true" 
          class="conventional-filter-form"
        >
          <el-form-item 
            :label="$t('systembasicmgmt.userAgent.startTime')" 
            prop="startTime" 
            required
          >
            <el-date-picker 
              v-model="agentTimeRange.startTime"
              type="datetime"
              :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectStartTime')"
              :disabled-date="(date) => agentTimeRange.endTime && date > new Date(agentTimeRange.endTime)"
              @change="handleStartTimeChange"
              style="width: 200px;"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss" 
            />
          </el-form-item>
          <el-form-item 
            :label="$t('systembasicmgmt.userAgent.endTime')" 
            prop="endTime" 
            required
          >
            <el-date-picker 
              v-model="agentTimeRange.endTime"
              type="datetime"
              :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectEndTime')"
              :disabled-date="(date) => agentTimeRange.startTime && date < new Date(agentTimeRange.startTime)"
              @change="handleEndTimeChange"
              style="width: 200px;"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss" 
            />
          </el-form-item>
        </el-form>

        <!-- 分隔线 -->
        <el-divider style="margin: 10px 0;"></el-divider>

        <!-- 搜索区域 -->
        <el-form 
          :inline="true" 
          :model="userSelectFilters" 
          class="conventional-filter-form" 
          style="margin-top: 10px;"
        >
          <el-form-item :label="$t('systembasicmgmt.userAgent.filter.department')">
            <el-tree-select 
              v-model="userSelectFilters.departmentId"
              :data="departmentOptions || []"
              :props="{ 
                value: 'departmentId', 
                label: 'departmentName', 
                children: 'departmentChildList', 
                disabled: 'disabled' 
              }"
              check-strictly
              filterable
              :filter-node-method="filterNodeMethod"
              @change="handleUserSelectSearch"
              style="width: 210px;"
              popper-class="main-dept-filter-popper"
              :placeholder="$t('systembasicmgmt.userAgent.pleaseSelectDepartment')"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userAgent.userNo')">
            <el-input 
              v-model="userSelectFilters.userNo"
              style="width: 150px;"
              :placeholder="$t('systembasicmgmt.userAgent.pleaseInputUserNo')"
              clearable 
            />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userAgent.userNameCn')">
            <el-input 
              v-model="userSelectFilters.userName"
              style="width: 200px;"
              :placeholder="$t('systembasicmgmt.userAgent.pleaseInputUserName')"
              clearable 
            />
          </el-form-item>
          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleUserSelectSearch"
            >
              {{ $t('common.search') }}
            </el-button>
            <el-button @click="handleUserSelectReset">
              {{ $t('common.reset') }}
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 员工表格 -->
        <el-table 
          :data="userSelectList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="userSelectLoading"
          class="conventional-table"
          ref="userSelectTableRef"
          height="300"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="userNo" :label="$t('systembasicmgmt.userAgent.userNo')" align="center" min-width="80" />
          <el-table-column prop="userName" :label="$t('systembasicmgmt.userAgent.userNameCn')" align="left" min-width="120" />
          <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userAgent.department')" align="left" min-width="120" />
          <el-table-column prop="positionName" :label="$t('systembasicmgmt.userAgent.position')" align="left" min-width="100" />
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination 
            v-model:current-page="userSelectPagination.pageIndex"
            v-model:page-size="userSelectPagination.pageSize"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="userSelectPagination.totalCount"
            @size-change="handleUserSelectSizeChange"
            @current-change="handleUserSelectPageChange" 
          />
        </div>
      </div>

      <template #footer>
        <el-button @click="userSelectDialogVisible = false">
          {{ $t('common.cancel') }}
        </el-button>
        <el-button 
          type="primary" 
          @click="handleConfirmUserSelect" 
          :disabled="selectedUsers.length === 0"
          :loading="confirmLoading"
        >
          {{ $t('common.confirm') }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 查看员工代理了哪些人对话框 -->
    <el-dialog 
      v-model="proactiveAgentDialogVisible"
      :title="proactiveAgentDialogTitle"
      width="65%"
      height="500px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :lock-scroll="true"
      @closed="handleProactiveAgentDialogClosed"
      class="proactive-agent-dialog"
    >
      <div style="height: 380px; padding-top: 20px;">
        <el-table 
          :data="proactiveAgentList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="proactiveAgentLoading"
          height="370"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('systembasicmgmt.userAgent.index')" width="70" align="center" />
          <el-table-column prop="substituteUserNo" :label="$t('systembasicmgmt.userAgent.substituteUserNo')" align="left" min-width="110" />
          <el-table-column prop="substituteUserName" :label="$t('systembasicmgmt.userAgent.substituteUserName')" align="left" min-width="200" />
          <el-table-column prop="startTime" :label="$t('systembasicmgmt.userAgent.startTime')" align="center" min-width="160" :formatter="(row, col, val) => formatDateTime(val)" />
          <el-table-column prop="endTime" :label="$t('systembasicmgmt.userAgent.endTime')" align="center" min-width="160" :formatter="(row, col, val) => formatDateTime(val)" />
        </el-table>
      </div>
      <template #footer>
        <el-button @click="proactiveAgentDialogVisible = false">
          {{ $t('common.close') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import {
  GET_USER_PAGES_API,
  GET_USER_AGENT_API,
  GET_USER_AGENT_INSERT_API,
  GET_USER_AGENT_DELETE_API,
  GET_USER_VIEW_API,
  GET_DEPARTMENT_DROPDOWN_API
} from '@/config/api/systembasicmgmt/user-settings/useragent'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null
let userSelectSearchTimer = null

const formatDateTime = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const userList = ref([])
const loading = ref(false)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const filters = reactive({
  departmentId: '',
  userNo: '',
  userName: '',
})

const departmentOptions = ref([])

const agentDialogVisible = ref(false)
const agentDialogTitle = ref('')
const agentList = ref([])
const agentLoading = ref(false)
const currentUserId = ref('')
const currentUserInfo = ref({})

const userSelectDialogVisible = ref(false)
const userSelectLoading = ref(false)
const userSelectList = ref([])
const selectedUsers = ref([])
const userSelectTableRef = ref(null)
const agentTimeFormRef = ref(null)
const confirmLoading = ref(false)

const agentTimeFormRules = {
  startTime: [
    { required: true, message: t('systembasicmgmt.userAgent.pleaseSelectStartTime'), trigger: 'change' }
  ],
  endTime: [
    { required: true, message: t('systembasicmgmt.userAgent.pleaseSelectEndTime'), trigger: 'change' }
  ]
}

const agentTimeRange = reactive({
  startTime: '',
  endTime: ''
})

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

const proactiveAgentDialogVisible = ref(false)
const proactiveAgentDialogTitle = ref('')
const proactiveAgentList = ref([])
const proactiveAgentLoading = ref(false)
const currentProactiveUserId = ref('')

onMounted(async () => {
  await fetchDepartmentDropdown(true)
  await fetchUserPages()
})

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

const scheduleSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchUserPages()
  }, DEBOUNCE_MS)
}

const scheduleUserSelectSearch = () => {
  clearTimeout(userSelectSearchTimer)
  userSelectSearchTimer = setTimeout(() => {
    userSelectPagination.pageIndex = 1
    fetchUserSelectList()
  }, DEBOUNCE_MS)
}

const fetchDepartmentDropdown = async (setDefaultFilter = false) => {
  try {
    const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})

    if (res && res.code === 200) {
      departmentOptions.value = res.data || []

      if (setDefaultFilter && departmentOptions.value.length > 0) {
        const firstDepartmentId = findFirstEnabledDepartment(departmentOptions.value)
        if (firstDepartmentId) {
          filters.departmentId = firstDepartmentId
        }
      }
    } else {
      departmentOptions.value = []
      ElMessage({
        message: res.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    departmentOptions.value = []
    ElMessage({
      message: t('systembasicmgmt.userAgent.getDepartmentFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  }
}

const fetchUserAgentList = async (substituteUserId) => {
  agentLoading.value = true
  try {
    const formData = new FormData()
    formData.append('substituteUserId', substituteUserId)
    const res = await post(GET_USER_AGENT_API.GET_USER_AGENT, formData)

    if (res && res.code === 200) {
      agentList.value = res.data || []
    } else {
      agentList.value = []
      ElMessage({
        message: res.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    agentList.value = []
    ElMessage({
      message: t('systembasicmgmt.userAgent.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    agentLoading.value = false
  }
}

const fetchUserPages = async () => {
  loading.value = true
  const params = {
    departmentId: filters.departmentId,
    userNo: filters.userNo,
    userName: filters.userName,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    totalCount: pagination.totalCount
  }
  const res = await post(GET_USER_PAGES_API.GET_USER_PAGES, params)

  if (res && res.code === 200) {
    userList.value = (res.data || []).map((row) => ({
      ...row,
      isReview: (() => {
        const v = row.isReview ?? row.isApproval ?? row.IsApproval
        return v === '1' || v === 1 ? '1' : '0'
      })()
    }))
    pagination.totalCount = res.totalCount || 0
  } else {
    ElMessage({
      message: res.message,
      type: 'error',
      plain: true,
      showClose: true
    })
  }
  loading.value = false
}

const handleSearch = () => {
  scheduleSearch()
}

const handleReset = () => {
  filters.userNo = ''
  filters.userName = ''

  if (departmentOptions.value.length > 0) {
    const firstDepartmentId = findFirstEnabledDepartment(departmentOptions.value)
    filters.departmentId = firstDepartmentId ?? ''
  } else {
    filters.departmentId = ''
  }

  scheduleSearch()
}

const handlePageChange = () => {
  fetchUserPages()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchUserPages()
}

const handleConfigureAgent = async (index, row) => {
  currentUserId.value = row.userId
  agentDialogTitle.value = `${t('systembasicmgmt.userAgent.agentDetails')} - ${row.userName || ''}`
  agentDialogVisible.value = true
  await fetchUserAgentList(row.userId)
}

const handleAddAgentForUser = async (index, row) => {
  currentUserId.value = row.userId
  currentUserInfo.value = row
  Object.assign(agentTimeRange, {
    startTime: '',
    endTime: ''
  })
  selectedUsers.value = []

  Object.assign(userSelectFilters, {
    departmentId: '',
    userNo: '',
    userName: ''
  })
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
  if (agentTimeFormRef.value) {
    try {
      agentTimeFormRef.value.clearValidate()
    } catch {
      // ignore
    }
  }
  await fetchUserSelectList()
}

const handleAgentDialogClosed = async () => {
  agentList.value = []
  currentUserId.value = ''
  agentDialogTitle.value = ''
}

const handleUserSelectDialogClosed = () => {
  currentUserInfo.value = {}
  currentUserId.value = ''
  selectedUsers.value = []
  Object.assign(agentTimeRange, {
    startTime: '',
    endTime: ''
  })
  Object.assign(userSelectFilters, {
    departmentId: '',
    userNo: '',
    userName: ''
  })
  if (agentTimeFormRef.value) {
    try {
      agentTimeFormRef.value.clearValidate()
    } catch {
      // ignore
    }
  }
  if (userSelectTableRef.value) {
    userSelectTableRef.value.clearSelection()
  }
}

const handleDeleteAgent = async (index) => {
  try {
    const agent = agentList.value[index]

    await ElMessageBox.confirm(
      t('systembasicmgmt.userAgent.confirmDeleteAgent', { name: agent.agentUserName }),
      t('common.tip'),
      {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )

    const formData = new FormData()
    formData.append('agentUserId', agent.agentUserId)

    const res = await post(GET_USER_AGENT_DELETE_API.GET_USER_AGENT_DELETE, formData)

    if (res && res.code === 200) {
      ElMessage({
        message: res.message,
        type: 'success',
        plain: true,
        showClose: true
      })
      await fetchUserAgentList(currentUserId.value)
      agentDialogVisible.value = false
      await fetchUserPages()
    } else {
      ElMessage({
        message: res.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch {
    return
  }
}

const fetchUserSelectList = async () => {
  userSelectLoading.value = true
  try {
    const params = {
      departmentId: userSelectFilters.departmentId,
      userNo: userSelectFilters.userNo,
      userName: userSelectFilters.userName,
      pageIndex: userSelectPagination.pageIndex,
      pageSize: userSelectPagination.pageSize,
      totalCount: userSelectPagination.totalCount,
      SubstituteUserId: currentUserId.value
    }
    const res = await post(GET_USER_VIEW_API.GET_USER_VIEW, params)

    if (res && res.code === 200) {
      userSelectList.value = res.data || []
      userSelectPagination.totalCount = res.totalCount || 0
    } else {
      userSelectList.value = []
      userSelectPagination.totalCount = 0
      ElMessage({
        message: res.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    userSelectList.value = []
    userSelectPagination.totalCount = 0
    ElMessage({
      message: t('systembasicmgmt.userAgent.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    userSelectLoading.value = false
  }
}

const handleUserSelectSearch = () => {
  scheduleUserSelectSearch()
}

const handleUserSelectReset = () => {
  Object.assign(userSelectFilters, {
    userNo: '',
    userName: ''
  })
  scheduleUserSelectSearch()
}

const handleUserSelectPageChange = () => {
  fetchUserSelectList()
}

const handleUserSelectSizeChange = () => {
  userSelectPagination.pageIndex = 1
  fetchUserSelectList()
}

const handleSelectionChange = (selection) => {
  selectedUsers.value = selection
}

const handleStartTimeChange = (value) => {
  if (value && agentTimeRange.endTime && new Date(value) > new Date(agentTimeRange.endTime)) {
    ElMessage({
      message: t('systembasicmgmt.userAgent.startTimeCannotLaterThanEndTime'),
      type: 'warning',
      plain: true,
      showClose: true
    })
    agentTimeRange.startTime = ''
  }
}

const handleEndTimeChange = (value) => {
  if (value && agentTimeRange.startTime && new Date(value) < new Date(agentTimeRange.startTime)) {
    ElMessage({
      message: t('systembasicmgmt.userAgent.endTimeCannotEarlierThanStartTime'),
      type: 'warning',
      plain: true,
      showClose: true
    })
    agentTimeRange.endTime = ''
  }
}

const handleConfirmUserSelect = async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage({
      message: t('systembasicmgmt.userAgent.pleaseSelectUsers'),
      type: 'warning',
      plain: true,
      showClose: true
    })
    return
  }

  try {
    await agentTimeFormRef.value.validate()
  } catch (error) {
    return
  }

  confirmLoading.value = true

  // 统一提交 DateTime：优先保留本地字符串，仅规范为 ISO 本地时间格式
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
  const startTime = toDateTimePayload(agentTimeRange.startTime)
  const endTime = toDateTimePayload(agentTimeRange.endTime)

  for (const user of selectedUsers.value) {
    const params = {
      agentUserId: user.userId,
      substituteUserId: currentUserId.value,
      startTime: startTime,
      endTime: endTime
    }
    const res = await post(GET_USER_AGENT_INSERT_API.GET_USER_AGENT_INSERT, params)

    if (res && res.code === 200) {
      // 成功添加代理人
    } else {
      ElMessage({
        message: res.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      confirmLoading.value = false
      return
    }
  }

  ElMessage({
    message: t('common.saveSuccess'),
    type: 'success',
    plain: true,
    showClose: true
  })
  userSelectDialogVisible.value = false

  selectedUsers.value = []
  Object.assign(agentTimeRange, {
    startTime: '',
    endTime: ''
  })

  if (userSelectTableRef.value) {
    userSelectTableRef.value.clearSelection()
  }

  await fetchUserAgentList(currentUserId.value)

  currentUserInfo.value = {}

  await fetchUserPages()

  confirmLoading.value = false
}

const fetchProactiveAgentList = async (userId) => {
  proactiveAgentLoading.value = true
  try {
    const params = {
      userId: userId
    }
    const res = await post(GET_USER_AGENT_API.GET_USER_PRO_AGENT, params)

    if (res && res.code === 200) {
      proactiveAgentList.value = res.data || []
    } else {
      proactiveAgentList.value = []
      ElMessage({
        message: res.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    proactiveAgentList.value = []
    ElMessage({
      message: t('systembasicmgmt.userAgent.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    proactiveAgentLoading.value = false
  }
}

const handleViewProactiveAgent = async (index, row) => {
  currentProactiveUserId.value = row.userId
  proactiveAgentDialogTitle.value = `${t('systembasicmgmt.userAgent.proactiveAgentDetails')} - ${row.userName || ''}`
  proactiveAgentDialogVisible.value = true
  await fetchProactiveAgentList(row.userId)
}

const handleProactiveAgentDialogClosed = async () => {
  proactiveAgentList.value = []
  currentProactiveUserId.value = ''
  proactiveAgentDialogTitle.value = ''
}

const handleDepartmentChange = () => {
  handleSearch()
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
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
