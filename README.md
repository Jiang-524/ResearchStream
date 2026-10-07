# ResearchStream

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

当前有 5 篇标注为示例的内容和 1 篇不发布的草稿测试样本。接入真实内容后，可以删除 `content/` 下这些示例文章目录；无需改变页面代码。

## 日更自动化与部署

处理链：现有自动化输出 `.md` 和图片 → 上述导入命令 → 提交内容变更 → 构建成功后部署 `dist/`。本项目不重复运行论文阅读任务，也没有连接尚未提供的真实日报来源。

`.github/workflows/site.yml` 在推送 main/agent_dev 和 PR 时运行安装、类型检查、构建、测试，并保存可部署产物。默认**不发布**。选用 GitHub Pages 后：

1. 把本项目放进独立仓库，避免覆盖已有个人主页。
2. 仓库 Settings → Pages → Source 选择 GitHub Actions。
3. 设置仓库变量 `SITE_URL`（如 `https://Jiang-524.github.io`）及 `BASE_PATH`（项目站如 `/researchStream/`；自定义域名根目录为 `/`）。
4. 设置 `ENABLE_PAGES=true`，并按你的默认分支调整 workflow 中的分支名。只有推送默认分支或从默认分支手动运行才部署，PR 不发布。
5. 日报提交到该发布分支后会自动更新网站。构建失败时不会部署半成品。

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

- [ ] 提供一份真实日报 Markdown 和图片目录，接入已有自动化输出并验证一轮更新。
- [ ] 确认托管平台和仓库。本轮仅本地运行，未上传或公开部署。
- [ ] 可选：购买域名并配置 DNS/HTTPS；静态站不要求购买独立服务器。
- [ ] 需要在线写作时，明确是否跨设备保存，再实现认证与持久存储接口（见 `docs/design/editor-contract.md`）。

设计稿、原始提案与开发计划见 `docs/design/`。样式以 `src/styles/global.css` 为准。项目仅设置了本地 `agent_dev` 分支，提交采用 Codex 代理身份，不修改全局 Git 身份。
