# AuraLite 商品详情页改版实施方案

## 文档状态

- 状态：已实施并完成本地验证
- 本轮范围：已完成商品详情页代码改造；未操作 Shopify 后台
- 目标页面：`/products/auralite-performance-t-shirt`
- 视觉依据：用户提供的商品详情页长图、区域标注图和 Shopify 后台截图

## 1. 已确认的现状

### 1.1 Shopify 产品 Media

当前产品只有两张 Media，顺序和用途已经确定：

| Media 顺序 | 用途 | 前端数据 |
| --- | --- | --- |
| 第 1 张 | 商品列表展示图、商品详情页首图 | `product.images.nodes[0]` / `featuredImage` |
| 第 2 张 | 商品详情页模特多面图 | `product.images.nodes[1]` |

实施时不增加产品 Media，也不再假定存在第 3～5 张产品图。

集合列表当前已经读取 `product.featuredImage`，因此只要 Shopify 后台继续把第 1 张图片保持为产品主图，列表页无需改变图片选择逻辑。

### 1.2 Shopify 商品 Description

当前 Description 富文本包含：

- 一张产品标签图片；
- 一段商品介绍；
- 五条商品特点列表。

商品详情页只负责获取并展示 Shopify 返回的完整 `descriptionHtml`。富文本内部包含什么图片、标题、段落或列表，全部以 Shopify 后台当前内容为准，不在前端解析或重组。

Description 中的图片不占用产品 Media。

### 1.3 当前前端问题

当前商品详情页：

- 将前三张图片渲染成三列 Gallery，但后台实际只有两张 Media；
- Media 不足时会重复使用 variant 图片作为兜底；
- 存在较复杂的滚动监听、自动折叠和多个购买面板切换；
- Description 当前展示位置和容器样式不符合新页面顺序；
- Technical Specifications 只有 SKU 和 Variant；
- 目标稿所需的产品信息图标尚未纳入项目资产。

项目约定不允许为了维持页面运行而添加静默兜底，因此改版后将两张 Media 视为商品页面的必需配置。Media 缺失或顺序错误时应直接暴露配置问题。

## 2. 实施边界

### 2.1 代码实现区域

以下内容由 React、Hydrogen 数据和 CSS 实现：

- 商品详情页 Header；
- 首屏商品主图；
- 商品标题和摘要；
- 单一响应式购买面板；
- 模特多面图；
- Fit / Condition Index；
- Ultralight Construction；
- Targeted Airflow；
- Precision Cut；
- Size & Fit；
- Shipping & Returns 折叠区；
- Materials 折叠区；
- Technical Specifications；
- Footer。

“代码实现”表示布局与交互由代码负责，不表示商品标题、价格、选项、库存和 SKU 写死在代码中。

### 2.2 Shopify 后台维护区域

商品 Description 的全部 HTML 内容从 `product.descriptionHtml` 读取并原样展示。

前端不约定富文本内部排版，不识别特定图片、标题或段落，也不要求后台使用指定 class 或 HTML wrapper。

### 2.3 不实施的视觉元素

以下元素属于设计标注或参考框，不进入页面实现：

- 用户标注图中的红色边框和红色文字；
- 图片外围的参考边框；
- 设计稿中的画板辅助线、中心线和网格框线。

页面背景点阵、折叠区分割线和技术参数行分割线需要保留。

## 3. 页面组件结构

建议将商品详情页整理为以下结构：

```text
ProductPage
├── ProductHero
│   ├── HeroProductImage              ← Media 第 1 张
│   ├── ProductSummary
│   └── ProductPurchasePanel
├── ProductLifestyleShowcase
│   ├── LifestyleImage                ← Media 第 2 张
│   └── ProductPurchasePanel
├── ProductFeatureIndex
│   ├── FitSummary
│   ├── ConditionSummary
│   └── FeatureRows
├── ProductEditorialContent           ← descriptionHtml
├── ProductInformation
│   ├── SizeAndFit
│   ├── ShippingAndReturns
│   └── Materials
├── ProductTechnicalSpecs
└── Footer
```

建议新增以下组件：

| 组件 | 职责 |
| --- | --- |
| `ProductHero` | 首图和单一响应式购买面板 |
| `ProductLifestyleShowcase` | 多面图 |
| `ProductFeatureIndex` | Fit、Condition 和三条技术特点 |
| `ProductEditorialContent` | 获取并展示 Shopify Description HTML |
| `ProductTechnicalSpecs` | 渲染技术参数行 |

`ProductForm` 继续负责 variant 选择、价格和加购，不在新组件中重复交易逻辑。

## 4. 两张商品 Media 的数据契约

### 4.1 Storefront 查询

商品查询从：

```graphql
images(first: 3)
```

调整为：

```graphql
images(first: 2)
```

页面内明确拆分：

```ts
const [heroImage, lifestyleImage] = product.images.nodes;
```

不再使用：

- `slice(0, 3)`；
- 复制 `selectedVariant.image` 填满 Gallery；
- 使用同一张图片代替缺失的多面图；
- 根据数组长度静默切换另一套布局。

### 4.2 第 1 张 Media

用途：

- 商品列表卡片的 `featuredImage`；
- 商品详情页首屏大图；
- 必要时作为社交分享或 SEO 主图。

详情页表现：

- 居中展示；
- 使用 `object-fit: contain`；
- 不裁切服装主体；
- 不绘制参考稿图片边框。

### 4.3 第 2 张 Media

用途：

- 商品详情页模特左侧、正面、背面多面图。

详情页表现：

- 作为一张完整合成图展示，不拆成三张图片；
- 使用 `object-fit: contain`；
- 保持透明背景；
- 桌面端尽量占满页面内容宽度；
- 移动端按原始比例缩放，不裁掉人物脚部或头部。

## 5. 顶部代码区域

### 5.1 首屏

首屏由以下内容组成：

1. Shopify Media 第 1 张；
2. 商品标题；
3. 商品摘要；
4. `11.svg` 产品轮廓图标；
5. 颜色和尺码选择；
6. 当前 variant 价格；
7. Add to Cart。

商品标题、颜色、尺码、价格、可售状态来自 Shopify。

商品摘要属于页面展示配置，建议放到 `app/data/productDetails.ts`，不要继续直接写在 `ProductForm.tsx` 中。

### 5.2 单一购买面板

页面只渲染一个 `ProductForm`，避免桌面和移动端出现重复购买框。

实施方式：

- 首屏以完整展开状态显示商品标题、摘要、轮廓图、选项和加购按钮；
- 桌面端离开首屏后固定在视口底部；
- 向下滚动时收起标题、摘要和轮廓图，只保留选项与加购；
- 向上滚动时恢复完整展开状态；
- 到达商品信息区时停止固定定位，避免覆盖下方内容；
- 移动端同一个组件固定在底部，并隐藏摘要区域；
- variant、价格、库存状态和 URL 参数仍由同一份 `selectedVariant` 与 `productOptions` 驱动。

### 5.3 产品信息区

多面图下方实现以下内容：

| 区域 | 文案 | 图标 |
| --- | --- | --- |
| Fit | `Race. Contour` | `33.svg` |
| Condition Index | `Heat / High Output` | `22.svg` |
| Ultralight Construction | Low Weight / Unrestricted Movement | `44.svg` |
| Targeted Airflow | Ventilation / Heat Release | `55.svg` |
| Precision Cut | Laser / Clean Construction | `66.svg` |

技术特点的完整说明文字放入 `app/data/productDetails.ts`，组件只负责循环渲染。

## 6. Shopify Description HTML 获取与展示

页面保留 `descriptionHtml` 查询，在目标位置渲染：

```tsx
<ProductEditorialContent html={product.descriptionHtml} />
```

组件内部仅渲染 Shopify 返回的 HTML：

```tsx
<div
  className="product-editorial-content"
  dangerouslySetInnerHTML={{__html: html}}
/>
```

实现要求：

- 不解析 `descriptionHtml`；
- 不拆分或重组富文本节点；
- 不识别特定图片、标题、段落或列表；
- 不要求后台添加 class、`data-*` 属性或固定 wrapper；
- 不给富文本内容注入默认图片或默认文案；
- 只对外层容器提供基础宽度和上下间距；
- 对容器内的 `img`、`video`、`iframe` 和 `table` 提供基础最大宽度和防横向溢出规则；
- 富文本具体排版完全由 Shopify 后台保存的 HTML 决定。

当 `descriptionHtml` 为空时，不渲染富文本区域。

## 7. SVG 图标资产方案

### 7.1 现有源文件

| 原文件 | 识别内容 | 页面用途 |
| --- | --- | --- |
| `/Users/poi/Desktop/tenth/1/11.svg` | 网点 T-Shirt | 购买面板产品轮廓 |
| `/Users/poi/Desktop/tenth/1/22.svg` | 网点手部/热感图形 | Condition Index |
| `/Users/poi/Desktop/tenth/1/33.svg` | 双侧弧线 | Fit / Race Contour |
| `/Users/poi/Desktop/tenth/1/44.svg` | `1g` 重复纹理 | Ultralight Construction |
| `/Users/poi/Desktop/tenth/1/55.svg` | 渐变网点 | Targeted Airflow |
| `/Users/poi/Desktop/tenth/1/66.svg` | 放射切割线 | Precision Cut |

### 7.2 下个任务的目标路径

实施时复制到：

```text
app/assets/product/auralite/
├── product-silhouette.svg
├── condition-heat.svg
├── fit-contour.svg
├── ultralight-construction.svg
├── targeted-airflow.svg
└── precision-cut.svg
```

对应关系：

| 目标文件 | 来源 |
| --- | --- |
| `product-silhouette.svg` | `11.svg` |
| `condition-heat.svg` | `22.svg` |
| `fit-contour.svg` | `33.svg` |
| `ultralight-construction.svg` | `44.svg` |
| `targeted-airflow.svg` | `55.svg` |
| `precision-cut.svg` | `66.svg` |

实现要求：

- 保留 SVG 原始 path、fill 和 viewBox；
- 不将 SVG 手工重绘为 CSS 图形；
- 通过 Vite 静态资源 import 使用；
- 与相邻文字重复表达含义的图标使用空 alt 并标记为装饰；
- 不上传到 Shopify Media；
- 不直接依赖用户 Desktop 路径运行页面。

## 8. Size & Fit、折叠栏和技术参数

### 8.1 Size & Fit

基于现有 `SizeGuideTable` 调整：

- Size & Fit 默认展开；
- 默认单位与参考稿一致，设为 Inches；
- 保留 Centimeters / Inches 切换；
- 桌面端完整显示六个尺码列；
- 小屏允许表格横向滚动；
- 表格继续使用正确的 `table`、`th` 和 `scope` 语义。

### 8.2 Shipping & Returns

- 默认展开；
- 保留配送费用和时效；
- 增加 `More Shipping & Delivery info` 链接；
- 链接目标使用现有 `/pages/shipping-returns`；
- 不从 Description HTML 中解析或复制这段折叠内容。

富文本区域与折叠区是两个独立模块。折叠区继续使用自身的代码配置。

### 8.3 Materials

- 默认收起；
- 保留现有加号/关闭状态；
- 内容先由代码配置；
- 本轮不新增 Shopify metafield。

### 8.4 Technical Specifications

技术参数组件扩展为：

| 字段 | 数据来源 |
| --- | --- |
| Product Weight | `app/data/productDetails.ts` |
| Main Fabric Content | `app/data/productDetails.ts` |
| Fit | `app/data/productDetails.ts` |
| Temperature Range | `app/data/productDetails.ts` |
| Riding Conditions | `app/data/productDetails.ts` |
| SKU | 当前 Shopify variant |

参考稿中的非 SKU 参数可作为初始页面配置；SKU 必须继续读取 `selectedVariant.sku`，不能写死参考稿 SKU。

如果实际商品参数与参考稿文案不一致，应先修正 `productDetails.ts`，不应从设计图猜测或静默使用占位值。

## 9. Header 和 Footer

### Header

- Logo 使用现有品牌资源；
- 桌面导航改为 `UK / GBP £`、`Man`、`Woman`、`Account`、`Field Index`、`Bag(n)`；
- Bag 有商品时显示绿色状态点；
- 移动端继续使用菜单入口；
- Header 是共享组件，修改时需要回归首页、列表页和信息页。

### Footer

- 保留三列链接；
- 移除目标稿中不存在的仙人掌插图；
- 版权栏调整为目标稿深灰棕色；
- 版权栏进入正常页面流，不固定遮挡内容；
- Footer 是共享组件，修改时需要回归所有主要页面。

## 10. 预计修改文件

### 现有文件

| 文件 | 修改内容 |
| --- | --- |
| `app/routes/products.$handle.tsx` | 重组 PDP、读取两张 Media、移除桌面 sticky 计算、插入富文本区 |
| `app/components/ProductForm.tsx` | 购买面板视觉、支持传入轮廓 SVG、移除硬编码摘要 |
| `app/components/ProductImage.tsx` | 支持 Hero 和 Lifestyle 两种图片表现 |
| `app/lib/productInformation.tsx` | 默认单位、折叠状态、配送链接 |
| `app/components/Header.tsx` | Man / Woman 导航和视觉调整 |
| `app/components/Footer.tsx` | 移除插图、调整版权栏 |
| `app/styles/app.css` | 重写 PDP 布局和响应式样式 |

### 建议新增文件

```text
app/components/product/
├── ProductHero.tsx
├── ProductLifestyleShowcase.tsx
├── ProductFeatureIndex.tsx
├── ProductEditorialContent.tsx
└── ProductTechnicalSpecs.tsx

app/data/productDetails.ts

app/assets/product/auralite/
├── product-silhouette.svg
├── condition-heat.svg
├── fit-contour.svg
├── ultralight-construction.svg
├── targeted-airflow.svg
└── precision-cut.svg
```

如果实施时发现组件只使用一次且结构很短，可以保留在 route 内，但数据配置和 SVG 资产仍应独立。

## 11. 实施顺序

1. 将 6 个 SVG 复制到项目并按语义重命名。
2. 将商品查询改为明确读取两张 Media。
3. 删除旧三列 Gallery 和重复购买面板。
4. 实现 Hero、多面图和单一响应式购买面板。
5. 恢复桌面端滚动固定、展开、收起与停止边界逻辑。
6. 实现 Fit / Condition / 三条产品技术特点。
7. 新增 `ProductEditorialContent` 并接入 `descriptionHtml`。
8. 调整 Size & Fit、Shipping & Returns、Materials。
9. 扩展 Technical Specifications。
10. 调整 Header 和 Footer。
11. 进行桌面、平板和移动端视觉验收。
12. 验证 variant、价格、URL 和 Add to Cart。

## 12. 验收标准

### 数据

- 商品列表始终使用第 1 张 Media；
- PDP Hero 始终使用第 1 张 Media；
- PDP 多面图始终使用第 2 张 Media；
- Description 图片不会出现在产品 Gallery；
- variant 切换后价格、选项、SKU 和 URL 同步；
- 页面只存在一个购买面板和一个 `ProductForm`；
- 桌面端滚动向下收起、向上展开，并在商品信息区停止；
- 移动端只显示一个底部固定购买栏；
- Add to Cart 加入当前选择的 variant。

### 视觉

- 页面区块顺序与参考稿一致；
- Hero 商品图不裁切；
- 多面图不裁切人物；
- 不显示设计稿图片框、红色标注框和辅助线；
- 6 个 SVG 使用用户提供的原始资产；
- Shopify Description HTML 在目标位置完整显示；
- 技术参数行和折叠区分割线清晰；
- Header 和 Footer 与参考稿一致。

### 响应式

至少验证：

- 1440px 桌面；
- 1280px 桌面；
- 768px 平板；
- 390px 手机。

移动端重点检查：

- 固定购买栏不遮挡 Footer；
- 选项菜单可操作；
- 富文本媒体不突破页面容器；
- Size Guide 可以横向滚动；
- 所有按钮触控区域足够；
- 页面不存在重复的固定购买面板。

### 可访问性

- 页面只有一个主 `h1`；
- 所有商品图片具有有效 alt；
- 装饰性 SVG 使用空 alt；
- 折叠按钮正确维护 `aria-expanded` 和 `aria-controls`；
- variant 选项可使用键盘操作；
- 文字和灰棕色背景满足对比度要求；
- 固定移动购买栏不会阻断键盘焦点或页面内容。

### 工程验证

- 不启动新的本地开发服务；
- 使用现有 `http://localhost:3080` 验证；
- 运行项目现有 type-check、lint 和 validate；
- 检查控制台无 React、图片加载和可访问性错误；
- 对照参考长图进行完整页面截图验收。

## 13. 非本次改版范围

- 不新增 Shopify metafield 或 metaobject；
- 不把 6 个 SVG 上传到 Shopify；
- 不把 Description 图片加入产品 Media；
- 不新增第 3 张产品 Media；
- 不修改产品标题、价格、库存或 variant 业务数据；
- 不将参考稿的 `£220`、`Black`、`Large` 或示例 SKU 写入当前商品；
- 不为缺失 Media、富文本或技术参数添加静默默认值；
- 不操作 Shopify 后台商品数据。

## 14. 实施注意事项

- 当前工作区已有其他未提交修改，执行时必须保留并避开无关变更；
- Shopify 后台 Media 顺序是页面数据契约的一部分，不应随意交换；
- Shopify Description HTML 由后台自由维护，前端不得依赖特定 wrapper 或节点顺序；
- 所有视觉判断以用户提供的 UI 长图为准，但商品业务数据以 Shopify 当前数据为准。
