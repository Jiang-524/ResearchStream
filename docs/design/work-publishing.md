# Work 每日论文 → ResearchStream

目标仓库：https://github.com/Jiang-524/ResearchStream
已发布站点：https://Jiang-524.github.io/ResearchStream/

最新日报模板、首发核验和配图规则见 [机器人学习与操作日报规范](robot-manipulation-daily.md)。沿用现有云端任务，按 2026-10-08 的要求调整为北京时间每日 02:00 启动、目标 04:00 前完成发布；云端配置状态见新版规范。GitHub Actions 在 Markdown 提交后导入并发布；不需要购买域名或配置 OpenAI API Key。

## Work 自动化的仓库投递指令

```text
日报生成后，直接将公开版 Markdown 保存到 ResearchStream 仓库的 inbox/paperinsight/YYYY-MM-DD_robot_manipulation_daily.md，并提交到 Jiang-524/ResearchStream 的 main 分支。这个文件就是公开发布的版本。

公开版必须包含 YAML frontmatter：
id: paperinsight-YYYY-MM-DD
title: 首推论文原名（不加日期、日报前缀或另拟副标题）
abstract: 一句话说明本篇阅读的重点
date: "YYYY-MM-DD"
lang: zh
topic: Robotics
tags: [robot-manipulation, paper-insight]
series: Robot Manipulation Daily
draft: false

日报固定归入 Robot Manipulation Daily，按日期排列，不设置 order；更具体的任务和方法用 tags 分类。仅按正文实际方法增添 reinforcement-learning、vla、world-action-model、jepa 等标签，不能因覆盖领域宽泛而全部添加。title 与正文一级标题使用相同论文原名，日期仍保留在 date 和文件名中。生成后检查论文链接和依据，按新版规范保存并检查官方配图和公式渲染。

同一天仅新增一个稳定 id 的日报；重复运行时先检查仓库，完全相同的文件跳过，已有但不同的文章不要直接覆盖。不要通过改文件名发布第二份同日重复日报。

如果运行环境有本地仓库，先获取 main 的最新版本，在干净的独立工作目录中提交当天 inbox 文件并 push，不能把 agent_dev 的开发改动一并发布。不使用 force push。有冲突时停止发布并报告。
如果仅有 GitHub 连接器，在上述仓库 main 分支提交当天 inbox 文件及其实际引用的图片，不要提交无关文件。

提交后查看 Build research journal 工作流：只有 build、deploy 都成功且发布链接可访问，才报告发布成功。若无 GitHub 写权限或部署失败，保留原 Markdown，清楚报告阻塞，不把“本地已保存”说成“网站已更新”。
```

元数据的准确格式示例：

```yaml
---
id: paperinsight-2026-10-08
title: "首推论文原名"
abstract: "用一句话说明今天的核心方法与阅读重点。"
date: "2026-10-08"
lang: zh
topic: Robotics
tags: [robot-manipulation, paper-insight]
series: Robot Manipulation Daily
draft: false
---
```

## 已有文件的兼容导入

旧日报不带 frontmatter 时，导入器从文件名前缀提取日期，从首个一级标题提取标题，从“今日一句话判断”提取摘要，默认归入 Robot Manipulation Daily。先导入 2026-09-15、09-18、09-27 三篇无图原稿，再仅投递 09-20 的 GeoAAC 原稿至 inbox，已由线上 Action 自动导入并发布。没有修改源文件。

```sh
pnpm sync:papers --file '/home/jiangyingzhuo/paperInsight/某份日报.md' --dry-run
pnpm sync:papers --file '/home/jiangyingzhuo/paperInsight/某份日报.md'
# 仓库 inbox 中的待发布文件（Action 自动运行这一条）
pnpm sync:papers
```

不含可识别日期、标题或摘要的旧文章会报错，需要补齐 frontmatter；不会猜测或编造。转换 TeX 的方括号 / 圆括号公式分隔符，但保留代码块。已导入且内容相同的文件跳过；修改旧原稿要人工检查后加 --update。

## 发布链路

Work 提交 inbox → Action 校验并导入 content/paperpost → 构建与测试 → 回写规范化文章 → 同一个 workflow 部署 Pages。

首次在仓库 Settings → Pages → Build and deployment → Source 选择 GitHub Actions。工作流默认按仓库名生成部署子路径，当前为 /ResearchStream/；可用 SITE_URL / BASE_PATH 变量覆盖，ENABLE_PAGES=false 暂停部署。

不要依赖 Action 内的 GITHUB_TOKEN 提交再触发另一个 push workflow，因此构建与部署在同一次运行内完成。GitHub 官方说明：[触发工作流](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)、[Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 已完成验证

[首轮 Action](https://github.com/Jiang-524/ResearchStream/actions/runs/37604802602) 的 build / deploy 均成功。GeoAAC 的规范化文章由 github-actions[bot] 自动提交，线上系列页显示 4 篇真实日报。GitHub Actions 与 Pages 已启用。

## TODO

- [x] 按新版规范配置并启用每日任务。
- [ ] 验证首个定时运行实际提交一天的新日报。历史日报导入与模板构建检查不等同于真实定时运行验收。
