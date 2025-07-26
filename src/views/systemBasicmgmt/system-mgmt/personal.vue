<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form
        ref="personalInfoFormRef"
        :model="personalInfoForm"
        :rules="formRules"
        label-width="120px"
        class="personal-info-form"
        v-loading="loading"
      >
      <!-- 第一行：基本信息 -->
      <div class="form-row">
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.userNo')" prop="userNo">
          <el-input v-model="personalInfoForm.userNo" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.loginNo')" prop="loginNo">
          <el-input v-model="personalInfoForm.loginNo" :disabled="true" />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.userNameCh')" prop="userNameCh">
          <el-input 
            v-model="personalInfoForm.userNameCh" 
            :placeholder="$t('SystemBasicMgmt.personalInfo.pleaseInputUserNameCh')" 
            :disabled="loading"
          />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.userNameEn')" prop="userNameEn">
          <el-input 
            v-model="personalInfoForm.userNameEn" 
            :placeholder="$t('SystemBasicMgmt.personalInfo.pleaseInputUserNameEn')" 
            :disabled="loading"
          />
        </el-form-item>
      </div>

      <!-- 第二行：联系信息 -->
      <div class="form-row">
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.email')" prop="email">
          <el-input 
            v-model="personalInfoForm.email" 
            :placeholder="$t('SystemBasicMgmt.personalInfo.pleaseInputEmail')" 
            :disabled="loading"
          />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.phoneNumber')" prop="phoneNumber">
          <el-input 
            v-model="personalInfoForm.phoneNumber" 
            :placeholder="$t('SystemBasicMgmt.personalInfo.pleaseInputPhoneNumber')" 
            :disabled="loading"
          />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.password')" prop="password">
          <el-input 
            v-model="personalInfoForm.password" 
            type="password"
            :placeholder="$t('SystemBasicMgmt.personalInfo.pleaseInputPassword')" 
            :disabled="loading"
            show-password
          />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.gender')" prop="gender">
          <el-select v-model="personalInfoForm.gender" :disabled="true" style="width: 100%">
            <el-option
              v-for="item in genderOptions"
              :key="item.genderCode"
              :label="item.genderName"
              :value="item.genderCode"
            />
          </el-select>
        </el-form-item>
      </div>

      <!-- 第三行：日期和部门信息 -->
      <div class="form-row">
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.hireDate')" prop="hireDate">
          <el-date-picker
            v-model="personalInfoForm.hireDate"
            type="date"
            :disabled="true"
            style="width: 100%"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.department')" prop="departmentId">
          <el-tree-select
            v-model="personalInfoForm.departmentId"
            :data="departmentOptions"
            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList' }"
            check-strictly
            :disabled="true"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.position')" prop="positionId">
          <el-select v-model="personalInfoForm.positionId" :disabled="true" style="width: 100%">
            <el-option
              v-for="item in positionOptions"
              :key="item.positionId"
              :label="item.positionName"
              :value="item.positionId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.role')" prop="roleId">
          <el-select v-model="personalInfoForm.roleId" :disabled="true" style="width: 100%">
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
      </div>

      <!-- 第四行：雇佣类型和状态信息 -->
      <div class="form-row">
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.employmentType')" prop="employmentType">
          <el-select v-model="personalInfoForm.employmentType" :disabled="true" style="width: 100%">
            <el-option
              v-for="item in employmentTypeOptions"
              :key="item.employmentCode"
              :label="item.employmentName"
              :value="item.employmentCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.isEmployed')" prop="isEmployed">
          <el-switch v-model="personalInfoForm.isEmployed" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.isAgent')" prop="isAgent">
          <el-switch v-model="personalInfoForm.isAgent" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.isSign')" prop="isSign">
          <el-switch v-model="personalInfoForm.isSign" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </el-form-item>
      </div>

      <!-- 第五行：其他状态 -->
      <div class="form-row">
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.isPartTime')" prop="isPartTime">
          <el-switch v-model="personalInfoForm.isPartTime" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.isFreeze')" prop="isFreeze">
          <el-switch v-model="personalInfoForm.isFreeze" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.isRealtimeNotification')" prop="isRealtimeNotification">
          <el-switch v-model="personalInfoForm.isRealtimeNotification" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </el-form-item>
        <el-form-item :label="$t('SystemBasicMgmt.personalInfo.isScheduledNotification')" prop="isScheduledNotification">
          <el-switch v-model="personalInfoForm.isScheduledNotification" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </el-form-item>
      </div>

      <!-- 第六行：备注 -->
      <!-- 备注字段已移除 -->

      <!-- 第七行：头像上传 -->
      <div class="form-row">
        <el-form-item :label="$t('SystemBasicMgmt.userInfo.avatar')" prop="avatarAddress">
          <div class="avatar-container">
            <el-upload
              class="avatar-uploader"
              action="https://localhost:7272/api/SystemBasicMgmt/SystemBasicCoreApi/File/UploadAvatar"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept=".jpg,.jpeg,.png"
              :disabled="loading"
            >
              <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="avatar-tip">{{ $t('SystemBasicMgmt.userInfo.avatarTip') }}</div>
          </div>
        </el-form-item>
      </div>

      <!-- 操作按钮 -->
      <div class="form-buttons">
        <el-button 
          type="primary" 
          @click="handleSave" 
          :loading="saving"
          :disabled="loading"
        >
          {{ $t('common.save') }}
        </el-button>
      </div>
    </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { get, post } from '@/utils/request'
import {
  GET_PERSONAL_INFO_ENTITY_API,
  UPDATE_PERSONAL_INFO_API,
  GET_DEPARTMENT_DROPDOWN_API,
  GET_USER_POSITION_DROPDOWN_API,
  GET_ROLE_DROPDOWN_API,
  GET_GENDER_DROPDOWN_API,
  GET_EMPLOYMENT_TYPE_DROPDOWN_API,
  UPLOAD_AVATAR_API
} from '@/config/api/SystemBasicMgmt/System-Mgmt/personal'

export default {
  name: 'PersonalInfo',
  components: {
    Plus
  },
  setup() {
    const { t } = useI18n()
    const personalInfoFormRef = ref(null)
    const loading = ref(false)
    const saving = ref(false)

    // 头像相关
    const avatarUrl = ref('')

    // 表单数据
    const personalInfoForm = reactive({
      userId: '',
      departmentId: '',
      positionId: '',
      roleId: '',
      userNo: '',
      userNameCh: '',
      userNameEn: '',
      gender: '',
      hireDate: '',
      email: '',
      phoneNumber: '',
      password: '',
      loginNo: '',
      isEmployed: 1,
      isAgent: 0,
      isSign: 0,
      isPartTime: 0,
      isFreeze: 0,
      employmentType: '',
      avatarAddress: '',
      isRealtimeNotification: 0,
      isScheduledNotification: 0
    })

    // 原始数据备份（用于重置）
    const originalFormData = reactive({})

    // 下拉框选项
    const departmentOptions = ref([])
    const positionOptions = ref([])
    const roleOptions = ref([])
    const genderOptions = ref([])
    const employmentTypeOptions = ref([])

    // 表单验证规则
    const formRules = reactive({
      userNameCh: [
        { required: true, message: t('SystemBasicMgmt.personalInfo.userNameChRequired'), trigger: 'blur' }
      ],
      userNameEn: [
        { required: true, message: t('SystemBasicMgmt.personalInfo.userNameEnRequired'), trigger: 'blur' }
      ],
      email: [
        { required: true, message: t('SystemBasicMgmt.personalInfo.emailRequired'), trigger: 'blur' },
        { type: 'email', message: t('SystemBasicMgmt.personalInfo.emailFormatError'), trigger: 'blur' }
      ],
      phoneNumber: [
        { pattern: /^[0-9-+\s()]+$/, message: t('SystemBasicMgmt.personalInfo.phoneNumberFormatError'), trigger: 'blur' }
      ],
      password: [
        { 
          validator: (rule, value, callback) => {
            if (!value) {
              callback()
              return
            }
            // 密码必须为8-16个字符
            if (value.length < 8 || value.length > 16) {
              callback(new Error(t('SystemBasicMgmt.personalInfo.passwordLengthError')))
              return
            }
            // 必须包含小写字母
            if (!/[a-z]/.test(value)) {
              callback(new Error(t('SystemBasicMgmt.personalInfo.passwordLowercaseError')))
              return
            }
            // 必须包含大写字母
            if (!/[A-Z]/.test(value)) {
              callback(new Error(t('SystemBasicMgmt.personalInfo.passwordUppercaseError')))
              return
            }
            // 必须包含数字
            if (!/[0-9]/.test(value)) {
              callback(new Error(t('SystemBasicMgmt.personalInfo.passwordNumberError')))
              return
            }
            callback()
          }, 
          trigger: 'blur' 
        }
      ]
    })

    // 头像上传前验证
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        ElMessage.error(t('SystemBasicMgmt.userInfo.avatarFormatError'))
        return false
      }
      if (!isLt2M) {
        ElMessage.error(t('SystemBasicMgmt.userInfo.avatarSizeError'))
        return false
      }

      return true
    }

    // 头像上传成功
    const handleAvatarSuccess = (res) => {
      if (res && res.code === '200') {
        personalInfoForm.avatarAddress = res.data
        avatarUrl.value = res.data
        ElMessage.success(t('SystemBasicMgmt.userInfo.avatarUploadSuccess'))
      } else {
        ElMessage.error(res.message || t('SystemBasicMgmt.userInfo.avatarUploadFailed'))
      }
    }

    // 获取个人信息
    const getPersonalInfo = async () => {
      try {
        loading.value = true
        const response = await post(GET_PERSONAL_INFO_ENTITY_API.GET_PERSONAL_INFO_ENTITY, {})
        
        if (response.code === '200' && response.data) {
          Object.assign(personalInfoForm, response.data)
          // 密码字段在查询时设置为空字符串
          personalInfoForm.password = ''
          // 设置头像显示
          if (response.data.avatarAddress) {
            avatarUrl.value = response.data.avatarAddress
          }
          Object.assign(originalFormData, response.data)
          originalFormData.password = ''
        } else {
          ElMessage.error(response.message || t('SystemBasicMgmt.personalInfo.getPersonalInfoFailed'))
        }
      } catch (error) {
        console.error('获取个人信息失败:', error)
        ElMessage.error(t('SystemBasicMgmt.personalInfo.getPersonalInfoFailed'))
      } finally {
        loading.value = false
      }
    }

    // 获取部门下拉框数据
    const getDepartmentDropdown = async () => {
      try {
        const response = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
        if (response.code === '200' && response.data) {
          departmentOptions.value = response.data
        }
      } catch (error) {
        console.error('获取部门下拉框失败:', error)
      }
    }

    // 获取职位下拉框数据
    const getPositionDropdown = async () => {
      try {
        const response = await post(GET_USER_POSITION_DROPDOWN_API.GET_USER_POSITION_DROPDOWN, {})
        if (response.code === '200' && response.data) {
          positionOptions.value = response.data
        }
      } catch (error) {
        console.error('获取职位下拉框失败:', error)
      }
    }

    // 获取角色下拉框数据
    const getRoleDropdown = async () => {
      try {
        const response = await post(GET_ROLE_DROPDOWN_API.GET_ROLE_DROPDOWN, {})
        if (response.code === '200' && response.data) {
          roleOptions.value = response.data
        }
      } catch (error) {
        console.error('获取角色下拉框失败:', error)
      }
    }

    // 获取性别下拉框数据
    const getGenderDropdown = async () => {
      try {
        const response = await post(GET_GENDER_DROPDOWN_API.GET_GENDER_DROPDOWN, {})
        if (response.code === '200' && response.data) {
          genderOptions.value = response.data
        }
      } catch (error) {
        console.error('获取性别下拉框失败:', error)
      }
    }

    // 获取雇佣类型下拉框数据
    const getEmploymentTypeDropdown = async () => {
      try {
        const response = await post(GET_EMPLOYMENT_TYPE_DROPDOWN_API.GET_EMPLOYMENT_TYPE_DROPDOWN, {})
        if (response.code === '200' && response.data) {
          employmentTypeOptions.value = response.data
        }
      } catch (error) {
        console.error('获取雇佣类型下拉框失败:', error)
      }
    }

    // 保存个人信息
    const handleSave = async () => {
      // 先进行表单验证，如果验证失败直接返回
      try {
        const valid = await personalInfoFormRef.value.validate()
        if (!valid) {
          // 验证失败时不显示额外的错误提示，Element Plus会自动显示字段验证错误
          return
        }
      } catch (validationError) {
        // 验证过程中出现错误（如验证规则执行失败），不显示保存失败提示
        console.error('表单验证失败:', validationError)
        return
      }

      // 验证通过后进行保存操作
      try {
        saving.value = true
        
        // 只提交允许修改的字段
        const updateData = {
          userId: personalInfoForm.userId,
          userNameCh: personalInfoForm.userNameCh,
          userNameEn: personalInfoForm.userNameEn,
          email: personalInfoForm.email,
          phoneNumber: personalInfoForm.phoneNumber,
          PassWord: personalInfoForm.password,
          avatarAddress: personalInfoForm.avatarAddress,
          isRealtimeNotification: personalInfoForm.isRealtimeNotification,
          isScheduledNotification: personalInfoForm.isScheduledNotification
        }

        const response = await post(UPDATE_PERSONAL_INFO_API.UPDATE_PERSONAL_INFO, updateData)
        
        if (response.code === '200') {
          ElMessage.success(response.message || t('common.saveSuccess'))
          // 重新获取最新数据
          await getPersonalInfo()
        } else {
          ElMessage.error(response.message || t('SystemBasicMgmt.personalInfo.savePersonalInfoFailed'))
        }
      } catch (error) {
        console.error('保存个人信息失败:', error)
        ElMessage.error(t('SystemBasicMgmt.personalInfo.savePersonalInfoFailed'))
      } finally {
        saving.value = false
      }
    }

    // 重置表单
    const handleReset = () => {
      Object.assign(personalInfoForm, originalFormData)
      personalInfoFormRef.value?.clearValidate()
    }

    // 初始化数据
    const initData = async () => {
      await Promise.all([
        getPersonalInfo(),
        getDepartmentDropdown(),
        getPositionDropdown(),
        getRoleDropdown(),
        getGenderDropdown(),
        getEmploymentTypeDropdown()
      ])
    }

    onMounted(() => {
      initData()
    })

    return {
      personalInfoFormRef,
      loading,
      saving,
      personalInfoForm,
      formRules,
      departmentOptions,
      positionOptions,
      roleOptions,
      genderOptions,
      employmentTypeOptions,
      avatarUrl,
      handleSave,
      handleReset,
      beforeAvatarUpload,
      handleAvatarSuccess
    }
  }
}
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

.remark-item {
  grid-column: span 4;
}

.form-buttons {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  padding-top: 20px;
}

.el-input:disabled,
.el-select:disabled,
.el-date-picker:disabled,
.el-tree-select:disabled,
.el-switch:disabled {
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .form-row {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .remark-item {
    grid-column: span 3;
  }
}

@media (max-width: 992px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .remark-item {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .remark-item {
    grid-column: span 1;
  }
  
  .personal-info-form {
    padding: 15px;
  }
}
</style>
