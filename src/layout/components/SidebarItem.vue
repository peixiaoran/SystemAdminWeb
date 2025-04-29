<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <!-- 没有子路由的情况 -->
    <template v-if="!item.children || item.children.length === 0">
      <el-menu-item :index="resolvePath(item.path)" :class="{ 'is-first-level': !isNested }">
        <el-icon v-if="item.meta && item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>{{ item.meta ? item.meta.title : item.name }}</template>
      </el-menu-item>
    </template>
    
    <!-- 有子路由的情况 -->
    <el-sub-menu v-else :index="resolvePath(item.path)" :class="{ 'is-first-level': !isNested }">
      <template #title>
        <el-icon v-if="item.meta && item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta ? item.meta.title : item.name }}</span>
      </template>
      
      <template v-for="child in item.children" :key="child.path">
        <!-- 递归渲染子菜单 -->
        <sidebar-item
          :item="child"
          :base-path="resolvePath(child.path)"
          :is-nested="true"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  },
  isNested: {
    type: Boolean,
    default: false
  }
})

// 判断是否有子路由
const hasChildren = (children = []) => {
  if (!children || children.length === 0) {
    return false
  }
  
  const showingChildren = children.filter(item => {
    return !(item.meta && item.meta.hidden)
  })
  
  return showingChildren.length > 0
}

// 自定义路径解析函数
const resolvePath = (routePath) => {
  if (routePath.startsWith('/')) {
    return routePath
  }
  
  // 简单的路径拼接
  const basePath = props.basePath.endsWith('/') ? props.basePath : props.basePath + '/'
  return basePath + routePath
}
</script>

<style scoped>
.el-menu-item {
  padding-left: 20px !important;
  width: 100%;
}

.el-menu-item:hover {
  background-color: #ecf5ff !important;
}

.el-sub-menu :deep(.el-sub-menu__title) {
  padding-left: 20px !important;
  width: 100%;
}

.el-sub-menu :deep(.el-sub-menu__title:hover) {
  background-color: #ecf5ff !important;
}

/* 一级菜单样式 */
.is-first-level {
  font-weight: bold;
}

/* 嵌套菜单的样式 */
.el-sub-menu :deep(.el-menu) {
  width: 100%;
  margin-left: 0; /* 移除左侧缩进 */
  background-color: #ffffff !important;
}

.el-sub-menu :deep(.el-menu) .el-menu-item {
  padding-left: 30px !important; /* 减少左侧内边距 */
  min-width: 200px;
  background-color: #ffffff !important;
  font-size: 14px;
  width: 100%;
}

.el-sub-menu :deep(.el-menu) .el-menu-item:hover {
  background-color: #ecf5ff !important;
}

.el-sub-menu :deep(.el-menu) .el-menu-item.is-active {
  background-color: #ecf5ff !important;
  color: #409EFF !important;
}

.el-sub-menu :deep(.el-menu) .el-sub-menu :deep(.el-sub-menu__title) {
  padding-left: 30px !important; /* 减少左侧内边距 */
  background-color: #ffffff !important;
}

.el-sub-menu :deep(.el-menu) .el-sub-menu :deep(.el-menu) .el-menu-item {
  padding-left: 40px !important; /* 减少左侧内边距 */
  background-color: #ffffff !important;
}

/* 调整二级菜单文字位置 */
.el-sub-menu :deep(.el-menu) .el-menu-item span,
.el-sub-menu :deep(.el-menu) .el-sub-menu :deep(.el-sub-menu__title) span {
  margin-left: 0; /* 移除文字左侧边距 */
}

/* 三级菜单样式 */
.el-sub-menu :deep(.el-menu) .el-sub-menu :deep(.el-menu) {
  margin-left: 0; /* 移除左侧缩进 */
  background-color: #ffffff !important;
}

.el-sub-menu :deep(.el-menu) .el-sub-menu :deep(.el-menu) .el-menu-item span {
  margin-left: 0; /* 移除文字左侧边距 */
}
</style> 