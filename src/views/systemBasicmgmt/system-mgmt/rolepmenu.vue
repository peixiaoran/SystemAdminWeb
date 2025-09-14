<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">

            <!-- 过滤条件 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form">
                <el-form-item :label="$t('systembasicmgmt.roleModule.role')">
                    <el-select style="width:180px"
                               v-model="filters.roleId"
                               :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.roleModule.role')"
                               @change="handleRoleChange">
                        <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.disabled" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('systembasicmgmt.roleModule.module')">
                    <el-select v-model="filters.moduleId" :placeholder="$t('systembasicmgmt.selectPlaceholder') + $t('systembasicmgmt.roleModule.module')" style="width:180px" @change="handlemoduleChange">
                        <el-option v-for="item in moduleOptions" :key="item.moduleId" :label="item.moduleName" :value="item.moduleId" :disabled="item.disabled" />
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
                <el-table :data="rolePMenuList"
                          style="width: 100%"
                          border
                          stripe
                          max-height="calc(100vh - 240px)"
                          :header-cell-style="{ background: '#f5f7fa' }"
                          v-loading="loading"
                          class="conventional-table">
                    <el-table-column type="index" :label="$t('systembasicmgmt.index')" width="70" align="center" fixed />
                    <el-table-column prop="roleName" :label="$t('systembasicmgmt.roleModule.role')" align="left" min-width="180" />
                    <el-table-column prop="menuName" :label="$t('systembasicmgmt.rolepmenu.pmenu')" align="left" min-width="180" />
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
  import { useI18n } from 'vue-i18n'
  import {
      GET_ROLE_PMENU_API,
    GET_ROLE_DROPDOWN_API,
    GET_MODULE_DROPDOWN_API,
    UPDATE_ROLE_PMENU_API
} from '@/config/api/systembasicmgmt/system-mgmt/rolepmenu'

  const { t } = useI18n()

  // 角色模块数据
  const rolePMenuList = ref([])
  const roleOptions = ref([])
  const moduleOptions = ref([])
  const loading = ref(false)

  // 过滤条件
  const filters = reactive({
      roleId: '',
      moduleId: ''
  })

  // 添加分页信息
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0
  })

  // 组件挂载后获取角色和网域数据
  onMounted(() => {
      fetchRoleDropdown()
      fetchmoduleDropdown()
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
                      fetchRolePMenuList()
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

  // 获取网域下拉列表
  const fetchmoduleDropdown = async () => {
      try {
          const res = await post(GET_MODULE_DROPDOWN_API.GET_MODULE_DROPDOWN)
          if (res && res.code === 200) {
              moduleOptions.value = res.data || []
              if (moduleOptions.value.length > 0) {
                  const firstEnabledmodule = moduleOptions.value.find(item => !item.disabled)
                  if (firstEnabledmodule) {
                      filters.moduleId = firstEnabledmodule.moduleId
                      fetchRolePMenuList()
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
  const fetchRolePMenuList = async () => {
      if (!filters.roleId || !filters.moduleId) return

      loading.value = true
      const params = {
          roleId: filters.roleId,
          moduleId: filters.moduleId
      }

      try {
          const res = await post(GET_ROLE_PMENU_API.GET_ROLE_PMENU, params)
          if (res && res.code === 200) {
              rolePMenuList.value = res.data || []
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
      fetchRolePMenuList()
  }

  // 处理确认操作
  const handleConfirm = async () => {
      if (!filters.roleId || !filters.moduleId) {
          ElMessage({
              message: t('systembasicmgmt.roleModule.pleaseSelectRole') + '和' + t('systembasicmgmt.roleModule.pleaseSelectmodule'),
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

          const rolePMenuUpserts = rolePMenuList.value.map(item => ({
              roleId: item.roleId,
              menuId: item.menuId,
              moduleId: item.moduleId,
              isChecked: item.isChecked
          }))

          const res = await post(UPDATE_ROLE_PMENU_API.UPDATE_ROLE_PMENU, {
            rolePMenuUpserts
        })

          if (res && res.code === 200) {
              ElMessage({
                  message: t('systembasicmgmt.roleModule.updateBindingsSuccess'),
                  type: 'success',
                  plain: true,
                  showClose: true
              })
              fetchRolePMenuList()
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
      fetchRolePMenuList()
  }

  // 处理网域变化
  const handlemoduleChange = () => {
      fetchRolePMenuList()
  }

  // 处理缺失的分页事件处理
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      fetchRolePMenuList()
  }

  const handlePageChange = (page) => {
        pagination.pageIndex = page
        fetchRolePMenuList()
    }
</script>

<style scoped>
    @import '@/assets/styles/conventionalTablePage.css';
</style>

