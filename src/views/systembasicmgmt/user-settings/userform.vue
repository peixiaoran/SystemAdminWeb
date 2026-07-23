<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 过滤条件 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="用户表单绑定搜索表单">
        <el-form-item :label="$t('systembasicmgmt.userform.department')">
          <el-tree-select
            v-model="filters.departmentId"
            :data="departmentOptions || []"
            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
            check-strictly
            filterable
            :filter-node-method="filterNodeMethod"
            @change="handleDepartmentChange"
            style="width: 210px;"
            popper-class="main-dept-filter-popper"
            :placeholder="$t('systembasicmgmt.userform.pleaseSelectDepartment')" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userform.userNo')">
          <el-input v-model="filters.userNo"
                    style="width: 200px;"
                    :placeholder="$t('systembasicmgmt.userform.pleaseInputUserNo')"
                    clearable
                    @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userform.userName')">
          <el-input v-model="filters.userName"
                    style="width: 200px;"
                    :placeholder="$t('systembasicmgmt.userform.pleaseInputUserName')"
                    clearable
                    @keyup.enter="handleSearch" />
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
        <el-table :data="userList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.userform.index')" width="70" align="center" fixed />
          <el-table-column prop="userNo" :label="$t('systembasicmgmt.userform.userNo')" align="center" min-width="130" />
          <el-table-column prop="userName" :label="$t('systembasicmgmt.userform.userName')" align="left" min-width="180" />
          <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userform.departmentName')" align="left" min-width="270" />
          <el-table-column prop="positionName" :label="$t('systembasicmgmt.userform.positionName')" align="left" min-width="150" />
          <el-table-column prop="laborName" :label="$t('systembasicmgmt.userform.laborName')" align="left" min-width="270" />
          <el-table-column :label="$t('systembasicmgmt.userform.isReview')" align="center" min-width="120">
            <template #default="scope">
              <el-tag :type="scope.row.isReview === '1' ? 'primary' : 'info'">
                {{ scope.row.isReview === '1' ? $t('common.yes') : $t('common.no') }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 操作列 -->
          <el-table-column :label="$t('common.operation')" align="center" width="150" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="handleConfigForm(row)" plain>
                {{ $t('systembasicmgmt.userform.configForm') }}
              </el-button>
            </template>
          </el-table-column>
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

    <!-- 配置表单弹窗 -->
    <el-dialog v-model="configDialogVisible"
               :title="$t('systembasicmgmt.userform.configFormTitle')"
               width="600px"
               height="300px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :append-to-body="true"
               :modal="true"
               :lock-scroll="true"
               :z-index="2000"
               @close="handleDialogClose">
      <div v-if="currentUser">
        <div class="user-info-display">
          <strong>{{ $t('systembasicmgmt.userform.departmentName') }}: {{ currentUser.departmentName }}</strong>
        </div>
        <div class="user-info-display">
          <strong>{{ $t('systembasicmgmt.userform.userNo') }}: {{ currentUser.userNo }} | {{ $t('systembasicmgmt.userform.userName') }}: {{ currentUser.userName }}</strong>
        </div>

        <div class="form-tree-container">
          <el-tree ref="formTreeRef"
                   :data="formTreeData"
                   :props="treeProps"
                   show-checkbox
                   node-key="formGroupTypeId"
                   :default-checked-keys="checkedKeys"
                   :check-strictly="false"
                   v-loading="treeLoading" />
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
import { ref, reactive, onMounted } from 'vue'
import { post, isHandled } from '@/utils/request'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  GET_USER_PAGES_API,
  GET_DEPARTMENT_DROPDOWN_API,
  GET_USER_FORM_VIEW_TREE_API,
  UPDATE_USER_FORM_API
} from '@/config/api/systembasicmgmt/user-settings/userform.js'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const loading = ref(false)
const userList = ref([])
const departmentOptions = ref([])

const configDialogVisible = ref(false)
const treeLoading = ref(false)
const saveLoading = ref(false)
const formTreeData = ref([])
const currentUser = ref(null)
const checkedKeys = ref([])
const formTreeRef = ref(null)

const filters = reactive({
  userNo: '',
  userName: '',
  departmentId: null
})

const pagination = reactive({
  pageIndex: 1,
  pageSize: 20,
  totalCount: 0
})

const treeProps = {
  children: 'children',
  label: 'formGroupTypeName',
  // 后端返回的 disabled 不参与渲染，所有节点均可勾选
  disabled: () => false
}

const filterNodeMethod = (value, data) => {
  if (!value) return true
  return data.departmentName && data.departmentName.includes(value)
}

const findFirstDepartment = (departments) => {
  for (const dept of departments) {
    return dept.departmentId
  }
  return null
}

const scheduleSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchUserPages()
  }, DEBOUNCE_MS)
}

const initPageData = async () => {
  await fetchDepartmentTree(true)
  await fetchUserPages()
}

const fetchDepartmentTree = async (setDefaultFilter = false) => {
  try {
    const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
    if (res && res.code === 200) {
      departmentOptions.value = res.data || []

      if (setDefaultFilter && departmentOptions.value.length > 0) {
        const firstDepartmentId = findFirstDepartment(departmentOptions.value)
        if (firstDepartmentId) {
          filters.departmentId = firstDepartmentId
        }
      }
    }
  } catch {
    // 部门下拉获取失败，保持空列表
  }
}

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
      userList.value = (res.data || []).map((row) => ({
        ...row,
        isReview: (() => {
          const v = row.isReview ?? row.isApproval ?? row.IsApproval
          return v === '1' || v === 1 ? '1' : '0'
        })()
      }))
      pagination.totalCount = res.totalCount || 0
    } else {
      ElMessage({
        message: res?.message || t('systembasicmgmt.userform.getUserPagesFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch {
    ElMessage({
      message: t('systembasicmgmt.userform.getUserPagesFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    loading.value = false
  }
}

const fetchUserFormViewTree = async (userId) => {
  treeLoading.value = true
  try {
    const formData = new FormData()
    formData.append('userId', userId)
    const res = await post(GET_USER_FORM_VIEW_TREE_API.GET_USER_FORM_VIEW_TREE, formData)
    if (res && res.code === 200) {
      // 转换数据结构：将 formTypeChildren 转换为 children，数值转换为布尔值
      const transformTreeData = (nodes) => {
        return nodes.map(node => ({
          ...node,
          isChecked: node.isChecked === 1 || node.isChecked === '1',
          children: node.formTypeChildren ? transformTreeData(node.formTypeChildren) : []
        }))
      }

      formTreeData.value = transformTreeData(res.data || [])

      // 提取已选中的节点 - 树为父子联动模式，只回填叶子节点，
      // 父节点的勾选/半选状态由 el-tree 依据子节点自行推导，
      // 否则父节点 isChecked=1 会把 isChecked=0 的子节点一起选中
      const extractCheckedKeys = (nodes) => {
        const keys = []
        const traverse = (nodeList) => {
          nodeList.forEach(node => {
            const hasChildren = node.children && node.children.length > 0
            if (hasChildren) {
              traverse(node.children)
            } else if (node.isChecked === true) {
              keys.push(node.formGroupTypeId)
            }
          })
        }
        traverse(nodes || [])
        return keys
      }

      checkedKeys.value = extractCheckedKeys(formTreeData.value)
    } else {
      ElMessage({
        message: res?.message || t('systembasicmgmt.userform.getFormTreeFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch {
    ElMessage({
      message: t('systembasicmgmt.userform.getFormTreeFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
  } finally {
    treeLoading.value = false
  }
}

const handleSearch = () => {
  scheduleSearch()
}

const handleReset = () => {
  filters.userNo = ''
  filters.userName = ''

  if (departmentOptions.value.length > 0) {
    const firstDepartmentId = findFirstDepartment(departmentOptions.value)
    filters.departmentId = firstDepartmentId ?? null
  } else {
    filters.departmentId = null
  }

  scheduleSearch()
}

const handleDepartmentChange = () => {
  handleSearch()
}

const handlePageChange = () => {
  fetchUserPages()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchUserPages()
}

const handleConfigForm = async (row) => {
  currentUser.value = row
  configDialogVisible.value = true
  await fetchUserFormViewTree(row.userId)
}

const handleSaveFormConfig = async () => {
  if (!currentUser.value || !formTreeRef.value) return

  saveLoading.value = true

  const checkedNodes = formTreeRef.value.getCheckedNodes()
  const halfCheckedNodes = formTreeRef.value.getHalfCheckedNodes()
  const allSelectedNodes = [...checkedNodes, ...halfCheckedNodes]
  const selectedFormIds = allSelectedNodes.map(node => node.formGroupTypeId)

  const params = {
    userId: currentUser.value.userId,
    formGroupTypeId: selectedFormIds
  }

  try {
    const res = await post(UPDATE_USER_FORM_API.UPDATE_USER_FORM, params)
    // 全局已处理（如请求超时/网络异常）：已弹出统一提示，业务侧不再弹成功或失败
    if (isHandled(res)) {
      return
    }
    if (res && res.code === 200) {
      ElMessage({
        message: t('systembasicmgmt.userform.saveConfigSuccess'),
        type: 'success',
        plain: true,
        showClose: true
      })
      configDialogVisible.value = false
    } else {
      ElMessage({
        message: res?.message || t('systembasicmgmt.userform.saveConfigFailed'),
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } finally {
    saveLoading.value = false
  }
}

const handleSelectAll = () => {
  if (!formTreeRef.value || !formTreeData.value) return

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

const handleDeselectAll = () => {
  if (!formTreeRef.value) return
  formTreeRef.value.setCheckedKeys([])
}

const handleDialogClose = () => {
  formTreeData.value = []
  checkedKeys.value = []
  currentUser.value = null
}

onMounted(() => {
  initPageData()
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.user-info-display {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.user-info-display strong {
  color: #303133;
  font-size: 12px;
}

.form-tree-container {
  max-height: 300px;
  overflow-y: auto;
  padding: 15px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.form-tree-container .el-tree {
  background-color: transparent;
}

.tree-select-buttons {
  margin-top: 10px;
  text-align: left;
}
</style>

<!-- 部门树下拉项加高、加宽（下拉挂载到 body，需单独样式） -->
<style>
  .main-dept-filter-popper {
    width: auto !important;
    min-width: 280px !important;
  }
  .main-dept-filter-popper .el-select-dropdown__wrap,
  .main-dept-filter-popper .el-scrollbar__view,
  .main-dept-filter-popper .el-tree {
    width: 100% !important;
    min-width: 100% !important;
  }
  .main-dept-filter-popper .el-tree-node__content {
    height: 36px;
    line-height: 36px;
    padding-left: 12px;
    width: 100% !important;
    min-width: 100% !important;
  }
</style>
