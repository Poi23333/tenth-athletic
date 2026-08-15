# 首页 Banner 配置说明

首页 Banner 从 Shopify 中类型为 `homepage_banner` 的 Metaobject 读取。每个
Metaobject 条目对应一张轮播图；条目按 `sort_order` 从小到大展示，并每 6 秒
自动切换一次。

Banner 图片按原始宽高比全屏等宽展示，不会被强制裁剪或拉伸。可以单独配置移动端
图片；没有移动端图片时，会在移动端继续使用桌面图片并保持它的原始比例。

## 创建 Metaobject 定义

进入 Shopify 后台的 **设置 → 自定义数据 → Metaobject**，创建一个名为
**首页 Banner** 的定义，并将类型设置为 `homepage_banner`。

按照下表添加字段。字段 key 必须与表格完全一致：

| 字段名称    | Key            | 字段类型           | 是否必填 |
| ----------- | -------------- | ------------------ | -------- |
| Banner 图片 | `image`        | 文件（仅允许图片） | 是       |
| 移动端图片  | `mobile_image` | 文件（仅允许图片） | 否       |
| Logo 文件   | `logo_file`    | 文件               | 否       |
| Logo 文字   | `logo_text`    | 单行文本           | 否       |
| 第二行文字  | `slogan`       | 单行文本           | 否       |
| 按钮文字    | `button_text`  | 单行文本           | 否       |
| 按钮链接    | `button_link`  | URL                | 否       |
| 排序        | `sort_order`   | 整数               | 是       |

需要为该定义开启 **Storefronts access**，并建议开启 **Active-draft status**，
这样草稿条目不会出现在首页。可将 `logo_text` 设置为条目的显示名称字段，便于在
后台识别每组 Banner。

## 创建 Banner 条目

进入 Shopify 后台的 **内容 → Metaobject → 首页 Banner**，为每组轮播内容创建
一个条目并设为 Active：

- `image` 上传桌面 Banner；本次测试图为 1920 × 1200。
- `mobile_image` 可选。需要独立移动端构图时上传；不填则使用 `image`。
- 第一行可以使用 `logo_file` 或 `logo_text`。两者同时填写时优先显示
  `logo_file`；`logo_file` 支持 SVG 和常规图片。
- `slogan` 是第二行文字。
- 配置 `button_link` 后会显示第三行按钮，并且必须同时填写 `button_text`；不配置
  链接时不显示按钮。
- Shopify 后台 URL 字段生成的同店 `.myshopify.com` 链接会在前台自动转换为相对路径，
  由 Hydrogen 路由处理，不会跳转到 Online Store 页面；真正的外部网址仍按外链打开。
- `sort_order` 使用 `1`、`2`、`3` 等整数控制轮播顺序。

以后在 Shopify 后台修改条目的图片、Logo、文字、链接、状态或排序，Hydrogen
首页会直接读取最新配置，不需要修改代码或重新部署。
