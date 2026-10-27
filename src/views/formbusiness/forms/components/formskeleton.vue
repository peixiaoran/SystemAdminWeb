<template>
  <el-card class="sk-card" shadow="never">
    <el-skeleton animated>
      <template #template>
        <div class="sk-title-row">
          <el-skeleton-item variant="text" class="sk-title" />
        </div>
        <div class="sk-divider"></div>

        <div class="sk-body">
          <div class="sk-grid">
            <el-skeleton-item v-for="n in 3" :key="`sk-info-${n}`" variant="text" class="sk-control" />
          </div>
          <div class="sk-divider sk-divider--section"></div>

          <el-skeleton-item variant="text" class="sk-row" />
          <el-skeleton-item variant="text" class="sk-row" />
          <el-skeleton-item variant="text" class="sk-block" />
          <div class="sk-divider sk-divider--section"></div>

          <el-skeleton-item variant="text" class="sk-block sk-block--short" />

          <div class="sk-actions">
            <div v-if="!readonly" class="sk-actions-buttons">
              <el-skeleton-item v-for="n in 3" :key="`sk-btn-${n}`" variant="button" class="sk-action-btn" />
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </el-card>

  <el-card class="sk-card sk-card--log" shadow="never">
    <el-skeleton animated>
      <template #template>
        <div class="sk-log">
          <el-skeleton-item variant="text" class="sk-section-title" />
          <el-skeleton-item variant="text" class="sk-block sk-block--log" />
        </div>
      </template>
    </el-skeleton>
  </el-card>
</template>

<script setup>
/** 表单页通用骨架屏：只示意大致版式（标题、信息行、文本块、按钮、审批记录），不与具体控件一一对应 */
defineProps({
  // 只读页（_v）没有操作按钮
  readonly: { type: Boolean, default: false }
})
</script>

<style scoped>
.sk-card {
  max-width: 1000px;
  margin: 0 auto;
  border: 1.5px solid #c0c4cc;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  background: #ffffff;
  overflow: visible;
}

.sk-card--log {
  margin-top: 10px;
}

.sk-title-row {
  text-align: center;
  margin-bottom: 24px;
}

.sk-title {
  display: inline-block;
  width: 180px;
  height: 26px;
}

.sk-divider {
  height: 1px;
  margin: 22px 0;
  background: var(--el-border-color-lighter);
}

.sk-divider--section {
  margin: 6px 0 24px;
}

.sk-body {
  padding: 0 20px;
}

.sk-grid {
  display: flex;
  gap: 0 16px;
}

.sk-grid .sk-control {
  flex: 1;
  min-width: 0;
}

.sk-control {
  height: 32px;
}

.sk-row {
  display: block;
  width: 100%;
  height: 32px;
  margin-bottom: 18px;
}

.sk-block {
  display: block;
  width: 100%;
  height: 94px;
  margin-bottom: 18px;
}

.sk-block--short {
  height: 76px;
}

.sk-actions {
  display: flex;
  min-height: 32px;
  margin: 24px 0 18px;
}

.sk-actions-buttons {
  display: flex;
  gap: 12px;
}

.sk-action-btn {
  width: 80px;
  height: 32px;
}

.sk-log {
  padding: 0 20px 20px;
}

.sk-section-title {
  width: 90px;
  height: 22px;
  margin-bottom: 12px;
}

.sk-block--log {
  height: 220px;
  margin-bottom: 0;
}
</style>
