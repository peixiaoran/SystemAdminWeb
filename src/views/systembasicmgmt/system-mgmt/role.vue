<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <!-- 过滤条件 -->
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="角色过滤表单">
        <el-form-item :label="$t('systembasicmgmt.role.roleCode')">
          <el-input style="width: 180px;"
                    v-model="filters.roleCode"
                    :placeholder="$t('systembasicmgmt.role.pleaseInputRoleCode')" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.role.roleName')">
          <el-input style="width: 180px;"
                    v-model="filters.roleName"
                    :placeholder="$t('systembasicmgmt.role.pleaseInputRoleName')" />
        </el-form-item>
        <el-form-item class="form-button-group">
          <el-button type="primary" @click="handleSearch" plain>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="handleReset">
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
        <el-form-item class="form-right-button">
          <el-button type="primary" @click="handleAdd">
            {{ $t('systembasicmgmt.role.addRole') }}
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格数据 -->
      <div class="table-container">
        <el-table :data="roleList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table">
          <el-table-column type="index" :label="$t('systembasicmgmt.index')" width="70" align="center" fixed />
          <el-table-column prop="roleCode" :label="$t('systembasicmgmt.role.roleCode')" align="left" min-width="140" />
          <el-table-column prop="roleNameCn" :label="$t('systembasicmgmt.role.roleNameCn')" align="left" min-width="200" />
          <el-table-column prop="roleNameEn" :label="$t('systembasicmgmt.role.roleNameEn')" align="left" min-width="200" />
          <el-table-column :label="$t('systembasicmgmt.isEnabled')" align="center" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                {{ scope.row.isEnabled ? $t('systembasicmgmt.enabled') : $t('systembasicmgmt.disabled') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('systembasicmgmt.operation')" min-width="260" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                {{ $t('common.edit') }}
              </el-button>
              <el-button size="small" @click="handleConfigModule(scope.row)">
                {{ $t('systembasicmgmt.role.configModule') }}
              </el-button>
              <el-button size="small" @click="handleConfigMenu(scope.row)">
                {{ $t('systembasicmgmt.role.configMenu') }}
              </el-button>
              <el-button size="small"
                         type="danger"
                         @click="handleDelete(scope.$index, scope.row)">
                {{ $t('common.delete') }}
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

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="50%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :modal-append-to-body="true"
               :lock-scroll="true"
               @close="handleDialogClose">
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="100px" class="dialog-form" role="form" aria-label="角色编辑表单">
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.role.roleCode')" prop="roleCode">
            <el-input v-model="editForm.roleCode" style="width:100%"/>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.role.roleNameCn')" prop="roleNameCn">
            <el-input v-model="editForm.roleNameCn" style="width:100%"/>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.role.roleNameEn')" prop="roleNameEn">
            <el-input v-model="editForm.roleNameEn" style="width:100%"/>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.remark')">
            <el-input v-model="editForm.remark"
                      type="textarea"
                      style="width:100%"
                      :rows="3" />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.isEnabled')">
            <el-switch v-model="editForm.isEnabled"
                       :active-value="1"
                       :inactive-value="0"
                       :active-text="$t('common.yes')"
                       :inactive-text="$t('common.no')"
                       inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399; width:100%"/>
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="handleSave">{{ $t('common.confirm') }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 配置模块对话框 -->
      <el-dialog v-model="moduleDialogVisible"
                 :title="$t('systembasicmgmt.role.configModule')"
                 width="30%"
                 :close-on-click-modal="false"
                 :append-to-body="true"
                 :modal-append-to-body="true"
                 :lock-scroll="true"
                 @close="handleModuleDialogClose">
        <!-- 显示当前角色名称 -->
        <div class="role-name-display">
          <strong>{{ $t('systembasicmgmt.role.currentRole') }}: {{ currentRoleName }}</strong>
        </div>
        <div class="module-tree-container">
          <el-tree
              ref="moduleTreeRef"
              :data="moduleTreeData"
              show-checkbox
              node-key="moduleId"
              :props="moduleTreeProps"
              :default-checked-keys="defaultCheckedModules"
              @check-change="handleModuleCheckChange">
          </el-tree>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="moduleDialogVisible = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="saveModuleConfig">{{ $t('common.confirm') }}</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 配置菜单对话框 -->
      <el-dialog v-model="menuDialogVisible"
                 :title="$t('systembasicmgmt.role.configMenu')"
                 width="40%"
                 :close-on-click-modal="false"
                 :append-to-body="true"
                 :modal-append-to-body="true"
                 :lock-scroll="true"
                 @close="handleMenuDialogClose">
        <div class="role-name-display">
          <strong>{{ $t('systembasicmgmt.role.currentRole') }}: {{ currentRoleName }}</strong>
        </div>
        <div class="menu-config-container">
          <!-- 左侧模块选择区域 -->
          <div class="module-select-section">
            <div class="section-title">{{ $t('systembasicmgmt.role.selectModule') }}</div>
            <el-select v-model="selectedModuleId" 
                       @change="handleModuleChange"
                       style="width: 100%;"
                       :placeholder="$t('systembasicmgmt.role.selectModule')">
              <el-option
                  v-for="item in moduleOptions"
                  :key="item.moduleId"
                  :label="item.moduleName"
                  :value="item.moduleId"
                  :disabled="item.disabled">
              </el-option>
            </el-select>
          </div>
          
          <!-- 右侧菜单树区域 -->
          <div class="menu-tree-section">
            <div class="section-title">{{ $t('systembasicmgmt.role.configMenu') }}</div>
            <el-tree
                ref="menuTreeRef"
                :data="menuTreeData"
                show-checkbox
                node-key="menuId"
                :props="menuTreeProps"
                :default-checked-keys="defaultCheckedMenus"
                :check-strictly="false"
                check-on-click-node
                @check-change="handleMenuCheckChange">
            </el-tree>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="menuDialogVisible = false">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="saveMenuConfig">{{ $t('common.confirm') }}</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
</template>

<script setup>
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { post } from '@/utils/request'
  import { debounce, PERFORMANCE_CONFIG } from '@/utils/performance'
  import { 
  GET_ROLE_PAGES_API, 
  GET_ROLE_ENTITY_API, 
  INSERT_ROLE_API, 
  DELETE_ROLE_API, 
  UPDATE_ROLE_API, 
  GET_ROLE_MODULE_LIST_API, 
  GET_ROLE_MODULE_DROPDOWN_API,
  GET_ROLE_MENU_TREE_API,
  UPDATE_ROLE_MODULE_CONFIG_API,
  UPDATE_ROLE_MENU_CONFIG_API
} from '@/config/api/systembasicmgmt/system-mgmt/role'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  // 使用i18n
  const { t } = useI18n()

  // 角色数据
  const roleList = ref([])
  const loading = ref(false)

  // 表单引用
  const editFormRef = ref(null)

  // 分页信息
  const pagination = reactive({
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0
  })

  // 过滤条件
  const filters = reactive({
      roleCode: '',
      roleName: ''
  })

  // 对话框显示状态
  const dialogVisible = ref(false)

  // 编辑表单
  const editForm = reactive({
      roleId: '',
      roleCode: '',
      roleNameCn: '',
      roleNameEn: '',
      description: '',
      isEnabled: 1,
      remark: ''
  })
  // 对话框标题
  const dialogTitle = ref(t('systembasicmgmt.role.editRole'))

  // 配置模块相关
  const moduleDialogVisible = ref(false)
  const moduleTreeRef = ref(null)
  const moduleTreeData = ref([])
  const defaultCheckedModules = ref([])
  const currentRoleId = ref('')
  const currentRoleName = ref('')
  const moduleTreeProps = {
      label: 'moduleName',
      children: 'children',
      disabled: (data) => !data.isEnabled
  }

  // 配置菜单相关
  const menuDialogVisible = ref(false)
  const menuTreeRef = ref(null)
  const menuTreeData = ref([])
  const defaultCheckedMenus = ref([])
  const selectedModuleId = ref('')
  const moduleOptions = ref([])
  const menuTreeProps = {
      label: 'menuName',
      children: 'menuChildren',
      disabled: (data) => !data.isEnabled
  }

  // 表单验证规则
  const formRules = reactive({
      roleCode: [
          { required: true, message: () => t('systembasicmgmt.role.pleaseInputRoleCode'), trigger: 'blur' }
      ],
      roleNameCn: [
          { required: true, message: () => t('systembasicmgmt.role.pleaseInputRoleNameCn'), trigger: 'blur' }
      ],
      roleNameEn: [
          { required: true, message: () => t('systembasicmgmt.role.pleaseInputRoleNameEn'), trigger: 'blur' }
      ]
  })

  // 组件挂载后获取角色数据
  onMounted(() => {
      fetchRolePages()
  })

  // 获取角色列表数据
  const fetchRolePages = async () => {
      loading.value = true
      const params = {
          ...filters,
          pageIndex: pagination.pageIndex,
          pageSize: pagination.pageSize
      }

      const res = await post(GET_ROLE_PAGES_API.GET_ROLE_PAGES, params)

      // 在处理数据前确保使用sanitizeHtml清洗相关字段
      roleList.value = res.data || []
      pagination.totalCount = res.totalCount || 0
      loading.value = false
  }

  // 获取角色实体数据
  const fetchRoleEntity = async (roleId) => {
      const params = {
          roleId: roleId
      }
      const res = await post(GET_ROLE_ENTITY_API.GET_ROLE_ENTITY, params)

      if (res && res.code === 200) {
          // 对字符串类型的字段进行防护XSS清洗
          editForm.roleId = res.data.roleId
          editForm.roleCode = res.data.roleCode || ''
          editForm.roleNameCn = res.data.roleNameCn || ''
          editForm.roleNameEn = res.data.roleNameEn || ''
          editForm.description = res.data.description || ''
          editForm.isEnabled = res.data.isEnabled
          editForm.remark = res.data.remark || ''
      }
  }

  // 使用通用防抖工具
  const debouncedFetchRolePages = debounce(() => {
      fetchRolePages()
  }, PERFORMANCE_CONFIG.DEBOUNCE_DELAY)

  // 处理搜索事件（带防抖）
  const handleSearch = () => {
      pagination.pageIndex = 1
      loading.value = true
      debouncedFetchRolePages()
  }

  // 立即查询数据（不使用防抖，用于保存后刷新）
  const fetchRolePagesImmediate = () => {
      fetchRolePages()
  }

  // 处理重置事件
  const handleReset = () => {
      filters.roleCode = ''
      filters.roleName = ''
  }

  // 处理页码变化
  const handlePageChange = (page) => {
      pagination.pageIndex = page
      fetchRolePages()
  }

  // 处理每页记录数变化
  const handleSizeChange = (size) => {
      pagination.pageSize = size
      pagination.pageIndex = 1
      fetchRolePages()
  }

  const resetForm = (clearValidation = true) => {
      // 清除验证状态（需要在重置之前）
      if (clearValidation && editFormRef.value) {
          try {
              editFormRef.value.clearValidate()
          } catch (error) {
              console.warn('清除表单验证状态失败:', error)
          }
      }
      
      editForm.roleId = ''
      editForm.roleCode = ''
      editForm.roleNameCn = ''
      editForm.roleNameEn = ''
      editForm.description = ''
      editForm.isEnabled = 1
      editForm.remark = ''
      
      // 重置完成后再次清除验证状态
      if (clearValidation) {
          nextTick(() => {
              if (editFormRef.value) {
                  try {
                      editFormRef.value.clearValidate()
                  } catch (error) {
                      console.warn('清除表单验证状态失败:', error)
                  }
              }
          })
      }
  }

  // 新增角色操作
  const insertRole = async () => {
      const params = {
          roleId: '',
          roleCode: editForm.roleCode,
          roleNameCn: editForm.roleNameCn,
          roleNameEn: editForm.roleNameEn,
          description: editForm.description,
          isEnabled: editForm.isEnabled,
          remark: editForm.remark
      }
      const res = await post(INSERT_ROLE_API.INSERT_ROLE, params)

      if (res && res.code === 200) {
          resetForm()
          fetchRolePages()
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 更新角色操作
  const updateRole = async () => {
      const params = {
          roleId: editForm.roleId,
          roleCode: editForm.roleCode,
          roleNameCn: editForm.roleNameCn,
          roleNameEn: editForm.roleNameEn,
          description: editForm.description,
          isEnabled: editForm.isEnabled,
          remark: editForm.remark
      }
      const res = await post(UPDATE_ROLE_API.UPDATE_ROLE, params)

      if (res && res.code === 200) {
          resetForm()
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          dialogVisible.value = false
          fetchRolePages()
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 删除角色操作
  const deleteRole = async (roleId) => {
      const params = {
          roleId: roleId
      }

      if (isNaN(params.roleId)) {
          ElMessage({
              message: t('systembasicmgmt.invalidId'),
              type: 'error',
              plain: true,
              showClose: true
          })
          return
      }

      const res = await post(DELETE_ROLE_API.DELETE_ROLE, params)

      if (res && res.code === 200) {
          ElMessage({
              message: res.message,
              type: 'success',
              plain: true,
              showClose: true
          })
          dialogVisible.value = false
          fetchRolePages()
      } else {
          ElMessage({
              message: res.message,
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  // 处理添加事件
  const handleAdd = () => {
      // 重置表单数据
      resetForm()
      // 设置默认值
      editForm.roleId = ''
      editForm.isEnabled = 1

      // 设置对话框标题
      dialogTitle.value = t('systembasicmgmt.role.addRole')

      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑事件
  const handleEdit = (index, row) => {
      // 重置表单数据
      resetForm()

      // 设置对话框标题
      dialogTitle.value = t('systembasicmgmt.role.editRole')

      // 获取角色实体数据
      fetchRoleEntity(row.roleId)

      // 显示对话框
      dialogVisible.value = true
  }

  // 处理对话框关闭
  const handleDialogClose = () => {
      // 使用 nextTick 确保 DOM 更新完成后清除验证
      nextTick(() => {
          resetForm(true)
      })
  }

  /**
   * 处理配置模块对话框关闭事件
   * 清理模块相关数据，确保下次打开时获取最新数据
   */
  const handleModuleDialogClose = () => {
      // 清理模块树数据
      moduleTreeData.value = []
      defaultCheckedModules.value = []
      currentRoleId.value = ''
      currentRoleName.value = ''
      
      // 清理树组件的选中状态
      nextTick(() => {
          if (moduleTreeRef.value) {
              moduleTreeRef.value.setCheckedKeys([])
          }
      })
  }

  /**
   * 处理配置菜单对话框关闭事件
   * 清理菜单相关数据，确保下次打开时获取最新数据
   */
  const handleMenuDialogClose = () => {
      // 清理菜单树数据
      menuTreeData.value = []
      defaultCheckedMenus.value = []
      moduleOptions.value = []
      selectedModuleId.value = ''
      currentRoleId.value = ''
      currentRoleName.value = ''
      
      // 清理树组件的选中状态
      nextTick(() => {
          if (menuTreeRef.value) {
              menuTreeRef.value.setCheckedKeys([])
          }
      })
  }

  // 处理删除事件
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('systembasicmgmt.role.deleteConfirm'),
          t('common.tip'),
          {
              confirmButtonText: t('common.confirm'),
              cancelButtonText: t('common.cancel'),
              type: 'warning',
          }
      )
          .then(() => {
              deleteRole(row.roleId)
              // 重新获取数据
              fetchRolePages()
          })
          .catch(() => {
              // 取消删除
          })
  }

  // 处理编辑保存
  const handleSave = () => {
      editFormRef.value?.validate((valid) => {
          if (valid) {
              // 判断是新增还是编辑
              const isNewRole = !editForm.roleId || editForm.roleId === ''

              if (isNewRole) {
                  insertRole()
              } else {
                  updateRole()
              }
              dialogVisible.value = false

              // 重新获取数据
              fetchRolePages()
          }
      })
  }

  // 配置模块相关函数
  const handleConfigModule = async (row) => {
      currentRoleId.value = row.roleId
      currentRoleName.value = row.roleNameCn || row.roleName || ''
      await fetchRoleModuleList(row.roleId)
      moduleDialogVisible.value = true
  }

  const fetchRoleModuleList = async (roleId) => {
      try {
          const params = { roleId: roleId }
          const res = await post(GET_ROLE_MODULE_LIST_API.GET_ROLE_MODULE_LIST, params)
          if (res && res.code === 200) {
              moduleTreeData.value = res.data || []
              defaultCheckedModules.value = res.data
                  .filter(item => item.isChecked)
                  .map(item => item.moduleId)
          }
      } catch (error) {
          ElMessage({
              message: error.message || t('systembasicmgmt.role.fetchModuleListFail'),
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  const handleModuleCheckChange = () => {
      // 处理模块选择变化
  }

  /**
   * 保存模块配置
   * 在保存前显示确认提示
   */
  const saveModuleConfig = async () => {
      try {
          await ElMessageBox.confirm(
              t('systembasicmgmt.role.confirmSaveModuleConfig'),
              t('systembasicmgmt.role.confirmTitle'),
              {
                  confirmButtonText: t('common.confirm'),
                  cancelButtonText: t('common.cancel'),
                  type: 'warning'
              }
          )

          const checkedNodes = moduleTreeRef.value?.getCheckedKeys() || []
          // 获取所有模块节点的ID
          const getAllModuleIds = (nodes) => {
              let ids = []
              nodes.forEach(node => {
                  ids.push(node.moduleId)
                  if (node.children && node.children.length > 0) {
                      ids = ids.concat(getAllModuleIds(node.children))
                  }
              })
              return ids
          }
          const allModuleIds = getAllModuleIds(moduleTreeData.value)
          const unCheckedNodes = allModuleIds.filter(id => !checkedNodes.includes(id))
          
          const params = {
              roleId: currentRoleId.value,
              SelectedModuleIds: checkedNodes,
              UnSelectedModuleIds: unCheckedNodes
          }
          const res = await post(UPDATE_ROLE_MODULE_CONFIG_API.UPDATE_ROLE_MODULE_CONFIG, params)
          if (res && res.code === 200) {
              ElMessage({
                  message: res.message,
                  type: 'success',
                  plain: true,
                  showClose: true
              })
              moduleDialogVisible.value = false
          }
      } catch (error) {
          if (error === 'cancel') {
              // 用户取消操作，不做任何处理
              console.log('用户取消了模块配置保存操作')
          } else {
              ElMessage({
                  message: error.message,
                  type: 'error',
                  plain: true,
                  showClose: true
              })
          }
      }
  }

  // 配置菜单相关函数
  const handleConfigMenu = async (row) => {
      currentRoleId.value = row.roleId
      currentRoleName.value = row.roleNameCn || row.roleName
      await fetchRoleModuleDropdown()
      menuDialogVisible.value = true
  }

  const fetchRoleModuleDropdown = async () => {
      try {
          const params = { roleId: currentRoleId.value }
          const res = await post(GET_ROLE_MODULE_DROPDOWN_API.GET_ROLE_MODULE_DROPDOWN, params)
          if (res && res.code === 200) {
              moduleOptions.value = res.data || []
              // 默认选中第一个有效值
              const firstValidModule = moduleOptions.value.find(item => !item.disabled)
              if (firstValidModule) {
                  selectedModuleId.value = firstValidModule.moduleId
                  await fetchRoleMenuTree(currentRoleId.value, firstValidModule.moduleId)
              }
          }
      } catch (error) {
          ElMessage({
              message: error.message || t('systembasicmgmt.role.fetchModuleDropdownFail'),
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  const handleModuleChange = async (moduleId) => {
      if (moduleId) {
          await fetchRoleMenuTree(currentRoleId.value, moduleId)
      }
  }

  const fetchRoleMenuTree = async (roleId, moduleId) => {
      try {
          const params = { roleId: roleId, moduleId: moduleId }
          const res = await post(GET_ROLE_MENU_TREE_API.GET_ROLE_MENU_TREE, params)
          if (res && res.code === 200) {
              menuTreeData.value = res.data || []
              // 获取完全选中的菜单ID
              const checkedIds = getCheckedMenuIds(res.data)
              defaultCheckedMenus.value = checkedIds
              
              // 使用nextTick确保DOM更新后设置选中状态
              nextTick(() => {
                  if (menuTreeRef.value) {
                      // 设置选中的节点
                      menuTreeRef.value.setCheckedKeys(checkedIds)
                  }
              })
          }
      } catch (error) {
          ElMessage({
              message: error.message || t('systembasicmgmt.role.fetchMenuTreeFail'),
              type: 'error',
              plain: true,
              showClose: true
          })
      }
  }

  /**
   * 获取选中的菜单ID列表
   * 只返回叶子节点的ID，以确保el-tree正确显示半选中状态
   * @param {Array} menuList - 菜单列表
   * @returns {Array} 选中的叶子节点ID数组
   */
  const getCheckedMenuIds = (menuList) => {
      let checkedIds = []
      menuList.forEach(menu => {
          // 检查是否为叶子节点（没有子节点或子节点为空）
          const isLeafNode = !menu.menuChildren || menu.menuChildren.length === 0
          
          if (menu.isChecked && isLeafNode) {
              // 只有叶子节点且被选中时才添加到结果中
              checkedIds.push(menu.menuId)
          }
          
          // 递归处理子节点
          if (menu.menuChildren && menu.menuChildren.length > 0) {
              checkedIds = checkedIds.concat(getCheckedMenuIds(menu.menuChildren))
          }
      })
      return checkedIds
  }

  const handleMenuCheckChange = () => {
      // 处理菜单选择变化
  }

  /**
   * 保存菜单配置
   * 在保存前显示确认提示
   */
  const saveMenuConfig = async () => {
      try {
          await ElMessageBox.confirm(
              t('systembasicmgmt.role.confirmSaveMenuConfig'),
              t('systembasicmgmt.role.confirmTitle'),
              {
                  confirmButtonText: t('common.confirm'),
                  cancelButtonText: t('common.cancel'),
                  type: 'warning'
              }
          )

          const checkedNodes = menuTreeRef.value?.getCheckedKeys() || []
          const halfCheckedNodes = menuTreeRef.value?.getHalfCheckedKeys() || []
          const allMenuIds = [...checkedNodes, ...halfCheckedNodes]
          
          const params = {
              roleId: currentRoleId.value,
              moduleId: selectedModuleId.value,
              SelectedMenuIds: allMenuIds
          }
          const res = await post(UPDATE_ROLE_MENU_CONFIG_API.UPDATE_ROLE_MENU_CONFIG, params)
          if (res && res.code === 200) {
              ElMessage({
                  message: res.message,
                  type: 'success',
                  plain: true,
                  showClose: true
              })
              menuDialogVisible.value = false
          }
      } catch (error) {
          if (error === 'cancel') {
              // 用户取消操作，不做任何处理
              console.log('用户取消了菜单配置保存操作')
          } else {
              ElMessage({
                  message: error.message || t('systembasicmgmt.role.saveMenuFail'),
                  type: 'error',
                  plain: true,
                  showClose: true
              })
          }
      }
  }
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
  
  .role-name-display {
      margin-bottom: 15px;
      padding: 10px;
      background-color: #f5f7fa;
      border-radius: 4px;
      border-left: 4px solid #409eff;
  }
  
  .role-name-display strong {
      color: #303133;
      font-size: 14px;
  }
  
  /* 配置菜单对话框布局样式 */
  .menu-config-container {
      display: flex;
      gap: 15px;
      height: 400px;
      max-height: 400px;
  }
  
  .module-select-section {
      flex: 0 0 200px;
      padding: 15px;
      background-color: #fafafa;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
  }
  
  .menu-tree-section {
      flex: 1;
      padding: 15px;
      background-color: #fafafa;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
  }
  
  .menu-tree-section .el-tree {
      flex: 1;
      overflow-y: auto;
  }
  
  .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #409eff;
  }
  
  /* 树形组件样式优化 */
  .menu-tree-section .el-tree {
      background-color: transparent;
  }
  
  .menu-tree-section .el-tree-node__content {
      height: 32px;
      line-height: 32px;
  }
  
  /* 配置模块对话框样式 */
  .module-tree-container {
      padding: 15px;
      background-color: #fafafa;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
      height: 400px;
      max-height: 400px;
      overflow-y: auto;
  }
  
  .module-tree-container .el-tree {
      background-color: transparent;
  }
  
  .module-tree-container .el-tree-node__content {
      height: 32px;
      line-height: 32px;
  }
</style>

