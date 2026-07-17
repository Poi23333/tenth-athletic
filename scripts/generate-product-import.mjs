#!/usr/bin/env node
/**
 * Generate Shopify product CSV import file and ZIP bundle.
 * Images in the ZIP are uploaded to Shopify CDN during Admin import.
 */
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execSync} from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMAGES_DIR = join(ROOT, 'data/product-import/images');
const OUTPUT_DIR = join(ROOT, 'data/product-import');
const CSV_NAME = 'auralite-performance-t-shirt.csv';
const ZIP_NAME = 'auralite-performance-t-shirt-import.zip';

const IMAGE_URLS = {
  'product-1-back.png':
    'https://cdn.shopify.com/s/files/1/1002/1620/9782/files/product-1-back.png?v=1784190494',
  'product-1-front.png':
    'https://cdn.shopify.com/s/files/1/1002/1620/9782/files/product-1-front.png?v=1784190506',
  'product-2-label.png':
    'https://cdn.shopify.com/s/files/1/1002/1620/9782/files/product-2-label.png?v=1784190585',
  'product-3-fabric.png':
    'https://cdn.shopify.com/s/files/1/1002/1620/9782/files/product-3-fabric.png?v=1784190570',
  'product-4-lifestyle.png':
    'https://cdn.shopify.com/s/files/1/1002/1620/9782/files/product-4-lifestyle.png?v=1784190505',
};

const PRODUCT = {
  title: 'AuraLite™ Performance T-Shirt',
  handle: 'auralite-performance-t-shirt',
  description:
    '<p>Lightweight performance tee built for training and everyday wear. Made from 100% recycled polyester with fast-dry, soft-touch fabric and moisture control.</p><ul><li>100% Recycled Polyester (AuraLite™)</li><li>Fast Dry &amp; Moisture Control</li><li>Soft Touch hand feel</li><li>Oversized boxy fit with dropped shoulders</li><li>Made in Portugal</li></ul>',
  vendor: 'Tenth Athletic',
  productCategory: 'Apparel & Accessories > Clothing > Clothing Tops > T-Shirts',
  type: 'T-Shirt',
  tags: 'Man, Woman, Accessories, New Arrivals, Running, Performance, Technical Wear, Recycled, T-Shirt',
  seoTitle: 'AuraLite™ Performance T-Shirt | Recycled Running Tee',
  seoDescription:
    'Technical running t-shirt in recycled AuraLite™ polyester. Fast-dry, moisture-wicking, soft touch. Available in Washed Charcoal and Olive Brown.',
  colors: [
    {name: 'Washed Charcoal', metafield: 'gray; black', skuCode: 'CHR', variantImage: IMAGE_URLS['product-1-back.png']},
    {name: 'Olive Brown', metafield: 'green; brown', skuCode: 'OLV', variantImage: IMAGE_URLS['product-4-lifestyle.png']},
  ],
  sizes: ['S', 'M', 'L', 'XL'],
  price: '89.00',
  compareAtPrice: '108.00',
  cost: '32.00',
  weightGrams: {S: 165, M: 178, L: 192, XL: 205},
  inventory: {S: 25, M: 40, L: 35, XL: 20},
};

const IMAGES = [
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

const HEADER = [
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
  'Collection',
];

function csvEscape(value) {
  if (value == null || value === '') return '';
  const str = String(value);
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function buildRows() {
  const rows = [HEADER];
  let barcodeBase = 5784401000;
  let isFirst = true;
  const mainImage = IMAGES.find((img) => img.isMain) ?? IMAGES[0];

  for (const color of PRODUCT.colors) {
    for (const size of PRODUCT.sizes) {
      const row = new Array(HEADER.length).fill('');

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
        row[43] = PRODUCT.colors.map((c) => c.metafield.split(';')[0]).join('; ');
        row[44] = 'Apparel & Accessories > Clothing > Shirts & Tops';
        row[45] = 'Unisex';
        row[46] = 'Adult (13+ years old)';
        row[49] = 'New';
        row[50] = 'FALSE';
        row[51] = 'Performance';
        row[55] = 'Man';
        row[36] = IMAGE_URLS[mainImage.file];
        row[37] = String(mainImage.position);
        row[38] = mainImage.alt;
        isFirst = false;
      } else {
        row[1] = PRODUCT.handle;
      }

      row[9] = `AURALITE-${color.skuCode}-${size}`;
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
      row[39] = color.variantImage;

      rows.push(row);
    }
  }

  for (const image of IMAGES) {
    if (image.isMain) continue;
    const row = new Array(HEADER.length).fill('');
    row[1] = PRODUCT.handle;
    row[36] = IMAGE_URLS[image.file];
    row[37] = String(image.position);
    row[38] = image.alt;
    rows.push(row);
  }

  for (const collection of ['Woman', 'Accessories', 'New Arrivals']) {
    const row = new Array(HEADER.length).fill('');
    row[1] = PRODUCT.handle;
    row[55] = collection;
    rows.push(row);
  }

  return rows;
}

function createZip(csvPath, zipPath) {
  const stagingDir = join(OUTPUT_DIR, '.zip-staging');
  mkdirSync(stagingDir, {recursive: true});

  const stagedCsv = join(stagingDir, CSV_NAME);
  writeFileSync(stagedCsv, readFileSync(csvPath));

  for (const image of IMAGES) {
    const src = join(IMAGES_DIR, image.file);
    if (!existsSync(src)) throw new Error(`Missing image: ${src}`);
    execSync(`cp "${src}" "${join(stagingDir, image.file)}"`);
  }

  // Shopify requires CSV + images at the ZIP root (no subfolder).
  execSync(`cd "${stagingDir}" && zip -q -X "${zipPath}" ./*`);
  execSync(`rm -rf "${stagingDir}"`);
}

function main() {
  for (const image of IMAGES) {
    const filePath = join(IMAGES_DIR, image.file);
    if (!existsSync(filePath)) {
      throw new Error(`Image not found: ${filePath}`);
    }
  }

  const rows = buildRows();
  const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n');
  const csvPath = join(OUTPUT_DIR, CSV_NAME);
  const zipPath = join(OUTPUT_DIR, ZIP_NAME);
  const downloadsCsv = `/Users/poi/Downloads/${CSV_NAME}`;
  const downloadsZip = `/Users/poi/Downloads/${ZIP_NAME}`;

  writeFileSync(csvPath, csv, 'utf8');
  createZip(csvPath, zipPath);
  writeFileSync(downloadsCsv, csv, 'utf8');
  execSync(`cp "${zipPath}" "${downloadsZip}"`);

  console.log('Product import files generated.');
  console.log(`CSV: ${csvPath}`);
  console.log(`ZIP: ${zipPath}`);
  console.log(`CSV (Downloads): ${downloadsCsv}`);
  console.log(`ZIP (Downloads): ${downloadsZip}`);
  console.log(`Variants: ${PRODUCT.colors.length} colors × ${PRODUCT.sizes.length} sizes = ${PRODUCT.colors.length * PRODUCT.sizes.length}`);
  console.log(`Main image (product-1): ${IMAGES.find((i) => i.isMain)?.file}`);
}

main();
