<template>
    <div class="conventional-table-container">
        <el-card class="conventional-card">

            <!-- 过滤条件 -->
            <el-form :inline="true" :model="filters" class="conventional-filter-form">
                <el-form-item :label="$t('systemBasicmgmt.systemMgmt.roleModule.role')">
                    <el-select style="width:180px"
                               v-model="filters.roleId"
                               :placeholder="$t('systemBasicmgmt.systemMgmt.selectPlaceholder') + $t('systemBasicmgmt.systemMgmt.roleModule.role')"
                               clearable
                               @change="handleRoleChange">
                        <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('systemBasicmgmt.systemMgmt.roleModule.domain')">
                    <el-select v-model="filters.domainId" :placeholder="$t('systemBasicmgmt.systemMgmt.selectPlaceholder') + $t('systemBasicmgmt.systemMgmt.roleModule.domain')" style="width:180px" clearable @change="handleDomainChange">
                        <el-option v-for="item in domainOptions" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
                    </el-select>
                </el-form-item>
                <el-form-item class="form-button-group">
                    <el-button type="primary" @click="handleSearch" plain>
                        {{ $t('common.search') }}
                    </el-button>
                </el-form-item>
                <el-form-item class="form-right-button">
                    <el-button type="primary" @click="handleConfirm">
                        {{ $t('systemBasicmgmt.systemMgmt.updateBindings') }}
                    </el-button>
                </el-form-item>
            </el-form>

            <!-- 表格区域 -->
            <div class="table-container">
                <el-table :data="roleModuleList"
                          style="width: 100%"
                          border
                          stripe
                          max-height="calc(100vh - 240px)"
                          :header-cell-style="{ background: '#f5f7fa' }"
                          v-loading="loading"
                          class="conventional-table">
                    <el-table-column type="index" :label="$t('systemBasicmgmt.systemMgmt.index')" width="60" align="center" fixed />
                    <el-table-column prop="roleName" :label="$t('systemBasicmgmt.systemMgmt.roleModule.role')" align="left" min-width="180" />
                    <el-table-column prop="menuName" :label="$t('systemBasicmgmt.systemMgmt.roleModule.module')" align="left" min-width="180" />
                    <el-table-column prop="isChecked" :label="$t('systemBasicmgmt.systemMgmt.roleModule.isBinding')" align="center" min-width="90">
                        <template #default="scope">
                            <div class="checkbox-wrapper">
                                <el-checkbox v-model="scope.row.isChecked" />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" :label="$t('systemBasicmgmt.systemMgmt.remark')" min-width="150" />
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination-wrapper">
                <el-pagination v-model:current-page="pagination.currentPage"
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
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import {
      GET_ROLE_MODULE_API,
      GET_ROLE_DROPDOWN_API,
      GET_DOMAIN_DROPDOWN_API,
      UPDATE_ROLE_MODULE_API
  } from '@/config/api/systemBasicmgmt/system-mgmt/rolemodule'

  const { t } = useI18n()

  // 角色网域数据
  const roleModuleList = ref([])
  const roleOptions = ref([])
  const domainOptions = ref([])
  const loading = ref(false)

  // 过滤条件
  const filters = reactive({
      roleId: '',
      domainId: ''
  })

  // 添加分页信息
  const pagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 0
  })

  // 在组件挂载后获取角色和网域数据
  onMounted(() => {
      fetchRoleDropdown()
      fetchDomainDropdown()
  })

  // 获取角色下拉列表
  const fetchRoleDropdown = async () => {
      try {
          const res = await post(GET_ROLE_DROPDOWN_API.GET_ROLE_DROPDOWN)
          if (res && res.code === '200') {
              roleOptions.value = res.data || []
              if (roleOptions.value.length > 0) {
                  filters.roleId = roleOptions.value[0].roleId
                  fetchRoleModuleList()
              }
          } else {
              ElMessage.error(res.message)
          }
      } catch (error) {
          ElMessage.error(error.message)
      }
  }

  // 获取网域下拉列表
  const fetchDomainDropdown = async () => {
      try {
          const res = await post(GET_DOMAIN_DROPDOWN_API.GET_DOMAIN_DROPDOWN)
          if (res && res.code === '200') {
              domainOptions.value = res.data || []
              if (domainOptions.value.length > 0) {
                  filters.domainId = domainOptions.value[0].domainId
                  fetchRoleModuleList()
              }
          } else {
              ElMessage.error(res.message)
          }
      } catch (error) {
          ElMessage.error(error.message)
      }
  }

  // 获取角色网域列表数据
  const fetchRoleModuleList = async () => {
      if (!filters.roleId || !filters.domainId) return

      loading.value = true
      const params = {
          roleId: filters.roleId,
          domainId: filters.domainId
      }

      try {
          const res = await post(GET_ROLE_MODULE_API.GET_ROLE_MODULE, params)
          if (res && res.code === '200') {
              roleModuleList.value = res.data || []
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

  // 处理搜索操作
  const handleSearch = () => {
      fetchRoleModuleList()
  }

  // 处理确认操作
  const handleConfirm = async () => {
      if (!filters.roleId || !filters.domainId) {
          ElMessage.warning(t('systemBasicmgmt.systemMgmt.roleModule.pleaseSelectRole') + '，' + t('systemBasicmgmt.systemMgmt.roleModule.pleaseSelectDomain'))
          return
      }

      const roleModuleUpserts = roleModuleList.value.map(item => ({
          roleId: item.roleId,
          menuId: item.menuId,
          domainId: item.domainId,
          isChecked: item.isChecked
      }))

      try {
          const res = await post(UPDATE_ROLE_MODULE_API.UPDATE_ROLE_MODULE, {
              roleModuleUpserts
          })

          if (res && res.code === '200') {
              ElMessage.success(t('systemBasicmgmt.systemMgmt.roleModule.updateBindingsSuccess'))
              fetchRoleModuleList()
          } else {
              ElMessage.error(res.message)
          }
      } catch (error) {
          ElMessage.error(error.message)
      }
  }

  // 处理角色变化
  const handleRoleChange = () => {
      fetchRoleModuleList()
  }

  // 处理网域变化
  const handleDomainChange = () => {
      fetchRoleModuleList()
  }

  // 添加缺失的分页处理方法
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      fetchRoleModuleList()
  }

  const handlePageChange = (page) => {
      pagination.currentPage = page
      fetchRoleModuleList()
  }
</script>

<style scoped>
    @import '@/assets/styles/conventionalTablePage.css';
</style>
