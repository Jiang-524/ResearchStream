---
id: paperinsight-2026-09-18-b2a39325
title: >-
  Agile-WAM: An Agile Tactile World Action Model for Contact-Rich
  Robot Control
abstract: >-
  今天最值得读的不是又一个更大的视频生成器，而是两个把触觉纳入未来预测、一个把成功与失败轨迹直接注入冻结流策略的方案；其中 Agile-WAM
  的优势是把接触世界建模压进约 10 ms 级推理，同时给出五项真机任务的逐任务分母。
date: '2026-09-18'
lang: zh
topic: Robotics
tags:
  - robot-manipulation
  - paper-insight
series: Robot Manipulation Daily
source: >-
  2026-09-18_Agile-WAM: An Agile Tactile World Action Model for Contact-Rich
  Robot Control.md
sourceHash: 8b2f0558f82a6d0e343d6bfb282ca2dda2bc6c1f94e9818b38e2c2f022557970
---
- **主检索窗口：** 2026-09-15 09:59:55 至 2026-09-18 09:59:55（UTC−5，滚动 72 小时）。
- **第 4–7 天回退：** 未启用；主窗口内已有 3 项高价值、未报道工作。
- **实际覆盖窗口：** 2026-09-15 09:59:55 至 2026-09-18 09:59:55（UTC−5）。
- **生成时间：** 2026-09-18 09:59:55（UTC−5）。
- **今日一句话判断：** 今天最值得读的不是又一个更大的视频生成器，而是两个把触觉纳入未来预测、一个把成功与失败轨迹直接注入冻结流策略的方案；其中 Agile-WAM 的优势是把接触世界建模压进约 10 ms 级推理，同时给出五项真机任务的逐任务分母。
- **检索范围与证据说明：** 检查 arXiv `cs.RO`、`cs.LG`、`cs.CV` 的最新列表，并回到 arXiv v1 正文、submission history 和作者项目页核验。筛选前读取 researchKing 上 `/home/jiangyingzhuo/paperInsight/` 的既有日报，按 arXiv ID、标题、链接与核心工作身份交叉去重；截至 2026-09-17 已报道的 ArtManip、Real-World RL with MPC Scaffolding、UniDex-ViTac、TAO-Force 等均未重复。下文的数值均来自论文正文表格或明确标注的正文协议；未找到的代码、权重、数据状态写为未知或未公开，不从摘要补造。

## 1. 值得关注的工作（最多 3 项）

| 排名 | 标题 | 类型 / 时间窗口 | 首次公开时间（UTC−5） | 方法标签 | 推荐强度 | 核心理由 | 一手链接 |
|---:|---|---|---|---|---|---|---|
| 1 | Agile-WAM: An Agile Tactile World Action Model for Contact-Rich Robot Control | 论文 / 近 3 天 | 2026-09-17 12:43:51 | WAM、触觉、Flow Matching、模仿学习、接触操作 | ★★★★★ | 用视觉—触觉融合 latent 直接驱动 action/future joint flow；九项仿真与五项真机任务、显式分母和延迟协议使证据最完整 | [论文](https://arxiv.org/abs/2609.20761) · [正文](https://arxiv.org/html/2609.20761v1) · [项目页](https://hanchuzhou.github.io/TARO_project_page/) |
| 2 | DexTouch-WM: Learning Action-Conditioned Tactile World Models from Human Touch for Dexterous Robot Manipulation | 论文 / 近 3 天 | 2026-09-17 11:28:34 | 灵巧手、触觉 WAM、人到机器人重定向、生成式世界模型 | ★★★★☆ | 固定 5 小时机器人数据，把人类触觉扩展到 100 小时；同一 320-taxel 接口与 67-D 动作对齐直接面向 Wuji 20-DoF 手 | [论文](https://arxiv.org/abs/2609.20649) · [正文](https://arxiv.org/html/2609.20649v1) |
| 3 | TraceFlow: Guiding Frozen Flow-Matching Robot Policies with Success and Failure Traces | 论文 / 近 3 天 | 2026-09-17 11:26:28 | VLA、Flow Matching、测试时引导、成功/失败记忆 | ★★★★☆ | 不更新策略权重，仅用 rollout 终止位构造成功吸引、失败排斥场；真机顺序装箱从 21/50 提到 39/50，堆叠一轮后 47/50 | [论文](https://arxiv.org/abs/2609.20646) · [正文](https://arxiv.org/html/2609.20646v1) |

### 1.1 Agile-WAM

【论文事实】它解决的核心矛盾是：接触丰富操作需要触觉未来建模，但现有触觉 World Action Model（WAM，世界—动作模型）常借助大型生成骨干，推理成本与高频控制相冲突。Agile-WAM 把当前 RGB、Tactile Force Field（TacFF，触觉力场）和本体状态编码为单个源 latent，再用轻量 Flow Matching（流匹配）同时生成动作块、未来视觉 latent 和未来触觉 latent；视觉预测对应较远的执行时刻，触觉只预测下一帧（Sec. III-A–C）。【最硬证据】真机五任务各 20 次，Agile-WAM 的成功数为 16、11、13、6、17；相应 VITA-VT 为 11、12、7、3、15（Table II）。端到端动作块推理在 RTX 4090、FP32、batch 1、50 次均值协议下为 10.35±0.14 ms（Table III）。【主要局限】真机每项仅 20 次、没有独立训练种子或置信区间；仿真报告的是训练过程中最高成功率再对 3 seed 取均值，存在 checkpoint-selection 乐观偏差；触觉传感器与夹爪形态固定，尚非灵巧手验证。【与 Jiang 的关系】它最适合检验“触觉未来预测是否比只把触觉当输入更能稳定接触恢复”，可直接迁移到插入、旋拧前的高频局部控制研究。

### 1.2 DexTouch-WM

【论文事实】DexTouch-WM 研究的是人类触觉能否扩展机器人灵巧操作世界模型。人和机器人共用五个 4×4 指尖 pad 与一个 15×16 掌部 pad 的 320-taxel 布局；人手运动经几何归一化和逆运动学重定向为双腕、双 20-DoF 手与头部相机组成的 67-D 动作（Sec. III-B、III-D）。模型以 Wan2.2-TI2V-5B 视频 expert 加轻量 tactile expert，使用 anatomy-aware token 与 Adaptive Layer Normalization（AdaLN，自适应层归一化）条件化。固定 5 小时机器人数据，从 0 增至 100 小时人类数据后，held-out 机器人域 Contact-IoU 从 0.415 提至 0.588，Contact-F1 从 0.554 提至 0.706，视觉 PSNR 从 23.473 提至 27.096（Table I）。【主要局限】最亮眼的是预测指标，不是闭环策略成功率；合成数据替代一半真数据时，三种策略中仅 FTP-1 接近全真数据，pi0.5 与 X-VLA 的四任务均值明显下降（Table IV、Sec. IV-E）。【与 Jiang 的关系】它给出一条很具体的灵巧手数据路线：共享触觉硬件布局加动作重定向，比跨传感器学习一个抽象触觉对齐更直接；但必须用真机策略收益而非 Contact-F1 决定是否值得扩量。

### 1.3 TraceFlow

【论文事实】TraceFlow 在冻结 Vision-Language-Action（VLA，视觉—语言—动作）策略外加一个 TraceBank：按任务进度检索成功与失败动作窗，对流匹配动作生成施加有界的成功吸引和失败排斥；每条新 rollout 只需一个终止成功/失败位，策略、动作 expert 与检索 head 在部署中均不更新（Sec. III）。ARX AC-One 双臂真机的 ordered-fruit packing 中，Task Success Rate（TSR，任务成功率计数）从 21/50 增至 39/50，wrong-sequence 从 20/50 降至 2/50；再把第一轮轨迹加入 bank，不更新权重即达 47/50、wrong-sequence 0/50（Table II）。【主要局限】论文主动报告共享配置下 26-task 聚合几乎不变，Counting/Occlusion 均退化；十轮堆叠每条分支最终都低于自己的峰值，且并发测试时方法未做 head-to-head 对照（Sec. V）。【与 Jiang 的关系】失败轨迹不必丢弃，可作为低成本的动作空间反例；但接触任务中若失败源于未观测到的接触状态，轨迹排斥不能补回信息，需与触觉/力状态一起做检索。

## 2. 今日首推论文深度解读

### 2.1 基本信息

- **标题：** Agile-WAM: An Agile Tactile World Action Model for Contact-Rich Robot Control
- **作者：** Hanchu Zhou, Brendan Lynch, Raman Goyal, Dechen Gao, Begum Kasap, Boqi Zhao, Junshan Zhang。
- **机构：** University of California, Davis；Analog Devices。论文注明部分工作在 Analog Devices 实习期间完成，通讯作者为 Brendan Lynch。
- **首次公开：** arXiv v1，2026-09-17 17:43:51 UTC，即 2026-09-17 12:43:51 UTC−5；arXiv:2609.20761。
- **论文 / 正文 / 项目：** [arXiv](https://arxiv.org/abs/2609.20761) · [HTML 正文](https://arxiv.org/html/2609.20761v1) · [项目页](https://hanchuzhou.github.io/TARO_project_page/)。
- **许可：** CC BY-NC-SA 4.0。
- **代码、数据、权重：** 截至本次核验，arXiv 与项目页未提供可核实的官方代码、训练数据或权重下载入口；状态记为**未公开/未知**，不能因有项目页就视为已开源。

### 2.2 为什么首推

【分析】三篇候选都处理“动作之外还要利用什么信息”。DexTouch-WM 的人类全手触觉规模化最贴近灵巧手，但其强证据集中于预测质量，合成数据对闭环策略的收益并不稳定；TraceFlow 的失败记忆简单且真机增益醒目，但增益集中在顺序错误，无法弥补缺失的感知变量。Agile-WAM 则同时回答了三个更靠近 Jiang 当前问题的问题：触觉是否进入未来动力学、接触恢复是否在真机发生、推理是否足够快。它并非灵巧手，但从感知—预测—动作到延迟和真机分母的证据链最完整，因此排名第一。

### 2.3 问题定义与动机

【论文事实】传统视觉策略面对插入、齿轮啮合和拔插锁扣时会遇到部分可观测性：两张视觉上相近的图像可能对应“已经对准”“压在孔边”“发生卡滞”等完全不同的接触状态。触觉可以补足局部力、接触与滑移信息，但如果仅作为额外输入，模型仍可能学成当前观测到动作的短路映射。WAM 的目标是同时预测动作与未来状态，让表征显式连接“我施加什么动作”和“世界如何变化”。

【论文事实】现有触觉 WAM 往往继承大型预训练视频生成器，带来显存、推理延迟和重复条件注入开销。另一个瓶颈是视觉与触觉时间尺度不同：相邻 RGB 高度冗余，而接触力可在一次接触建立时陡变。统一预测 horizon 会让短视觉目标过于容易，或让长触觉目标模糊高频接触变化（Sec. I、III-C）。

【分析】因此该论文真正的问题不是“能否预测下一张图”，而是：能否用一个小而快的共享 latent，把当前多模态状态直接运输到“可执行动作 + 有意义的较远视觉结果 + 近时刻触觉结果”，同时不付出视频生成器的推理代价。

### 2.4 贡献清单：新贡献与工程整合

1. **真正的新贡献——以观测 latent 为 flow source。** 【论文事实】当前视觉、触觉、本体被融合为 $z_0$，直接作为流的源分布，不从高斯噪声起步，也不在每个 ODE 步重复注入 cross-attention 条件；目标 $z_1$ 同时包含动作、未来视觉和未来触觉 latent（Sec. III-A）。
2. **真正的新贡献——多时间尺度监督。** 【论文事实】视觉目标取执行动作后的较远帧，触觉目标固定为下一帧，使监督与模态变化速度匹配（Sec. III-C）。
3. **真正的新贡献——轻量联合 WAM 的系统验证。** 【论文事实】同一策略在 9 个 ManiFeel 仿真任务与 5 个 Flexiv 真机任务上评测，并把端到端推理延迟与生成采样步数固定后比较（Sec. IV）。
4. **工程整合——动作 autoencoder 与 action-space anchor。** 【论文事实】动作编码器/解码器设计借鉴 VITA；训练既重构真实动作，也解码 ODE 生成的动作 latent，防止 latent 动作塌缩（Sec. III-B）。这是关键工程组件，但并非完全原创。
5. **工程整合——标准视觉/触觉编码器。** 【论文事实】视觉用 ImageNet 预训练 ResNet-18，触觉用从头训练的独立 ResNet-18，velocity field 用 MLP，ODE 用 6 步显式 Euler（Sec. IV-A）。创新主要在信息流和目标，而非骨干网络。

### 2.5 方法总览：完整 pipeline

1. 在环境步 $t$ 读取腕部 RGB、TacFF 触觉力场和机器人本体状态。
2. 视觉 ResNet-18、触觉 ResNet-18 分别编码；与本体向量拼接后线性投影为源 latent $z_0$。
3. 将训练动作块送入动作 autoencoder，得到目标动作 latent $z_1^a$；视觉/触觉 encoder 分别编码较远视觉帧和下一触觉帧，得到 $z_1^{vis}$ 与 $z_1^{tac}$。
4. 拼成目标 $z_1=[z_1^a,z_1^{vis},z_1^{tac}]$，训练 MLP velocity field 把 $z_0$ 沿直线路径运输至 $z_1$。
5. 同时优化流匹配、动作重构、ODE 动作解码、视觉 latent 预测和触觉 latent 预测五个损失。
6. 推理时只编码当前观测一次，以 6 步 Euler 积分得到预测 joint latent；丢弃未来 latent 的解码需求，只把动作 latent 经 decoder 还原为长度 16 的动作块。
7. 每次执行前 8 个动作，再读取新观测并闭环重规划（Sec. IV-A）。

### 2.6 关键方法细节

#### 2.6.1 从当前多模态观测直接运输到联合目标

设当前观测为 $O_t=[O_t^{vis},O_t^{tac},q_t]$。编码后的 $z_0$ 已含 RGB、触觉和本体信息，目标为：

$$
z_1=[z_1^a,z_1^{vis},z_1^{tac}]
$$

在流时间 $	au\in[0,1]$ 上采用直线插值：

$$
z_\tau=(1-\tau)z_0+\tau z_1
$$

目标速度恒为 $z_1-z_0$，velocity network 的损失为：

$$
\mathcal{L}_{FM}=\mathbb{E}_{\tau,z_0,z_1}
\left[\left\|v_\theta(z_\tau,\tau)-(z_1-z_0)\right\|_2^2\right]
$$

【论文事实】推理从 $z_0$ 解常微分方程：

$$
\frac{dz_\tau}{d\tau}=v_\theta(z_\tau,\tau),\qquad z_{\tau=0}=z_0
$$

【分析】与从噪声采样再每步 cross-attention 条件化相比，这条路径把观测放在轨迹起点，省去重复读取条件。但这也意味着 source 与 target 必须人为匹配维数，且直线路径是否最适合强非线性接触拓扑没有被单独验证。

#### 2.6.2 动作 latent 不能只靠 flow loss

动作 autoencoder 定义为：

$$
z_1^a=E_a(a_{t:t+H}),\qquad \tilde a_{t:t+H}=D_a(z_1^a)
$$

训练同时包含真实动作重构与对 ODE 生成 latent 的动作空间监督：

$$
\mathcal{L}_{AE}=\left\|a_{t:t+H}-D_a(E_a(a_{t:t+H}))\right\|_1
$$

$$
\mathcal{L}_{act}=\left\|a_{t:t+H}-D_a(\hat z_1^a)\right\|_1
$$

【论文事实】第二项的梯度穿过动作 decoder 与 ODE 积分，直接约束部署时实际出现的生成 latent（Sec. III-B）。【分析】这比只要求 latent 接近更稳，因为 latent 小误差经 decoder 后可能变成很大的末端位姿偏差；但论文没有给出关掉两项动作损失的数值消融。

#### 2.6.3 不同模态使用不同未来

视觉和触觉目标为：

$$
z_1^{vis}=E_{vis}(O_{t+h_{vis}}^{vis}),\qquad
z_1^{tac}=E_{tac}(O_{t+h_{tac}}^{tac})
$$

论文设置 $h_{tac}=1$，$h_{vis}=h$，其中 $h=8$ 是每次实际执行的动作数。两项 latent 监督为：

$$
\mathcal{L}_{vis}=\left\|\hat z_1^{vis}-z_1^{vis}\right\|_2^2,\qquad
\mathcal{L}_{tac}=\left\|\hat z_1^{tac}-z_1^{tac}\right\|_2^2
$$

完整目标为：

$$
\mathcal{L}=\lambda_{FM}\mathcal{L}_{FM}+\lambda_{AE}\mathcal{L}_{AE}
+\lambda_{act}\mathcal{L}_{act}+\lambda_{vis}\mathcal{L}_{vis}
+\lambda_{tac}\mathcal{L}_{tac}
$$

【论文事实】Fig. 5(c) 显示“视觉、触觉同 horizon”的两种替代均较差，但正文图没有提供可无歧义抄录的具体数值，因此本报告不补数。【分析】对手内旋拧，触觉并不总是只需下一帧：静摩擦积累、螺纹啮合与滑移风险可跨多个控制周期。更合理的扩展不是把 $h_{tac}$ 固定加长，而是并行预测短、中期触觉或接触事件概率。

#### 2.6.4 训练与推理伪代码

```text
for batch in demonstrations:
    rgb_t, tac_t, proprio_t, action_chunk = batch.current
    rgb_future = batch.rgb[t + 8]
    tac_future = batch.tactile[t + 1]

    z0 = fuse(E_vis(rgb_t), E_tac(tac_t), proprio_t)
    z1_action = E_action(action_chunk)
    z1 = concat(z1_action, E_vis(rgb_future), E_tac(tac_future))

    tau = sample_uniform_0_1()
    z_tau = (1 - tau) * z0 + tau * z1
    optimize(flow_loss + action_reconstruction + generated_action_loss
             + future_visual_latent_loss + future_tactile_latent_loss)

while deploying:
    z = encode_once(current_rgb, current_tactile, proprioception)
    z_hat = euler_integrate(v_theta, z, steps=6)
    action_chunk = D_action(z_hat.action_latent)
    execute(action_chunk[:8])
```

【基于论文 Sec. III 与 IV-A 重写】伪代码只呈现论文明确的信息流；未补造 batch size、学习率、各损失权重或数据增强，因为正文没有披露这些值。

### 2.7 实验设计

#### 2.7.1 仿真

- 【论文事实】ManiFeel benchmark，7-DoF Franka Emika Panda，夹爪装 TacFF。
- 【论文事实】TacFF 分辨率为 10×14，每点记录力大小与 x/y 方向，共 10×14×3；只使用 256×256 wrist camera。
- 【论文事实】每任务用官方数据集 20–50 条 demonstrations。
- 【论文事实】九任务：Bulb Screw、Gear Assembly、Power Plug Insertion、Peg Reorientation、Peg Insertion、USB Insertion、Ball Sorting、Object Search、Nut Bolt Threading。
- 【论文事实】训练 40k–100k steps，每 500 steps 用 50 rollouts 评估；最终报告训练过程中最高 success rate，再在 3 个随机 seed 上平均（Sec. IV-A）。

#### 2.7.2 真机

- 【论文事实】7-DoF Flexiv Rizon 4；Intel RealSense D405 RGB-D wrist camera，320×240、30 FPS。
- 【论文事实】夹爪装 Analog Devices 32×32 压阻触觉传感器，30 Hz。
- 【论文事实】五任务每项用 Meta Quest 3 遥操作采集 50 条 expert demonstrations；每种策略每任务 20 次 rollout。
- 【论文事实】任务包括齿轮装配、圆柱插孔、以太网线插入/拔出、双脚电源插头插入；多项任务包含视觉遮挡、接触搜索或锁扣动作。

#### 2.7.3 Baseline 与共同设置

- 【论文事实】比较 Diffusion Policy（DP，扩散策略）视觉版、DP-VT 视觉触觉版、Tactile-WAM、VITA、VITA-VT。
- 【论文事实】Tactile-WAM 由作者把其 Tactile Asymmetric Attention 复现到 ManiFeel tactile DP；VITA-VT 由作者以与 Agile-WAM 相同的多模态融合方式扩展 VITA（Sec. IV-A）。
- 【论文事实】所有方法动作块长度 $H=16$，每次执行 $h=8$；VITA/VITA-VT/Agile-WAM 为 6 个 ODE steps，DP/DP-VT 为 100 个 denoising steps。
- 【可信度风险】自复现 baseline 不是官方实现的完全等价保证；100 步 diffusion 与 6 步 flow 的速度对比反映默认采样协议，不等于同等质量或同计算预算的架构纯比较。

### 2.8 主要结果

#### 2.8.1 真机成功率：Table II

| 任务 | Agile-WAM | VITA-VT | VITA | 相对最强 baseline 的变化 |
|---|---:|---:|---:|---:|
| Gear Assembly | 16/20（80%） | 11/20（55%） | 15/20（75%） | +5 pp |
| Peg Insertion | 11/20（55%） | 12/20（60%） | 5/20（25%） | −5 pp |
| Power Plug Insertion | 13/20（65%） | 7/20（35%） | 5/20（25%） | +30 pp |
| Internet Cable Insertion | 6/20（30%） | 3/20（15%） | 4/20（20%） | +10 pp |
| Internet Cable Unplugging | 17/20（85%） | 15/20（75%） | 4/20（20%） | +10 pp |
| 五任务算术平均 | 63% | 48% | 33% | 相对 VITA-VT +31.25%；绝对 +15 pp |

【核验说明】63% 来自 63/100，VITA-VT 为 48/100，故相对提升为 15/48=31.25%。摘要写“relative gain 29.4%”，正文未解释其聚合口径，且与 Table II 的直接汇总不一致；本报告以表格原始分母为准，不把 29.4% 当作可复算结论。

【可信解读】Agile-WAM 并非五项全胜：Peg Insertion 低于 VITA-VT 5 个百分点。最强增益来自 Power Plug、Cable Insertion 与 Cable Unplugging，恰好是遮挡与接触反馈更重的任务，这支持触觉建模价值，但样本量不足以证明逐任务显著。

#### 2.8.2 仿真九任务：Table I

| 任务 | Agile-WAM | 最强 baseline | 差值 |
|---|---:|---:|---:|
| Bulb Screw | 92.67±2.49 | VITA-VT 87.33±0.94 | +5.34 pp |
| Gear Assembly | 70.67±2.49 | VITA-VT 68.67±1.89 | +2.00 pp |
| Power Plug Insertion | 59.33±0.94 | VITA-VT 63.33±3.27 | −4.00 pp |
| Peg Reorientation | 42.00±1.63 | VITA 41.33±4.11 | +0.67 pp |
| Peg Insertion | 49.33±0.94 | VITA-VT 47.33±2.49 | +2.00 pp |
| USB Insertion | 62.00±5.89 | VITA-VT 59.33±9.43 | +2.67 pp |
| Ball Sorting | 92.00±0.00 | VITA-VT 90.00±3.27 | +2.00 pp |
| Object Search | 50.67±2.49 | VITA 40.00±3.27 | +10.67 pp |
| Nut Bolt Threading | 92.67±2.49 | VITA-VT 92.00±2.83 | +0.67 pp |

【论文事实】数值是 3 seed 均值±离散度，正文未明确表中的 ± 是标准差还是标准误，因此只保留原记法。【可信解读】九项中 8 项取得最高均值，但其中 5 项领先不超过 2.67 pp；“全面显著优于”会过度解读。Power Plug Insertion 反而落后 4 pp。

#### 2.8.3 推理效率：Table III

| 模型 | 端到端延迟（ms） | 推理上限频率（Hz） | 协议 |
|---|---:|---:|---|
| Agile-WAM | 10.35±0.14 | 96.62 | 6 Euler steps |
| VITA | 9.71±0.11 | 102.99 | 6 steps |
| VITA-VT | 10.52±0.14 | 95.06 | 6 steps |
| DP | 408.59±0.47 | 2.45 | 100 denoising steps |
| DP-VT | 420.34±0.36 | 2.38 | 100 steps |
| TAAM | 636.34±0.90 | 1.57 | 100 steps |

【论文事实】RTX 4090、FP32、batch 1、动作 horizon 16、50 次均值，计时从 observation input 到 action generation（Sec. IV-B2）。【证据矛盾】摘要与贡献列表写 11.9 ms，Table III 写 10.35±0.14 ms；报告优先采用有协议的 Table III，并把摘要值视为未解释差异。【分析】96.62 Hz 是纯 policy inference 理论上限，不是实机闭环频率；真机传感器只有 30 Hz，控制接口、通信和执行也会进一步限频。

### 2.9 消融与失败案例

1. 【论文事实】Fig. 5(a) 比较无 joint future prediction、仅扩大 latent、完整 WAM；正文称收益主要来自未来建模而非容量。但图中数值未在 HTML 正文逐项列出，本报告不抄图猜数。
2. 【论文事实】Fig. 5(b) 显示在视觉+触觉输入下，只预测视觉或只预测触觉均弱于联合预测；视觉-only 设置中，视觉未来预测有帮助。
3. 【论文事实】Fig. 5(c) 显示双模态都 next-frame、双模态都 long-horizon 均弱于视觉长/触觉短的 multi-horizon 设计。
4. 【论文事实】Peg Insertion 真机 55%，低于 VITA-VT 的 60%；仿真 Power Plug 59.33%，低于 VITA-VT 的 63.33%。因此多时间尺度 WAM 不保证每个接触任务占优。
5. 【作者主张】Fig. 4 展示初次插入失败后沿表面滑动搜索孔位、齿轮卡滞后扭转恢复的轨迹。论文未给恢复事件的独立统计数量，不能把可视化案例当作恢复率。
6. 【证据缺口】没有报告真实任务失败分类（滑移、力过大、误对齐、视觉错误）、安全力峰值或传感器迟滞；“gentle recovery”主要是定性描述。
7. 【证据缺口】没有跨触觉硬件、跨夹爪、跨机器人 zero-shot 迁移，无法确认 latent future loss 是否具有 sensor invariance。

### 2.10 可信度审查

#### 支持可信度的因素

1. 【论文事实】覆盖九项仿真与五项真实接触任务，而非单任务概念演示。
2. 【论文事实】真机逐任务给出 20 次分母，合计每策略 100 次，避免只报归一化分数。
3. 【论文事实】仿真使用 3 个随机 seed，任务数据规模、相机/触觉规格、动作 horizon 与采样步数均披露。
4. 【论文事实】baseline 同时包含视觉-only、视觉触觉、扩散策略与触觉 WAM，能区分“有触觉输入”和“预测触觉未来”。
5. 【论文事实】延迟测量固定 GPU、精度、batch、动作长度、采样步数和重复次数。

#### 风险与混杂因素

1. **best-checkpoint 偏差。** 仿真取训练过程中最高成功率，而非预先固定 checkpoint 或最后若干 checkpoint 均值；频繁评估会放大偶然高点。
2. **真机统计不足。** 每任务 20 次且没有 seed、置信区间或显著性检验。以 16/20 对 15/20 之类差异不能断言稳定优势。
3. **baseline 自复现。** Tactile-WAM、VITA-VT 是作者整合版本，公平性依赖复现质量；训练计算、参数量和超参数搜索预算未完整列出。
4. **延迟协议偏向 flow。** 6-step flow 对 100-step diffusion 是实际默认协议，但不是相同 NFE 下的架构比较；未报告 CPU/边缘设备、模型参数量、显存和 FLOPs。
5. **单触觉体系。** 仿真 TacFF 与真机压阻阵列虽都空间化，但分辨率和物理响应不同；论文没有跨 sensor holdout。
6. **单一末端执行器类型。** 研究是平行夹爪触觉操作，不是多指灵巧手；对手内操作、指间力分配的外推有限。
7. **动作监督依然是 imitation。** WAM 辅助表征但没有在线 Reinforcement Learning（RL，强化学习）、value、reward 或模型预测控制；它学到的是 demonstration 分布内的纠错模式。
8. **未来 latent 不解码审计。** 未来预测只在 latent 空间监督，论文没有证明 latent 距离与物理接触误差单调相关。
9. **摘要/表格不一致。** 11.9 ms 对 10.35 ms、29.4% 对直接汇总 31.25% 未解释，降低了 headline 可复算性。
10. **代码未公开。** 关键损失权重、优化器、学习率、batch size、数据切分与执行控制细节不足，限制独立复核。

### 2.11 复现评估

| 项目 | 已知状态 | 影响 |
|---|---|---|
| 论文 / HTML / 项目页 | 已公开 | 架构、主要表格与协议可核验 |
| 官方代码 | 未找到 | 需自行实现数据管线、flow 和训练循环 |
| 数据 | ManiFeel 官方仿真数据可作为入口；真机 250 条演示未见下载 | 仿真可近似，真机数值不可直接复现 |
| 权重 | 未找到 | 无法直接测延迟或复核 checkpoint |
| 传感器 | 仿真 TacFF；真机 ADI 32×32 压阻阵列 | 用户现有触觉硬件需重做标定与编码 |
| 机器人 | Franka Panda 仿真；Flexiv Rizon 4 真机 | 原样硬件复现成本高 |
| 训练算力 | 单 RTX 4090 可完成作者实验 | 任务规模可承受，但总训练时长未知 |
| 关键未知 | loss weights、batch、LR、optimizer、数据增强、控制增益 | 超参重建成本高，结果敏感性未知 |

【分析】**完整数值复现难度：高。** 真机数据、代码、权重与关键训练超参不齐。**核心方法复现难度：中等。** ManiFeel 数据、ResNet-18、MLP flow 与动作 autoencoder 都是标准组件，可先复现 world-model loss 对 success 的增量。**Jiang 的最小复现难度：中等偏低。** 不需要复现五项真机；只需在一个插入或旋拧环境中比较同一 policy 的 tactile-input-only、same-horizon WAM、multi-horizon WAM。

### 2.12 与相关路线的关系

1. **WAM 与 VLA。** Agile-WAM 是 task-specific 的紧凑 WAM，不含语言，也不依赖大型 Vision-Language Model（VLM，视觉语言模型）。它可以作为 VLA 的低层 contact expert：VLA 负责任务语义与阶段切换，Agile-WAM 在触觉出现后接管高速动作块。
2. **RL 与 Model Predictive Control。** 论文没有 reward 或在线 rollout。未来 latent 目前只作辅助监督；若加入 learned success/value head，就可对多个 flow action candidates 做短 horizon 排序，形成轻量模型预测控制，而无需解码像素视频。
3. **触觉与 Sim-to-Real。** 仿真 TacFF 和真机压阻图都用二维空间编码，说明方法接口可共享；但 sensor physics 不同，真正的 sim-to-real 需要校准、噪声/迟滞随机化与 contact-force normalization。
4. **JEPA。** Joint-Embedding Predictive Architecture（JEPA，联合嵌入预测架构）强调在表征空间预测未来而非重建像素。Agile-WAM 的视觉/触觉 latent loss 与此精神接近，但它把动作也作为联合生成目标，并未使用 teacher-target encoder、masking 或 JEPA 专门的防塌缩机制。
5. **DexTouch-WM。** DexTouch-WM 追求大规模人类触觉到灵巧手世界模型，Agile-WAM 追求小骨干高频闭环。前者适合预训练 contact prior，后者适合部署期低层控制；二者可以串联，而不是互斥。

### 2.13 Jiang's Perspective（分析）

1. **对螺丝刀/旋拧，最有价值的是时间尺度拆分。** 视觉可在 8–16 个动作后监督工具姿态进展，触觉则应覆盖下一帧和短窗口的 slip/contact-onset；单一 long-horizon tactile target 很可能平均掉啮合瞬态。
2. **未来触觉 latent 应与可执行性挂钩。** 只让 latent 靠近 encoder target 不能保证力安全。可增加接触事件、滑移、峰值法向力或 torque margin 的辅助头，并检查它们能否预测失败，而不是只看 latent loss。
3. **动作 source flow 对高频控制很诱人，但要验证多峰性。** 从当前观测 latent 直线运输到目标可能比 noise-conditioned policy 更快，却也可能减弱一对多动作分布。对可从左/右绕开或多种再抓取策略，应测 action diversity 与 mode coverage。
4. **灵巧手不应直接照搬单触觉图。** 多指手的触觉是按手指/掌面分块的稀疏图，建议采用 DexTouch-WM 的 anatomy-aware tokenization，再用 Agile-WAM 的多 horizon joint flow，而不是把所有 taxel 拼成一张伪图像。
5. **把 WAM 当低层，而非全栈策略。** 在固定接触阶段让它 30–100 Hz 纠偏；高层 VLA/RL 负责换指、重抓、退出接触和任务阶段切换。这样最符合它的证据边界。

### 2.14 可执行研究建议

#### 实验 A：多 horizon 是否真的优于“触觉只是输入”

- **假设：** 在视觉遮挡的 peg/螺丝刀啮合任务中，视觉长 horizon + 触觉下一帧预测比 tactile-input-only 和同 horizon WAM 提高恢复成功率。
- **最小实现：** 固定同一 ResNet/MLP/action decoder、数据、训练 steps 与动作 horizon；三组只改变 future loss：无 future、视觉/触觉都 8-step、视觉 8-step/触觉 1-step。每组 3 seed。
- **指标：** 总成功率、首次误对齐后的 recovery rate、接触建立时间、滑移次数、峰值力、action jerk；分别报告遮挡与无遮挡。
- **失败判据：** multi-horizon 的成功提升小于跨 seed 标准差，或仅以更大峰值力换取成功；此时未来触觉 loss 没有提供可靠增量。

#### 实验 B：触觉 horizon 应固定还是接触相位自适应

- **假设：** free-space 使用较长触觉 horizon、接触 onset 使用 1-step、稳定接触使用 2–4 step 的 phase-adaptive target，比固定 1-step 更适合旋拧。
- **最小实现：** 用力阈值与滑移检测构造三相位标签，不改主干，只根据相位选择 target offset；与固定 1-step、固定 4-step 比较。
- **指标：** contact onset 检测 F1、触觉预测误差、螺丝有效转角、掉刀率、恢复时间、控制频率。
- **失败判据：** 自适应组的成功/安全指标无提升，或 phase classifier 错误造成超过 5 pp 成功下降；则复杂 horizon 调度不值得保留。

#### 实验 C：从平行夹爪迁移到多指触觉 token

- **假设：** anatomy-aware 指尖/掌面 token 加 Agile-WAM joint flow，比整图 ResNet 在 Wuji/XHand 的接触迁移上更稳。
- **最小实现：** 选一个 3 指或 5 指在手重定向任务，数据量保持 1–3 小时；比较整图 tactile encoder 与 per-finger shared encoder + pad identity embedding。动作与视觉完全相同。
- **指标：** unseen object 成功率、Contact-IoU、每指峰值力、手内滑移、模式覆盖、参数量与延迟。
- **失败判据：** anatomy-aware 编码在 unseen object 的成功提升低于 5 pp 或延迟增加超过控制预算；若 Contact-IoU 提升但控制不升，则不应把预测指标当策略收益。

### 2.15 局限与开放问题

1. 平行夹爪结果不能证明多指灵巧手的指间接触协调。
2. 真机每任务 20 次，没有训练 seed、置信区间或 trial-level 结果。
3. 仿真取训练期最高 checkpoint，可能高估常规复现表现。
4. 关键训练超参、模型维度、参数量、FLOPs 与显存未完整披露。
5. 代码、权重和真机数据未公开，延迟与成功率难独立复核。
6. 摘要的 29.4% 与 11.9 ms 和 Table II/III 的直接可复算值不一致。
7. 未来视觉/触觉只在 latent 空间监督，缺少物理可解释误差标定。
8. 没有 force/torque 安全指标，无法判断恢复是否以更大接触力换来。
9. 没有跨传感器、跨机器人或 sensor-dropout 鲁棒性实验。
10. 没有展示语言条件、长时程任务阶段切换或 open-world generalization。
11. 没有在线 RL 或 test-time adaptation；错误 demonstration 可能被忠实建模。
12. 多 horizon 只试固定 1 与执行长度，最优 horizon 随任务、接触相位变化的问题仍开放。
13. 观测 latent 作为确定 source 对多峰动作分布的影响未审计。
14. 理论推理上限 96.62 Hz 不等于 30 Hz 传感器下的实际闭环频率。

### 2.16 参考来源

1. [Agile-WAM arXiv 摘要与 submission history](https://arxiv.org/abs/2609.20761)：标题、作者、首次公开时间、许可与项目页入口。
2. [Agile-WAM HTML 正文](https://arxiv.org/html/2609.20761v1)：Sec. III 的 joint flow、动作 autoencoder、多 horizon 目标；Sec. IV 的平台、数据、baseline、Table I–III、Fig. 4–5 与评估协议。
3. [Agile-WAM 项目页](https://hanchuzhou.github.io/TARO_project_page/)：作者提供的演示入口；未将项目页存在本身等同于代码开源。
4. [DexTouch-WM arXiv](https://arxiv.org/abs/2609.20649) / [HTML 正文](https://arxiv.org/html/2609.20649v1)：首次公开时间、共享触觉布局、67-D 动作对齐、5h robot + 100h human scaling，以及 Table I–V 的预测/下游边界。
5. [TraceFlow arXiv](https://arxiv.org/abs/2609.20646) / [HTML 正文](https://arxiv.org/html/2609.20646v1)：首次公开时间、成功/失败密度引导、ARX 真机 Table II、仿真 Table III–IV 与 Sec. V 局限。
6. [arXiv cs.RO recent](https://arxiv.org/list/cs.RO/recent)、[cs.LG recent](https://arxiv.org/list/cs.LG/recent)、[cs.CV recent](https://arxiv.org/list/cs.CV/recent)：主窗口候选发现和跨列表核对。

## 3. 今日结论

1. **首读 Agile-WAM 的 Sec. III-A–C、Table II 与 Table III。** 前者解释为什么视觉和触觉不能共用一个未来尺度，后两表分别给出真机逐任务分母和可复算的延迟协议。
2. **Agile-WAM 值得做最小方法复现，不值得立即追完整数值复现。** 核心组件标准、单卡可行，但代码、权重、真机数据与训练超参不齐；先在单个插入/旋拧任务做三组 horizon 消融，信息增益最高。
3. **DexTouch-WM 先看 Sec. III-B/III-D、Table I 和 Sec. IV-E。** 共享触觉布局与动作对齐值得借鉴，但预测分数提升没有自动变成合成数据的闭环策略收益。
4. **TraceFlow 先看 Sec. III-D、Table II 和 Sec. V。** 它说明失败 rollout 可以在不更新权重时变成动作反例，也诚实展示了 Counting/Occlusion 退化；适合做安全有界的局部修正，不适合替代缺失感知。
5. **今天最可执行的研究动作：** 用同一触觉策略比较“只输入触觉—同 horizon 未来预测—视觉长/触觉短预测”，同时记录 recovery、峰值力与滑移；若 multi-horizon 只提高 latent 指标而不提高安全闭环成功率，就应尽早否证。

---

**公式兼容性说明：** 本文仅使用单美元行内公式与独占行的双美元公式块，未使用反斜杠圆括号或方括号定界符。已执行 UTF-8、必需标题、链接、行内/块公式定界符配对、公式块独占行、表格中无 LaTeX 公式和代码围栏位置的语法校验；未在目标 Markdown 查看器中进行视觉渲染验证。
