<template>
  <div class="common-table-container">
    <el-card class="table-card">
      <!-- 过滤条件 -->
      <div v-if="showFilters" class="filter-section">
        <el-form :inline="true" :model="filters" class="filter-form">
          <slot name="filters" :filters="filters" :handleSearch="handleSearch" :handleReset="handleReset"></slot>
        </el-form>
      </div>

      <!-- 表格工具栏 -->
      <div v-if="showToolbar" class="toolbar-section">
        <div class="toolbar-left">
          <slot name="toolbar-left"></slot>
        </div>
        <div class="toolbar-right">
          <slot name="toolbar-right"></slot>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="table-section">
        <el-table
          :data="tableData"
          :loading="loading"
          :border="border"
          :stripe="stripe"
          :max-height="maxHeight"
          :header-cell-style="headerCellStyle"
          :row-class-name="rowClassName"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
          @row-click="handleRowClick"
        >
          <!-- 多选列 -->
          <el-table-column
            v-if="showSelection"
            type="selection"
            width="55"
            align="center"
            fixed
          />
          
          <!-- 序号列 -->
          <el-table-column
            v-if="showIndex"
            type="index"
            :label="indexLabel"
            width="60"
            align="center"
            fixed
          />
          
          <!-- 动态列 -->
          <template v-for="column in columns" :key="column.prop">
            <el-table-column
              :prop="column.prop"
              :label="column.label"
              :width="column.width"
              :min-width="column.minWidth"
              :fixed="column.fixed"
              :align="column.align || 'left'"
              :sortable="column.sortable"
              :show-overflow-tooltip="column.showOverflowTooltip !== false"
            >
              <template #default="scope">
                <slot
                  :name="column.prop"
                  :row="scope.row"
                  :column="column"
                  :$index="scope.$index"
                >
                  {{ formatCellValue(scope.row, column) }}
                </slot>
              </template>
            </el-table-column>
          </template>
          
          <!-- 操作列 -->
          <el-table-column
            v-if="showActions"
            :label="actionsLabel"
            :width="actionsWidth"
            :min-width="actionsMinWidth"
            fixed="right"
            align="center"
          >
            <template #default="scope">
              <slot
                name="actions"
                :row="scope.row"
                :$index="scope.$index"
                :handleEdit="(row) => handleEdit(scope.$index, row)"
                :handleDelete="(row) => handleDelete(scope.$index, row)"
              ></slot>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div v-if="showPagination" class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          :total="total"
          :layout="paginationLayout"
          :background="paginationBackground"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props定义
const props = defineProps({
  // 表格数据
  tableData: {
    type: Array,
    default: () => []
  },
  // 列配置
  columns: {
    type: Array,
    default: () => []
  },
  // 加载状态
  loading: {
    type: Boolean,
    default: false
  },
  // 过滤条件
  filters: {
    type: Object,
    default: () => ({})
  },
  // 分页配置
  pagination: {
    type: Object,
    default: () => ({
      pageIndex: 1,
      pageSize: 20,
      total: 0
    })
  },
  // 显示配置
  showFilters: {
    type: Boolean,
    default: true
  },
  showToolbar: {
    type: Boolean,
    default: true
  },
  showSelection: {
    type: Boolean,
    default: false
  },
  showIndex: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  // 表格样式
  border: {
    type: Boolean,
    default: true
  },
  stripe: {
    type: Boolean,
    default: true
  },
  maxHeight: {
    type: String,
    default: 'calc(100vh - 280px)'
  },
  headerCellStyle: {
    type: Object,
    default: () => ({ background: '#f5f7fa' })
  },
  // 标签配置
  indexLabel: {
    type: String,
    default: () => t('common.index')
  },
  actionsLabel: {
    type: String,
    default: () => t('common.actions')
  },
  actionsWidth: {
    type: String,
    default: '150'
  },
  actionsMinWidth: {
    type: String,
    default: '120'
  },
  // 分页配置
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  paginationLayout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  paginationBackground: {
    type: Boolean,
    default: true
  },
  // 行样式函数
  rowClassName: {
    type: Function,
    default: null
  }
})

// Emits定义
const emit = defineEmits([
  'search',
  'reset',
  'page-change',
  'size-change',
  'selection-change',
  'sort-change',
  'row-click',
  'edit',
  'delete'
])

// 响应式数据
const currentPage = ref(props.pagination.pageIndex)
const pageSize = ref(props.pagination.pageSize)
const total = ref(props.pagination.total)

// 监听分页变化
watch(() => props.pagination, (newPagination) => {
  currentPage.value = newPagination.pageIndex
  pageSize.value = newPagination.pageSize
  total.value = newPagination.total
}, { deep: true })

// 格式化单元格值
const formatCellValue = (row, column) => {
  const value = row[column.prop]
  
  if (column.formatter && typeof column.formatter === 'function') {
    return column.formatter(value, row, column)
  }
  
  // 处理常见的数据类型
  if (column.type === 'date' && value) {
    return new Date(value).toLocaleDateString()
  }
  
  if (column.type === 'datetime' && value) {
    return new Date(value).toLocaleString()
  }
  
  if (column.type === 'currency' && value !== null && value !== undefined) {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(value)
  }
  
  if (column.type === 'number' && value !== null && value !== undefined) {
    return new Intl.NumberFormat('zh-CN').format(value)
  }
  
  return value
}

// 事件处理
const handleSearch = () => {
  emit('search')
}

const handleReset = () => {
  emit('reset')
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  emit('page-change', page)
}

const handleSizeChange = (size) => {
  pageSize.value = size
  emit('size-change', size)
}

const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

const handleSortChange = (sortInfo) => {
  emit('sort-change', sortInfo)
}

const handleRowClick = (row, column, event) => {
  emit('row-click', row, column, event)
}

const handleEdit = (index, row) => {
  emit('edit', index, row)
}

const handleDelete = (index, row) => {
  emit('delete', index, row)
}
</script>

<style scoped>
.common-table-container {
  width: 100%;
  height: 100%;
}

.table-card {
  height: 100%;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-section {
  margin-bottom: 16px;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: center;
  }
  
  .pagination-section {
    justify-content: center;
  }
}
</style> 