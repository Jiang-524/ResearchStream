# ResearchStream

线上网站：[ResearchStream](https://jiang-524.github.io/ResearchStream/)。

一个以 Markdown 为内容源的研究与学习博客。采用个人主页的奶油白 / 日落橙配色，提供 Overview、PaperPost、LearningWall、Misc. 四个入口。

## 本地运行

需要 Node.js 22.12+（推荐 24）和 pnpm 11.19.0。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

完整生产预览（含 Pagefind 和离线缓存）：

```sh
pnpm build
pnpm test
pnpm check
pnpm preview --port 4321
```

打开 http://localhost:4321 。`pnpm dev` 的搜索使用本地内容匹配以便即时预览，生产构建使用 Pagefind 的中英全文索引；离线功能只在生产预览或 HTTPS 部署启用。不要用 `file://` 直接打开输出文件。

## 内容与导入

```text
content/
  paperpost/<stable-slug>/index.md
  learningwall/<stable-slug>/index.md
  learningwall/<stable-slug>/figure.png
  misc/<stable-slug>/index.md
```

必填 frontmatter：

```yaml
---
id: unique-note-id
title: "笔记标题"
abstract: "一句话说明这篇记录的问题和收获。"
date: "2026-10-07"
lang: zh
topic: Machine learning
tags: [attention, 论文阅读]
draft: false
---
```

日期用引号包围的 `YYYY-MM-DD`。`lang` 为 `zh` 或 `en`。`id` 在整个网站中唯一，目录 slug 决定永久链接。可选 `series`、`order` 管理系列；`translationKey` 把中英文两篇译文配对；`paper.title/authors/url` 保存论文来源。`demo: true` 会显示“示例”标签。

从现有 Markdown 导入，先验证再写入：

```sh
pnpm import --source /path/to/daily-note.md --collection paperpost --slug 2026-10-08-daily --dry-run
pnpm import --source /path/to/daily-note.md --collection paperpost --slug 2026-10-08-daily
pnpm build
```

导入会复制正文实际引用的本地图片，拒绝重复 ID、已有目标目录、缺失摘要、无效日期或找不到的图片。图片放在源 Markdown 同目录或子目录中，不用 `../` 引用目录外图片。正文支持内联和引用式 Markdown 图片。第一张非徽章内容图片用作缩略图，无图不创建封面。

已有不含 frontmatter 的日报需要先补齐元数据；导入命令不会猜测摘要或覆盖原稿。修改已有文章直接编辑对应 `index.md`，之后重新构建。

正文支持数学公式、代码高亮、表格、脚注、任务列表、自动目录。使用普通 Markdown；嵌入 HTML 被清理，不执行 HTML 脚本。站内文章链接可以写 `/learningwall/slug/` 或 `../other-note/index.md`，构建会适配部署子路径。

`draft: true` 不生成公开文章、列表、搜索记录或图片。`public/` 是公开目录，不要把私密笔记放进去。`entries.json` 只包含已发布文章，是公开的搜索内容源。历史上已经发布或下载过的内容，不能通过改为草稿撤回所有访客已有的副本。

当前有 4 篇从 paperInsight 导入的真实历史日报、5 篇标注为示例的内容和 1 篇不发布的草稿测试样本。接入真实内容后，可以删除 `content/` 下这些示例文章目录；无需改变页面代码。

## 推荐阅读与 Series

首页推荐区每次随机抽取 4 篇，点击“换一批”优先展示上一批以外的文章。卡片缓慢往返滚动，悬停、聚焦、手动操作时暂停；也可以用暂停按钮控制。系统开启减少动态效果时不自动滚动。

`series` 是系列归属，`order` 是学习顺序，`tags` 用于跨系列检索。例子：

```yaml
series: "RL for dexterous manipulation"
order: 1
tags: [reinforcement-learning, dexterous-manipulation]
```

学习笔记同样可以设置 `series: "矩阵论"`。相同名称的系列可以汇集 PaperPost 与 LearningWall；系列页按 order 排序，未指定顺序的文章按日期升序排列。首页、板块列表和文章中都能进入完整系列；手机也可筛选 Series。

## 日更自动化与部署

机器人学习与操作日报使用 [专用 Markdown 模板](public/templates/robot-manipulation-daily.md) 和 [检索、首发核验、配图及发布规范](docs/design/robot-manipulation-daily.md)。北京时间（Asia/Shanghai）每日 02:00 在云端启动，目标 04:00 前完成核验并发布；最多 3 项，近 3 天无合格内容才回退近 7 天。文章标题直接用首推论文原名，日期由网站显示；原稿文件名仍保留日期以便归档。

目标仓库 [Jiang-524/ResearchStream](https://github.com/Jiang-524/ResearchStream)，使用独立 GitHub Pages 项目站。无需域名或服务器。

云端每日阅读任务→ 提交 Markdown 到仓库 `inbox/paperinsight/` → GitHub Actions 导入文章、构建、测试 → 发布 Pages。同一份原稿重复导入会跳过，不会重复发文；原稿改变后需要显式 --update。

```sh
pnpm sync:papers --file '/home/jiangyingzhuo/paperInsight/某份日报.md' --dry-run
pnpm sync:papers --file '/home/jiangyingzhuo/paperInsight/某份日报.md'
pnpm sync:papers # 导入仓库 inbox
```

兼容当前旧日报的文件日期、一级标题和“今日一句话判断”；其它格式需要补齐 frontmatter。下一次自动化建议直接输出完整 frontmatter，详见 [可复制的 Work 发布指令](docs/design/work-publishing.md)。

在仓库 Settings → Pages → Source 选择 GitHub Actions。工作流默认发布默认分支，PR 和 agent_dev 仅检查；不需要额外配置 SITE_URL / BASE_PATH，默认地址为 `https://Jiang-524.github.io/ResearchStream/`。自定义域名时可覆盖这两个变量；设置 ENABLE_PAGES=false 可暂停部署。

其他静态平台：构建命令 `pnpm build`，输出目录 `dist`，Node 24，按实际 URL 设置相同变量。GitHub Pages 参考：[Astro 官方部署指南](https://docs.astro.build/en/guides/deploy/github/)。

子路径本地构建示例：

```sh
BASE_PATH=/research/ SITE_URL=https://example.com pnpm build
BASE_PATH=/research/ pnpm preview --port 4321
```

环境变量改变后要重新构建；生成输出与预览服务器需采用相同 base。

## 离线与写作边界

- 联网访问后，基础页面、字体、样式和搜索索引会缓存；访问过的文章和同源正文图片可断网重读。
- 未读文章不会自动下载，离线打开会提示尚未缓存。首次访问、浏览器清理缓存或禁止存储时不保证离线可用。
- 外部图床图片不承诺离线可读。建议把图片与 Markdown 一起保存。
- 网站新版本会刷新仍公开的已读文章，再替换缓存；已删除或改为草稿的文章不会迁移。
- 浏览器切换语言只改变 UI；没有译文的文章保留原语言。
- `/write/` 是诚实的预留入口，提供 Markdown 模板下载；本版未实现在线编辑、云端保存和登录，不显示假保存按钮。

## 下一步 TODO

- [x] 用 paperInsight 的 4 篇真实无图日报验证导入，其中 GeoAAC 由 Action 自动导入。
- [x] 配置每日机器人操作日报任务，提供专用模板与核验/配图/发布规范。
- [ ] 验证首次定时检索与当日内容实际发布。
- [x] 选择独立 ResearchStream 仓库和 GitHub Pages。
- [x] 已启用 Actions 和 Pages，首轮 build / deploy 成功，线上 GeoAAC 文章可访问。
- [ ] 可选：购买域名并配置 DNS/HTTPS；静态站不要求购买独立服务器。
- [ ] 需要在线写作时，明确是否跨设备保存，再实现认证与持久存储接口（见 `docs/design/editor-contract.md`）。

设计稿、原始提案与开发计划见 `docs/design/`。样式以 `src/styles/global.css` 为准。项目在 `agent_dev` 分支开发，提交采用 Codex 代理身份，不修改全局 Git 身份。
