# Coming Soon 分支开放 Race — 2026-09-09

## 范围与来源

用户确认只将 Race 接入当前 main 闭站分支，其他商城页面继续关闭。工作目录为 tenth_athletic，原 HEAD 为 72f25f7；原有 ComingSoon.tsx 和 coming-soon.css 的未提交链接修改保留。未改 NorthStar 项目，未提交、推送或部署，未重启3080服务。

复用 full-storefront 提交7100344e3b56209f51c94312ea1621258e86eac5中的 Race 页面、数据、地图、字体和图片。只注册首页、race、404通配路由；不引入商城布局、导航、账户、购物车或分析脚本。

- 移除Race页面对共享商城header的观察器与负margin，补入独立FAQ样式并限定作用域。
- 页面自己的ErrorBoundary显示明确失败状态；数据读取错误不再被Coming Soon画面遮蔽。
- 增加原分支相同版本的mapbox-gl3.30.0及锁文件条目，地图保持仅客户端加载。
- 更新TypeScript/ESLint白名单，将Race依赖纳入构建和检查。原ESLint目录忽略模式会跳过文件例外，已修正为允许指定文件被检查的模式。
- Storefront查询沿用race_event/field-circuit的倒计时与报名配置，不修改店铺数据或.env。PUBLIC_STORE_DOMAIN核对为本项目5yvudf-m6.myshopify.com。

## 验证

| 项目 | 结果 | 证据范围 |
|---|---|---|
| frozen-lockfile安装 | pass | 复用锁定依赖，只增加mapbox-gl |
| Hydrogen build --codegen | pass | 修正tsconfig白名单后client/SSR构建成功；保留标准商城路由缺失提示，这是闭站范围所致 |
| pnpm run typecheck | pass | 路由类型生成与tsc完成 |
| scoped ESLint | pass | race路由、RaceMap、地图客户端、数据、env和路由配置均被实际检查，无输出；未用忽略文件的旧结果作为pass |
| HTTP路由 | pass | /和/race返回200；/collections/all、/products/test、/cart、/account、/unknown-route返回404 |
| 首页点击London2026 | pass | Codex内置浏览器实际点击链接后显示Race标题与内容，URL为/race |
| 刷新/race | pass | 独立路由仍正常显示 |
| 桌面/移动布局 | pass（局部） | 1440×1000及390×844下无页面横向溢出，桌面素材均加载；首屏截图目视检查通过，不等于全页设计验收 |
| FAQ | pass | 实际点击展开，答案可见；移动端aria-expanded=true，答案高度163px；倒计时可观察到秒数变化 |
| Mapbox完整交互 | not_run | 已迁移原实现和配置，未单独验收瓦片/缩放/标记 |
| 独立技能validator | blocked | 工具所在目录缺typescript，ERR_MODULE_NOT_FOUND；项目build/typecheck/ESLint通过不等于该工具通过 |
| git diff --check | pass | 无空白错误 |

浏览器临时viewport已恢复。现有活动报名和摄影链接为空，按钮保持明确的未开放状态；FAQ原文仍含TBC等待确认项，本次未改活动内容。
