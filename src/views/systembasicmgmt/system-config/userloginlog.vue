<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">

      <!-- 过滤条件 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="员工操作日志搜索表单">
        <el-form-item :label="$t('systembasicmgmt.userloginlog.filter.userNo')">
          <el-input v-model="filters.userNo"
                   style="width: 150px;"
                   :placeholder="$t('systembasicmgmt.userloginlog.pleaseInputUserNo')"
                   clearable />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userloginlog.filter.ip')">
          <el-input v-model="filters.ip"
                   style="width: 150px;"
                   :placeholder="$t('systembasicmgmt.userloginlog.pleaseInputIp')"
                   clearable />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userloginlog.filter.startTime')">
          <el-date-picker
            v-model="filters.startTime"
            type="datetime"
            style="width: 200px;"
            :placeholder="$t('systembasicmgmt.userloginlog.pleaseSelectStartTime')"
            format="YYYY/MM/DD HH:mm:ss"
            value-format="YYYY/MM/DD HH:mm:ss" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userloginlog.filter.endTime')">
          <el-date-picker
            v-model="filters.endTime"
            type="datetime"
            style="width: 200px;"
            :placeholder="$t('systembasicmgmt.userloginlog.pleaseSelectEndTime')"
            format="YYYY/MM/DD HH:mm:ss"
            value-format="YYYY/MM/DD HH:mm:ss" />
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
        <el-table :data="userloginlogList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table">
          <el-table-column type="index" :label="$t('systembasicmgmt.userloginlog.index')" width="70" align="center" fixed />
          <el-table-column prop="userNo" :label="$t('systembasicmgmt.userloginlog.userNo')" align="center" min-width="120" />
          <el-table-column prop="userName" :label="$t('systembasicmgmt.userloginlog.userName')" align="left" min-width="150" />
          <el-table-column prop="ip" :label="$t('systembasicmgmt.userloginlog.ip')" align="center" min-width="140" />
          <el-table-column :label="$t('systembasicmgmt.userloginlog.loginTypeName')" align="center" min-width="130">
            <template #default="{ row }">
              <el-tag :type="getLoginTypeTagType(row.loginType)">
                {{ getLoginTypeName(row.loginType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="loginDate" :label="$t('systembasicmgmt.userloginlog.loginDate')" align="center" min-width="180" :formatter="(row, col, val) => formatDateTime(val)" />
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { post } from '@/utils/request'
import { 
  GET_USER_LOGIN_LOG_PAGES_API
} from '@/config/api/systembasicmgmt/system-config/userloginlog'
import { ElMessage } from 'element-plus'
import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'

const { t } = useI18n()

// 员工操作日志数据
const userloginlogList = ref([])
const loading = ref(false)

const formatDateTime = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

// 过滤条件
const filters = reactive({
  userNo: '',
  ip: '',
  startTime: '',
  endTime: ''
})

// 在组件挂载后获取员工操作日志数据
onMounted(() => {
  fetchUserLoginLogPages()
})

// 获取员工操作日志列表数据
const fetchUserLoginLogPages = async () => {
  loading.value = true
  const params = {
    userNo: filters.userNo,
    ip: filters.ip,
    startTime: filters.startTime,
    endTime: filters.endTime,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    totalCount: pagination.totalCount
  }

  const res = await post(GET_USER_LOGIN_LOG_PAGES_API.GET_USER_LOGIN_LOG_PAGES, params)

  if (res && res.code === 200) {
    userloginlogList.value = res.data || []
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

// 使用通用防抖工具
const debouncedFetchUserLoginLogPages = debounce(() => {
  fetchUserLoginLogPages()
}, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

// 处理搜索操作（带防抖）
const handleSearch = () => {
  pagination.pageIndex = 1
  loading.value = true
  debouncedFetchUserLoginLogPages()
}

// 重置搜索条件
const handleReset = () => {
  // 只清空输入框，不清空下拉框（此页面无下拉框）
  filters.userNo = ''
  filters.ip = ''
  filters.startTime = ''
  filters.endTime = ''
  // 重置后自动触发查询（使用防抖）
  pagination.pageIndex = 1
  loading.value = true
  debouncedFetchUserLoginLogPages()
}

// 处理页码变化
const handlePageChange = (page) => {
  loading.value = true // 显示加载状态
  pagination.pageIndex = page
  fetchUserLoginLogPages()
}

// 处理每页记录数变化
const handleSizeChange = (size) => {
  loading.value = true // 显示加载状态
  pagination.pageSize = size
  pagination.pageIndex = 1
  fetchUserLoginLogPages()
}

// 根据 LoginType 获取显示名称
const getLoginTypeName = (loginType) => {
  if (!loginType) return ''
  const key = `systembasicmgmt.userloginlog.loginType.${loginType}`
  const text = t(key)
  return text === key ? loginType : text
}

// 根据 LoginType 获取标签颜色：LoginSuccessful 成功绿 / IncorrectPassword 危险红 / AccountNotExist 警告橙 / LoggedOut 信息灰
const getLoginTypeTagType = (loginType) => {
  switch (loginType) {
    case 'LoginSuccessful':
      return 'success'
    case 'IncorrectPassword':
      return 'danger'
    case 'AccountNotExist':
      return 'warning'
    case 'LoggedOut':
      return 'info'
    default:
      return 'info'
  }
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
