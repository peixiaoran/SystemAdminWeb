<template>
  <div class="page-container">
    <!-- 系统状态概览 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-header">
            <div class="card-title">{{ $t('SystemBasicMgmt.systemStatus.cpuUsage') }}</div>
            <el-icon :size="24" color="#409EFF"><Cpu /></el-icon>
          </div>
          <div class="card-value-with-progress">
            <span class="value">32%</span>
            <el-progress :percentage="32" :show-text="false" />
          </div>
          <div class="card-footer">
            <span class="status-normal">{{ $t('SystemBasicMgmt.systemStatus.normal') }}</span>
            <span class="compare-text">4 {{ $t('SystemBasicMgmt.systemStatus.cores') }} / 8 {{ $t('SystemBasicMgmt.systemStatus.threads') }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-header">
            <div class="card-title">{{ $t('SystemBasicMgmt.systemStatus.memoryUsage') }}</div>
            <el-icon :size="24" color="#67C23A"><Connection /></el-icon>
          </div>
          <div class="card-value-with-progress">
            <span class="value">65%</span>
            <el-progress :percentage="65" :show-text="false" color="#67C23A" />
          </div>
          <div class="card-footer">
            <span class="status-normal">{{ $t('SystemBasicMgmt.systemStatus.normal') }}</span>
            <span class="compare-text">8GB / 16GB</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-header">
            <div class="card-title">{{ $t('SystemBasicMgmt.systemStatus.diskUsage') }}</div>
            <el-icon :size="24" color="#E6A23C"><DataAnalysis /></el-icon>
          </div>
          <div class="card-value-with-progress">
            <span class="value">78%</span>
            <el-progress :percentage="78" :show-text="false" color="#E6A23C" />
          </div>
          <div class="card-footer">
            <span class="status-warning">{{ $t('SystemBasicMgmt.systemStatus.warning') }}</span>
            <span class="compare-text">780GB / 1TB</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-header">
            <div class="card-title">{{ $t('SystemBasicMgmt.systemStatus.systemLoad') }}</div>
            <el-icon :size="24" color="#F56C6C"><Loading /></el-icon>
          </div>
          <div class="card-value-with-progress">
            <span class="value">2.35</span>
            <el-progress :percentage="47" :show-text="false" color="#F56C6C" />
          </div>
          <div class="card-footer">
            <span class="status-normal">{{ $t('SystemBasicMgmt.systemStatus.normal') }}</span>
            <span class="compare-text">{{ $t('SystemBasicMgmt.systemStatus.lastMinutes') }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 资源趋势图 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="card-header-with-tabs">
              <div class="card-header-title">{{ $t('SystemBasicMgmt.resourceTrend.title') }}</div>
              <div class="card-header-tabs">
                <el-radio-group v-model="resourceTimeRange" size="small">
                  <el-radio-button value="hour">{{ $t('SystemBasicMgmt.resourceTrend.hour') }}</el-radio-button>
                  <el-radio-button value="day">{{ $t('SystemBasicMgmt.resourceTrend.day') }}</el-radio-button>
                  <el-radio-button value="week">{{ $t('SystemBasicMgmt.resourceTrend.week') }}</el-radio-button>
                  <el-radio-button value="month">{{ $t('SystemBasicMgmt.resourceTrend.month') }}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div class="resource-chart">
            <!-- 图表占位符 -->
            <div class="chart-placeholder">{{ $t('SystemBasicMgmt.resourceTrend.placeholder') }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统信息与服务状态 -->
    <el-row :gutter="20" class="info-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="system-info-header">
              <span>{{ $t('SystemBasicMgmt.systemInfo.title') }}</span>
              <el-button type="primary" size="small" plain>{{ $t('SystemBasicMgmt.systemInfo.refresh') }}</el-button>
            </div>
          </template>
          <el-descriptions :column="1" border class="descriptions-block">
            <el-descriptions-item :label="$t('SystemBasicMgmt.systemInfo.os')">CentOS 8.4.2105</el-descriptions-item>
            <el-descriptions-item :label="$t('SystemBasicMgmt.systemInfo.serverIp')">192.168.1.100</el-descriptions-item>
            <el-descriptions-item :label="$t('SystemBasicMgmt.systemInfo.systemTime')">2023-05-15 15:30:45</el-descriptions-item>
            <el-descriptions-item :label="$t('SystemBasicMgmt.systemInfo.uptime')">23 days 5 hours 16 minutes</el-descriptions-item>
            <el-descriptions-item :label="$t('SystemBasicMgmt.systemInfo.cpuModel')">Intel(R) Xeon(R) CPU E5-2680 v4 @ 2.40GHz</el-descriptions-item>
            <el-descriptions-item :label="$t('SystemBasicMgmt.systemInfo.memoryCapacity')">16 GB</el-descriptions-item>
            <el-descriptions-item :label="$t('SystemBasicMgmt.systemInfo.diskSpace')">1 TB</el-descriptions-item>
            <el-descriptions-item :label="$t('SystemBasicMgmt.systemInfo.systemVersion')">v2.5.3 (build 20230510)</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="service-status-header">
              <span>{{ $t('SystemBasicMgmt.serviceStatus.title') }}</span>
              <div class="header-actions">
                <el-button type="primary" size="small" plain icon="RefreshRight">{{ $t('SystemBasicMgmt.serviceStatus.refresh') }}</el-button>
                <el-button type="success" size="small" plain>{{ $t('SystemBasicMgmt.serviceStatus.restartAll') }}</el-button>
              </div>
            </div>
          </template>
          <div class="service-list">
            <div class="service-item" v-for="(service, index) in serviceStatus" :key="index">
              <div class="service-info">
                <div class="service-name">{{ service.name }}</div>
                <div class="service-desc">{{ service.description }}</div>
              </div>
              <div class="service-actions">
                <el-tag :type="service.status === $t('SystemBasicMgmt.serviceStatus.running') ? 'success' : service.status === $t('SystemBasicMgmt.serviceStatus.stopped') ? 'danger' : 'warning'">
                  {{ service.status }}
                </el-tag>
                <div class="action-buttons">
                  <el-button 
                    size="small" 
                    :type="service.status === $t('SystemBasicMgmt.serviceStatus.running') ? 'danger' : 'success'"
                    plain
                  >
                    {{ service.status === $t('SystemBasicMgmt.serviceStatus.running') ? $t('SystemBasicMgmt.serviceStatus.stop') : $t('SystemBasicMgmt.serviceStatus.start') }}
                  </el-button>
                  <el-button size="small" type="primary" plain>{{ $t('SystemBasicMgmt.serviceStatus.restart') }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统日志与备份记录 -->
    <el-row :gutter="20" class="log-row">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="system-log-header">
              <span>{{ $t('SystemBasicMgmt.systemLog.title') }}</span>
              <div class="log-actions">
                <el-select v-model="logType" placeholder="日志类型" size="small" style="width: 120px; margin-right: 10px;">
                  <el-option :label="$t('SystemBasicMgmt.systemLog.all')" value="all" />
                  <el-option :label="$t('SystemBasicMgmt.systemLog.error')" value="error" />
                  <el-option :label="$t('SystemBasicMgmt.systemLog.warning')" value="warning" />
                  <el-option :label="$t('SystemBasicMgmt.systemLog.info')" value="info" />
                </el-select>
                <el-button type="primary" size="small" plain>{{ $t('SystemBasicMgmt.systemLog.viewMore') }}</el-button>
              </div>
            </div>
          </template>
          <el-table :data="systemLogs" style="width: 100%" border stripe :header-cell-style="{ background: '#f5f7fa' }">
            <el-table-column prop="time" :label="$t('SystemBasicMgmt.systemLog.time')" width="180" />
            <el-table-column prop="level" :label="$t('SystemBasicMgmt.systemLog.level')" width="100">
              <template #default="scope">
                <el-tag 
                  :type="scope.row.level === 'ERROR' ? 'danger' : scope.row.level === 'WARNING' ? 'warning' : 'info'"
                  size="small"
                >
                  {{ scope.row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="module" :label="$t('SystemBasicMgmt.systemLog.module')" width="120" />
            <el-table-column prop="message" :label="$t('SystemBasicMgmt.systemLog.content')" show-overflow-tooltip />
                              <el-table-column :label="$t('SystemBasicMgmt.systemLog.operation')" width="120" fixed="right" align="center">
              <template #default>
                <el-button size="small" type="primary" plain>{{ $t('SystemBasicMgmt.systemLog.details') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="logPagination.pageIndex"
              v-model:page-size="logPagination.pageSize"
              :page-sizes="[5, 10, 20, 50]"
              layout="total, sizes, prev, pager, next"
              :total="logPagination.total"
            />
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="backup-header">
              <span>{{ $t('SystemBasicMgmt.backupRecord.title') }}</span>
              <div class="header-actions">
                <el-button type="primary" size="small" icon="Plus">{{ $t('SystemBasicMgmt.backupRecord.backupNow') }}</el-button>
              </div>
            </div>
          </template>
          <el-scrollbar height="350px">
            <div class="backup-list">
              <div class="backup-item" v-for="(backup, index) in backupRecords" :key="index">
                <div class="backup-info">
                  <div class="backup-name">{{ backup.name }}</div>
                  <div class="backup-meta">
                    <el-tag size="small" type="info">{{ backup.time }}</el-tag>
                    <el-tag size="small" type="success">{{ backup.size }}</el-tag>
                  </div>
                </div>
                <div class="backup-actions">
                  <el-button size="small" type="primary" plain icon="Download">{{ $t('SystemBasicMgmt.backupRecord.restore') }}</el-button>
                  <el-button size="small" type="danger" plain icon="Delete">{{ $t('SystemBasicMgmt.backupRecord.delete') }}</el-button>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统通知 -->
    <el-row :gutter="20" class="notice-row">
      <el-col :span="24">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="system-notice-header">
              <span>{{ $t('SystemBasicMgmt.systemNotice.title') }}</span>
              <div class="header-actions">
                <el-button type="primary" size="small" plain icon="Plus">{{ $t('SystemBasicMgmt.systemNotice.publish') }}</el-button>
              </div>
            </div>
          </template>
          <el-table :data="systemNotices" style="width: 100%" border stripe :header-cell-style="{ background: '#f5f7fa' }">
            <el-table-column prop="title" :label="$t('SystemBasicMgmt.systemNotice.noticeTitle')" min-width="200" show-overflow-tooltip />
            <el-table-column prop="type" :label="$t('SystemBasicMgmt.systemNotice.type')" width="120">
              <template #default="scope">
                <el-tag :type="getNoticeType(scope.row.type)">{{ scope.row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="publisher" :label="$t('SystemBasicMgmt.systemNotice.publisher')" width="120" />
            <el-table-column prop="time" :label="$t('SystemBasicMgmt.systemNotice.publishTime')" width="180" />
                          <el-table-column :label="$t('SystemBasicMgmt.systemNotice.operation')" width="180" fixed="right" align="center">
              <template #default>
                <el-button size="small" type="primary" plain icon="View">{{ $t('SystemBasicMgmt.systemNotice.view') }}</el-button>
                <el-button size="small" type="danger" plain icon="Delete">{{ $t('SystemBasicMgmt.systemNotice.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="noticePagination.pageIndex"
              v-model:page-size="noticePagination.pageSize"
              :page-sizes="[5, 10, 20]"
              layout="total, sizes, prev, pager, next"
              :total="noticePagination.total"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-row :gutter="20" class="quick-action-row">
      <el-col :span="24">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="quick-action-header">
              <span>{{ $t('SystemBasicMgmt.quickAction.title') }}</span>
            </div>
          </template>
          <div class="quick-action-list">
            <el-row :gutter="20">
              <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" v-for="(action, index) in quickActions" :key="index">
                <div class="quick-action-item">
                  <el-button type="primary" plain :icon="action.icon" circle size="large"></el-button>
                  <div class="action-name">{{ action.name }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 路由视图，用于动态加载组件 -->
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, reactive, markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  Refresh, Setting, RefreshRight, Plus, View, Download, Delete,
  Monitor, Connection, Lock, User, Warning, Notification, 
  Document, Folder, Tools, Upload, Cpu, DataAnalysis, Loading
} from '@element-plus/icons-vue'

// 初始化i18n
const { t } = useI18n()

// 资源趋势图时间范围
const resourceTimeRange = ref('day')

// 日志分页
const logPagination = reactive({
  pageIndex: 1,
  pageSize: 5,
  total: 100
})

// 通知分页
const noticePagination = reactive({
  pageIndex: 1,
  pageSize: 5,
  total: 50
})

// 服务状态
const serviceStatus = reactive([
  {
    name: 'Web Server',
    description: 'Nginx 1.20.1',
    status: 'Running'
  },
  {
    name: 'Database',
    description: 'MySQL 8.0.27',
    status: 'Running'
  },
  {
    name: 'Redis',
    description: 'Redis 6.2.6',
    status: 'Running'
  },
  {
    name: 'Message Queue',
    description: 'RabbitMQ 3.9.13',
    status: 'Stopped'
  },
  {
    name: 'Cron Service',
    description: 'Cron Service',
    status: 'Running'
  }
])

// 系统日志
const logType = ref('all')
const systemLogs = reactive([
  {
    time: '2023-05-15 15:20:30',
    level: 'ERROR',
            module: 'Authentication',
        message: 'Authentication failed (IP: 192.168.1.5)'
  },
  {
    time: '2023-05-15 15:15:22',
    level: 'WARNING',
    module: 'Database',
    message: 'Database connection reached 80% threshold'
  },
  {
    time: '2023-05-15 15:10:15',
    level: 'INFO',
    module: 'System',
    message: 'System load increased'
  },
  {
    time: '2023-05-15 15:05:48',
    level: 'INFO',
            module: 'Authentication',
        message: 'User logged in: user123'
  },
  {
    time: '2023-05-15 15:01:33',
    level: 'WARNING',
    module: 'Storage',
    message: 'Disk space low, remaining 20%'
  },
])

// 系统通知
const systemNotices = reactive([
  {
    title: 'System Maintenance Notice on May 20th',
    type: 'Maintenance',
    publisher: 'Admin',
    time: '2023-05-15 10:30:00'
  },
  {
    title: 'Security Update: Critical Vulnerability Fixed',
    type: 'Security',
    publisher: 'SecurityTeam',
    time: '2023-05-14 16:45:20'
  },
  {
    title: 'Database Schema Update',
    type: 'Update',
    publisher: 'Admin',
    time: '2023-05-12 09:15:30'
  },
  {
    title: 'System Update Successful',
    type: 'Update',
    publisher: 'SystemAdmin',
    time: '2023-05-10 14:20:00'
  },
  {
    title: 'System Full Backup Completed',
    type: 'Security',
    publisher: 'SecurityTeam',
    time: '2023-05-08 11:30:45'
  }
])

// 备份记录
const backupRecords = reactive([
  {
    name: 'System Backup_20230515',
    time: '2023-05-15 03:00:00',
    size: '4.2 GB'
  },
  {
    name: 'Database Backup_20230514',
    time: '2023-05-14 03:00:00',
    size: '1.8 GB'
  },
  {
    name: 'Application Logs_20230513',
    time: '2023-05-13 03:00:00',
    size: '156 MB'
  },
  {
    name: 'System Backup_20230510',
    time: '2023-05-10 03:00:00',
    size: '4.1 GB'
  },
  {
    name: 'Database Backup_20230507',
    time: '2023-05-07 03:00:00',
    size: '1.7 GB'
  },
  {
    name: 'System Backup_20230501',
    time: '2023-05-01 03:00:00',
    size: '4.0 GB'
  }
])

// 快捷操作
const quickActions = reactive([
  {
    name: 'System Status',
    icon: markRaw(Setting)
  },
  {
          name: 'User Management',
    icon: markRaw(User)
  },
  {
    name: 'Security',
    icon: markRaw(Lock)
  },
  {
    name: 'System Monitor',
    icon: markRaw(Monitor)
  },
  {
    name: 'Data Recovery',
    icon: markRaw(Upload)
  },
  {
    name: 'Log Viewer',
    icon: markRaw(Document)
  },
  {
    name: 'Storage',
    icon: markRaw(Folder)
  },
  {
    name: 'Tools',
    icon: markRaw(Tools)
  }
])

// 获取通知类型
const getNoticeType = (type) => {
  switch (type) {
    case 'Maintenance':
    case 'Maintenance':
      return 'warning'
    case 'Security':
    case 'Security':
      return 'danger'
    case 'Update':
    case 'Update':
      return 'success'
    case 'Announcement':
    case 'Announcement':
      return 'info'
    default:
      return 'info'
  }
}
</script>

<style scoped>
.page-container {
  padding: 0;
}

.data-card {
  margin-bottom: 20px;
  height: 150px;
  border-radius: 8px;
  transition: all 0.3s;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-title {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}

.card-value-with-progress {
  margin-bottom: 15px;
}

.card-value-with-progress .value {
  font-size: 28px;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

.card-footer {
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-normal {
  color: #67C23A;
  font-weight: 500;
}

.status-warning {
  color: #E6A23C;
  font-weight: 500;
}

.status-danger {
  color: #F56C6C;
  font-weight: 500;
}

.compare-text {
  color: #909399;
}

.info-row, .log-row, .notice-row, .chart-row, .quick-action-row {
  margin-bottom: 20px;
}

.custom-card {
  border-radius: 8px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.custom-card:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.system-info-header, .service-status-header, .system-log-header, .backup-header, .system-notice-header, .quick-action-header, .card-header-with-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
}

.card-header-title {
  font-size: 16px;
  font-weight: 500;
}

.log-actions, .header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 图表占位符 */
.resource-chart {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  color: #909399;
  font-size: 14px;
  text-align: center;
  width: 100%;
  padding: 50px 0;
  background-color: #f9f9f9;
  border-radius: 4px;
}

/* 描述列表 */
.descriptions-block {
  margin-top: 10px;
}

/* 服务状态样式 */
.service-list {
  max-height: 365px;
  overflow-y: auto;
}

.service-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.service-item:last-child {
  border-bottom: none;
}

.service-name {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.service-desc {
  font-size: 13px;
  color: #909399;
}

.service-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.action-buttons {
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

/* 分页 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 备份记录样式 */
.backup-list {
  padding: 5px 0;
}

.backup-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.backup-item:hover {
  background-color: #f9f9f9;
}

.backup-item:last-child {
  border-bottom: none;
}

.backup-name {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.backup-meta {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.backup-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 快捷操作 */
.quick-action-list {
  padding: 15px 0;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-action-item:hover {
  transform: translateY(-5px);
}

.action-name {
  margin-top: 8px;
  font-size: 13px;
  color: #606266;
  text-align: center;
}

/* 表格样式 */
:deep(.el-table th) {
  background-color: #f5f7fa !important;
  font-weight: 600;
}

:deep(.el-table--border) {
  border-radius: 4px;
  overflow: hidden;
}

:deep(.el-tag) {
  font-weight: 500;
}
</style> 

