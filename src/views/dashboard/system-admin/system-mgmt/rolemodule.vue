<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      
      <div class="conventional-content">
        <!-- 过滤条件 -->
        <el-form :inline="true" :model="filters" class="conventional-filter-form">
          <el-form-item label="角色编码">
            <el-input v-model="filters.roleCode" placeholder="请输入角色编码" style="width:180px" clearable />
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item label="角色名称">
            <el-input v-model="filters.roleName" placeholder="请输入角色名称" style="width:180px" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" class="conventional-filter-form-button" plain>
              查询
            </el-button>
          </el-form-item>
          <div class="conventional-form-right-area">
            <el-button type="primary" @click="handleConfirm">
              新增角色模块
            </el-button>
          </div>
        </el-form>
        
        <!-- 日志表格 -->
        <div class="conventional-table-container">
          <el-table 
            :data="roleModuleList" 
            style="width: 100%" 
            border 
            stripe
            height="600"
            :header-cell-style="{ background: '#f5f7fa' }"
            v-loading="loading"
            class="conventional-table"
          >
            <el-table-column type="index" label="序号" width="60" align="center" fixed />
            <el-table-column prop="roleName" label="角色名称" align="left" min-width="180" />
            <el-table-column prop="domainName" label="网域名称" align="left" min-width="180" />
            <el-table-column prop="isChecked" label="是否绑定" align="center" min-width="90">
              <template #default="scope">
                <div class="flex">
                  <el-tag :type="scope.row.isChecked ? 'success' : 'danger'">
                    {{ scope.row.isChecked ? '是' : '否' }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" min-width="150" />
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { post } from '@/utils/request'
import { ElMessage } from 'element-plus'
import { 
  GET_ROLE_MODULE_API, 
  GET_ROLE_DROPDOWN_API, 
  GET_DOMAIN_DROPDOWN_API,
  UPDATE_ROLE_MODULE_API 
} from '@/config/api/system-admin/system-mgmt/rolemodule'

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
    ElMessage.warning('请先选择角色和网域')
    return
  }
  
  const roleModuleUpserts = roleModuleList.value.map(item => ({
    roleId: item.roleId,
    domainId: item.domainId,
    isChecked: item.isChecked
  }))
  
  try {
    const res = await post(UPDATE_ROLE_MODULE_API.UPDATE_ROLE_MODULE, {
      roleModuleUpserts
    })
    
    if (res && res.code === '200') {
      ElMessage.success(res.message)
      fetchRoleModuleList()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    ElMessage.error(error.message)
  }
}
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style>
