# TENTH Athletic SEO 优化方案

审计日期：2026-09-18。范围：当前工作区代码和 Google / Shopify 官方文档。本文是实施方案，尚未修改网站功能、发布部署或操作 Search Console。

## 1. 已确认的问题与优先级

| 优先级 | 当前代码证据 | 影响与处理 |
| --- | --- | --- |
| P0 | `app/routes.ts` 白名单未启用 robots、sitemap 索引、sitemap 子路由、产品页和集合页 | 文件存在不代表 URL 可访问。先启用抓取基础路由；只开放已准备上线的商品和集合。 |
| P0 | `app/routes/$.tsx` 将未开放的 products / collections 等路径重定向到 `/coming-soon`，后者含 `noindex, nofollow` | 当前产品无法通过商品详情页参与索引；不要通过删除 Coming Soon 的 noindex 解决。 |
| P0 | `app/routes/race.tsx` 全量复用首页组件、loader 和 meta | 首页和赛事页内容及元数据重复，需要确定各自用途。 |
| P0 | sitemap 子路由配置 EN-US、EN-CA、FR-CA，但当前路由和语言解析不提供对应路径，语言固定为 EN | 移除没有真实对应页面的语言 URL，不生成虚假的 hreflang。 |
| P1 | 产品 meta 只有产品标题，未输出 description；查询已包含 Shopify SEO 字段 | 将后台已填写的 SEO title / description 接入渲染，缺失内容列为发布前待补充项。 |
| P1 | 产品 canonical 描述缺少 React Router 的 link 描述标记，且使用相对路径 | 统一通过 Hydrogen getSeoMeta 输出正式域名的绝对 canonical，并检查实际 HTML。 |
| P1 | `app` 中未发现 Product / Organization / Event JSON-LD 输出 | 根据页面类型添加与可见内容一致的结构化数据。 |
| P1 | 首屏 `field-circuit-hero.jpg` 约 4.4 MB，没有响应式图片源 | 制作移动端与桌面端尺寸、WebP / AVIF，优化 LCP。 |
| P2 | 首页赛事查询与全站导航查询使用 CacheNone，商品推荐查询位于关键加载链 | 实测 TTFB 后调整缓存；非关键推荐延后加载，价格与库存保留适当更新策略。 |

抓取规则源码没有对普通 Googlebot 禁止整个站点；`Disallow: /` 位于 Nutch 专属分组，不能误判为全站屏蔽 Google。当前更直接的问题是 robots 路由未启用。

## 2. 页面定位与标题描述

长期结构建议：`/` 负责品牌与产品入口，`/race` 负责 FIELD CIRCUIT 单场赛事，`/products/:handle` 负责具体商品。保持现有 `/race` 地址，避免无必要的迁移。

若当前仍是仅赛事开放的预发布阶段，先为重复赛事内容确定唯一规范 URL，并统一 canonical、站内链接与 sitemap；不为制作两个独立标题而保留两份相同内容。正式恢复品牌首页之后，再让首页与赛事页分别自引用 canonical。

以下为英文站的文案草案，产品描述须在核对实际规格后定稿：

| 页面 | Title 草案 | Description 草案 |
| --- | --- | --- |
| 品牌首页 | TENTH Athletic — Running Apparel & Field Circuit | Explore TENTH Athletic running apparel and discover FIELD CIRCUIT, our road and trail running event at Lee Valley VeloPark, London. |
| AuraLite 产品示例 | AuraLite Performance T-Shirt \| TENTH Athletic | Explore the TENTH Athletic AuraLite Performance T-Shirt. View product details, available colours, sizing and delivery information. |
| FIELD CIRCUIT | FIELD CIRCUIT London — Road & Trail Race \| TENTH Athletic | Discover TENTH FIELD CIRCUIT at Lee Valley VeloPark, London. Explore the road and trail format, event programme, entry fees and registration details. |

实施要求：每个可索引页面一个独立 title、description 和绝对 canonical；标题、H1 与正文表达同一主题。不要仅替换标题而保持页面内容重复。Meta description 用于清晰说明内容，Google 可能使用正文生成不同摘要。

赛事页保留现有口号，同时增加可见的赛事全名、完整日期、地点与简明介绍。FAQ 文档写有 2026-10-24，上线前需与动态 startsAt 核对，并使用同一来源生成正文与 Event 数据。

## 3. 抓取与 sitemap

1. 在路由白名单启用 `/robots.txt`、`/sitemap.xml` 和 sitemap 子路由。
2. sitemap 只列正式 HTTPS 主域名下返回 200、允许索引、且为规范地址的页面。排除 Coming Soon、登录、购物车、搜索、愿望清单、API、筛选组合与重定向 URL。
3. 补充首页、赛事等自定义页面；不要假定 Shopify 自动生成的资源 sitemap 包含自定义 React 页面。
4. 清除不受支持的 EN-US / EN-CA / FR-CA 路径。当前按单一英文站实施；如以后需要地区 SEO，再设计有独立地址的地区页面。
5. sitemap 使用真实更新时间，不在每次请求时把所有 lastmod 改成当前时间。
6. 核对 HTML robots、HTTP X-Robots-Tag、robots.txt、登录/密码保护和 CDN 防护。关键页面及其渲染资源必须可抓取。
7. 对需要从索引移除的工具页面使用适当 noindex；不要同时通过 robots 阻止抓取却期待 Google 读取该 noindex。隐私页面依靠身份验证保护。

## 4. 结构化数据

全部在服务端 HTML 中输出 JSON-LD，按页面输出一次，内容与页面实际展示一致，并正确转义动态字符串。

| 类型 | 位置 | 数据要求 |
| --- | --- | --- |
| Organization | 首页；其他页面通过稳定 @id 引用 | 品牌名、正式 URL、可抓取 logo、经确认的官方社媒。Schema 类型拼写为 Organization。不要把 YouTube / Spotify 平台首页当作品牌 sameAs。 |
| Product + Offer | 已上线的真实产品页 | name、image、description、品牌、真实 SKU（若有）、价格、币种、库存与商品 URL；根据实际变体 URL 策略决定 ProductGroup。不得虚构评分、评价或 GTIN。 |
| Event | FIELD CIRCUIT 规范赛事页 | name、startDate、已确认的 endDate、当地时区偏移、Place 与完整地址、image、description、organizer、eventStatus，以及真实报名 Offer。 |

赛事页面目前展示个人 £25、团队 £120、观众免费。标记应区分真实参赛票种；不能用观众免费代表参赛价格为 0。确认报名是否开放、报名 URL、团队单位、开始/结束时间和时区之后再发布 Offer。London 的 UTC 偏移按实际日期确定，不能固定全年偏移。

验收：Rich Results Test 无关键错误；非关键警告逐项判断适用性。结构化数据正确仅提供展示资格，不保证出现富媒体结果。

## 5. 移动端速度、正文与链接

- 首屏赛事图优先处理：移动端图片初始预算约 150–300 KB，最终以画质与实测为准；使用 srcset / sizes 或 picture，保留尺寸，首屏图不 lazy-load，并设置合理加载优先级。
- 保留地图已有的接近视口才加载机制；页面 HTML 同时提供场馆名称、完整地址与路线链接，不能让地图成为唯一信息来源。
- 保留服务端渲染。当前入口已有 SSR 与机器人等待逻辑；后续验证原始 HTML 确实含标题、正文、商品信息、FAQ、链接与 JSON-LD。
- 商品详情视频在进入附近视口后加载/播放，提供 poster；关注移动端下载量与交互阻塞。
- 菜单和推荐使用真实 `<a href>` 链接；首页、赛事、集合、产品形成可达路径，不把未发布地址放进关键导航。
- 完整正文不依赖点击、滑动或同意 Cookie 后才获取；折叠 FAQ 可以保留，但文字应已存在于 HTML。
- 稳定图片、地图、倒计时和横幅占位，减少布局偏移。审查字体加载和非关键脚本。
- 实验室阶段用 PageSpeed Insights / Lighthouse 排查；正式验收关注移动端第 75 百分位 LCP ≤ 2.5 秒、INP ≤ 200 毫秒、CLS ≤ 0.1。新站可能没有足够真实用户数据，不能把一次 Lighthouse 分数当成现场数据。

## 6. Search Console 操作顺序

1. 确认正式主域名和 HTTPS / www 归一策略。
2. 使用品牌持有的 Google 账号添加 Domain 属性；在实际 DNS 服务商添加 Google 提供的 TXT 记录并验证，保留记录。若无法配置 DNS，可采用 URL-prefix 属性及适用验证方式，但覆盖范围不同。
3. 先部署上述 P0 修复，再访问正式域名的 robots 和 sitemap，核对状态码、内容及 sitemap 子文件。
4. 在 Sitemaps 报告提交正式域名的 `/sitemap.xml`，确认处理状态并检查发现的 URL。
5. 用 URL Inspection 对首页、FIELD CIRCUIT 规范页、已上线主推产品和重要集合页进行实时测试；检查抓取许可、渲染 HTML 和规范地址。
6. 对通过测试的重要页面逐个申请索引；其他页面依靠 sitemap 与内链发现。不要为重复页、Coming Soon 或重定向地址申请索引。
7. 发布后第 7、14、28 天复查索引原因、Google 选择的 canonical、结构化数据报告、品牌词与非品牌词曝光/点击。请求索引不保证收录时间或排名；不反复提交同一 URL。

## 7. 实施批次与验收

| 批次 | 工作 | 验收结果 |
| --- | --- | --- |
| A：抓取基础 | 路由、发布范围、重复页、规范域名、robots、sitemap | 重要 URL 返回正确状态；规范地址唯一；sitemap 无未开放或错误语言路径。 |
| B：页面语义 | 独立元数据、正文、Organization / Event / Product | HTML 含独立元数据和可见文本；结构化数据与实际商品/赛事一致。 |
| C：性能与发现 | 首屏图、视频、加载链、内部链接 | 完成代表页面移动端性能基线与针对性修复；关键页面不依赖交互才能发现。 |
| D：提交与观察 | Search Console 验证、sitemap、请求索引、阶段复查 | 保存验证与提交记录；持续跟踪已索引规范 URL、曝光、点击和实际性能。 |

源文件主要涉及：`app/routes.ts`、`app/routes/_index.tsx`、`app/routes/race.tsx`、`app/routes/products.$handle.tsx`、三个 robots/sitemap 路由、`app/root.tsx` 和对应媒体组件；可新增统一 SEO 配置模块。

执行前需要补齐：正式网站域名、Google / DNS 可操作权限、产品实际开放时间与主推商品清单、确认后的赛事日期/地址/票种/报名状态、品牌官方资料。

## 8. 本次检查边界

本机 `http://localhost:3080` 的只读请求均被拒绝连接；按照项目约定没有启动新服务。因此当前结论来自源码，未验证运行时 HTTP 响应、线上部署、Google 已收录状态或移动端性能，也没有进行浏览器复测。

Hydrogen 官方文档检索已完成。技能自带验证器因其运行环境无法解析 TypeScript 包而未启动；本次不交付实现代码，不将其记作验证通过。

## 官方依据

- [Shopify Hydrogen SEO](https://shopify.dev/docs/storefronts/headless/hydrogen/seo)
- [Google 站点所有权验证](https://support.google.com/webmasters/answer/9008080)
- [Sitemaps 报告](https://support.google.com/webmasters/answer/7451001)
- [URL Inspection](https://support.google.com/webmasters/answer/9012289)
- [Robots meta 与 X-Robots-Tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [移动优先索引](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)
- [Product](https://developers.google.com/search/docs/appearance/structured-data/product)
- [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Event](https://developers.google.com/search/docs/appearance/structured-data/event)
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
