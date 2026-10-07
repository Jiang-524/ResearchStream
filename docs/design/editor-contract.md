# 写作接口预留（尚未实现）

当前写作入口 `/write/` 仅说明状态并下载模板。四项主导航不增加第五个编辑按钮。

后续编辑数据结构使用现有 frontmatter，加 `body: string` 和文章目录内图片列表；标题、abstract 与正文分别编辑。客户端预览须复用当前 Markdown 渲染规则。普通 Markdown 是可导出的源格式。

拟定操作：

| 操作 | 输入 | 输出/语义 |
| --- | --- | --- |
| loadDraft | 稳定 ID | 元数据 + Markdown 正文 + 图片资源 |
| saveDraft | 内容 + 上次版本号 | 草稿 ID + 新版本号；冲突时明确返回冲突，不覆盖 |
| preview | Markdown 正文 | 与阅读页一致的安全 HTML，仅预览不发布 |
| publish | 草稿 ID + 版本号 | 发布状态；经过真实持久化和构建后才能显示成功 |
| export | 草稿 ID | Markdown 文件；有本地图片时连同资源打包 |

存储决策留到在线编辑阶段：仅此设备草稿可以用 IndexedDB；跨设备保存需要认证的 Git 提交服务或持久化后端。域名不提供存储能力。不会将 GitHub token 放进浏览器。
