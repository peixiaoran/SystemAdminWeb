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

      <!-- 时间线区域 -->
      <div class="timeline-wrapper" v-loading="loading">
        <el-timeline v-if="workflowStepList.length > 0">
          <el-timeline-item
            v-for="step in workflowStepList"
            :key="step.stepId"
            placement="top"
          >
            <div class="step-header">
              <span class="step-name">{{ step.stepName }}</span>
              <el-tag effect="dark" :type="getAssignmentTagType(step.assignment)">{{ step.assignmentName }}</el-tag>
              <div class="step-actions">
                <el-button type="primary" link size="small" @click="handleEditStep(step)">
                  {{ $t('formbusiness.workflowstep.editStep') }}
                </el-button>
                <el-button type="danger" link size="small" @click="handleDeleteStep(step)">
                  {{ $t('formbusiness.workflowstep.deleteStep') }}
                </el-button>
              </div>
            </div>
            <el-card class="step-card">
              <div class="card-header" v-if="step.description">
                <span class="step-desc">{{ step.description }}</span>
              </div>
              
              <!-- 分支列表 -->
              <div class="branch-section">
                <div class="branch-toolbar">
                  <el-button type="primary" link size="small" @click="handleAddBranch(step)">
                    {{ $t('formbusiness.workflowstep.addBranch') }}
                  </el-button>
                </div>
                <div class="branch-table" v-if="step.stepBranchList && step.stepBranchList.length > 0">
                  <div class="branch-row branch-row-header">
                    <div class="branch-cell">{{ $t('formbusiness.workflowstep.conditionName') }}</div>
                    <div class="branch-cell">{{ $t('formbusiness.workflowstep.nextStepName') }}</div>
                    <div class="branch-cell">{{ $t('formbusiness.workflowstep.executeMatched') }}</div>
                    <div class="branch-cell branch-cell-action">{{ $t('formbusiness.workflowstep.operation') }}</div>
                  </div>
                  <div 
                    v-for="(branch, bIndex) in step.stepBranchList" 
                    :key="resolveBranchRowKey(branch, step.stepId, bIndex)"
                    class="branch-row"
                  >
                    <div class="branch-cell">
                      {{ branch.conditionId === '0' || branch.conditionId === '-1' || branch.conditionId === -1 ? $t('formbusiness.workflowstep.defaultCondition') : (branch.conditionName || '-') }}
                    </div>
                    <div class="branch-cell">
                      {{ branch.nextStepName || $t('formbusiness.workflowstep.endStep') }}
                    </div>
                    <div class="branch-cell">
                      <el-tag :type="branch.executeMatched === 1 ? 'success' : 'info'" effect="dark" size="small">
                        {{ branch.executeMatched === 1 ? $t('common.yes') : $t('common.no') }}
                      </el-tag>
                    </div>
                    <div class="branch-cell branch-cell-action">
                      <el-button type="primary" link size="small" @click="handleEditBranch(branch)">
                        {{ $t('formbusiness.workflowstep.editBranch') }}
                      </el-button>
                      <el-button
                        type="danger"
                        link
                        size="small"
                        :loading="deletingBranchId === resolveBranchId(branch)"
                        @click="handleDeleteBranch(branch)"
                      >
                        {{ $t('formbusiness.workflowstep.deleteBranch') }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        
        <el-empty v-else-if="!loading" />
      </div>
    </el-card>

    <!-- 新增步骤弹窗 -->
    <el-dialog
      v-model="addStepDialogVisible"
      :title="$t('formbusiness.workflowstep.addStep')"
      width="970px"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="handleAddStepDialogClose"
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
            <el-form-item :label="$t('formbusiness.workflowstep.approveMode')" prop="approveModeCode">
              <el-select
                v-model="addStepForm.approveModeCode"
                :placeholder="$t('formbusiness.workflowstep.pleaseSelectApproveMode')"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in approveModeOptions"
                  :key="item.approveModeCode"
                  :label="item.approveModeName"
                  :value="item.approveModeCode"
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

    <!-- 分支新增 / 编辑弹窗 -->
    <el-dialog
      v-model="branchEditDialogVisible"
      :title="isBranchAddMode ? $t('formbusiness.workflowstep.addBranch') : $t('formbusiness.workflowstep.editBranch')"
      width="560px"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="handleBranchEditDialogClose"
      draggable
    >
      <div v-loading="branchEditDialogLoading">
        <el-form
          ref="branchEditFormRef"
          :model="branchEditForm"
          :rules="branchEditRules"
          label-width="120px"
        >
          <el-form-item :label="$t('formbusiness.workflowstep.conditionName')" prop="conditionId">
            <el-select
              v-model="branchEditForm.conditionId"
              :placeholder="$t('formbusiness.workflowstep.pleaseSelectCondition')"
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in branchConditionSelectOptions"
                :key="String(item.conditionId)"
                :label="item.conditionName"
                :value="String(item.conditionId)"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('formbusiness.workflowstep.nextStepName')" prop="nextStepId">
            <el-select
              v-model="branchEditForm.nextStepId"
              :placeholder="$t('formbusiness.workflowstep.pleaseSelectNextStep')"
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="item in branchStepSelectOptions"
                :key="String(item.stepId)"
                :label="item.stepName"
                :value="String(item.stepId)"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('formbusiness.workflowstep.executeMatched')">
            <el-radio-group v-model="branchEditForm.executeMatched">
              <el-radio :value="1">{{ $t('common.yes') }}</el-radio>
              <el-radio :value="0">{{ $t('common.no') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="branchEditDialogVisible = false">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" :loading="branchEditSubmitting" @click="submitBranchEdit">
            {{ $t('common.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
  <script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
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
  GET_APPROVE_MODE_DROPDOWN_API,
  GET_DEPARTMENT_LEVEL_DROPDOWN_API,
  GET_USER_POSITION_DROPDOWN_API,
  GET_DEPARTMENT_DROPDOWN_API,
  GET_USER_INFO_PAGE_API,
  DELETE_WORKFLOWSTEP_API,
  GET_WORKFLOWSTEP_ENTITY_API,
  UPDATE_WORKFLOWSTEP_API,
  GET_WORKFLOWSTEP_DROPDOWN_API,
  GET_CONDITION_DROPDOWN_API,
  GET_WORKFLOWSTEP_BRANCH_ENTITY_API,
  UPDATE_WORKFLOWSTEP_BRANCH_API,
  INSERT_WORKFLOWSTEP_BRANCH_API,
  DELETE_WORKFLOWSTEP_BRANCH_API
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
const archiveLevelOptions = ref([])
const approveModeOptions = ref([])
const departmentLevelOptions = ref([])
const userPositionOptions = ref([])
const departmentTreeOptions = ref([])
// User 区块：员工搜索（不算入 item）与表格
const userSearchForm = reactive({ userNo: '', userName: '' })
const userTableRef = ref(null)
const userTableData = ref([])
const userTableTotal = ref(0)
const userTableLoading = ref(false)
const userPageIndex = ref(1)
const userPageSize = ref(10)
const isAdjustingUserSelection = ref(false)
const addStepForm = reactive({
  formGroupId: '',
  formTypeId: '',
  stepNameCn: '',
  stepNameEn: '',
  assignmentCode: '',
  approveModeCode: '',
  isReminderEnabled: 0,
  reminderIntervalMinutes: 0,
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
  approveModeCode: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseSelectApproveMode'), trigger: 'change' }],
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
  addStepForm.approveModeCode = ''
  addStepForm.isStartStep = 0
  addStepForm.isReminderEnabled = 0
  addStepForm.reminderIntervalMinutes = 0
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
 * 获取表单类别下拉选项
 */
const getFormTypeOptions = async (formGroupId) => {
  if (!formGroupId) {
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    workflowStepList.value = []
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
      if (formTypeOptions.value.length > 0) {
        searchForm.formTypeId = formTypeOptions.value[0].formTypeId
        await getWorkflowStepList()
      } else {
        searchForm.formTypeId = ''
        workflowStepList.value = []
      }
    } else {
      showMessage(response.message)
      formTypeOptions.value = []
      searchForm.formTypeId = ''
      workflowStepList.value = []
    }
  } catch (error) {
    showMessage(t('formbusiness.workflowstep.getFormTypeFailed'))
    formTypeOptions.value = []
    searchForm.formTypeId = ''
    workflowStepList.value = []
  }
}

/**
 * 获取流程步骤列表
 */
const getWorkflowStepList = async () => {
  if (!searchForm.formTypeId) {
    workflowStepList.value = []
    return
  }
  loading.value = true
  try {
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
    loading.value = false
  }
}

/**
 * 表单分组改变事件
 */
const handleFormGroupChange = async (val) => {
  await getFormTypeOptions(val)
}

/**
 * 表单类别改变事件
 */
const handleFormTypeChange = async () => {
  await getWorkflowStepList()
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
      loadApproveModeOptions(),
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
      addStepForm.isStartStep = data.isStartStep ?? 0
      addStepForm.assignmentCode = data.assignment || ''
      addStepForm.approveModeCode = data.approveMode || ''
      addStepForm.isReminderEnabled = data.isReminderEnabled ?? 0
      addStepForm.reminderIntervalMinutes = data.reminderIntervalMinutes ?? 0

      resetStepAssignmentUpserts()

      if (data.assignment === 'Org' && data.workflowStepOrgDto) {
        const dto = data.workflowStepOrgDto
        addStepForm.stepOrgUpsert.deptLeaveId = dto.deptLeaveId || ''
        addStepForm.stepOrgUpsert.positionId = dto.positionId || ''
        await Promise.all([loadDepartmentLevelOptions(), loadUserPositionOptions()])
      } else if (data.assignment === 'DeptUser' && data.workflowStepDeptUserDto) {
        const dto = data.workflowStepDeptUserDto
        addStepForm.stepDeptUserUpsert.departmentId = dto.departmentId || ''
        addStepForm.stepDeptUserUpsert.positionId = dto.positionId || ''
        await Promise.all([loadDepartmentTreeOptions(), loadUserPositionOptions()])
      } else if (data.assignment === 'User' && data.workflowStepUserDto) {
        const dto = data.workflowStepUserDto
        addStepForm.stepUserUpsert.departmentId = dto.departmentId || ''
        addStepForm.stepUserUpsert.userId = dto.userId || ''
      } else if (data.assignment === 'Custom' && data.workflowStepCustomDto) {
        const dto = data.workflowStepCustomDto
        addStepForm.stepCustomUpsert.handlerKey = dto.handlerKey || ''
        addStepForm.stepCustomUpsert.logicalExplanation = dto.logicalExplanation || ''
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
      t('formbusiness.workflowstep.deleteStepConfirm', { name: step.stepName || step.stepId }),
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
 * User 区块：查询员工
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
      loadApproveModeOptions(),
      formGroupId ? fetchFormTypeDropdown(formGroupId) : Promise.resolve([])
    ])

    if (assignmentOptions.value.length > 0) {
      addStepForm.assignmentCode = assignmentOptions.value[0].assignmentCode
    }
    if (approveModeOptions.value.length > 0) {
      addStepForm.approveModeCode = approveModeOptions.value[0].approveModeCode
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
 * 加载签核方式下拉
 */
const loadApproveModeOptions = async () => {
  try {
    const response = await post(GET_APPROVE_MODE_DROPDOWN_API, {})
    if (response.code === 200) {
      approveModeOptions.value = response.data || []
    } else {
      approveModeOptions.value = []
    }
  } catch {
    approveModeOptions.value = []
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
 * 提交新增步骤（按新接口请求体结构）
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
        approveMode: addStepForm.approveModeCode,
        isReminderEnabled: addStepForm.isReminderEnabled,
        reminderIntervalMinutes: addStepForm.reminderIntervalMinutes,
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
          isEditMode.value ? t('formbusiness.workflowstep.editStepSuccess') : t('formbusiness.workflowstep.addStepSuccess'),
          'success'
        )
        addStepDialogVisible.value = false
        if (searchForm.formTypeId === addStepForm.formTypeId) {
          await getWorkflowStepList()
        }
      } else {
        showMessage(response.message || t('formbusiness.workflowstep.addStepFailed'))
      }
    } catch {
      showMessage(t('formbusiness.workflowstep.addStepFailed'))
    } finally {
      addStepSubmitting.value = false
    }
  })
}

// ========== 分支新增 / 编辑弹窗 ==========
const branchEditDialogVisible = ref(false)
const branchEditDialogLoading = ref(false)
const branchEditSubmitting = ref(false)
const isBranchAddMode = ref(false)
const branchStepDropdownOptions = ref([])
const branchConditionDropdownOptions = ref([])
const branchEditFormRef = ref(null)
const branchEditForm = reactive({
  branChId: '',
  stepId: '',
  conditionId: '',
  executeMatched: 0,
  nextStepId: ''
})

/** 条件下拉：首项「默认」，避免与接口返回的 -1 重复 */
const branchConditionSelectOptions = computed(() => {
  const head = {
    conditionId: '-1',
    conditionName: t('formbusiness.workflowstep.conditionOptionDefault')
  }
  const list = branchConditionDropdownOptions.value || []
  const rest = list.filter((x) => String(x?.conditionId) !== '-1')
  return [head, ...rest]
})

/** 步骤下拉：首项「结束」，避免与接口返回的 -1 重复 */
const branchStepSelectOptions = computed(() => {
  const head = {
    stepId: '-1',
    stepName: t('formbusiness.workflowstep.nextStepOptionEnd')
  }
  const list = branchStepDropdownOptions.value || []
  const rest = list.filter((x) => String(x?.stepId) !== '-1')
  return [head, ...rest]
})

const branchEditRules = {
  conditionId: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseSelectCondition'), trigger: 'change' }],
  nextStepId: [{ required: true, message: () => t('formbusiness.workflowstep.pleaseSelectNextStep'), trigger: 'change' }]
}

const isBranchApiSuccess = (code) => code === 200 || String(code) === '200'

/** 列表项可能为 branChId（与后端一致）或 branchId */
const resolveBranchId = (branch) => {
  if (!branch) return ''
  const v = branch.branChId ?? branch.branchId
  return v != null && v !== '' ? String(v) : ''
}

const resolveBranchRowKey = (branch, stepId, bIndex) => {
  const id = resolveBranchId(branch)
  return id || `${stepId}-branch-${bIndex}`
}

/** 正在删除的分支 branChId，用于行内 loading */
const deletingBranchId = ref('')

const loadBranchStepDropdown = async (formTypeId) => {
  try {
    const res = await post(GET_WORKFLOWSTEP_DROPDOWN_API, buildFormParams({ formTypeId }), FORM_URLENCODED_CONFIG)
    branchStepDropdownOptions.value = res.code === 200 ? (res.data || []) : []
  } catch {
    branchStepDropdownOptions.value = []
  }
}

const loadBranchConditionDropdown = async (formTypeId) => {
  try {
    const res = await post(GET_CONDITION_DROPDOWN_API, buildFormParams({ formTypeId }), FORM_URLENCODED_CONFIG)
    branchConditionDropdownOptions.value = res.code === 200 ? (res.data || []) : []
  } catch {
    branchConditionDropdownOptions.value = []
  }
}

const handleAddBranch = async (step) => {
  if (!searchForm.formTypeId) {
    showMessage(t('formbusiness.workflowstep.pleaseSelectFormType'))
    return
  }
  isBranchAddMode.value = true
  branchEditForm.branChId = ''
  branchEditForm.stepId = step?.stepId ? String(step.stepId) : ''
  branchEditForm.conditionId = ''
  branchEditForm.executeMatched = 0
  branchEditForm.nextStepId = ''
  branchEditDialogVisible.value = true
  branchEditDialogLoading.value = true
  branchStepDropdownOptions.value = []
  branchConditionDropdownOptions.value = []

  try {
    const formTypeId = searchForm.formTypeId
    await Promise.all([loadBranchStepDropdown(formTypeId), loadBranchConditionDropdown(formTypeId)])
  } catch {
    showMessage(t('formbusiness.workflowstep.branchDropdownLoadFailed'))
  } finally {
    branchEditDialogLoading.value = false
    nextTick(() => branchEditFormRef.value?.clearValidate())
  }
}

const handleDeleteBranch = async (branch) => {
  const branChId = resolveBranchId(branch)
  if (!branChId) {
    showMessage(t('formbusiness.workflowstep.branchRowIdMissing'))
    return
  }
  try {
    await ElMessageBox.confirm(
      t('formbusiness.workflowstep.deleteBranchConfirm', {
        name: branch.conditionName || branch.nextStepName || branChId
      }),
      t('common.tip'),
      { type: 'warning' }
    )
  } catch {
    return
  }
  deletingBranchId.value = branChId
  try {
    const response = await post(
      DELETE_WORKFLOWSTEP_BRANCH_API,
      buildFormParams({ branChId }),
      FORM_URLENCODED_CONFIG
    )
    if (isBranchApiSuccess(response?.code)) {
      showMessage(t('formbusiness.workflowstep.deleteBranchSuccess'), 'success')
      await getWorkflowStepList()
    } else {
      showMessage(response?.message || t('formbusiness.workflowstep.deleteBranchFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowstep.deleteBranchFailed'))
  } finally {
    deletingBranchId.value = ''
  }
}

const handleEditBranch = async (branch) => {
  if (!resolveBranchId(branch)) {
    showMessage(t('formbusiness.workflowstep.branchRowIdMissing'))
    return
  }
  if (!searchForm.formTypeId) {
    showMessage(t('formbusiness.workflowstep.pleaseSelectFormType'))
    return
  }
  isBranchAddMode.value = false
  branchEditDialogVisible.value = true
  branchEditDialogLoading.value = true
  branchStepDropdownOptions.value = []
  branchConditionDropdownOptions.value = []

  try {
    const formTypeId = searchForm.formTypeId
    const [entityRes] = await Promise.all([
      post(GET_WORKFLOWSTEP_BRANCH_ENTITY_API, buildFormParams({ branChId: resolveBranchId(branch) }), FORM_URLENCODED_CONFIG),
      loadBranchStepDropdown(formTypeId),
      loadBranchConditionDropdown(formTypeId)
    ])

    if (entityRes && entityRes.code === 200 && entityRes.data) {
      const data = entityRes.data
      branchEditForm.branChId = data.branChId != null ? String(data.branChId) : ''
      branchEditForm.stepId = data.stepId != null ? String(data.stepId) : ''
      branchEditForm.conditionId = data.conditionId != null ? String(data.conditionId) : ''
      branchEditForm.executeMatched = data.executeMatched ?? 0
      branchEditForm.nextStepId = data.nextStepId != null ? String(data.nextStepId) : ''
    } else {
      showMessage(entityRes?.message || t('formbusiness.workflowstep.getBranchEntityFailed'))
    }
  } catch {
    showMessage(t('formbusiness.workflowstep.getBranchEntityFailed'))
  } finally {
    branchEditDialogLoading.value = false
    nextTick(() => branchEditFormRef.value?.clearValidate())
  }
}

const submitBranchEdit = async () => {
  if (!branchEditFormRef.value) return
  await branchEditFormRef.value.validate(async (valid) => {
    if (!valid) return
    branchEditSubmitting.value = true
    try {
      let response
      if (isBranchAddMode.value) {
        const insertPayload = {
          branChId: '',
          stepId: String(branchEditForm.stepId),
          conditionId: String(branchEditForm.conditionId),
          executeMatched: branchEditForm.executeMatched,
          nextStepId: String(branchEditForm.nextStepId)
        }
        response = await post(INSERT_WORKFLOWSTEP_BRANCH_API, insertPayload)
        if (isBranchApiSuccess(response?.code)) {
          showMessage(t('formbusiness.workflowstep.addBranchSuccess'), 'success')
          branchEditDialogVisible.value = false
          await getWorkflowStepList()
        } else {
          showMessage(response?.message || t('formbusiness.workflowstep.addBranchFailed'))
        }
      } else {
        const updatePayload = {
          branChId: branchEditForm.branChId,
          stepId: String(branchEditForm.stepId),
          conditionId: String(branchEditForm.conditionId),
          executeMatched: branchEditForm.executeMatched,
          nextStepId: String(branchEditForm.nextStepId)
        }
        response = await post(UPDATE_WORKFLOWSTEP_BRANCH_API, updatePayload)
        if (isBranchApiSuccess(response?.code)) {
          showMessage(t('formbusiness.workflowstep.editBranchSuccess'), 'success')
          branchEditDialogVisible.value = false
          await getWorkflowStepList()
        } else {
          showMessage(response?.message || t('formbusiness.workflowstep.editBranchFailed'))
        }
      }
    } catch {
      showMessage(
        isBranchAddMode.value ? t('formbusiness.workflowstep.addBranchFailed') : t('formbusiness.workflowstep.editBranchFailed')
      )
    } finally {
      branchEditSubmitting.value = false
    }
  })
}

const handleBranchEditDialogClose = () => {
  isBranchAddMode.value = false
  branchEditFormRef.value?.resetFields()
  branchStepDropdownOptions.value = []
  branchConditionDropdownOptions.value = []
}

// 组件挂载时获取数据
onMounted(async () => {
  await getFormGroupOptions()
})
  </script>
  
  <style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.timeline-wrapper {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 20px 0;
}

/* 缩小时间线步骤之间的间距 */
.timeline-wrapper :deep(.el-timeline-item__wrapper) {
  padding-left: 20px;
}

.timeline-wrapper :deep(.el-timeline-item__node--normal) {
  top: 2px;
}

.timeline-wrapper :deep(.el-timeline-item) {
  padding-bottom: 12px;
}

.timeline-wrapper :deep(.el-timeline-item:last-child) {
  padding-bottom: 0;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 18px;
  margin-bottom: 8px;
  transform: translateY(-12px);
}

.step-actions {
  display: flex;
  align-items: center;
  gap: 0;
  margin-left: 12px;
}

.step-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.step-card {
  margin-right: 20px;
}

.step-card :deep(.el-card__body) {
  padding: 12px 16px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.step-desc {
  font-size: 13px;
  color: #909399;
}

.branch-section {
  margin-top: 0;
}

.branch-toolbar {
  margin-bottom: 8px;
}

.add-step-form .assignment-divider {
  margin: 16px 0;
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

.branch-table {
  overflow: hidden;
}

.branch-row {
  display: flex;
  border-bottom: 1px solid #ebeef5;
}

.branch-row:last-child {
  border-bottom: none;
}

.branch-row-header {
  background-color: #f5f7fa;
  font-weight: 500;
  color: #606266;
}

.branch-cell {
  flex: 1;
  padding: 6px 12px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.branch-cell-action {
  flex: 0 0 140px;
  flex-wrap: wrap;
  gap: 4px 0;
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
  
  