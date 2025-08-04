<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
// App.vue中不进行缓存清除，保持路由数据的持久性
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: '微软雅黑', Arial, sans-serif;
}

#app {
  width: 100%;
  height: 100vh;
}

/* 全局路由过渡效果 - 淡入淡出 */
.fade-enter-active {
  transition: opacity 0.15s ease-in-out;
}

.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>

