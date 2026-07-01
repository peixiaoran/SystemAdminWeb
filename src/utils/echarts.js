/**
 * 按需引入的 ECharts（tree-shaking）
 *
 * 说明：原先各页面使用 `import * as echarts from 'echarts'` 会把整包（约 1.1MB）打进产物。
 * 这里改为只注册项目实际用到的图表与组件，产物体积可显著下降。
 * 如需新增图表类型/组件，请在下面的 use([...]) 中补充对应模块，否则对应图表不会渲染。
 *
 * 当前用到：
 *  - 图表：折线图(line)、饼图(pie)、K线图(candlestick)
 *  - 组件：tooltip、legend、grid、dataZoom、markPoint、axisPointer(cross)
 *  - 其它：graphic.LinearGradient（折线渐变，随 echarts/core 一并提供）
 */
import * as echarts from 'echarts/core'
import { LineChart, PieChart, CandlestickChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  MarkPointComponent,
  AxisPointerComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  PieChart,
  CandlestickChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  MarkPointComponent,
  AxisPointerComponent,
  CanvasRenderer
])

export default echarts
export { echarts }
