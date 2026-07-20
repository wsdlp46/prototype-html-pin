# 标注与连线技术要点（scaffold 版）

> 触发条件：用 scaffold 体系画原型、实现标注连线时读取。
> 本文档对应 scaffold 的 `proto-connect.js`（非旧版 pin-annotation.js）。
> 旧版单文件 Pin 圆点方案见 `assets/annotation-demo.html`，仅作参考。

---

## scaffold 标注机制（proto-connect.js）

scaffold 采用 **SVG 贝塞尔连线 + 编号圆点** 方案，左右双向联动。

### 标注元素属性

- 左侧被标注元素：`class="proto-element"` + `data-proto-id="N"`（N 为编号）
- 右侧说明条目：`class="proto-desc"` + `data-proto-desc="N"`（编号与左侧对应）

### 连线声明（关键，漏写则连线不绘制）

proto-connect.js 的 `drawConnections()` 读取页面声明的 `window.connections` 数组绘制 SVG 连线。**每个需要连线的标注都要在数组里声明**，不声明的标注元素只有 hover 高亮、没有连线：

```javascript
window.connections = [
  { id: '1', selector: '[data-proto-id="1"]', descSelector: '[data-proto-desc="1"]' },
  { id: '2', selector: '[data-proto-id="2"]', descSelector: '[data-proto-desc="2"]' },
  // ...
];
```

> 常见坑：只加了 `data-proto-id` 和 `data-proto-desc` 但没声明 `window.connections`，结果连线不画。build 不会报错，只能打开页面看才知道。

### 自动功能

proto-connect.js 自动处理，无需各页手动写：
- `markActiveSidebar()`：根据当前页 URL 自动给侧边栏对应项加 `active` 类
- `setupConnHover()`：左右 hover 联动高亮（连线加粗、元素加 active-highlight）
- `toggleStdSidebar()`：侧边栏折叠按钮
- `window.resize` 监听：连线重绘

### 样式参数

连线与圆点样式已固化在 proto-base.css：
- 连线：`stroke: var(--brand)`，正常 opacity 0.5，active 时 1
- 编号圆点：`fill: var(--brand)`，白色数字 11px
- proto-element hover：`box-shadow: 0 0 0 2px var(--brand), 0 4px 12px rgba(...,0.15)`
- proto-desc hover：背景 `#fef3c7`，边框 `var(--amber-accent)`
