<template>
    <div class="conventional-table-container">
      <el-card class="conventional-card">
        <div class="conventional-content">
          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form">
            <el-form-item :label="$t('systemBasicmgmt.systemMgmt.roleDomain.role')">
              <el-select v-model="filters.roleId" :placeholder="$t('systemBasicmgmt.systemMgmt.selectPlaceholder')" style="width:180px" clearable @change="handleRoleChange">
                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch" class="conventional-filter-form-button" plain>
                {{ $t('common.search') }}
              </el-button>
            </el-form-item>
            <div class="conventional-form-right-area">
              <el-button type="primary" @click="handleConfirm">
                {{ $t('systemBasicmgmt.systemMgmt.updateBindings') }}
              </el-button>
            </div>
          </el-form>
          
          <!-- 日志表格 -->
          <div class="table-pagination-container">
            <div class="table-wrapper">
              <el-table 
                :data="roleDomainList" 
                style="width: 100%" 
                border 
                stripe
                max-height="calc(100vh - 240px)"
                :header-cell-style="{ background: '#f5f7fa' }"
                v-loading="loading"
                class="conventional-table"
              >
                <el-table-column type="index" :label="$t('systemBasicmgmt.systemMgmt.index')" width="60" align="center" fixed />
                <el-table-column prop="roleName" :label="$t('systemBasicmgmt.systemMgmt.roleDomain.role')" align="left" min-width="180" />
                <el-table-column prop="domainName" :label="$t('systemBasicmgmt.systemMgmt.roleDomain.domain')" align="left" min-width="180" />
                <el-table-column prop="isChecked" :label="$t('systemBasicmgmt.systemMgmt.roleDomain.isBinding')" align="center" min-width="90">
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
              <el-pagination
                v-model:current-page="pagination.currentPage"
                v-model:page-size="pagination.pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { post } from '@/utils/request'
  import { ElMessage } from 'element-plus'
  import { GET_ROLE_DOMAIN_API, GET_ROLE_DROPDOWN_API, UPDATE_ROLE_DOMAIN_API } from '@/config/api/systemBasicmgmt/system-mgmt/roledomian'
  import { useI18n } from 'vue-i18n'
  
  // 使用i18n
  const { t } = useI18n()
  
  // 角色菜单数据
  const roleDomainList = ref([])
  const roleOptions = ref([])
  const loading = ref(false)
  
  // 过滤条件
  const filters = reactive({
    roleId: ''
  })
  
  // 分页信息 - 添加缺失的分页对象
  const pagination = reactive({
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  
  // 在组件挂载后获取角色数据
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
  
  // 获取角色菜单列表数据
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
  
  // 处理搜索操作
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
      ElMessage.warning(t('systemBasicmgmt.systemMgmt.roleDomain.pleaseSelectRole'))
      return
    }
    
    const roleDomainUpserts = roleDomainList.value.map(item => ({
      roleId: item.roleId,
      domainId: item.domainId,
      isChecked: item.isChecked
    }))
    
    try {
      const res = await post(UPDATE_ROLE_DOMAIN_API.UPDATE_ROLE_DOMAIN, {
        roleDomainUpserts
      })
      
      if (res && res.code === '200') {
        ElMessage.success(t('systemBasicmgmt.systemMgmt.roleDomain.updateBindingsSuccess'))
        fetchRoleDomainList()
      } else {
        ElMessage.error(res.message)
      }
    } catch (error) {
      ElMessage.error(error.message)
    }
  }

  // 处理标签点击事件
  const handleTagClick = (row) => {
    row.isChecked = !row.isChecked
  }
  
  // 添加缺失的分页处理方法
  const handleSizeChange = (size) => {
    pagination.pageSize = size
    fetchRoleDomainList()
  }
  
  const handlePageChange = (page) => {
    pagination.currentPage = page
    fetchRoleDomainList()
  }
  </script>
  
  <style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style> 