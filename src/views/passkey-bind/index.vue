<template>
  <div class="passkey-bind-container">
    <div class="passkey-bind-box">
      <div class="passkey-bind-header">
        <el-icon class="passkey-bind-icon"><Key /></el-icon>
        <h1 class="title">{{ $t('passkeyBind.title') }}</h1>
        <p class="subtitle">{{ $t('passkeyBind.subtitle') }}</p>
      </div>

      <div class="passkey-bind-body" v-loading="state === 'loading'">
        <!-- 浏览器不支持 -->
        <el-alert v-if="state === 'unsupported'" type="warning" :closable="false" show-icon :title="$t('passkeyBind.unsupported')" />

        <!-- 链接无效 / 已使用 / 已失效 / 已过期 / 加载失败：只显示提示，不显示表单 -->
        <el-alert v-else-if="state === 'invalid'" type="error" :closable="false" show-icon :title="errorMessage" />

        <!-- 绑定成功：不自动登录 -->
        <el-result v-else-if="state === 'success'" icon="success" :title="$t('passkeyBind.successTitle')" :sub-title="successMessage">
          <template #extra>
            <el-button type="primary" class="passkey-bind-button" @click="goLogin">{{ $t('passkeyBind.goLogin') }}</el-button>
          </template>
        </el-result>

        <template v-else-if="state === 'ready'">
          <el-descriptions :column="1" border class="passkey-bind-info">
            <el-descriptions-item :label="$t('passkeyBind.userName')">{{ displayName }}</el-descriptions-item>
            <el-descriptions-item :label="$t('passkeyBind.userNo')">{{ userInfo.userNo }}</el-descriptions-item>
            <el-descriptions-item :label="$t('passkeyBind.email')">{{ userInfo.email }}</el-descriptions-item>
            <el-descriptions-item :label="$t('passkeyBind.expiresAt')">{{ expiresText }}</el-descriptions-item>
          </el-descriptions>

          <p v-if="userInfo.passkeyCount > 0" class="passkey-bind-existing">
            {{ $t('passkeyBind.existingCount', { count: userInfo.passkeyCount }) }}
          </p>

          <el-form class="passkey-bind-form" label-position="top" @submit.prevent>
            <el-form-item :label="$t('passkeyBind.deviceNameLabel')">
              <el-input
                v-model="deviceName"
                :maxlength="PASSKEY_DEVICE_NAME_MAX_LENGTH"
                show-word-limit
                :placeholder="$t('passkeyBind.deviceNamePlaceholder')"
                :disabled="binding"
                @keyup.enter="handleBind"
              />
            </el-form-item>
          </el-form>

          <!-- 绑定失败但链接仍有效时的提示（如已达数量上限） -->
          <el-alert v-if="actionError" type="error" :closable="false" show-icon :title="actionError" class="passkey-bind-action-error" />

          <el-button type="primary" class="passkey-bind-button" :loading="binding" :disabled="binding" @click="handleBind">
            {{ $t('passkeyBind.bindButton') }}
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Key } from '@element-plus/icons-vue'
import { startRegistration } from '@simplewebauthn/browser'
import { post, isHandled } from '@/utils/request'
import { PASSKEY_BIND_API } from '@/config/api/login/api'
import { getLocationQueryParam } from '@/utils/hashRouteBootstrap'
import { isPasskeySupported, isPasskeyCancelled, PASSKEY_DEVICE_NAME_MAX_LENGTH } from '@/utils/passkey'

const { t, locale } = useI18n()
const router = useRouter()

// 匿名接口：遇到 401/403 不跳转登录页/403 页，只把失败响应交回页面展示
const ANONYMOUS_OPTIONS = {
  silentAuthError: false,
  silentForbiddenError: false,
  disableAutoLogout: true,
  allowLoginBusinessCodes: true
}

// loading | unsupported | invalid | ready | success
const state = ref('loading')
const errorMessage = ref('')
const actionError = ref('')
const successMessage = ref('')
const userInfo = ref({})
const deviceName = ref(t('passkeyBind.deviceNameDefault'))
const binding = ref(false)

// token 只保存在内存里，不写入 localStorage / 日志
let token = ''

const displayName = computed(() => {
  const { userNameCn, userNameEn } = userInfo.value
  return locale.value === 'zh-CN' ? (userNameCn || userNameEn || '') : (userNameEn || userNameCn || '')
})

const expiresText = computed(() => {
  const value = userInfo.value.expiresAt
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const setInvalid = (message) => {
  errorMessage.value = message || t('passkeyBind.loadFailed')
  state.value = 'invalid'
}

/** 取绑定用户信息；失败时返回 message，成功时返回 null */
const loadUserInfo = async () => {
  const res = await post(PASSKEY_BIND_API.GET_USER_INFO, { token }, ANONYMOUS_OPTIONS)
  if (isHandled(res)) return t('passkeyBind.loadFailed')
  if (res?.code !== 200 || !res.data) return res?.message || t('passkeyBind.loadFailed')
  userInfo.value = res.data
  return null
}

/**
 * 绑定接口失败后判断链接是否还有效：
 * 链接已使用 / 已失效 / 已过期时隐藏表单只显示提示；仍有效（如数量上限）则保留表单并展示失败原因
 */
const handleBindFailure = async (message) => {
  const linkError = await loadUserInfo()
  if (linkError) {
    setInvalid(linkError)
  } else {
    actionError.value = message || t('passkeyBind.bindFailed')
  }
}

const handleBind = async () => {
  if (binding.value) return
  const name = deviceName.value.trim()
  binding.value = true
  actionError.value = ''
  try {
    const optionsRes = await post(PASSKEY_BIND_API.OPTIONS, { token }, ANONYMOUS_OPTIONS)
    if (isHandled(optionsRes)) return
    if (optionsRes?.code !== 200) {
      await handleBindFailure(optionsRes?.message)
      return
    }

    const attestation = await startRegistration({ optionsJSON: optionsRes.data })

    const completeRes = await post(
      PASSKEY_BIND_API.COMPLETE,
      { token, deviceName: name || null, attestation },
      ANONYMOUS_OPTIONS
    )
    if (isHandled(completeRes)) return
    if (completeRes?.code !== 200) {
      await handleBindFailure(completeRes?.message)
      return
    }

    successMessage.value = completeRes.message || t('passkeyBind.successDefault')
    state.value = 'success'
  } catch (error) {
    // 取消弹窗：静默，停留在表单可再次点击
    if (isPasskeyCancelled(error)) return
    actionError.value = error?.name === 'InvalidStateError'
      ? t('passkeyBind.alreadyBound')
      : t('passkeyBind.bindFailed')
  } finally {
    binding.value = false
  }
}

const goLogin = () => {
  router.replace('/login')
}

onMounted(async () => {
  if (!isPasskeySupported()) {
    state.value = 'unsupported'
    return
  }

  // history 路由下参数在 search，兼容 hash 内携带参数的外链
  token = getLocationQueryParam('token', 'Token')
  if (!token) {
    setInvalid(t('passkeyBind.linkInvalid'))
    return
  }

  const linkError = await loadUserInfo()
  if (linkError) {
    setInvalid(linkError)
    return
  }
  state.value = 'ready'
})
</script>

<style scoped>
.passkey-bind-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  background: linear-gradient(160deg, #ffffff 0%, #f6f7f9 100%);
}

.passkey-bind-box {
  width: 480px;
  max-width: 100%;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.passkey-bind-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 24px 8px;
  text-align: center;
}

.passkey-bind-icon {
  font-size: 44px;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: #909399;
}

.passkey-bind-body {
  min-height: 80px;
  padding: 20px 40px 36px;
}

.passkey-bind-info {
  margin-bottom: 12px;
}

.passkey-bind-info :deep(.el-descriptions__label) {
  width: 110px;
}

.passkey-bind-existing {
  margin: 0 0 12px;
  font-size: 13px;
  color: #606266;
}

.passkey-bind-form {
  margin-top: 8px;
}

.passkey-bind-action-error {
  margin-bottom: 12px;
}

.passkey-bind-button {
  width: 100%;
  height: 42px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

.passkey-bind-button:hover,
.passkey-bind-button:focus {
  background: #303133;
  border-color: #303133;
  color: #ffffff;
}

@media screen and (max-width: 576px) {
  .passkey-bind-box {
    border-radius: 16px;
  }

  .passkey-bind-body {
    padding: 16px 20px 28px;
  }
}
</style>
