<template>
  <div v-if="multiline" class="kw-field el-textarea is-disabled">
    <span class="el-textarea__inner kw-field-inner kw-field-inner--multiline" :rows="rows" v-html="highlighted"></span>
  </div>
  <div v-else class="kw-field el-input is-disabled" :class="[size ? `el-input--${size}` : '']">
    <div class="el-input__wrapper">
      <span v-if="prefixIcon" class="el-input__prefix">
        <span class="el-input__prefix-inner">
          <el-icon><component :is="prefixIcon" /></el-icon>
        </span>
      </span>
      <span class="el-input__inner kw-field-inner" v-html="highlighted"></span>
      <span v-if="suffixArrow" class="el-input__suffix">
        <span class="el-input__suffix-inner">
          <el-icon><ArrowDown /></el-icon>
        </span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElIcon } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { highlightKeywordHtml } from '@/utils/keywordHighlight'

const props = defineProps({
  value: { type: [String, Number], default: '' },
  keyword: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  prefixIcon: { type: [Object, Function], default: null },
  suffixArrow: { type: Boolean, default: false },
  size: { type: String, default: '' },
  multiline: { type: Boolean, default: false },
  rows: { type: [String, Number], default: 3 }
})

const displayText = computed(() => {
  const v = props.value
  if (v === undefined || v === null || v === '') return props.placeholder || ''
  return String(v)
})

const highlighted = computed(() => highlightKeywordHtml(displayText.value, props.keyword))
</script>

<style scoped>
.kw-field {
  width: 100%;
}

.kw-field-inner {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kw-field-inner--multiline {
  display: block;
  min-height: calc(1.5em * v-bind(rows) + 12px);
  white-space: pre-wrap;
  word-break: break-word;
}

/* 强制统一禁用态配色，避免不同浏览器/上层样式渲染深浅不一致 */
.kw-field .el-input__wrapper,
.kw-field .el-textarea__inner {
  background-color: var(--el-disabled-bg-color, #f5f7fa) !important;
  box-shadow: 0 0 0 1px var(--el-disabled-border-color, #e4e7ed) inset !important;
}

.kw-field .el-input__inner,
.kw-field .el-textarea__inner {
  color: var(--el-disabled-text-color, #a8abb2);
  -webkit-text-fill-color: var(--el-disabled-text-color, #a8abb2);
}
</style>
