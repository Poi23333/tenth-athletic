#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs';

const templatePath = '/Users/poi/Downloads/product_template.csv';
const outputPath = '/Users/poi/Downloads/tenth/test_products.csv';
const imageSets = [
  {
    pattern: /Tee|Long Sleeve|Singlet|Tank|\bCrop\b/,
    urls: [
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/GreenTshirt01.jpg?v=1675455410',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/GreenTshirt02.jpg?v=1675455410',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/GreenWomensTshirt01.jpg?v=1675463247',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/PurpleWomensTshirt01.jpg?v=1675445666',
    ],
  },
  {
    pattern: /Short|Bike Short/,
    urls: [
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/GreenShorts.jpg?v=1675462426',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/ClayShorts.jpg?v=1675462426',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/OceanShorts.jpg?v=1675462426',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/PurpleShorts.jpg?v=1675462426',
    ],
  },
  {
    pattern: /Shell|Vest/,
    urls: [
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/GreenPufferjacket01.jpg?v=1675455364',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/ClayPufferjacket01.jpg?v=1675455364',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/OceanPufferjacket01.jpg?v=1675446974',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/GreenPuffer01.jpg?v=1675455329',
    ],
  },
  {
    pattern: /Slides|Sneakers/,
    urls: [
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/slides.jpg?v=1675447358',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/GreenCanvasSneaker01.jpg?v=1675454881',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/ClayCanvasSneaker01.jpg?v=1675454881',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/OceanCanvasSneaker01.jpg?v=1675446185',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/PurpleCanvasSneaker01.jpg?v=1675446185',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/RedCanvasSneaker01.jpg?v=1675446186',
    ],
  },
  {
    pattern: /Frontpack|Sling|Crossbody|Pack/,
    urls: [
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/GreenFrontpack.jpg?v=1675455064',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/ClayFrontpack.jpg?v=1675455064',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/OceanFrontpack.jpg?v=1675446346',
      'https://cdn.shopify.com/s/files/1/0688/1755/1382/products/PurpleFrontpack.jpg?v=1675446347',
    ],
  },
];

const headers = parseCsvLine(readFileSync(templatePath, 'utf8').split(/\r?\n/)[0]);
const sizeValues = ['S', 'M', 'L'];
const collectionProducts = [
  {
    audience: 'Man',
    collection: 'New Arrivals',
    tag: 'man-new-arrivals',
    products: [
      'Interval Training Tee',
      'Split Tempo Short',
      'Draft Run Tee',
      'Zone Bike Short',
      'Aero Long Sleeve',
      'Tempo Singlet',
    ],
  },
  {
    audience: 'Man',
    collection: 'Special Projects',
    tag: 'man-special-projects',
    products: [
      'Relay Weather Shell',
      'Studio Recovery Vest',
      'Stormline Shell',
      'Thermal Grid Vest',
      'City Pace Shell',
      'Meridian Warmup Vest',
    ],
  },
  {
    audience: 'Man',
    collection: 'Tops',
    tag: 'man-tops',
    products: [
      'Grid Long Sleeve',
      'Pace Singlet',
      'Core Training Tee',
      'Track Long Sleeve',
      'Motion Tee',
      'Race Day Singlet',
    ],
  },
  {
    audience: 'Man',
    collection: 'Accessories',
    tag: 'man-accessories',
    products: [
      'Recovery Slides',
      'Canvas Sneakers',
      'Utility Sling',
      'Transit Frontpack',
      'Crossbody Pack',
      'Travel Sling',
    ],
  },
  {
    audience: 'Woman',
    collection: 'New Arrivals',
    tag: 'woman-new-arrivals',
    products: [
      'Aero Training Tee',
      'Stride Bike Short',
      'Drift Crop Tee',
      'Flow Tempo Short',
      'Pulse Tank',
      'Sculpt Long Sleeve',
    ],
  },
  {
    audience: 'Woman',
    collection: 'Special Projects',
    tag: 'woman-special-projects',
    products: [
      'Relay Cropped Shell',
      'Studio Warmup Vest',
      'Cloudbreak Shell',
      'Rest Day Vest',
      'Rainline Shell',
      'Packable Trail Vest',
    ],
  },
  {
    audience: 'Woman',
    collection: 'Tops',
    tag: 'woman-tops',
    products: [
      'Grid Crop Long Sleeve',
      'Pace Tank',
      'Core Crop Tee',
      'Studio Long Sleeve',
      'Featherweight Tank',
      'Race Crop',
    ],
  },
  {
    audience: 'Woman',
    collection: 'Accessories',
    tag: 'woman-accessories',
    products: [
      'Recovery Slides',
      'Canvas Sneakers',
      'Utility Crossbody',
      'Commuter Frontpack',
      'Studio Crossbody',
      'Mini Sling',
    ],
  },
];

const rows = [];
let productIndex = 1;

for (const group of collectionProducts) {
  for (const productName of group.products) {
    const title = `Tenth ${group.audience} ${productName}`;
    const handle = slugify(title);
    const color = group.audience === 'Man' ? 'black' : 'white';
    const images = getImagesForProduct(productName);
    const imageOffset = (productIndex - 1) % images.length;
    const price = productName.match(/Shell|Vest|Sling|Crossbody|Frontpack|Pack/)
      ? '128.00'
      : productName.match(/Short/)
        ? '78.00'
        : productName.match(/Slides|Sneakers/)
          ? '88.00'
          : '68.00';
    const compareAtPrice = (Number(price) + 20).toFixed(2);
    const cost = (Number(price) * 0.42).toFixed(2);
    const baseTags = [
      'test-data',
      group.audience.toLowerCase(),
      group.collection.toLowerCase().replace(/\s+/g, '-'),
      group.tag,
    ].join(', ');

    sizeValues.forEach((size, variantIndex) => {
      const row = emptyRow();
      const sku = `TA-${String(productIndex).padStart(3, '0')}-${size}`;

      row['URL handle'] = handle;
      row['SKU'] = sku;
      row['Barcode'] = `${880010000000 + productIndex * 10 + variantIndex}`;
      row['Option1 name'] = variantIndex === 0 ? 'Size' : '';
      row['Option1 value'] = size;
      row['Option2 name'] = variantIndex === 0 ? 'Color' : '';
      row['Option2 value'] = color;
      row['Price'] = price;
      row['Compare-at price'] = compareAtPrice;
      row['Cost per item'] = cost;
      row['Charge tax'] = 'TRUE';
      row['Inventory tracker'] = 'shopify';
      row['Inventory quantity'] = `${18 + variantIndex * 4}`;
      row['Continue selling when out of stock'] = 'DENY';
      row['Weight value (grams)'] = '220';
      row['Weight unit for display'] = 'g';
      row['Requires shipping'] = 'TRUE';
      row['Fulfillment service'] = 'manual';
      row['Gift card'] = 'FALSE';
      row['Variant image URL'] =
        images[(imageOffset + variantIndex) % images.length];
      row['Google Shopping / Condition'] = 'New';
      row['Google Shopping / Custom product'] = 'FALSE';

      if (variantIndex === 0) {
        row['Title'] = title;
        row['Description'] =
          `Test product for ${group.audience} ${group.collection}. Built for storefront QA, menu routing, collection listing, and product-card layout checks.`;
        row['Vendor'] = 'Tenth Athletic';
        row['Product category'] = productName.match(/Slides|Sneakers/)
          ? 'Apparel & Accessories > Shoes'
          : productName.match(/Sling|Crossbody|Frontpack|Pack/)
              && !productName.match(/Shell|Vest/)
            ? 'Apparel & Accessories > Handbags, Wallets & Cases'
            : 'Apparel & Accessories > Clothing';
        row['Type'] = group.collection;
        row['Tags'] = baseTags;
        row['Published on online store'] = 'TRUE';
        row['Status'] = 'Active';
        row['Product image URL'] = images[imageOffset];
        row['Image position'] = '1';
        row['Image alt text'] = `${title} test product image`;
        row['SEO title'] = `${title} | Tenth Athletic`;
        row['SEO description'] =
          `${title} is test catalog data for Hydrogen storefront collection and menu QA.`;
        row['Color (product.metafields.shopify.color-pattern)'] = color;
        row['Google Shopping / Gender'] =
          group.audience === 'Man' ? 'Male' : 'Female';
        row['Google Shopping / Age group'] = 'Adult (13+ years old)';
        row['Google Shopping / Manufacturer part number (MPN)'] = sku;
        row['Google Shopping / Ad group name'] = group.collection;
        row['Google Shopping / Ads labels'] = 'test-data';
        row['Google Shopping / Custom label 0'] = group.tag;
        row['Google Shopping / Custom label 1'] = group.audience;
        row['Google Shopping / Custom label 2'] = group.collection;
      }

      rows.push(row);
    });

    productIndex += 1;
  }
}

const csv = [
  headers.map(escapeCsvValue).join(','),
  ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(',')),
].join('\n');

writeFileSync(outputPath, `${csv}\n`);
// eslint-disable-next-line no-console
console.log(outputPath);

function emptyRow() {
  return Object.fromEntries(headers.map((header) => [header, '']));
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getImagesForProduct(productName) {
  const imageSet = imageSets.find(({pattern}) => pattern.test(productName));

  if (!imageSet) {
    throw new Error(`No image set configured for product: ${productName}`);
  }

  return imageSet.urls;
}

function escapeCsvValue(value = '') {
  const stringValue = String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}
