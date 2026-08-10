<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form ref="editFormRef"
               :model="editForm"
               :rules="formRules"
               label-width="120px"
               class="personal-info-form"
               v-loading="loading"
               role="form"
               :aria-label="$t('systembasicmgmt.personalInfo.editFormLabel')">
        <!-- 第一行：基本信息 -->
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.personalInfo.userNo')" prop="userNo">
            <el-input v-model="editForm.userNo" :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.loginNo')" prop="loginNo">
            <el-input v-model="editForm.loginNo" :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.userNameCn')" prop="userNameCn">
            <el-input v-model="editForm.userNameCn"
                      :placeholder="$t('systembasicmgmt.personalInfo.pleaseInputUserNameCn')"
                      :disabled="loading" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.userNameEn')" prop="userNameEn">
            <el-input v-model="editForm.userNameEn"
                      :placeholder="$t('systembasicmgmt.personalInfo.pleaseInputUserNameEn')"
                      :disabled="loading" />
          </el-form-item>
        </div>

        <!-- 第二行：联系信息 -->
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.personalInfo.email')" prop="email">
            <el-input v-model="editForm.email"
                      :placeholder="$t('systembasicmgmt.personalInfo.pleaseInputEmail')"
                      :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.phoneNumber')" prop="phoneNumber">
            <el-input v-model="editForm.phoneNumber"
                      :placeholder="$t('systembasicmgmt.personalInfo.pleaseInputPhoneNumber')"
                      :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.password')" prop="password">
            <el-input v-model="editForm.password"
                      type="password"
                      :placeholder="$t('systembasicmgmt.personalInfo.pleaseInputPassword')"
                      :disabled="loading"
                      show-password />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.gender')" prop="gender">
            <el-select v-model="editForm.gender" :disabled="true" style="width: 100%">
              <el-option v-for="item in genderOptions"
                         :key="item.genderCode"
                         :label="item.genderName"
                         :value="item.genderCode" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 第三行：日期和部门信息 -->
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.personalInfo.hireDate')" prop="hireDate">
            <el-date-picker v-model="editForm.hireDate"
                            type="date"
                            :disabled="true"
                            style="width: 100%"
                            format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.department')" prop="departmentId">
            <el-tree-select v-model="editForm.departmentId"
                            :data="departmentOptions"
                            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                            check-strictly
                            filterable
                            :filter-node-method="filterNodeMethod"
                            :disabled="true"
                            style="width: 100%"
                            popper-class="main-dept-filter-popper"
                            :placeholder="$t('systembasicmgmt.personalInfo.pleaseSelectDepartment')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.position')" prop="positionId">
            <el-select v-model="editForm.positionId" :disabled="true" style="width: 100%">
              <el-option v-for="item in positionOptions"
                         :key="item.positionId"
                         :label="item.positionName"
                         :value="item.positionId" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.role')" prop="roleId">
            <el-select v-model="editForm.roleId" :disabled="true" style="width: 100%">
              <el-option v-for="item in roleOptions"
                         :key="item.roleId"
                         :label="item.roleName"
                         :value="item.roleId" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 第四行：雇佣类型和状态信息 -->
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.personalInfo.laborName')" prop="laborId">
            <el-select v-model="editForm.laborId" :disabled="true" style="width: 100%">
              <el-option v-for="item in laborTypeOptions"
                         :key="item.laborId"
                         :label="item.laborName"
                         :value="item.laborId" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.isFreeze')" prop="isFreeze">
            <el-switch v-model="editForm.isFreeze"
                       :disabled="true"
                       :active-value="1"
                       :inactive-value="0"
                       :active-text="$t('common.yes')"
                       :inactive-text="$t('common.no')"
                       inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.isEmployed')" prop="isEmployed">
            <el-switch v-model="editForm.isEmployed"
                       :disabled="true"
                       :active-value="1"
                       :inactive-value="0"
                       :active-text="$t('common.yes')"
                       :inactive-text="$t('common.no')"
                       inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.isAgent')" prop="isAgent">
            <el-switch v-model="editForm.isAgent"
                       :disabled="true"
                       :active-value="1"
                       :inactive-value="0"
                       :active-text="$t('common.yes')"
                       :inactive-text="$t('common.no')"
                       inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
          </el-form-item>
        </div>

        <!-- 第五行：其他状态 -->
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.personalInfo.isPartTime')" prop="isPartTime">
            <el-switch v-model="editForm.isPartTime"
                       :disabled="true"
                       :active-value="1"
                       :inactive-value="0"
                       :active-text="$t('common.yes')"
                       :inactive-text="$t('common.no')"
                       inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.isReview')" prop="isReview">
            <el-switch v-model="editForm.isReview"
                       :disabled="true"
                       :active-value="1"
                       :inactive-value="0"
                       :active-text="$t('common.yes')"
                       :inactive-text="$t('common.no')"
                       inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.isRealtimeNotification')" prop="isRealtimeNotification">
            <el-switch v-model="editForm.isRealtimeNotification"
                       :disabled="loading"
                       :active-value="1"
                       :inactive-value="0"
                       :active-text="$t('common.yes')"
                       :inactive-text="$t('common.no')"
                       inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.isScheduledNotification')" prop="isScheduledNotification">
            <el-switch v-model="editForm.isScheduledNotification"
                       :disabled="loading"
                       :active-value="1"
                       :inactive-value="0"
                       :active-text="$t('common.yes')"
                       :inactive-text="$t('common.no')"
                       inline-prompt
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" />
          </el-form-item>
        </div>

        <!-- 通知语言 -->
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.personalInfo.noticeLanguage')" prop="noticeLanguage">
            <el-select v-model="editForm.noticeLanguage"
                       :disabled="loading"
                       style="width: 100%"
                       :placeholder="$t('systembasicmgmt.personalInfo.pleaseSelectNoticeLanguage')">
              <el-option :label="$t('login.languages.zh-CN')" value="zh-CN" />
              <el-option :label="$t('login.languages.en-US')" value="en-US" />
            </el-select>
          </el-form-item>
        </div>

        <!-- 第六行：头像上传 -->
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.personalInfo.avatar')" prop="avatarAddress">
            <div class="avatar-container">
              <el-upload class="avatar-uploader"
                         :http-request="customUpload"
                         :show-file-list="false"
                         :on-success="handleAvatarSuccess"
                         :on-error="handleAvatarError"
                         :before-upload="beforeAvatarUpload"
                         accept=".jpg,.jpeg,.png"
                         :disabled="loading">
                <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="avatar-tip">{{ $t('systembasicmgmt.personalInfo.avatarTip') }}</div>
            </div>
          </el-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="form-buttons">
          <el-button @click="handleReset" :disabled="loading">
            {{ $t('common.reset') }}
          </el-button>
          <el-button type="primary" @click="handleSave" :loading="submitLoading" :disabled="loading">
            {{ $t('common.save') }}
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { post } from '@/utils/request'
import { useUserStore } from '@/stores/user'
import { resolveFileUrl } from '@/utils/fileUrl'
import {
  GET_PERSONAL_INFO_ENTITY_API,
  UPDATE_PERSONAL_INFO_API,
  GET_DEPARTMENT_DROPDOWN_API,
  GET_USER_POSITION_DROPDOWN_API,
  GET_ROLE_DROPDOWN_API,
  GET_LABOR_TYPE_DROPDOWN_API,
  UPLOAD_AVATAR_API
} from '@/config/api/systembasicmgmt/system-basicdata/personal'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

/** 头像上传时清空 Accept-Language，避免后端按当前语言改写返回的文件名 */
const UPLOAD_HEADERS = {
  'Accept-Language': ''
}

const editFormRef = ref(null)
const loading = ref(false)
const submitLoading = ref(false)
const avatarUrl = ref('')

const departmentOptions = ref([])
const positionOptions = ref([])
const roleOptions = ref([])
const genderOptions = ref([])
const laborTypeOptions = ref([])

const editForm = reactive({
  userId: '',
  departmentId: '',
  positionId: '',
  roleId: '',
  userNo: '',
  userNameCn: '',
  userNameEn: '',
  gender: '',
  hireDate: '',
  email: '',
  phoneNumber: '',
  password: '',
  loginNo: '',
  isEmployed: 1,
  isAgent: 0,
  isReview: 0,
  isPartTime: 0,
  isFreeze: 0,
  employmentType: '',
  laborId: '',
  avatarAddress: '',
  isRealtimeNotification: 0,
  isScheduledNotification: 0,
  noticeLanguage: 'zh-CN'
})

const originalFormData = reactive({})

const formRules = {
  userNameCn: [
    { required: true, message: () => t('systembasicmgmt.personalInfo.userNameCnRequired'), trigger: 'blur' }
  ],
  userNameEn: [
    { required: true, message: () => t('systembasicmgmt.personalInfo.userNameEnRequired'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: () => t('systembasicmgmt.personalInfo.emailRequired'), trigger: 'blur' },
    { type: 'email', message: () => t('systembasicmgmt.personalInfo.emailFormatError'), trigger: 'blur' }
  ],
  phoneNumber: [
    { pattern: /^[0-9-+\s()]+$/, message: () => t('systembasicmgmt.personalInfo.phoneNumberFormatError'), trigger: 'blur' }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (!value) { callback(); return }
        if (value.length < 8 || value.length > 16) {
          callback(new Error(t('systembasicmgmt.personalInfo.passwordLengthError'))); return
        }
        if (!/[a-z]/.test(value)) {
          callback(new Error(t('systembasicmgmt.personalInfo.passwordLowercaseError'))); return
        }
        if (!/[A-Z]/.test(value)) {
          callback(new Error(t('systembasicmgmt.personalInfo.passwordUppercaseError'))); return
        }
        if (!/[0-9]/.test(value)) {
          callback(new Error(t('systembasicmgmt.personalInfo.passwordNumberError'))); return
        }
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
          callback(new Error(t('systembasicmgmt.personalInfo.passwordSpecialCharError'))); return
        }
        callback()
      },
      trigger: 'blur'
    }
  ],
  noticeLanguage: [
    { required: true, message: () => t('systembasicmgmt.personalInfo.pleaseSelectNoticeLanguage'), trigger: 'change' }
  ]
}

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

const initGenderOptions = () => {
  genderOptions.value = [
    { genderCode: '1', genderName: t('systembasicmgmt.personalInfo.genderOptions.male') },
    { genderCode: '0', genderName: t('systembasicmgmt.personalInfo.genderOptions.female') }
  ]
}

const filterNodeMethod = (value, data) => {
  if (!value) return true
  return data.departmentName.includes(value)
}

const fetchPersonalInfo = async () => {
  loading.value = true
  const res = await post(GET_PERSONAL_INFO_ENTITY_API.GET_PERSONAL_INFO_ENTITY, {})
  if (res?.code === 200 && res.data) {
    Object.assign(editForm, res.data)
    const reviewRaw = res.data.isReview ?? res.data.isApproval ?? res.data.IsApproval
    if (reviewRaw !== undefined && reviewRaw !== null && reviewRaw !== '') {
      const reviewNum = Number(reviewRaw)
      editForm.isReview = Number.isNaN(reviewNum) ? 0 : reviewNum
    }
    delete editForm.isApproval
    delete editForm.IsApproval
    editForm.gender = editForm.gender != null ? String(editForm.gender) : ''
    editForm.noticeLanguage = res.data.noticeLanguage ?? res.data.NoticeLanguage ?? editForm.noticeLanguage ?? 'zh-CN'
    editForm.password = ''
    if (res.data.avatarAddress) {
      avatarUrl.value = resolveFileUrl(res.data.avatarAddress)
    }
    Object.assign(originalFormData, res.data)
    originalFormData.password = ''
  } else if (res?.code !== 401 && res?.code !== 403) {
    showMessage(
      res?.message || t('systembasicmgmt.personalInfo.getPersonalInfoFailed'),
      Number(res?.code) === 400 ? 'warning' : 'error'
    )
  }
  loading.value = false
}

const fetchDepartmentDropdown = async () => {
  const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
  departmentOptions.value = res?.code === 200 && res.data ? res.data : []
}

const fetchPositionDropdown = async () => {
  const res = await post(GET_USER_POSITION_DROPDOWN_API.GET_USER_POSITION_DROPDOWN, {})
  positionOptions.value = res?.code === 200 && res.data ? res.data : []
}

const fetchRoleDropdown = async () => {
  const res = await post(GET_ROLE_DROPDOWN_API.GET_ROLE_DROPDOWN, {})
  roleOptions.value = res?.code === 200 && res.data ? res.data : []
}

const fetchLaborTypeDropdown = async () => {
  const res = await post(GET_LABOR_TYPE_DROPDOWN_API.GET_LABOR_TYPE_DROPDOWN, {})
  if (res?.code === 200 && res.data) {
    laborTypeOptions.value = res.data.filter(item =>
      item && item.laborId !== undefined && item.laborId !== null &&
      item.laborName !== undefined && item.laborName !== null
    )
  } else {
    laborTypeOptions.value = []
  }
}

const beforeAvatarUpload = (file) => {
  const isValidType = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isValidType) {
    showMessage(t('systembasicmgmt.userInfo.avatarFormatError'), 'warning')
    return false
  }
  if (!isLt2M) {
    showMessage(t('systembasicmgmt.userInfo.avatarSizeError'), 'warning')
    return false
  }

  return true
}

const customUpload = async (options) => {
  const formData = new FormData()
  formData.append('userId', editForm.userId || '')
  formData.append('file', options.file)
  const res = await post(UPLOAD_AVATAR_API.UPLOAD_AVATAR, formData, {
    headers: {
      ...UPLOAD_HEADERS,
      'Content-Type': 'multipart/form-data'
    }
  })
  if (res?.code === 200) {
    return res
  }
  throw new Error(res?.message || t('common.operationFailed'))
}

const handleAvatarError = (error) => {
  showMessage(error?.message || t('systembasicmgmt.personalInfo.avatarUploadFailed'))
}

const handleAvatarSuccess = (res) => {
  const avatarAddress = res?.data
  if (!avatarAddress) {
    handleAvatarError(new Error(res?.message || t('systembasicmgmt.personalInfo.avatarUploadFailed')))
    return
  }
  editForm.avatarAddress = avatarAddress
  avatarUrl.value = resolveFileUrl(avatarAddress)
  showMessage(t('systembasicmgmt.personalInfo.avatarUploadSuccess'), 'success')
}

const handleReset = () => {
  editFormRef.value?.clearValidate()
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  const params = {
    userId: editForm.userId,
    userNameCn: editForm.userNameCn,
    userNameEn: editForm.userNameEn,
    email: editForm.email,
    phoneNumber: editForm.phoneNumber,
    PassWord: editForm.password,
    avatarAddress: editForm.avatarAddress,
    isRealtimeNotification: editForm.isRealtimeNotification,
    isScheduledNotification: editForm.isScheduledNotification,
    noticeLanguage: editForm.noticeLanguage
  }

  const res = await post(UPDATE_PERSONAL_INFO_API.UPDATE_PERSONAL_INFO, params)
  if (res?.code === 200) {
    showMessage(res.message, 'success')

    // 修改过密码需要重新登录
    if (editForm.password && editForm.password.trim() !== '') {
      await userStore.logout()
      router.push('/login')
      submitLoading.value = false
      return
    }

    await fetchPersonalInfo()
  } else if (res?.code !== 401 && res?.code !== 403) {
    showMessage(
      res?.message || t('systembasicmgmt.personalInfo.savePersonalInfoFailed'),
      Number(res?.code) === 400 ? 'warning' : 'error'
    )
  }
  submitLoading.value = false
}

onMounted(async () => {
  initGenderOptions()
  await Promise.all([
    fetchPersonalInfo(),
    fetchDepartmentDropdown(),
    fetchPositionDropdown(),
    fetchRoleDropdown(),
    fetchLaborTypeDropdown()
  ])
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.personal-info-form {
  padding: 20px;
  background: white;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.avatar-uploader {
  text-align: center;
  display: inline-block;
  flex-shrink: 0;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  display: inline-block;
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
  border-radius: 6px;
}

.avatar-tip {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 25px;
  align-items: start;
}

.form-row .el-form-item {
  margin-bottom: 0;
}

.form-row .el-form-item :deep(.el-form-item__label) {
  text-align: right;
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  white-space: nowrap;
}

.form-buttons {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-top: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .form-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .personal-info-form {
    padding: 15px;
  }
}
</style>

<!-- 部门树下拉项加高、加宽（下拉挂载到 body，需单独样式） -->
<style>
.main-dept-filter-popper {
  width: auto !important;
  min-width: 320px !important;
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
