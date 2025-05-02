<template>
  <div></div>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onBeforeMount(() => {
  const { params, query } = route
  const { path } = params
  
  // 构建完整路径
  let targetPath = '/' + path
  
  // 添加查询参数
  const queryParams = Object.keys(query).map(key => {
    return `${key}=${query[key]}`
  }).join('&')
  
  if (queryParams) {
    targetPath = `${targetPath}?${queryParams}`
  }
  
  // 重定向到目标路径
  router.replace({ path: targetPath })
})
</script> 