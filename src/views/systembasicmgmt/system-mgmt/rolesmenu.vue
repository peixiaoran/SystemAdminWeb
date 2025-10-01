<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form">
              <el-form-item :label="$t('systembasicmgmt.roleSMenu.role')">
                  <el-select style="width:180px"
                             v-model="filters.roleId"
                             :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.roleSMenu.role')"
                             @change="handleRoleChange">
                      <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.disabled" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('systembasicmgmt.roleSMenu.module')">
                  <el-select v-model="filters.moduleId" :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.roleSMenu.module')" style="width:180px" @change="handleModuleChange">
                      <el-option v-for="item in moduleOptions" :key="item.moduleId" :label="item.moduleName" :value="item.moduleId" :disabled="item.disabled" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('systembasicmgmt.roleSMenu.pmenu')">
                  <el-select v-model="filters.parmentMenuId" :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.roleSMenu.pmenu')" style="width:180px" @change="handlePMenuChange">
                      <el-option v-for="item in pmenuOptions" :key="item.menuId" :label="item.menuName" :value="item.menuId" :disabled="item.disabled" />
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
              <el-table :data="roleSMenuList"
                        border
                        stripe
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('systembasicmgmt.index')" width="70" align="center" fixed />
                  <el-table-column prop="roleName" :label="$t('systembasicmgmt.roleSMenu.role')" align="left" min-width="180" />
                  <el-table-column prop="menuName" :label="$t('systembasicmgmt.roleSMenu.program')" align="left" min-width="180" />
                  <el-table-column prop="isChecked" :label="$t('systembasicmgmt.roleSMenu.isBinding')" align="center" min-width="90">
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
  import { useI18n } from 'vue-i18n'
  import {
      GET_ROLE_SMENU_API,
      GET_ROLE_DROPDOWN_API,
      GET_MODULE_DROPDOWN_API,
      GET_PMENU_DROPDOWN_API,
      UPDATE_ROLE_SMENU_API
  } from '@/config/api/systembasicmgmt/system-mgmt/rolesmenu'

  const { t } = useI18n()

  // 角色程序数据
  const roleSMenuList = ref([])
  const roleOptions = ref([])
  const moduleOptions = ref([])
  const pmenuOptions = ref([])
  const loading = ref(false)

  // 过滤条件
  const filters = reactive({
      roleId: '',
      moduleId: '',
      parmentMenuId: ''
  })

  // 添加分页信息
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0
  })

  // 组件挂载后获取角色和模块数据
  onMounted(() => {
      fetchRoleDropdown()
      fetchModuleDropdown()
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
                      fetchRoleSMenuList()
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

  // 获取模块下拉列表
    const fetchModuleDropdown = async () => {
        try {
            const res = await post(GET_MODULE_DROPDOWN_API.GET_MODULE_DROPDOWN)
            if (res && res.code === 200) {
                moduleOptions.value = res.data || []
                if (moduleOptions.value.length > 0) {
                    const firstEnabledModule = moduleOptions.value.find(item => !item.disabled)
                    if (firstEnabledModule) {
                        filters.moduleId = firstEnabledModule.moduleId
                        fetchPMenuDropdown()
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

  // 获取一级菜单下拉列表
  const fetchPMenuDropdown = async () => {
      try {
          const params = {
              moduleId: filters.moduleId
          }
          const res = await post(GET_PMENU_DROPDOWN_API.GET_PMENU_DROPDOWN, params)
          if (res && res.code === 200) {
              pmenuOptions.value = res.data || []
              if (pmenuOptions.value.length > 0) {
                  const firstEnabledPMenu = pmenuOptions.value.find(item => !item.disabled)
                  if (firstEnabledPMenu) {
                      filters.parmentMenuId = firstEnabledPMenu.menuId
                      fetchRoleSMenuList()
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

  // 获取角色程序列表数据
  const fetchRoleSMenuList = async () => {

      if (!filters.roleId || !filters.moduleId || !filters.parmentMenuId) return

      loading.value = true
      const params = {
          roleId: filters.roleId,
          moduleId: filters.moduleId,
          parmentMenuId: filters.parmentMenuId
      }

      try {
          const res = await post(GET_ROLE_SMENU_API.GET_ROLE_SMENU, params)
          if (res && res.code === 200) {
              roleSMenuList.value = res.data || []
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
      fetchRoleSMenuList()
  }

  // 处理确认操作
  const handleConfirm = async () => {
      if (!filters.roleId || !filters.moduleId || !filters.parmentMenuId) {
          ElMessage({
              message: t('systembasicmgmt.roleSMenu.pleaseSelectRole') + '、' +
                  t('systembasicmgmt.roleSMenu.module') + '和' +
                  t('systembasicmgmt.roleSMenu.pmenu'),
              type: 'warning',
              plain: true,
              showClose: true
          })
          return
      }

      try {
          await ElMessageBox.confirm(
              t('systembasicmgmt.roleSMenu.confirmUpdate'),
              t('common.confirm'),
              {
                  confirmButtonText: t('common.confirm'),
                  cancelButtonText: t('common.cancel'),
                  type: 'warning'
              }
          )

          const roleSMenuUpserts = roleSMenuList.value.map(item => ({
              roleId: item.roleId,
              programId: item.programId,
              menuId: item.menuId,
              isChecked: item.isChecked
          }))

          const res = await post(UPDATE_ROLE_SMENU_API.UPDATE_ROLE_SMENU, roleSMenuUpserts)

          if (res && res.code === 200) {
              ElMessage({
                  message: t('systembasicmgmt.roleSMenu.updateBindingsSuccess'),
                  type: 'success',
                  plain: true,
                  showClose: true
              })
              fetchRoleSMenuList()
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

  // 处理角色变化
  const handleRoleChange = () => {
        fetchRoleSMenuList()
    }

    // 处理模块变化
    const handleModuleChange = () => {
        pmenuOptions.value = []
        filters.parmentMenuId = ''
        if (filters.moduleId) {
            fetchPMenuDropdown()
        } else {
            roleSMenuList.value = []
        }
    }

    // 处理一级菜单变化
    const handlePMenuChange = () => {
        fetchRoleSMenuList()
    }



  // 处理缺失的分页事件处理
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      fetchRoleSMenuList()
  }

  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchRoleSMenuList()
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';

  /* 复选框样式 */
  .checkbox-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
  }
</style>

