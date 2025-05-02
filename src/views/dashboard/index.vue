<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover" class="welcome-card">
          <template #header>
            <div class="card-header">
              <h3>控制面板</h3>
            </div>
          </template>
          <div class="welcome-content">
            <h4>欢迎使用 SystemsAdmin 管理系统</h4>
            <p>这是一个通用的仪表盘页面，您可以查看系统概览和常用功能</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :md="24" :lg="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>系统模块</h3>
            </div>
          </template>
          <div class="module-grid">
            <div 
              v-for="module in modules" 
              :key="module.id" 
              class="module-item"
              @click="navigateToModule(module.path)"
            >
              <el-icon :size="30" :class="`module-icon module-${module.id}`">
                <component :is="module.icon" />
              </el-icon>
              <div class="module-name">{{ module.name }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="24" :lg="8">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>系统信息</h3>
            </div>
          </template>
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">系统名称：</span>
              <span class="info-value">SystemsAdmin 管理平台</span>
            </div>
            <div class="info-item">
              <span class="info-label">版本号：</span>
              <span class="info-value">v1.0.0</span>
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
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Setting, 
  User, 
  Document, 
  ShoppingCart, 
  DataAnalysis, 
  Message 
} from '@element-plus/icons-vue';

const router = useRouter();
const currentTime = ref(new Date().toLocaleString());
const browserInfo = ref('');

// 模块列表
const modules = [
  { 
    id: 'user', 
    name: '用户管理', 
    icon: 'User', 
    path: '/dashboard/user-admin'
  },
  { 
    id: 'content', 
    name: '内容管理', 
    icon: 'Document', 
    path: '/dashboard/content-admin'
  },
  { 
    id: 'order', 
    name: '订单管理', 
    icon: 'ShoppingCart', 
    path: '/dashboard/order-admin'
  },
  { 
    id: 'data', 
    name: '数据分析', 
    icon: 'DataAnalysis', 
    path: '/dashboard/data-admin'
  },
  { 
    id: 'system', 
    name: '系统设置', 
    icon: 'Setting', 
    path: '/dashboard/system-admin'
  },
  { 
    id: 'message', 
    name: '消息中心', 
    icon: 'Message', 
    path: '/dashboard/message-admin'
  },
  { 
    id: 'basic', 
    name: '基础模块', 
    icon: 'Setting', 
    path: '/dashboard/system-basic'
  }
];

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
  
  // 更新当前时间
  setInterval(() => {
    currentTime.value = new Date().toLocaleString();
  }, 60000); // 每分钟更新
});
</script>

<style scoped>
.dashboard-container {
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
  padding: 10px 0;
}

.welcome-content h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 18px;
}

.welcome-content p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.mt-20 {
  margin-top: 20px;
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
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.module-item:hover {
  background-color: #ecf5ff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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

.module-name {
  font-size: 14px;
  color: #606266;
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
</style> 