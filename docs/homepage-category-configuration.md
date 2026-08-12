# 首页分类卡片配置说明

首页的分类卡片从 Shopify 中类型为 `homepage_category` 的 Metaobject
读取。代码中不提供商品图片或其他默认图片作为兜底；配置不完整的条目不会显示。

## 创建 Metaobject 定义

进入 Shopify 后台的 **设置 → 自定义数据 → Metaobject**，创建一个名为
**首页分类** 的定义，并将类型设置为 `homepage_category`。

按照下表添加字段。字段 key 必须与表格完全一致：

| 字段名称 | Key | 字段类型 | 是否必填 |
| --- | --- | --- | --- |
| 标题 | `label` | 单行文本 | 是 |
| 图片 | `image` | 文件（仅允许图片） | 是 |
| 跳转链接 | `link` | 单行文本 | 是 |
| 排序 | `sort_order` | 整数 | 是 |

需要为该定义开启 Storefront API 读取权限，并将 `label` 设置为条目的显示名称字段。

## 创建首页分类条目

创建并发布下面两条数据，将用户提供的两张图片分别上传到对应条目的
`image` 字段：

| 标题 | 跳转链接 | 排序 | 图片 |
| --- | --- | --- | --- |
| Shop Man | `/collections/man-all` | `1` | 用户提供的男士图片 |
| Shop Woman | `/collections/woman` | `2` | 用户提供的女士图片 |

以后在 Shopify 后台修改这些条目的图片、标题、链接或排序，Hydrogen 首页会直接
读取最新配置，不需要修改代码或重新部署。
