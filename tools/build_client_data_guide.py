from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "outputs" / "shopify-client-data-pack"
OUTPUT_PATH = OUTPUT_DIR / "Tenth_Athletic_Shopify资料准备与上传手册.docx"

FONT = "Arial Unicode MS"
INK = "242424"
MUTED = "666666"
ACCENT = "BE8EC2"
ACCENT_DARK = "333333"
LIGHT_ACCENT = "F5EDF6"
LIGHT_GRAY = "F3F4F6"
MID_GRAY = "D9DCE1"
WHITE = "FFFFFF"
GREEN = "E8F5EC"
AMBER = "FFF4D6"
RED = "FDEBEC"


def set_run_font(run, *, size=None, bold=None, color=INK, italic=None):
    run.font.name = FONT
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), FONT)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), FONT)
    run._element.get_or_add_rPr().rFonts.set(qn("w:eastAsia"), FONT)
    if size is not None:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if italic is not None:
        run.italic = italic
    run.font.color.rgb = RGBColor.from_string(color)


def set_cell_fill(cell, color):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), color)


def set_cell_margins(cell, top=80, start=120, bottom=80, end=120):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.find(qn("w:tcMar"))
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for side, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        tag = tc_mar.find(qn(f"w:{side}"))
        if tag is None:
            tag = OxmlElement(f"w:{side}")
            tc_mar.append(tag)
        tag.set(qn("w:w"), str(value))
        tag.set(qn("w:type"), "dxa")


def set_table_geometry(table, widths_dxa):
    total = sum(widths_dxa)
    table.autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl_pr = table._tbl.tblPr
    layout = tbl_pr.find(qn("w:tblLayout"))
    if layout is None:
        layout = OxmlElement("w:tblLayout")
        tbl_pr.append(layout)
    layout.set(qn("w:type"), "fixed")

    tbl_w = tbl_pr.find(qn("w:tblW"))
    if tbl_w is None:
        tbl_w = OxmlElement("w:tblW")
        tbl_pr.append(tbl_w)
    tbl_w.set(qn("w:w"), str(total))
    tbl_w.set(qn("w:type"), "dxa")

    tbl_ind = tbl_pr.find(qn("w:tblInd"))
    if tbl_ind is None:
        tbl_ind = OxmlElement("w:tblInd")
        tbl_pr.append(tbl_ind)
    tbl_ind.set(qn("w:w"), "120")
    tbl_ind.set(qn("w:type"), "dxa")

    grid = table._tbl.tblGrid
    for child in list(grid):
        grid.remove(child)
    for width in widths_dxa:
        col = OxmlElement("w:gridCol")
        col.set(qn("w:w"), str(width))
        grid.append(col)

    for row in table.rows:
        row._tr.get_or_add_trPr().append(OxmlElement("w:cantSplit"))
        for index, cell in enumerate(row.cells):
            width = widths_dxa[index]
            tc_pr = cell._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:w"), str(width))
            tc_w.set(qn("w:type"), "dxa")
            cell.width = Inches(width / 1440)
            set_cell_margins(cell)


def repeat_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    header = OxmlElement("w:tblHeader")
    header.set(qn("w:val"), "true")
    tr_pr.append(header)


def keep_with_next(paragraph):
    paragraph.paragraph_format.keep_with_next = True


def add_heading(doc, text, level=1):
    p = doc.add_paragraph(style=f"Heading {level}")
    p.add_run(re.sub(r"[^\w\s]", " ", text).replace("_", " "))
    keep_with_next(p)
    return p


def add_body(doc, text, *, bold_prefix=None, color=INK):
    p = doc.add_paragraph()
    if bold_prefix and text.startswith(bold_prefix):
        first = p.add_run(bold_prefix)
        set_run_font(first, bold=True, color=color)
        rest = p.add_run(text[len(bold_prefix):])
        set_run_font(rest, color=color)
    else:
        run = p.add_run(text)
        set_run_font(run, color=color)
    return p


def add_bullets(doc, items, level=0):
    for item in items:
        p = doc.add_paragraph(style="List Bullet" if level == 0 else "List Bullet 2")
        p.paragraph_format.left_indent = Inches(0.375 if level == 0 else 0.65)
        p.paragraph_format.first_line_indent = Inches(-0.188)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.25
        run = p.add_run(item)
        set_run_font(run)


def add_numbered(doc, items):
    for item in items:
        p = doc.add_paragraph(style="List Number")
        p.paragraph_format.left_indent = Inches(0.375)
        p.paragraph_format.first_line_indent = Inches(-0.188)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.25
        run = p.add_run(item)
        set_run_font(run)


def add_callout(doc, label, text, fill=LIGHT_ACCENT):
    p = doc.add_paragraph()
    label_run = p.add_run(f"{label}  ")
    set_run_font(label_run, bold=True, color="000000")
    text_run = p.add_run(text)
    set_run_font(text_run)


def add_table(doc, headers, rows, widths, *, font_size=8.6, header_fill=ACCENT_DARK):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        border = OxmlElement(f"w:{edge}")
        border.set(qn("w:val"), "single")
        border.set(qn("w:sz"), "4")
        border.set(qn("w:color"), "D9D9D9")
        borders.append(border)
    table._tbl.tblPr.append(borders)
    header = table.rows[0]
    repeat_header(header)
    for index, value in enumerate(headers):
        cell = header.cells[index]
        set_cell_fill(cell, header_fill)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(str(value))
        set_run_font(run, size=font_size, bold=True, color=WHITE)
    for row_index, values in enumerate(rows):
        row = table.add_row()
        if row_index % 2 == 1:
            for cell in row.cells:
                set_cell_fill(cell, LIGHT_GRAY)
        for index, value in enumerate(values):
            cell = row.cells[index]
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.08
            run = p.add_run(str(value))
            set_run_font(run, size=font_size)
    set_table_geometry(table, widths)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return table


def add_checkbox_list(doc, items):
    for item in items:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Inches(0.12)
        p.paragraph_format.space_after = Pt(3)
        run = p.add_run(f"☐  {item}")
        set_run_font(run, size=10.5)


def configure_document(doc):
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)
    section.header_distance = Inches(0.492)
    section.footer_distance = Inches(0.492)

    normal = doc.styles["Normal"]
    # Clear inherited title rules and theme fonts for predictable Office rendering.
    for style in doc.styles:
        for border in list(style.element.iter(qn("w:pBdr"))):
            border.getparent().remove(border)
        for fonts in style.element.iter(qn("w:rFonts")):
            for key in list(fonts.attrib):
                if "Theme" in key:
                    del fonts.attrib[key]
    normal.font.name = FONT
    normal._element.rPr.rFonts.set(qn("w:ascii"), FONT)
    normal._element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
    normal._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor.from_string(INK)
    normal.paragraph_format.space_before = Pt(0)
    normal.paragraph_format.space_after = Pt(6)
    normal.paragraph_format.line_spacing = 1.25

    heading_specs = {
        "Heading 1": (16, "000000", 18, 10),
        "Heading 2": (13, "000000", 14, 7),
        "Heading 3": (12, "000000", 10, 5),
    }
    for name, (size, color, before, after) in heading_specs.items():
        style = doc.styles[name]
        style.font.name = FONT
        style._element.rPr.rFonts.set(qn("w:ascii"), FONT)
        style._element.rPr.rFonts.set(qn("w:hAnsi"), FONT)
        style._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor.from_string(color)
        style.paragraph_format.space_before = Pt(before)
        style.paragraph_format.space_after = Pt(after)
        style.paragraph_format.keep_with_next = True

    for name in ("List Bullet", "List Bullet 2", "List Number"):
        style = doc.styles[name]
        style.font.name = FONT
        style._element.rPr.rFonts.set(qn("w:eastAsia"), FONT)
        style.font.size = Pt(11)

    header = section.header
    p = header.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run("TENTH ATHLETIC  |  SHOPIFY CONTENT PACK")
    set_run_font(run, size=8.5, bold=True, color="000000")

    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run("Client data preparation guide  •  ")
    set_run_font(run, size=8, color=MUTED)
    field = OxmlElement("w:fldSimple")
    field.set(qn("w:instr"), "PAGE")
    p._p.append(field)


def add_cover(doc):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run("TENTH ATHLETIC")
    set_run_font(run, size=10, bold=True, color="000000")

    p = doc.add_paragraph(style="Title")
    p.paragraph_format.space_after = Pt(8)
    run = p.add_run("Tenth Athletic\nShopify 资料准备与上传手册")
    set_run_font(run, size=28, bold=True, color="000000")

    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(18)
    run = p.add_run("适用于甲方内容、商品、运营与电商团队")
    set_run_font(run, size=13, color="000000")

    add_table(
        doc,
        ["文件用途", "核对范围", "版本"],
        [["资料采集 + Shopify 后台录入 + 上线验收", "Shopify 店面可见内容与本地 Hydrogen 项目", "2026-09-04"]],
        [2600, 4200, 2560],
        font_size=9.2,
    )
    add_callout(
        doc,
        "交付方式",
        "请先填写配套 Excel 模板，再按“每个商品一个文件夹”的命名规则打包图片和文案。正式商品不要直接覆盖当前测试商品。",
    )
    add_body(
        doc,
        "当前正式前台仍处于 Coming Soon 状态；下述商品、首页、导航和账户功能是本地项目中已完成或预留的正式站点结构。资料准备可以立即开始，正式发布需由开发团队切回完整店面并完成验收。",
    )


def build_document():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    doc = Document()
    configure_document(doc)
    add_cover(doc)

    add_heading(doc, "1. 甲方需要准备什么", 1)
    add_body(doc, "建议按优先级分三批交付。第一批决定商品能否上线；第二批决定首页与导航是否完整；第三批用于法律、支付、物流与市场上线。")
    add_table(
        doc,
        ["优先级", "资料包", "负责人建议", "完成标准"],
        [
            ["P0", "商品主数据、变体、库存、每色图片、PDP 文案与规格", "商品 / 品牌 / 运营", "每个商品可独立通过 PDP 验收"],
            ["P1", "首页 Banner、男女分类图、品牌色、集合归类、导航", "品牌 / 设计 / 电商", "首页与分类导航无测试内容"],
            ["P1", "品牌资料、社媒链接、客服与订阅方案", "品牌 / 市场 / 客服", "页眉页脚及联络入口可用"],
            ["P0", "配送、退货、隐私、条款、税务、市场与币种", "运营 / 财务 / 法务", "政策互相一致并通过确认"],
            ["开发方", "域名、API 凭证、Customer Account、会话密钥", "甲方管理员 + 开发", "安全写入部署平台，不通过表格或聊天传值"],
        ],
        [900, 3000, 1800, 3660],
    )

    add_heading(doc, "2. 当前后台与项目实况", 1)
    add_body(doc, "核对基于 2026-09-03 Storefront 可见内容和本地代码。草稿、未发布商品及完整支付、物流、税务设置未纳入本次后台核验，需由管理员另行确认。")
    add_table(
        doc,
        ["模块", "当前状态", "结论 / 需处理"],
        [
            ["店铺", "Tenth Athletic；默认 GBP / 英国", "店铺域名与结算域名已接入；正式主域名待甲方确认"],
            ["商品", "Storefront 可见 6 个 PDP 测试商品；均为 Tanks；每个 4 个变体", "与甲方确认后处理测试商品；草稿及未发布商品未纳入本次数量"],
            ["商品数据质量", "6 图齐；全部主图缺 Alt；每个商品仅 1/4 变体有 SKU；无 man/woman 标签", "正式数据必须补齐 Alt、SKU、性别标签和集合归类"],
            ["PDP 自定义数据", "测试商品已填大部分必填字段；缺 main_color 与 lifestyle 图", "这两项可选；其余必填结构按本手册准备"],
            ["首页 Banner", "2 条测试 Banner，复用同一张 1920×1200 图；无移动端图", "替换测试图、Lab/Lab2 与测试口号；建议同时交付移动端构图"],
            ["首页分类", "Shop Man / Shop Woman 两条测试内容", "图片无 Alt；需确认最终图片与文案"],
            ["全局主色", "#BE8EC2", "需品牌方书面确认；产品可单独指定颜色"],
            ["集合", "30 个集合已建；仅 Man - Tech Tees 有测试商品", "正式商品逐个归类；需要确认 New Arrivals 逻辑"],
            ["导航", "man-menu、woman-menu 已建；shop-menu 缺失", "确认是否需要 Shop 总菜单；若需要则补建"],
            ["品牌设置", "店铺描述、Slogan、品牌 Logo 未在 Shopify Brand 中配置", "本地有 Logo 文件，但后台品牌资料仍需补齐"],
            ["政策", "仅 Privacy Policy 已配置；Refund / Shipping / Terms 缺失", "必须由甲方法务和运营确认后补齐"],
            ["页面 / 博客", "Contact、Your Privacy Choices；News 博客无文章", "本地另有 10 个硬编码内容页，见第 7 节"],
            ["市场", "店面接口可见 26 个国家 / 地区", "代码以 NZ 代表 ROW，但当前可用国家列表不含 NZ，需上线前修正市场或代码"],
            ["前台", "Coming Soon", "完整店面组件仍在项目中，但当前根路由未启用"],
        ],
        [1300, 3200, 4860],
    )

    add_heading(doc, "3. 商品资料标准", 1)
    add_heading(doc, "3.1 商品基础信息", 2)
    add_body(doc, "本节必填项指本项目交付要求，不等同于 Shopify 平台强制字段。中性款或新增品类请先确认导航和详情页适配。")
    add_table(
        doc,
        ["字段", "必填", "填写规则 / 示例"],
        [
            ["商品标题", "是", "建议“产品名 — 颜色”，如 AuraLite Performance T-Shirt — Black"],
            ["Handle", "是", "英文小写短横线；一经上线不随意修改"],
            ["状态", "是", "录入期 Draft；验收后 Active，并发布到 Hydrogen 销售渠道"],
            ["Vendor", "是", "统一 Tenth Athletic"],
            ["Product type", "是", "当前仅支持 T-Shirt 或 Tanks；其他类型需开发先增加前台预设"],
            ["Tags", "是", "男装仅 man；女装仅 woman；不可同时填写"],
            ["Collections", "是", "至少性别总集合 + 对应品类集合；新品可再加入 New Arrivals"],
            ["SEO 标题 / 描述", "建议", "英文；避免堆砌关键词；描述建议 140–160 字符"],
        ],
        [1900, 900, 6560],
    )

    add_heading(doc, "3.2 选项、变体、价格与库存", 2)
    add_table(
        doc,
        ["项目", "规则"],
        [
            ["Color", "详情页强制需要；颜色值必须与 PDP Color Gallery 的 color_name 完全一致（不区分大小写，但建议统一 Title Case）"],
            ["Size", "列表筛选固定支持 XXS、XS、S、M、L、XL、XXL"],
            ["Fit", "如需参与筛选，只能填 ContourRace (Race) 或 Field Fit (Relax)"],
            ["变体", "每个实际销售的 Color × Size × Fit 组合单独一行，无需创建不存在的组合；填写 SKU、价格、库存、重量与物流资料"],
            ["SKU", "强烈建议每个变体唯一且必填；当前测试商品仅每款 1 个变体有 SKU，不可沿用"],
            ["库存", "建议开启 Track quantity 并关闭缺货后继续销售；如需预售，先由运营确认规则并联调前台可售状态"],
            ["价格", "当前默认币种 GBP；多市场价格由 Markets / Catalogs 配置，不在标题或 SKU 中写币种"],
        ],
        [2100, 7260],
    )

    add_heading(doc, "3.3 图片与文件", 2)
    add_callout(doc, "核心规则", "每个商品的商品 Media 至少 6 张；每个 Color 还必须关联一条恰好 6 张图的颜色图库。可复用同一批源文件，但后台两处都要正确挂载。", fill=AMBER)
    add_table(
        doc,
        ["序号", "建议内容", "前台用途", "建议规范"],
        [
            ["01", "产品细节 / 平铺特写", "列表主图 + PDP 第 1 图", "建议 1600×2400；PNG/WebP/JPG；同系列统一比例"],
            ["02", "产品背面平铺", "列表悬停图 + PDP 第 2 图", "同上"],
            ["03", "产品正面平铺", "PDP 第 3 图", "同上"],
            ["04", "模特背面", "PDP 第 4 图", "主体完整、背景与裁切统一"],
            ["05", "模特正面", "PDP 第 5 图", "同上"],
            ["06", "模特 / 工艺细节", "PDP 第 6 图", "同上"],
            ["Lifestyle", "场景大图", "custom.img，Gallery 下方", "可选；建议横版高分辨率"],
            ["Editorial 1/2", "两张产品故事图", "详情页两组图文", "必填；建议统一 2:3 或项目确认比例"],
            ["Spec icons", "规格图标", "Technical Specifications", "可选；透明 PNG 或 SVG"],
            ["Care", "洗涤说明图", "规格区底部", "必填；推荐 PNG 或可渲染 SVG；普通文件需开发验证，勿用 PDF 代替图"],
        ],
        [1400, 1700, 2400, 3860],
    )
    add_bullets(doc, [
        "所有图片必须提供 Alt 文本，说明产品、颜色与视角；不要写“image1”。",
        "文件名建议：handle-color-01-front.webp、handle-color-editorial-01.webp。",
        "提交前确认图片版权、模特肖像权与品牌使用权。",
        "不要把 PDF 放进规格 Logo 字段；该类字段只接受图片或 SVG。",
    ])

    add_heading(doc, "3.4 PDP 文案与自定义字段", 2)
    add_table(
        doc,
        ["后台 Key", "类型", "必填", "内容要求"],
        [
            ["pdp_summary", "单行文本列表", "是", "1–4 条短句；产品核心价值"],
            ["main_color", "颜色", "否", "产品主题色，6 位 HEX；购买控件不填时使用代码默认棕灰"],
            ["img", "文件（图片）", "否", "Lifestyle 大图"],
            ["color_galleries", "PDP Color Gallery 引用列表", "是", "每个 Color 正好一条，不能重复或漏色"],
            ["editorial_blocks", "PDP Editorial Block 引用列表", "是", "正好 2 条；第 1 条图左文右，第 2 条图右文左"],
            ["spec_product_weight", "多行文本", "是", "如 100 G - 3.53 OZ."],
            ["spec_main_fabric_content", "多行文本", "是", "完整纤维成分与比例"],
            ["spec_fabric", "多行文本", "是", "面料技术与触感说明"],
            ["spec_fit", "多行文本", "是", "如 RACE / RELAXED"],
            ["spec_temperature_range", "多行文本", "是", "如 18–35°C"],
            ["spec_riding_conditions", "多行文本", "是", "当前前台标签名称如此；内容可填 HOT 等"],
            ["spec_construction", "多行文本", "是", "结构、裁片、缝制或功能说明"],
            ["care_instructions", "文件", "是", "洗涤说明图或文件"],
            ["各 spec_*_logo", "文件（图片 / SVG）", "否", "对应规格行图标"],
        ],
        [2800, 1900, 800, 3860],
        font_size=8.2,
    )
    add_callout(doc, "不要复用测试文案", "当前两条 Editorial Block 都是 Shipping & Returns 文案，且内容重复。正式商品应提供产品设计、材料、功能或使用场景故事；配送退货内容放政策页。", fill=RED)
    add_heading(doc, "3.5 需交开发方更新的商品内容", 2)
    add_bullets(doc, [
        "尺码表：当前代码统一使用女装 XS–XXL 的胸围、腰围、臀围表。请提供按性别和品类区分的实测尺寸、单位、测量方法、适用款式及模特身高和穿着尺码。后台 Size 选项不会自动更新尺码表。",
        "商品功能卖点：Fit、Condition Index 和四组功能图标文案目前按 T-Shirt / Tanks 共用代码预设。请确认适用款式；新品类需提供对应图标、标题、短句和说明，由开发接入。",
        "商品影片：当前所有详情页引用同一段本地 AuraLite MP4。请提供正式影片、适用商品和版权确认；上传到 Shopify Files 本身不会替换代码中的影片地址。",
    ])

    add_heading(doc, "4. 首页与品牌资料", 1)
    add_heading(doc, "4.1 首页 Banner（Metaobject: homepage_banner）", 2)
    add_table(
        doc,
        ["Key", "类型", "必填", "甲方交付"],
        [
            ["image", "图片", "是", "桌面图；当前示例 1920×1200，正式图请保持同批次比例一致"],
            ["mobile_image", "图片", "建议", "移动端独立构图；不填会继续使用桌面图"],
            ["logo_file", "文件", "否", "优先于 logo_text；支持 SVG / 常规图片"],
            ["logo_text", "单行文本", "否", "无 Logo 文件时显示文字"],
            ["slogan", "单行文本", "否", "第二行文案"],
            ["button_text", "单行文本", "条件", "有链接时必填"],
            ["button_link", "URL", "否", "站内集合 / 商品 / 页面链接或外部 URL"],
            ["sort_order", "整数", "是", "1、2、3……；不可重复"],
        ],
        [1900, 1800, 900, 4760],
    )
    add_body(doc, "建议交付 2–5 组 Banner，每组包含桌面图、移动端图、Alt、Logo/标题、Slogan、按钮文字、按钮链接、排序。当前两组测试 Banner 使用同一图片并含 Lab/Lab2 测试文字，需全部替换。")

    add_heading(doc, "4.2 首页分类（Metaobject: homepage_category）", 2)
    add_table(
        doc,
        ["条目", "label", "link", "sort_order", "图片要求"],
        [
            ["男装", "Shop Man", "/collections/man-all", "1", "竖版；建议统一 2:3；提供 Alt"],
            ["女装", "Shop Woman", "/collections/woman", "2", "竖版；建议统一 2:3；提供 Alt"],
        ],
        [900, 1500, 2500, 1300, 3160],
    )
    add_callout(doc, "当前实现提示", "正式首页启用后，分类卡片默认打开男 / 女导航抽屉；link 必须对应支持的性别集合 handle。", fill=LIGHT_GRAY)

    add_heading(doc, "4.3 全局品牌与站点信息", 2)
    add_body(doc, "全局颜色在 Content → Metaobjects 的 main_color 类型中维护：编辑 handle 为 global 的条目，name 为内部名称，color 填正式 HEX 色值。产品 custom.main_color 为独立配置。首页品牌宣言文案另交开发方更新。")
    add_checkbox_list(doc, [
        "确认全局主题色（当前为 #BE8EC2）及深浅色使用规范。",
        "提供主 Logo、反白 Logo、方形 Logo / Favicon，优先 SVG，并附安全边距规范。",
        "提供品牌一句话、短描述、完整品牌介绍（英文；如需多语言另行提供）。",
        "提供官方 Instagram、YouTube、TikTok、Strava、Spotify 完整链接；当前代码是平台首页占位链接。",
        "提供客服联系邮箱、隐私邮箱、公司注册地址、公司号、VAT 号的最终确认版本。",
        "确认 Newsletter / Field Notes 使用 Shopify Email、Klaviyo、Mailchimp 或其他服务；当前表单尚未接入提交后端。",
    ])

    add_heading(doc, "5. 集合与导航", 1)
    add_body(doc, "后台已建 30 个集合。正式商品须加入正确集合；不要只依赖标签。集合图片当前均为空，前台集合页暂不读取集合图，但建议为后台运营和未来扩展补齐。")
    add_table(
        doc,
        ["分组", "Handle"],
        [
            ["总集合", "man-all；woman；accessories；new-arrivals"],
            ["男装", "man-tech-tees；man-tanks；man-shells；man-midlayers；man-split-shorts；man-distance-shorts；man-tights；man-pants；man-caps；man-socks；man-arm-sleeves；man-soft-flasks；man-bags"],
            ["女装", "woman-tech-tees；woman-tanks；woman-shells；woman-midlayers；woman-split-shorts；woman-distance-shorts；woman-tights；woman-pants；woman-caps；woman-socks；woman-arm-sleeves；woman-soft-flasks；woman-bags"],
        ],
        [1500, 7860],
    )
    add_bullets(doc, [
        "man-menu 和 woman-menu 已配置为 Tops、Bottoms、Accessories 三组；保持现有 handle 不变。",
        "shop-menu 当前不存在。甲方需决定是否增加“Shop”总菜单；如不需要，开发方应确认移除对应查询。",
        "New Arrivals 当前建议使用手动集合或由上线日期 / 标签驱动的自动集合；请甲方确认规则与下架周期。",
        "商品详情页性别高亮依赖 man / woman 标签，标签缺失时导航状态不准确。",
    ])

    add_heading(doc, "6. 市场、币种、配送与政策", 1)
    add_heading(doc, "6.1 市场与币种", 2)
    add_body(doc, "本地代码展示 11 个区域入口：UK、EU、US、HK、SG、JP、KR、AU、CA、TW、International；Shopify 当前店面接口可见 26 个国家 / 地区，默认 GB / GBP。甲方需逐市场确认：")
    add_checkbox_list(doc, [
        "可售国家 / 地区与禁售地区；International 是否保留。",
        "本地币种、固定价或自动汇率、价格尾数规则。",
        "税费是否含税显示，DDP / DDU 规则与进口责任文案。",
        "各市场配送方式、运费门槛、预计时效、退货地址与退货费用承担方。",
        "NZ 是否应启用为 ROW 代表市场；如不启用，开发方需改为一个确实可售的 ROW 国家。",
    ])

    add_heading(doc, "6.2 当前内容冲突，甲方必须给出唯一口径", 2)
    add_table(
        doc,
        ["主题", "当前出现的不同说法", "甲方确认项"],
        [
            ["退货期限", "本地页面写 14 天；页脚卖点写 30-Day Returns", "最终天数、适用商品、地区、退货费"],
            ["英国运费", "页面写 £5 / £8；测试 PDP 文案写 £10 / £14", "标准 / 加急费用与免邮门槛"],
            ["发货时间", "页面写 2–4 个工作日；页脚写 12 点前 Same-Day Dispatch", "截单时间、工作日、例外情况"],
            ["配送时效", "购物袋写标准 3–5 天、加急 1–3 天；页面写标准 2–4 天、加急 1–2 天", "统一各地区时效"],
        ],
        [1500, 4300, 3560],
    )
    add_callout(doc, "法律审阅", "Refund Policy、Shipping Policy、Terms of Service 目前未在 Shopify 政策中配置。隐私政策虽已存在，也应由甲方法务重新核对公司主体、联系信息、Cookie、跨境传输和营销授权。", fill=RED)

    add_heading(doc, "7. 页面与内容清单", 1)
    add_body(doc, "以下页面当前由 Hydrogen 代码内置，不直接读取 Shopify Page。甲方仍需提供最终定稿；开发方收到后更新代码，除非项目后续决定迁移到 Shopify Pages / Metaobjects。")
    add_table(
        doc,
        ["页面", "Handle", "甲方需提供 / 确认"],
        [
            ["Customer Service", "customer-service", "客服邮箱、响应时效、订单问题处理说明"],
            ["Shipping & Returns", "shipping-returns", "各地区运费、时效、关税、退货流程与地址"],
            ["FAQ", "faq", "尺码、发货、退货、SS27、社群 / 测试、国际配送、洗护"],
            ["Terms & Conditions", "terms-conditions", "法律条款最终版本"],
            ["Privacy & Cookie Policy", "privacy-cookie-policy", "隐私邮箱、Cookie / 分析 / 营销工具、数据处理方"],
            ["Our Packaging", "our-packaging", "材料、可回收 / 可复用声明与证据"],
            ["Care Guide", "care-guide", "通用洗护规范及产品例外"],
            ["Sustainability", "sustainability", "材料与可持续声明；避免无法证明的表述"],
            ["Careers", "careers", "招聘状态与联系入口"],
            ["Store Locator / Stockists", "store-locator", "门店 / 经销商列表或“仅线上”说明"],
        ],
        [2100, 2300, 4960],
    )

    add_heading(doc, "8. 环境变量与权限（开发方配置）", 1)
    add_callout(doc, "安全要求", "甲方只需提供管理员授权或在 Shopify 后台完成授权。任何 Token、Client Secret、SESSION_SECRET 均不得填写在 Excel、邮件正文、群聊或本手册中。", fill=AMBER)
    add_table(
        doc,
        ["变量名", "用途", "来源 / 责任人", "是否可公开"],
        [
            ["PUBLIC_STOREFRONT_ID", "Hydrogen Analytics 店面标识", "Hydrogen 销售渠道 / 开发", "可公开标识，但无需发给消费者"],
            ["PUBLIC_STORE_DOMAIN", "Storefront API 店铺域名", "Shopify / 开发", "域名可公开"],
            ["PUBLIC_CHECKOUT_DOMAIN", "结算与代理 Storefront API 域名", "Shopify / 开发", "域名可公开"],
            ["PUBLIC_STOREFRONT_API_TOKEN", "店面 API 公共令牌", "Hydrogen / Headless 渠道 / 开发", "按 Shopify 公开令牌模型使用；仍由开发管理"],
            ["PRIVATE_STOREFRONT_API_TOKEN", "服务端店面访问", "Shopify / 开发", "禁止公开"],
            ["PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID", "新 Customer Account 登录", "Customer Account API / 开发", "客户端标识"],
            ["PUBLIC_CUSTOMER_ACCOUNT_API_URL", "Customer Account API 入口", "Shopify / 开发", "URL 可公开"],
            ["SESSION_SECRET", "服务端会话签名", "开发随机生成并写入部署平台", "禁止公开"],
        ],
        [3000, 2600, 2500, 1260],
        font_size=8.1,
    )

    add_heading(doc, "9. Shopify 后台上传操作", 1)
    add_heading(doc, "9.1 一次性检查自定义数据定义", 2)
    add_numbered(doc, [
        "进入 Settings → Metafields and metaobjects（部分后台仍显示 Custom data）。操作员需要商品、内容和自定义数据的相应权限。",
        "确认 Metaobject 类型：首页 Banner（homepage_banner）、首页分类（homepage_category）、全局色（main_color）、PDP Color Gallery（pdp_color_gallery）、PDP Editorial Block（pdp_editorial_block）。",
        "确认 Products 下已建立第 3.4 节全部元字段，namespace 为 custom。字段 Key 和类型必须完全一致；7 个图标 Key 分别是 spec_product_weight_logo、spec_main_fabric_content_logo、spec_fabric_logo、spec_fit_logo、spec_temperature_range_logo、spec_riding_conditions_logo、spec_construction_logo。",
        "所有供 Hydrogen 读取的定义开启 Storefronts access。如定义已启用 Active / Draft 状态，供前台读取的条目设为 Active；不要擅自切换现有定义的能力开关。",
        "不要在未备份定义与条目的情况下删除、改 Key 或改类型。",
    ])

    add_heading(doc, "9.2 上传公共文件", 2)
    add_numbered(doc, [
        "进入 Content → Files，按最终文件名上传图片 / SVG / 文件。",
        "上传后检查像素尺寸、文件预览和 Alt 文本。",
        "同一文件可在商品 Media、Metaobject 和 Metafield 中复用，无需重复上传。",
    ])

    add_heading(doc, "9.3 创建 PDP Metaobject 条目", 2)
    add_numbered(doc, [
        "进入 Content → Metaobjects，每个商品的每个 Color 创建一条 PDP Color Gallery；填写内部 name，color_name 等于 Color 选项值，images 恰好 6 张且顺序正确；如有状态选项，设 Active。",
        "每个商品创建正好两条 PDP Editorial Block；填写 name、heading、body、image；状态 Active。",
        "条目命名建议：产品 Handle · Color / Story 1 / Story 2，便于后台检索。",
    ])

    add_heading(doc, "9.4 创建商品并填写变体", 2)
    add_numbered(doc, [
        "进入 Products → Add product；状态先设 Draft。",
        "填写标题、Vendor、Product type、Tags、SEO；加入对应 Collections。",
        "上传商品 Media 至少 6 张，并按 01–06 排序。",
        "创建 Color、Size、Fit（如适用）选项，再逐变体填写 SKU、条码、价格、库存、重量和物流信息。",
        "在商品底部 Metafields 填写 pdp_summary、7 个 spec 文本、care_instructions，并挂载颜色图库和两条 Editorial Block。",
        "先在后台核对 Draft 数据。Draft 商品不供普通 Storefront API 读取；前台验收由开发安排受限测试店面，并在明确发布范围后将测试商品设为 Active 且发布到对应 Hydrogen 渠道。不要误认为仅发布 Online Store 就能在 Hydrogen 显示。",
    ])

    add_heading(doc, "9.5 首页、菜单与政策", 2)
    add_numbered(doc, [
        "Content → Metaobjects → Homepage Banner / Homepage Category：替换测试条目或新建正式条目，检查 Active 与排序。",
        "Content → Menus：维护 man-menu、woman-menu；如确认需要则新建 handle 为 shop-menu 的菜单。",
        "Settings → Policies：粘贴法务定稿的 Refund、Privacy、Terms、Shipping 政策，检查公司主体与邮箱。",
        "Settings → General → Brand assets → Manage：上传 Logo，填写 Short description 与 Slogan。当前 Hydrogen 页眉 Logo 和社媒链接仍由代码管理，需同步交开发方替换。",
        "进入 Markets（市场）确认国家、币种、价格与域名；配送和税费分别在 Settings → Shipping and delivery、Taxes and duties 核对。再由开发核对前台区域配置。",
    ])
    add_heading(doc, "9.6 批量导入注意事项", 2)
    add_body(doc, "配套 Excel 是甲方资料收集表，不是可直接导入 Shopify 的产品 CSV。批量录入时，先从 Shopify Products → Export 导出官方示例，再由运营或开发映射列名。Media、Metaobject 条目及其引用关系必须另外核对，不能把本表另存 CSV 后直接导入。先测试一款完整商品，通过后再批量处理。")

    add_heading(doc, "10. 文件打包与命名", 1)
    add_body(doc, "推荐目录结构如下；Handle 与 Excel 中保持一致。")
    add_table(
        doc,
        ["目录 / 文件", "内容"],
        [
            ["00_商品数据.xlsx", "填写配套模板"],
            ["01_products/<handle>/<color>/media/", "01–06 商品图"],
            ["01_products/<handle>/<color>/gallery/", "01–06 颜色图库；若复用 Media，请在表格注明"],
            ["01_products/<handle>/editorial/", "editorial-01、editorial-02"],
            ["01_products/<handle>/spec/", "规格图标、care-instructions"],
            ["02_homepage/banner-01/", "desktop、mobile、logo（如有）"],
            ["02_homepage/categories/", "shop-man、shop-woman"],
            ["03_brand/", "Logo、Favicon、品牌色、品牌文案、社媒链接"],
            ["04_legal_and_ops/", "政策、物流、税务、公司信息定稿"],
        ],
        [3300, 6060],
    )

    add_heading(doc, "11. 上线验收清单", 1)
    add_checkbox_list(doc, [
        "商品标题、Handle、类型、标签、集合归类正确。",
        "每个商品 Media 至少 6 张，前两张适合列表主图 / 悬停图，所有图片有 Alt。",
        "Color、Size、Fit 值符合规则；每个变体有唯一 SKU、价格、库存与物流信息。",
        "每个颜色有且只有一条 6 图 Color Gallery；颜色名与选项一致。",
        "每个商品正好两条 Editorial Block；不是重复的物流政策文案。",
        "pdp_summary、7 个规格文本、care_instructions 全部填写。",
        "首页 Banner / 分类图已替换测试内容，桌面与移动端显示正常。",
        "man-menu / woman-menu 链接均可打开；shop-menu 已明确保留或取消。",
        "品牌描述、Logo、社媒、客服联系邮箱、隐私邮箱均为正式值。",
        "Refund / Shipping / Terms / Privacy 文案经运营与法务确认，所有运费 / 时效 / 退货口径一致。",
        "11 个前台区域与 Shopify Markets 对齐；ROW 代表国家问题已解决。",
        "Customer Account 登录、购物袋、结算、折扣、愿望清单、Cookie 与 Newsletter 集成完成验收。",
        "开发方从 Coming Soon 切回完整店面后，桌面 / 手机逐页回归并完成正式发布。",
    ])

    add_heading(doc, "12. 甲方回传前最终确认", 1)
    add_callout(doc, "回传内容", "1 份完整 Excel + 资源文件夹 + 法务定稿文件。若某项不适用，请填写 N/A，不要留空；若等待决策，请填写“待确认 + 负责人 + 预计日期”。")
    add_body(doc, "数据核对日期：2026-09-03。正式上传前请复核最新商品、政策和市场设置。Shopify 后台菜单名称可能因语言和版本不同而变化。", color=MUTED)
    add_heading(doc, "13 官方操作参考", 1)
    for label, url in [
        ("Metaobject 条目", "https://help.shopify.com/en/manual/custom-data/metaobjects/creating-entries"),
        ("自定义数据访问设置", "https://help.shopify.com/en/manual/custom-data/options"),
        ("品牌资料", "https://help.shopify.com/en/manual/promoting-marketing/managing-brand-assets"),
        ("产品 CSV", "https://help.shopify.com/en/manual/products/import-export/using-csv"),
    ]:
        add_body(doc, f"{label}：{url}", color=MUTED)

    doc.core_properties.title = "Tenth Athletic Shopify 资料准备与上传手册"
    doc.core_properties.subject = "Client data preparation and Shopify upload guide"
    doc.core_properties.author = "Tenth Athletic Project Team"
    doc.core_properties.keywords = "Shopify, Hydrogen, 产品资料, Banner, Metaobject, 上传手册"
    doc.save(OUTPUT_PATH)
    print(OUTPUT_PATH)


if __name__ == "__main__":
    build_document()
