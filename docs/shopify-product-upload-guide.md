# Shopify 后台商品上传操作手册

本文按当前 Hydrogen 店面前台实际读取的字段编写。缺必填项时详情页会直接报错，不会用占位内容凑合展示。

后台界面语言可能是中文或英文。下文同时给出常见中英文名称。截图请按文中 `【截图】` 标记补到对应位置。

---

## 1. 上传前必读

1. 商品状态必须是 **已上架 / Active**，并发布到 Hydrogen 销售渠道。
2. `产品类型 / Product type` 目前只能是下面两个值之一，必须完全一致：
   - `T-Shirt`
   - `Tanks`
3. 必须有名为 `Color` 的选项。每个颜色值都要对应一套正好 6 张图的颜色图库。
4. 商品 **Media 至少 6 张**，顺序固定，见第 4 节。
5. 男装 / 女装靠商品标签区分：只打 `man` 或只打 `woman`，不要两个都打。

建议先复制一套已能正常打开的商品（例如现有 PDP 测试款），再改标题、图片、颜色图库和规格，避免漏字段。

---

## 2. 一次性准备：自定义数据定义

首次建店或定义丢失时做一次。之后上传商品只填值，不用反复建定义。

路径：**设置 / Settings → 自定义数据 / Custom data**

> **【截图 1】** 设置 → 自定义数据 总览页，能看到「商品」元字段和 Metaobject 两个入口。

所有定义都要打开 **Storefronts / 店面** 读取权限，Hydrogen 才能读到。

### 2.1 Metaobject：颜色图库

名称建议：`PDP Color Gallery`  
类型（Type）必须是：`pdp_color_gallery`

| 后台字段名建议 | Key | 类型 | 必填 |
| --- | --- | --- | --- |
| Name | `name` | 单行文本 | 否，仅方便后台识别 |
| Color Name | `color_name` | 单行文本 | 是 |
| Images | `images` | 文件列表（仅图片） | 是，正好 6 张 |

> **【截图 2】** Metaobject 定义编辑页，类型填 `pdp_color_gallery`，三个字段的 Key 清晰可见。

### 2.2 Metaobject：详情页图文

名称建议：`PDP Editorial Block`  
类型（Type）必须是：`pdp_editorial_block`

| 后台字段名建议 | Key | 类型 | 必填 |
| --- | --- | --- | --- |
| Name | `name` | 单行文本 | 否 |
| Heading | `heading` | 单行文本 | 是 |
| Body | `body` | 多行文本 | 是 |
| Image | `image` | 文件（仅图片） | 是，1 张 |

> **【截图 3】** `pdp_editorial_block` 定义页，四个字段 Key 清晰可见。

### 2.3 商品元字段

路径：**设置 → 自定义数据 → 商品 / Products**  
命名空间一律 `custom`，Key 必须与下表完全一致。

| 后台名称建议 | Key | 类型 | 必填 | 前台用途 |
| --- | --- | --- | --- | --- |
| PDP Summary | `pdp_summary` | 单行文本列表 | 是，1～4 条 | 购买面板标题下的摘要 |
| Main Color | `main_color` | 颜色 | 否 | 详情页控件 / 页脚主色，6 位 HEX |
| Lifestyle Image | `img` | 文件（图片） | 否 | 首屏 Gallery 下方的 lifestyle 大图 |
| Color Galleries | `color_galleries` | Metaobject 列表，引用 `pdp_color_gallery` | 是 | 校验每个颜色都有 6 图图库 |
| Editorial Blocks | `editorial_blocks` | Metaobject 列表，引用 `pdp_editorial_block` | 是，正好 2 条 | 详情页两组图文 |
| Product Weight | `spec_product_weight` | 多行文本 | 是 | Technical Specifications |
| Product Weight Logo | `spec_product_weight_logo` | 文件（图片 / SVG） | 否 | 规格行图标 |
| Main Fabric Content | `spec_main_fabric_content` | 多行文本 | 是 | Technical Specifications |
| Main Fabric Content Logo | `spec_main_fabric_content_logo` | 文件（图片 / SVG） | 否 | 规格行图标 |
| Fabric | `spec_fabric` | 多行文本 | 是 | Technical Specifications |
| Fabric Logo | `spec_fabric_logo` | 文件（图片 / SVG） | 否 | 规格行图标 |
| Fit | `spec_fit` | 多行文本 | 是 | Technical Specifications |
| Fit Logo | `spec_fit_logo` | 文件（图片 / SVG） | 否 | 规格行图标 |
| Temperature Range | `spec_temperature_range` | 多行文本 | 是 | Technical Specifications |
| Temperature Range Logo | `spec_temperature_range_logo` | 文件（图片 / SVG） | 否 | 规格行图标 |
| Riding Conditions | `spec_riding_conditions` | 多行文本 | 是 | Technical Specifications |
| Riding Conditions Logo | `spec_riding_conditions_logo` | 文件（图片 / SVG） | 否 | 规格行图标 |
| Construction | `spec_construction` | 多行文本 | 是 | Technical Specifications |
| Construction Logo | `spec_construction_logo` | 文件（图片 / SVG） | 否 | 规格行图标 |
| Care Instructions | `care_instructions` | 文件（图片 / SVG / 普通文件） | 是 | 规格表底部洗涤图 |

> **【截图 4】** 商品元字段定义列表，能看到 namespace `custom` 和上表中的 key。

Logo 类字段可以不填。一旦填了，必须是图片或 SVG，不能是 PDF。

---

## 3. 创建商品：基本信息

路径：**商品 / Products → 添加商品 / Add product**

> **【截图 5】** 商品列表页，标出右上角「添加商品」。

### 3.1 标题

推荐格式：`产品名 — 颜色`，例如 `AuraLite Performance T-Shirt — Black`。

列表页会尝试把末尾颜色拆出来单独显示。能识别的颜色词包括：black、white、grey、gray、navy、blue、green、red、brown、cream、beige、sand、stone、olive、khaki、charcoal。

> **【截图 6】** 商品编辑页顶部「标题」输入框，填好带颜色的完整标题。

### 3.2 描述

详情页 **不再读取** 商品 Description 富文本，图文来自 `editorial_blocks`。  
Description 可以留空，或只当后台备注 / SEO 补充。

### 3.3 状态、类型、供应商、系列、标签

在右侧「商品组织 / Product organization」中填写：

| 字段 | 怎么填 |
| --- | --- |
| 状态 | 已上架 / Active，并勾选 Hydrogen 渠道 |
| 产品类型 / Type | `T-Shirt` 或 `Tanks` |
| 供应商 / Vendor | `Tenth Athletic` |
| 产品系列 / Collections | 按性别和品类加入，例如 `Woman`、`Woman - Tech Tees`、`New Arrivals`；男装对应 `Man`、`Man - Tanks` 等 |
| 标签 / Tags | 男装 `man`，女装 `woman`，只打一个 |

> **【截图 7】** 右侧「状态」和「商品组织」卡片，标出产品类型、供应商、产品系列、标签。

当前店内常用系列 handle：

- 汇总：`man-all`、`woman`、`new-arrivals`、`accessories`
- 男装品类：`man-tech-tees`、`man-tanks`、`man-shells`、`man-midlayers`、`man-split-shorts`、`man-distance-shorts`、`man-tights`、`man-pants`、`man-caps`、`man-socks`、`man-arm-sleeves`、`man-soft-flasks`、`man-bags`
- 女装品类：`woman-tech-tees`、`woman-tanks`、`woman-shells` 等

---

## 4. 媒体：至少 6 张，顺序固定

商品 Media 的前 6 张就是详情页首屏 Gallery。少于 6 张会报错，不会自动补图。

建议顺序：

| 顺序 | 内容 | 同时用于 |
| --- | --- | --- |
| 1 | 产品细节 / 平铺特写 | 列表页主图 |
| 2 | 产品背面平铺 | 列表页悬停图 |
| 3 | 产品正面平铺 | 首屏第 3 格 |
| 4 | 模特背面 | 首屏第 4 格 |
| 5 | 模特正面 | 首屏第 5 格 |
| 6 | 模特细节 | 首屏第 6 格 |

建议透明底 PNG / WebP，服装主体完整，不要裁掉领口或下摆。

> **【截图 8】** 商品编辑页「媒体 / Media」区域，6 张图按 1～6 排好。  
> **【截图 9】** 前台详情页首屏 Gallery，方便对照后台顺序。本地预览地址：`http://localhost:3080/products/<handle>`

第 7 张及之后的商品 Media 不会出现在首屏 Gallery。模特多面合成图如果要单独展示，请放到元字段 `custom.img`，不要指望靠第 7 张 Media。

---

## 5. 选项、变体、价格、库存

### 5.1 选项

选项 **名称** 必须是英文，取值必须和筛选器 / 颜色图库一致。

| 选项名 | 是否必填 | 允许的值 |
| --- | --- | --- |
| `Color` | 详情页必填 | 任意颜色名，但必须和对应 `pdp_color_gallery` 的 `color_name` 完全一致 |
| `Size` | 列表页尺码条和筛选必填 | `XXS` `XS` `S` `M` `L` `XL` `XXL` |
| `Fit` | 列表页 Fit 筛选需要 | 只能是 `ContourRace (Race)` 或 `Field Fit (Relax)` |

不要把选项名写成「颜色」「尺码」。Fit 的两个值必须带括号和空格，多一个空格都会筛不出来。

> **【截图 10】** 商品编辑页「变体 / Variants」里的选项设置，能看到 Color、Size，以及可选的 Fit。

### 5.2 变体

每个 Color × Size（× Fit）组合都会生成一个变体。每个变体需要：

- **价格**：必填，前台购买面板读取当前变体价格
- **SKU**：建议填写，会显示在 Technical Specifications
- **库存**：开启跟踪数量。库存为 0 时，列表页对应尺码显示为不可用

> **【截图 11】** 变体表格，至少能看到价格、SKU、库存三列。

---

## 6. 创建并挂上 Metaobject 条目

### 6.1 每个颜色一条图库

路径：**内容 / Content → Metaobjects → PDP Color Gallery → 添加条目**

每条填写：

1. `name`：例如 `AuraLite Performance T-Shirt · Black`
2. `color_name`：必须等于商品 Color 选项值，例如 `Black`，不要写成 `Jet Black`
3. `images`：正好 6 张，顺序与第 4 节相同
4. 状态设为 **Active**

> **【截图 12】** 一条 `pdp_color_gallery` 条目，`color_name` 和 6 张图都填好。

有几个 Color 值，就建几条。回到商品编辑页，把这些条目全部加入 `custom.color_galleries`。颜色名重复或漏一个颜色，详情页都会报错。

### 6.2 每个商品正好两条图文

路径：**内容 → Metaobjects → PDP Editorial Block → 添加条目**

每个商品创建 **正好 2 条**：

| 顺序 | 前台布局 | 填写 |
| --- | --- | --- |
| 第 1 条 | 图左文右 | `heading` + `body` + 1 张图 |
| 第 2 条 | 图右文左 | `heading` + `body` + 1 张图 |

`body` 中的空行会在前台拆成多段。不要把物流、尺码表写在这里，那些已经写在前台折叠区。

> **【截图 13】** 一条 `pdp_editorial_block` 条目，heading / body / image 都填好。  
> **【截图 14】** 商品元字段 `editorial_blocks` 已选中正好 2 条。  
> **【截图 15】** 前台详情页两组图文，确认左右布局和文案。

---

## 7. 填写商品元字段

在商品编辑页底部 **元字段 / Metafields** 卡片填写。

> **【截图 16】** 商品编辑页底部元字段区域全貌。

最少必填：

1. `pdp_summary`：1～4 条短句，例如  
   `Lightweight performance tee engineered for unrestricted movement.`
2. `color_galleries`：挂上第 6.1 节建好的条目
3. `editorial_blocks`：挂上第 6.2 节的 2 条
4. 7 个规格文本：
   - `spec_product_weight` 例如 `100 G - 3.53 OZ.`
   - `spec_main_fabric_content` 例如 `MAIN: 68% POLYESTER, 32% ELASTANE`
   - `spec_fabric`
   - `spec_fit` 例如 `RACE`
   - `spec_temperature_range` 例如 `18 - 35 DEGREES C`
   - `spec_riding_conditions` 例如 `HOT`
   - `spec_construction`
5. `care_instructions`：洗涤说明图

推荐再填：

- `main_color`：`#554d48` 这种 6 位 HEX。不填则使用默认棕灰
- `img`：lifestyle 大图
- 各规格对应的 `*_logo`

> **【截图 17】** `pdp_summary`、`color_galleries`、`editorial_blocks` 已填。  
> **【截图 18】** 7 个 `spec_*` 文本和 `care_instructions` 已填。  
> **【截图 19】** 前台购买面板，对照标题、摘要、颜色、尺码、价格。  
> **【截图 20】** 前台 Technical Specifications，对照规格文本、SKU、洗涤图。

规格在前台的显示顺序：

1. Product Weight
2. Main Fabric Content
3. Fabric
4. Fit
5. Temperature Range
6. Riding Conditions
7. SKU（来自当前变体，不是元字段）
8. Construction
9. Care Instructions

Fit / Condition Index 以及 Ultralight Construction 等卖点，目前按 `产品类型` 写在代码里，不从 Shopify 读取。换新品类前需要先改代码，不能只靠后台新增类型。

---

## 8. 发布和验收

1. 保存商品，状态为已上架，Hydrogen 渠道已勾选。
2. 打开 `http://localhost:3080/products/<handle>`。
3. 确认：
   - 首屏正好 6 张图，顺序正确
   - 购买面板有标题、摘要、颜色、尺码、价格
   - 切换颜色不报错
   - 两组 editorial 图文都在
   - Technical Specifications 无缺失
   - 列表页主图 / 悬停图 / 尺码条正常
   - 能出现在对应系列和 `man` / `woman` 导航下

> **【截图 21】** 商品保存成功后的状态和销售渠道。  
> **【截图 22】** 前台详情页完整长图，或分屏：首屏、图文、规格。

---

## 9. 上传检查清单

复制到表格或打印：

- [ ] 标题含产品名和颜色
- [ ] 产品类型是 `T-Shirt` 或 `Tanks`
- [ ] 标签只有 `man` 或只有 `woman`
- [ ] 已加入正确产品系列
- [ ] Media 至少 6 张，顺序正确
- [ ] 选项 `Color`、`Size` 已建；需要筛选时再加 `Fit`
- [ ] Size 取值属于 XXS～XXL
- [ ] Fit 取值只能是 `ContourRace (Race)` / `Field Fit (Relax)`
- [ ] 每个变体有价格；建议有 SKU 和库存跟踪
- [ ] 每个颜色有一条 Active 的 `pdp_color_gallery`，正好 6 张图
- [ ] `color_name` 与 Color 选项值完全一致
- [ ] 正好 2 条 Active 的 `pdp_editorial_block`
- [ ] `pdp_summary` 有 1～4 条
- [ ] 7 个 `spec_*` 文本已填
- [ ] `care_instructions` 已上传
- [ ] 已上架并发布到 Hydrogen
- [ ] 前台详情页打开无报错

---

## 10. 常见报错对照

前台报错信息可直接用来查漏：

| 报错大意 | 原因 |
| --- | --- |
| No PDP feature-label preset... product type | 产品类型不是 `T-Shirt` / `Tanks` |
| Missing required PDP field ... pdp_summary | 摘要没填，或不是 1～4 条非空文本 |
| requires custom.color_galleries | 没挂颜色图库 |
| requires exactly six images | 某条图库不是正好 6 张 |
| missing a six-image gallery for Color "..." | 这个颜色没有对应图库，或 `color_name` 不一致 |
| requires a Color option | 没有名为 Color 的选项 |
| requires exactly two custom.editorial_blocks | 图文不是正好 2 条 |
| Editorial block ... requires one image | 某条图文缺图 |
| Missing required PDP field ... spec_* | 对应规格文本为空 |
| Missing required PDP file ... care_instructions | 没上传洗涤图 |
| requires at least six product media images | 商品 Media 不足 6 张 |
| *_logo must reference an image or SVG | logo 字段挂了非图片文件 |

改完后台后刷新前台即可，不需要重新部署代码。
