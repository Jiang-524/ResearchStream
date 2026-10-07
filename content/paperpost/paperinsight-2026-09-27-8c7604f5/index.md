---
id: paperinsight-2026-09-27-8c7604f5
title: '2026-09-27｜Rolling-WAM: World Action Models with Rolling Imagination'
abstract: >-
  Rolling-WAM 把世界—动作模型的长时间联合去噪摊到连续重规划周期，在几乎保持任务成功率的同时把受控条件下的稳态重规划延迟从 978 ms 降到
  215 ms；它更像一个可与高频触觉/RL 残差控制组合的低频视觉预测器，而不是可直接替代接触反馈的完整灵巧操作方案。
date: '2026-09-27'
lang: zh
topic: Robotics
tags:
  - robot-manipulation
  - paper-insight
series: Robot Manipulation Daily
source: '2026-09-27_Rolling-WAM: World Action Models with Rolling Imagination.md'
sourceHash: 83666d0855bd10b59b08eba818d9cd839d73da1f048146cb726d1ee9f12ff9c3
---
- **主检索窗口：** 2026-09-24 09:57:49 至 2026-09-27 09:57:49（UTC−5）。
- **第 4–7 天回退：** 未启用；主窗口内已有 3 项达到推荐阈值且未见于历史日报。
- **实际覆盖窗口：** 2026-09-24 09:57:49 至 2026-09-27 09:57:49（UTC−5）。
- **生成时间：** 2026-09-27 09:57:49（UTC−5）。
- **今日一句话判断：** Rolling-WAM 把世界—动作模型的长时间联合去噪摊到连续重规划周期，在几乎保持任务成功率的同时把受控条件下的稳态重规划延迟从 978 ms 降到 215 ms；它更像一个可与高频触觉/RL 残差控制组合的低频视觉预测器，而不是可直接替代接触反馈的完整灵巧操作方案。
- **检索范围与证据说明：** 检索并交叉核验 arXiv cs.RO/cs.LG/cs.CV 最近批次、论文 HTML/PDF、项目页和官方仓库；首次公开时间以 arXiv submission history 为准。筛选前按 arXiv ID、标题、项目链接和工作身份核对现有日报与当前会话已交付记录，排除同一工作的版本更新与二次解读。所有数值均回到论文正文表格、图或实验段落核验；“作者主张”与本报告“分析”分开标注。

## 1. 值得关注的工作（最多 3 项）

| 排名 | 标题 | 类型 | 首次公开时间 | 窗口 | 方法标签 | 推荐强度 | 核心理由 | 论文 / 项目 / 代码 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Rolling-WAM: World Action Models with Rolling Imagination | 论文（arXiv） | 2026-09-24 12:58:03（UTC−5） | 近 3 天 | WAM、滚动扩散、Flow Matching、VLA | 强烈推荐 | 直接处理联合视频—动作生成的部署延迟，并提供 LIBERO、RoboTwin 2.0 与 Unitree G1 真机证据 | [论文](https://arxiv.org/abs/2609.30247) / [项目](https://rolling-wam.github.io/) / [仓库](https://github.com/zyinghua/Rolling-WAM) |
| 2 | Faster Visuomotor Policy Learning on Action Manifolds via Riemannian MeanFlow | 论文（arXiv） | 2026-09-24 12:00:57（UTC−5） | 近 3 天 | Riemannian Flow、生成式策略、流形动作 | 推荐 | 在球面与乘积流形上把多步速度积分改为直接流映射，一步采样优势清晰 | [论文](https://arxiv.org/abs/2609.30127) |
| 3 | RAPID: Robot Agentic Programming from Demonstrations | 论文（arXiv） | 2026-09-24 12:58:21（UTC−5） | 近 3 天 | 单演示、Agentic Programming、轨迹优化、接触操作 | 推荐 | 从一段人类演示构造可验证的对象关系程序，覆盖 8 类非抓取接触任务并部署到 Franka | [论文](https://arxiv.org/abs/2609.30249) / [项目](https://yuyaoliu.me/projects/rapid) |

### 1.1 Rolling-WAM

【论文事实】标准 World Action Model（WAM，世界—动作模型）在每次重规划时从噪声重新联合生成未来视频与动作，导致闭环动作更新受视频去噪拖累。Rolling-WAM 把预测窗口拆成多个动作—视频块，让近端块先完成去噪、远端块保持部分去噪状态；执行近端动作后保留尾部预测，并在窗口末端加入新噪声块（Sec. III-B–III-C）。【最硬证据】在单张 NVIDIA A100、RoboTwin 2.0 受控设置中，稳态重规划延迟为 215 ms，Joint-WAM 为 978 ms、Fast-WAM 为 548 ms；LIBERO 平均成功率 98.1%，RoboTwin 平均 93.3%，G1 三项真机任务平均 85.0%（Fig. 5、Tables I–III）。【主要局限】延迟测量排除初始化与 warm-up；真机每任务只有 20 次，且无力/触觉输入。代码仓库已建立并采用 Apache-2.0，但明确写明代码与 checkpoint 尚在准备中。【与 Jiang 的关系】可把滚动 WAM 用作低频长视野先验，让高频触觉或强化学习（Reinforcement Learning, RL）残差策略处理滑移与接触突变。

### 1.2 Riemannian MeanFlow Policy

【论文事实】该工作面向受球面、姿态或乘积流形约束的机器人动作，不再只回归瞬时速度场，而是学习满足半群一致性的流映射，并用 Riemannian Conditional Flow Matching（黎曼条件流匹配）锚定数据分布。【最硬证据】在单次 Network Function Evaluation（NFE，网络函数求值）下，球面 Push-T 的 RMF-v 覆盖率为 78.5%，高于 RFM 的 67.9%；Franka Kitchen 的最佳 RMF 为 41.7%，最佳 baseline 为 23.7%；RoboMimic Tool Hang 的 RMF-v 为 64%，而 Diffusion Policy 为 0%（Tables II–IV）。60 条真机演示只展示部署案例，正文未给对应成功率表。【主要局限】多步预算增大后与基线差距明显缩小；真机证据主要是定性展示。【与 Jiang 的关系】对腕部 $SO(3)$、物体姿态与手指关节乘积空间，显式流形几何可能减少扩散动作投影带来的不连续，适合做灵巧手 action head 的低 NFE 对照。

### 1.3 RAPID

【论文事实】RAPID 从单段视觉人类演示与语言描述自动推断任务成功条件、对象关系、操作 primitive 和交互仿真环境；每个 primitive 不是固定轨迹，而是带几何解析、关系约束与可验证终止条件的局部轨迹优化程序（Secs. IV–V）。【最硬证据】仿真覆盖 8 个推、翻、枢转、倾倒等非抓取任务，每任务 50 个新场景、3 次独立实验；真机 Franka 每任务测试 10 个场景。LIBERO-Pro 六个设置中 RAPID 在五个设置取得最高任务成功率（Table III）。【作者主张】VLM 对质量、摩擦和恢复系数的先验估计，加上 SAM 3D 重建，使 real-to-sim 与 sim-to-real gap 可控。【主要局限】任务程序构建每任务需数十分钟；物理参数来自模型估计，真实接触鲁棒性依赖仿真与控制器；灵巧手 RL 尚被列为未来工作。【与 Jiang 的关系】其对象关系 primitive 可作为螺丝刀啮合、翻转和重新抓持的高层 phase program，但低层接触策略仍应由 RL/触觉闭环学习。

## 2. 今日首推论文深度解读

### 2.1 基本信息

- **标题：** Rolling-WAM: World Action Models with Rolling Imagination
- **作者：** Yinghua Zhou, Junjie Ye, Yiqi Zhao, Hao Dong, Celina Shiyu Wang, Ruohai Ge, Tingyi Yang, Basile Van Hoorick, Gaurav Sukhatme, Vitor Guizilini, Yue Wang
- **机构：** University of Southern California、Brown University、Fudan University、Toyota Research Institute
- **首次公开：** 2026-09-24 12:58:03（UTC−5），arXiv:2609.30247v1
- **论文：** [arXiv 摘要与版本记录](https://arxiv.org/abs/2609.30247)；[HTML 正文](https://arxiv.org/html/2609.30247v1)
- **项目页：** [rolling-wam.github.io](https://rolling-wam.github.io/)
- **代码：** [GitHub 仓库](https://github.com/zyinghua/Rolling-WAM)
- **数据 / 权重：** 未发现独立数据发布或可下载权重。
- **开源状态：** 【论文事实】仓库公开、许可证为 Apache-2.0，但截至本报告生成时仅含 README 与静态资产，并明确注明代码与 checkpoints “will be released soon”；因此不能视为实现已开源。

### 2.2 为什么首推

【分析】三项候选中，Rolling-WAM 对 Jiang 当前的 RL、灵巧手与接触丰富操作研究最有直接工程价值：它抓住 WAM 从“能预测”到“能闭环跑”的核心瓶颈——联合视频去噪的延迟。Riemannian MeanFlow 更偏 action sampler 的几何与低 NFE 效率，真机量化不足；RAPID 的对象关系程序对高层接触阶段有启发，但其控制对象是平行夹爪，且单任务程序构建仍需 agent 反复仿真。Rolling-WAM 则提供了相对完整的三层证据：大规模双臂仿真、常用 LIBERO benchmark、以及 G1 真机多任务 rollout。

首推不等于结论最强。论文证明的是“滚动计算调度能以较低稳态延迟维持 WAM 成功率”，尚未证明未来视觉本身优于同算力的强 Vision-Language-Action（VLA，视觉—语言—动作）策略，也未证明它能应对毫秒级接触突变。

### 2.3 问题定义与动机

【论文事实】在时刻 $t$，策略接收图像观测 $o_t$、机器人本体状态 $s_t$ 与语言指令 $\ell$，输出长度为 $H$ 的动作序列和覆盖相同物理区间的未来视频 latent。WAM 学习以下联合条件分布（Sec. III-A，Eq. 1）：

$$
p_{\theta}\left(\mathbf{a}_{t:t+H-1},\mathbf{v}_{t+1:t+H}\mid c_t\right),
\qquad c_t=(o_t,s_t,\ell)
$$

其中 $\mathbf{a}_{t:t+H-1}$ 是未来动作，$\mathbf{v}_{t+1:t+H}$ 是未来视觉 latent，$c_t$ 是条件上下文，$\theta$ 是模型参数。

瓶颈来自标准 Joint-WAM：每次获得新观测后，完整未来视频和动作都从高斯噪声重新做全部 $N$ 步去噪。视频 token 数量远大于低维动作，导致动作更新被未来视频生成拖慢。Fast-WAM 在部署时取消未来视频生成以换取速度，但也切断了显式视觉未来对动作的条件作用。Rolling-WAM 的动机是保留联合想象，同时不在每个控制周期重复从零生成完整未来。

### 2.4 贡献清单：新贡献与工程整合

#### 真正的新贡献

1. **用于 WAM 的滚动联合去噪。** 将滚动扩散从视频/动作单模态扩展到相互耦合的视频—动作生成；各 chunk 处于不同噪声层级，近端可执行、远端持续精炼（Sec. III-B）。
2. **与部署状态一致的双模式训练。** 训练同时采样初始化 schedule 与稳态 rolling schedule，避免只训练全噪声到全干净、部署却输入部分去噪窗口的分布错位（Sec. III-D，Eqs. 6–8）。
3. **带方向约束的跨模态注意力。** 动作可读取全窗口视觉未来，视频不读取动作，动作之间只在同一 chunk 内交互；这一结构防止跨 chunk 动作直接复制，同时保留长期视觉条件（Fig. 2、Sec. III-D）。
4. **跨仿真与真机的延迟—性能证据。** 在相同训练/评估设置下复现 Joint-WAM 与 Fast-WAM，并报告受控 A100 延迟、50 项 RoboTwin、40 项 LIBERO 及 G1 真机结果（Secs. IV-C–IV-F）。

#### 工程整合而非独立算法贡献

1. 视频 expert 使用 Wan2.2-TI2V-5B 的预训练 Diffusion Transformer（DiT，扩散 Transformer）；Flow Matching（流匹配）、VAE、语言编码器和 Mixture-of-Transformers（MoT，Transformer 混合专家）均沿用既有组件。
2. 动作 expert 是约 1B 参数、30 层、宽度 1024 的 Transformer，并通过插值视频 expert 权重初始化；本身不是新型动作表示。
3. LIBERO、RoboTwin 2.0、Unitree G1 平台和各 baseline 属于验证基础设施；贡献在滚动 schedule 与训练/执行接口，不在新 benchmark 或新硬件。

### 2.5 方法总览：从输入到部署

1. **输入条件。** 当前多视角 RGB、机器人本体状态和语言指令分别进入视频 expert、状态 encoder 和语言 encoder。
2. **窗口表示。** 把长度 H 的未来拆成 W 个 chunk，每个含 K 个动作，故 H=W×K；第 j 个 chunk 同时包含未来视频与动作。
3. **非均匀噪声。** 近端 chunk 噪声最低、远端最高；同一次网络前向并行处理所有噪声层级。
4. **联合模型。** 视频 expert 处理当前图像和未来视频 VAE latent；动作 expert 处理 noisy action。动作 token 可注意所有视觉 chunk，视频 token 不读取动作。
5. **训练目标。** 随机选初始化或稳态 rolling 模式，对每个 chunk 分别加噪并回归从数据到噪声的条件速度；视频与动作损失等权。
6. **初始化。** 首次控制需把第一个 chunk 从噪声完整去噪，后面 chunk 按偏移 schedule 形成梯度式噪声窗口。
7. **稳态推理。** 每周期只推进 N/W 个离散去噪步，直到首 chunk 干净；执行其 K 个动作，丢弃首 chunk，保留未来 chunk，再 append 一个纯噪声块。
8. **闭环更新。** 新相机观测和本体状态在下个周期重新条件化全部窗口，但保留的未来 latent 不是重新采样。

### 2.6 关键方法细节

#### 2.6.1 滚动噪声 schedule

【论文事实】Rolling-WAM 使用基础噪声函数 $\sigma(\tau)$，其中 $\tau\in[0,1]$。第 $j$ 个 chunk 在稳态 rolling 模式中的噪声为（Sec. III-B，Eq. 2）：

$$
\sigma_j^{\mathrm{roll}}(\tau)
=
\sigma\left(\frac{j-1+\tau}{W}\right),
\qquad j=1,\ldots,W
$$

相邻 chunk 在窗口滚动时满足边界连续性（Eq. 3）：

$$
\sigma_{j+1}^{\mathrm{roll}}(0)=\sigma_j^{\mathrm{roll}}(1)
$$

初始化阶段使用（Eq. 4）：

$$
\sigma_j^{\mathrm{init}}(\tau)
=
\sigma\left(\min\left\{1,\tau+\frac{j-1}{W}\right\}\right)
$$

【分析】这不是把同一个动作块少采样几步，而是把一个 chunk 的完整 $N$ 步去噪分散到其从窗口尾部移动到首部的多个控制周期。因此单个 chunk 最终仍经历全部去噪预算；低延迟来自流水线并行，而非降低每条动作的总计算质量。

#### 2.6.2 单步更新与复杂度

对 chunk $j$ 的 Euler 更新为（Sec. III-C，Eq. 5）：

$$
\widetilde{\mathbf{X}}_j
\leftarrow
\widetilde{\mathbf{X}}_j
+
\left[\sigma_j(\tau+\Delta\tau)-\sigma_j(\tau)\right]
f_{\theta,j}\left(\widetilde{\mathbf{X}}_{1:W},\boldsymbol{\sigma};c_t\right)
$$

其中 $\widetilde{\mathbf{X}}_j$ 是带噪视频—动作块，$f_{\theta,j}$ 是模型对该块的条件速度预测，$\boldsymbol{\sigma}$ 是全窗口噪声 profile。默认 $N=10$、$W=5$、$K=16$，稳态每周期执行 $N/W=2$ 次网络求值；每个 chunk 从尾部移到首部时累计完成 10 次去噪。

【分析】理论上的周期网络求值从 $N$ 降为 $N/W$，但每次求值处理的 token 窗口变长，速度不会严格按 $W$ 线性增长。论文 Fig. 5 也显示 $W=6$–8 后延迟曲线趋平；因此 $N/W$ 是采样步数缩减，不是等价的 FLOPs 或墙钟时间缩减。

#### 2.6.3 Flow Matching 目标

训练时，数据 chunk 与独立高斯噪声线性插值（Sec. III-D，Eq. 6）：

$$
\widetilde{\mathbf{X}}_j
=
(1-\boldsymbol{\sigma}_j)\mathbf{X}_j
+
\boldsymbol{\sigma}_j\boldsymbol{\epsilon}_j,
\qquad
\boldsymbol{\epsilon}_j\sim\mathcal{N}(\mathbf{0},\mathbf{I})
$$

对模态 $q\in\{v,a\}$，每个 chunk 的速度回归损失为（Eq. 7）：

$$
\ell_j^q
=
\left\|
\left[f_\theta^q\left(\widetilde{\mathbf{X}}_{1:W},\boldsymbol{\sigma};c_t\right)\right]_j
-
\left(\boldsymbol{\epsilon}_j^q-\mathbf{X}_j^q\right)
\right\|_2^2
$$

联合目标可写成（Eq. 8）：

$$
\mathcal{L}
=
\mathbb{E}\left[
\frac{1}{W}\sum_{j=1}^{W}
b_j w(\boldsymbol{\sigma}_j)
\left(\lambda_v\ell_j^v+\lambda_a\ell_j^a\right)
\right]
$$

其中 $b_j$ 屏蔽初始化阶段仍处于纯噪声、没有有效监督进度的 chunk，$w$ 是噪声权重，$\lambda_v$ 与 $\lambda_a$ 分别是视频和动作损失权重，正文设为 1。初始化/rolling 模式采样概率为 0.2/0.8；基础 schedule 使用 $\rho=5$ 的 shifted noise。

#### 2.6.4 注意力信息流为何重要

【论文事实】每个动作 chunk 都能读取整个视觉预测窗口；动作到动作注意力只允许同 chunk 内部；视频 token 不读取动作 token（Sec. III-D，Fig. 2c）。Table IV 中打开跨 chunk bidirectional action-to-action attention 后，选定 RoboTwin 任务从 78.2% 降至 76.3%，LIBERO 从 98.1% 降至 97.9%。

【分析】限制 action-to-action 使远端动作不能仅靠前一动作块自回归延续，而必须经共享视觉未来获取长时上下文。这有助于避免动作 latent 跨窗口形成与新观测不一致的“惯性”。但该消融幅度不大，且没有多 seed 误差条，不能断言这一 mask 普遍更优。

### 2.7 伪代码

```text
initialize window X[1:W] with Gaussian noise
apply initialization schedule until X[1] is clean

while task not terminated:
    condition = encode(current_images, proprioception, language)

    repeat N / W times:
        noise_profile = rolling_schedule(window_position)
        velocity = joint_video_action_denoiser(X, noise_profile, condition)
        X = euler_update(X, velocity, noise_profile)

    execute K actions from X[1].action
    observe new images and proprioception

    discard X[1]
    shift retained partially-denoised chunks toward the present
    append one Gaussian video-action chunk at X[W]
```

【基于论文 Sec. III-B–III-D 重写】伪代码只表达算法边界；具体控制频率、动作插值与硬件执行线程应以公开实现为准，而该实现当前尚未发布。

### 2.8 实验设计

#### 仿真数据与协议

| Benchmark | 任务 / 数据 | 观测 | 训练 | 评测 |
|---|---|---|---|---|
| LIBERO | 4 suites × 10 tasks；每任务 500 demonstrations | 外部 RGB + 腕部 RGB + 本体 | 单一多任务策略；10 epochs；batch 128 | 每任务 50 rollouts |
| RoboTwin 2.0 | 50 双臂任务；2,500 clean + 25,000 randomized demonstrations | 头部 RGB + 双腕 RGB + 本体 | 单一多任务策略；5 epochs；batch 1024 | 每任务每设置 100 rollouts；Clean / Randomized |

【论文事实】Baseline 包括 $\pi_0$、$\pi_{0.5}$、GR00T N1.7、Motus、LingBot-VA、Fast-WAM 与 Joint-WAM。作者在可控 WAM 比较中使用匹配训练与评测设置重新实现 Fast-WAM 和 Joint-WAM（Sec. IV-B）。

#### 真机平台与任务

- 【论文事实】平台为 Unitree G1 humanoid，任务是 Doll Placement、Plate Stacking、Bead Pouring。
- 输入为 320×224 第一视角 RGB 与 43 维状态；78 维动作包含 64 维 SONIC latent 和双手各 7 维动作。
- 每任务 50 条演示、10 Hz 采集；训练 7,500 steps、batch 192；一个策略覆盖全部三项任务。
- 每方法每任务 20 次 rollout；成功要求无人工干预完成规定终态（Sec. IV-E，Table III）。

#### 训练与推理设定

| 项目 | 设置 |
|---|---|
| 视频 expert | Wan2.2-TI2V-5B DiT；复用 text encoder 与 VAE |
| 动作 expert | 30 层，宽度 1024，约 1B 参数；由视频权重插值初始化 |
| 优化器 | AdamW；学习率 1e-4；weight decay 1e-2 |
| 调度 / 精度 | 5% warm-up + cosine decay；BF16 |
| 模态权重 | 视频损失 1；动作损失 1 |
| 默认采样 | N=10，W=5，K=16；稳态每周期 2 次去噪；CFG=1 |

#### 延迟协议

【论文事实】默认延迟在单张 NVIDIA A100、RoboTwin 384×320 输入下测量，每次 policy update 执行 16 个动作；计入视觉编码与去噪，并做 CUDA synchronize；排除 warm-up 和初始化。未使用 torch.compile、TensorRT 或自定义 CUDA kernel（项目页与 Sec. IV-D）。

### 2.9 主要结果

#### LIBERO 与 RoboTwin 2.0（Tables I–II）

| 方法 | LIBERO 平均成功率 | RoboTwin Clean | RoboTwin Randomized | RoboTwin 平均 |
|---|---:|---:|---:|---:|
| pi0.5 | 96.9 | 82.7 | 76.8 | 79.8 |
| Motus | 97.7 | 88.7 | 87.0 | 87.8 |
| LingBot-VA | 98.5 | 92.9 | 91.5 | 92.2 |
| Fast-WAM | 97.6 | 91.9 | 91.8 | 91.8 |
| Joint-WAM | 98.5 | 90.8 | 90.3 | 90.6 |
| Rolling-WAM | 98.1 | 93.5 | 93.0 | 93.3 |

【可信解读】Rolling-WAM 在 LIBERO 比 Joint-WAM 低 0.4 个百分点，不应写成全面提高成功率；在 RoboTwin 平均高 2.7 个百分点。由于各基准接近饱和且未报告训练 seed 方差，最稳健结论是“保持竞争性能并显著降延迟”，而不是“滚动 schedule 普遍提高精度”。

#### 默认稳态延迟（项目页 / Sec. IV-D）

| 方法 | 重规划延迟 | 相对 Rolling-WAM |
|---|---:|---:|
| Joint-WAM | 978 ms | 4.55× 更慢 |
| Fast-WAM | 548 ms | 2.55× 更慢 |
| pi0.5 | 296 ms | 1.38× 更慢 |
| GR00T N1.7 | 285 ms | 1.33× 更慢 |
| Rolling-WAM | 215 ms | 基准 |

【分析】215 ms 对应约 4.65 Hz 的策略重规划，而不是机器人低层控制频率。又因每次执行 16 个动作后才滚动窗口，真实闭环反应上限还取决于动作频率、chunk 执行和是否允许中途打断。论文的优势是让 WAM 进入可用闭环区间，不是达到触觉反射级控制。

#### Unitree G1 真机（Table III，每格 20 次）

| 方法 | Doll Placement | Plate Stacking | Bead Pouring | 平均 |
|---|---:|---:|---:|---:|
| pi0.5 | 55.0 | 70.0 | 60.0 | 61.7 |
| GR00T N1.7 | 75.0 | 65.0 | 60.0 | 66.7 |
| Fast-WAM | 85.0 | 80.0 | 60.0 | 75.0 |
| Joint-WAM | 70.0 | 100.0 | 65.0 | 78.3 |
| Rolling-WAM | 85.0 | 100.0 | 70.0 | 85.0 |

Rolling-WAM 比 Joint-WAM 平均高 6.7 个百分点、比 Fast-WAM 高 10.0 个百分点。单任务分母只有 20，5 个百分点就是 1 次成功，因此各任务的小差异不应过度解释；平均值也混合了不同难度任务。

### 2.10 消融与失败案例

1. **噪声 schedule。** Full Rolling 在选定 RoboTwin / LIBERO 为 78.2/98.1；固定进度 0.2 为 74.7/97.9，固定 0.5 为 73.0/97.1，随机进度 0.5 为 78.5/97.3（Table IV）。滚动 schedule 在两个 benchmark 上取得更均衡结果，但 RoboTwin 并非表内单项最高。
2. **跨 chunk action attention。** 打开 A2A 后为 76.3/97.9，低于默认 78.2/98.1；差距小且没有误差条。
3. **窗口大小。** 选定 RoboTwin 任务在 W=3、5、8 时约为 77.3、78.2、69.5（Fig. 7）。更长视觉未来并非越好，保留 latent 可能在环境快速变化时过时。
4. **作者明确局限。** 保留的预测在快速场景变化下可能滞后，长窗口更明显；自适应窗口与异步执行被列为未来方向（Conclusion / Limitations）。
5. **延迟口径。** 初始化与 warm-up 被排除，首次动作延迟没有进入 215 ms；Fig. 5 的 322/832/1529 ms 使用随窗口变化的另一组总去噪预算，不能与默认表中的 215/548/978 ms 混成一组直接比较。
6. **接触失败。** 论文没有触觉、力或滑移输入，也没有按接触阶段报告失败；Bead Pouring 仍只有 70%，说明视觉未来不能消除细粒度接触误差。

### 2.11 可信度审查

#### 支持可信度的因素

1. 两个规模较大的仿真 benchmark 加一个真实 humanoid，而非只在单一桌面夹爪任务上展示。
2. RoboTwin 每方法包含 50 任务 × 2 设置 × 100 rollout，LIBERO 每任务 50 rollout，执行侧样本量可观。
3. WAM 基线在尽可能匹配的训练与评测协议下复现，降低跨论文表格拼接造成的偏差。
4. 延迟协议写明 GPU、分辨率、同步方式、包含/排除项和未用的工程优化，口径相对清楚。
5. 同时报告成功率、延迟、窗口大小、噪声 schedule 和注意力 mask，而非只给最终平均数。

#### 风险与混杂因素

1. **训练方差未知。** 未见多个训练 seed、checkpoint 方差或置信区间；大量 rollout 只能估计单个策略的执行方差。
2. **真机统计量有限。** 每任务 20 次，三任务总计 60 次；没有环境扰动分层或独立重复训练。
3. **初始化被排除。** 215 ms 是 steady-state，不能代表冷启动或窗口失效后的恢复代价。
4. **算力与显存未完整报告。** 约 5B 视频 expert 加约 1B 动作 expert；论文未报告完整训练 GPU 数、GPU-hours、峰值显存和能耗。
5. **未来生成价值未被独立隔离。** Rolling-WAM 与 Fast-WAM 的对比同时改变部署计算路径；尚不能从结果中分离“视觉未来语义”与“更连续动作更新”的各自贡献。
6. **任务接触强度有限。** G1 包含堆叠和倾倒，但不是高频触觉驱动的插入、旋拧或手内重排。
7. **窗口陈旧性。** 新观测重新条件化保留 latent，但没有显式置信度、突变检测或 reset 机制；视觉未来可能在意外接触后成为错误先验。
8. **动作块开环段。** 默认每 chunk 16 个动作；如果完整执行后才重规划，实际反应时间还受控制频率和 chunk 长度约束。

### 2.12 复现评估

| 项目 | 当前状态 | 影响 |
|---|---|---|
| 论文 / HTML / 项目页 | 已公开 | 方法、表格和延迟口径可核验 |
| GitHub 仓库 | 已建立，Apache-2.0 | 只有 README / assets；不能运行训练或推理 |
| 训练代码 | 明确标注准备中 | 无法复现 schedule、mask 和数据管线 |
| Checkpoints | 明确标注准备中 | 无法复核延迟与成功率 |
| 数据 | 使用 LIBERO、RoboTwin 与团队 G1 数据 | 公共 benchmark 可取得；G1 50 demos/task 未见公开 |
| 基础模型 | Wan2.2-TI2V-5B | 基础权重公开性较好，但联合 WAM 适配未知 |
| 计算 | 单 A100 用于延迟；完整训练算力未知 | 训练预算与峰值显存无法估计 |
| 硬件 | Unitree G1 + 团队控制栈 | 原样真机复现昂贵 |
| 统计 | rollout 数明确；无训练 seed | 可复核执行成功率，难复核训练稳定性 |

【分析】**完整数值复现难度：当前不可行。** 代码、checkpoint 和 G1 数据均未发布。**概念复现难度：中高。** 若已有 Fast-WAM/Joint-WAM 代码，可只实现 chunk-wise noise profile、窗口保留与两类训练 schedule，在 LIBERO 10 任务子集验证 latency–success Pareto。**Jiang 的最小复现难度：中等。** 不必训练 6B 模型；可在现有 diffusion action policy 上实现 action-only rolling buffer，再增加轻量 latent future predictor，测试是否能在触觉 reset 下保留收益。

### 2.13 与相关路线的关系

1. **WAM / 视频生成策略。** Rolling-WAM 保留未来视频并让动作读取视觉未来，区别于 Fast-WAM 的部署时去视频化。它改变的是采样时间结构，不是世界模型监督信号。
2. **VLA / 动作扩散。** 对 pi0.5、GR00T 等 VLA，滚动窗口可被理解为跨控制周期缓存并继续精炼 action latent；但引入视频 expert 后参数量与视觉 token 成本显著增加。
3. **Joint-Embedding Predictive Architecture（JEPA，联合嵌入预测架构）。** JEPA 可用抽象未来 latent 替代像素视频，可能减少 WAM 的 token 与渲染负担。Rolling schedule 与 latent predictive objective 理论上互补，但本文没有 JEPA 对照。
4. **RL 与 Model Predictive Control（MPC，模型预测控制）。** Rolling-WAM 类似 learned receding-horizon planner：保留远期 plan、持续用新观测修正。RL 可负责 value/risk 重排或接触残差，MPC 可在新观测与计划严重不符时触发窗口 reset。
5. **触觉控制。** 论文完全基于视觉与本体。对接触丰富任务，rolling visual plan 应位于 3–10 Hz 高层，高频触觉 actor 处理 30–200 Hz 的滑移、力和接触建立；二者需要显式仲裁，而不是把触觉简单拼进 6B WAM 后期待延迟不变。

### 2.14 Jiang's Perspective（分析）

1. **真正可迁移的是“跨周期保留部分计算”。** Jiang 当前的灵巧手策略若每周期都重新采样完整 action chunk，可以先做 action-only rolling，测量延迟和接触恢复，再决定是否值得引入昂贵视频 expert。
2. **接触事件应成为窗口 reset 信号。** Rolling-WAM 默认假定未来 latent 可继续精炼；但螺丝刀打滑、啮合丢失、物体撞击会使旧未来立刻失效。用触觉变化率、法向力残差或工具轴偏差触发丢弃远端 chunk，是比固定窗口更适合接触任务的设计。
3. **长视野与短反射分层。** 让 WAM 预测“接近—啮合—旋转—退出”的阶段和粗动作，让 RL/tactile residual policy 输出手指/腕部小修正。这样 WAM 不必对高频摩擦建模，低层也不必重新学习完整任务语义。
4. **不要只报平均延迟。** 应同时记录冷启动、稳态、reset 后首动作、P95/P99 和 GPU memory；接触系统最怕偶发长尾延迟，而论文主要给均值。
5. **窗口大小应由物理时标定义。** K=16 在 10 Hz 下对应 1.6 s；对抓放尚可，对滑移或刀头脱离太长。Jiang 的任务应按接触稳定时长选择 K，而不是直接复制论文默认值。

### 2.15 可执行研究建议

#### 实验 A：触觉触发的 rolling-window reset

- **假设：** 固定保留远端 latent 在接触突变后会降低恢复率；用触觉/力事件触发 reset 能降低失败长尾，同时保留大部分稳态加速。
- **最小实现：** 在现有 action diffusion policy 上设置 W=4、K=4；比较每周期重采样、固定 rolling、触觉阈值 reset 三组。reset 条件使用法向力变化率、滑移分类器或工具轴误差任一简单信号。
- **指标：** 稳态与 P95 推理延迟、突变后恢复时间、接触保持率、任务成功率、每 episode reset 次数；至少 3 个 seed。
- **失败判据：** reset 组成功率提升低于跨 seed 标准差，或 reset 频率超过 30% 导致延迟接近每周期重采样；则说明事件检测噪声抵消了 rolling 收益。

#### 实验 B：像素未来是否值得其计算成本

- **假设：** 对螺丝刀/插入任务，低维对象—工具 latent future 能保留大部分 WAM 收益，而无需完整视频生成。
- **最小实现：** 固定 action expert 和数据，比较三组条件：无 future、JEPA-style latent future、VAE video future；三组统一参数预算或至少报告 FLOPs/显存。
- **指标：** 成功率、接触阶段准确率、OOD 几何泛化、稳态/冷启动延迟、峰值显存、future prediction error 与控制成功的相关性。
- **失败判据：** latent future 相对无 future 的增益低于 3 个百分点，或像素 future 的增益不足以抵偿超过 2× 的延迟/显存；则不应继续扩大视频生成模型。

#### 实验 C：滚动高层 + 高频触觉残差

- **假设：** 低频 rolling planner 与高频 tactile residual actor 的分层控制，比单一 WAM 或单一触觉 RL 同时获得更好长视野与接触稳健性。
- **最小实现：** rolling planner 以 5 Hz 输出腕部/手指 reference，触觉 actor 以 50 Hz 输出受限残差；比较 planner-only、residual-only、组合三组。残差限幅并加入安全投影。
- **指标：** 有效转角或插入深度、滑移/脱离率、峰值力、恢复次数、控制延迟、成功率和能耗。
- **失败判据：** 组合组没有同时降低滑移并保持进度，或提升主要来自更高峰值力；则分层接口或残差约束需要重设计。

### 2.16 局限与开放问题

1. 代码与 checkpoint 尚未发布，外部复现无法开始。
2. 稳态加速不含初始化和 warm-up；真实冷启动延迟未知。
3. 没有训练 seed、置信区间或显著性检验。
4. 视频 expert 与动作 expert 总规模很大，完整训练算力、峰值显存和吞吐未披露。
5. 保留未来 latent 会在突发视觉/接触变化后变陈旧，缺少不确定性与自动 reset。
6. 默认 16-action chunk 可能形成较长开环段，论文未系统扫描 K 与控制频率。
7. 无触觉、力、扭矩或滑移输入，不能验证精密接触反馈。
8. 真机只有 3 类任务、单一 G1 embodiment、每任务 20 次。
9. LIBERO 已接近饱和，0.4–0.9 个百分点差异未必稳定。
10. WAM 的未来视频是否提供因果控制价值，仍与连续动作生成和更大计算预算混杂。
11. 没有报告错误未来的校准、预测置信度与动作安全之间的关系。
12. 更长窗口在选定任务上明显下降，说明长期想象并非单调有益。

### 2.17 参考来源

1. [Rolling-WAM arXiv 摘要与 submission history](https://arxiv.org/abs/2609.30247)：标题、作者、首次公开时间与正文入口。
2. [Rolling-WAM HTML 正文](https://arxiv.org/html/2609.30247v1)：Sec. III 的问题定义、滚动 schedule、推理与训练；Sec. IV 的 benchmark、延迟、G1 和消融；Tables I–IV、Figs. 2、5、7。
3. [Rolling-WAM 项目页](https://rolling-wam.github.io/)：方法动画、真机任务、主要结果与延迟测量口径。
4. [Rolling-WAM 官方仓库](https://github.com/zyinghua/Rolling-WAM)：Apache-2.0 许可证，以及代码/checkpoint 尚在准备中的状态。
5. [Riemannian MeanFlow Policy arXiv](https://arxiv.org/abs/2609.30127) / [HTML 正文](https://arxiv.org/html/2609.30127v1)：首次公开时间、流形方法、Tables I–V 与 60-demo 真机展示。
6. [RAPID arXiv](https://arxiv.org/abs/2609.30249) / [HTML 正文](https://arxiv.org/html/2609.30249v1) / [项目页](https://yuyaoliu.me/projects/rapid)：首次公开时间、单演示 agentic program、8 项接触任务、LIBERO-Pro 与 Franka 评测。
7. [arXiv cs.RO recent](https://arxiv.org/list/cs.RO/recent)、[cs.LG recent](https://arxiv.org/list/cs.LG/recent)、[cs.CV recent](https://arxiv.org/list/cs.CV/recent)：候选发现、批次与首次公开时间交叉检查。

## 3. 今日结论

1. **先读 Rolling-WAM Sec. III-B–III-D 与 Fig. 2。** 核心不是换 backbone，而是把完整去噪变成跨控制周期的流水线，并用训练 schedule 覆盖部署时的部分去噪状态。
2. **再看 Tables I–IV 和 Fig. 5。** 最可信结论是 215 ms 稳态延迟下保持接近或优于 Joint-WAM 的成功率；不要把排除初始化的 4.5× 加速写成端到端全程加速。
3. **值得做小规模概念复现，不值得现在追完整数值。** 官方实现和 checkpoint 尚未发布；先在现有 action diffusion 上实现滚动 buffer 与触觉 reset，信息增益更高。
4. **Riemannian MeanFlow 值得作为低 NFE 几何动作头对照。** 先看 Sec. III 与 Tables II–V，重点验证腕部姿态/乘积流形是否真比投影式 Euclidean diffusion 稳定。
5. **RAPID 适合借高层表示，不适合直接替代低层策略。** 先看 OReP primitive、Table II–III 与 real-robot 部分；把对象关系程序用于接触 phase 规划，再由 RL/触觉 controller 执行。

---

**公式兼容性说明：** 本文仅使用单美元行内公式与独占行的双美元公式块，未使用被禁用的反斜杠圆括号或方括号定界符。已执行 UTF-8、必需标题、链接、单/双美元定界符配对、公式块独占行、表格中无 LaTeX 公式、代码围栏位置和原始反斜杠语法校验；未在目标 Markdown 查看器中进行视觉渲染验证。
