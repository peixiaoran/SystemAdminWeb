<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form">
                             <el-form-item :label="$t('SystemBasicMgmt.roleDomain.role')">
                  <el-select style="width:180px" 
                             v-model="filters.roleId"
                             :placeholder="$t('SystemBasicMgmt.selectPlaceholder')" 
                             @change="handleRoleChange">
                      <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
                  </el-select>
              </el-form-item>
              <el-form-item class="form-button-group">
                  <el-button type="primary" @click="handleSearch" plain>
                      {{ $t('common.search') }}
                  </el-button>
              </el-form-item>
              <el-form-item class="form-right-button">
                  <el-button type="primary" @click="handleConfirm">
                      {{ $t('SystemBasicMgmt.updateBindings') }}
                  </el-button>
              </el-form-item>
          </el-form>

          <!-- 表格数据 -->
          <div class="table-container">
              <el-table :data="roleDomainList"
                        border
                        stripe
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('SystemBasicMgmt.index')" width="70" align="center" fixed />
                                     <el-table-column prop="roleName" :label="$t('SystemBasicMgmt.roleDomain.role')" align="left" min-width="180" />
                  <el-table-column prop="domainName" :label="$t('SystemBasicMgmt.roleDomain.domain')" align="left" min-width="180" />
                  <el-table-column prop="isChecked" :label="$t('SystemBasicMgmt.roleDomain.isBinding')" align="center" min-width="90">
                      <template #default="scope">
                          <div class="checkbox-wrapper">
                              <el-checkbox v-model="scope.row.isChecked" />
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="remark" :label="$t('SystemBasicMgmt.remark')" min-width="150" />
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
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { GET_ROLE_DOMAIN_API, GET_ROLE_DROPDOWN_API, UPDATE_ROLE_DOMAIN_API } from '@/config/api/SystemBasicMgmt/System-Mgmt/roledomain'
  import { useI18n } from 'vue-i18n'

  // 使用i18n
  const { t } = useI18n()

  // 角色领域数据
  const roleDomainList = ref([])
  const roleOptions = ref([])
  const loading = ref(false)

  // 过滤条件
  const filters = reactive({
      roleId: ''
  })

  // 分页信息 - 修复缺失的分页配置
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
      total: 0
  })

  // 组件挂载后获取角色数据
  onMounted(() => {
      fetchRoleDropdown()
  })

  // 获取角色下拉列表
  const fetchRoleDropdown = async () => {
      try {
          const res = await post(GET_ROLE_DROPDOWN_API.GET_ROLE_DROPDOWN)
          if (res && res.code === '200') {
              roleOptions.value = res.data || []
              if (roleOptions.value.length > 0) {
                  filters.roleId = roleOptions.value[0].roleId
                  fetchRoleDomainList()
              }
          } else {
              ElMessage.error(res.message)
          }
      } catch (error) {
          ElMessage.error(error.message)
      }
  }

  // 获取角色领域列表数据
  const fetchRoleDomainList = async () => {
      if (!filters.roleId) return

      loading.value = true
      const params = {
          roleId: filters.roleId
      }

      try {
          const res = await post(GET_ROLE_DOMAIN_API.GET_ROLE_DOMAIN, params)
          if (res && res.code === '200') {
              roleDomainList.value = res.data || []
              // 设置总记录数
              pagination.total = res.data?.length || 0
          } else {
              ElMessage.error(res.message)
          }
      } catch (error) {
          ElMessage.error(error.message)
      } finally {
          loading.value = false
      }
  }

  // 处理搜索事件
  const handleSearch = () => {
      fetchRoleDomainList()
  }

  // 处理角色变化事件
  const handleRoleChange = () => {
      fetchRoleDomainList()
  }

  // 处理确认操作
  const handleConfirm = async () => {
      if (!filters.roleId) {
          ElMessage.warning(t('SystemBasicMgmt.roleDomain.pleaseSelectRole'))
          return
      }

      try {
          await ElMessageBox.confirm(
              t('SystemBasicMgmt.roleDomain.confirmUpdate'),
              t('common.confirm'),
              {
                  confirmButtonText: t('common.confirm'),
                  cancelButtonText: t('common.cancel'),
                  type: 'warning'
              }
          )

          const roleDomainUpserts = roleDomainList.value.map(item => ({
              roleId: item.roleId,
              domainId: item.domainId,
              isChecked: item.isChecked
          }))

          const res = await post(UPDATE_ROLE_DOMAIN_API.UPDATE_ROLE_DOMAIN, {
              roleDomainUpserts
          })

          if (res && res.code === '200') {
              ElMessage.success(t('SystemBasicMgmt.roleDomain.updateBindingsSuccess'))
              fetchRoleDomainList()
          } else {
              ElMessage.error(res.message)
          }
      } catch (error) {
          if (error === 'cancel') {
              return
          }
          ElMessage.error(error.message)
      }
  }

  // 处理标签点击事件
  const handleTagClick = (row) => {
      row.isChecked = !row.isChecked
  }

  // 处理缺失的分页事件处理
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      fetchRoleDomainList()
  }

  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchRoleDomainList()
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

