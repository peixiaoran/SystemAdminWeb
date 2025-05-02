<template>
  <div class="system-basic-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" class="welcome-card">
          <template #header>
            <div class="card-header">
              <h3>基础模块管理</h3>
            </div>
          </template>
          <div class="welcome-content">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="welcome-info">
                  <h4>欢迎使用基础模块管理系统</h4>
                  <p>您可以在此管理系统的基础配置和相关设置</p>
                  <el-button type="primary" @click="refreshData">
                    刷新数据
                  </el-button>
                </div>
              </el-col>
              <el-col :span="16">
                <el-card shadow="never" class="stat-card">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <div class="stat-item">
                        <div class="stat-number">42</div>
                        <div class="stat-title">配置项</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="stat-item">
                        <div class="stat-number">12</div>
                        <div class="stat-title">模块数</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="stat-item">
                        <div class="stat-number">5</div>
                        <div class="stat-title">待处理</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>功能模块</h3>
            </div>
          </template>
          <div class="function-list">
            <el-button-group class="function-group">
              <el-button type="primary" plain>
                <el-icon><Grid /></el-icon> 系统配置
              </el-button>
              <el-button type="success" plain>
                <el-icon><User /></el-icon> 用户管理
              </el-button>
              <el-button type="warning" plain>
                <el-icon><Monitor /></el-icon> 监控中心
              </el-button>
              <el-button type="danger" plain>
                <el-icon><Lock /></el-icon> 权限设置
              </el-button>
            </el-button-group>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>系统状态</h3>
            </div>
          </template>
          <div class="system-status">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp"
                :type="activity.type"
                :size="activity.size"
                :color="activity.color"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Grid, User, Monitor, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 模拟系统活动数据
const activities = ref([
  {
    content: '系统更新完成',
    timestamp: '2023-05-02 10:30',
    type: 'success',
    size: 'normal',
    color: '#67c23a'
  },
  {
    content: '数据库备份完成',
    timestamp: '2023-05-01 22:00',
    type: 'info',
    size: 'normal',
    color: '#409eff'
  },
  {
    content: '新增配置项',
    timestamp: '2023-04-30 16:45',
    type: 'primary',
    size: 'normal',
    color: '#409eff'
  },
  {
    content: '系统维护开始',
    timestamp: '2023-04-30 10:00',
    type: 'warning',
    size: 'normal',
    color: '#e6a23c'
  }
])

// 刷新数据方法
const refreshData = () => {
  ElMessage.success('数据已刷新')
}
</script>

<style scoped>
.system-basic-container {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.welcome-content {
  display: flex;
  align-items: center;
}

.welcome-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.welcome-info h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 16px;
}

.welcome-info p {
  margin: 0 0 20px 0;
  color: #606266;
  font-size: 14px;
}

.stat-card {
  border: none;
  box-shadow: none;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-title {
  font-size: 14px;
  color: #606266;
}

.mt-20 {
  margin-top: 20px;
}

.function-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.function-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}

.function-group .el-button {
  margin-left: 0;
  margin-right: 10px;
  margin-bottom: 10px;
}

.system-status {
  padding: 0 10px;
}

:deep(.el-timeline-item__node) {
  z-index: 1;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 10px;
}

:deep(.el-timeline-item__timestamp) {
  font-size: 13px;
}
</style> 