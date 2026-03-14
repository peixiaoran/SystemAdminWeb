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
              <el-tag size="small">{{ step.assignmentName }}</el-tag>
            </div>
            <el-card class="step-card">
              <div class="card-header" v-if="step.description">
                <span class="step-desc">{{ step.description }}</span>
              </div>
              
              <!-- 分支列表 -->
              <div class="branch-section" v-if="step.stepBranchList && step.stepBranchList.length > 0">
                <div class="branch-table">
                  <div class="branch-row branch-row-header">
                    <div class="branch-cell">{{ $t('formbusiness.workflowstep.conditionName') }}</div>
                    <div class="branch-cell">{{ $t('formbusiness.workflowstep.nextStepName') }}</div>
                    <div class="branch-cell">{{ $t('formbusiness.workflowstep.executeMatched') }}</div>
                  </div>
                  <div 
                    v-for="(branch, bIndex) in step.stepBranchList" 
                    :key="bIndex"
                    class="branch-row"
                  >
                    <div class="branch-cell">
                      {{ branch.conditionId === '0' ? $t('formbusiness.workflowstep.defaultCondition') : (branch.conditionName || '-') }}
                    </div>
                    <div class="branch-cell">
                      <el-tag :type="branch.nextStepId === '-1' ? 'info' : 'success'" size="small">
                        {{ branch.nextStepName || $t('formbusiness.workflowstep.endStep') }}
                      </el-tag>
                    </div>
                    <div class="branch-cell">
                      <el-tag :type="branch.executeMatched === 1 ? 'success' : 'warning'" size="small">
                        {{ branch.executeMatched === 1 ? $t('common.yes') : $t('common.no') }}
                      </el-tag>
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
  </div>
</template>
  
  <script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { post } from '@/utils/request'
import { 
  GET_FORMGROUP_DROPDOWN_API
} from '@/config/api/formbusiness/form-operate/applyform.js'
import { 
  GET_FORMTYPE_DROPDOWN_API,
  GET_WORKFLOWSTEP_LIST_API
} from '@/config/api/formbusiness/form-workflow/workflowstep.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
    }
  } catch (error) {
    ElMessage({
      message: t('formbusiness.workflowstep.getFormGroupFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
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
    const params = new URLSearchParams()
    params.append('formGroupId', formGroupId)
    const response = await post(GET_FORMTYPE_DROPDOWN_API, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
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
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      formTypeOptions.value = []
      searchForm.formTypeId = ''
      workflowStepList.value = []
    }
  } catch (error) {
    ElMessage({
      message: t('formbusiness.workflowstep.getFormTypeFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
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
    const response = await post(GET_WORKFLOWSTEP_LIST_API, {
      formTypeId: searchForm.formTypeId
    })
    if (response.code === 200) {
      workflowStepList.value = response.data || []
    } else {
      ElMessage({
        message: response.message,
        type: 'error',
        plain: true,
        showClose: true
      })
      workflowStepList.value = []
    }
  } catch (error) {
    ElMessage({
      message: t('formbusiness.workflowstep.getFailed'),
      type: 'error',
      plain: true,
      showClose: true
    })
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

.step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
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
  padding: 10px 12px;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
  
  