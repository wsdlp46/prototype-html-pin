/* ==========================================================================
   proto-connect.js — 数据空间工作台原型公共脚本
   含：当前页自动高亮(active)、连线系统、标注联动、侧边栏折叠。
   所有 W*.html 共用。页面特有交互（如 tab 切换）留在各页内联 <script>。
   ========================================================================== */

// ==================== 当前页自动标记 active ====================
// 根据 location.pathname 的文件名，自动给侧边栏对应项加 active 类。
// 这样 28 个页面共用一份侧边栏 HTML，无需逐页维护 active。
function markActiveSidebar() {
  var current = location.pathname.split('/').pop() || 'W0-工作台仪表盘.html';
  document.querySelectorAll('#stdSidebar .nav-item[data-href]').forEach(function(item) {
    var href = item.getAttribute('data-href');
    // 点击跳转
    item.style.cursor = 'pointer';
    item.addEventListener('click', function() { location.href = href; });
    // 标记 active
    if (href === current) item.classList.add('active');
  });
}

// ==================== 连线系统 ====================
// 页面需声明 window.connections 数组：{ id, selector, descSelector }
function drawConnections() {
  var svg = document.getElementById('connections-svg');
  if (!svg) return;
  var conns = window.connections || [];
  if (!conns.length) { svg.innerHTML = ''; return; }
  var container = document.getElementById('appContainer');
  if (!container) return;
  var containerRect = container.getBoundingClientRect();
  svg.setAttribute('viewBox', '0 0 ' + containerRect.width + ' ' + containerRect.height);
  svg.style.width = containerRect.width + 'px';
  svg.style.height = containerRect.height + 'px';
  var html = '';
  conns.forEach(function(c) {
    var leftEl = document.querySelector(c.selector);
    var rightEl = document.querySelector(c.descSelector);
    if (!leftEl || !rightEl) return;
    var lr = leftEl.getBoundingClientRect();
    var rr = rightEl.getBoundingClientRect();
    var x1 = lr.right - containerRect.left;
    var y1 = lr.top + lr.height / 2 - containerRect.top;
    var x2 = rr.left - containerRect.left;
    var y2 = rr.top + rr.height / 2 - containerRect.top;
    var cx1 = x1 + (x2 - x1) * 0.4;
    var cx2 = x1 + (x2 - x1) * 0.6;
    var d = 'M ' + x1 + ' ' + y1 + ' C ' + cx1 + ' ' + y1 + ', ' + cx2 + ' ' + y2 + ', ' + x2 + ' ' + y2;
    html += '<path class="connection-path" id="conn-path-' + c.id + '" d="' + d + '" data-conn="' + c.id + '"/>';
    var mx = x1 + (x2 - x1) * 0.5;
    var my = y1 + (y2 - y1) * 0.5;
    html += '<circle cx="' + mx + '" cy="' + my + '" r="9" class="conn-label-bg"/>';
    html += '<text x="' + mx + '" y="' + my + '" class="conn-label-text">' + c.id + '</text>';
  });
  svg.innerHTML = html;
}

// ==================== 标注联动高亮 ====================
function setupConnHover() {
  document.querySelectorAll('.proto-element').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      var pid = el.getAttribute('data-proto-id');
      if (!pid) return;
      var path = document.getElementById('conn-path-' + pid);
      if (path) path.classList.add('active');
      var desc = document.querySelector('[data-proto-desc="' + pid + '"]');
      if (desc) desc.classList.add('active-highlight');
    });
    el.addEventListener('mouseleave', function() {
      var pid = el.getAttribute('data-proto-id');
      if (!pid) return;
      var path = document.getElementById('conn-path-' + pid);
      if (path) path.classList.remove('active');
      var desc = document.querySelector('[data-proto-desc="' + pid + '"]');
      if (desc) desc.classList.remove('active-highlight');
    });
  });
  document.querySelectorAll('.proto-desc').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      var pid = el.getAttribute('data-proto-desc');
      if (!pid) return;
      var path = document.getElementById('conn-path-' + pid);
      if (path) path.classList.add('active');
      var proto = document.querySelector('[data-proto-id="' + pid + '"]');
      if (proto) proto.classList.add('active-highlight');
    });
    el.addEventListener('mouseleave', function() {
      var pid = el.getAttribute('data-proto-desc');
      if (!pid) return;
      var path = document.getElementById('conn-path-' + pid);
      if (path) path.classList.remove('active');
      var proto = document.querySelector('[data-proto-id="' + pid + '"]');
      if (proto) proto.classList.remove('active-highlight');
    });
  });
}

// ==================== 侧边栏折叠 ====================
function toggleStdSidebar(toggleEl) {
  var sidebar = document.getElementById('stdSidebar');
  if (!sidebar) return;
  sidebar.classList.toggle('collapsed');
  var icon = toggleEl.querySelector('i');
  if (icon) {
    icon.className = sidebar.classList.contains('collapsed') ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
  }
  setTimeout(drawConnections, 350);
}

// ==================== 初始化 ====================
window.addEventListener('DOMContentLoaded', function() {
  markActiveSidebar();
  drawConnections();
  setupConnHover();
});
window.addEventListener('resize', drawConnections);
