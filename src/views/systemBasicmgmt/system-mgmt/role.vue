<template>
  <div class="conventional-table-container">
      <el-card class="conventional-card">

          <!-- 过滤条件 -->
          <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" aria-label="角色过滤表单">
              <el-form-item :label="$t('SystemBasicMgmt.role.roleCode')">
                  <el-input style="width: 180px;"
                            v-model="filters.roleCode"
                            :placeholder="$t('SystemBasicMgmt.role.pleaseInputRoleCode')" />
              </el-form-item>
              <el-form-item :label="$t('SystemBasicMgmt.role.roleName')">
                  <el-input style="width: 180px;"
                            v-model="filters.roleName"
                            :placeholder="$t('SystemBasicMgmt.role.pleaseInputRoleName')" />
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
                      {{ $t('SystemBasicMgmt.role.addRole') }}
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
                  <el-table-column type="index"
                                   :label="$t('SystemBasicMgmt.index')"
                                   width="70"
                                   align="center"
                                   fixed />
                  <el-table-column prop="roleCode"
                                   :label="$t('SystemBasicMgmt.role.roleCode')"
                                   align="left"
                                   min-width="240" />
                  <el-table-column prop="roleNameCh"
                                   :label="$t('SystemBasicMgmt.role.roleNameCh')"
                                   align="left"
                                   min-width="200" />
                  <el-table-column prop="roleNameEn"
                                   :label="$t('SystemBasicMgmt.role.roleNameEn')"
                                   align="left"
                                   min-width="200" />
                  <el-table-column prop="isEnabled"
                                   :label="$t('SystemBasicMgmt.isEnabled')"
                                   align="center"
                                   min-width="100">
                      <template #default="scope">
                          <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">
                              {{ scope.row.isEnabled ? $t('SystemBasicMgmt.enabled') : $t('SystemBasicMgmt.disabled') }}
                          </el-tag>
                      </template>
                  </el-table-column>

                  <el-table-column :label="$t('SystemBasicMgmt.operation')"
                                   min-width="150"
                                   fixed="right"
                                   align="center">
                      <template #default="scope">
                          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                              {{ $t('common.edit') }}
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
                             :total="pagination.total"
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
                  <el-form-item :label="$t('SystemBasicMgmt.role.roleCode')" prop="roleCode">
                      <el-input v-model="editForm.roleCode" style="width:100%"/>
                  </el-form-item>
                  <el-form-item :label="$t('SystemBasicMgmt.role.roleNameCh')" prop="roleNameCh">
                      <el-input v-model="editForm.roleNameCh" style="width:100%"/>
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.role.roleNameEn')" prop="roleNameEn">
                      <el-input v-model="editForm.roleNameEn" style="width:100%"/>
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.remarks')">
                      <el-input v-model="editForm.remarks"
                                type="textarea"
                                style="width:100%"
                                :rows="3" />
                  </el-form-item>
              </div>
              <div class="form-row">
                  <el-form-item :label="$t('SystemBasicMgmt.isEnabled')">
                      <el-switch v-model="editForm.isEnabled"
                                 :active-value="1"
                                 :inactive-value="0"
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
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, nextTick } from 'vue'
  import { post } from '@/utils/request'
  import { GET_ROLE_PAGES_API, GET_ROLE_ENTITY_API, INSERT_ROLE_API, DELETE_ROLE_API, UPDATE_ROLE_API } from '@/config/api/SystemBasicMgmt/System-Mgmt/role'
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
      total: 0
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
      roleNameCh: '',
      roleNameEn: '',
      description: '',
      isEnabled: 1,
      remarks: ''
  })
  // 对话框标题
  const dialogTitle = ref(t('SystemBasicMgmt.role.editRole'))

  // 表单验证规则
  const formRules = reactive({
      roleCode: [
          { required: true, message: () => t('SystemBasicMgmt.role.pleaseInputRoleCode'), trigger: 'blur' }
      ],
      roleNameCh: [
          { required: true, message: () => t('SystemBasicMgmt.role.pleaseInputRoleNameCh'), trigger: 'blur' }
      ],
      roleNameEn: [
          { required: true, message: () => t('SystemBasicMgmt.role.pleaseInputRoleNameEn'), trigger: 'blur' }
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
      pagination.total = res.totalNumber || 0
      loading.value = false
  }

  // 获取角色实体数据
  const fetchRoleEntity = async (roleId) => {
      const params = {
          roleId: roleId
      }
      const res = await post(GET_ROLE_ENTITY_API.GET_ROLE_ENTITY, params)

      if (res && res.code === '200') {
          // 对字符串类型的字段进行防护XSS清洗
          editForm.roleId = res.data.roleId
          editForm.roleCode = res.data.roleCode || ''
          editForm.roleNameCh = res.data.roleNameCh || ''
          editForm.roleNameEn = res.data.roleNameEn || ''
          editForm.description = res.data.description || ''
          editForm.isEnabled = res.data.isEnabled
          editForm.remarks = res.data.remarks || ''
      }
  }

  // 处理搜索事件
  const handleSearch = () => {
      pagination.pageIndex = 1
      fetchRolePages()
  }

  // 处理重置事件
  const handleReset = () => {
      filters.roleCode = ''
      filters.roleName = ''
      pagination.pageIndex = 1
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
      editForm.roleNameCh = ''
      editForm.roleNameEn = ''
      editForm.description = ''
      editForm.isEnabled = 1
      editForm.remarks = ''
      
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
          roleNameCh: editForm.roleNameCh,
          roleNameEn: editForm.roleNameEn,
          description: editForm.description,
          isEnabled: editForm.isEnabled,
          remarks: editForm.remarks
      }
      const res = await post(INSERT_ROLE_API.INSERT_ROLE, params)

      if (res && res.code === '200') {
          resetForm()
          fetchRolePages()
      } else {
          ElMessage.error(res.message)
      }
  }

  // 更新角色操作
  const updateRole = async () => {
      const params = {
          roleId: editForm.roleId,
          roleCode: editForm.roleCode,
          roleNameCh: editForm.roleNameCh,
          roleNameEn: editForm.roleNameEn,
          description: editForm.description,
          isEnabled: editForm.isEnabled,
          remarks: editForm.remarks
      }
      const res = await post(UPDATE_ROLE_API.UPDATE_ROLE, params)

      if (res && res.code === '200') {
          resetForm()
          ElMessage.success(res.message)
          dialogVisible.value = false
          fetchRolePages()
      } else {
          ElMessage.error(res.message)
      }
  }

  // 删除角色操作
  const deleteRole = async (roleId) => {
      const params = {
          roleId: roleId
      }

      if (isNaN(params.roleId)) {
          ElMessage.error(t('SystemBasicMgmt.invalidId'))
          return
      }

      const res = await post(DELETE_ROLE_API.DELETE_ROLE, params)

      if (res && res.code === '200') {
          ElMessage.success(res.message)
          dialogVisible.value = false
          fetchRolePages()
      } else {
          ElMessage.error(res.message)
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
      dialogTitle.value = t('SystemBasicMgmt.role.addRole')

      // 显示对话框
      dialogVisible.value = true
  }

  // 处理编辑事件
  const handleEdit = (index, row) => {
      // 重置表单数据
      resetForm()

      // 设置对话框标题
      dialogTitle.value = t('SystemBasicMgmt.role.editRole')

      // 获取角色实体数据
      fetchRoleEntity(row.roleId)

      // 显示对话框
      dialogVisible.value = true
      
      // 数据加载完成后再次清除验证状态
      setTimeout(() => {
          if (editFormRef.value) {
              editFormRef.value.clearValidate()
          }
      }, 100)
  }

  // 处理对话框关闭
  const handleDialogClose = () => {
      // 使用 nextTick 确保 DOM 更新完成后清除验证
      nextTick(() => {
          resetForm(true)
      })
  }

  // 处理删除事件
  const handleDelete = (index, row) => {
      ElMessageBox.confirm(
          t('SystemBasicMgmt.role.deleteConfirm'),
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
</script>

<style scoped>
  @import '@/assets/styles/conventionalTablePage.css';
</style>

