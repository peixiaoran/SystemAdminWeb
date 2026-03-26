<template>
  <div class="redirect-container">
    <el-icon class="redirect-icon" :size="32"><Loading /></el-icon>
    <p class="redirect-text">{{ $t('common.loading') }}</p>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loading } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

onBeforeMount(() => {
  const { params, query } = route
  const { path } = params

  let targetPath = '/' + path

  const queryParams = Object.keys(query).map(key => {
    return `${key}=${query[key]}`
  }).join('&')

  if (queryParams) {
    targetPath = `${targetPath}?${queryParams}`
  }

  router.replace({ path: targetPath })
})
</script>

<style scoped>
/* 与登录页 login-container 同基调：白底、居中，无按钮（仅路由中转） */
.redirect-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  height: 100vh;
  background: #fff;
  color: #606266;
  font-size: 14px;
}

.redirect-icon {
  color: #1a1a1a;
  animation: redirect-rotate 1s linear infinite;
}

.redirect-text {
  margin: 0;
  letter-spacing: 0.5px;
}

@keyframes redirect-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
