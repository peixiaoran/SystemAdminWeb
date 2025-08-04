<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="用户登录日志搜索表单">
              <el-form-item :label="$t('SystemBasicMgmt.userLoginLog.filter.ip')">
                  <el-input v-model="filters.ip"
                           style="width: 180px;"
                           :placeholder="$t('SystemBasicMgmt.userLoginLog.pleaseInputIp')"
                           clearable />
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.userLoginLog.filter.startTime')">
                  <el-date-picker
                      v-model="filters.startTime"
                      type="datetime"
                      style="width: 200px;"
                      :placeholder="$t('SystemBasicMgmt.userLoginLog.pleaseSelectStartTime')"
                      format="YYYY/MM/DD HH:mm:ss"
                      value-format="YYYY/MM/DD HH:mm:ss"
                      clearable />
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.userLoginLog.filter.endTime')">
                  <el-date-picker
                      v-model="filters.endTime"
                      type="datetime"
                      style="width: 200px;"
                      :placeholder="$t('SystemBasicMgmt.userLoginLog.pleaseSelectEndTime')"
                      format="YYYY/MM/DD HH:mm:ss"
                      value-format="YYYY/MM/DD HH:mm:ss"
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
              <el-table :data="userLoginLogList"
                        border
                        stripe
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('SystemBasicMgmt.userLoginLog.index')" width="70" align="center" fixed />
                  <el-table-column prop="userNo" :label="$t('SystemBasicMgmt.userLoginLog.userNo')" align="center" min-width="120"/>
                  <el-table-column prop="userNameCh" :label="$t('SystemBasicMgmt.userLoginLog.userNameCh')" align="left" min-width="150" />
                  <el-table-column prop="userNameEn" :label="$t('SystemBasicMgmt.userLoginLog.userNameEn')" align="left" min-width="150" />
                  <el-table-column prop="ip" :label="$t('SystemBasicMgmt.userLoginLog.ip')" align="center" min-width="140" />
                  <el-table-column :label="$t('SystemBasicMgmt.userLoginLog.status')" align="center" min-width="130">
                      <template #default="{ row }">
                          <el-tag 
                              :type="getStatusTagType(row.statusId)">
                              {{ row.statusName }}
                          </el-tag>
                      </template>
                  </el-table-column>
                  <el-table-column prop="loginDate" :label="$t('SystemBasicMgmt.userLoginLog.loginDate')" align="center" min-width="180" />
              </el-table>
          </div>

          <!-- 分页 -->
          <div class="pagination-wrapper">
              <el-pagination v-model:current-page="pagination.pageIndex"
                             v-model:page-size="pagination.pageSize"
                             :page-sizes="[10, 20, 50, 100]"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="pagination.total"
                             @size-change="handleSizeChange"
                             @current-change="handlePageChange" />
          </div>
      </el-card>


  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { post } from '@/utils/request'
  import { 
    GET_USER_LOGIN_LOG_PAGES_API
  } from '@/config/api/SystemBasicMgmt/System-Settings/userLoginLog'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  // 初始化i18n
  const { t } = useI18n()

  // 用户登录日志数据
  const userLoginLogList = ref([])
  const loading = ref(false)

  // 分页信息
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 20,
      total: 0
  })

  // 过滤条件
  const filters = reactive({
      ip: '',
      startTime: '',
      endTime: ''
  })

  // 在组件挂载后获取用户登录日志数据
  onMounted(() => {
      fetchUserLoginLogPages()
  })

  // 获取用户登录日志列表数据
  const fetchUserLoginLogPages = async () => {
      loading.value = true
      const params = {
          ip: filters.ip,
          startTime: filters.startTime,
          endTime: filters.endTime,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize,
          totalCount: pagination.total
      }

      const res = await post(GET_USER_LOGIN_LOG_PAGES_API.GET_USER_LOGIN_LOG_PAGES, params)

      if (res && res.code === '200') {
          userLoginLogList.value = res.data || []
          pagination.total = res.totalNumber || 0
      } else {
          ElMessage.error(res.message || t('SystemBasicMgmt.userLoginLog.getFailed'))
      }
      loading.value = false
  }

  // 防抖搜索优化
  let searchTimer = null
  const handleSearch = () => {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
          pagination.pageIndex = 1
          fetchUserLoginLogPages()
      }, 300) // 300ms防抖
  }

  // 重置搜索条件
  const handleReset = () => {
      filters.ip = ''
      filters.startTime = ''
      filters.endTime = ''
      pagination.pageIndex = 1
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchUserLoginLogPages()
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchUserLoginLogPages()
  }

  // 根据statusId获取标签类型
  const getStatusTagType = (statusId) => {
      switch (statusId) {
          case 1:
              return 'success' // 绿色
          case 2:
              return 'danger'  // 红色
          case 3:
              return 'warning' // 橘黄色
          default:
              return 'info'    // 默认颜色
      }
  }


</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>
