<template>
  <div class="page-container">
    <!-- 系统状态卡片 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-header">
            <div class="card-title">{{ $t('systemBasicmgmt.systemStatus.cpuUsage') }}</div>
            <el-icon :size="24" color="#409EFF"><Cpu /></el-icon>
          </div>
          <div class="card-value-with-progress">
            <span class="value">32%</span>
            <el-progress :percentage="32" :show-text="false" />
          </div>
          <div class="card-footer">
            <span class="status-normal">{{ $t('systemBasicmgmt.systemStatus.normal') }}</span>
            <span class="compare-text">4 {{ $t('systemBasicmgmt.systemStatus.cores') }} / 8 {{ $t('systemBasicmgmt.systemStatus.threads') }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-header">
            <div class="card-title">{{ $t('systemBasicmgmt.systemStatus.memoryUsage') }}</div>
            <el-icon :size="24" color="#67C23A"><Connection /></el-icon>
          </div>
          <div class="card-value-with-progress">
            <span class="value">65%</span>
            <el-progress :percentage="65" :show-text="false" color="#67C23A" />
          </div>
          <div class="card-footer">
            <span class="status-normal">{{ $t('systemBasicmgmt.systemStatus.normal') }}</span>
            <span class="compare-text">8GB / 16GB</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-header">
            <div class="card-title">{{ $t('systemBasicmgmt.systemStatus.diskUsage') }}</div>
            <el-icon :size="24" color="#E6A23C"><DataAnalysis /></el-icon>
          </div>
          <div class="card-value-with-progress">
            <span class="value">78%</span>
            <el-progress :percentage="78" :show-text="false" color="#E6A23C" />
          </div>
          <div class="card-footer">
            <span class="status-warning">{{ $t('systemBasicmgmt.systemStatus.warning') }}</span>
            <span class="compare-text">780GB / 1TB</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card class="data-card" shadow="hover">
          <div class="card-header">
            <div class="card-title">{{ $t('systemBasicmgmt.systemStatus.systemLoad') }}</div>
            <el-icon :size="24" color="#F56C6C"><Loading /></el-icon>
          </div>
          <div class="card-value-with-progress">
            <span class="value">2.35</span>
            <el-progress :percentage="47" :show-text="false" color="#F56C6C" />
          </div>
          <div class="card-footer">
            <span class="status-normal">{{ $t('systemBasicmgmt.systemStatus.normal') }}</span>
            <span class="compare-text">{{ $t('systemBasicmgmt.systemStatus.lastMinutes') }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 资源使用趋势图 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="card-header-with-tabs">
              <div class="card-header-title">{{ $t('systemBasicmgmt.resourceTrend.title') }}</div>
              <div class="card-header-tabs">
                <el-radio-group v-model="resourceTimeRange" size="small">
                  <el-radio-button value="hour">{{ $t('systemBasicmgmt.resourceTrend.hour') }}</el-radio-button>
                  <el-radio-button value="day">{{ $t('systemBasicmgmt.resourceTrend.day') }}</el-radio-button>
                  <el-radio-button value="week">{{ $t('systemBasicmgmt.resourceTrend.week') }}</el-radio-button>
                  <el-radio-button value="month">{{ $t('systemBasicmgmt.resourceTrend.month') }}</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </template>
          <div class="resource-chart">
            <!-- 这里可以放资源趋势图表组件 -->
            <div class="chart-placeholder">{{ $t('systemBasicmgmt.resourceTrend.placeholder') }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统信息和服务状态 -->
    <el-row :gutter="20" class="info-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="system-info-header">
              <span>{{ $t('systemBasicmgmt.systemInfo.title') }}</span>
              <el-button type="primary" size="small" plain>{{ $t('systemBasicmgmt.systemInfo.refresh') }}</el-button>
            </div>
          </template>
          <el-descriptions :column="1" border class="descriptions-block">
            <el-descriptions-item :label="$t('systemBasicmgmt.systemInfo.os')">CentOS 8.4.2105</el-descriptions-item>
            <el-descriptions-item :label="$t('systemBasicmgmt.systemInfo.serverIp')">192.168.1.100</el-descriptions-item>
            <el-descriptions-item :label="$t('systemBasicmgmt.systemInfo.systemTime')">2023-05-15 15:30:45</el-descriptions-item>
            <el-descriptions-item :label="$t('systemBasicmgmt.systemInfo.uptime')">23天 5小时 16分钟</el-descriptions-item>
            <el-descriptions-item :label="$t('systemBasicmgmt.systemInfo.cpuModel')">Intel(R) Xeon(R) CPU E5-2680 v4 @ 2.40GHz</el-descriptions-item>
            <el-descriptions-item :label="$t('systemBasicmgmt.systemInfo.memoryCapacity')">16 GB</el-descriptions-item>
            <el-descriptions-item :label="$t('systemBasicmgmt.systemInfo.diskSpace')">1 TB</el-descriptions-item>
            <el-descriptions-item :label="$t('systemBasicmgmt.systemInfo.systemVersion')">v2.5.3 (build 20230510)</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="service-status-header">
              <span>{{ $t('systemBasicmgmt.serviceStatus.title') }}</span>
              <div class="header-actions">
                <el-button type="primary" size="small" plain icon="RefreshRight">{{ $t('systemBasicmgmt.serviceStatus.refresh') }}</el-button>
                <el-button type="success" size="small" plain>{{ $t('systemBasicmgmt.serviceStatus.restartAll') }}</el-button>
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
                <el-tag :type="service.status === $t('systemBasicmgmt.serviceStatus.running') ? 'success' : service.status === $t('systemBasicmgmt.serviceStatus.stopped') ? 'danger' : 'warning'">
                  {{ service.status }}
                </el-tag>
                <div class="action-buttons">
                  <el-button 
                    size="small" 
                    :type="service.status === $t('systemBasicmgmt.serviceStatus.running') ? 'danger' : 'success'"
                    plain
                  >
                    {{ service.status === $t('systemBasicmgmt.serviceStatus.running') ? $t('systemBasicmgmt.serviceStatus.stop') : $t('systemBasicmgmt.serviceStatus.start') }}
                  </el-button>
                  <el-button size="small" type="primary" plain>{{ $t('systemBasicmgmt.serviceStatus.restart') }}</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统日志和备份记录 -->
    <el-row :gutter="20" class="log-row">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="system-log-header">
              <span>{{ $t('systemBasicmgmt.systemLog.title') }}</span>
              <div class="log-actions">
                <el-select v-model="logType" placeholder="日志类型" size="small" style="width: 120px; margin-right: 10px;">
                  <el-option :label="$t('systemBasicmgmt.systemLog.all')" value="all" />
                  <el-option :label="$t('systemBasicmgmt.systemLog.error')" value="error" />
                  <el-option :label="$t('systemBasicmgmt.systemLog.warning')" value="warning" />
                  <el-option :label="$t('systemBasicmgmt.systemLog.info')" value="info" />
                </el-select>
                <el-button type="primary" size="small" plain>{{ $t('systemBasicmgmt.systemLog.viewMore') }}</el-button>
              </div>
            </div>
          </template>
          <el-table :data="systemLogs" style="width: 100%" border stripe :header-cell-style="{ background: '#f5f7fa' }">
            <el-table-column prop="time" :label="$t('systemBasicmgmt.systemLog.time')" width="180" />
            <el-table-column prop="level" :label="$t('systemBasicmgmt.systemLog.level')" width="100">
              <template #default="scope">
                <el-tag 
                  :type="scope.row.level === 'ERROR' ? 'danger' : scope.row.level === 'WARNING' ? 'warning' : 'info'"
                  size="small"
                >
                  {{ scope.row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="module" :label="$t('systemBasicmgmt.systemLog.module')" width="120" />
            <el-table-column prop="message" :label="$t('systemBasicmgmt.systemLog.content')" show-overflow-tooltip />
            <el-table-column :label="$t('systemBasicmgmt.systemLog.operation')" width="120" fixed="right">
              <template #default>
                <el-button size="small" type="primary" plain>{{ $t('systemBasicmgmt.systemLog.details') }}</el-button>
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
              <span>{{ $t('systemBasicmgmt.backupRecord.title') }}</span>
              <div class="header-actions">
                <el-button type="primary" size="small" icon="Plus">{{ $t('systemBasicmgmt.backupRecord.backupNow') }}</el-button>
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
                  <el-button size="small" type="primary" plain icon="Download">{{ $t('systemBasicmgmt.backupRecord.restore') }}</el-button>
                  <el-button size="small" type="danger" plain icon="Delete">{{ $t('systemBasicmgmt.backupRecord.delete') }}</el-button>
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
              <span>{{ $t('systemBasicmgmt.systemNotice.title') }}</span>
              <div class="header-actions">
                <el-button type="primary" size="small" plain icon="Plus">{{ $t('systemBasicmgmt.systemNotice.publish') }}</el-button>
              </div>
            </div>
          </template>
          <el-table :data="systemNotices" style="width: 100%" border stripe :header-cell-style="{ background: '#f5f7fa' }">
            <el-table-column prop="title" :label="$t('systemBasicmgmt.systemNotice.noticeTitle')" min-width="200" show-overflow-tooltip />
            <el-table-column prop="type" :label="$t('systemBasicmgmt.systemNotice.type')" width="120">
              <template #default="scope">
                <el-tag :type="getNoticeType(scope.row.type)">{{ scope.row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="publisher" :label="$t('systemBasicmgmt.systemNotice.publisher')" width="120" />
            <el-table-column prop="time" :label="$t('systemBasicmgmt.systemNotice.publishTime')" width="180" />
            <el-table-column :label="$t('systemBasicmgmt.systemNotice.operation')" width="180" fixed="right">
              <template #default>
                <el-button size="small" type="primary" plain icon="View">{{ $t('systemBasicmgmt.systemNotice.view') }}</el-button>
                <el-button size="small" type="danger" plain icon="Delete">{{ $t('systemBasicmgmt.systemNotice.delete') }}</el-button>
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

    <!-- 快捷操作区 -->
    <el-row :gutter="20" class="quick-action-row">
      <el-col :span="24">
        <el-card class="custom-card" shadow="hover">
          <template #header>
            <div class="quick-action-header">
              <span>{{ $t('systemBasicmgmt.quickAction.title') }}</span>
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

    <!-- 添加router-view，用于显示子路由内容 -->
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
    name: 'Web服务器',
    description: 'Nginx 1.20.1',
    status: '运行中'
  },
  {
    name: '数据库服务',
    description: 'MySQL 8.0.27',
    status: '运行中'
  },
  {
    name: '缓存服务',
    description: 'Redis 6.2.6',
    status: '运行中'
  },
  {
    name: '消息队列',
    description: 'RabbitMQ 3.9.13',
    status: '已停止'
  },
  {
    name: '定时任务',
    description: 'Cron Service',
    status: '运行中'
  }
])

// 系统日志
const logType = ref('all')
const systemLogs = reactive([
  {
    time: '2023-05-15 15:20:30',
    level: 'ERROR',
    module: '用户认证',
    message: '用户登录失败：密码错误 (IP: 192.168.1.5)'
  },
  {
    time: '2023-05-15 15:15:22',
    level: 'WARNING',
    module: '数据库',
    message: '数据库连接池达到80%容量'
  },
  {
    time: '2023-05-15 15:10:15',
    level: 'INFO',
    module: '系统',
    message: '系统配置已更新'
  },
  {
    time: '2023-05-15 15:05:48',
    level: 'INFO',
    module: '用户管理',
    message: '新用户注册：user123'
  },
  {
    time: '2023-05-15 15:01:33',
    level: 'WARNING',
    module: '文件存储',
    message: '磁盘空间不足，剩余空间低于20%'
  },
])

// 系统通知
const systemNotices = reactive([
  {
    title: '系统维护通知：将于5月20日进行系统更新',
    type: '维护',
    publisher: 'Admin',
    time: '2023-05-15 10:30:00'
  },
  {
    title: '安全更新：已修复关键安全漏洞，请及时更新',
    type: '安全',
    publisher: 'SecurityTeam',
    time: '2023-05-14 16:45:20'
  },
  {
    title: '功能更新：新增数据分析模块',
    type: '更新',
    publisher: 'Admin',
    time: '2023-05-12 09:15:30'
  },
  {
    title: '服务器升级完成公告',
    type: '公告',
    publisher: 'SystemAdmin',
    time: '2023-05-10 14:20:00'
  },
  {
    title: '年度系统安全审计将于下周开始',
    type: '安全',
    publisher: 'SecurityTeam',
    time: '2023-05-08 11:30:45'
  }
])

// 备份记录
const backupRecords = reactive([
  {
    name: '系统完整备份_20230515',
    time: '2023-05-15 03:00:00',
    size: '4.2 GB'
  },
  {
    name: '数据库备份_20230514',
    time: '2023-05-14 03:00:00',
    size: '1.8 GB'
  },
  {
    name: '配置文件备份_20230513',
    time: '2023-05-13 03:00:00',
    size: '156 MB'
  },
  {
    name: '系统完整备份_20230510',
    time: '2023-05-10 03:00:00',
    size: '4.1 GB'
  },
  {
    name: '数据库备份_20230507',
    time: '2023-05-07 03:00:00',
    size: '1.7 GB'
  },
  {
    name: '系统完整备份_20230501',
    time: '2023-05-01 03:00:00',
    size: '4.0 GB'
  }
])

// 快捷操作
const quickActions = reactive([
  {
    name: '系统设置',
    icon: markRaw(Setting)
  },
  {
    name: '用户管理',
    icon: markRaw(User)
  },
  {
    name: '安全配置',
    icon: markRaw(Lock)
  },
  {
    name: '系统监控',
    icon: markRaw(Monitor)
  },
  {
    name: '备份恢复',
    icon: markRaw(Upload)
  },
  {
    name: '日志分析',
    icon: markRaw(Document)
  },
  {
    name: '存储管理',
    icon: markRaw(Folder)
  },
  {
    name: '工具箱',
    icon: markRaw(Tools)
  }
])

// 获取通知类型
const getNoticeType = (type) => {
  switch (type) {
    case '维护':
    case 'Maintenance':
      return 'warning'
    case '安全':
    case 'Security':
      return 'danger'
    case '更新':
    case 'Update':
      return 'success'
    case '公告':
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

/* 图表占位 */
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

/* 分页容器 */
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

/* 快捷操作区 */
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

/* 表格样式调整 */
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

