<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      
      <!-- 过滤条件 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="用户表单绑定搜索表单">
        <el-form-item :label="$t('systembasicmgmt.userformbind.department')">
          <el-tree-select
            v-model="filters.departmentId"
            :data="departmentOptions || []"
            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
            check-strictly
            filterable
            :filter-node-method="filterNodeMethod"
            style="width: 200px;"
            :placeholder="$t('systembasicmgmt.userformbind.pleaseSelectDepartment')"
            @change="handleSearch"
          />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userformbind.userNo')">
          <el-input
            v-model="filters.userNo"
            style="width: 200px;"
            :placeholder="$t('systembasicmgmt.userformbind.pleaseInputUserNo')"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userformbind.userName')">
          <el-input
            v-model="filters.userName"
            style="width: 200px;"
            :placeholder="$t('systembasicmgmt.userformbind.pleaseInputUserName')"
            clearable
            @keyup.enter="handleSearch"
          />
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
        <el-table
          :data="userList"
          border
          stripe
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          class="conventional-table"
        >
          <el-table-column type="index" :label="$t('systembasicmgmt.userformbind.index')" width="70" align="center" fixed />
          <el-table-column prop="userNo" :label="$t('systembasicmgmt.userformbind.userNo')" align="center" min-width="130" />
          <el-table-column prop="userName" :label="$t('systembasicmgmt.userformbind.userName')" align="left" min-width="180" />
          <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userformbind.departmentName')" align="left" min-width="270" />
          <el-table-column prop="positionName" :label="$t('systembasicmgmt.userformbind.positionName')" align="left" min-width="150" />
          <el-table-column prop="laborName" :label="$t('systembasicmgmt.userformbind.laborName')" align="left" min-width="270" />
          
          <!-- 签核状态列 -->
          <el-table-column :label="$t('systembasicmgmt.userformbind.isApproval')" align="center" min-width="160">
            <template #default="scope">
              <el-tag :type="scope.row.isApproval === '1' ? 'primary' : 'info'">
                {{ scope.row.isApprovalName }}
              </el-tag>
            </template>
          </el-table-column>
          
          <!-- 操作列 -->
          <el-table-column :label="$t('common.operation')" align="center" width="150" fixed="right">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                @click="handleConfigForm(row)"
                plain
              >
                {{ $t('systembasicmgmt.userformbind.configForm') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.pageIndex"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 配置表单弹窗 -->
    <el-dialog
      v-model="configDialogVisible"
      :title="$t('systembasicmgmt.userformbind.configFormTitle')"
      width="600px"
      height="300px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :modal="true"
      :lock-scroll="true"
      :z-index="2000"
    >
      <div v-if="currentUser">
        <div class="user-info">
          <p><strong>{{ $t('systembasicmgmt.userformbind.departmentName') }}: </strong> {{ currentUser.departmentName }}</p>
          <div class="user-details">
            <span><strong>{{ $t('systembasicmgmt.userformbind.userNo') }}: </strong> {{ currentUser.userNo }}</span>
            <span style="margin-left: 20px;"><strong>{{ $t('systembasicmgmt.userformbind.userName') }}: </strong> {{ currentUser.userName }}</span>
          </div>
        </div>
        
        <el-divider />
        
        <div class="form-tree-container">
          <el-tree
            ref="formTreeRef"
            :data="formTreeData"
            :props="treeProps"
            show-checkbox
            node-key="formGroupTypeId"
            :default-checked-keys="checkedKeys"
            :check-strictly="false"
            v-loading="treeLoading"
            @check-change="handleCheckChange"
          />
        </div>
        
        <!-- 全选/取消全选按钮 -->
        <div class="tree-select-buttons" style="text-align: left;">
          <el-button type="primary" size="small" @click="handleSelectAll" plain>
            {{ $t('common.selectAll') }}
          </el-button>
          <el-button size="small" @click="handleDeselectAll" plain>
            {{ $t('common.deselectAll') }}
          </el-button>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer-right">
          <el-button @click="configDialogVisible = false">
            {{ $t('common.cancel') }}
          </el-button>
          <el-button type="primary" @click="handleSaveFormConfig" :loading="saveLoading">
            {{ $t('common.save') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * 用户表单绑定管理页面
 * 功能：管理用户与表单的绑定关系
 */
import { ref, reactive, onMounted, nextTick } from 'vue'
import { post } from '@/utils/request'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  GET_USER_PAGES_API,
  GET_DEPARTMENT_DROPDOWN_API,
  GET_USER_FORM_BIND_VIEW_TREE_API,
  UPDATE_USER_FORM_BIND_API
} from '@/config/api/systembasicmgmt/system-userconfig/userformbind.js'

const { t } = useI18n()

// 响应式数据
const loading = ref(false)
const userList = ref([])
const departmentOptions = ref([])

// 配置表单相关数据
const configDialogVisible = ref(false)
const treeLoading = ref(false)
const saveLoading = ref(false)
const formTreeData = ref([])
const currentUser = ref(null)
const checkedKeys = ref([])
const formTreeRef = ref(null)

// 搜索过滤条件
const filters = reactive({
  userNo: '',
  userName: '',
  departmentId: null
})

// 分页信息
const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  total: 0,
  totalCount: 0
})

// 树组件属性配置
const treeProps = {
  children: 'children',
  label: 'formGroupTypeName'
}

// 部门树过滤方法
const filterNodeMethod = (value, data) => {
  if (!value) return true
  return data.departmentName && data.departmentName.includes(value)
}

/**
 * 初始化页面数据
 */
const initPageData = async () => {
  // 先获取部门树并设置默认筛选条件
  await fetchDepartmentTree(true)
  // 然后获取用户数据
  await fetchUserPages()
}

/**
 * 获取部门树数据
 */
const fetchDepartmentTree = async (setDefaultFilter = false) => {
  try {
    const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
    if (res && res.code === 200) {
      departmentOptions.value = res.data || []
      
      // 设置默认筛选条件
      if (setDefaultFilter && departmentOptions.value.length > 0) {
        // 设置第一个部门为默认选择
        const findFirstDepartment = (departments) => {
          for (const dept of departments) {
            return dept.departmentId
          }
          return null
        }
        
        const firstDepartmentId = findFirstDepartment(departmentOptions.value)
        if (firstDepartmentId) {
          filters.departmentId = firstDepartmentId
        }
      }
    }
  } catch (error) {
    console.error('获取部门树失败:', error)
  }
}

/**
 * 获取用户分页数据
 */
const fetchUserPages = async () => {
  loading.value = true
  try {
    const params = {
      departmentId: filters.departmentId,
      userNo: filters.userNo,
      userName: filters.userName,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: pagination.totalCount
    }
    const res = await post(GET_USER_PAGES_API.GET_USER_PAGES, params)
    if (res && res.code === 200) {
      userList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
    } else {
      ElMessage({
        message: res?.message || t('systembasicmgmt.userformbind.getUserPagesFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    console.error('获取用户数据失败:', error)
    ElMessage({
      message: t('systembasicmgmt.userformbind.getUserPagesFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    loading.value = false
  }
}

/**
 * 获取用户表单绑定视图树数据
 */
const fetchUserFormBindViewTree = async (userId) => {
  treeLoading.value = true
  try {
    const params = { userId }
    const res = await post(GET_USER_FORM_BIND_VIEW_TREE_API.GET_USER_FORM_BIND_VIEW_TREE, params)
    if (res && res.code === 200) {
      formTreeData.value = res.data || []
      
      // 提取已选中的节点 - 按照规则：叶子节点isChecked=true加入；父节点只有当所有子节点都勾选且本身isChecked=true才加入
      const extractCheckedKeys = (nodes) => {
        const keys = []
        
        const dfs = (node) => {
          const children = node.children || []
          
          if (children.length === 0) {
            // 叶子节点：isChecked=true时加入
            if (node.isChecked === true) {
              keys.push(node.formGroupTypeId)
            }
            return !!node.isChecked
          }
          
          // 父节点：检查所有子节点是否都勾选
          let allChildrenChecked = true
          for (const child of children) {
            const childAllChecked = dfs(child)
            allChildrenChecked = allChildrenChecked && childAllChecked
          }
          
          // 只有当所有子节点都勾选且本身isChecked=true才加入父节点
          if (allChildrenChecked && node.isChecked === true) {
            keys.push(node.formGroupTypeId)
            return true
          }
          
          return false
        }
        
        ;(nodes || []).forEach(dfs)
        return keys
      }
      
      checkedKeys.value = extractCheckedKeys(formTreeData.value)
    } else {
      ElMessage({
        message: res?.message || t('systembasicmgmt.userformbind.getFormTreeFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    console.error('获取表单配置树失败:', error)
    ElMessage({
      message: t('systembasicmgmt.userformbind.getFormTreeFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    treeLoading.value = false
  }
}

// 防抖搜索定时器
let searchTimer = null

/**
 * 处理搜索（带防抖）
 */
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true // 立即显示加载状态
  // 立即执行搜索，不等待防抖延迟
  pagination.pageIndex = 1
  fetchUserPages()
}

/**
 * 处理重置
 */
const handleReset = () => {
  Object.assign(filters, {
    userNo: '',
    userName: '',
    departmentId: null
  })
  pagination.pageIndex = 1
  fetchUserPages()
}

/**
 * 处理页码变化
 */
const handlePageChange = (page) => {
  pagination.pageIndex = page
  fetchUserPages()
}

/**
 * 处理页大小变化
 */
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.pageIndex = 1
  fetchUserPages()
}

/**
 * 处理配置表单
 */
const handleConfigForm = async (row) => {
  currentUser.value = row
  configDialogVisible.value = true
  
  // 获取用户表单绑定视图树数据
  await fetchUserFormBindViewTree(row.userId)
}

/**
 * 处理树节点选中状态变化
 * 监控选中状态变化，可用于调试
 */
const handleCheckChange = (data, checked) => {
  // 由于check-strictly="false"，Element Plus会自动处理父子关联
  console.log('节点选中状态变化:', data.formGroupTypeName, checked)
}

/**
 * 处理保存表单配置
 */
const handleSaveFormConfig = async () => {
  if (!currentUser.value || !formTreeRef.value) return
  
  saveLoading.value = true
  try {
    // 获取选中的节点
    const checkedNodes = formTreeRef.value.getCheckedNodes()
    const halfCheckedNodes = formTreeRef.value.getHalfCheckedNodes()
    
    // 合并全选和半选节点
    const allSelectedNodes = [...checkedNodes, ...halfCheckedNodes]
    const selectedFormIds = allSelectedNodes.map(node => node.formGroupTypeId)
    
    const params = {
      userId: currentUser.value.userId,
      formGroupTypeId: selectedFormIds
    }
    
    const res = await post(UPDATE_USER_FORM_BIND_API.UPDATE_USER_FORM_BIND, params)
    if (res && res.code === 200) {
      ElMessage({
        message: t('systembasicmgmt.userformbind.saveConfigSuccess'),
        type: 'success',
        plain: true,
        showClose: true
      })
      configDialogVisible.value = false
    } else {
      ElMessage({
        message: res?.message || t('systembasicmgmt.userformbind.saveConfigFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    console.error('保存表单配置失败:', error)
    ElMessage({
      message: t('systembasicmgmt.userformbind.saveConfigFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    saveLoading.value = false
  }
}

/**
 * 处理全选
 */
const handleSelectAll = () => {
  if (!formTreeRef.value || !formTreeData.value) return
  
  // 获取所有节点ID
  const getAllNodeIds = (nodes) => {
    const ids = []
    const traverse = (nodeList) => {
      nodeList.forEach(node => {
        ids.push(node.formGroupTypeId)
        if (node.children && node.children.length > 0) {
          traverse(node.children)
        }
      })
    }
    traverse(nodes)
    return ids
  }
  
  const allIds = getAllNodeIds(formTreeData.value)
  formTreeRef.value.setCheckedKeys(allIds)
}

/**
 * 处理取消全选
 */
const handleDeselectAll = () => {
  if (!formTreeRef.value) return
  formTreeRef.value.setCheckedKeys([])
}

// 页面挂载时初始化数据
onMounted(() => {
  initPageData()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';
.form-tree-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px;
}

.tree-select-buttons {
  margin-top: 10px;
  text-align: left;
}
</style>
  
  
