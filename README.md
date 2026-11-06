# 王嘉宁 · 个人主页

一个极简学术风的个人主页：白底黑字、单一衬线字体、只用横线分隔。没有框架，没有构建步骤，也没有 JavaScript。

站点地址：https://yqzxwjn.github.io

所有内容位置目前都是空的，只在 HTML 注释里标了该写什么。

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
│   └── favicon.svg
├── robots.txt
└── sitemap.xml
```

## 填写内容

打开 HTML，找到 `<!-- ... -->` 注释，在下面写内容即可。

- **简介**：两三句话，说明你是谁、在做什么。
- **研究**：每个项目一段，写名称、时间、角色、结论。需要列表就用 `<ul><li>`。
- **获奖**：年份、名称、级别。
- **旅行**：城市和年份，一句话即可。
- **简历**：教育、研究经历、获奖、技能，各写一节。

排版元素很少，直接用 `<p>`、`<ul>`、`<li>`、`<a>` 就够。需要强调用 `<strong>`，不要用斜体。

## 样式

- 字体：Noto Serif SC（Google Fonts），中文与拉丁共用一个字体。
- 字号：正文 18px，标题 36px，分节标题 20px。
- 颜色只有黑、灰、白，没有强调色。
- 所有分节靠一条细横线分隔，没有卡片、阴影、圆角和动画。

改字号或行距在 `assets/css/style.css` 顶部的 `:root` 和 `body` 里。想换标题字体，改 `--serif` 一处即可。

## 本地预览

```bash
python -m http.server 8788
# 打开 http://127.0.0.1:8788/
```

## 部署

仓库名必须是 `<用户名>.github.io`。

```bash
git remote add origin https://github.com/Yqzxwjn/Yqzxwjn.github.io.git
git branch -M main
git push -u origin main
```

推送后在仓库 Settings → Pages 确认：Source 选 Deploy from a branch，Branch 选 `main` 和 `/ (root)`。

## 许可

页面代码可以随意取用与修改。文字内容的版权归作者所有。
