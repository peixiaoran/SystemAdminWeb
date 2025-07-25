<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form">
              <el-form-item :label="$t('SystemBasicMgmt.roleProgram.role')">
                  <el-select style="width:180px"
                             v-model="filters.roleId"
                             :placeholder="$t('SystemBasicMgmt.selectPlaceholder') + $t('SystemBasicMgmt.roleProgram.role')"
                             @change="handleRoleChange">
                      <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.roleProgram.domain')">
                  <el-select v-model="filters.domainId" :placeholder="$t('SystemBasicMgmt.selectPlaceholder') + $t('SystemBasicMgmt.roleProgram.domain')" style="width:180px" @change="handleDomainChange">
                      <el-option v-for="item in domainOptions" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.roleProgram.module')">
                  <el-select v-model="filters.parmentMenuId" :placeholder="$t('SystemBasicMgmt.selectPlaceholder') + $t('SystemBasicMgmt.roleProgram.module')" style="width:180px" @change="handleModuleChange">
                      <el-option v-for="item in moduleOptions" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
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
              <el-table :data="roleProgramList"
                        border
                        stripe
                        :header-cell-style="{ background: '#f5f7fa' }"
                        v-loading="loading"
                        class="conventional-table">
                  <el-table-column type="index" :label="$t('SystemBasicMgmt.index')" width="70" align="center" fixed />
                  <el-table-column prop="roleName" :label="$t('SystemBasicMgmt.roleProgram.role')" align="left" min-width="180" />
                  <el-table-column prop="menuName" :label="$t('SystemBasicMgmt.roleProgram.program')" align="left" min-width="180" />
                  <el-table-column prop="isChecked" :label="$t('SystemBasicMgmt.roleProgram.isBinding')" align="center" min-width="90">
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
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import {
      GET_ROLE_PROGRAM_API,
      GET_ROLE_DROPDOWN_API,
      GET_DOMAIN_DROPDOWN_API,
      GET_MODULE_DROPDOWN_API,
      UPDATE_ROLE_PROGRAM_API
  } from '@/config/api/SystemBasicMgmt/system-mgmt/roleprogram'

  const { t } = useI18n()

  // 角色程序数据
  const roleProgramList = ref([])
  const roleOptions = ref([])
  const domainOptions = ref([])
  const moduleOptions = ref([])
  const loading = ref(false)

  // 过滤条件
  const filters = reactive({
      roleId: '',
      domainId: '',
      parmentMenuId: ''
  })

  // 添加分页信息
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
      total: 0
  })

  // 组件挂载后获取角色和网域数据
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
                  fetchRoleProgramList()
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
                  fetchModuleDropdown()
              }
          } else {
              ElMessage.error(res.message)
          }
      } catch (error) {
          ElMessage.error(error.message)
      }
  }

  // 获取模块下拉列表
  const fetchModuleDropdown = async () => {
      if (!filters.domainId) {
          moduleOptions.value = []
          filters.parmentMenuId = ''
          return
      }

      try {
          const params = {
              DomainId: filters.domainId
          }
          const res = await post(GET_MODULE_DROPDOWN_API.GET_MODULE_DROPDOWN, params)
          if (res && res.code === '200') {
              moduleOptions.value = res.data || []
              if (moduleOptions.value.length > 0) {
                  filters.parmentMenuId = moduleOptions.value[0].menuId
                  fetchRoleProgramList()
              } else {
                  filters.parmentMenuId = ''
                  roleProgramList.value = []
              }
          } else {
              ElMessage.error(res.message)
          }
      } catch (error) {
          ElMessage.error(error.message)
      }
  }

  // 获取角色程序列表数据
  const fetchRoleProgramList = async () => {

      if (!filters.roleId || !filters.domainId || !filters.parmentMenuId) return

      loading.value = true
      const params = {
          roleId: filters.roleId,
          domainId: filters.domainId,
          parmentMenuId: filters.parmentMenuId
      }

      try {
          const res = await post(GET_ROLE_PROGRAM_API.GET_ROLE_PROGRAM, params)
          if (res && res.code === '200') {
              roleProgramList.value = res.data || []
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
      fetchRoleProgramList()
  }

  // 处理确认操作
  const handleConfirm = async () => {
      if (!filters.roleId || !filters.domainId || !filters.parmentMenuId) {
          ElMessage.warning(t('SystemBasicMgmt.roleProgram.pleaseSelectRole') + '和' +
              t('SystemBasicMgmt.roleProgram.pleaseSelectDomain') + '和' +
              t('SystemBasicMgmt.roleProgram.pleaseSelectModule'))
          return
      }

      const roleProgramUpserts = roleProgramList.value.map(item => ({
          roleId: item.roleId,
          programId: item.programId,
          domainId: item.domainId,
          menuId: item.menuId,
          isChecked: item.isChecked
      }))

      try {
          const res = await post(UPDATE_ROLE_PROGRAM_API.UPDATE_ROLE_PROGRAM, {
              roleProgramUpserts
          })

          if (res && res.code === '200') {
              ElMessage.success(t('SystemBasicMgmt.roleProgram.updateBindingsSuccess'))
              fetchRoleProgramList()
          } else {
              ElMessage.error(res.message)
          }
      } catch (error) {
          ElMessage.error(error.message)
      }
  }

  // 处理角色变化
  const handleRoleChange = () => {
      fetchRoleProgramList()
  }

  // 处理网域变化
  const handleDomainChange = () => {
      moduleOptions.value = []
      filters.parmentMenuId = ''
      if (filters.domainId) {
          fetchModuleDropdown()
      } else {
          roleProgramList.value = []
      }
  }

  // 处理模块变化
  const handleModuleChange = () => {
      fetchRoleProgramList()
  }

  // 处理缺失的分页事件处理
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      fetchRoleProgramList()
  }

  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchRoleProgramList()
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

