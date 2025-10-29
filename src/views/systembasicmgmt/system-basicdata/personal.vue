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
          <el-form-item :label="$t('systembasicmgmt.personalInfo.userNo')" prop="userNo">
            <el-input v-model="personalInfoForm.userNo" :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.loginNo')" prop="loginNo">
            <el-input v-model="personalInfoForm.loginNo" :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.userNameCn')" prop="userNameCn">
            <el-input
              v-model="personalInfoForm.userNameCn"
              :placeholder="$t('systembasicmgmt.personalInfo.pleaseInputUserNameCn')" 
              :disabled="loading"
            />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.userNameEn')" prop="userNameEn">
            <el-input 
              v-model="personalInfoForm.userNameEn" 
              :placeholder="$t('systembasicmgmt.personalInfo.pleaseInputUserNameEn')" 
              :disabled="loading"
            />
          </el-form-item>
        </div>

        <!-- 第二行：联系信息 -->
        <div class="form-row">
          <el-form-item :label="$t('systembasicmgmt.personalInfo.email')" prop="email">
            <el-input 
              v-model="personalInfoForm.email" 
              :placeholder="$t('systembasicmgmt.personalInfo.pleaseInputEmail')" 
              :disabled="true"
            />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.phoneNumber')" prop="phoneNumber">
            <el-input 
              v-model="personalInfoForm.phoneNumber" 
              :placeholder="$t('systembasicmgmt.personalInfo.pleaseInputPhoneNumber')" 
              :disabled="loading"
            />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.password')" prop="password">
            <el-input 
              v-model="personalInfoForm.password" 
              type="password"
              :placeholder="$t('systembasicmgmt.personalInfo.pleaseInputPassword')" 
              :disabled="loading"
              show-password
            />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.gender')" prop="gender">
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
          <el-form-item :label="$t('systembasicmgmt.personalInfo.hireDate')" prop="hireDate">
            <el-date-picker
              v-model="personalInfoForm.hireDate"
              type="date"
              :disabled="true"
              style="width: 100%"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.department')" prop="departmentId">
            <el-tree-select
              v-model="personalInfoForm.departmentId"
              :data="departmentOptions"
              :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList' }"
              check-strictly
              :disabled="true"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.personalInfo.position')" prop="positionId">
            <el-select v-model="personalInfoForm.positionId" :disabled="true" style="width: 100%">
              <el-option
                v-for="item in positionOptions"
                :key="item.positionId"
                :label="item.positionName"
              :value="item.positionId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.personalInfo.role')" prop="roleId">
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
        <el-form-item :label="$t('systembasicmgmt.personalInfo.laborName')" prop="laborId">
          <el-select v-model="personalInfoForm.laborId" :disabled="true" style="width: 100%">
            <el-option
              v-for="item in laborTypeOptions"
              :key="item.laborId"
              :label="item.laborName"
              :value="item.laborId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.personalInfo.isFreeze')" prop="isFreeze">
          <el-switch v-model="personalInfoForm.isFreeze" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" :active-text="$t('common.yes')" :inactive-text="$t('common.no')" inline-prompt />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.personalInfo.isEmployed')" prop="isEmployed">
          <el-switch v-model="personalInfoForm.isEmployed" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" :active-text="$t('common.yes')" :inactive-text="$t('common.no')" inline-prompt />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.personalInfo.isAgent')" prop="isAgent">
          <el-switch v-model="personalInfoForm.isAgent" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" :active-text="$t('common.yes')" :inactive-text="$t('common.no')" inline-prompt />
        </el-form-item>
      </div>

      <!-- 第五行：其他状态 -->
      <div class="form-row">
        <el-form-item :label="$t('systembasicmgmt.personalInfo.isPartTime')" prop="isPartTime">
          <el-switch v-model="personalInfoForm.isPartTime" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" :active-text="$t('common.yes')" :inactive-text="$t('common.no')" inline-prompt />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.personalInfo.isApproval')" prop="isApproval">
          <el-switch v-model="personalInfoForm.isApproval" :disabled="true" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" :active-text="$t('common.yes')" :inactive-text="$t('common.no')" inline-prompt />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.personalInfo.isRealtimeNotification')" prop="isRealtimeNotification">
          <el-switch v-model="personalInfoForm.isRealtimeNotification" :disabled="loading" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" :active-text="$t('common.yes')" :inactive-text="$t('common.no')" inline-prompt />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.personalInfo.isScheduledNotification')" prop="isScheduledNotification">
          <el-switch v-model="personalInfoForm.isScheduledNotification" :disabled="loading" :active-value="1" :inactive-value="0" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #909399" :active-text="$t('common.yes')" :inactive-text="$t('common.no')" inline-prompt />
        </el-form-item>
      </div>

      <!-- 第六行：头像上传 -->
      <div class="form-row">
        <el-form-item :label="$t('systembasicmgmt.userInfo.avatar')" prop="avatarAddress">
          <div class="avatar-container">
            <el-upload
              class="avatar-uploader"
              :action="UPLOAD_CONFIG.url"
              :headers="UPLOAD_CONFIG.headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept=".jpg,.jpeg,.png"
              :disabled="loading"
            >
              <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="avatar-tip">{{ $t('systembasicmgmt.userInfo.avatarTip') }}</div>
          </div>
        </el-form-item>
      </div>

      <!-- 操作按钮 -->
      <div class="form-buttons">
        <el-button 
          @click="handleReset" 
          :disabled="loading"
        >
          {{ $t('common.reset') }}
        </el-button>
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
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { post } from '@/utils/request'
import { useUserStore } from '@/stores/user'
import {
  GET_PERSONAL_INFO_ENTITY_API,
  UPDATE_PERSONAL_INFO_API,
  GET_DEPARTMENT_DROPDOWN_API,
  GET_USER_POSITION_DROPDOWN_API,
  GET_ROLE_DROPDOWN_API,
  GET_GENDER_DROPDOWN_API,
  GET_LABOR_TYPE_DROPDOWN_API,
} from '@/config/api/systembasicmgmt/system-basicdata/personal'
import { UPLOAD_AVATAR_API } from '@/config/api/systembasicmgmt/system-basicdata/user'

export default {
  name: 'PersonalInfo',
  components: {
    Plus
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const userStore = useUserStore()
    const personalInfoFormRef = ref(null)
    const loading = ref(false)
    const saving = ref(false)

    // 统一的文件上传配置
    const UPLOAD_CONFIG = reactive({
      url: `https://localhost:7272/api/systembasicmgmt/${UPLOAD_AVATAR_API.UPLOAD_AVATAR}`,
      headers: {
        'Accept-Language': '',
        'Authorization': `Bearer ${userStore.token}`
      }
    })
    
    // 监听 token 变化，更新上传配置
    watch(() => userStore.token, (newToken) => {
      UPLOAD_CONFIG.headers.Authorization = `Bearer ${newToken}`
    })

    // 头像相关
    const avatarUrl = ref('')

    // 表单数据
    const personalInfoForm = reactive({
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
      IsApproval: 0,
      isPartTime: 0,
      isFreeze: 0,
      employmentType: '',
      laborId: '',
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
    const laborTypeOptions = ref([])
    
    // 表单验证规则
    const formRules = reactive({
      userNameCn: [
        { required: true, message: t('systembasicmgmt.personalInfo.userNameCnRequired'), trigger: 'blur' }
      ],
      userNameEn: [
        { required: true, message: t('systembasicmgmt.personalInfo.userNameEnRequired'), trigger: 'blur' }
      ],
      email: [
        { required: true, message: t('systembasicmgmt.personalInfo.emailRequired'), trigger: 'blur' },
        { type: 'email', message: t('systembasicmgmt.personalInfo.emailFormatError'), trigger: 'blur' }
      ],
      phoneNumber: [
        { pattern: /^[0-9-+\s()]+$/, message: t('systembasicmgmt.personalInfo.phoneNumberFormatError'), trigger: 'blur' }
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
              callback(new Error(t('systembasicmgmt.personalInfo.passwordLengthError')))
              return
            }
            // 必须包含小写字母
            if (!/[a-z]/.test(value)) {
              callback(new Error(t('systembasicmgmt.personalInfo.passwordLowercaseError')))
              return
            }
            // 必须包含大写字母
            if (!/[A-Z]/.test(value)) {
              callback(new Error(t('systembasicmgmt.personalInfo.passwordUppercaseError')))
              return
            }
            // 必须包含数字
            if (!/[0-9]/.test(value)) {
              callback(new Error(t('systembasicmgmt.personalInfo.passwordNumberError')))
              return
            }
            // 密码必须为8-16个字符
            if (value.length < 8 || value.length > 16) {
              callback(new Error(t('systembasicmgmt.personalInfo.passwordLengthError')))
              return
            }
            // 必须包含小写字母
            if (!/[a-z]/.test(value)) {
              callback(new Error(t('systembasicmgmt.personalInfo.passwordLowercaseError')))
              return
            }
            // 必须包含大写字母
            if (!/[A-Z]/.test(value)) {
              callback(new Error(t('systembasicmgmt.personalInfo.passwordUppercaseError')))
              return
            }
            // 必须包含数字
            if (!/[0-9]/.test(value)) {
              callback(new Error(t('systembasicmgmt.personalInfo.passwordNumberError')))
              return
            }
            // 必须包含特殊字符
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
              callback(new Error(t('systembasicmgmt.personalInfo.passwordSpecialCharError')))
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
        ElMessage({
          message: t('systembasicmgmt.userInfo.avatarFormatError'),
          type: 'error',
          plain: true,
          showClose: true
        })
        return false
      }
      if (!isLt2M) {
        ElMessage({
          message: t('systembasicmgmt.userInfo.avatarSizeError'),
          type: 'error',
          plain: true,
          showClose: true
        })
        return false
      }

      return true
    }

    // 头像上传成功
    const handleAvatarSuccess = (res) => {
      if (res && res.code === 200) {
        personalInfoForm.avatarAddress = res.data
        avatarUrl.value = res.data
        ElMessage({
          message: t('systembasicmgmt.userInfo.avatarUploadSuccess'),
          type: 'success',
          plain: true,
          showClose: true
        })
      } else {
        ElMessage({
          message: res.message,
          type: 'error',
          plain: true,
          showClose: true
        })
      }
    }

    // 获取个人信息
    const getPersonalInfo = async () => {
      try {
        loading.value = true
        const response = await post(GET_PERSONAL_INFO_ENTITY_API.GET_PERSONAL_INFO_ENTITY, {})
        
        if (response.code === 200 && response.data) {
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
          ElMessage({
            message: response.message || t('systembasicmgmt.personalInfo.getPersonalInfoFailed'),
            type: 'error',
            plain: true,
            showClose: true
          })
        }
       } catch (error) {
         console.error('获取个人信息失败:', error)
         ElMessage({
           message: t('systembasicmgmt.personalInfo.getPersonalInfoFailed'),
           type: 'error',
           plain: true,
           showClose: true
         })
       } finally {
         loading.value = false
       }
     }

     // 获取部门下拉框数据
     const getDepartmentDropdown = async () => {
       try {
         const response = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
         if (response.code === 200 && response.data) {
           departmentOptions.value = response.data
         }
       } catch (error) {
         console.error('获取部门下拉框失败:', error)
       }
     }

     // 获取职业下拉框数据
     const getPositionDropdown = async () => {
       try {
         const response = await post(GET_USER_POSITION_DROPDOWN_API.GET_USER_POSITION_DROPDOWN, {})
         if (response.code === 200 && response.data) {
           positionOptions.value = response.data
         }
       } catch (error) {
         console.error('获取职业下拉框失败:', error)
       }
     }

     // 获取角色下拉框数据
     const getRoleDropdown = async () => {
       try {
         const response = await post(GET_ROLE_DROPDOWN_API.GET_ROLE_DROPDOWN, {})
         if (response.code === 200 && response.data) {
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
         if (response.code === 200 && response.data) {
           genderOptions.value = response.data
         }
       } catch (error) {
         console.error('获取性别下拉框失败:', error)
       }
     }

     // 获取员工职业下拉框数据
     const getLaborTypeDropdown = async () => {
       try {
         const response = await post(GET_LABOR_TYPE_DROPDOWN_API.GET_LABOR_TYPE_DROPDOWN, {})
         if (response.code === 200 && response.data) {
           laborTypeOptions.value = response.data || []
           // 过滤掉无效数据
           laborTypeOptions.value = laborTypeOptions.value.filter(item => 
             item && item.laborId !== undefined && item.laborId !== null && 
             item.laborName !== undefined && item.laborName !== null
           )
         } else {
           laborTypeOptions.value = []
         }
       } catch (error) {
         console.error('获取员工职业下拉框失败:', error)
         laborTypeOptions.value = []
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
           userNameCn: personalInfoForm.userNameCn,
           userNameEn: personalInfoForm.userNameEn,
           email: personalInfoForm.email,
           phoneNumber: personalInfoForm.phoneNumber,
           PassWord: personalInfoForm.password,
           avatarAddress: personalInfoForm.avatarAddress,
           isRealtimeNotification: personalInfoForm.isRealtimeNotification,
           isScheduledNotification: personalInfoForm.isScheduledNotification
         }

         const response = await post(UPDATE_PERSONAL_INFO_API.UPDATE_PERSONAL_INFO, updateData)
         
         if (response.code === 200) {
           ElMessage({
             message: response.message,
             type: 'success',
             plain: true,
             showClose: true
           })
           
           // 如果修改了密码，则退出系统
           if (personalInfoForm.password && personalInfoForm.password.trim() !== '') {
             // 清空用户store和localStorage
             await userStore.logout()
             // 跳转到登录页面
             router.push('/login')
             return
           }
           
           // 重新获取最新数据
           await getPersonalInfo()
         } else {
           ElMessage({
             message: response.message,
             type: 'error',
             plain: true,
             showClose: true
           })
         }
       } catch (error) {
         console.error('保存个人信息失败:', error)
         ElMessage({
           message: t('systembasicmgmt.personalInfo.savePersonalInfoFailed'),
           type: 'error',
           plain: true,
           showClose: true
         })
       } finally {
         saving.value = false
       }
     }

     // 重置表单
    const handleReset = () => {
      // 只清除表单验证状态，不重新获取数据
      personalInfoFormRef.value?.clearValidate()
      ElMessage({
        message: t('common.resetSuccess'),
        type: 'success',
        plain: true,
        showClose: true
      })
    }

     // 初始化数据
     const initData = async () => {
       await Promise.all([
         getPersonalInfo(),
         getDepartmentDropdown(),
         getPositionDropdown(),
         getRoleDropdown(),
         getGenderDropdown(),
         getLaborTypeDropdown()
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
       laborTypeOptions,
       avatarUrl,
       UPLOAD_CONFIG,
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
