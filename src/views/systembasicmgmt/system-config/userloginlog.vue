<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
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
import { GET_USER_LOGIN_LOG_PAGES_API } from '@/config/api/systembasicmgmt/system-config/userloginlog'
import { ElMessage } from 'element-plus'

const DEBOUNCE_MS = 300

const { t } = useI18n()

const userloginlogList = ref([])
const loading = ref(false)

const pagination = reactive({
  pageIndex: 1,
  pageSize: 50,
  totalCount: 0
})

const filters = reactive({
  userNo: '',
  ip: '',
  startTime: '',
  endTime: ''
})

const formatDateTime = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return val
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const fetchUserLoginLogPages = async () => {
  loading.value = true
  const res = await post(GET_USER_LOGIN_LOG_PAGES_API.GET_USER_LOGIN_LOG_PAGES, {
    userNo: filters.userNo,
    ip: filters.ip,
    startTime: filters.startTime,
    endTime: filters.endTime,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  })
  if (res?.code === 200) {
    userloginlogList.value = res.data || []
    pagination.totalCount = res.totalCount || 0
  } else if (res) {
    ElMessage({ message: res.message, type: 'error', plain: true, showClose: true })
  }
  loading.value = false
}

let searchTimer = null
const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchUserLoginLogPages()
  }, DEBOUNCE_MS)
}

const handleSearch = () => scheduleSearch()

const handleReset = () => {
  filters.userNo = ''
  filters.ip = ''
  filters.startTime = ''
  filters.endTime = ''
  scheduleSearch()
}

const handlePageChange = () => fetchUserLoginLogPages()

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchUserLoginLogPages()
}

const getLoginTypeName = (loginType) => {
  if (!loginType) return ''
  const key = `systembasicmgmt.userloginlog.loginType.${loginType}`
  const text = t(key)
  return text === key ? loginType : text
}

const getLoginTypeTagType = (loginType) => {
  const map = { LoginSuccessful: 'success', IncorrectPassword: 'danger', AccountNotExist: 'warning', LoggedOut: 'info' }
  return map[loginType] ?? 'info'
}

onMounted(() => {
  fetchUserLoginLogPages()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
