/**
 * 关键字高亮：综合查询关键字搜索命中后，在表单查看页(_v)标黄提示来源字段
 */
export function resolveRouteKeyword (route) {
  return String(route?.query?.keyword ?? route?.query?.Keyword ?? '').trim()
}

const escapeHtml = (str) => String(str ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * 纯文本展示场景：只标黄命中的关键字子串，而非整段文本
 */
export function highlightKeywordHtml (value, keyword) {
  const escapedText = escapeHtml(value ?? '-')
  const kw = String(keyword ?? '').trim()
  if (!kw) return escapedText
  const pattern = new RegExp(escapeRegExp(escapeHtml(kw)), 'gi')
  return escapedText.replace(pattern, (match) => `<mark class="kw-hit-text">${match}</mark>`)
}

/**
 * 富文本 HTML 展示场景（如内容摘要）：解析出的文本节点逐个标黄命中的关键字子串，
 * 不破坏原有标签结构（表格/颜色/对齐等内联样式保持不变）
 */
export function highlightHtmlContent (html, keyword) {
  const source = String(html ?? '')
  const kw = String(keyword ?? '').trim()
  if (!kw || !source) return source
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return source

  try {
    const parser = new window.DOMParser()
    const doc = parser.parseFromString(`<div>${source}</div>`, 'text/html')
    const root = doc.body.firstElementChild
    if (!root) return source

    const pattern = new RegExp(escapeRegExp(kw), 'gi')
    const walker = doc.createTreeWalker(root, window.NodeFilter.SHOW_TEXT)
    const textNodes = []
    let node
    while ((node = walker.nextNode())) {
      pattern.lastIndex = 0
      if (pattern.test(node.nodeValue)) textNodes.push(node)
    }

    textNodes.forEach((textNode) => {
      const text = textNode.nodeValue
      const frag = doc.createDocumentFragment()
      let lastIndex = 0
      pattern.lastIndex = 0
      let match
      while ((match = pattern.exec(text))) {
        if (match.index > lastIndex) {
          frag.appendChild(doc.createTextNode(text.slice(lastIndex, match.index)))
        }
        const mark = doc.createElement('mark')
        mark.className = 'kw-hit-text'
        mark.textContent = match[0]
        frag.appendChild(mark)
        lastIndex = match.index + match[0].length
        if (match[0].length === 0) pattern.lastIndex += 1
      }
      if (lastIndex < text.length) {
        frag.appendChild(doc.createTextNode(text.slice(lastIndex)))
      }
      textNode.parentNode.replaceChild(frag, textNode)
    })

    return root.innerHTML
  } catch {
    return source
  }
}
