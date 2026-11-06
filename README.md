# 王嘉宁 · 个人主页

起始页 + 蓝色双栏主页。白底衬线字，蓝色强调，少量过渡动效；没有框架和构建步骤。

站点地址：https://yqzxwjn.github.io

## 结构

```
.
├── index.html          起始页：照片背景 + 毛玻璃进入按钮
├── home.html           主页：简介、研究、获奖、旅行、联系
├── resume.html         简历
├── 404.html            自定义 404
├── privacy.html        隐私说明
├── terms.html          使用条款
├── assets/
│   ├── css/style.css   全部样式
│   ├── js/main.js      目录高亮、滚动显现、证书灯箱
│   ├── favicon.svg
│   └── img/
│       ├── portrait.jpg      头像
│       ├── hero.jpg          起始页背景（现在是占位图）
│       ├── ican-2026.webp    一等奖证书
│       └── ican-2026-2.webp  三等奖证书
├── robots.txt
└── sitemap.xml
```

## 起始页背景

`index.html` 是起始页，背景图在 `assets/img/hero.jpg`，现在是一张夜空照片。换成自己的照片：准备一张横版图（建议 2400px 宽、JPG），覆盖这个文件即可，不用改代码。

背景的压暗和蓝色渐变在 `style.css` 的 `body.splash` 里。如果照片本身比较亮，可以加深最后一层渐变的透明度。

中间那颗按钮是毛玻璃效果：半透明白、`backdrop-filter: blur()`、一圈细边和底部高光，样式在 `.enter`。

## 主页

- 顶部导航固定，往下滚动时出现轻微阴影，当前分节会高亮
- 左栏：头像、学校专业、邮箱/GitHub、本页目录、简历入口
- 右栏：编号分节，获奖用卡片展示，右侧是证书缩略图，点击打开灯箱
- 证书灯箱支持 Esc 关闭、点击遮罩关闭，焦点了会回到原按钮
- 分节进入视口时淡入上移，`prefers-reduced-motion` 下自动关闭

## 填写内容

打开 `home.html`，找到 `<!-- ... -->` 注释，在下面写内容即可：

- **简介**：两三句话。
- **研究**：项目名称、时间、角色、结论。
- **获奖**：复制 `<article class="award-card">`，替换年份、名称、说明和证书路径。
- **旅行**：城市和年份。
- **简历**：教育、研究经历、获奖、技能。

加一条获奖后，如果证书文件放在 `assets/img/`，把卡片里三处路径（两个 `data-lightbox`、`img src`）换成新文件名即可。

## 本地预览

```bash
python -m http.server 8788
# 起始页 http://127.0.0.1:8788/
# 主页   http://127.0.0.1:8788/home.html
```

## 部署

```bash
git remote add origin https://github.com/Yqzxwjn/Yqzxwjn.github.io.git
git branch -M main
git push -u origin main
```

推送后在仓库 Settings → Pages 确认：Source 选 Deploy from a branch，Branch 选 `main` 和 `/ (root)`。

## 许可

页面代码可以随意取用与修改。文字、照片与证书的版权归作者所有。
