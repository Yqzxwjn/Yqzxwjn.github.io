# 王嘉宁 · 个人网站

研究项目、获奖记录、旅行轨迹，一个纯静态的个人站点。没有框架，没有构建步骤，推上去就能用。

站点地址：https://yqzxwjn.github.io

## 结构

```
.
├── index.html              首页（研究、获奖、旅行预览、关于、FAQ、联系）
├── research.html           研究项目详情与论文列表
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
└── tools/build-map.mjs     重新生成旅行地图的脚本（可选）
```

## 修改内容

所有文字都直接写在 HTML 里，改完刷新就能看到。

- **首页**：研究卡片在 `#work` 区块，奖项在 `#awards`，旅行数据在 `#travel`，关于与 FAQ 在后半部分。
- **研究页**：每个 `<article class="project">` 是一个项目，三个小节分别是问题、方法、结果。
- **旅行页**：`<div class="trip" data-city="...">` 的 `data-city` 要和地图上的城市 id 对应。地图由脚本生成，见下文。
- **简历页**：`<section class="resume-block">` 对应教育、研究、获奖、技能四块。
- **颜色与字体**：都在 `assets/css/style.css` 顶部的 `:root` 里。改 `--amber` 就能换掉主色。

> 站内的项目指标、奖项、里程、分数等数字是示例内容，发布前请替换成你自己的真实信息。保留不实数据会让整站的可信度打折。

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

重新生成：

```bash
cd tools
npm init -y
npm install d3-geo @mapbox/geojson-rewind
# 把 100000_full.json 放到 tools/china.json
node build-map.mjs
```

脚本会覆盖 `assets/img/map-preview.svg`，并生成 `tools/map-inline.svg`。把后者整段替换到 `travel.html` 里 `<div class="map-scroll">` 内部即可。

## 字体

拉丁字母用 Geist 与 Geist Mono（Google Fonts），中文回落到系统字体。如果想完全离线，可以把字体文件放到 `assets/fonts/` 并改掉 `style.css` 里的 `--font`。

## 许可

页面代码可以随意取用与修改。文字内容、照片与地图的版权归作者所有。
