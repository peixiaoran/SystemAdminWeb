<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :model="searchForm" :inline="true" class="conventional-filter-form" role="search" aria-label="流程步骤筛选">
        <el-form-item :label="$t('formbusiness.workflowstep.formGroupName')">
          <el-select 
            v-model="searchForm.formGroupId" 
            filterable
            style="width: 180px"
            @change="handleFormGroupChange"
          >
            <el-option
              v-for="item in formGroupOptions"
              :key="item.formGroupId"
              :label="item.formGroupName"
              :value="item.formGroupId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('formbusiness.workflowstep.formTypeName')">
          <el-select 
            v-model="searchForm.formTypeId" 
            filterable
            style="width: 180px"
            @change="handleFormTypeChange"
          >
            <el-option
              v-for="item in formTypeOptions"
              :key="item.formTypeId"
              :label="item.formTypeName"
              :value="item.formTypeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="form-right-button">
          <el-button type="primary" @click="openAddStepDialog">
            {{ $t('formbusiness.workflowstep.addStep') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          :data="workflowStepList"
          border
          stripe
          class="conventional-table"
          :header-cell-style="{ background: '#f5f7fa' }"
          v-loading="loading"
          row-key="stepId"
        >
          <el-table-column type="index" :label="$t('formbusiness.workflowstep.index')" width="80" align="center" fixed />
          <el-table-column prop="stepNameCn" :label="$t('formbusiness.workflowstep.stepNameCn')" min-width="120" show-overflow-tooltip />
          <el-table-column prop="stepNameEn" :label="$t('formbusiness.workflowstep.stepNameEn')" min-width="150" show-overflow-tooltip />
          <el-table-column :label="$t('formbusiness.workflowstep.assignmentName')" min-width="120" align="center">
            <template #default="{ row }">
              <el-tag effect="dark" :type="getAssignmentTagType(row.assignment)">
                {{ row.assignmentName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.workflowstep.isStartStep')" width="120" align="center">
            <template #default="{ row }">
              {{ Number(row.isStartStep) === 1 ? $t('common.yes') : $t('common.no') }}
            </template>
          </el-table-column>
          <el-table-column prop="description" :label="$t('formbusiness.workflowstep.description')" min-width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <span>{{ row.description}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('formbusiness.workflowstep.operation')" width="340" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" size="small" plain @click="handleEditStep(row)">
                {{ $t('formbusiness.workflowstep.editStep') }}
              </el-button>
              <el-button type="warning" size="small" plain @click="handleEditFieldPermission(row)">
                {{ $t('formbusiness.workflowstep.editFieldPermission') }}
              </el-button>
              <el-button type="danger" size="small" @click="handleDeleteStep(row)">
                {{ $t('formbusiness.workflowstep.deleteStep') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 新增步骤弹窗 -->
    <el-dialog
      v-model="addStepDialogVisible"
      :title="isEditMode ? $t('common.edit') : $t('formbusiness.workflowstep.addStep')"
      width="970px"
      :close-on-click-modal="false"
      :append-to-body="true"
      @closed="handleAddStepDialogClose"
      draggable
    >
      <div v-loading="addStepDialogLoading">
        <el-form
          ref="addStepFormRef"
          :model="addStepForm"
          :rules="addStepRules"
          :inline="true"
          label-width="120px"
          class="dialog-form add-step-form"
        >
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowstep.formGroupName')" prop="formGroupId">
              <el-select
                v-model="addStepForm.formGroupId"
                :placeholder="$t('formbusiness.workflowstep.pleaseSelectFormGroup')"
                filterable
                style="width: 100%"
                @change="onAddStepFormGroupChange"
              >
                <el-option
                  v-for="item in formGroupOptions"
                  :key="item.formGroupId"
                  :label="item.formGroupName"
                  :value="item.formGroupId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowstep.formTypeName')" prop="formTypeId">
              <el-select
                v-model="addStepForm.formTypeId"
                :placeholder="$t('formbusiness.workflowstep.pleaseSelectFormType')"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in dialogFormTypeOptions"
                  :key="item.formTypeId"
                  :label="item.formTypeName"
                  :value="item.formTypeId"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowstep.stepNameCn')" prop="stepNameCn">
              <el-input
                v-model="addStepForm.stepNameCn"
                :placeholder="$t('formbusiness.workflowstep.pleaseInputStepNameCn')"
                clearable
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowstep.stepNameEn')" prop="stepNameEn">
              <el-input
                v-model="addStepForm.stepNameEn"
                :placeholder="$t('formbusiness.workflowstep.pleaseInputStepNameEn')"
                clearable
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowstep.assignmentRule')" prop="assignmentCode">
              <el-select
                v-model="addStepForm.assignmentCode"
                :placeholder="$t('formbusiness.workflowstep.pleaseSelectAssignment')"
                filterable
                style="width: 100%"
                @change="onAssignmentChange"
              >
                <el-option
                  v-for="item in assignmentOptions"
                  :key="item.assignmentCode"
                  :label="item.assignmentName"
                  :value="item.assignmentCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowstep.reviewMode')" prop="reviewModeCode">
              <el-select
                v-model="addStepForm.reviewModeCode"
                :placeholder="$t('formbusiness.workflowstep.pleaseSelectReviewMode')"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in reviewModeOptions"
                  :key="item.reviewModeCode"
                  :label="item.reviewModeName"
                  :value="item.reviewModeCode"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowstep.isStartStep')" prop="isStartStep">
              <el-radio-group v-model="addStepForm.isStartStep">
                <el-radio :value="1">{{ $t('common.yes') }}</el-radio>
                <el-radio :value="0">{{ $t('common.no') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowstep.isReminderEnabled')" prop="isReminderEnabled">
              <el-radio-group v-model="addStepForm.isReminderEnabled">
                <el-radio :value="1">{{ $t('common.yes') }}</el-radio>
                <el-radio :value="0">{{ $t('common.no') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item :label="$t('formbusiness.workflowstep.reminderIntervalMinutes')" prop="reminderIntervalMinutes">
              <el-input-number
                v-model="addStepForm.reminderIntervalMinutes"
                :min="0"
                :max="9999"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowstep.sortOrder')" prop="sortOrder">
              <el-input-number
                v-model="addStepForm.sortOrder"
                :min="0"
                :max="9999"
                style="width: 200px"
              />
            </el-form-item>
          </div>
          <el-divider class="assignment-divider" />
          <!-- 根据 Assignment 显示对应配置 item（仅非发起步骤时展示） -->
          <div v-show="addStepForm.isStartStep === 0 && addStepForm.assignmentCode === 'Org'" class="form-row assignment-block">
            <el-form-item :label="$t('formbusiness.workflowstep.departmentLevel')" prop="stepOrgUpsert.deptLeaveId">
              <el-select
                v-model="addStepForm.stepOrgUpsert.deptLeaveId"
                :placeholder="$t('formbusiness.workflowstep.pleaseSelectDepartmentLevel')"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in departmentLevelOptions"
                  :key="item.departmentLevelId"
                  :label="item.departmentLevelName"
                  :value="item.departmentLevelId"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowstep.position')" prop="stepOrgUpsert.positionId">
              <el-select
                v-model="addStepForm.stepOrgUpsert.positionId"
                :placeholder="$t('formbusiness.workflowstep.pleaseSelectPosition')"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in userPositionOptions"
                  :key="item.positionId"
                  :label="item.positionName"
                  :value="item.positionId"
                />
              </el-select>
            </el-form-item>
          </div>
          <div v-show="addStepForm.isStartStep === 0 && addStepForm.assignmentCode === 'DeptUser'" class="form-row assignment-block">
            <el-form-item :label="$t('formbusiness.workflowstep.department')" prop="stepDeptUserUpsert.departmentId">
              <el-tree-select
                v-model="addStepForm.stepDeptUserUpsert.departmentId"
                :data="departmentTreeOptions || []"
                :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                check-strictly
                filterable
                :filter-node-method="filterDeptTreeNode"
                style="width: 100%"
                popper-class="workflowstep-dept-tree-popper"
                :placeholder="$t('formbusiness.workflowstep.pleaseSelectDepartment')"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowstep.position')" prop="stepDeptUserUpsert.positionId">
              <el-select
                v-model="addStepForm.stepDeptUserUpsert.positionId"
                :placeholder="$t('formbusiness.workflowstep.pleaseSelectPosition')"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in userPositionOptions"
                  :key="item.positionId"
                  :label="item.positionName"
                  :value="item.positionId"
                />
              </el-select>
            </el-form-item>
          </div>
          <div v-show="addStepForm.isStartStep === 0 && addStepForm.assignmentCode === 'User'" class="user-filter-left">
            <div class="user-filter-left-item">
              <label class="user-filter-left-label">{{ $t('formbusiness.workflowstep.department') }}</label>
              <el-tree-select
                v-model="addStepForm.stepUserUpsert.departmentId"
                :data="departmentTreeOptions || []"
                :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                check-strictly
                filterable
                :filter-node-method="filterDeptTreeNode"
                popper-class="workflowstep-dept-tree-popper"
                :placeholder="$t('formbusiness.workflowstep.pleaseSelectDepartment')"
                style="width: 200px"
                @change="handleSearchUser"
              />
            </div>
            <div class="user-filter-left-item">
              <label class="user-filter-left-label">{{ $t('formbusiness.workflowstep.userNo') }}</label>
              <el-input
                v-model="userSearchForm.userNo"
                clearable
                :placeholder="$t('formbusiness.workflowstep.userNo')"
                style="width: 150px"
                @change="handleSearchUser"
              />
            </div>
            <div class="user-filter-left-item">
              <label class="user-filter-left-label">{{ $t('formbusiness.workflowstep.userName') }}</label>
              <el-input
                v-model="userSearchForm.userName"
                clearable
                :placeholder="$t('formbusiness.workflowstep.userName')"
                style="width: 180px"
                @change="handleSearchUser"
              />
            </div>
            <div class="user-filter-left-item user-filter-left-btn">
              <el-button type="primary" @click="handleSearchUser">{{ $t('formbusiness.workflowstep.searchUser') }}</el-button>
            </div>
          </div>
          <div v-show="addStepForm.isStartStep === 0 && addStepForm.assignmentCode === 'User'" class="user-table-wrap">
            <div class="user-table-scroll">
              <el-table
                ref="userTableRef"
                :data="userTableData"
                v-loading="userTableLoading"
                :row-key="(row) => row.userId"
                @selection-change="handleUserTableSelectionChange"
                height="150"
                border
                class="user-select-table"
              >
                  <el-table-column type="selection" width="48" :reserve-selection="false" />
                  <el-table-column prop="userNo" :label="$t('formbusiness.workflowstep.userNo')" min-width="100" />
                  <el-table-column prop="userName" :label="$t('formbusiness.workflowstep.userName')" min-width="150" />
                  <el-table-column prop="departmentName" :label="$t('formbusiness.workflowstep.userTableDepartment')" min-width="130" />
                  <el-table-column prop="positionName" :label="$t('formbusiness.workflowstep.userTablePosition')" min-width="82" />
                  <el-table-column prop="laborName" :label="$t('formbusiness.workflowstep.userTableLabor')" min-width="180" />
                  <el-table-column prop="nationalityName" :label="$t('formbusiness.workflowstep.userTableNationality')" min-width="120" />
                </el-table>
            </div>
              <el-pagination
                v-model:current-page="userPageIndex"
                v-model:page-size="userPageSize"
                :page-sizes="[10, 20, 50]"
                :total="userTableTotal"
                layout="total, sizes, prev, pager, next"
                size="small"
                class="user-table-pagination"
                @current-change="handleUserPageChange"
                @size-change="handleUserSizeChange"
              />
          </div>
          <div v-show="addStepForm.isStartStep === 0 && addStepForm.assignmentCode === 'Custom'" class="form-row assignment-block">
            <el-form-item :label="$t('formbusiness.workflowstep.handlerKey')" prop="stepCustomUpsert.handlerKey">
              <el-input
                v-model="addStepForm.stepCustomUpsert.handlerKey"
                clearable
                :placeholder="$t('formbusiness.workflowstep.handlerKey')"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item :label="$t('formbusiness.workflowstep.logicalExplanation')" prop="stepCustomUpsert.logicalExplanation">
              <el-input
                v-model="addStepForm.stepCustomUpsert.logicalExplanation"
                type="textarea"
                :rows="2"
                clearable
                :placeholder="$t('formbusiness.workflowstep.logicalExplanation')"
                style="width: 100%"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addStepDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" :loading="addStepSubmitting" @click="submitAddStep">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑栏位权限弹窗 -->
    <el-dialog
      v-model="fieldPermissionDialogVisible"
      :title="$t('formbusiness.workflowstep.fieldPermissionTitle')"
      width="600px"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="handleFieldPermissionDialogClose"
      draggable
    >
      <div v-loading="stepFieldPermissionLoading">
        <div class="field-permission-toolbar">
          <span class="field-permission-toolbar-label">{{ $t('formbusiness.workflowstep.fieldPermissionIsVisible') }}：</span>
          <el-button size="small" @click="toggleAllPermission('isVisible', 1)">{{ $t('common.selectAll') }}</el-button>
          <el-button size="small" @click="toggleAllPermission('isVisible', 0)">{{ $t('common.deselectAll') }}</el-button>
          <el-divider direction="vertical" />
          <span class="field-permission-toolbar-label">{{ $t('formbusiness.workflowstep.fieldPermissionIsDisabled') }}：</span>
          <el-button size="small" @click="toggleAllPermission('isDisabled', 1)">{{ $t('common.selectAll') }}</el-button>
          <el-button size="small" @click="toggleAllPermission('isDisabled', 0)">{{ $t('common.deselectAll') }}</el-button>
        </div>
        <el-table
          :data="stepFieldPermissionList"
          border
          size="small"
          max-height="430"
          class="step-field-permission-table"
          :header-cell-style="{ background: '#f5f7fa' }"
          :empty-text="$t('formbusiness.workflowstep.fieldPermissionEmpty')"
        >
          <el-table-column
            prop="fieldName"
            :label="$t('formbusiness.workflowstep.fieldPermissionFieldName')"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            :label="$t('formbusiness.workflowstep.fieldPermissionIsVisible')"
            width="110"
            align="center"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.isVisible"
                :active-value="1"
                :inactive-value="0"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399;"
              />
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('formbusiness.workflowstep.fieldPermissionIsDisabled')"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.isDisabled"
                :active-value="1"
                :inactive-value="0"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399;"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="fieldPermissionDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" :loading="fieldPermissionSubmitting" @click="submitFieldPermission">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
  <script setup>
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { post } from '@/utils/request'
import { 
  GET_FORMGROUP_DROPDOWN_API
} from '@/config/api/formbusiness/form-operate/applyform.js'
import { 
  GET_FORMTYPE_DROPDOWN_API,
  GET_WORKFLOWSTEP_LIST_API,
  INSERT_WORKFLOWSTEP_API,
  GET_ASSIGNMENT_DROPDOWN_API,
  GET_REVIEW_MODE_DROPDOWN_API,
  GET_DEPARTMENT_LEVEL_DROPDOWN_API,
  GET_USER_POSITION_DROPDOWN_API,
  GET_DEPARTMENT_DROPDOWN_API,
  GET_USER_INFO_PAGE_API,
  DELETE_WORKFLOWSTEP_API,
  GET_WORKFLOWSTEP_ENTITY_API,
  UPDATE_WORKFLOWSTEP_API,
  GET_STEP_FIELD_PERMISSION_LIST_API,
  UPDATE_STEP_FIELD_PERMISSION_API
} from '@/config/api/formbusiness/form-workflow/workflowstep.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const FORM_URLENCODED_CONFIG = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
}

const showMessage = (message, type = 'error') => {
  ElMessage({
    message,
    type,
    plain: true,
    showClose: true
  })
}

const buildFormParams = (params) => {
  const formParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    formParams.append(key, value ?? '')
  })
  return formParams
}

const createEmptyOrgUpsert = () => ({ deptLeaveId: '', positionId: '' })
const createEmptyDeptUserUpsert = () => ({ departmentId: '', positionId: '' })
const createEmptyUserUpsert = () => ({ userId: '', departmentId: '' })
const createEmptyCustomUpsert = () => ({ handlerKey: '', logicalExplanation: '' })

// 响应式数据
const loading = ref(false)
const workflowStepList = ref([])
const formGroupOptions = ref([])
const formTypeOptions = ref([])

// 搜索表单
const searchForm = reactive({
  formGroupId: '',
  formTypeId: ''
})

// 新增 / 编辑 步骤弹窗
const addStepDialogVisible = ref(false)
const addStepDialogLoading = ref(false)
const addStepSubmitting = ref(false)
const isEditMode = ref(false)
const currentStepId = ref('')
const addStepFormRef = ref(null)
const dialogFormTypeOptions = ref([])
const assignmentOptions = ref([])
const reviewModeOptions = ref([])
const departmentLevelOptions = ref([])
const userPositionOptions = ref([])
const departmentTreeOptions = ref([])
// User 区块：用户搜索（不算入 item）与表格
const userSearchForm = reactive({ userNo: '', userName: '' })
const userTableRef = ref(null)
const userTableData = ref([])
const userTableTotal = ref(0)
const userTableLoading = ref(false)
const userPageIndex = ref(1)
const userPageSize = ref(10)
const isAdjustingUserSelection = ref(false)
// 编辑栏位权限：独立弹窗的列表、加载、提交状态
const fieldPermissionDialogVisible = ref(false)
const stepFieldPermissionList = ref([])
const stepFieldPermissionLoading = ref(false)
const fieldPermissionSubmitting = ref(false)
const fieldPermissionStepId = ref('')
const fieldPermissionFormTypeId = ref('')
const addStepForm = reactive({
  formGroupId: '',
  formTypeId: '',
  stepNameCn: '',
  stepNameEn: '',
  assignmentCode: '',
  reviewModeCode: '',
  isReminderEnabled: 0,
  reminderIntervalMinutes: 0,
  sortOrder: 0,
  description: '',
  isStartStep: 0,
  stepOrgUpsert: createEmptyOrgUpsert(),
  stepDeptUserUpsert: createEmptyDeptUserUpsert(),
  stepUserUpsert: createEmptyUserUpsert(),
  stepCustomUpsert: createEmptyCustomUpsert()
})
const addStepRules = {
  formGroupId: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseSelectFormGroup'), trigger: 'change' }],
  formTypeId: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseSelectFormType'), trigger: 'change' }],
  stepNameCn: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseInputStepNameCn'), trigger: 'blur' }],
  stepNameEn: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseInputStepNameEn'), trigger: 'blur' }],
  assignmentCode: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseSelectAssignment'), trigger: 'change' }],
  reviewModeCode: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseSelectReviewMode'), trigger: 'change' }],
  isStartStep: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseSelectIsStartStep'), trigger: 'change' }],
  isReminderEnabled: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseSelectIsReminderEnabled'), trigger: 'change' }],
  reminderIntervalMinutes: [
    { required: true, message: () => t('formbusiness.workflowstep.pleaseInputReminderInterval'), trigger: 'blur' },
    { type: 'number', min: 0, max: 9999, message: () => t('formbusiness.workflowstep.reminderIntervalRange'), trigger: 'blur' }
  ]
}

const resetStepAssignmentUpserts = () => {
  addStepForm.stepOrgUpsert = createEmptyOrgUpsert()
  addStepForm.stepDeptUserUpsert = createEmptyDeptUserUpsert()
  addStepForm.stepUserUpsert = createEmptyUserUpsert()
  addStepForm.stepCustomUpsert = createEmptyCustomUpsert()
}

const resetUserPickerState = () => {
  userSearchForm.userNo = ''
  userSearchForm.userName = ''
  userTableData.value = []
  userTableTotal.value = 0
  userPageIndex.value = 1
  userPageSize.value = 10
}

const loadAssignmentRelatedOptions = async (assignmentCode) => {
  if (assignmentCode === 'Org') {
    await Promise.all([loadDepartmentLevelOptions(), loadUserPositionOptions()])
    return
  }
  if (assignmentCode === 'DeptUser') {
    await Promise.all([loadDepartmentTreeOptions(), loadUserPositionOptions()])
    return
  }
  if (assignmentCode === 'User') {
    await loadDepartmentTreeOptions()
  }
}

const fetchFormTypeDropdown = async (formGroupId) => {
  const response = await post(
    GET_FORMTYPE_DROPDOWN_API,
    buildFormParams({ formGroupId }),
    FORM_URLENCODED_CONFIG
  )

  return response.code === 200 ? (response.data || []) : []
}

const resetAddStepDialogState = () => {
  addStepForm.formGroupId = ''
  addStepForm.formTypeId = ''
  addStepForm.stepNameCn = ''
  addStepForm.stepNameEn = ''
  addStepForm.assignmentCode = ''
  addStepForm.reviewModeCode = ''
  addStepForm.isStartStep = 0
  addStepForm.isReminderEnabled = 0
  addStepForm.reminderIntervalMinutes = 0
  addStepForm.sortOrder = 0
  addStepForm.description = ''
  resetStepAssignmentUpserts()
  resetUserPickerState()
  dialogFormTypeOptions.value = []
  departmentLevelOptions.value = []
  userPositionOptions.value = []
  departmentTreeOptions.value = []
}
  
/**
 * 获取表单组别下拉选项
 */
const getFormGroupOptions = async () => {
  try {
    const response = await post(GET_FORMGROUP_DROPDOWN_API, {})
    if (response.code === 200) {
      formGroupOptions.value = response.data || []
      if (formGroupOptions.value.length > 0 && !searchForm.formGroupId) {
        searchForm.formGroupId = formGroupOptions.value[0].formGroupId
        await getFormTypeOptions(searchForm.formGroupId)
      }
    } else {
      showMessage(response.message)
    }
  } catch (error) {
    showMessage(t('formbusiness.workflowstep.getFormGroupFailed'))
  }
}

/**
 * 获取表单类别下拉选项；不论是否有数据，最终都会调用 getWorkflowStepList 走一遍 loading 流程
 */
const getFormTypeOptions = async (formGroupId) => {
  if (!formGroupId) {
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    await getWorkflowStepList()
    return
  }
  try {
    const response = await post(
      GET_FORMTYPE_DROPDOWN_API,
      buildFormParams({ formGroupId }),
      FORM_URLENCODED_CONFIG
    )
    if (response.code === 200) {
      formTypeOptions.value = response.data || []
      searchForm.formTypeId = formTypeOptions.value.length > 0
        ? formTypeOptions.value[0].formTypeId
        : ''
    } else {
      showMessage(response.message)
      formTypeOptions.value = []
      searchForm.formTypeId = ''
    }
  } catch (error) {
    showMessage(t('formbusiness.workflowstep.getFormTypeFailed'))
    formTypeOptions.value = []
    searchForm.formTypeId = ''
  }
  await getWorkflowStepList()
}

// 最小 loading 显示时间，避免接口太快导致动画一闪而过
const MIN_LOADING_DURATION = 300

/**
 * 获取流程步骤列表；formTypeId 为空时也走一遍 loading 流程并清空表格
 */
const getWorkflowStepList = async () => {
  loading.value = true
  const loadingStart = Date.now()
  try {
    if (!searchForm.formTypeId) {
      workflowStepList.value = []
      return
    }
    const formData = new FormData()
    formData.append('formTypeId', String(searchForm.formTypeId))
    const response = await post(GET_WORKFLOWSTEP_LIST_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      skipDedupe: true
    })
    if (response.code === 200) {
      workflowStepList.value = response.data || []
    } else {
      showMessage(response.message)
      workflowStepList.value = []
    }
  } catch (error) {
    showMessage(t('formbusiness.workflowstep.getFailed'))
    workflowStepList.value = []
  } finally {
    const elapsed = Date.now() - loadingStart
    if (elapsed < MIN_LOADING_DURATION) {
      await new Promise(resolve => setTimeout(resolve, MIN_LOADING_DURATION - elapsed))
    }
    loading.value = false
  }
}

/**
 * 表单分组改变：立即联动表单类别下拉，由 getWorkflowStepList 内部触发表格加载动画
 */
const handleFormGroupChange = (val) => {
  getFormTypeOptions(val)
}

/**
 * 表单类别改变：直接刷新表格
 */
const handleFormTypeChange = () => {
  getWorkflowStepList()
}

/**
 * 打开编辑栏位权限弹窗：使用行内 formTypeId（不显示该列）+ stepId 拉取权限
 */
const handleEditFieldPermission = async (step) => {
  fieldPermissionStepId.value = step.stepId
  fieldPermissionFormTypeId.value = step.formTypeId || searchForm.formTypeId || ''
  stepFieldPermissionList.value = []
  fieldPermissionDialogVisible.value = true
  await loadStepFieldPermissions(fieldPermissionFormTypeId.value, fieldPermissionStepId.value)
}

/**
 * 加载步骤栏位权限列表（GetStepFieldPermissionList，参数 formTypeId、stepId）
 */
const loadStepFieldPermissions = async (formTypeId, stepId) => {
  if (!formTypeId || !stepId) {
    stepFieldPermissionList.value = []
    return
  }
  stepFieldPermissionLoading.value = true
  try {
    const response = await post(
      GET_STEP_FIELD_PERMISSION_LIST_API,
      buildFormParams({ formTypeId, stepId }),
      FORM_URLENCODED_CONFIG
    )
    if (response.code === 200) {
      stepFieldPermissionList.value = (response.data || []).map((item) => ({
        stepId: item.stepId ?? stepId,
        fieldId: item.fieldId,
        fieldName: item.fieldName,
        isVisible: Number(item.isVisible) === 1 ? 1 : 0,
        isDisabled: Number(item.isDisabled) === 1 ? 1 : 0
      }))
    } else {
      stepFieldPermissionList.value = []
      showMessage(response.message || t('formbusiness.workflowstep.getFieldPermissionFailed'))
    }
  } catch {
    stepFieldPermissionList.value = []
    showMessage(t('formbusiness.workflowstep.getFieldPermissionFailed'))
  } finally {
    stepFieldPermissionLoading.value = false
  }
}

/**
 * 全选 / 全不选：将所有行的指定字段（isVisible / isDisabled）统一设为 value
 */
const toggleAllPermission = (field, value) => {
  stepFieldPermissionList.value.forEach((row) => {
    row[field] = value
  })
}

/**
 * 提交步骤栏位权限（UpdateStepFieldPermission，参数为权限对象数组）
 */
const submitFieldPermission = async () => {
  if (!stepFieldPermissionList.value.length) {
    fieldPermissionDialogVisible.value = false
    return
  }
  fieldPermissionSubmitting.value = true
  try {
    const payload = stepFieldPermissionList.value.map((row) => ({
      stepId: row.stepId || fieldPermissionStepId.value,
      fieldId: row.fieldId,
      isVisible: row.isVisible,
      isDisabled: row.isDisabled
    }))
    const response = await post(UPDATE_STEP_FIELD_PERMISSION_API, payload)
    if (response.code === 200) {
      showMessage(t('formbusiness.workflowstep.updateFieldPermissionSuccess'), 'success')
      fieldPermissionDialogVisible.value = false
    } else {
      showMessage(response.message || t('formbusiness.workflowstep.updateFieldPermissionFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowstep.updateFieldPermissionFailed'))
  } finally {
    fieldPermissionSubmitting.value = false
  }
}

/**
 * 关闭栏位权限弹窗：清空列表
 */
const handleFieldPermissionDialogClose = () => {
  stepFieldPermissionList.value = []
  fieldPermissionStepId.value = ''
  fieldPermissionFormTypeId.value = ''
}

/**
 * 编辑步骤：打开弹窗并通过 GetWorkflowStepEntity 拉取实体回填
 */
const handleEditStep = async (step) => {
  isEditMode.value = true
  currentStepId.value = step.stepId
  addStepDialogVisible.value = true
  addStepDialogLoading.value = true

  const formGroupId = searchForm.formGroupId || ''

  try {
    const [, , entityRes, formTypes] = await Promise.all([
      loadAssignmentOptions(),
      loadReviewModeOptions(),
      post(GET_WORKFLOWSTEP_ENTITY_API, buildFormParams({ stepId: step.stepId }), FORM_URLENCODED_CONFIG),
      formGroupId ? fetchFormTypeDropdown(formGroupId) : Promise.resolve([])
    ])

    if (entityRes && entityRes.code === 200 && entityRes.data) {
      const data = entityRes.data

      addStepForm.formGroupId = formGroupId
      dialogFormTypeOptions.value = formTypes
      addStepForm.formTypeId = data.formTypeId || ''
      addStepForm.stepNameCn = data.stepNameCn || ''
      addStepForm.stepNameEn = data.stepNameEn || ''
      addStepForm.isStartStep = Number(data.isStartStep ?? 0)
      const assignmentCode = data.assignment || step.assignment || ''
      addStepForm.assignmentCode = assignmentCode
      addStepForm.reviewModeCode = data.reviewMode ?? data.approveMode ?? ''
      addStepForm.isReminderEnabled = Number(data.isReminderEnabled ?? 0)
      addStepForm.reminderIntervalMinutes = data.reminderIntervalMinutes ?? 0
      addStepForm.sortOrder = data.sortOrder ?? 0

      resetStepAssignmentUpserts()

      if (assignmentCode === 'Org' && data.workflowStepOrgDto) {
        const dto = data.workflowStepOrgDto
        addStepForm.stepOrgUpsert.deptLeaveId = dto.deptLeaveId || ''
        addStepForm.stepOrgUpsert.positionId = dto.positionId || ''
      } else if (assignmentCode === 'DeptUser' && data.workflowStepDeptUserDto) {
        const dto = data.workflowStepDeptUserDto
        addStepForm.stepDeptUserUpsert.departmentId = dto.departmentId || ''
        addStepForm.stepDeptUserUpsert.positionId = dto.positionId || ''
      } else if (assignmentCode === 'User' && data.workflowStepUserDto) {
        const dto = data.workflowStepUserDto
        addStepForm.stepUserUpsert.departmentId = dto.departmentId || ''
        addStepForm.stepUserUpsert.userId = dto.userId || ''
      } else if (assignmentCode === 'Custom' && data.workflowStepCustomDto) {
        const dto = data.workflowStepCustomDto
        addStepForm.stepCustomUpsert.handlerKey = dto.handlerKey || ''
        addStepForm.stepCustomUpsert.logicalExplanation = dto.logicalExplanation || ''
      }

      await loadAssignmentRelatedOptions(assignmentCode)

      if (assignmentCode === 'User' && addStepForm.stepUserUpsert.departmentId) {
        await loadUserInfoPage()
      }
    } else {
      showMessage(entityRes?.message || t('formbusiness.workflowstep.getFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowstep.getFailed'))
  } finally {
    addStepDialogLoading.value = false
  }
}

/**
 * 删除流程步骤（DeleteWorkflowStep，请求参数 FromForm string stepId）
 */
const deleteStepLoading = ref(false)
const handleDeleteStep = async (step) => {
  try {
    await ElMessageBox.confirm(
      t('formbusiness.workflowstep.deleteStepConfirm'),
      t('common.tip'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  deleteStepLoading.value = true
  try {
    const response = await post(
      DELETE_WORKFLOWSTEP_API,
      buildFormParams({ stepId: step.stepId }),
      FORM_URLENCODED_CONFIG
    )
    if (response.code === 200) {
      showMessage(t('formbusiness.workflowstep.deleteStepSuccess'), 'success')
      await getWorkflowStepList()
    } else {
      showMessage(response.message || t('formbusiness.workflowstep.deleteStepFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowstep.deleteStepFailed'))
  } finally {
    deleteStepLoading.value = false
  }
}

/**
 * 根据 Assignment 字段返回 Tag 类型：Org=primary, DeptUser=warning, User=danger
 */
const getAssignmentTagType = (assignment) => {
  const map = {
    Org: 'primary',
    DeptUser: 'warning',
    User: 'danger'
  }
  return map[assignment] || ''
}

/**
 * Assignment 变更时：只显示当前选项对应区块，其余隐藏并清空
 */
const onAssignmentChange = (assignmentCode) => {
  resetStepAssignmentUpserts()
  if (assignmentCode === 'Org') {
    loadDepartmentLevelOptions()
    loadUserPositionOptions()
  } else if (assignmentCode === 'DeptUser') {
    loadDepartmentTreeOptions()
    loadUserPositionOptions()
  } else if (assignmentCode === 'User') {
    loadDepartmentTreeOptions()
    resetUserPickerState()
  }
}

/**
 * 部门树节点过滤（el-tree-select filterable）
 */
const filterDeptTreeNode = (value, data) => {
  if (!value || !data || !data.departmentName) return true
  return data.departmentName.includes(value)
}

/**
 * 加载部门级别下拉（stepOrgUpsert.deptLeaveId），有数据时默认选中第一项（联动 Assignment=Org）
 */
const loadDepartmentLevelOptions = async () => {
  try {
    const response = await post(GET_DEPARTMENT_LEVEL_DROPDOWN_API, {})
    if (response.code === 200) {
      departmentLevelOptions.value = response.data || []
      if (addStepForm.assignmentCode === 'Org' && departmentLevelOptions.value.length > 0 && !addStepForm.stepOrgUpsert.deptLeaveId) {
        addStepForm.stepOrgUpsert.deptLeaveId = departmentLevelOptions.value[0].departmentLevelId
      }
    } else {
      departmentLevelOptions.value = []
    }
  } catch {
    departmentLevelOptions.value = []
  }
}

/**
 * 加载职级下拉（Org/DeptUser 共用），有数据时按当前 Assignment 默认选中第一项
 */
const loadUserPositionOptions = async () => {
  try {
    const response = await post(GET_USER_POSITION_DROPDOWN_API, {})
    if (response.code === 200) {
      userPositionOptions.value = response.data || []
      if (userPositionOptions.value.length > 0) {
        if (addStepForm.assignmentCode === 'Org') {
          if (!addStepForm.stepOrgUpsert.positionId) {
            addStepForm.stepOrgUpsert.positionId = userPositionOptions.value[0].positionId
          }
        } else if (addStepForm.assignmentCode === 'DeptUser') {
          if (!addStepForm.stepDeptUserUpsert.positionId) {
            addStepForm.stepDeptUserUpsert.positionId = userPositionOptions.value[0].positionId
          }
        }
      }
    } else {
      userPositionOptions.value = []
    }
  } catch {
    userPositionOptions.value = []
  }
}

/**
 * 加载部门树下拉（stepDeptUserUpsert.departmentId），接口 GetDepartmentDropDown，有数据时默认选中第一项（联动 Assignment=DeptUser）
 */
const loadDepartmentTreeOptions = async () => {
  try {
    const res = await post(GET_DEPARTMENT_DROPDOWN_API, {})
    if (res && res.code === 200) {
      const raw = Array.isArray(res.data) ? res.data : []
      const validateDepartment = (dept) => {
        if (!dept || dept.departmentId === undefined || dept.departmentId === null ||
            dept.departmentName === undefined || dept.departmentName === null) {
          return false
        }
        if (dept.departmentChildList && Array.isArray(dept.departmentChildList)) {
          dept.departmentChildList = dept.departmentChildList.filter(validateDepartment)
        }
        return true
      }
      departmentTreeOptions.value = raw.filter(validateDepartment)
      if (departmentTreeOptions.value.length > 0) {
        const firstEnabled = departmentTreeOptions.value.find(item => !item.disabled)
        if (firstEnabled) {
          if (addStepForm.assignmentCode === 'DeptUser' && !addStepForm.stepDeptUserUpsert.departmentId) {
            addStepForm.stepDeptUserUpsert.departmentId = firstEnabled.departmentId
          } else if (addStepForm.assignmentCode === 'User' && !addStepForm.stepUserUpsert.departmentId) {
            addStepForm.stepUserUpsert.departmentId = firstEnabled.departmentId
          }
        }
      }
    } else {
      departmentTreeOptions.value = []
    }
  } catch {
    departmentTreeOptions.value = []
  }
}

/**
 * 加载用户分页列表（GetUserInfoPage），仅用于 User 区块表格
 */
const loadUserInfoPage = async () => {
  userTableLoading.value = true
  try {
    const res = await post(GET_USER_INFO_PAGE_API, {
      departmentId: addStepForm.stepUserUpsert.departmentId || '',
      userNo: userSearchForm.userNo || '',
      userName: userSearchForm.userName || '',
      pageIndex: String(userPageIndex.value),
      pageSize: String(userPageSize.value),
      totalCount: '0'
    })
    if (res && res.code === 200) {
      userTableData.value = Array.isArray(res.data) ? res.data : []
      userTableTotal.value = Number(res.totalCount) || 0
    } else {
      userTableData.value = []
      userTableTotal.value = 0
    }
  } catch {
    userTableData.value = []
    userTableTotal.value = 0
  } finally {
    userTableLoading.value = false
  }
}

/**
 * User 区块：查询用户
 */
const handleSearchUser = () => {
  userPageIndex.value = 1
  loadUserInfoPage()
}

/**
 * User 区块：监听部门选择变化，自动触发查询
 */
watch(
  () => addStepForm.stepUserUpsert.departmentId,
  (val) => {
    if (addStepForm.assignmentCode === 'User' && addStepForm.isStartStep === 0 && val) {
      userPageIndex.value = 1
      loadUserInfoPage()
    }
  }
)

/**
 * User 区块：表格单选（首列勾选），只保留最后勾选的一行，写入 stepUserUpsert.userId
 */
function handleUserTableSelectionChange(selection) {
  if (isAdjustingUserSelection.value) return
  if (selection.length === 0) {
    addStepForm.stepUserUpsert.userId = ''
    return
  }
  const lastRow = selection[selection.length - 1]
  addStepForm.stepUserUpsert.userId = lastRow.userId
  isAdjustingUserSelection.value = true
  nextTick(() => {
    userTableRef.value?.clearSelection()
    userTableRef.value?.toggleRowSelection(lastRow, true)
    isAdjustingUserSelection.value = false
  })
}

/**
 * User 区块：分页变更
 */
const handleUserPageChange = (page) => {
  userPageIndex.value = page
  loadUserInfoPage()
}

const handleUserSizeChange = (size) => {
  userPageSize.value = size
  userPageIndex.value = 1
  loadUserInfoPage()
}

/**
 * 打开新增步骤弹窗
 */
const openAddStepDialog = async () => {
  isEditMode.value = false
  currentStepId.value = ''
  addStepDialogVisible.value = true
  addStepDialogLoading.value = true
  resetAddStepDialogState()
  addStepFormRef.value?.resetFields()

  const formGroupId = formGroupOptions.value.length > 0 ? formGroupOptions.value[0].formGroupId : ''

  try {
    const [, , formTypes] = await Promise.all([
      loadAssignmentOptions(),
      loadReviewModeOptions(),
      formGroupId ? fetchFormTypeDropdown(formGroupId) : Promise.resolve([])
    ])

    if (assignmentOptions.value.length > 0) {
      addStepForm.assignmentCode = assignmentOptions.value[0].assignmentCode
    }
    if (reviewModeOptions.value.length > 0) {
      addStepForm.reviewModeCode = reviewModeOptions.value[0].reviewModeCode
    }
    if (formGroupId) {
      addStepForm.formGroupId = formGroupId
      dialogFormTypeOptions.value = formTypes
      if (dialogFormTypeOptions.value.length > 0) {
        addStepForm.formTypeId = dialogFormTypeOptions.value[0].formTypeId
      }
      await loadAssignmentRelatedOptions(addStepForm.assignmentCode)
    }
  } finally {
    addStepDialogLoading.value = false
  }
}

/**
 * 加载步骤指派规则下拉
 */
const loadAssignmentOptions = async () => {
  try {
    const response = await post(GET_ASSIGNMENT_DROPDOWN_API, {})
    if (response.code === 200) {
      assignmentOptions.value = response.data || []
    } else {
      assignmentOptions.value = []
    }
  } catch {
    assignmentOptions.value = []
  }
}

/**
 * 加载审核方式下拉
 */
const loadReviewModeOptions = async () => {
  try {
    const response = await post(GET_REVIEW_MODE_DROPDOWN_API, {})
    if (response.code === 200) {
      const raw = response.data || []
      reviewModeOptions.value = raw.map((item) => ({
        reviewModeCode: item.reviewModeCode ?? item.approveModeCode,
        reviewModeName: item.reviewModeName ?? item.approveModeName
      }))
    } else {
      reviewModeOptions.value = []
    }
  } catch {
    reviewModeOptions.value = []
  }
}

/**
 * 弹窗内表单组别变更时加载表单类别
 */
const onAddStepFormGroupChange = async (formGroupId) => {
  addStepForm.formTypeId = ''
  dialogFormTypeOptions.value = []
  if (formGroupId) {
    await loadDialogFormTypeOptions(formGroupId)
  }
}

/**
 * 仅加载弹窗用的表单类别下拉（不影响页面筛选）
 */
const loadDialogFormTypeOptions = async (formGroupId) => {
  if (!formGroupId) return
  addStepDialogLoading.value = true
  try {
    dialogFormTypeOptions.value = await fetchFormTypeDropdown(formGroupId)
  } catch {
    dialogFormTypeOptions.value = []
  } finally {
    addStepDialogLoading.value = false
  }
}

/**
 * 新增步骤弹窗关闭
 */
const handleAddStepDialogClose = () => {
  addStepFormRef.value?.resetFields()
  dialogFormTypeOptions.value = []
}

/**
 * 提交新增步骤
 */
const submitAddStep = async () => {
  if (!addStepFormRef.value) return
  await addStepFormRef.value.validate(async (valid) => {
    if (!valid) return
    addStepSubmitting.value = true
    try {
      const payload = {
        stepId: isEditMode.value ? currentStepId.value : '',
        formGroupId: addStepForm.formGroupId,
        formTypeId: addStepForm.formTypeId,
        stepNameCn: addStepForm.stepNameCn,
        stepNameEn: addStepForm.stepNameEn,
        isStartStep: addStepForm.isStartStep,
        assignment: addStepForm.assignmentCode,
        reviewMode: addStepForm.reviewModeCode,
        isReminderEnabled: addStepForm.isReminderEnabled,
        reminderIntervalMinutes: addStepForm.reminderIntervalMinutes,
        sortOrder: addStepForm.sortOrder,
        stepOrgUpsert: { ...addStepForm.stepOrgUpsert },
        stepDeptUserUpsert: { ...addStepForm.stepDeptUserUpsert },
        stepUserUpsert: { ...addStepForm.stepUserUpsert },
        stepCustomUpsert: { ...addStepForm.stepCustomUpsert }
      }
      const response = await post(
        isEditMode.value ? UPDATE_WORKFLOWSTEP_API : INSERT_WORKFLOWSTEP_API,
        payload
      )
      if (response.code === 200) {
        showMessage(
          response.message || (isEditMode.value ? t('formbusiness.workflowstep.editStepSuccess') : t('formbusiness.workflowstep.addStepSuccess')),
          'success'
        )
        addStepDialogVisible.value = false
        if (searchForm.formTypeId === addStepForm.formTypeId) {
          await getWorkflowStepList()
        }
      } else {
        showMessage(response.message)
      }
    } catch {
      showMessage(response.message)
    } finally {
      addStepSubmitting.value = false
    }
  })
}

// 组件挂载时获取数据
onMounted(async () => {
  await getFormGroupOptions()
})
  </script>
  
  <style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.add-step-form .assignment-divider {
  margin: 16px 0;
}

/* 栏位权限弹窗：全选/全不选工具栏 */
.field-permission-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.field-permission-toolbar-label {
  font-size: 13px;
  color: var(--el-text-color-regular);
}
.step-field-permission-table {
  width: 100%;
}

/* User 筛选：靠左、文本与控件间距正常、宽度稍宽，与左右留距 */
.user-filter-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  width: 100%;
  justify-content: flex-start;
  padding-left: 24px;
  padding-right: 24px;
  box-sizing: border-box;
}
.user-filter-left-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.user-filter-left-label {
  flex-shrink: 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 32px;
}

.user-filter-left-btn {
  flex-shrink: 0;
}
.user-filter-left-item :deep(.el-tree-select),
.user-filter-left-item :deep(.el-input) {
  width: 100%;
}

.user-table-wrap {
  width: 100%;
  margin-left: 0;
  margin-top: 12px;
  padding-left: 24px;
  padding-right: 24px;
  box-sizing: border-box;
}
.user-table-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
.user-select-table {
  min-width: 900px;
}
.user-table-scroll :deep(.el-table) {
  width: max-content !important;
  min-width: 100%;
  max-width: none;
  box-sizing: border-box;
}
.user-table-wrap :deep(.el-scrollbar__wrap) {
  overflow-y: auto;
}
.user-table-pagination {
  margin-top: 12px;
  justify-content: flex-end;
}
</style>

<!-- 部门树下拉（Org/DeptUser/User）挂载到 body，需单独样式，参考 userinfo.vue -->
<style>
.workflowstep-dept-tree-popper {
  width: auto !important;
  min-width: 320px !important;
}
.workflowstep-dept-tree-popper .el-select-dropdown__wrap,
.workflowstep-dept-tree-popper .el-scrollbar__view,
.workflowstep-dept-tree-popper .el-tree {
  width: 100% !important;
  min-width: 100% !important;
}
.workflowstep-dept-tree-popper .el-tree-node__content {
  height: 36px;
  line-height: 36px;
  padding-left: 12px;
  width: 100% !important;
  min-width: 100% !important;
}
</style>
  
  