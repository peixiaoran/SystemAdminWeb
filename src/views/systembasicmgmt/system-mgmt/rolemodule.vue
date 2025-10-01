<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form">
                             <el-form-item :label="$t('systembasicmgmt.roleModule.role')">
                  <el-select style="width:180px" 
                             v-model="filters.roleId"
                             :placeholder="$t('systembasicmgmt.selectPlaceholder')" 
                             @change="handleRoleChange">
                      <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.disabled" />
                  </el-select>
              </el-form-item>
              <el-form-item class="form-button-group">
                  <el-button type="primary" @click="handleSearch" plain>
                      {{ $t('common.search') }}
                  </el-button>
              </el-form-item>
              <el-form-item class="form-right-button">
                  <el-button type="primary" @click="handleConfirm">
                      {{ $t('systembasicmgmt.updateBindings') }}
                  </el-button>
              </el-form-item>
          </el-form>

          <!-- 表格数据 -->
          <div class="table-container">
              <el-table :data="roleModuleList"
                        border
                        stripe
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('systembasicmgmt.index')" width="70" align="center" fixed />
                                     <el-table-column prop="roleName" :label="$t('systembasicmgmt.roleModule.role')" align="left" min-width="180" />
                  <el-table-column prop="moduleName" :label="$t('systembasicmgmt.roleModule.module')" align="left" min-width="180" />
                  <el-table-column prop="isChecked" :label="$t('systembasicmgmt.roleModule.isBinding')" align="center" min-width="90">
                      <template #default="scope">
                          <div class="checkbox-wrapper">
                              <el-checkbox v-model="scope.row.isChecked" />
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="remark" :label="$t('systembasicmgmt.remark')" min-width="150" />
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
  import { post } from '@/utils/request'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { GET_ROLE_MODULE_API, GET_ROLE_DROPDOWN_API, UPDATE_ROLE_MODULE_API } from '@/config/api/systembasicmgmt/system-mgmt/rolemodule'
  import { useI18n } from 'vue-i18n'

  // 使用i18n
  const { t } = useI18n()

  // 角色模块数据
  const roleModuleList = ref([])
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
      totalCount: 0
  })

  // 组件挂载后获取角色数据
  onMounted(() => {
      fetchRoleDropdown()
  })

  // 获取角色下拉列表
  const fetchRoleDropdown = async () => {
      try {
          const res = await post(GET_ROLE_DROPDOWN_API.GET_ROLE_DROPDOWN)
          if (res && res.code === 200) {
              roleOptions.value = res.data || []
              if (roleOptions.value.length > 0) {
                  const firstEnabledRole = roleOptions.value.find(item => !item.disabled)
                  if (firstEnabledRole) {
                      filters.roleId = firstEnabledRole.roleId
                      fetchRoleModuleList()
                  }
              }
          } else {
              ElMessage({
                  message: res.message,
                  type: 'error',
                  plain: true,
                  showClose: true
              })
          }
      } catch (error) {
          ElMessage({
              message: error.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 获取角色模块列表数据
  const fetchRoleModuleList = async () => {
      if (!filters.roleId) return

      loading.value = true
      const params = {
          roleId: filters.roleId
      }

      try {
          const res = await post(GET_ROLE_MODULE_API.GET_ROLE_MODULE, params)
          if (res && res.code === 200) {
              roleModuleList.value = res.data || []
              // 设置总记录数
              pagination.totalCount = res.data?.length || 0
          } else {
              ElMessage({
                  message: res.message,
                  type: 'error',
                  plain: true,
                  showClose: true
              })
          }
      } catch (error) {
          ElMessage({
              message: error.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      } finally {
          loading.value = false
      }
  }

  // 处理搜索事件
  const handleSearch = () => {
      fetchRoleModuleList()
  }

  // 处理角色变化事件
  const handleRoleChange = () => {
      fetchRoleModuleList()
  }

  // 处理确认操作
  const handleConfirm = async () => {
      if (!filters.roleId) {
          ElMessage({
              message: t('systembasicmgmt.roleModule.pleaseSelectRole'),
              type: 'warning',
              plain: true,
              showClose: true
          })
          return
      }

      try {
          await ElMessageBox.confirm(
              t('systembasicmgmt.roleModule.confirmUpdate'),
              t('common.confirm'),
              {
                  confirmButtonText: t('common.confirm'),
                  cancelButtonText: t('common.cancel'),
                  type: 'warning'
              }
          )

          const roleModuleUpserts = roleModuleList.value.map(item => ({
              roleId: item.roleId,
              moduleId: item.moduleId,
              isChecked: item.isChecked
          }))

          const res = await post(UPDATE_ROLE_MODULE_API.UPDATE_ROLE_MODULE, roleModuleUpserts)

          if (res && res.code === 200) {
              ElMessage({
                  message: t('systembasicmgmt.roleModule.updateBindingsSuccess'),
                  type: 'success',
                  plain: true,
                  showClose: true
              })
              fetchRoleModuleList()
          } else {
              ElMessage({
                  message: res.message,
                  type: 'error',
                  plain: true,
                  showClose: true
              })
          }
      } catch (error) {
          if (error === 'cancel') {
              return
          }
          ElMessage({
              message: error.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 处理标签点击事件
  const handleTagClick = (row) => {
      row.isChecked = !row.isChecked
  }

  // 处理缺失的分页事件处理
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      fetchRoleModuleList()
  }

  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchRoleModuleList()
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

