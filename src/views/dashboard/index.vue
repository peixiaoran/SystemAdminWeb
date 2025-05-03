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
          <div v-loading="loading" class="module-grid">
            <div 
              v-for="module in modules" 
              :key="module.id" 
              class="module-item"
              @click="navigateToModule(module.path)"
            >
              <el-icon :size="30" :class="`module-icon module-${module.id}`">
                <component :is="getIconByName(module.name)" />
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
import { get } from '@/utils/request';
import { MODULE_API } from '@/config/api/login/api';

const router = useRouter();
const currentTime = ref(new Date().toLocaleString());
const browserInfo = ref('');
const modules = ref([]);
const loading = ref(false);

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
    // 异常时显示默认模块
    setDefaultModules();
  } finally {
    loading.value = false;
  }
};

// 设置默认模块(当接口出错时使用)
const setDefaultModules = () => {
  modules.value = [
    { id: 'user', name: '用户管理', path: '/dashboard/user-admin' },
    { id: 'content', name: '内容管理', path: '/dashboard/content-admin' },
    { id: 'order', name: '订单管理', path: '/dashboard/order-admin' },
    { id: 'data', name: '数据分析', path: '/dashboard/data-admin' },
    { id: 'system', name: '系统设置', path: '/dashboard/system-admin' },
    { id: 'message', name: '消息中心', path: '/dashboard/message-admin' },
    { id: 'basic', name: '基础模块', path: '/dashboard/system-basic' }
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
    '消息中心': 'Message',
    '基础模块': 'Setting'
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