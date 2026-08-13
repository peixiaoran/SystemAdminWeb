<template>
  <div class="conventional-table-container">
    <el-card class="conventional-card">
      <el-form :inline="true" :model="filters" class="conventional-filter-form" role="search" :aria-label="$t('systembasicmgmt.userInfo.ariaFilterLabel')">
        <el-form-item :label="$t('systembasicmgmt.userInfo.filter.department')">
          <el-tree-select v-model="filters.departmentId"
                          :data="departmentOptions"
                          :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                          check-strictly
                          filterable
                          :filter-node-method="filterNodeMethod"
                          @change="handleDepartmentChange"
                          style="width: 220px"
                          popper-class="main-dept-filter-popper"
                          :placeholder="$t('systembasicmgmt.userInfo.pleaseSelectDepartment')" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userInfo.filter.userNo')">
          <el-input v-model="filters.userNo"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.userInfo.filter.userNoPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('systembasicmgmt.userInfo.filter.userName')">
          <el-input v-model="filters.userName"
                    style="width: 220px"
                    :placeholder="$t('systembasicmgmt.userInfo.filter.userNamePlaceholder')" />
        </el-form-item>
        <el-form-item class="form-button-group">
          <el-button type="primary" @click="handleSearch" plain>
            {{ $t('common.search') }}
          </el-button>
          <el-button @click="handleReset" plain>
            {{ $t('common.reset') }}
          </el-button>
        </el-form-item>
        <el-form-item class="form-right-button">
          <el-button type="primary" @click="handleAdd">
            {{ $t('systembasicmgmt.userInfo.addUser') }}
          </el-button>
          <el-button type="success" @click="handleExport" :loading="exportLoading">
            {{ $t('systembasicmgmt.userInfo.exportUsers') }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table :data="userList"
                  border
                  stripe
                  :header-cell-style="{ background: '#f5f7fa' }"
                  v-loading="loading"
                  class="conventional-table"
                  :empty-text="$t('common.noData')"
                  >
          <el-table-column type="index" :label="$t('systembasicmgmt.userInfo.index')" width="70" align="center" fixed />
          <el-table-column prop="userNo" :label="$t('systembasicmgmt.userInfo.userNo')" align="left" min-width="130" />
          <el-table-column prop="userNameCn" :label="$t('systembasicmgmt.userInfo.userNameCn')" align="left" min-width="150" />
          <el-table-column prop="userNameEn" :label="$t('systembasicmgmt.userInfo.userNameEn')" align="left" min-width="230" />
          <el-table-column prop="departmentName" :label="$t('systembasicmgmt.userInfo.department')" align="left" min-width="220" />
          <el-table-column prop="positionName" :label="$t('systembasicmgmt.userInfo.position')" align="left" min-width="120" />
          <el-table-column :label="$t('systembasicmgmt.userInfo.gender')" align="center" min-width="100">
            <template #default="scope">
              {{ getGenderText(scope.row.gender) }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('systembasicmgmt.userInfo.isEmployed')" align="center" min-width="120">
            <template #default="scope">
              <el-tag :type="scope.row.isEmployed === 1 ? 'success' : 'danger'">
                {{ scope.row.isEmployed === 1 ? $t('systembasicmgmt.userInfo.Employed') : $t('systembasicmgmt.userInfo.Resigned') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('systembasicmgmt.userInfo.isReview')" align="center" min-width="110">
            <template #default="scope">
              <el-tag :type="scope.row.isReview === 1 ? 'primary' : 'info'">
                {{ scope.row.isReview === 1 ? $t('common.yes') : $t('common.no') }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('systembasicmgmt.userInfo.operation')" min-width="170" fixed="right" align="center">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">{{ $t('common.edit') }}</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">{{ $t('common.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

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

    <el-dialog v-model="dialogVisible"
               :title="dialogTitle"
               width="75%"
               :close-on-click-modal="false"
               :append-to-body="true"
               :modal="true"
               :lock-scroll="true"
               destroy-on-close
               draggable
               @closed="handleDialogClose">
      <div v-loading="dialogLoading">
      <el-form :inline="true"
               :model="editForm"
               :rules="formRules"
               ref="editFormRef"
               label-width="120px"
               class="dialog-form"
               role="form"
               :aria-label="$t('systembasicmgmt.userInfo.ariaEditLabel')">
        <div class="form-row four-columns">
          <el-form-item :label="$t('systembasicmgmt.userInfo.userNo')" prop="userNo">
            <el-input v-model="editForm.userNo"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.userInfo.pleaseInputUserNo')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.userNameCn')" prop="userNameCn">
            <el-input v-model="editForm.userNameCn"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.userInfo.pleaseInputUserNameCn')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.userNameEn')" prop="userNameEn">
            <el-input v-model="editForm.userNameEn"
                      style="width:100%"
                      :placeholder="$t('systembasicmgmt.userInfo.pleaseInputUserNameEn')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.gender')" prop="gender">
            <el-select v-model="editForm.gender"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.userInfo.pleaseSelectGender')">
              <el-option v-for="item in genderOptions"
                         :key="`gender-${item.genderCode}`"
                         :label="item.genderName"
                         :value="item.genderCode" />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-row four-columns">
          <el-form-item :label="$t('systembasicmgmt.userInfo.hireDate')" prop="hireDate">
            <el-date-picker v-model="editForm.hireDate"
                            type="date"
                            style="width: 100%"
                            :placeholder="$t('systembasicmgmt.userInfo.pleaseSelectHireDate')"
                            format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.nationality')" prop="nationality">
            <el-select v-model="editForm.nationality"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.userInfo.pleaseSelectNationality')">
              <el-option v-for="item in nationalityOptions"
                         :key="`nationality-${item.nationId}`"
                         :label="item.nationName"
                         :value="item.nationId" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.laborType')" prop="laborId">
            <el-select v-model="editForm.laborId"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.userInfo.pleaseSelectLaborType')">
              <el-option v-for="item in laborTypeOptions"
                         :key="`labor-type-edit-${item.laborId}`"
                         :label="item.laborName"
                         :value="item.laborId" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.department')" prop="departmentId">
            <el-tree-select v-model="editForm.departmentId"
                            :data="departmentOptions"
                            :props="{ value: 'departmentId', label: 'departmentName', children: 'departmentChildList', disabled: 'disabled' }"
                            check-strictly
                            filterable
                            :filter-node-method="filterNodeMethod"
                            style="width:100%"
                            popper-class="main-dept-filter-popper"
                            :placeholder="$t('systembasicmgmt.userInfo.pleaseSelectDepartment')" />
          </el-form-item>
        </div>

        <div class="form-row four-columns">
          <el-form-item :label="$t('systembasicmgmt.userInfo.position')" prop="positionId">
            <el-select v-model="editForm.positionId"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.userInfo.pleaseSelectPosition')">
              <el-option v-for="item in positionOptions"
                         :key="`position-edit-${item.positionId}`"
                         :label="item.positionName"
                         :value="item.positionId"
                         :disabled="item.disabled" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.role')" prop="roleId">
            <el-select v-model="editForm.roleId"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.userInfo.pleaseSelectRole')">
              <el-option v-for="item in roleOptions"
                         :key="`role-edit-${item.roleId}`"
                         :label="item.roleName"
                         :value="item.roleId"
                         :disabled="item.disabled" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.loginNo')" prop="loginNo">
            <el-input v-model="editForm.loginNo"
                      style="width:100%"
                      autocomplete="off"
                      :placeholder="$t('systembasicmgmt.userInfo.pleaseInputLoginNo')" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.password')" prop="passWord">
            <el-input v-model="editForm.passWord"
                      type="password"
                      style="width:100%"
                      autocomplete="new-password"
                      :placeholder="$t('systembasicmgmt.userInfo.pleaseInputPassword')"
                      show-password />
          </el-form-item>
        </div>

        <div class="form-row four-columns">
          <el-form-item :label="$t('systembasicmgmt.userInfo.email')">
            <el-input v-model="editForm.email" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.phoneNumber')">
            <el-input v-model="editForm.phoneNumber" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.expirationDays')" prop="expirationDays">
            <el-select v-model="editForm.expirationDays"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.userInfo.pleaseInputExpirationDays')">
              <el-option :label="$t('systembasicmgmt.userInfo.expirationDaysOptions.30')" :value="30" />
              <el-option :label="$t('systembasicmgmt.userInfo.expirationDaysOptions.60')" :value="60" />
              <el-option :label="$t('systembasicmgmt.userInfo.expirationDaysOptions.90')" :value="90" />
              <el-option :label="$t('systembasicmgmt.userInfo.expirationDaysOptions.180')" :value="180" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.noticeLanguage')" prop="noticeLanguage">
            <el-select v-model="editForm.noticeLanguage"
                       style="width:100%"
                       :placeholder="$t('systembasicmgmt.userInfo.pleaseSelectNoticeLanguage')">
              <el-option :label="$t('login.languages.zh-CN')" value="zh-CN" />
              <el-option :label="$t('login.languages.en-US')" value="en-US" />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-row four-columns">
          <el-form-item :label="$t('systembasicmgmt.userInfo.isEmployed')">
            <el-switch v-model="editForm.isEmployed"
                       :active-value="1"
                       :inactive-value="0" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.isReview')">
            <el-switch v-model="editForm.isReview"
                       :active-value="1"
                       :inactive-value="0" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.isRealtimeNotification')">
            <el-switch v-model="editForm.isRealtimeNotification"
                       :active-value="1"
                       :inactive-value="0"
                       :disabled="editForm.isReview === 0" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.isScheduledNotification')">
            <el-switch v-model="editForm.isScheduledNotification"
                       :active-value="1"
                       :inactive-value="0"
                       :disabled="editForm.isReview === 0" />
          </el-form-item>
        </div>

        <div class="form-row four-columns">
          <el-form-item :label="$t('systembasicmgmt.userInfo.isAgent')">
            <el-switch v-model="editForm.isAgent"
                       :active-value="1"
                       :inactive-value="0"
                       :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.isPartTime')">
            <el-switch v-model="editForm.isPartTime"
                       :active-value="1"
                       :inactive-value="0"
                       :disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('systembasicmgmt.userInfo.isFreeze')">
            <el-switch v-model="editForm.isFreeze"
                       :active-value="1"
                       :inactive-value="0" />
          </el-form-item>
        </div>

        <div class="form-row full-width">
          <el-form-item :label="$t('systembasicmgmt.userInfo.avatar')" prop="avatarAddress">
            <el-upload class="avatar-uploader"
                       :http-request="customUpload"
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess"
                       :on-error="handleAvatarError"
                       :before-upload="beforeAvatarUpload"
                       accept=".jpg,.jpeg,.png">
              <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="avatar-tip">{{ $t('systembasicmgmt.userInfo.avatarTip') }}</div>
          </el-form-item>
        </div>
      </el-form>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import service, { post } from '@/utils/request'
import { resolveFileUrl } from '@/utils/fileUrl'
import {
  GET_USER_PAGES_API,
  INSERT_USER_API,
  DELETE_USER_API,
  GET_USER_ENTITY_API,
  UPDATE_USER_API,
  GET_DEPARTMENT_DROPDOWN_API,
  GET_USER_POSITION_DROPDOWN_API,
  GET_ROLE_DROPDOWN_API,
  GET_NATIONALITY_DROPDOWN_API,
  GET_LABOR_TYPE_DROPDOWN_API,
  EXPORT_USERS_EXCEL_API,
  UPLOAD_AVATAR_UPDATE_API,
  UPLOAD_AVATAR_INSERT_API
} from '@/config/api/systembasicmgmt/system-basicdata/user'

const { t } = useI18n()

const DEBOUNCE_MS = 300
let searchTimer = null

const userList = ref([])
const loading = ref(false)
const submitLoading = ref(false)
const exportLoading = ref(false)
const editFormRef = ref(null)

// 下拉选项
const departmentOptions = ref([])
const positionOptions = ref([])
const roleOptions = ref([])
// 性别下拉：固定选项，不再调用接口（后端按 HTTP 状态码处理；前端不依赖业务码）
const genderOptions = ref([])
const nationalityOptions = ref([])
const laborTypeOptions = ref([])

const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0
})

const filters = reactive({
  departmentId: '',
  userNo: '',
  userName: ''
})

const dialogVisible = ref(false)
const dialogLoading = ref(false)
const dialogTitle = ref(t('systembasicmgmt.userInfo.editUser'))

const editForm = reactive({
  userId: '',
  departmentId: '',
  positionId: '',
  userNo: '',
  userNameCn: '',
  userNameEn: '',
  roleId: '',
  gender: '',
  hireDate: '',
  nationality: '',
  email: '',
  phoneNumber: '',
  loginNo: '',
  passWord: '',
  pwdSalt: '',
  isReview: 0,
  isPartTime: 0,
  isRealtimeNotification: 0,
  isScheduledNotification: 0,
  isAgent: 0,
  isEmployed: 1,
  isFreeze: 0,
  laborId: '',
  expirationDays: null,
  modifiedBy: '',
  modifiedDate: '',
  avatarAddress: '',
  noticeLanguage: 'zh-CN'
})

// 头像地址（预览用）
const avatarUrl = ref('')

// 存储 isReview 关闭前的通知状态
const previousNotificationState = reactive({
  isRealtimeNotification: 0,
  isScheduledNotification: 0
})

// 加载/回填表单期间的保护标记：避免 watch(isReview) 在初始化赋值时误把通知强制开启
const isHydratingEditForm = ref(false)

const formRules = reactive({
  userNo: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseInputUserNo'), trigger: 'blur' }
  ],
  userNameCn: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseInputUserNameCn'), trigger: 'blur' }
  ],
  userNameEn: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseInputUserNameEn'), trigger: 'blur' }
  ],
  gender: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseSelectGender'), trigger: 'change' }
  ],
  hireDate: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseSelectHireDate'), trigger: 'change' }
  ],
  nationality: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseSelectNationality'), trigger: 'change' }
  ],
  laborId: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseSelectLaborType'), trigger: 'change' }
  ],
  departmentId: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseSelectDepartment'), trigger: 'change' }
  ],
  positionId: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseSelectPosition'), trigger: 'change' }
  ],
  roleId: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseSelectRole'), trigger: 'change' }
  ],
  loginNo: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseInputLoginNo'), trigger: 'blur' }
  ],
  expirationDays: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseSelectExpirationDays'), trigger: 'change' }
  ],
  noticeLanguage: [
    { required: true, message: () => t('systembasicmgmt.userInfo.pleaseSelectNoticeLanguage'), trigger: 'change' }
  ],
  passWord: [
    {
      validator: (rule, value, callback) => {
        // 新增时密码必填，编辑时密码可选
        const isAdd = !editForm.userId
        if (isAdd && !value) {
          callback(new Error(t('systembasicmgmt.userInfo.pleaseInputPassword')))
          return
        }
        if (!value) {
          callback()
          return
        }
        // 密码长度 8-16 个字符
        if (value.length < 8 || value.length > 16) {
          callback(new Error(t('systembasicmgmt.userInfo.passwordLengthError')))
          return
        }
        // 必须包含小写字母
        if (!/[a-z]/.test(value)) {
          callback(new Error(t('systembasicmgmt.userInfo.passwordLowercaseError')))
          return
        }
        // 必须包含大写字母
        if (!/[A-Z]/.test(value)) {
          callback(new Error(t('systembasicmgmt.userInfo.passwordUppercaseError')))
          return
        }
        // 必须包含数字
        if (!/[0-9]/.test(value)) {
          callback(new Error(t('systembasicmgmt.userInfo.passwordNumberError')))
          return
        }
        // 必须包含特殊字符
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
          callback(new Error(t('systembasicmgmt.userInfo.passwordSpecialCharError')))
          return
        }
        callback()
      },
      trigger: 'blur'
    }
  ]
})

const showMessage = (message, type = 'error') => {
  ElMessage({ message, type, plain: true, showClose: true })
}

/** 401/403 由全局拦截器统一处理，这里不再重复提示 */
const showApiError = (res, fallback = '') => {
  if (res?.code === 401 || res?.code === 403) return
  showMessage(res?.message || fallback, Number(res?.code) === 400 ? 'warning' : 'error')
}

// 规范化 0/1 开关字段：后端可能返回字符串 '0'/'1'，el-switch 使用数字 0/1 时会导致显示错误
const to01 = (val) => {
  if (val === '' || val === null || val === undefined) return val
  const n = Number(val)
  if (Number.isNaN(n)) return val
  return n
}

// 针对 el-switch（active/inactive-value=1/0）做兜底：任何非 0/1（尤其是 '0'/'1'/undefined）都可能导致显示异常
const normalizeSwitchField = (key, defaultValue = 0) => {
  const current = editForm[key]
  if (current === '' || current === null || current === undefined) {
    editForm[key] = defaultValue
    return
  }
  const n = to01(current)
  // 如果 to01 仍无法转换（例如后端返回非数字字符串），则回退默认值，避免 switch 误判为开启
  if (n === '' || n === null || n === undefined || Number.isNaN(Number(n))) {
    editForm[key] = defaultValue
    return
  }
  editForm[key] = n
}

const normalizeEditFormSwitches = () => {
  // 注意：isEmployed 默认 1（在职）；其它开关默认 0
  normalizeSwitchField('isEmployed', 1)
  normalizeSwitchField('isReview', 0)
  normalizeSwitchField('isRealtimeNotification', 0)
  normalizeSwitchField('isScheduledNotification', 0)
}

const pad2 = (n) => String(n).padStart(2, '0')

const formatYmd = (d) => {
  if (!d || isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/** 后端 HireDate 为 DateTime：ISO、/Date(ms)/、时间戳等 → el-date-picker 的 YYYY-MM-DD */
const normalizeHireDateFromApi = (val) => {
  if (val === null || val === undefined || val === '') return ''
  if (typeof val === 'string') {
    const msMatch = val.match(/\/Date\((-?\d+)\)\//)
    if (msMatch) {
      return formatYmd(new Date(Number(msMatch[1])))
    }
    const ymd = val.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`
    const ymdSlash = val.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/)
    if (ymdSlash) {
      return `${ymdSlash[1]}-${pad2(ymdSlash[2])}-${pad2(ymdSlash[3])}`
    }
    const d = new Date(val.includes('T') ? val : val.replace(' ', 'T'))
    return formatYmd(d)
  }
  if (typeof val === 'number') {
    return formatYmd(new Date(val))
  }
  return ''
}

/** 提交给后端 DateTime：YYYY-MM-DD（或历史 YYYY/MM/DD）→ 当日 00:00:00 */
const hireDateToDateTimePayload = (val) => {
  if (val === null || val === undefined || val === '') return val
  const s = String(val)
  const dash = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (dash) return `${dash[1]}-${dash[2]}-${dash[3]}T00:00:00`
  const slash = s.match(/^(\d{4})\/(\d{2})\/(\d{2})/)
  if (slash) return `${slash[1]}-${slash[2]}-${slash[3]}T00:00:00`
  return val
}

const getGenderText = (gender) => {
  if (String(gender) === '1') return t('systembasicmgmt.userInfo.genderOptions.male')
  if (String(gender) === '2') return t('systembasicmgmt.userInfo.genderOptions.female')
  return ''
}

// 树形选择器过滤方法
const filterNodeMethod = (value, data) => data.departmentName.includes(value)

/**
 * 性别下拉：固定选项
 * 说明：不再调用后端 GetGenderDropDown 接口，避免前端依赖业务码/字典接口。
 * 注意：genderCode 的取值需与后端契约一致（本项目：1=Male, 2=Female）。
 */
const initGenderOptions = () => {
  genderOptions.value = [
    { genderCode: '1', genderName: t('systembasicmgmt.userInfo.genderOptions.male') },
    { genderCode: '2', genderName: t('systembasicmgmt.userInfo.genderOptions.female') }
  ]
}

/**
 * 获取部门下拉数据（无 try/catch，按返回码处理）
 * @param {boolean} setDefaultFilter 是否设置筛选默认值
 * @param {boolean} setDefaultForm 是否设置编辑表单默认值
 */
const fetchDepartmentDropdown = async (setDefaultFilter = false, setDefaultForm = false) => {
  const res = await post(GET_DEPARTMENT_DROPDOWN_API.GET_DEPARTMENT_DROPDOWN, {})
  if (res?.code !== 200) {
    departmentOptions.value = []
    return
  }
  // 验证数据结构并过滤无效数据（递归验证部门树结构）
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
  departmentOptions.value = (Array.isArray(res.data) ? res.data : []).filter(validateDepartment)

  const firstEnabledDept = departmentOptions.value.find(item => !item.disabled)
  if (setDefaultFilter && firstEnabledDept && !filters.departmentId) {
    filters.departmentId = firstEnabledDept.departmentId
  }
  if (setDefaultForm && firstEnabledDept && !editForm.departmentId) {
    editForm.departmentId = firstEnabledDept.departmentId
  }
}

/**
 * 获取职位下拉数据（无 try/catch，按返回码处理）
 * @param {boolean} setDefaultForm 是否设置编辑表单默认值
 */
const fetchPositionDropdown = async (setDefaultForm = false) => {
  const res = await post(GET_USER_POSITION_DROPDOWN_API.GET_USER_POSITION_DROPDOWN, {})
  if (res?.code !== 200) {
    positionOptions.value = []
    return
  }
  // 验证数据结构并过滤无效数据
  positionOptions.value = (res.data || []).filter(item =>
    item && item.positionId !== undefined && item.positionId !== null &&
    item.positionName !== undefined && item.positionName !== null
  )
  if (setDefaultForm && !editForm.positionId) {
    const firstEnabled = positionOptions.value.find(item => !item.disabled)
    if (firstEnabled) editForm.positionId = firstEnabled.positionId
  }
}

/**
 * 获取角色下拉数据（无 try/catch，按返回码处理）
 * @param {boolean} setDefaultForm 是否设置编辑表单默认值
 */
const fetchRoleDropdown = async (setDefaultForm = false) => {
  const res = await post(GET_ROLE_DROPDOWN_API.GET_ROLE_DROPDOWN, {})
  if (res?.code !== 200) {
    roleOptions.value = []
    return
  }
  // 验证数据结构并过滤无效数据
  roleOptions.value = (res.data || []).filter(item =>
    item && item.roleId !== undefined && item.roleId !== null &&
    item.roleName !== undefined && item.roleName !== null
  )
  if (setDefaultForm && !editForm.roleId) {
    const firstEnabled = roleOptions.value.find(item => !item.disabled)
    if (firstEnabled) editForm.roleId = firstEnabled.roleId
  }
}

/** 获取国籍下拉数据（无 try/catch，按返回码处理） */
const fetchNationalityDropdown = async () => {
  const res = await post(GET_NATIONALITY_DROPDOWN_API.GET_NATIONALITY_DROPDOWN, {})
  if (res?.code !== 200) {
    nationalityOptions.value = []
    return
  }
  // 验证数据结构并过滤无效数据
  nationalityOptions.value = (res.data || []).filter(item =>
    item && item.nationId !== undefined && item.nationId !== null &&
    item.nationName !== undefined && item.nationName !== null
  )
}

/**
 * 获取就业类型下拉数据（无 try/catch，按返回码处理）
 * @param {boolean} setDefaultForm 是否设置编辑表单默认值
 */
const fetchLaborTypeDropdown = async (setDefaultForm = false) => {
  const res = await post(GET_LABOR_TYPE_DROPDOWN_API.GET_LABOR_TYPE_DROPDOWN, {})
  if (res?.code !== 200) {
    laborTypeOptions.value = []
    return
  }
  // 验证数据结构并过滤无效数据
  laborTypeOptions.value = (res.data || []).filter(item =>
    item && item.laborId !== undefined && item.laborId !== null &&
    item.laborName !== undefined && item.laborName !== null
  )
  if (setDefaultForm && !editForm.laborId) {
    const firstEnabled = laborTypeOptions.value.find(item => !item.disabled)
    if (firstEnabled) editForm.laborId = firstEnabled.laborId
  }
}

const fetchUserEntity = async (userId) => {
  const formData = new FormData()
  formData.append('userId', userId)
  const res = await post(GET_USER_ENTITY_API.GET_USER_ENTITY, formData)
  if (!(res?.code === 200 && res.data)) return

  isHydratingEditForm.value = true
  // 先保存通知状态，以便在 watch 触发前记录原始值
  if (res.data.isRealtimeNotification !== undefined && res.data.isScheduledNotification !== undefined) {
    previousNotificationState.isRealtimeNotification = res.data.isRealtimeNotification
    previousNotificationState.isScheduledNotification = res.data.isScheduledNotification
  }

  Object.assign(editForm, res.data)
  const reviewRaw = res.data.isReview ?? res.data.isApproval ?? res.data.IsApproval
  if (reviewRaw !== undefined && reviewRaw !== null && reviewRaw !== '') {
    editForm.isReview = to01(reviewRaw)
  }
  delete editForm.isApproval
  delete editForm.IsApproval
  // 规范化：el-switch 使用 active/inactive-value=1/0（数字），必须确保 v-model 也是数字 0/1
  normalizeEditFormSwitches()
  // 规范化：确保性别值与固定下拉选项 value 类型一致（字符串）
  if (editForm.gender !== null && editForm.gender !== undefined) {
    editForm.gender = String(editForm.gender)
  }
  editForm.hireDate = normalizeHireDateFromApi(res.data.hireDate ?? res.data.HireDate ?? editForm.hireDate)
  editForm.noticeLanguage = res.data.noticeLanguage ?? res.data.NoticeLanguage ?? editForm.noticeLanguage ?? 'zh-CN'

  if (res.data.avatarAddress) {
    // 使用统一的文件访问域名（区分 dev/test/prod）
    avatarUrl.value = resolveFileUrl(res.data.avatarAddress)
  }
  // 等待本轮响应式更新完成后再解除保护，确保初始化赋值不触发“自动开启通知”
  await nextTick()
  isHydratingEditForm.value = false
}

const fetchUserPages = async () => {
  loading.value = true
  const res = await post(GET_USER_PAGES_API.GET_USER_PAGES, {
    departmentId: filters.departmentId,
    userNo: filters.userNo,
    userName: filters.userName,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize
  })
  if (res?.code === 200) {
    // 列表字段也做 0/1 规范化，避免表格渲染判断使用 === 1 时不生效
    userList.value = (res.data || []).map((row) => ({
      ...row,
      isEmployed: to01(row?.isEmployed),
      isReview: to01(row?.isReview ?? row?.isApproval ?? row?.IsApproval),
      isRealtimeNotification: to01(row?.isRealtimeNotification),
      isScheduledNotification: to01(row?.isScheduledNotification)
    }))
    pagination.totalCount = res.totalCount || 0
  } else {
    showMessage(res?.message, Number(res?.code) === 400 ? 'warning' : 'error')
  }
  loading.value = false
}

const scheduleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  loading.value = true
  searchTimer = setTimeout(() => {
    pagination.pageIndex = 1
    fetchUserPages()
  }, DEBOUNCE_MS)
}

// 清除表单验证状态
const clearFormValidate = () => {
  nextTick(() => {
    try {
      editFormRef.value?.clearValidate()
    } catch {
      // 对话框尚未渲染完成时忽略
    }
  })
}

const resetEditForm = () => {
  Object.assign(editForm, {
    userId: '',
    userNo: '',
    userNameCn: '',
    userNameEn: '',
    hireDate: '',
    email: '',
    phoneNumber: '',
    loginNo: '',
    passWord: '',
    pwdSalt: '',
    isReview: 0,
    isPartTime: 0,
    isRealtimeNotification: 0,
    isScheduledNotification: 0,
    isAgent: 0,
    isEmployed: 1,
    isFreeze: 0,
    modifiedBy: '',
    modifiedDate: '',
    avatarAddress: '',
    noticeLanguage: 'zh-CN'
  })
  // 兜底：确保开关字段类型一致（避免被其它逻辑写入字符串）
  normalizeEditFormSwitches()

  // 重置下拉框为默认值
  nextTick(() => {
    const firstEnabledDept = departmentOptions.value.find(item => !item.disabled)
    if (firstEnabledDept) editForm.departmentId = firstEnabledDept.departmentId

    const firstEnabledPosition = positionOptions.value.find(item => !item.disabled)
    if (firstEnabledPosition) editForm.positionId = firstEnabledPosition.positionId

    const firstEnabledRole = roleOptions.value.find(item => !item.disabled)
    if (firstEnabledRole) editForm.roleId = firstEnabledRole.roleId

    if (genderOptions.value.length > 0) {
      editForm.gender = genderOptions.value[0].genderCode
    }
    if (nationalityOptions.value.length > 0) {
      editForm.nationality = nationalityOptions.value[0].nationId
    }

    const firstEnabledLaborType = laborTypeOptions.value.find(item => !item.disabled)
    if (firstEnabledLaborType) editForm.laborId = firstEnabledLaborType.laborId

    // expirationDays 无固定默认值，重置为 null
    editForm.expirationDays = null
    editForm.noticeLanguage = 'zh-CN'

    // 用嵌套 nextTick 等 Vue 冲刷完所有响应式变更后再清除验证状态
    // （同步调用 clearValidate 会在 Vue 冲刷前执行，无法拦截 change 触发的校验）
    clearFormValidate()
  })

  // 重置通知状态记录
  previousNotificationState.isRealtimeNotification = 0
  previousNotificationState.isScheduledNotification = 0
  // 重置头像
  avatarUrl.value = ''
}

/** 新增用户；错误处理遵循全局策略：code 401/403 不提示 */
const insertUser = async () => {
  submitLoading.value = true
  const params = {
    ...editForm,
    hireDate: hireDateToDateTimePayload(editForm.hireDate)
  }
  const res = await post(INSERT_USER_API.INSERT_USER, params)
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    resetEditForm()
    dialogVisible.value = false
    fetchUserPages()
  } else {
    showApiError(res)
  }
  submitLoading.value = false
}

/** 更新用户；错误处理遵循全局策略：code 401/403 不提示 */
const updateUser = async () => {
  submitLoading.value = true
  const params = {
    ...editForm,
    hireDate: hireDateToDateTimePayload(editForm.hireDate)
  }
  const res = await post(UPDATE_USER_API.UPDATE_USER, params)
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    dialogVisible.value = false
    fetchUserPages()
  } else {
    showApiError(res)
  }
  submitLoading.value = false
}

/** 删除用户；错误处理遵循全局策略：code 401/403 不提示 */
const deleteUser = async (userId) => {
  const formData = new FormData()
  formData.append('userId', userId)
  const res = await post(DELETE_USER_API.DELETE_USER, formData)
  if (res?.code === 200) {
    showMessage(res.message, 'success')
    fetchUserPages()
  } else {
    showApiError(res)
  }
}

const handleSearch = () => scheduleSearch()

// 部门下拉框变化时自动触发查询
const handleDepartmentChange = () => scheduleSearch()

const handleReset = () => {
  filters.userNo = ''
  filters.userName = ''
  // 重置部门下拉框为第一个未禁用的选项
  const firstEnabledDept = departmentOptions.value.find(item => !item.disabled)
  filters.departmentId = firstEnabledDept ? firstEnabledDept.departmentId : ''
  scheduleSearch()
}

const handlePageChange = () => {
  fetchUserPages()
}

const handleSizeChange = () => {
  pagination.pageIndex = 1
  fetchUserPages()
}

const handleExport = async () => {
  exportLoading.value = true
  try {
    const blob = await service({
      url: EXPORT_USERS_EXCEL_API.EXPORT_USERS_EXCEL,
      method: 'post',
      data: {
        departmentId: filters.departmentId,
        userNo: filters.userNo,
        userName: filters.userName
      },
      responseType: 'blob'
    })

    if (!(blob instanceof Blob) || blob.size === 0) {
      throw new Error(t('systembasicmgmt.userInfo.exportFailed'))
    }

    // 后端出错时会返回 JSON 而非 Excel，需要读出里面的错误信息
    if (blob.type && blob.type.includes('application/json')) {
      const text = await blob.text()
      let message = t('systembasicmgmt.userInfo.exportFailed')
      try {
        message = JSON.parse(text)?.message || message
      } catch {
        // 非 JSON 内容时沿用默认文案
      }
      throw new Error(message)
    }

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${t('systembasicmgmt.userInfo.exportFileName')}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    showMessage(t('systembasicmgmt.userInfo.exportSuccess'), 'success')
  } catch (error) {
    showMessage(error?.message || t('systembasicmgmt.userInfo.exportFailed'))
  } finally {
    exportLoading.value = false
  }
}

const handleAdd = async () => {
  // 重置表单（内部已经初始化了 previousNotificationState）
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.userInfo.addUser')
  dialogVisible.value = true
  dialogLoading.value = true
  // 重新获取下拉数据并设置编辑表单默认值
  await fetchDepartmentDropdown(false, true)
  await fetchPositionDropdown(true)
  await fetchRoleDropdown(true)
  initGenderOptions()
  await fetchLaborTypeDropdown(true)
  // 数据就绪后再清校验、收起遮罩，避免请求期间短暂显示必填红字
  clearFormValidate()
  dialogLoading.value = false
}

const handleEdit = async (row) => {
  resetEditForm()
  dialogTitle.value = t('systembasicmgmt.userInfo.editUser')
  dialogVisible.value = true
  dialogLoading.value = true
  // 重新获取下拉数据，编辑时不设置默认值
  await fetchDepartmentDropdown(false, false)
  await fetchPositionDropdown()
  await fetchRoleDropdown()
  initGenderOptions()
  await fetchLaborTypeDropdown()
  // 获取用户实体（内部已经初始化了 previousNotificationState）
  await fetchUserEntity(row.userId)
  // 数据就绪后再清校验、收起遮罩，避免请求期间短暂显示必填红字
  clearFormValidate()
  dialogLoading.value = false
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('systembasicmgmt.userInfo.deleteConfirm'),
      t('common.tip'),
      { confirmButtonText: t('common.confirm'), cancelButtonText: t('common.cancel'), type: 'warning' }
    )
  } catch {
    return
  }
  deleteUser(row.userId)
}

const handleSave = async () => {
  const valid = await editFormRef.value?.validate().catch(() => false)
  // 校验失败时 el-form 已在界面上标红，无需额外处理
  if (!valid) return
  if (!editForm.userId) {
    insertUser()
  } else {
    updateUser()
  }
}

// 头像上传前验证
const beforeAvatarUpload = (file) => {
  const isValidType = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isValidType) {
    showMessage(t('systembasicmgmt.userInfo.avatarFormatError'), 'warning')
    return false
  }
  if (!isLt5M) {
    showMessage(t('systembasicmgmt.userInfo.avatarSizeError'), 'warning')
    return false
  }

  return true
}

// 修改用户信息用 UPLOAD_AVATAR_UPDATE_API，新增用户用 UPLOAD_AVATAR_INSERT_API
const customUpload = async (options) => {
  const formData = new FormData()
  const isAdd = !editForm.userId
  if (!isAdd) formData.append('userId', editForm.userId || '')
  formData.append('file', options.file)
  const uploadUrl = isAdd ? UPLOAD_AVATAR_INSERT_API.UPLOAD_AVATAR_INSERT : UPLOAD_AVATAR_UPDATE_API.UPLOAD_AVATAR_UPDATE
  const res = await post(uploadUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (res?.code === 200) {
    return res
  }
  throw new Error(res?.message || t('common.operationFailed'))
}

const handleAvatarError = (error) => {
  showMessage(error?.message || t('systembasicmgmt.userInfo.avatarUploadFailed'))
}

const handleAvatarSuccess = (res) => {
  const avatarAddress = res?.data
  if (!avatarAddress) {
    handleAvatarError(new Error(t('systembasicmgmt.userInfo.avatarUploadFailed')))
    return
  }
  editForm.avatarAddress = avatarAddress
  avatarUrl.value = resolveFileUrl(avatarAddress)
  showMessage(t('systembasicmgmt.userInfo.avatarUploadSuccess'), 'success')
}

const handleDialogClose = () => {
  resetEditForm()
  dialogLoading.value = false
  editFormRef.value?.clearValidate()
}

// 监听签核权限开关：关闭时同步关闭通知，重新开启时自动恢复通知
watch(() => editForm.isReview, (newValue, oldValue) => {
  if (isHydratingEditForm.value) return
  // 只有当值真正变化且不是初始化时才执行逻辑
  if (oldValue === undefined) return
  if (newValue === 0) {
    // 关闭签核权限：先记录当前通知状态，再关闭所有通知
    previousNotificationState.isRealtimeNotification = editForm.isRealtimeNotification
    previousNotificationState.isScheduledNotification = editForm.isScheduledNotification
    editForm.isRealtimeNotification = 0
    editForm.isScheduledNotification = 0
  } else if (newValue === 1 && oldValue === 0) {
    // 从关闭变为开启：自动启用实时和定时通知
    editForm.isRealtimeNotification = 1
    editForm.isScheduledNotification = 1
  }
})

onMounted(async () => {
  // 获取下拉数据并设置筛选条件默认值
  await fetchDepartmentDropdown(true, false)
  await fetchPositionDropdown()
  initGenderOptions()
  await fetchNationalityDropdown()
  await fetchLaborTypeDropdown()
  fetchUserPages()
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
@import '@/assets/styles/conventionalTablePage.css';

.avatar-uploader {
  text-align: center;
  display: inline-block;
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
  margin-top: 8px;
  text-align: right;
  padding-left: 20px;
}

/* 四列布局样式 */
.dialog-form .form-row.four-columns .el-form-item {
  flex: 0 0 calc(25% - 15px);
  margin-right: 20px;
}

.dialog-form .form-row.four-columns .el-form-item:last-child {
  margin-right: 0;
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
