<template>
  <div class="dashboard-container">

    <!-- 快速访问和系统通知 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="hover" class="quick-access-card">
          <template #header>
            <div class="card-header">
              <h3>快速访问</h3>
            </div>
          </template>
          <el-row :gutter="12" class="quick-links">
            <el-col v-for="(link, index) in quickLinks" :key="index" :span="8">
              <div class="quick-link-item" @click="navigateToModule(link.path)">
                <el-icon :size="24" :color="link.color">
                  <component :is="link.icon" />
                </el-icon>
                <span>{{ link.title }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="hover" class="notice-card">
          <template #header>
            <div class="card-header">
              <h3>系统公告</h3>
              <el-button type="text">查看更多</el-button>
            </div>
          </template>
          <div class="notice-list">
            <div v-for="(notice, index) in systemNotices" :key="index" class="notice-item">
              <div class="notice-content">
                <el-icon :color="notice.color"><component :is="notice.icon" /></el-icon>
                <span class="notice-title">{{ notice.title }}</span>
              </div>
              <div class="notice-time">{{ notice.time }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统信息和今日待办 -->
    <el-row :gutter="20" class="mt-20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="hover" class="info-card">
          <template #header>
            <div class="card-header">
              <h3>系统信息</h3>
              <el-button type="primary" size="small" plain>刷新</el-button>
            </div>
          </template>
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">系统名称：</span>
              <span class="info-value">SystemsAdmin 管理平台</span>
            </div>
            <div class="info-item">
              <span class="info-label">当前版本：</span>
              <span class="info-value">v2.5.3</span>
            </div>
            <div class="info-item">
              <span class="info-label">部署环境：</span>
              <span class="info-value">生产环境</span>
            </div>
            <div class="info-item">
              <span class="info-label">服务器：</span>
              <span class="info-value">CentOS 8.4.2105</span>
            </div>
            <div class="info-item">
              <span class="info-label">数据库：</span>
              <span class="info-value">MySQL 8.0.27</span>
            </div>
            <div class="info-item">
              <span class="info-label">当前用户：</span>
              <span class="info-value">管理员</span>
            </div>
            <div class="info-item">
              <span class="info-label">登录时间：</span>
              <span class="info-value">{{ currentTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">浏览器：</span>
              <span class="info-value">{{ browserInfo }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card shadow="hover" class="todo-card">
          <template #header>
            <div class="card-header">
              <h3>今日待办</h3>
              <el-button type="success" size="small" plain icon="Plus">新增</el-button>
            </div>
          </template>
          <div class="todo-list">
            <div v-for="(todo, index) in todoList" :key="index" class="todo-item">
              <el-checkbox v-model="todo.completed">{{ todo.content }}</el-checkbox>
              <div class="todo-info">
                <el-tag size="small" :type="todo.priority">{{ todo.priorityText }}</el-tag>
                <span class="todo-time">{{ todo.time }}</span>
              </div>
            </div>
            <div v-if="todoList.length === 0" class="no-data">
              暂无待办事项
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { get } from '@/utils/request';
import { MODULE_API } from '@/config/api/login/api';
import { 
  Refresh, Setting, RefreshRight, Plus, View, Download, Delete,
  Monitor, Connection, Lock, User, Warning, Notification, 
  Document, Folder, Tools, Upload, Cpu, DataAnalysis, Loading,
  Bell, Calendar, List, MessageBox
} from '@element-plus/icons-vue';

const router = useRouter();
const currentTime = ref(new Date().toLocaleString());
const lastLoginTime = ref('2023-11-30 10:15:22');
const browserInfo = ref('');
const modules = ref([]);
const loading = ref(false);
const visitCount = ref('358');
const userCount = ref('42');

// 最近活动列表
const recentActivities = ref([
  { content: '系统更新至 v2.5.3 版本', time: '2023-12-01 15:30', type: 'success', color: '#67C23A' },
  { content: '管理员进行了系统配置修改', time: '2023-12-01 13:20', type: 'warning', color: '#E6A23C' },
  { content: '新增用户 user123 注册', time: '2023-11-30 16:45', type: 'primary', color: '#409EFF' },
  { content: '备份任务完成', time: '2023-11-30 03:00', type: 'info', color: '#909399' },
  { content: '系统监控检测到异常流量', time: '2023-11-29 20:15', type: 'danger', color: '#F56C6C', hollow: true },
  { content: '用户管理模块进行了功能优化', time: '2023-11-29 14:30', type: 'info', color: '#909399' },
]);

// 快速访问链接
const quickLinks = ref([
  { title: '用户管理', icon: 'User', path: '/basic-systemmgmt/system-mgmt/role', color: '#67C23A' },
  { title: '角色配置', icon: 'Lock', path: '/basic-systemmgmt/system-mgmt/roledomain', color: '#409EFF' },
  { title: '系统监控', icon: 'Monitor', path: '/basic-systemmgmt', color: '#E6A23C' },
  { title: '网域维护', icon: 'Connection', path: '/basic-systemmgmt/system-mgmt/domain', color: '#F56C6C' },
  { title: '模块维护', icon: 'Folder', path: '/basic-systemmgmt/system-mgmt/module', color: '#9254de' },
  { title: '程序维护', icon: 'Document', path: '/basic-systemmgmt/system-mgmt/program', color: '#909399' }
]);

// 系统公告
const systemNotices = ref([
  { title: '系统将于2023年12月20日凌晨2:00-4:00进行升级维护', time: '2023-12-01', icon: 'Warning', color: '#E6A23C' },
  { title: '新版本v2.5.3已发布，新增多项功能和优化', time: '2023-11-30', icon: 'Bell', color: '#409EFF' },
  { title: '安全漏洞修复公告：请及时更新系统', time: '2023-11-28', icon: 'Lock', color: '#F56C6C' },
  { title: '服务器迁移完成公告', time: '2023-11-25', icon: 'Connection', color: '#67C23A' }
]);

// 待办事项
const todoList = ref([
  { content: '完成系统用户权限配置', completed: false, priority: 'danger', priorityText: '紧急', time: '14:30' },
  { content: '审核新用户申请', completed: false, priority: 'warning', priorityText: '重要', time: '16:00' },
  { content: '准备周报数据', completed: true, priority: 'primary', priorityText: '普通', time: '17:30' },
  { content: '系统日志审查', completed: false, priority: 'info', priorityText: '一般', time: '明天' }
]);

// 获取模块列表
const fetchModules = async () => {
  loading.value = true;
  try {
    const res = await get(MODULE_API.GET_MODULES);
    if (res && res.success) {
      modules.value = res.data.map(item => ({
        id: item.id || item.domainId || item.code,
        name: item.name || item.domainName,
        path: item.path || `/dashboard/${item.code}-admin` || `/dashboard/${item.id}-admin`,
      }));
    } else {
      console.error('获取模块列表失败:', res?.message || '未知错误');
      // 加载失败时显示默认模块
      setDefaultModules();
    }
  } catch (error) {
    console.error('获取模块列表异常:', error);
    setDefaultModules();
  } finally {
    loading.value = false;
  }
};

// 设置默认模块
const setDefaultModules = () => {
  modules.value = [
    { id: 'user', name: '用户管理', path: '/basic-systemmgmt/system-mgmt/role' },
    { id: 'content', name: '内容管理', path: '/content-admin' },
    { id: 'order', name: '订单管理', path: '/order-admin' },
    { id: 'data', name: '数据分析', path: '/data-admin' },
    { id: 'system', name: '系统设置', path: '/basic-systemmgmt/system-mgmt/domain' },
    { id: 'message', name: '消息中心', path: '/message-admin' },
    { id: 'basic', name: '基础模块', path: '/basic-systemmgmt' },
    { id: 'module', name: '模块维护', path: '/basic-systemmgmt/system-mgmt/module' },
    { id: 'program', name: '程序维护', path: '/basic-systemmgmt/system-mgmt/program' }
  ];
};

// 根据模块名称获取对应图标
const getIconByName = (name) => {
  const iconMap = {
    '用户管理': 'User',
    '内容管理': 'Document',
    '订单管理': 'ShoppingCart',
    '数据分析': 'DataAnalysis',
    '系统设置': 'Setting',
    '消息中心': 'MessageBox',
    '基础模块': 'Tools',
    '模块维护': 'Folder',
    '程序维护': 'Document'
  };
  
  // 尝试根据名称匹配图标，如果没有匹配项，则返回默认图标
  return iconMap[name] || 'Setting';
};

// 跳转到模块
const navigateToModule = (path) => {
  router.push(path);
};

// 获取浏览器信息
const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = '';
  
  if (ua.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = ua.match(/Firefox\/([\d.]+)/)[1];
  } else if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edge') === -1 && ua.indexOf('Edg') === -1) {
    browserName = 'Chrome';
    browserVersion = ua.match(/Chrome\/([\d.]+)/)[1];
  } else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
    browserName = 'Safari';
    browserVersion = ua.match(/Version\/([\d.]+)/)[1];
  } else if (ua.indexOf('Edge') > -1 || ua.indexOf('Edg') > -1) {
    browserName = 'Edge';
    const match = ua.match(/Edge\/([\d.]+)/) || ua.match(/Edg\/([\d.]+)/);
    browserVersion = match ? match[1] : '';
  } else if (ua.indexOf('MSIE') > -1 || ua.indexOf('Trident') > -1) {
    browserName = 'IE';
    browserVersion = ua.match(/MSIE ([\d.]+)/) ? ua.match(/MSIE ([\d.]+)/)[1] : '11.0';
  }
  
  return `${browserName} ${browserVersion}`;
};

onMounted(() => {
  browserInfo.value = getBrowserInfo();
  
  // 获取模块列表
  fetchModules();
  
  // 更新当前时间
  setInterval(() => {
    currentTime.value = new Date().toLocaleString();
  }, 60000); // 每分钟更新
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
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

.mt-20 {
  margin-top: 20px;
}

/* 欢迎卡片样式 */
.welcome-card {
  height: 100%;
}

.welcome-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.welcome-info {
  margin-left: 15px;
}

.welcome-info h4 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 18px;
}

.welcome-info p {
  margin: 0;
  color: #909399;
  font-size: 13px;
}

.welcome-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: #606266;
}

/* 数据卡片样式 */
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

/* 模块网格样式 */
.module-card {
  height: 100%;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  margin-top: 10px;
}

.module-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  background-color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.module-item:hover {
  background-color: #ecf5ff;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.module-icon {
  color: #409eff;
  margin-bottom: 10px;
}

.module-user { color: #67c23a; }
.module-content { color: #409eff; }
.module-order { color: #e6a23c; }
.module-data { color: #f56c6c; }
.module-system { color: #909399; }
.module-message { color: #9254de; }
.module-basic { color: #13c2c2; }
.module-module { color: #722ed1; }
.module-program { color: #2f54eb; }

.module-name {
  font-size: 14px;
  color: #606266;
}

/* 最近活动时间线 */
.recent-card {
  height: 100%;
}

.timeline-wrapper {
  height: 350px;
  overflow-y: auto;
  padding-right: 10px;
}

.timeline-wrapper::-webkit-scrollbar {
  width: 6px;
}

.timeline-wrapper::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 4px;
}

/* 快速访问链接 */
.quick-access-card {
  height: 100%;
}

.quick-links {
  margin-top: 10px;
}

.quick-link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
}

.quick-link-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
}

.quick-link-item span {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
}

/* 系统公告样式 */
.notice-card {
  height: 100%;
}

.notice-list {
  height: 180px;
  overflow-y: auto;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-content {
  display: flex;
  align-items: center;
}

.notice-content .el-icon {
  margin-right: 10px;
}

.notice-title {
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.notice-time {
  font-size: 12px;
  color: #909399;
}

/* 系统信息样式 */
.info-card {
  height: 100%;
}

.system-info {
  padding: 10px 0;
}

.info-item {
  display: flex;
  margin-bottom: 15px;
  line-height: 24px;
}

.info-label {
  color: #909399;
  font-size: 14px;
  width: 80px;
}

.info-value {
  color: #303133;
  font-size: 14px;
  flex: 1;
}

/* 待办事项样式 */
.todo-card {
  height: 100%;
}

.todo-list {
  min-height: 330px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-info {
  display: flex;
  align-items: center;
}

.todo-time {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.no-data {
  text-align: center;
  color: #909399;
  padding: 40px 0;
}
</style> 