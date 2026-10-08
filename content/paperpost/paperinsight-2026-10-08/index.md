---
id: paperinsight-2026-10-08
title: >-
  World Models Dream of Success: Diagnosing and Repairing Failure Insensitivity
  in Robot World Models
abstract: CureWM 用同一起点的执行验证动作变体修复机器人世界模型对失败不敏感的问题，但预测判别改善尚未稳定转化为闭环任务收益。
date: '2026-10-08'
lang: zh
topic: Robotics
tags:
  - robot-manipulation
  - paper-insight
  - world-model
  - contact-rich-manipulation
series: Robot Manipulation Daily
draft: false
paper:
  title: >-
    World Models Dream of Success: Diagnosing and Repairing Failure
    Insensitivity in Robot World Models
  authors:
    - Jiuyi Xu
    - Xiao Hu
    - Meida Chen
    - Peng Gao
    - Yang Ye
    - Yangming Shi
  url: 'https://arxiv.org/abs/2610.09134'
source: 2026-10-08_robot_manipulation_daily.md
sourceHash: e40d7fd95727d4a5845afb54e7a8e07c44d18ce431c5ec2101386794859bc067
---
检索截至 **2026-10-08 17:16:07（北京时间，UTC+08:00；09:16:07 UTC）**，主窗口为 2026-10-05 17:16:07 至 2026-10-08 17:16:07。以下三项均有这个窗口内的 arXiv v1 和 10 月 8 日的 cs.RO 新论文列表作为可核验公开证据；v1 的提交时刻不能等同于公众可阅读时刻。本次不启用七天回退。对仓库当时的 `inbox/paperinsight/` 和 `content/paperpost/` 历史按基础 arXiv ID、标题与官方地址核对，未见这三项的既有日报。

今天最值得细读的是世界模型的**失败敏感性**：模型能否在同一场景里辨别两段动作的不同后果，而不只是生成看似合理的未来。CureWM 在固定已发布模型架构和原训练目标的条件下，用真实执行标注的反事实动作补足这类证据。它的预测判别改善有较细的对照，但不应直接读作机器人闭环成功率提升。

## 今日精选

| 工作与来源 | 首次公开的可核验证据 | 方法 | 为什么值得读 |
|---|---|---|---|
| **首推** · [World Models Dream of Success: Diagnosing and Repairing Failure Insensitivity in Robot World Models](https://arxiv.org/abs/2610.09134) | [10 月 8 日 cs.RO 新列表](https://arxiv.org/list/cs.RO/new)；[v1 历史](https://arxiv.org/abs/2610.09134)记载 10 月 6 日提交 | 机器人世界模型、执行验证的反事实回放 | 将降低“乐观”与真正分辨成败拆开评价；跨模拟和一台真机检查修复边界。 |
| [FlashNeRD: Performance-First Contact-Rich Neural Robot Dynamics](https://arxiv.org/abs/2610.09130) | [10 月 8 日 cs.RO 新列表](https://arxiv.org/list/cs.RO/new)；v1 记载 10 月 6 日提交 | 流式神经动力学、可变接触、解析约束耦合 | 让学习动力学承担机器人自由运动预测，由解析求解器处理机器人与物体的双向接触。 |
| [From Wearable Interfaces to Dexterous Policies: Contact Shifts and Tactile Representations](https://arxiv.org/abs/2610.08870) | [10 月 8 日 cs.RO 新列表](https://arxiv.org/list/cs.RO/new)；v1 记载 10 月 6 日提交 | 穿戴式示教、触觉表示、灵巧操作 | 控制映射和触觉模块保持一致时，采集端几何仍改变可记录的接触与策略表现。 |

FlashNeRD 将既有 NeRD 的固定接触探针换为对任意检测接触的集合编码，并让 MJWarp 在预测的自由运动之后统一求解机器人与物体的约束力。在六种平台攀爬地形上，采用 FlashNeRD 的采样式规划通过 6/6，固定接触 NeRD 为 1/6；中位规划时间分别为 1720 和 2441 ms。不过规划实验同时改变网络结构与接触表示，不能把差距单独归因于接触编码；模型吞吐数据是在 GB200 上、输入已经驻留 GPU 的条件下测得。[原文 §III–IV、Table II](https://arxiv.org/html/2610.09130v1)。

穿戴式接口研究比较 DexUMI 系列外骨骼的两版手侧结构：同一 12 自由度 XHand 指令映射及三指触觉模块，修订版扩大手指空间并减少指尖外壳对触觉垫的遮挡。在杯盖旋转和蛋盒开合的匹配示教预算下，修订接口训练出的策略在四项“任务×触觉输入”对照中均较高；保留触觉垫空间位置及合力的输入也在六项对照中均优于每指一个二值接触标志。每种策略—任务条件只训练一个策略、做 20 次 rollout，空间信息与力信息的单独作用未被拆开。[原文 §III–VI、Table II](https://arxiv.org/html/2610.08870v1)。

## 为什么世界模型会把失败“梦成”成功

[论文 v1](https://arxiv.org/html/2610.09134v1)的作者为 Jiuyi Xu、Xiao Hu、Meida Chen、Peng Gao、Yang Ye 和 Yangming Shi。arXiv 历史记载 v1 于 **2026-10-06 21:26:19 UTC 提交**；这是提交记录，而不是已核实的公开时刻。10 月 8 日 cs.RO 新列表是本次可确认的公开证据，未发现更早且可证实的官方公开记录。作者[代码仓库](https://github.com/jiuyixu25/CureWM)提供扰动引擎、LIBERO/ManiSkill3 接口、训练配置片段、真机流程与分析脚本；README 明确表示不再分发模型权重、微调 checkpoint 和模拟器数据，依赖第三方世界模型与模拟器仍需另行准备。

世界模型在机器人规划中常扮演“试动作并预测后果”的角色。若给两个不同动作序列都预测到抓住杯子的画面，规划器便无法凭模型判断哪一个会松手。论文将此称为 failure insensitivity（失败不敏感）：给定同一观察历史与任务上下文 $x$，成功序列 $a^+$ 与执行后失败的序列 $a^-$ 没有在模型预测中形成应有区分。仅统计失败动作得到的高分比例还不够；模型可能把成功、失败都打低，表面上的“乐观偏差”下降，却依然不会排序。

![同一场景中执行成败不同，已发布世界模型仍想象出成功结局](assets/2026-10-08/curewm/phenomenon.png)

图 1（论文 v1）：同一起点的原动作成功，扰动动作使杯子滑落；右侧已发布模型对失败动作却预测出近似成功的终态。图中成败来自实际执行，灰色预测才是模型输出。[论文 v1 图 1](https://arxiv.org/html/2610.09134v1)；[作者原图](https://github.com/jiuyixu25/CureWM/blob/main/docs/phenomenon.png)。

这个问题与训练数据覆盖有关，但不是“加些负样本”就已证明可以解决。Appendix B 的简化论证指出：若每个上下文只有一个观测动作 $a=\pi(x)$，只看状态的预测器 $h(x)=f(x,\pi(x))$ 可在已观测样本上取得与动作条件预测器 $f(x,a)$ 相同的经验损失。因此训练误差小，不保证它学过同一状态下替代动作的结果。相反，在相同上下文里给成功和失败的动作提供相反标签，会使仅依赖状态的分类器无法同时拟合两者。这是关于数据可辨识性的论证，**没有证明**实际神经网络一定忽略动作，也没有证明共享前缀是所有改善的唯一原因。

论文以已发布的 Cosmos Policy 和 Ctrl-World 两类模型做诊断与修复，ALOHA 的 Cosmos Policy checkpoint 仅诊断、不参与修复。新贡献主要在**修复数据怎样构造、验证和评价**：保留网络架构和原有损失，对同一成功演示构造不同严重度的可执行动作，观察真实成败，并比较这种数据与常规策略失败数据的效力。扰动类型沿用 MiraBench 的动作编辑思路，不能把六种扰动本身都算作新算法。[原文 §2–3、Appendix B/C](https://arxiv.org/html/2610.09134v1)。

## CureWM 如何产生并使用反事实回放

从一条成功示教 $\xi^+$ 出发，系统区分接近、抓取、搬运和放置阶段，对每类扰动 $f$ 选择介入时刻 $t_f$ 和严重度 $\lambda$。示教在介入之前的动作保持不变；例如抓取不足、过早松手、搬运时滑动或腕部倾斜主要改变相应阶段。原文 Eq. (3) 可写为：

$$
a^{f,\lambda}_{0:T-1}=g_{f,\lambda}(a^+_{0:T-1}),\qquad a^{f,\lambda}_t=a^+_t\quad(t<t_f).
$$

这里 $g_{f,\lambda}$ 是扰动操作，$T$ 是示教长度，$a^+$ 是原成功动作，$a^{f,\lambda}$ 是待检验的候选。**被扰动不等于失败**。每个候选从相应初始场景在模拟器或硬件中实际执行，记录观测、执行动作和任务结果 $\ell\in\{0,1\}$。同一扰动家族只有在严重度递增时的**总体经验失败率不下降**才进入训练，条件不要求每条示教逐一单调。这样得到失败回放 $\mathcal D^-_{\rm rep}$，也保留在扰动后仍成功的 $\mathcal D^+_{\rm rep}$；后者帮助模型见到“偏离演示但尚未失败”的边界，而非一概惩罚动作变化。[原文 §3.3、Fig. 2](https://arxiv.org/html/2610.09134v1)。

![CureWM 从示教扰动、执行验证到原模型后训练的流程](assets/2026-10-08/curewm/overview.png)

图 2（论文 v1）：从成功示教出发按严重度扰动，执行后保留成功与失败回放，再与原训练数据合并以继续训练。图里的严重度、结果与价值柱形仅为流程示意，不是测量数据。[论文 v1 图 2](https://arxiv.org/html/2610.09134v1)；[作者原图](https://github.com/jiuyixu25/CureWM/blob/main/docs/overview.png)。

数据经格式转换 $\mathcal C$ 后与对应已发布模型的原训练数据合并。原文 Eq. (4) 的 $\uplus$ 表示保留重复项的合并：

$$
\mathcal D_{\rm cure}=\mathcal D_{\rm base}\uplus\mathcal C(\mathcal D^+_{\rm rep})\uplus\mathcal C(\mathcal D^-_{\rm rep}).
$$

带价值头的模型把失败回放的价值目标置零，成功回放沿用按剩余步数折扣最终成功奖励的原规则；视频模型用执行中真实记录的画面监督。由已发布权重继续微调**完整预测网络**，继续用模型原有的训练目标和采样过程，不新增成败配对损失或预测头。成败样本在构造上相关，训练器却没有把它们作为显式 pair 输入。LIBERO 使用批量 4、默认学习率 $10^{-5}$、原有折扣因子 $\gamma=0.99$；主要模型在 20,000 步日程中保留 17,500 步 checkpoint，这并非预先指定的停止规则。[原文 Eq. (4)–(5)、Appendix D.2](https://arxiv.org/html/2610.09134v1)。

推理或诊断时，在第一处动作分歧之前取相同观察、任务指令、查询时间和生成随机种子，分别输入成功与失败动作块，再比较预测。对于原生价值 $V_\theta(x,a)$，Eq. (1) 在 $N$ 对动作上计算

$$
\Delta_{\rm SF}=\frac{1}{N}\sum_{i=1}^{N}\left[V_\theta(x_i,a_i^+)-V_\theta(x_i,a_i^-)\right].
$$

$\Delta_{\rm SF}>0$ 表示平均而言成功动作得分更高；同时报告两侧的分数、排序的 AUROC 和固定阈值下把成功误判为失败的比例，才能识别“整体压低价值”的假改善。阈值 0.5 是诊断设定，论文没有把这个原生价值解释为校准后的成功概率。视频预测则用冻结编码器 $\phi$ 提取预测终帧和**已记录**的成功/失败终帧表示，计算预测更接近哪一方；这一离线分数依赖成败参考结果，不能直接当作在线部署时随手可得的失败探测器。[原文 §3.2、Eq. (1)–(2)](https://arxiv.org/html/2610.09134v1)。

## 实验支持了什么，也留下了什么

LIBERO 的官方训练数据有 2,000 条记录，其中含 300 条失败策略 rollout；CureWM 加入 822 条扰动回放（242 条执行确认失败、580 条成功，其中 12 条成功记录重复）。训练扰动来自 Goal 套件，评估包含 484 条失败及 1,196 条成功的 held-out 扰动回放；评估来源示教不用于生成该模型的扰动训练数据，但**大多数仍出现在共同的官方训练数据里**。因此这里的 held-out 是反事实回放层面，不能笼统称为完全未见示教。四个套件的闭环成功率各用 10 个任务、每任务 50 回合。[原文 Appendix D.1–D.2](https://arxiv.org/html/2610.09134v1)。

| LIBERO 指标 | 同步数官方数据微调 | CureWM | 评测口径 |
|---|---:|---:|---|
| Goal 失败动作价值仍大于 0.5 | 79.55% | 30.17% | 484 条已验证失败，Table 1 |
| Goal 成败价值间隔 | 0.003 | 0.282 | 配对动作平均，Table 1 |
| Goal AUROC | 0.495 | 0.743 | 含 1,196 条成功扰动回放，Table 1 |
| Goal 成功回放误报失败 | 31.0% | 38.0% | 阈值 0.5，Table 1 |
| 四套件平均闭环任务成功率 | 96.80% | 96.55% | 各套件等权；每套件每模型 500 回合，Table 1 |

上述数据最有力地说明：在 Goal 的已验证反事实评估上，判别确实变好，但误报成功动作的比例也上升，闭环成功率没有同步改善。在 Spatial、Object 上，无对应套件的反事实训练回放仍有 AUROC 提升；在 LIBERO-10，CureWM 的 AUROC 只有 0.493，失败“乐观”虽然仅 2.51%，成功误报失败却达 99.4%。单看低乐观率会得出错误结论。四个独立微调 CureWM 模型在同一组 Goal 失败评估上得到 30.2%–43.0% 的乐观率，不过训练步数并不完全相同，基线也没有四组逐一配对的随机种子。[原文 Table 1、Appendix D.2](https://arxiv.org/html/2610.09134v1)。

较关键的“为什么选这种失败数据”对照控制了每任务失败数量、同一批 580 条成功回放和 7,500 个训练步：140 条新采集的策略失败使成败价值间隔达到 0.014，而 140 条反事实失败达到 0.124；未加入这类数据的官方数据对照为 0.003。这不是与主表 17,500 步实验同预算的横向拼接。策略失败的任务分布、介入时机和失败类型也不同，因此结果支持**这个配方和预算下**反事实数据更有效，不能单独证明“共享前缀”是唯一因果因素，或一般的策略失败学习无效。[原文 §6.1、Table 5](https://arxiv.org/html/2610.09134v1)。去掉成功扰动回放、换成其它示教的成功回放、错误地把所有扰动回放都标为失败的消融也表明：失败标签必须来自执行，成功伙伴能提供额外信息；但数据组成与曝光量仍难完全拆开。分扰动类型看，抓取不足、提前松手、腕部倾斜受益明显，接触振荡几乎没有 AUROC 增益，腕部倾斜的成功误报升至 68.4%。[原文 Table 5、Appendix D.3/D.5](https://arxiv.org/html/2610.09134v1)。

在 RoboCasa，作者用训练之外的 111 条成功、114 条失败开门/抽屉轨迹测失败检测；扩展到相关任务的回放在 5,000 步时把 AUROC 从已发布模型的 0.634 提高到 0.839。但只用抓取回放的方案虽然增大动作敏感性，却把 OpenDrawer 成功从 28/30 降为 17/30、CloseDoubleDoor 从 30/30 降为 23/30。另有 120 个动作修改例只用于敏感性测量，修改动作**没有重新执行**，不能当成已核实失败。Ctrl-World 在 LIBERO 的 10 个 held-out 配对上，视觉“乐观”由成功演示微调对照的 8/10 降为 6/10，但论文没有建立这两项比例的统计显著差异。[原文 Table 2–3、§4](https://arxiv.org/html/2610.09134v1)。

![Franka 真机杯子抓放与红方块拾取的实际成败](assets/2026-10-08/curewm/hardware_tasks.jpg)

图 4（论文 v1 附录 G）：每行依次为共同起点、成功执行和失败执行；上行为杯子抓放的抓力不足，下行为抓错干扰方块。这里全是物理执行帧，不能当作模型预测质量图。[论文 v1 图 4](https://arxiv.org/html/2610.09134v1)；[作者原图](https://github.com/jiuyixu25/CureWM/blob/main/docs/hardware_tasks.jpg)。

真机使用 Franka Research 3。杯子抓放任务先以成功示教作场景适配，再用 90 条执行失败、24 条成功扰动回放及 31 条普通成功轨迹继续训练；同一步数基线只用后 31 条，因此**真机对照没有匹配不同训练轨迹数**。两轮独立评估各含 15 条失败动作与原成功动作成对，来自各自 10 条留出示教。合并两轮、以成功结果为单一参考的潜在表示距离诊断中，基线有 27/30 个失败预测仍偏成功，CureWM 为 10/30；AUROC 从 0.67 到 0.90。这不是 30 次在线任务成功率，而是依赖记录参考结果的离线预测评价。作者另请三位非作者观察第一轮预测视频，多数评判将适配模型的 8/15 个失败动作预测视为成功，CureWM 为 0/15；不同诊断口径的数字不能混用。[原文 Table 4、Appendix G.1–G.3](https://arxiv.org/html/2610.09134v1)。

![同一失败动作的记录终态与两种世界模型的预测](assets/2026-10-08/curewm/predicted_futures.jpg)

图 3（论文 v1）：四列为连续时刻；上行为杯子实际松脱的记录，中行为仅作场景适配的模型仍想象杯子留在夹爪里，下行为 CureWM 更接近松脱过程。这是一个失败动作的示例，不代表整体闭环任务成功率。[论文 v1 图 3](https://arxiv.org/html/2610.09134v1)；[作者原图](https://github.com/jiuyixu25/CureWM/blob/main/docs/predicted_futures.jpg)。

## 阅读结论与边界

CureWM 给出的是一种对已发布世界模型**补齐动作—后果对照的后训练数据方法**，而非新架构，也不是已证明能普遍提高控制性能的规划算法。它要求有可重置或足够接近的起始场景、可执行扰动以及可靠结果标签；硬件上还受重放漂移和参考终帧可得性影响。论文给出的两种物体、单台机器人上的预测改进值得注意，跨任务传播则有限：杯任务修复没有建立向方块拾取的有益转移，方块任务的正结果使用了本任务的反事实数据。附录还报告一次海绵任务的渲染质量筛查不达标，撤回其转移解释。预测区分成败、维持成功动作高分以及最终闭环收益应继续作为三个分开的指标。[原文 §6.4、Appendix G.2/G.4](https://arxiv.org/html/2610.09134v1)。

## 来源与首发核验

| 工作 | 提交记录与已核实公开证据 | 技术核查位置 |
|---|---|---|
| CureWM | [arXiv v1：2026-10-06 21:26:19 UTC 提交](https://arxiv.org/abs/2610.09134)；[cs.RO 10 月 8 日新列表](https://arxiv.org/list/cs.RO/new) | [v1 全文 §3–6、Appendix B–G](https://arxiv.org/html/2610.09134v1)；[官方代码及开放范围](https://github.com/jiuyixu25/CureWM) |
| FlashNeRD | [arXiv v1：2026-10-06 21:23:24 UTC 提交](https://arxiv.org/abs/2610.09130)；同一 [cs.RO 新列表](https://arxiv.org/list/cs.RO/new) | [v1 §III–IV、Table I–II](https://arxiv.org/html/2610.09130v1) |
| 穿戴式接口研究 | [arXiv v1：2026-10-06 03:22:47 UTC 提交](https://arxiv.org/abs/2610.08870)；同一 [cs.RO 新列表](https://arxiv.org/list/cs.RO/new) | [v1 §III–VI、Table I–II](https://arxiv.org/html/2610.08870v1) |

上述“首次公开”仅主张所列来源中**最早可核实**的 10 月 8 日列表日期，并不把 v1 提交时间写成开放时间，也不凭搜索未见更早记录证明绝对首发。
