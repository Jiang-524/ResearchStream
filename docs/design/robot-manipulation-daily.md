# 机器人学习与操作日报：写作与发布规范

本文与 [Markdown 模板](../../public/templates/robot-manipulation-daily.md) 共同定义日报流程。参考 `RobotTTT.md` 和 `2026-08-28_robot_manipulation_daily.md` 的组织方式：保留从问题到方法、训练推理与实验的深入讲解，减少重复总结、碎片化小节与宽表格。参考稿中的论文信息没有在制定模板时重新核验，不能把它们当成后续日报的数据来源。

## 时间与选题

按用户 2026-10-08 的要求，在 **北京时间（Asia/Shanghai）每日 04:00 前完成并发布**；云端任务安排在 **02:00 启动**，为检索、全文阅读、配图核验和 Pages 部署预留两小时。对应 UTC 前一天 18:00 启动、20:00 截止。日报日期、文件名和正文显示时间均按北京时间；这一要求替代此前“04:00 启动”和固定 UTC−5 的时间约定。04:00 是完成目标，受调度、来源访问、运行额度和部署排队影响时必须如实报告延迟，不能提前宣称发布成功。

运行开始时记录检索截止时刻 T，正常窗口为 [T−72 小时, T]。仅当近 3 天没有符合质量要求且尚未报道的内容时，回退至 [T−168 小时, T]，并在正文说明。窗口上限固定为本次 T，不用写作结束时间悄悄扩大窗口。调度延迟时不要虚报按时完成；执行当日任务并注明实际截止和发布时间，不自动制造缺失日期的历史日报。

最多入选 3 项，优先机器人操作、灵巧操作、手内操作、接触丰富任务、双臂操作和真机学习。方法涵盖 VLA、World Model、World-Action Model、JEPA、强化学习、视觉方法、模仿学习、规划与混合方法，无需为每种路线保留配额。一般 locomotion 或纯视觉/语言模型只有对操作提出直接且实质的新结果时才纳入。

检索 arXiv cs.RO/cs.LG/cs.CV、OpenReview、作者或实验室项目页、官方代码与模型仓库、机构技术报告及有原始证据的技术分析。搜索结果与社交转发用于发现线索；入选依据必须回到原始来源，能够读取足够方法、实验或分析正文。营销稿、空泛趋势评论、无法核实时间的条目和仅修订版本不作为新成果。若首推论文无法阅读全文，不能仅凭摘要完成深读，应换为可核验的候选。

先按操作相关性和贡献实质筛选，再比较证据质量、与已有方法的差异、实验覆盖及开放程度。不要以新闻热度、机构声望或代码星标代替阅读。若只有报告/分析合格，可按其实际文种讲解并注明当日无可深读的新论文，不伪称其为论文。

## 首次公开时间与去重

逐项比对 arXiv submission history、OpenReview 的公开记录、带日期的作者项目公告、官方仓库 release/公告和机构首发文章，以**最早可核验的公开证据**决定是否在窗口内。仓库创建时间或早期内部 commit 时间本身不能证明研究当时已公开；搜索抓取时间、页面最近修改时间、arXiv v2/v3 和新闻转发时间不能重置首发日期。

区分 arXiv v1 的“提交时间”和实际可确认的公开时间；不要把提交时刻自动写成公开时刻。若只找到日期，则写日期与来源时区（未知时明确未知），不能编造时分秒。日期精度的来源按可能时间区间判断；跨窗口边界而无法确认者不入选。发现早于窗口的官方公开记录，即使 arXiv v1 很新也应排除。正文来源表简要保留时间证据、版本和交叉核验结果，关键数字链接到正文及 Section/Table/Figure/Equation。

核对已有 `inbox/paperinsight/` 与 `content/paperpost/`：按 arXiv 基础 ID（忽略 v 后缀）、DOI、规范化论文标题/官方地址去重。近 3 天已有合格项时不为凑满 3 项加入更早成果。既有成果的新代码、权重或版本通常不占“新论文”名额；若报告本身有实质新分析，必须清楚写出文种、首发日期和与旧工作的关系。

## 元数据与正文

完整 YAML front matter 示例以模板为准。`id: paperinsight-YYYY-MM-DD` 稳定且全站唯一；`date` 必须是带引号的真实日期。`lang: zh`、`topic: Robotics`、`series: Robot Manipulation Daily`、`draft: false` 固定。`title` 和正文首个一级标题直接使用核实过的首推论文原名，与 `paper.title` 一致；不加日期、日报前缀、姓名或另拟副标题，原论文名自带的冒号和副标题照录。无论文而选入报告或分析时，用该报告或分析的原名。日期由站点元数据显示，原稿路径仍为 `inbox/paperinsight/YYYY-MM-DD_robot_manipulation_daily.md`，不为修改展示标题改变文件名或稳定 ID。`abstract` 用一个完整句子概括方法及必要边界。日报不设置 `order`，系列自然按日期排列。

站点接受自由文本 topic/tags，没有强制枚举；日报采用受控词汇避免同义标签分裂。基础 tags 为 `robot-manipulation`、`paper-insight`，按实际内容添加 1–5 个标签：

| 维度 | 推荐标签 |
|---|---|
| 任务 | `dexterous-manipulation`, `in-hand-manipulation`, `bimanual-manipulation`, `contact-rich-manipulation` |
| 学习方法 | `reinforcement-learning`, `imitation-learning`, `offline-rl`, `online-rl`, `vla` |
| 表示与预测 | `world-model`, `world-action-model`, `jepa`, `computer-vision` |
| 感知与系统 | `tactile-sensing`, `visuotactile`, `sim-to-real`, `motion-planning`, `test-time-adaptation` |

仅讨论相关工作时提到 JEPA/RL 不足以添加相应方法标签；纯视觉/模仿学习日报无需强加 RL。`paper.title/authors/url` 指向首推论文，作者数组只录入核实过的姓名。无首推论文时省略整个 `paper` 字段。不要写尚无 schema 支持的自定义分类字段；`source/sourceHash` 由导入器生成，原稿不填写。

正文为中文连贯叙述，深读通常约 2500–4500 汉字，按方法复杂度调整而非填充字数。概览表只保留工作、时间、方法、理由四列。首推依次讲清：具体任务和瓶颈；与既有方法的关键差异；输入输出及整体信息流；关键模块和目标函数；训练与部署的差别；实验与消融；结论边界。通过完整段落解释每个设计为何需要、怎样工作以及证据支持到什么程度，避免把摘要改写成贡献清单。其它至多两项各用一段简述，不复制首推的详细摘要。方法可有 2–3 个有具体含义的小标题，避免层层编号。

图放在首次解释它的位置，表只用于真正可比的数字。对核心结果核实任务数量、分母、试验/种子数、预算、硬件、基线和评测协议；区分在线末段成功率与独立冻结评测、相对改善与百分点、推理延迟与整机闭环速度。作者主张与解读者推断用自然句式区分。全文不使用“论文事实”等标签，不包含用户名、个人视角、用户工作的帮助或面向个人的实验建议。来源与署名中的作者姓名应忠实保留。

## 配图、公式与路径

新日报沿用导入器“源文件同目录或子目录”的规则，统一使用：

```text
inbox/paperinsight/YYYY-MM-DD_robot_manipulation_daily.md
inbox/paperinsight/assets/YYYY-MM-DD/<paper-key>/fig-01-overview.png
inbox/paperinsight/assets/YYYY-MM-DD/<paper-key>/fig-02-method.png
inbox/paperinsight/assets/YYYY-MM-DD/<paper-key>/fig-03-setup.png
```

正文引用 `![描述](assets/YYYY-MM-DD/<paper-key>/fig-01-overview.png)`。`paper-key` 用简短 ASCII 小写加连字符；PNG/JPEG/WebP 均可，扩展名与真实格式一致。不要用本机绝对路径、`../`、图片热链或写死 `/ResearchStream/`。Markdown 内联/引用式图片会被识别；不要用 HTML `<img>` 代替，因为它不参与本地资源收集。

首推通常保存 2–4 张：整体框架、非重复的关键方法、1–2 张实验装置/任务设置或必要结果。优先取作者论文 HTML 中原图；否则从已核验版本的 PDF 提取或清晰裁切图区域，检查编号、文字与面板没有截断。只保存所需图片，不把整份 PDF、整页截图或所有图表批量入库。保留原始科学含义、署名和已知许可信息，每张图用中文图注解释如何读，并链接确切论文版本与原图号。无法确认来源或再利用条件时不用；原文无适合图或无法取得时在文章自然说明，不能画图冒充原论文图。下载后实际打开检查清晰度。

第一张非徽章正文图会自动成为卡片缩略图，因此优先框架图。导入器只复制正文实际引用的本地图片：写入 `content/paperpost/<id>/assets/...`，构建后成为 `/ResearchStream/media/paperpost/<id>/assets/...`。图片与原稿应在同一个 Git 提交中。附件 PDF、查证缓存与工作日志放工作目录，不能放进 `public/`。

公式由 Astro 的 `remark-math` 和 `rehype-katex` 渲染，Pages 仅托管生成后的 HTML；不是 Jekyll 数学插件。行内用 `$x_t$`，块公式的 `$$` 各占一行并在前后留空行。每个符号在相邻正文定义，引用原文公式编号。只保留帮助理解的 1–3 个核心公式；不要在行内使用 `$$x_t$$`，不要用未配置的宏、HTML 脚本或依赖 `\label/\ref`。长公式可在块内使用 `aligned`，移动端检查横向溢出。

## 仓库与发布流程

目标为 `Jiang-524/ResearchStream` 的 `main`。当前工作流是 `.github/workflows/site.yml`（名称 `Build research journal`；若以后改名，以实际文件为准），Node 24、pnpm 11.19.0。发布链路：

```text
main 上的 inbox 原稿 + 图片
  → pnpm sync:papers
  → content/paperpost/<id>/index.md + 被引用图片
  → pnpm check → pnpm build → pnpm test
  → Action 回写规范化文章
  → 同一次工作流部署 GitHub Pages
```

实际配置以 `.github/workflows/` 为准。`main`（默认分支）可部署；`agent_dev` 和 PR 仅做检查。默认站点为 `https://jiang-524.github.io/ResearchStream/`；`BASE_PATH=/ResearchStream/`，`SITE_URL=https://jiang-524.github.io`。默认分支的 Action 生成提交不会另起一次 push 构建，部署已包含在同一次运行中。

每次执行按下面顺序完成：

1. 在云端读取仓库当前规范并获取最新 `main`；有 shell 时建立干净云端工作目录，否则通过已连接的 GitHub 工具读取与提交文件。先检查当日文件、稳定 ID 与历史报道，再开展检索。不要把 `agent_dev` 的修改混入 main。
2. 写入当日原稿及实际引用的图片。移除占位符、写作提示、无效链接和不适用段落，检查元数据、首发证据及所有关键数字。
3. 云端有 Node/shell 时使用下列命令验证导入和生产构建；否则先校验 YAML、Markdown、公式和图片引用，再通过现有 GitHub Actions 完成 check/build/test。实际打开新文章，检查标题层级、窄屏表格、公式、图片及图注；输出中不得有 KaTeX 错误或遗留定界符，所有仓库图片应存在且可访问。缺少云端 shell 不能跳过 Actions 与线上渲染验收。
4. 云端导入用于验证，会生成规范化文章；只显式暂存并提交当日 inbox Markdown 与其图片，或用 GitHub 写入工具在同一提交中保存原稿和图片，规范化副本由 Action 回写。不使用 `git add .`，不提交临时材料、缓存、依赖或其他人的文件。
5. 再获取远端确认没有并发更新；常规 fast-forward push 到 `main`，或通过 GitHub 写入工具提交到已核验的 main 版本，不 force push。远端前进时在最新 main 重放本次内容并重验；出现文件冲突或当日已存在不同稿件时保留草稿并报告，不覆盖。
6. 查看与该提交对应的 `Build research journal` 运行，确认 build、deploy 均成功。访问新文章和正文图片并确认新内容，再报告已发布，提供文章、原稿、commit 和 Actions 链接。

```sh
pnpm install --frozen-lockfile
pnpm sync:papers --file inbox/paperinsight/YYYY-MM-DD_robot_manipulation_daily.md --dry-run
pnpm sync:papers
pnpm check
SITE_URL=https://jiang-524.github.io BASE_PATH=/ResearchStream/ pnpm build
pnpm test
BASE_PATH=/ResearchStream/ pnpm preview --port 4321
```

同日完全相同的原稿跳过，不生成第二个文件或 ID。当天已发布时先核对其 Action 与线上状态，成功后结束；仍在部署时继续核验即可。原稿改变后导入器要求显式 `--update`，而日常 Action 不带这个参数：因此修订旧日报必须人工检查原稿与规范化副本，不在定时任务里偷偷覆盖或只改 inbox。另一个细节是 sourceHash 仅覆盖 Markdown；只替换同路径图片可能不会重新导入，修订图片也必须走明确更新流程。

构建、推送或部署失败时保存原稿、图片与可复现错误，下一次先检查已成功的步骤。明确的权限或安全拒绝应记录可见的工具名、目标仓库/路径、原始错误和请求 ID，停止被拒绝的动作，不换通道规避；日志不可见时明确说明，不推测拒绝根因。GitHub 返回的 `push: true` 只证明连接声明的权限，不能证明该次运行已成功写入。提交成功不等于站点已发布。云端调度、网络、配额、来源读取或 GitHub 排队可能导致延迟；应报告真实状态与时间，不为赶时限跳过核验。

## 空窗日

3 天无合格项后回退 7 天，仍无合格项时，生成当日简短记录：标题“机器人操作研究：暂无合格新内容”，不加日期；摘要说明已回溯 7 天，保留基础元数据和实际检索截止时间，正文简述覆盖来源与没有入选的主要原因。没有首推则删除 `paper`、方法标签、深读、公式与配图部分。不重复旧论文，不虚构新成果；来源不可访问导致未能完成检索时应报告“检索不完整”，不能写成“没有新内容”。

## 自动任务运行条件与验收

日报改由 ChatGPT Work 云端托管任务执行，通过已有 GitHub 连接读取并写入仓库；GitHub Actions 负责发布，**不会自行检索或写稿**。正常云端运行不依赖用户电脑开机、Codex 桌面 app 运行、本机目录或 SSH 凭据。GitHub 连接必须保持有效并具有目标仓库的写入权限。权限、额度或连接失效时应保留云端产物并明确提示，不把“已安排任务”说成“日报已发布”。[官方定时任务说明](https://learn.chatgpt.com/docs/automations)

2026-10-08 在原云端对话中更新并回读了既有任务 **Robot Manipulation Daily**：已启用，时区为 Asia/Shanghai，每日 02:00 启动、目标 04:00 前完成发布；首次采用新时刻的运行是 2026-10-09 02:00。旧 Codex 本机任务保持暂停，历史同类云端任务保持停用，未新增重复任务。文章完成后给出简短中文摘要与发布链接；同日已完成且没有新状态时保持安静，发布失败或需处理的阻塞及时说明。

模板与构建检查不等同于一轮真实论文检索。此前云端运行曾报告写入失败，但可读取的记录没有包含原始拒绝详情，因此尚不能确认失败根因，也不能把已有的连接权限视为端到端发布验收。后续真实运行仍需核验来源、图片获取、当日内容质量、原稿与图片同次提交以及线上发布结果，不应提前宣称未来每天一定准时完成。
