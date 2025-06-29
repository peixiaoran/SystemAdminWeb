<template>
    <div class="page-container">
      <!-- 系统状态卡片 -->
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card class="data-card" shadow="hover">
            <div class="card-header">
              <div class="card-title">CPU使用率EEEE</div>
              <el-icon :size="24" color="#409EFF"><Cpu /></el-icon>
            </div>
            <div class="card-value-with-progress">
              <span class="value">32%</span>
              <el-progress :percentage="32" :show-text="false" />
            </div>
            <div class="card-footer">
              <span class="status-normal">正常</span>
              <span class="compare-text">4核心 / 8线程</span>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card class="data-card" shadow="hover">
            <div class="card-header">
              <div class="card-title">内存使用率</div>
              <el-icon :size="24" color="#67C23A"><Connection /></el-icon>
            </div>
            <div class="card-value-with-progress">
              <span class="value">65%</span>
              <el-progress :percentage="65" :show-text="false" color="#67C23A" />
            </div>
            <div class="card-footer">
              <span class="status-normal">正常</span>
              <span class="compare-text">8GB / 16GB</span>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card class="data-card" shadow="hover">
            <div class="card-header">
              <div class="card-title">磁盘使用率</div>
              <el-icon :size="24" color="#E6A23C"><DataAnalysis /></el-icon>
            </div>
            <div class="card-value-with-progress">
              <span class="value">78%</span>
              <el-progress :percentage="78" :show-text="false" color="#E6A23C" />
            </div>
            <div class="card-footer">
              <span class="status-warning">注意</span>
              <span class="compare-text">780GB / 1TB</span>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
          <el-card class="data-card" shadow="hover">
            <div class="card-header">
              <div class="card-title">系统负载</div>
              <el-icon :size="24" color="#F56C6C"><Loading /></el-icon>
            </div>
            <div class="card-value-with-progress">
              <span class="value">2.35</span>
              <el-progress :percentage="47" :show-text="false" color="#F56C6C" />
            </div>
            <div class="card-footer">
              <span class="status-normal">正常</span>
              <span class="compare-text">最近15分钟</span>
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
                <div class="card-header-title">资源使用趋势</div>
                <div class="card-header-tabs">
                  <el-radio-group v-model="resourceTimeRange" size="small">
                    <el-radio-button value="hour">1小时</el-radio-button>
                    <el-radio-button value="day">24小时</el-radio-button>
                    <el-radio-button value="week">7天</el-radio-button>
                    <el-radio-button value="month">30天</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </template>
            <div class="resource-chart">
              <!-- 这里可以放资源趋势图表组件 -->
              <div class="chart-placeholder">资源使用趋势图表（这里放实际的图表组件）</div>
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
                <span>系统信息</span>
                <el-button type="primary" size="small" plain>刷新</el-button>
              </div>
            </template>
            <el-descriptions :column="1" border class="descriptions-block">
              <el-descriptions-item label="操作系统">CentOS 8.4.2105</el-descriptions-item>
              <el-descriptions-item label="服务器IP">192.168.1.100</el-descriptions-item>
              <el-descriptions-item label="系统时间">2023-05-15 15:30:45</el-descriptions-item>
              <el-descriptions-item label="运行时间">23天 5小时 16分钟</el-descriptions-item>
              <el-descriptions-item label="CPU型号">Intel(R) Xeon(R) CPU E5-2680 v4 @ 2.40GHz</el-descriptions-item>
              <el-descriptions-item label="内存容量">16 GB</el-descriptions-item>
              <el-descriptions-item label="磁盘空间">1 TB</el-descriptions-item>
              <el-descriptions-item label="系统版本">v2.5.3 (build 20230510)</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card class="custom-card" shadow="hover">
            <template #header>
              <div class="service-status-header">
                <span>服务状态</span>
                <div class="header-actions">
                  <el-button type="primary" size="small" plain icon="RefreshRight">刷新</el-button>
                  <el-button type="success" size="small" plain>全部重启</el-button>
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
                  <el-tag :type="service.status === '运行中' ? 'success' : service.status === '已停止' ? 'danger' : 'warning'">
                    {{ service.status }}
                  </el-tag>
                  <div class="action-buttons">
                    <el-button 
                      size="small" 
                      :type="service.status === '运行中' ? 'danger' : 'success'"
                      plain
                    >
                      {{ service.status === '运行中' ? '停止' : '启动' }}
                    </el-button>
                    <el-button size="small" type="primary" plain>重启</el-button>
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
                <span>系统日志</span>
                <div class="log-actions">
                  <el-select v-model="logType" placeholder="日志类型" size="small" style="width: 120px; margin-right: 10px;">
                    <el-option label="全部" value="all" />
                    <el-option label="错误" value="error" />
                    <el-option label="警告" value="warning" />
                    <el-option label="信息" value="info" />
                  </el-select>
                  <el-button type="primary" size="small" plain>查看更多</el-button>
                </div>
              </div>
            </template>
            <el-table :data="systemLogs" style="width: 100%" border stripe :header-cell-style="{ background: '#f5f7fa' }">
              <el-table-column prop="time" label="时间" width="180" />
              <el-table-column prop="level" label="级别" width="100">
                <template #default="scope">
                  <el-tag 
                    :type="scope.row.level === 'ERROR' ? 'danger' : scope.row.level === 'WARNING' ? 'warning' : 'info'"
                    size="small"
                  >
                    {{ scope.row.level }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="module" label="模块" width="120" />
              <el-table-column prop="message" label="内容" show-overflow-tooltip />
              <el-table-column label="操作" width="120" fixed="right" align="center">
                <template #default>
                  <el-button size="small" type="primary" plain>详情</el-button>
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
                <span>备份记录</span>
                <div class="header-actions">
                  <el-button type="primary" size="small" icon="Plus">立即备份</el-button>
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
                    <el-button size="small" type="primary" plain icon="Download">恢复</el-button>
                    <el-button size="small" type="danger" plain icon="Delete">删除</el-button>
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
                <span>系统通知</span>
                <div class="header-actions">
                  <el-button type="primary" size="small" plain icon="Plus">发布通知</el-button>
                </div>
              </div>
            </template>
            <el-table :data="systemNotices" style="width: 100%" border stripe :header-cell-style="{ background: '#f5f7fa' }">
              <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
              <el-table-column prop="type" label="类型" width="120">
                <template #default="scope">
                  <el-tag :type="getNoticeType(scope.row.type)">{{ scope.row.type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="publisher" label="发布人" width="120" />
              <el-table-column prop="time" label="发布时间" width="180" />
              <el-table-column label="操作" width="180" fixed="right" align="center">
                <template #default>
                  <el-button size="small" type="primary" plain icon="View">查看</el-button>
                  <el-button size="small" type="danger" plain icon="Delete">删除</el-button>
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
                <span>快捷操作</span>
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
  import { ref, reactive } from 'vue'
  import { 
    Refresh, Setting, RefreshRight, Plus, View, Download, Delete,
    Monitor, Connection, Lock, User, Warning, Notification, 
    Document, Folder, Tools, Upload, Cpu, DataAnalysis, Loading
  } from '@element-plus/icons-vue'
  
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
              module: '员工认证',
        message: '员工登录失败：密码错误 (IP: 192.168.1.5)'
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
              module: '员工管理',
        message: '新员工注册：user123'
    },
    {
      time: '2023-05-15 15:01:33',
      level: 'WARNING',
      module: '文件存储',
      message: '磁盘空间不足，剩余空间低于20%'
    },
    {
      time: '2023-05-15 14:55:20',
      level: 'ERROR',
      module: 'API服务',
      message: 'API请求超时：/api/data/report'
    }
  ])
  
  // 备份记录
  const backupRecords = reactive([
    {
      name: '完整备份_20230515',
      time: '2023-05-15 03:00:00',
      size: '2.5 GB'
    },
    {
      name: '完整备份_20230514',
      time: '2023-05-14 03:00:00',
      size: '2.4 GB'
    },
    {
      name: '完整备份_20230513',
      time: '2023-05-13 03:00:00',
      size: '2.4 GB'
    },
    {
      name: '完整备份_20230512',
      time: '2023-05-12 03:00:00',
      size: '2.3 GB'
    },
    {
      name: '完整备份_20230511',
      time: '2023-05-11 03:00:00',
      size: '2.3 GB'
    },
    {
      name: '手动备份_20230510',
      time: '2023-05-10 15:30:00',
      size: '2.3 GB'
    },
    {
      name: '完整备份_20230510',
      time: '2023-05-10 03:00:00',
      size: '2.2 GB'
    }
  ])
  
  // 系统通知
  const systemNotices = reactive([
    {
      title: '系统将于2023年5月20日凌晨2:00-4:00进行升级维护',
      type: '维护通知',
      publisher: '系统管理员',
      time: '2023-05-15 14:00:00'
    },
    {
      title: '新版本v2.5.3已发布，新增多项功能和优化',
      type: '版本更新',
      publisher: '技术团队',
      time: '2023-05-10 10:30:00'
    },
    {
      title: '安全漏洞修复公告：请及时更新系统',
      type: '安全公告',
      publisher: '安全团队',
      time: '2023-05-05 16:45:00'
    },
    {
      title: '服务器迁移完成公告',
      type: '系统公告',
      publisher: '运维团队',
      time: '2023-04-28 09:15:00'
    }
  ])
  
  // 快捷操作
  const quickActions = reactive([
    { name: '系统监控', icon: 'Monitor' },
    { name: '网络设置', icon: 'Connection' },
    { name: '安全设置', icon: 'Lock' },
          { name: '员工管理', icon: 'User' },
    { name: '告警设置', icon: 'Warning' },
    { name: '消息通知', icon: 'Notification' },
    { name: '日志管理', icon: 'Document' },
    { name: '存储管理', icon: 'Folder' },
    { name: '系统维护', icon: 'Tools' },
    { name: '系统升级', icon: 'Upload' }
  ])
  
  // 获取通知类型对应的标签类型
  const getNoticeType = (type) => {
    switch (type) {
      case '维护通知':
        return 'warning'
      case '版本更新':
        return 'success'
      case '安全公告':
        return 'danger'
      case '系统公告':
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

