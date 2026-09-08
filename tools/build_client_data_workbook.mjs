import fs from 'node:fs/promises';
import path from 'node:path';
import {SpreadsheetFile, Workbook} from '@oai/artifact-tool';

const root = process.cwd();
const outputDir = path.join(root, 'outputs', 'shopify-client-data-pack');
const qaDir = path.join(root, '.tmp', 'shopify-client-data-workbook-qa');
const outputPath = path.join(
  outputDir,
  'Tenth_Athletic_Shopify资料收集模板.xlsx',
);

await fs.mkdir(outputDir, {recursive: true});
await fs.mkdir(qaDir, {recursive: true});

const workbook = Workbook.create();
const COLORS = {
  ink: '#242424',
  muted: '#666666',
  accent: '#333333',
  accent2: '#E6E9ED',
  lightAccent: '#F3F4F6',
  lightGray: '#F3F4F6',
  border: '#D9DCE1',
  white: '#FFFFFF',
  green: '#E8F5EC',
  amber: '#FFF4D6',
  red: '#FDEBEC',
};

function colLetter(index) {
  let value = index + 1;
  let result = '';
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

function setupSheet(sheet, title, subtitle, headers, rows, widths) {
  const lastCol = colLetter(headers.length - 1);
  sheet.showGridLines = false;
  sheet.getRange('A1').values = [[title]];
  sheet.getRange(`A1:${lastCol}1`).format = {
    font: {name: 'Arial', bold: true, color: COLORS.ink, size: 16},
    verticalAlignment: 'center',
  };
  sheet.getRange(`A1:${lastCol}1`).format.rowHeight = 32;

  sheet.getRange('A2').values = [[subtitle]];
  sheet.getRange(`A2:${lastCol}2`).format = {
    font: {color: COLORS.muted, size: 10},
    wrapText: false,
    verticalAlignment: 'center',
  };
  sheet.getRange(`A2:${lastCol}2`).format.rowHeight = 34;

  sheet.getRange(`A3:${lastCol}3`).values = [headers];
  sheet.getRange(`A3:${lastCol}3`).format = {
    fill: COLORS.accent2,
    font: {bold: true, color: COLORS.ink, size: 9},
    wrapText: true,
    verticalAlignment: 'center',
    borders: {preset: 'outside', style: 'thin', color: COLORS.border},
  };
  sheet.getRange(`A3:${lastCol}3`).format.rowHeight = 38;

  if (rows.length) {
    const endRow = 3 + rows.length;
    sheet.getRange(`A4:${lastCol}${endRow}`).values = rows;
    sheet.getRange(`A4:${lastCol}${endRow}`).format = {
      font: {color: COLORS.ink, size: 9},
      wrapText: true,
      verticalAlignment: 'center',
      borders: {
        insideHorizontal: {style: 'thin', color: COLORS.border},
        bottom: {style: 'thin', color: COLORS.border},
      },
    };
    sheet.getRange(`A4:${lastCol}${endRow}`).format.rowHeight = 32;
  }

  widths.forEach((width, index) => {
    const col = colLetter(index);
    sheet.getRange(`${col}:${col}`).format.columnWidth = width;
  });
  sheet.freezePanes.freezeRows(3);
}

function addBlankRows(rowCount, colCount) {
  return Array.from({length: rowCount}, () =>
    Array.from({length: colCount}, () => null),
  );
}

function addStatusValidation(sheet, range) {
  sheet.getRange(range).dataValidation = {
    rule: {type: 'list', values: ['待填写', '待确认', '已提供', '不适用']},
  };
  sheet.getRange(range).conditionalFormats.add('containsText', {
    text: '已提供',
    format: {fill: COLORS.green, font: {color: '#235C36'}},
  });
  sheet.getRange(range).conditionalFormats.add('containsText', {
    text: '待确认',
    format: {fill: COLORS.amber, font: {color: '#7A5A00'}},
  });
  sheet.getRange(range).conditionalFormats.add('containsText', {
    text: '待填写',
    format: {fill: COLORS.red, font: {color: '#8A1C1C'}},
  });
}

// 00 - Instructions and visible progress summary.
{
  const sheet = workbook.worksheets.add('00_填写说明');
  sheet.showGridLines = false;
  sheet.getRange('A1').values = [['Tenth Athletic · Shopify 资料收集模板']];
  sheet.getRange('A1:F1').format = {
    font: {name: 'Arial', bold: true, color: COLORS.ink, size: 18},
    verticalAlignment: 'center',
  };
  sheet.getRange('A1:F1').format.rowHeight = 38;
  sheet.mergeCells('A2:F2');
  sheet.getRange('A2').values = [[
    '请甲方按工作表逐项填写。不要在本文件中填写任何 Token、Client Secret 或 SESSION_SECRET；密钥只由管理员授权后交开发方安全配置。',
  ]];
  sheet.getRange('A2:F2').format = {
    fill: COLORS.amber,
    font: {bold: true, color: '#6A4A00', size: 10},
    wrapText: true,
    verticalAlignment: 'center',
  };
  sheet.getRange('A2:F2').format.rowHeight = 44;
  sheet.getRange('A4:F4').values = [[
    '步骤',
    '操作',
    '责任人',
    '完成标准',
    '建议文件夹',
    '备注',
  ]];
  sheet.getRange('A4:F4').format = {
    fill: COLORS.accent2,
    font: {bold: true, color: COLORS.ink, size: 9},
    wrapText: true,
  };
  const steps = [
    ['1', '先填 01 商品主数据、02 变体与库存、04 PDP 内容', '商品 / 运营', '所有正式商品均有 Handle；不适用项填 N/A', '01_products/', 'P0'],
    ['2', '按 03 图片清单打包并命名全部素材', '设计 / 品牌', '每张图有文件名、用途、排序和 Alt', '01_products/', 'P0'],
    ['3', '确认 05 首页内容与 06 集合导航', '品牌 / 电商', '测试文案与测试图片全部替换', '02_homepage/', 'P1'],
    ['4', '确认 07 站点与政策', '运营 / 法务 / 财务', '运费、时效、退货等口径唯一且已审批', '04_legal_and_ops/', 'P0'],
    ['5', '08 环境变量只填写责任人 / 状态，不填值', '甲方管理员 / 开发', '凭证通过管理员授权或密码管理器交接', '不放入素材包', '安全'],
    ['6', '开发与运营按 09 当前差距逐项关闭', '项目组', 'Coming Soon 切换前所有阻塞项关闭', '—', '上线'],
  ];
  sheet.getRange('A5:F10').values = steps;
  sheet.getRange('A5:F10').format = {
    font: {size: 9, color: COLORS.ink},
    wrapText: true,
    verticalAlignment: 'center',
    borders: {
      insideHorizontal: {style: 'thin', color: COLORS.border},
      bottom: {style: 'thin', color: COLORS.border},
    },
  };
  sheet.getRange('A5:F10').format.rowHeight = 40;

  sheet.mergeCells('A12:F12');
  sheet.getRange('A12').values = [['填写进度（自动统计）']];
  sheet.getRange('A12:F12').format = {
    fill: COLORS.lightAccent,
    font: {bold: true, color: COLORS.accent, size: 12},
  };
  sheet.getRange('A13:F13').values = [[
    '工作表',
    '已填写记录',
    '已提供',
    '待确认',
    '待填写',
    '说明',
  ]];
  sheet.getRange('A13:F13').format = {
    fill: COLORS.lightGray,
    font: {bold: true, color: COLORS.ink, size: 9},
  };
  const progressRows = [
    ['01_商品主数据', '', '', '', '', '一行一个商品'],
    ['02_变体与库存', '', '', '', '', '一行一个变体'],
    ['03_图片清单', '', '', '', '', '一行一个文件'],
    ['04_PDP内容', '', '', '', '', '一行一个商品'],
    ['05_首页内容', '', '', '', '', '一行一个条目'],
  ];
  sheet.getRange('A14:F18').values = progressRows;
  sheet.getRange('A13:F18').format = {
    font: {size: 9, color: COLORS.ink},
    wrapText: true,
    verticalAlignment: 'center',
    borders: {preset: 'all', style: 'thin', color: COLORS.border},
  };
  sheet.getRange('B14:E18').format.numberFormat = '0';
  sheet.getRange('A20:B25').values = [
    ['填写口径', '* 为本项目交付必填项，不代表全部是 Shopify 平台强制字段。'],
    ['上传方式', '本表不是 Shopify CSV。先填本表，再按 Word 手册逐项录入或映射官方 CSV。'],
    ['核对范围', '2026-09-03 Storefront 可见内容与本地代码。不含草稿、未发布商品或完整后台设置。'],
    ['产品 CSV', 'https://help.shopify.com/en/manual/products/import-export/using-csv'],
    ['自定义数据', 'https://help.shopify.com/en/manual/custom-data/options'],
    ['进度范围', '自动统计第 4–203 行。新增超过 200 条记录时，请开发同步扩大公式和下拉范围。'],
  ];
  for (let row=20;row<=25;row++) sheet.mergeCells(`B${row}:F${row}`);
  sheet.getRange('A20:F25').format = {font:{size:10,color:COLORS.muted},wrapText:true,verticalAlignment:'center'};
  sheet.getRange('A20:F25').format.rowHeight=42;
  [18, 32, 18, 28, 28, 22].forEach((width, index) => {
    const col = colLetter(index);
    sheet.getRange(`${col}:${col}`).format.columnWidth = width;
  });
  sheet.freezePanes.freezeRows(4);
}

// 01 - Product master.
{
  const sheet = workbook.worksheets.add('01_商品主数据');
  const headers = [
    '商品 Handle*', '商品标题*', '产品类型*', 'Vendor*', '性别标签*',
    '集合 Handle（分号分隔）*', '简短描述 / 卖点', 'SEO 标题', 'SEO 描述',
    '商品状态', '发布到 Hydrogen', '原产国', 'HS Code', '材质大类',
    '上新日期', '下架 / 转常规日期', '内部负责人', '资料状态*',
  ];
  setupSheet(
    sheet,
    '01 · 商品主数据',
    '一行一个商品。Product type 当前仅允许 T-Shirt / Tanks；性别标签只填 man 或 woman。Handle 使用英文小写短横线。',
    headers,
    addBlankRows(40, headers.length),
    [24, 34, 16, 18, 14, 38, 36, 28, 42, 14, 18, 16, 15, 16, 14, 18, 16, 14],
  );
  sheet.getRange('C4:C203').dataValidation = {rule: {type: 'list', values: ['T-Shirt', 'Tanks']}};
  sheet.getRange('E4:E203').dataValidation = {rule: {type: 'list', values: ['man', 'woman']}};
  sheet.getRange('J4:J203').dataValidation = {rule: {type: 'list', values: ['Draft', 'Active', 'Archived']}};
  sheet.getRange('K4:K203').dataValidation = {rule: {type: 'list', values: ['是', '否']}};
  sheet.getRange('O4:P203').format.numberFormat = 'yyyy-mm-dd';
  addStatusValidation(sheet, 'R4:R203');
}

// 02 - Variant data.
{
  const sheet = workbook.worksheets.add('02_变体与库存');
  const headers = [
    '商品 Handle*', 'Color*', 'Size*', 'Fit（如适用）', 'SKU*', 'Barcode',
    '售价 GBP*', '对比价 GBP', '可售库存*', '重量 g', 'HS Code', '原产国',
    'Track quantity', '缺货后继续销售', '图片颜色匹配', '备注', '资料状态*',
  ];
  setupSheet(
    sheet,
    '02 · 变体与库存',
    '一行一个实际销售变体；无需创建不存在的组合。SKU 为项目运营要求，建议唯一。Size / Fit 使用下拉值。',
    headers,
    addBlankRows(80, headers.length),
    [24, 16, 12, 24, 22, 20, 14, 14, 14, 12, 15, 16, 16, 18, 18, 24, 14],
  );
  sheet.getRange('C4:C203').dataValidation = {rule: {type: 'list', values: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']}};
  sheet.getRange('D4:D203').dataValidation = {rule: {type: 'list', values: ['', 'ContourRace (Race)', 'Field Fit (Relax)']}};
  sheet.getRange('M4:N203').dataValidation = {rule: {type: 'list', values: ['是', '否']}};
  sheet.getRange('G4:H203').format.numberFormat = '0.00';
  sheet.getRange('I4:J203').format.numberFormat = '0';
  addStatusValidation(sheet, 'Q4:Q203');
}

// 03 - Asset manifest.
{
  const sheet = workbook.worksheets.add('03_图片清单');
  const headers = [
    '商品 / 首页 Handle*', 'Color / 条目', '用途*', '排序*', '文件名*',
    '像素宽', '像素高', 'Alt 文本*', '可复用来源', '版权 / 肖像权确认', '资料状态*',
  ];
  setupSheet(
    sheet,
    '03 · 图片与文件清单',
    '一行一个文件。商品 Media 和每色 Gallery 都需要 01–06；即使复用同一文件，也分别列出用途。',
    headers,
    addBlankRows(100, headers.length),
    [28, 18, 22, 10, 38, 12, 12, 46, 26, 20, 14],
  );
  sheet.getRange('C4:C203').dataValidation = {
    rule: {type: 'list', values: ['Product Media', 'Color Gallery', 'Lifestyle', 'Editorial 1', 'Editorial 2', 'Spec Icon', 'Care Instructions', 'Homepage Desktop', 'Homepage Mobile', 'Category', 'Logo']},
  };
  sheet.getRange('D4:D203').dataValidation = {rule: {type: 'whole', operator: 'between', formula1: 1, formula2: 99}};
  sheet.getRange('F4:G203').format.numberFormat = '0';
  sheet.getRange('J4:J203').dataValidation = {rule: {type: 'list', values: ['是', '否', '待确认']}};
  addStatusValidation(sheet, 'K4:K203');
}

// 04 - PDP content.
{
  const sheet = workbook.worksheets.add('04_PDP内容');
  const headers = [
    '商品 Handle*', 'Summary 1*', 'Summary 2', 'Summary 3', 'Summary 4',
    '主题色 HEX', 'Lifestyle 文件名', 'Product Weight*', 'Main Fabric Content*',
    'Fabric*', 'Fit*', 'Temperature Range*', 'Riding Conditions*', 'Construction*',
    'Care Instructions 文件名*', 'Editorial 1 标题*', 'Editorial 1 正文*',
    'Editorial 1 图片*', 'Editorial 2 标题*', 'Editorial 2 正文*',
    'Editorial 2 图片*', '资料状态*',
  ];
  setupSheet(
    sheet,
    '04 · PDP 内容',
    '一行一个商品。Summary 需 1–4 条；Editorial 必须正好 2 组且不能用重复的配送退货文案代替产品故事。',
    headers,
    addBlankRows(40, headers.length),
    [24, 34, 30, 30, 30, 16, 28, 20, 42, 42, 18, 20, 22, 42, 30, 28, 54, 28, 28, 54, 28, 14],
  );
  addStatusValidation(sheet, 'V4:V203');
}

// 05 - Homepage content, with prefilled current structure.
{
  const sheet = workbook.worksheets.add('05_首页内容');
  const headers = [
    '类型*', 'Handle*', '桌面图片*', '移动端图片', 'Alt 文本*', 'Logo 文件',
    'Logo 文字', 'Slogan / 标签', '按钮文字', '按钮链接 / 分类链接',
    '排序*', '主题色 HEX', '是否替换测试内容', '资料状态*',
  ];
  const rows = [
    ['Banner', 'homepage-banner-01', '', '', '', '', '', '', '', '', 1, '', '是', '待填写'],
    ['Banner', 'homepage-banner-02', '', '', '', '', '', '', '', '', 2, '', '是', '待填写'],
    ['Category', 'shop-man', '', '', '', '', '', 'Shop Man', '', '/collections/man-all', 1, '', '是', '待填写'],
    ['Category', 'shop-woman', '', '', '', '', '', 'Shop Woman', '', '/collections/woman', 2, '', '是', '待填写'],
    ['Global Color', 'global', '', '', '', '', '', '', '', '', 1, '#BE8EC2', '待确认', '待确认'],
    ...addBlankRows(15, headers.length),
  ];
  setupSheet(
    sheet,
    '05 · 首页 Banner、分类与全局色',
    '已预填当前条目。请替换测试图片、Lab/Lab2 与测试口号；移动端 Banner 建议单独构图。',
    headers,
    rows,
    [18, 26, 34, 34, 44, 28, 22, 36, 22, 40, 10, 18, 22, 14],
  );
  sheet.getRange('A4:A203').dataValidation = {rule: {type: 'list', values: ['Banner', 'Category', 'Global Color']}};
  sheet.getRange('K4:K203').dataValidation = {rule: {type: 'whole', operator: 'between', formula1: 1, formula2: 99}};
  sheet.getRange('M4:M203').dataValidation = {rule: {type: 'list', values: ['是', '否', '待确认']}};
  addStatusValidation(sheet, 'N4:N203');
}

// 06 - Collections and navigation.
{
  const sheet = workbook.worksheets.add('06_集合与导航');
  const headers = ['分组', '显示名称', 'Handle*', '导航菜单', '当前商品', '正式归类规则', '集合图', '资料状态*'];
  const handles = [
    ['总集合', 'Man', 'man-all', 'man-menu', 0],
    ['总集合', 'Woman', 'woman', 'woman-menu', 0],
    ['总集合', 'Accessories', 'accessories', '', 0],
    ['总集合', 'New Arrivals', 'new-arrivals', '', 0],
    ['男装 Tops', 'Man - Tech Tees', 'man-tech-tees', 'man-menu', 6],
    ['男装 Tops', 'Man - Tanks', 'man-tanks', 'man-menu', 0],
    ['男装 Tops', 'Man - Shells', 'man-shells', 'man-menu', 0],
    ['男装 Tops', 'Man - Midlayers', 'man-midlayers', 'man-menu', 0],
    ['男装 Bottoms', 'Man - Split Shorts', 'man-split-shorts', 'man-menu', 0],
    ['男装 Bottoms', 'Man - Distance Shorts', 'man-distance-shorts', 'man-menu', 0],
    ['男装 Bottoms', 'Man - Tights', 'man-tights', 'man-menu', 0],
    ['男装 Bottoms', 'Man - Pants', 'man-pants', 'man-menu', 0],
    ['男装 Accessories', 'Man - Caps', 'man-caps', 'man-menu', 0],
    ['男装 Accessories', 'Man - Socks', 'man-socks', 'man-menu', 0],
    ['男装 Accessories', 'Man - Arm Sleeves', 'man-arm-sleeves', 'man-menu', 0],
    ['男装 Accessories', 'Man - Soft Flasks', 'man-soft-flasks', 'man-menu', 0],
    ['男装 Accessories', 'Man - Bags', 'man-bags', 'man-menu', 0],
    ['女装 Tops', 'Woman - Tech Tees', 'woman-tech-tees', 'woman-menu', 0],
    ['女装 Tops', 'Woman - Tanks', 'woman-tanks', 'woman-menu', 0],
    ['女装 Tops', 'Woman - Shells', 'woman-shells', 'woman-menu', 0],
    ['女装 Tops', 'Woman - Midlayers', 'woman-midlayers', 'woman-menu', 0],
    ['女装 Bottoms', 'Woman - Split Shorts', 'woman-split-shorts', 'woman-menu', 0],
    ['女装 Bottoms', 'Woman - Distance Shorts', 'woman-distance-shorts', 'woman-menu', 0],
    ['女装 Bottoms', 'Woman - Tights', 'woman-tights', 'woman-menu', 0],
    ['女装 Bottoms', 'Woman - Pants', 'woman-pants', 'woman-menu', 0],
    ['女装 Accessories', 'Woman - Caps', 'woman-caps', 'woman-menu', 0],
    ['女装 Accessories', 'Woman - Socks', 'woman-socks', 'woman-menu', 0],
    ['女装 Accessories', 'Woman - Arm Sleeves', 'woman-arm-sleeves', 'woman-menu', 0],
    ['女装 Accessories', 'Woman - Soft Flasks', 'woman-soft-flasks', 'woman-menu', 0],
    ['女装 Accessories', 'Woman - Bags', 'woman-bags', 'woman-menu', 0],
    ['待决策', 'Shop 总菜单', 'shop-menu', '缺失', 0],
  ].map(([group, title, handle, menu, count]) => [group, title, handle, menu, count, '', '', '待确认']);
  setupSheet(
    sheet,
    '06 · 集合与导航',
    '按 Storefront 可见内容预填 30 个集合。仅 man-tech-tees 有 6 个测试商品；shop-menu 未读取到。',
    headers,
    handles,
    [22, 28, 28, 18, 14, 46, 24, 14],
  );
  sheet.getRange('E4:E203').format.numberFormat = '0';
  addStatusValidation(sheet, 'H4:H203');
}

// 07 - Site, policies, and business decisions.
{
  const sheet = workbook.worksheets.add('07_站点与政策');
  const headers = ['分类', '项目*', '当前状态', '甲方最终内容 / 决策*', '审批人', '批准日期', '资料状态*'];
  const rows = [
    ['品牌', '品牌 Slogan 与短描述', 'Shopify Brand 未配置', '', '', '', '待填写'],
    ['品牌', '主 Logo / 反白 Logo / 方形 Logo / Favicon', '本地有 Logo；后台未配置', '', '', '', '待填写'],
    ['联系', '客服邮箱', '本地为占位符', '', '', '', '待填写'],
    ['联系', '隐私邮箱', '本地为占位符', '', '', '', '待填写'],
    ['公司', '公司主体 / 注册地址 / 公司号 / VAT 号', '页脚有 VAT 号，需复核', '', '', '', '待确认'],
    ['物流', '英国标准 / 加急运费与免邮门槛', '存在 £5/£8 与 £10/£14 冲突', '', '', '', '待确认'],
    ['物流', '发货处理时间与截单时间', '2–4 天与 Same-Day Dispatch 冲突', '', '', '', '待确认'],
    ['退货', '退货期限与费用', '14 天与 30 天冲突', '', '', '', '待确认'],
    ['法律', 'Refund Policy', 'Shopify 缺失', '', '', '', '待填写'],
    ['法律', 'Shipping Policy', 'Shopify 缺失', '', '', '', '待填写'],
    ['法律', 'Terms of Service', 'Shopify 缺失', '', '', '', '待填写'],
    ['法律', 'Privacy & Cookie Policy', 'Shopify 有基础版；需法务复核', '', '', '', '待确认'],
    ['市场', '11 个前台区域与 Shopify Markets 映射', 'NZ 未出现在可售国家', '', '', '', '待确认'],
    ['社媒', 'Instagram / YouTube / TikTok / Strava / Spotify', '当前为平台首页占位链接', '', '', '', '待填写'],
    ['营销', 'Field Notes / Newsletter 服务商', '表单未接入后端', '', '', '', '待确认'],
    ['页面', '10 个本地内容页最终文案', '当前为开发草稿', '', '', '', '待确认'],
    ['尺码', '男女款尺码表与测量说明', '本地仅有女性 XS–XXL 示例，交开发更新', '', '', '', '待填写'],
    ['商品内容', '各类型 Fit / Condition 与 4 条功能卖点', '目前按类型写在代码中，交开发更新', '', '', '', '待确认'],
    ['视频', '产品影片与适用商品及版权授权', '所有商品共用本地影片，交开发替换', '', '', '', '待填写'],
    ['首页', '品牌宣言 Manifesto', '完整首页版本为代码固定文案，交开发更新', '', '', '', '待确认'],
  ];
  setupSheet(
    sheet,
    '07 · 站点、运营与政策',
    '法律、物流、税务和公司信息请由有权负责人审批。不同页面出现冲突时，以本表审批后的唯一口径为准。',
    headers,
    rows,
    [16, 34, 38, 58, 18, 16, 14],
  );
  sheet.getRange('F4:F203').format.numberFormat = 'yyyy-mm-dd';
  addStatusValidation(sheet, 'G4:G203');
}

// 08 - Environment variables without values.
{
  const sheet = workbook.worksheets.add('08_环境变量');
  const headers = ['变量名', '用途', '来源 / 责任人', '本地已配置', '安全级别', '交接方式', '资料状态*'];
  const rows = [
    ['PUBLIC_STOREFRONT_ID', '店面 Analytics 标识', 'Hydrogen 渠道 / 开发', '是', '标识', '开发平台配置', '已提供'],
    ['PUBLIC_STORE_DOMAIN', 'Storefront API 店铺域名', 'Shopify / 开发', '是', '公开域名', '开发平台配置', '已提供'],
    ['PUBLIC_CHECKOUT_DOMAIN', '结算与代理域名', 'Shopify / 开发', '是', '公开域名', '开发平台配置', '已提供'],
    ['PUBLIC_STOREFRONT_API_TOKEN', '公开店面 API 令牌', 'Hydrogen / Headless 渠道', '是', '受控', '仅密码管理器 / 部署平台', '已提供'],
    ['PRIVATE_STOREFRONT_API_TOKEN', '服务端店面访问', 'Shopify / 开发', '是', '机密', '仅密码管理器 / 部署平台', '已提供'],
    ['PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID', 'Customer Account 登录', 'Shopify / 开发', '是', '客户端标识', '开发平台配置', '已提供'],
    ['PUBLIC_CUSTOMER_ACCOUNT_API_URL', 'Customer Account API URL', 'Shopify / 开发', '是', '公开 URL', '开发平台配置', '已提供'],
    ['SESSION_SECRET', '服务端会话签名', '开发随机生成', '是', '最高机密', '仅部署平台 Secret', '已提供'],
  ];
  setupSheet(
    sheet,
    '08 · 环境变量与安全交接',
    '禁止填写变量值。本地存在不代表生产配置或登录已验证；管理员与开发需确认部署和联调结果。',
    headers,
    rows.map(row => [...row.slice(0, 6), '待确认']),
    [38, 34, 28, 14, 18, 30, 14],
  );
  addStatusValidation(sheet, 'G4:G203');
}

// 09 - Current gaps / go-live checklist.
{
  const sheet = workbook.worksheets.add('09_当前差距');
  const headers = ['优先级', '模块', '当前差距', '建议动作', '负责人', '目标日期', '资料状态*'];
  const rows = [
    ['阻塞', '前台', '当前为 Coming Soon', '资料与功能验收后由开发切回完整店面', '', '', '待确认'],
    ['阻塞', '政策', 'Refund / Shipping / Terms 缺失', '甲方法务定稿并录入 Shopify', '', '', '待填写'],
    ['阻塞', '运营口径', '退货、运费、发货和配送时效互相冲突', '以 07 表审批后的唯一口径更新全站', '', '', '待确认'],
    ['阻塞', '市场', '代码 ROW 使用 NZ，但 NZ 不在当前可售国家', '启用 NZ 或修改代码代表国家', '', '', '待确认'],
    ['高', '商品', '当前可见 6 个测试商品，均无 man / woman 标签', '正式商品按模板准备；测试商品处理方式由甲方确认', '', '', '待填写'],
    ['高', 'SKU', '每个测试商品仅 1/4 变体有 SKU', '正式商品每个变体唯一 SKU', '', '', '待填写'],
    ['高', '图片', '测试商品主图与首页分类图缺 Alt', '甲方为每张最终图片提供 Alt', '', '', '待填写'],
    ['高', '首页', '两条 Banner 复用测试图并含 Lab/Lab2', '替换桌面 / 移动端素材、文案与链接', '', '', '待填写'],
    ['中', '品牌', 'Shopify Brand 缺 Logo、Slogan、描述', '上传正式品牌资料', '', '', '待填写'],
    ['中', '菜单', 'shop-menu 不存在', '确认保留需求；创建或由开发移除查询', '', '', '待确认'],
    ['中', '内容页', '本地 10 页仍是开发草稿且含邮箱占位符', '甲方提供最终文案，开发更新', '', '', '待填写'],
    ['中', 'Newsletter', 'Field Notes 表单未接入', '确认服务商与订阅合规流程', '', '', '待确认'],
    ['中', '后台核验范围', '草稿、未发布商品和完整后台设置尚未核验', '管理员补查发布渠道、支付、运费、税务及草稿商品', '', '', '待确认'],
  ];
  setupSheet(
    sheet,
    '09 · 当前后台差距与上线关闭清单',
    '截至 2026-09-03。优先关闭“阻塞”和“高”项；完成后再执行正式发布验收。',
    headers,
    rows,
    [14, 20, 48, 48, 18, 16, 14],
  );
  sheet.getRange('A4:A203').dataValidation = {rule: {type: 'list', values: ['阻塞', '高', '中', '低']}};
  sheet.getRange('F4:F203').format.numberFormat = 'yyyy-mm-dd';
  addStatusValidation(sheet, 'G4:G203');
}

// Create cross-sheet formulas only after all target sheets exist.
const dashboard = workbook.worksheets.getItem('00_填写说明');
const progressRefs = [
  ['01_商品主数据', 'R'], ['02_变体与库存', 'Q'],
  ['03_图片清单', 'K'], ['04_PDP内容', 'V'], ['05_首页内容', 'N'],
];
progressRefs.forEach(([name,statusCol],index)=>{
  const row=14+index;
  dashboard.getRange(`B${row}:E${row}`).formulas=[[
    `=COUNTA('${name}'!$A$4:$A$203)`,
    ...['已提供','待确认','待填写'].map(status=>`=COUNTIF('${name}'!$${statusCol}$4:$${statusCol}$203,"${status}")`),
  ]];
});
const testSheet=workbook.worksheets.getItem('04_PDP内容');
testSheet.getRange('A4').values=[['qa-only']];
testSheet.getRange('V4').values=[['已提供']];
console.log('FORMULA_TEST', JSON.stringify(dashboard.getRange('B17:E17').values));
if(JSON.stringify(dashboard.getRange('B17:C17').values)!=='[[1,1]]') throw new Error('Progress formula test failed');
testSheet.getRange('A4').values=[[null]];
testSheet.getRange('V4').values=[[null]];
console.log('FINAL_PROGRESS',JSON.stringify(dashboard.getRange('B14:E18').values));

// Verify key ranges and formula integrity before export.
const inspect = await workbook.inspect({
  kind: 'workbook,sheet,table',
  maxChars: 8000,
  tableMaxRows: 5,
  tableMaxCols: 10,
});
console.log(inspect.ndjson);

const formulaErrors = await workbook.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: {useRegex: true, maxResults: 300},
  summary: 'final formula error scan',
});
console.log(formulaErrors.ndjson);

for (const [sheetName,range] of [
  ['00_填写说明','A1:F25'], ['01_商品主数据','A1:R8'],
  ['02_变体与库存','A1:Q8'], ['03_图片清单','A1:K8'],
  ['04_PDP内容','A1:V8'], ['05_首页内容','A1:N9'],
  ['06_集合与导航','A1:H34'], ['07_站点与政策','A1:G23'],
  ['08_环境变量','A1:G11'], ['09_当前差距','A1:G16'],
]) {
  const preview = await workbook.render({
    sheetName,
    range,
    scale: 1,
    format: 'png',
  });
  const bytes = new Uint8Array(await preview.arrayBuffer());
  await fs.writeFile(path.join(qaDir, `${sheetName}.png`), bytes);
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(outputPath);
