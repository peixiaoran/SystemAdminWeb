/**
 * 设备准入检测：本系统仅支持 PC 端访问，手机 / 平板等非电脑设备显示提示页。
 *
 * 说明：
 * - 以“设备类型”判断，而不是窗口宽度，所以 PC 上缩小浏览器窗口不会被拦截。
 * - 这只是前端体验层面的限制，不是安全措施（UA 可被伪装）。
 */

const MOBILE_UA_RE =
  /Android|iPhone|iPad|iPod|Windows Phone|IEMobile|BlackBerry|BB10|Opera Mini|Mobile|HarmonyOS|OpenHarmony|Tablet|Silk|Kindle|PlayBook/i

export function isUnsupportedDevice() {
  if (typeof navigator === 'undefined') return false

  // 1. Chromium 提供的 Client Hints（最可靠）
  if (navigator.userAgentData && navigator.userAgentData.mobile === true) return true

  // 2. 传统 UA 判断（覆盖手机、安卓平板、iPad 旧版 UA 等）
  const ua = navigator.userAgent || ''
  if (MOBILE_UA_RE.test(ua)) return true

  // 3. iPadOS 13+ 默认伪装成 Mac：平台是 Mac 却支持多点触控，则判定为 iPad
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true

  return false
}

const MESSAGES = {
  'zh-CN': {
    title: '请使用电脑访问',
    desc: '本系统暂不支持手机、平板等移动设备访问。',
    hint: '请在 PC 端浏览器（推荐 Chrome / Edge）中打开本页面。',
    docTitle: '工作流管理系统'
  },
  'en-US': {
    title: 'Please use a computer',
    desc: 'This system is not available on phones, tablets or other mobile devices.',
    hint: 'Please open this page in a desktop browser (Chrome / Edge recommended).',
    docTitle: 'Workflow System'
  }
}

/** 根据浏览器语言选择提示语：中文系（zh-*）显示中文，其余显示英文 */
function resolveLanguage() {
  const langs = (navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || '']
  )
  const first = String(langs[0] || '').toLowerCase()
  return first.startsWith('zh') ? 'zh-CN' : 'en-US'
}

/** 渲染纯 DOM 的提示页（不依赖 Vue / Element Plus / i18n，保证首屏即可显示） */
export function renderUnsupportedNotice() {
  const msg = MESSAGES[resolveLanguage()]
  document.title = msg.docTitle

  const root = document.getElementById('app') || document.body
  root.innerHTML = `
    <div style="
      box-sizing:border-box;min-height:100vh;display:flex;flex-direction:column;
      align-items:center;justify-content:center;padding:32px 24px;text-align:center;
      background:#f5f7fa;color:#303133;
      font-family:'微软雅黑',-apple-system,BlinkMacSystemFont,Arial,sans-serif;">
      <svg viewBox="0 0 24 24" width="72" height="72" fill="none" stroke="#409eff"
           stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="13" rx="2"></rect>
        <path d="M8 21h8M12 17v4"></path>
      </svg>
      <h1 style="margin:24px 0 12px;font-size:22px;font-weight:600;">${msg.title}</h1>
      <p style="margin:0 0 8px;font-size:15px;color:#606266;line-height:1.6;">${msg.desc}</p>
      <p style="margin:0;font-size:13px;color:#909399;line-height:1.6;">${msg.hint}</p>
    </div>
  `
}
