<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      
      <div class="conventional-content">
        <!-- 过滤条件 -->
        <el-form :inline="true" :model="filters" class="conventional-filter-form">
          <el-form-item label="角色">
            <el-select v-model="filters.roleId" placeholder="请选择角色" style="width:180px" clearable @change="handleRoleChange">
              <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
            </el-select>
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item label="网域">
            <el-select v-model="filters.domainId" placeholder="请选择网域" style="width:180px" clearable @change="handleDomainChange">
              <el-option v-for="item in domainOptions" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
            </el-select>
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item label="模块">
            <el-select v-model="filters.parmentMenuId" placeholder="请选择模块" style="width:180px" clearable @change="handleModuleChange">
              <el-option v-for="item in moduleOptions" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" class="conventional-filter-form-button" plain>
              查询
            </el-button>
          </el-form-item>
          <div class="conventional-form-right-area">
            <el-button type="primary" @click="handleConfirm">
              更新绑定
            </el-button>
          </div>
        </el-form>
        
        <!-- 日志表格 -->
        <div class="conventional-table-container">
          <el-table 
            :data="roleProgramList" 
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
            <el-table-column prop="menuName" label="模块名称" align="left" min-width="180" />
            <el-table-column prop="programName" label="程序名称" align="left" min-width="180" />
            <el-table-column prop="isChecked" label="是否绑定" align="center" min-width="90">
              <template #default="scope">
                <div class="checkbox-wrapper">
                  <el-checkbox v-model="scope.row.isChecked" />
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
  GET_ROLE_PROGRAM_API, 
  GET_ROLE_DROPDOWN_API, 
  GET_DOMAIN_DROPDOWN_API,
  GET_MODULE_DROPDOWN_API,
  UPDATE_ROLE_PROGRAM_API 
} from '@/config/api/system-admin/system-mgmt/roleprogram'

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
    console.log(1)
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
  fetchRoleProgramList()
}

// 处理确认操作
const handleConfirm = async () => {
  if (!filters.roleId || !filters.domainId || !filters.parmentMenuId) {
    ElMessage.warning('请先选择角色、网域和模块')
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
      ElMessage.success(res.message)
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
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
</style> 