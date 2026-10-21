import { ElMessage, ElMessageBox } from 'element-plus'
import { startRegistration, browserSupportsWebAuthn } from '@simplewebauthn/browser'
import i18n from '@/i18n'
import { post, isHandled } from '@/utils/request'
import { PASSKEY_API } from '@/config/api/systembasicmgmt/system-basicdata/personal'

const t = (key, params) => i18n.global.t(key, params)

/** 稍后再提示的标记：仅记录“用户点了稍后”，不存任何 Passkey 凭据；退出登录时由 sessionCleanup 清除 */
const PASSKEY_PROMPT_DISMISSED_KEY = 'passkey_prompt_dismissed'

/** 设备名称最大长度 */
export const PASSKEY_DEVICE_NAME_MAX_LENGTH = 100

/** 浏览器是否支持 WebAuthn；不支持时隐藏所有 Passkey 入口 */
export const isPasskeySupported = () => {
  try {
    return browserSupportsWebAuthn()
  } catch {
    return false
  }
}

/** 用户在浏览器弹窗里取消 */
export const isPasskeyCancelled = (error) =>
  error?.name === 'NotAllowedError' || error?.name === 'AbortError'

const showError = (message) => {
  ElMessage({ message, type: 'error', plain: true, showClose: true })
}

/**
 * 弹出输入框取设备名称
 * @returns {Promise<string|null>} 用户取消时返回 null
 */
export const promptPasskeyDeviceName = async (options = {}) => {
  const {
    title = t('passkey.addTitle'),
    defaultValue = t('passkey.deviceNameDefault')
  } = options
  try {
    const { value } = await ElMessageBox.prompt(t('passkey.deviceNameLabel'), title, {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      inputValue: defaultValue,
      inputValidator: (val) => {
        const name = String(val ?? '').trim()
        if (!name) return t('passkey.deviceNameRequired')
        return name.length <= PASSKEY_DEVICE_NAME_MAX_LENGTH || t('passkey.deviceNameTooLong')
      }
    })
    return String(value).trim()
  } catch {
    return null
  }
}

/**
 * 添加 Passkey 完整流程：填设备名称 → 取注册参数 → 浏览器创建凭据 → 提交
 * 用户取消（输入框或浏览器弹窗）静默处理。
 * @returns {Promise<'success'|'cancelled'|'failed'>}
 */
export const registerPasskey = async () => {
  const deviceName = await promptPasskeyDeviceName()
  if (deviceName === null) return 'cancelled'

  try {
    const optionsRes = await post(PASSKEY_API.REGISTER_OPTIONS, {})
    if (isHandled(optionsRes)) return 'failed'
    if (optionsRes?.code !== 200) {
      showError(optionsRes?.message || t('passkey.addFailed'))
      return 'failed'
    }

    const attestation = await startRegistration({ optionsJSON: optionsRes.data })

    const completeRes = await post(PASSKEY_API.REGISTER_COMPLETE, { deviceName, attestation })
    if (isHandled(completeRes)) return 'failed'
    if (completeRes?.code !== 200) {
      showError(completeRes?.message || t('passkey.addFailed'))
      return 'failed'
    }

    ElMessage({ message: completeRes.message || t('passkey.addSuccess'), type: 'success', plain: true, showClose: true })
    return 'success'
  } catch (error) {
    if (isPasskeyCancelled(error)) return 'cancelled'
    if (error?.name === 'InvalidStateError') {
      showError(t('passkey.alreadyRegistered'))
      return 'failed'
    }
    showError(t('passkey.addFailed'))
    return 'failed'
  }
}

/** 当前账号是否已绑定 Passkey；查询失败时返回 null（无法确认） */
const hasBoundPasskey = async () => {
  try {
    const res = await post(PASSKEY_API.GET_LIST, {})
    if (isHandled(res) || res?.code !== 200) return null
    return Array.isArray(res.data) && res.data.length > 0
  } catch {
    return null
  }
}

/**
 * 账密登录成功后的绑定引导：已绑定过 Passkey 的账号不弹；点“稍后”后不再提示；浏览器不支持 WebAuthn 时不弹
 */
export const promptBindPasskey = async () => {
  if (!isPasskeySupported()) return
  try {
    if (localStorage.getItem(PASSKEY_PROMPT_DISMISSED_KEY)) return
  } catch {
    // localStorage 不可用时按未记录处理
  }

  // 已绑定则不打扰；无法确认是否已绑定时也不弹，避免对已绑定用户误提示
  if ((await hasBoundPasskey()) !== false) return

  try {
    await ElMessageBox.confirm(t('passkey.promptMessage'), t('passkey.promptTitle'), {
      confirmButtonText: t('passkey.promptAddNow'),
      cancelButtonText: t('passkey.promptLater'),
      distinguishCancelAndClose: true,
      closeOnClickModal: false,
      type: 'info'
    })
  } catch (action) {
    if (action === 'cancel') {
      try {
        localStorage.setItem(PASSKEY_PROMPT_DISMISSED_KEY, '1')
      } catch {
        // ignore
      }
    }
    return
  }

  await registerPasskey()
}
