#!/usr/bin/env node
/**
 * Upload product images to Shopify CDN, generate CSV import file,
 * and create the product via Admin GraphQL API.
 */
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {basename, join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_DIR = join(ROOT, 'data/product-import/images');
const OUTPUT_CSV = join(ROOT, 'data/product-import/auralite-performance-t-shirt.csv');

const PRODUCT = {
  title: 'AuraLite™ Performance T-Shirt',
  handle: 'auralite-performance-t-shirt',
  description:
    '<p>Lightweight performance tee built for training and everyday wear. Made from 100% recycled polyester with fast-dry, soft-touch fabric and moisture control. Designed for runners who want technical comfort without compromising style.</p><ul><li>100% Recycled Polyester (AuraLite™)</li><li>Fast Dry &amp; Moisture Control</li><li>Soft Touch hand feel</li><li>Oversized boxy fit with dropped shoulders</li><li>Made in Portugal</li></ul>',
  vendor: 'Tenth Athletic',
  productCategory: 'Apparel & Accessories > Clothing > Clothing Tops > T-Shirts',
  type: 'T-Shirt',
  tags: 'Running, Performance, Technical Wear, Recycled, Men, T-Shirt',
  seoTitle: 'AuraLite™ Performance T-Shirt | Recycled Running Tee',
  seoDescription:
    'Technical running t-shirt in recycled AuraLite™ polyester. Fast-dry, moisture-wicking, soft touch. Available in Washed Charcoal and Olive Brown.',
  colors: [
    {name: 'Washed Charcoal', metafield: 'gray; black', skuCode: 'CHR'},
    {name: 'Olive Brown', metafield: 'green; brown', skuCode: 'OLV'},
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  price: '89.00',
  compareAtPrice: '108.00',
  cost: '32.00',
  weightGrams: {S: 165, M: 178, L: 192, XL: 205},
  inventory: {S: 25, M: 40, L: 35, XL: 20},
};

const IMAGE_FILES = [
  {
    file: 'product-1-back.png',
    position: 1,
    alt: 'AuraLite Performance T-Shirt back view in Washed Charcoal',
    isMain: true,
  },
  {
    file: 'product-1-front.png',
    position: 2,
    alt: 'AuraLite Performance T-Shirt front view with logo',
  },
  {
    file: 'product-3-fabric.png',
    position: 3,
    alt: 'Close-up of AuraLite recycled polyester fabric texture',
  },
  {
    file: 'product-2-label.png',
    position: 4,
    alt: 'AuraLite care label showing material and origin',
  },
  {
    file: 'product-4-lifestyle.png',
    position: 5,
    alt: 'Technical running outfit lifestyle product shot',
  },
];

function loadEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) throw new Error('.env file not found');
  const env = {};
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

async function adminGraphql(shop, token, query, variables = {}) {
  const res = await fetch(`https://${shop}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({query, variables}),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
  }
  if (json.errors?.length) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function uploadImage(shop, token, filePath, alt) {
  const filename = basename(filePath);
  const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const fileBuffer = readFileSync(filePath);

  const stagedData = await adminGraphql(
    shop,
    token,
    `mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters { name value }
        }
        userErrors { field message }
      }
    }`,
    {
      input: [
        {
          filename,
          mimeType,
          resource: 'FILE',
          httpMethod: 'POST',
        },
      ],
    },
  );

  const target = stagedData.stagedUploadsCreate.stagedTargets[0];
  const errors = stagedData.stagedUploadsCreate.userErrors;
  if (errors?.length) throw new Error(`stagedUploadsCreate: ${JSON.stringify(errors)}`);

  const form = new FormData();
  for (const param of target.parameters) {
    form.append(param.name, param.value);
  }
  form.append('file', new Blob([fileBuffer], {type: mimeType}), filename);

  const uploadRes = await fetch(target.url, {method: 'POST', body: form});
  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`File upload failed for ${filename}: ${uploadRes.status} ${text}`);
  }

  const fileData = await adminGraphql(
    shop,
    token,
    `mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          id
          fileStatus
          ... on MediaImage {
            image { url }
          }
        }
        userErrors { field message }
      }
    }`,
    {
      files: [
        {
          alt,
          contentType: 'IMAGE',
          originalSource: target.resourceUrl,
        },
      ],
    },
  );

  const fileErrors = fileData.fileCreate.userErrors;
  if (fileErrors?.length) throw new Error(`fileCreate: ${JSON.stringify(fileErrors)}`);

  let file = fileData.fileCreate.files[0];
  let attempts = 0;
  while (file.fileStatus !== 'READY' && attempts < 20) {
    await new Promise((r) => setTimeout(r, 1500));
    const poll = await adminGraphql(
      shop,
      token,
      `query fileStatus($id: ID!) {
        node(id: $id) {
          ... on MediaImage {
            fileStatus
            image { url }
          }
        }
      }`,
      {id: file.id},
    );
    file = poll.node;
    attempts++;
  }

  if (!file?.image?.url) {
    throw new Error(`Image not ready after upload: ${filename}`);
  }

  return {url: file.image.url, alt, id: file.id};
}

function csvEscape(value) {
  if (value == null || value === '') return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function buildCsvRows(uploadedImages) {
  const imageByFile = Object.fromEntries(
    IMAGE_FILES.map((img, i) => [img.file, uploadedImages[i]]),
  );
  const mainImage = uploadedImages[0];

  const header = [
    'Title',
    'URL handle',
    'Description',
    'Vendor',
    'Product category',
    'Type',
    'Tags',
    'Published on online store',
    'Status',
    'SKU',
    'Barcode',
    'Option1 name',
    'Option1 value',
    'Option1 Linked To',
    'Option2 name',
    'Option2 value',
    'Option2 Linked To',
    'Option3 name',
    'Option3 value',
    'Option3 Linked To',
    'Price',
    'Compare-at price',
    'Cost per item',
    'Charge tax',
    'Tax code',
    'Unit price total measure',
    'Unit price total measure unit',
    'Unit price base measure',
    'Unit price base measure unit',
    'Inventory tracker',
    'Inventory quantity',
    'Continue selling when out of stock',
    'Weight value (grams)',
    'Weight unit for display',
    'Requires shipping',
    'Fulfillment service',
    'Product image URL',
    'Image position',
    'Image alt text',
    'Variant image URL',
    'Gift card',
    'SEO title',
    'SEO description',
    'Color (product.metafields.shopify.color-pattern)',
    'Google Shopping / Google product category',
    'Google Shopping / Gender',
    'Google Shopping / Age group',
    'Google Shopping / Manufacturer part number (MPN)',
    'Google Shopping / Ad group name',
    'Google Shopping / Ads labels',
    'Google Shopping / Condition',
    'Google Shopping / Custom product',
    'Google Shopping / Custom label 0',
    'Google Shopping / Custom label 1',
    'Google Shopping / Custom label 2',
    'Google Shopping / Custom label 3',
    'Google Shopping / Custom label 4',
  ];

  const rows = [header];
  let barcodeBase = 5784400000;
  let isFirst = true;

  for (const color of PRODUCT.colors) {
    for (const size of PRODUCT.sizes) {
      const sku = `AURALITE-${color.skuCode}-${size}`;
      const variantImage =
        color.name === 'Washed Charcoal'
          ? imageByFile['product-1-back.png'].url
          : imageByFile['product-4-lifestyle.png'].url;

      const row = new Array(header.length).fill('');
      if (isFirst) {
        row[0] = PRODUCT.title;
        row[1] = PRODUCT.handle;
        row[2] = PRODUCT.description;
        row[3] = PRODUCT.vendor;
        row[4] = PRODUCT.productCategory;
        row[5] = PRODUCT.type;
        row[6] = PRODUCT.tags;
        row[7] = 'TRUE';
        row[8] = 'Active';
        row[40] = 'FALSE';
        row[41] = PRODUCT.seoTitle;
        row[42] = PRODUCT.seoDescription;
        row[43] = color.metafield;
        row[44] = 'Apparel & Accessories > Clothing > Shirts & Tops';
        row[45] = 'Unisex';
        row[46] = 'Adult (13+ years old)';
        row[49] = 'New';
        row[50] = 'FALSE';
        row[51] = 'Performance';
        isFirst = false;
      } else {
        row[1] = PRODUCT.handle;
      }

      row[9] = sku;
      row[10] = String(barcodeBase++);
      row[11] = 'Color';
      row[12] = color.name;
      row[13] = 'product.metafields.shopify.color-pattern';
      row[14] = 'Size';
      row[15] = size;
      row[20] = PRODUCT.price;
      row[21] = PRODUCT.compareAtPrice;
      row[22] = PRODUCT.cost;
      row[23] = 'TRUE';
      row[29] = 'shopify';
      row[30] = String(PRODUCT.inventory[size]);
      row[31] = 'DENY';
      row[32] = String(PRODUCT.weightGrams[size]);
      row[33] = 'g';
      row[34] = 'TRUE';
      row[35] = 'manual';

      if (rows.length === 1) {
        row[36] = mainImage.url;
        row[37] = '1';
        row[38] = mainImage.alt;
      }

      row[39] = variantImage;
      rows.push(row);
    }
  }

  // Additional product images on separate rows (Shopify CSV pattern)
  for (let i = 1; i < uploadedImages.length; i++) {
    const img = uploadedImages[i];
    const meta = IMAGE_FILES[i];
    const row = new Array(header.length).fill('');
    row[1] = PRODUCT.handle;
    row[36] = img.url;
    row[37] = String(meta.position);
    row[38] = img.alt;
    rows.push(row);
  }

  return rows.map((row) => row.map(csvEscape).join(',')).join('\n');
}

async function createProduct(shop, token, uploadedImages) {
  const variants = [];
  for (const color of PRODUCT.colors) {
    for (const size of PRODUCT.sizes) {
      variants.push({
        optionValues: [
          {optionName: 'Color', name: color.name},
          {optionName: 'Size', name: size},
        ],
        price: PRODUCT.price,
        compareAtPrice: PRODUCT.compareAtPrice,
        sku: `AURALITE-${color.skuCode}-${size}`,
        inventoryQuantities: [
          {
            locationId: await getPrimaryLocationId(shop, token),
            availableQuantity: PRODUCT.inventory[size],
          },
        ],
      });
    }
  }

  const data = await adminGraphql(
    shop,
    token,
    `mutation productSet($input: ProductSetInput!, $synchronous: Boolean!) {
      productSet(input: $input, synchronous: $synchronous) {
        product {
          id
          handle
          title
          onlineStoreUrl
        }
        userErrors { field message }
      }
    }`,
    {
      synchronous: true,
      input: {
        title: PRODUCT.title,
        handle: PRODUCT.handle,
        descriptionHtml: PRODUCT.description,
        vendor: PRODUCT.vendor,
        productType: PRODUCT.type,
        tags: PRODUCT.tags.split(', '),
        status: 'ACTIVE',
        productOptions: [
          {name: 'Color', values: PRODUCT.colors.map((c) => ({name: c.name}))},
          {name: 'Size', values: PRODUCT.sizes.map((s) => ({name: s}))},
        ],
        variants,
        files: uploadedImages.map((img, i) => ({
          originalSource: img.url,
          alt: img.alt,
          contentType: 'IMAGE',
          duplicateResolutionMode: 'REPLACE',
        })),
      },
    },
  );

  const errors = data.productSet.userErrors;
  if (errors?.length) throw new Error(`productSet: ${JSON.stringify(errors)}`);
  return data.productSet.product;
}

let cachedLocationId = null;
async function getPrimaryLocationId(shop, token) {
  if (cachedLocationId) return cachedLocationId;
  const data = await adminGraphql(
    shop,
    token,
    `{ locations(first: 1) { nodes { id } } }`,
  );
  cachedLocationId = data.locations.nodes[0]?.id;
  if (!cachedLocationId) throw new Error('No inventory location found');
  return cachedLocationId;
}

async function main() {
  const env = loadEnv();
  const shop = env.PUBLIC_STORE_DOMAIN;
  const token = env.SHOPIFY_ADMIN_ACCESS_TOKEN || env.PRIVATE_STOREFRONT_API_TOKEN;
  if (!shop || !token) {
    throw new Error(
      'Missing PUBLIC_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN in .env (Admin token needs write_products + write_files scopes)',
    );
  }

  console.log(`Shop: ${shop}`);
  console.log('Uploading images to Shopify...');

  const uploadedImages = [];
  for (const img of IMAGE_FILES) {
    const filePath = join(IMAGES_DIR, img.file);
    if (!existsSync(filePath)) throw new Error(`Image not found: ${filePath}`);
    process.stdout.write(`  → ${img.file}... `);
    const result = await uploadImage(shop, token, filePath, img.alt);
    uploadedImages.push(result);
    console.log('done');
    console.log(`    ${result.url}`);
  }

  console.log('\nGenerating CSV import file...');
  const csv = buildCsvRows(uploadedImages);
  writeFileSync(OUTPUT_CSV, csv, 'utf8');
  console.log(`CSV saved: ${OUTPUT_CSV}`);

  console.log('\nCreating product via Admin API...');
  const product = await createProduct(shop, token, uploadedImages);
  console.log(`Product created: ${product.title}`);
  console.log(`Handle: ${product.handle}`);
  console.log(`ID: ${product.id}`);
  if (product.onlineStoreUrl) console.log(`URL: ${product.onlineStoreUrl}`);

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
