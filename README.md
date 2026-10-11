# ResearchStream

线上网站：[ResearchStream](https://jiang-524.github.io/ResearchStream/)。

一个以 Markdown 为内容源的研究与学习博客。采用个人主页的奶油白 / 日落橙配色，提供 Overview、PaperPost、LearningWall、experimentRecord、Misc. 五个入口。

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
  experimentrecord/<project-slug>/index.md
  experimentrecord/<project-slug>/experiments.yaml
  experimentrecord/<project-slug>/runs/<run-id>/evaluation.csv
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

现有内容包括从 paperInsight 导入的真实日报、明确标注的排版/实验示例和不发布的草稿测试样本。接入真实内容后，可以删除 `content/` 下这些示例文章目录；无需改变页面代码。

## 推荐阅读与 Series

首页推荐区每次随机抽取 4 篇，点击“换一批”优先展示上一批以外的文章。卡片缓慢往返滚动，悬停、聚焦、手动操作时暂停；也可以用暂停按钮控制。系统开启减少动态效果时不自动滚动。

`series` 是系列归属，`order` 是学习顺序，`tags` 用于跨系列检索。例子：

```yaml
series: "RL for dexterous manipulation"
order: 1
tags: [reinforcement-learning, dexterous-manipulation]
```

学习笔记同样可以设置 `series: "矩阵论"`。相同名称的系列可以汇集 PaperPost 与 LearningWall；系列页按 order 排序，未指定顺序的文章按日期升序排列。首页、板块列表和文章中都能进入完整系列；手机也可筛选 Series。

## experimentRecord：给自己和本地 AI 的实验记录规范

给本地 AI 的完整流程见 [ExpRecord.skil](ExpRecord.skil)，标准技能入口在 [.agents/skills/exp-record/SKILL.md](.agents/skills/exp-record/SKILL.md)。把 [process.md 模板](public/templates/experiment-record/process.md) 保存到**实验代码项目根目录**，持续记录运行位置、详细方法、代码入口/调用链、每一步修改及原因和日期、重要实验结果与时间；网站 `index.md` 是完整笔记的发布副本。

本地路径链接供本地编辑器使用；公开网页不能访问电脑磁盘。公开代码同时给出固定 commit 的 GitHub 链接，CSV/视频通过清单中的项目内相对路径发布。每批通常只选最后重要实验最典型的 1–2 个视频。技能包含新项目导入、已有项目增量更新和上线验收步骤。

一个方法或论文对应一个项目目录。实验代码项目的 `process.md` 是这个方法的**本地主记录**，网站 `index.md` 是完整笔记的**发布副本**：保存整体方法框图，解释模块的输入、输出和关系；逐步记录你实际做过的操作、命令、为什么这样做、观察到的输出，以及失败和修复过程。改进实验还要说明改了什么、预期影响和对照条件。不要只留下实验分数或最后跑通的命令。

项目分为“方法与复现笔记”和“实验结果”两个页签。列表支持全文、主题、标签、Series、类型（复现/改进）、项目状态和月份筛选；实验项目按 `updated`（没有则用 `date`）排序和筛选月份。`experimentKinds` 可以同时含两类；`status` 是整个项目状态，独立于每次运行的状态。新增运行后，记得更新这些项目元数据。

从 [详细 process.md 模板](public/templates/experiment-record/process.md)（或 [简版主笔记模板](public/templates/experiment-record/index.md)）和 [实验清单模板](public/templates/experiment-record/experiments.yaml) 开始，放进同一个项目目录。模板默认 `draft: true`、`experiments: []`；准备好公开时再改为 `draft: false`。无结果时也可以先发布主笔记。

```text
content/experimentrecord/my-method/
  index.md                        # 方法主笔记、操作及原因、分析与 TODO
  experiments.yaml                # 多次运行及坐标映射
  assets/method.svg                # 主笔记实际引用的方法框图
  runs/baseline-seed42/
    evaluation.csv                # 保留原始数据
    config.yaml                   # 对应运行的真实配置
    rollout.mp4                   # 可选视频
```

每次运行有 `id`、`number`、`title`、`date`、`kind`、`status`，可以补充 `summary`、`seed`、`commit`、`hardware`、`dataset`、`config`、`videos`。`kind` 只能为 `reproduction`（复现）或 `improvement`（改进）；状态为 `planned`、`running`、`completed`、`blocked`。无结果的运行可以保留 `csvs: []`。

项目 `id` 全站唯一。实验 `id/number` 在项目内唯一，CSV `id/number` 在实验内唯一，指标 `id` 在 CSV 内唯一。清单中的 ID 使用小写字母、数字和短横线。**编号显式填写，允许跳号；不要因排序或删项而重排，也不要复用已经发布的编号。** 界面会展示“项目 · 实验 003 · CSV 02 · 指标”，并保留文件下载入口。

### CSV 与自定义坐标

不要求列名叫 step 或 reward。每个 CSV 声明自己的 `x` 和 `metrics`，通过 `column` 指定真实列名，或通过 `columnIndex` 指定**从 1 开始**的列号；横轴也可以用 `rowNumber: true`（从数据区第一条记录开始计为 1）。三种选择只用一种。显示名称 `label` 与原始列名独立。

```yaml
x:
  column: total_environment_interactions
  label: 环境交互次数
  quantity: environment-interaction
  unit: count
metrics:
  - id: success
    columnIndex: 4
    label: 成功率
    quantity: success-rate
    unit: fraction
```

`headerRow` 默认 1；无表头设为 `null`。`dataStartRow` 默认紧接表头，无表头则默认 1。这些是 CSV 的逻辑记录序号，带引号的跨行单元格仍算一条记录。支持 UTF-8/BOM、逗号/分号/制表符分隔、科学计数法；`delimiter` 默认逗号。重复表头请用列号消歧。

`quantity` 是指标的含义，`unit` 是单位（无单位写 `""`）；跨项目相同含义必须使用一致的键。只有 X 的 quantity/unit 和 Y 的 quantity/unit **全部相同**才叠加；其余自动分图，不做单位换算。0–1 成功率用 `fraction`，0–100 用 `%`，不能写成同一单位来强行合并。比较之前仍需确认任务、数据集和评估协议一致。

数据对比可搜索项目、编号、CSV 和指标，再逐级选择添加多条曲线。每条可隐藏、移除或下载原 CSV。支持 EMA 平滑（0–0.99，默认 0）、淡色原始线、范围拖动、框选缩放、重置、放大与带来源说明的 PNG 导出。EMA 按 X 升序计算：`s[t] = weight*s[t-1] + (1-weight)*y[t]`；空 Y 显示断点并重置 EMA，无效 X 跳过，界面显示计数；不会把缺失值当成 0，不会插值或改写原 CSV。超过 1 万点且没有缺失 Y 的密集曲线按像素保留极值显示，界面会提示；平滑仍使用完整数据，CSV 下载保持原样。含缺失值时保留所有点，避免采样把断点连起来。

### 本地 AI 追加与发布

1. 读取本节和已有项目，优先追加同一方法的项目；按照真实运行结果补主笔记、清单、配置、CSV 和可选视频。未做的实验保留 TODO，禁止生成假结果。
2. 新项目可直接放入 `content/experimentrecord/<slug>/`；也可使用下面的导入命令。导入会验证映射并只复制 Markdown 引用图片和清单声明的 CSV、配置、视频、封面，以及清单本身。
3. 更新项目 `updated`、`experimentKinds`、`status`。保留历史运行和原始 CSV，不覆盖旧结果冒充新实验。
4. 运行检查和生产构建，在结果页核验坐标、原始点、跨实验来源和视频。显式提交该项目文件，遵守仓库的分支流程；开发分支只检查，进入默认分支后才发布 Pages。

```sh
pnpm import --source /path/to/my-method/index.md --collection experimentrecord --slug my-method --dry-run
pnpm import --source /path/to/my-method/index.md --collection experimentrecord --slug my-method
pnpm check
BASE_PATH=/ResearchStream/ SITE_URL=https://jiang-524.github.io pnpm build
pnpm test
```

附件必须位于项目目录内，不能通过 `../` 或符号链接引用外部文件。只发布声明/引用的附件，缺文件、列映射错误、重复编号会让构建失败。大模型权重、原始大日志和私密数据不要提交；大视频建议托管为稳定的 HTTPS MP4/WebM 直链，普通视频网页链接不能直接作为 `<video>` 来源。小视频可与记录同仓库保存，推荐浏览器可播放的 MP4/H.264 或 WebM，并附场景说明。

**实验记录由本地 AI 协助维护，本功能没有新增或修改云端定时任务。** GitHub Pages 仍为静态网站，不需要服务器或数据库。基础索引和已访问的 CSV/配置可离线读取；未访问文件不可离线获得。视频和 Range 请求不进入网站离线缓存，视频需要网络。

`curve-lab` 和 `transfer-lab` 是明确标注的合成演示项目，覆盖同项目/跨项目多曲线、无表头 CSV、不同单位分图和视频。它们不代表你的真实实验，接入真实记录后可移除这两个目录。

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
