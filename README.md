# 王嘉宁 · 个人网站

研究项目、获奖记录、旅行轨迹，一个纯静态的个人站点。没有框架，没有构建步骤，推上去就能用。

站点地址：https://yqzxwjn.github.io

**站内原有内容已全部清空**，所有需要你填写的位置都用虚线标出来了，见下面的“填写指南”。

## 结构

```
.
├── index.html              首页（研究、获奖、旅行预览、关于、FAQ、联系）
├── research.html           研究项目详情、论文、开放问题
├── travel.html             旅行地图与按年份的行程
├── resume.html             简历页，可直接打印或导出 PDF
├── 404.html                自定义 404
├── privacy.html            隐私说明
├── terms.html              使用条款
├── assets/
│   ├── css/style.css       设计令牌、排版、组件、响应式
│   ├── js/main.js          导航、滚动揭示、地图联动、复制邮箱
│   ├── favicon.svg
│   └── img/
│       ├── map-preview.svg 首页的静态地图
│       └── og.png          社交分享图
├── robots.txt
├── sitemap.xml
└── tools/build-map.mjs     重新生成旅行地图的脚本
```

## 填写指南

所有文字都直接写在 HTML 里，改完刷新页面就能看到。

- **短字段**用 `<span class="ph">…</span>` 标出，会显示成灰色虚线文字，替换成你的内容即可。
- **整段文字**用 `<div class="placeholder-block">` 或 `<span class="ph-text">` 标出。
- **空状态**（旅行页的行程列表）用 `<div class="empty-state">`，填好后可以整段删掉。
- 每处占位上方都有 HTML 注释，说明这里该写什么。

各页的待填位置：

| 页面 | 位置 |
|---|---|
| 首页 | 三张研究卡片（标题、年份、一句话说明、标签、角色）、三个奖项行、关于段落、状态、FAQ 回答 |
| 研究页 | 三个项目（名称、问题、方法、结果）、两篇论文、两个开放问题 |
| 旅行页 | 四组统计、地图、按年份的行程 |
| 简历页 | 教育、研究经历、获奖、技能 |

### 添加内容

- **加一个项目**：复制一整段 `<article class="project">`（研究页）和对应的 `<a class="work-card">`（首页），把 `id` 和链接改成一致。
- **加一个奖项**：复制一段 `<div class="award">`。
- **加一条行程**：复制 `travel.html` 里注释掉的那个 `.trip-year` 区块，`data-city` 要和地图上的城市 id 对应。
- **换主色**：改 `assets/css/style.css` 顶部 `:root` 里的 `--amber`。
- **换标题和简介**：每页 `<head>` 里的 `<title>`、`description`、`og:*`，别忘了改。

## 本地预览

```bash
python -m http.server 8788
# 打开 http://127.0.0.1:8788/
```

直接双击 HTML 也能看，但相对路径和字体加载用本地服务器更接近线上。

## 部署到 GitHub Pages

仓库名必须是 `<用户名>.github.io`，Pages 才会把它当作站点根目录。

```bash
git remote add origin https://github.com/Yqzxwjn/Yqzxwjn.github.io.git
git branch -M main
git push -u origin main
```

推送后在仓库的 Settings → Pages 里确认：

- Source：Deploy from a branch
- Branch：`main`，目录 `/ (root)`

保存后一两分钟，https://yqzxwjn.github.io 就能打开。自定义域名在同一个页面里填，仓库里要留一个 `CNAME` 文件。

## 旅行地图

地图先投影再简化，最后输出成 SVG：

- 投影：Albers 等面积圆锥（标准纬线 25°N 与 47°N，中央经线 105°E）
- 数据：中国行政区划边界，来自 https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
- 简化：屏幕坐标下的 Douglas–Peucker，容差 0.6px

现在脚本里的城市数组是空的，只画底图。加城市时，先改 `tools/build-map.mjs` 里的 `cities`：

```js
{ id: 'beijing', name: '北京', lon: 116.407, lat: 39.904, label: { dx: 2, dy: -15, anchor: 'middle' } },
```

然后重新生成：

```bash
cd tools
npm init -y
npm install d3-geo @mapbox/geojson-rewind
# 把 100000_full.json 放到 tools/china.json
node build-map.mjs
```

脚本会覆盖 `assets/img/map-preview.svg`，并生成 `tools/map-inline.svg`。把后者整段替换到 `travel.html` 里 `<div class="map-scroll">` 内部，再把对应行程写进 `.trip-list`。

## 字体

拉丁字母用 Geist 与 Geist Mono（Google Fonts），中文回落到系统字体。如果想完全离线，可以把字体文件放到 `assets/fonts/` 并改掉 `style.css` 里的 `--font`。

## 许可

页面代码可以随意取用与修改。文字内容、照片与地图的版权归作者所有。
