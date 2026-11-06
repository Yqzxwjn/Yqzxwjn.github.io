# 王嘉宁 · 个人主页

参考学术主页的双栏结构：顶部导航、左侧个人信息、右侧正文。白底、衬线字，蓝色作为唯一的强调色。没有框架，没有构建步骤，也没有 JavaScript。

站点地址：https://yqzxwjn.github.io

除姓名、学校、邮箱、GitHub 和一条获奖记录外，其余内容都空着，HTML 注释里标了该写什么。

## 结构

```
.
├── index.html          首页：简介、研究、获奖、旅行、联系
├── resume.html         简历
├── 404.html            自定义 404
├── privacy.html        隐私说明
├── terms.html          使用条款
├── assets/
│   ├── css/style.css   全部样式
│   ├── favicon.svg
│   └── img/
│       └── ican-2026.webp   获奖证书
├── robots.txt
└── sitemap.xml
```

## 填写内容

打开 HTML，找到 `<!-- ... -->` 注释，在下面写内容即可。

- **简介**：两三句话，说明你是谁、在做什么。
- **研究**：项目名称、时间、角色、结论。
- **获奖**：已经放了一条，按 `.entry` 的结构继续加。
- **旅行**：城市和年份。
- **简历**：教育、研究经历、获奖、技能。

侧栏的头像现在是蓝底“王”字占位，换照片时把 `<div class="avatar">王</div>` 换成 `<img class="avatar" src="/assets/img/photo.jpg" alt="王嘉宁">` 即可。

## 设计

- 布局：1080px 容器，左侧 220px 个人信息栏，右侧 720px 正文。
- 字体：Noto Serif SC，单一家族。
- 颜色：正文近黑，链接与当前导航为蓝色 `#1f5fbf`，分隔线浅灰。
- 分节用一条横线隔开，没有卡片、阴影和动画。
- 手机端自动变成单栏：头像和学校并排，链接在下面。

改配色在 `assets/css/style.css` 顶部 `:root`，改布局在 `.layout` 的 `grid-template-columns`。

## 本地预览

```bash
python -m http.server 8788
# 打开 http://127.0.0.1:8788/
```

## 部署

```bash
git remote add origin https://github.com/Yqzxwjn/Yqzxwjn.github.io.git
git branch -M main
git push -u origin main
```

推送后在仓库 Settings → Pages 确认：Source 选 Deploy from a branch，Branch 选 `main` 和 `/ (root)`。

## 许可

页面代码可以随意取用与修改。文字与证书的版权归作者所有。
