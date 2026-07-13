import type {ReactNode} from 'react';
import {InfoPageAccordion} from '~/components/InfoPage';

export type InfoPageDefinition = {
  title: string;
  wide?: boolean;
  content: ReactNode;
};

type ShippingRate = {
  service: string;
  rate: string;
  estimatedDelivery: string;
};

type ShippingRegion = {
  title: string;
  note?: string;
  rates: ShippingRate[];
};

const SHIPPING_REGIONS: ShippingRegion[] = [
  {
    title: 'United Kingdom',
    note: 'Complimentary Standard Tracked shipping is available on UK orders over £150.',
    rates: [
      {
        service: 'Standard Tracked',
        rate: '£5',
        estimatedDelivery: '2–4 business days after dispatch',
      },
      {
        service: 'Express Tracked',
        rate: '£8',
        estimatedDelivery: '1–2 business days after dispatch',
      },
    ],
  },
  {
    title: 'Europe',
    note: 'Complimentary Standard Tracked shipping is available on Europe orders over £250.',
    rates: [
      {
        service: 'Standard Tracked',
        rate: '£15',
        estimatedDelivery: '4–8 business days after dispatch',
      },
      {
        service: 'Express Tracked',
        rate: '£25',
        estimatedDelivery: '2–4 business days after dispatch',
      },
    ],
  },
  {
    title: 'United States, Canada & Mexico',
    rates: [
      {
        service: 'Standard Tracked',
        rate: '£20',
        estimatedDelivery: '5–10 business days after dispatch',
      },
      {
        service: 'Express Tracked',
        rate: '£30',
        estimatedDelivery: '2–5 business days after dispatch',
      },
    ],
  },
  {
    title: 'Asia',
    note:
      'Includes China, Hong Kong, Japan, South Korea, Singapore, Taiwan, Thailand and Indonesia.',
    rates: [
      {
        service: 'Standard Tracked',
        rate: '£22',
        estimatedDelivery: '5–12 business days after dispatch',
      },
      {
        service: 'Express Tracked',
        rate: '£35',
        estimatedDelivery: '3–6 business days after dispatch',
      },
    ],
  },
  {
    title: 'Middle East, Australia & New Zealand',
    note:
      'Includes Australia, New Zealand, United Arab Emirates, Saudi Arabia, Qatar and Israel.',
    rates: [
      {
        service: 'Standard Tracked',
        rate: '£25',
        estimatedDelivery: '6–14 business days after dispatch',
      },
      {
        service: 'Express Tracked',
        rate: '£40',
        estimatedDelivery: '3–7 business days after dispatch',
      },
    ],
  },
  {
    title: 'Rest of World',
    rates: [
      {
        service: 'Standard Tracked',
        rate: '£30',
        estimatedDelivery: 'Estimated at checkout or after dispatch',
      },
      {
        service: 'Express Tracked',
        rate: '£45',
        estimatedDelivery: 'Estimated at checkout or after dispatch',
      },
    ],
  },
];

function ShippingRatesTable({rates}: {rates: ShippingRate[]}) {
  return (
    <table className="info-page-table">
      <thead>
        <tr>
          <th scope="col">Service</th>
          <th scope="col">Rate</th>
          <th scope="col">Estimated Delivery</th>
        </tr>
      </thead>
      <tbody>
        {rates.map((rate) => (
          <tr key={`${rate.service}-${rate.rate}`}>
            <td>{rate.service}</td>
            <td>{rate.rate}</td>
            <td>{rate.estimatedDelivery}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const INFO_PAGES: Record<string, InfoPageDefinition> = {
  'customer-service': {
    title: 'Customer Service',
    content: (
      <>
        <p>
          For questions about orders, products, sizing, shipping, returns, or
          general enquiries, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> [customer service email]
        </p>
        <p>We aim to respond to all enquiries within 2–3 working days.</p>
        <p>
          If your enquiry relates to an existing order, please include your
          order number, full name, and the email address used at checkout so we
          can help you more efficiently.
        </p>
      </>
    ),
  },

  'shipping-returns': {
    title: 'Shipping & Returns',
    wide: true,
    content: (
      <div className="info-page-accordions">
        <InfoPageAccordion defaultOpen title="Shipping: Time & Regions">
          <h2 className="info-page-heading">Shipping Policy</h2>
          <p>All orders ship from London, United Kingdom.</p>
          <p>
            Orders are normally prepared and dispatched within 2–4 business
            days. Once your order has shipped, you will receive a confirmation
            email with tracking information.
          </p>
          <p>
            Delivery times are estimates and may vary due to customs
            processing, local carrier delays, public holidays, weather
            conditions, or circumstances outside our control.
          </p>

          {SHIPPING_REGIONS.map((region) => (
            <section className="info-page-region" key={region.title}>
              <h3 className="info-page-region-title">{region.title}</h3>
              {region.note ? (
                <p className="info-page-region-note">{region.note}</p>
              ) : null}
              <ShippingRatesTable rates={region.rates} />
            </section>
          ))}

          <h2 className="info-page-heading">Duties & Taxes</h2>
          <p>
            International duties, import taxes, VAT, customs fees and brokerage
            charges may be applied by the destination country.
          </p>
          <p>
            These charges are calculated according to the destination, order
            value, product classification and country of origin. They are the
            responsibility of the customer unless otherwise stated at checkout.
          </p>
          <p>
            If duties and taxes are collected at checkout, this will be clearly
            shown before payment. If they are not collected at checkout, the
            customer may be required to pay them directly to the courier or
            local customs authority before delivery.
          </p>
          <p>
            Tenth Athletic is not responsible for delays caused by customs
            checks or unpaid import charges.
          </p>

          <h2 className="info-page-heading">
            Failed Delivery or Refused Parcels
          </h2>
          <p>
            If a parcel is returned to us because of an incorrect address,
            failed delivery attempt, refusal to pay import charges, or failure
            to collect from the courier, any return shipping costs, duties,
            taxes or courier fees may be deducted from the refund.
          </p>
          <p>
            Original shipping fees are non-refundable unless the item is faulty
            or incorrect.
          </p>
        </InfoPageAccordion>

        <InfoPageAccordion defaultOpen title="Online returns">
          <ul className="info-page-returns-list">
            <li>We accept returns within 14 days of delivery</li>
            <li>
              Simply enter on My Account or click{' '}
              <a href="/account">here</a>
            </li>
            <li>
              Return shipping costs are the responsibility of the customer
              unless the item is faulty, damaged, or incorrect.
            </li>
            <li>
              Returned items must be unworn, unwashed, and in their original
              condition with all tags attached.
            </li>
          </ul>
        </InfoPageAccordion>
      </div>
    ),
  },

  faq: {
    title: 'FAQ',
    content: (
      <div className="info-page-faq">
        <div className="info-page-faq-item">
          <h2 className="info-page-faq-question">
            Where does Tenth Athletic ship from?
          </h2>
          <p className="info-page-faq-answer">
            We ship from the United Kingdom.
          </p>
        </div>

        <div className="info-page-faq-item">
          <h2 className="info-page-faq-question">How do I choose my size?</h2>
          <p className="info-page-faq-answer">
            Please refer to the size guide on each product page. If you are
            between sizes or unsure, contact us and we will help you choose.
          </p>
        </div>

        <div className="info-page-faq-item">
          <h2 className="info-page-faq-question">Can I return an item?</h2>
          <p className="info-page-faq-answer">
            Yes. Eligible items can be returned within 14 days of delivery,
            provided they are unworn, unwashed, and in original condition with
            tags attached. See Shipping & Returns for full details.
          </p>
        </div>

        <div className="info-page-faq-item">
          <h2 className="info-page-faq-question">
            When will SS27 products be available?
          </h2>
          <p className="info-page-faq-answer">
            Selected SS27 pieces may be previewed ahead of wider release.
            Availability will be shared on product pages and through our
            channels as drops are confirmed.
          </p>
        </div>

        <div className="info-page-faq-item">
          <h2 className="info-page-faq-question">
            How do I join Quiet Miles or product testing?
          </h2>
          <p className="info-page-faq-answer">
            Future community runs, field tests, and product feedback sessions
            will be announced through our channels. Follow us for updates.
          </p>
        </div>

        <div className="info-page-faq-item">
          <h2 className="info-page-faq-question">
            Do you offer international shipping?
          </h2>
          <p className="info-page-faq-answer">
            International shipping availability, cost, and delivery estimates
            vary by destination. See Shipping & Returns for current rates and
            regions.
          </p>
        </div>

        <div className="info-page-faq-item">
          <h2 className="info-page-faq-question">
            How should I care for Tenth Athletic products?
          </h2>
          <p className="info-page-faq-answer">
            Always follow the care label on each garment. For general guidance,
            see our Care Guide.
          </p>
        </div>
      </div>
    ),
  },

  'terms-conditions': {
    title: 'Terms & Conditions',
    content: (
      <>
        <p>
          These Terms & Conditions apply to all purchases made through the Tenth
          Athletic online store. By placing an order, you agree to the terms set
          out below.
        </p>

        <h2 className="info-page-heading">Product information</h2>
        <p>
          We aim to describe products accurately, including materials, fit, and
          features. Images are for illustration; colour and detail may vary
          slightly depending on screen settings and production batches.
        </p>

        <h2 className="info-page-heading">Pricing and payment</h2>
        <p>
          Prices are shown in the currency selected for your region and include
          applicable taxes where stated. Payment is taken at checkout. We reserve
          the right to cancel orders placed at an incorrect price due to obvious
          error.
        </p>

        <h2 className="info-page-heading">Orders and fulfilment</h2>
        <p>
          Order confirmation does not guarantee stock. If an item becomes
          unavailable after purchase, we will contact you and offer a refund or
          suitable alternative where possible.
        </p>

        <h2 className="info-page-heading">Returns</h2>
        <p>
          Eligible returns are accepted within 14 days of delivery under the
          conditions described in Shipping & Returns. Sale, personalised, or
          final-sale items may be excluded where stated at purchase.
        </p>

        <h2 className="info-page-heading">Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, Tenth Athletic is not liable
          for indirect or consequential loss arising from use of the website or
          purchased products, except where liability cannot be excluded.
        </p>

        <h2 className="info-page-heading">Contact</h2>
        <p>
          For questions about these terms, contact us via the details on the
          Customer Service page.
        </p>
      </>
    ),
  },

  'privacy-cookie-policy': {
    title: 'Privacy & Cookie Policy',
    content: (
      <>
        <p>
          Tenth Athletic collects and processes personal data to operate this
          storefront, fulfil orders, and improve the shopping experience.
        </p>
        <p>
          Information we may collect includes name, email address, shipping and
          billing details, order history, and technical data such as device and
          browser information.
        </p>
        <p>
          We use this information to process purchases, provide customer
          support, prevent fraud, and—where you have opted in—send product or
          brand updates.
        </p>
        <p>
          We use cookies and similar technologies for essential site functions,
          analytics, and (where consented) marketing. You can manage non-essential
          cookies through the cookie banner or your browser settings.
        </p>
        <p>
          We do not sell personal data. Data may be shared with service providers
          who help us operate the store (for example payment, fulfilment, and
          analytics partners), only as needed to provide those services.
        </p>
        <p>
          To request access, correction, or deletion of your personal data, or
          to ask a privacy-related question, contact us at{' '}
          <strong>[privacy email]</strong>.
        </p>
        <p>
          This policy may be updated from time to time. The latest version will
          always be available on this page.
        </p>
      </>
    ),
  },

  'our-packaging': {
    title: 'Our Packaging',
    content: (
      <>
        <p>
          Tenth Athletic packaging is designed to protect products in transit
          while keeping materials as simple and useful as possible.
        </p>
        <p>
          We prioritise recyclable or reusable materials where suitable, and
          avoid unnecessary inserts, plastics, and single-use extras.
        </p>
        <p>
          Where a tote or reusable carrier is included, it is intended for
          continued use beyond delivery—not as disposable wrapping.
        </p>
        <p>
          As our supply chain develops, we will continue to reduce packaging
          volume and improve material clarity on this page.
        </p>
      </>
    ),
  },

  'care-guide': {
    title: 'Care Guide',
    content: (
      <>
        <p>
          Proper care extends the life of your Tenth Athletic products. Always
          check the care label on each garment, and use the guidance below as a
          general reference.
        </p>

        <h2 className="info-page-heading">General care guidance:</h2>
        <ul className="info-page-list">
          <li>Wash inside out with similar colours.</li>
          <li>Use a mild detergent and a cool or warm cycle as labelled.</li>
          <li>Do not bleach.</li>
          <li>Do not use fabric softener on technical fabrics.</li>
          <li>Air dry where possible.</li>
          <li>Avoid high-heat tumble drying unless the label allows it.</li>
          <li>Do not iron over prints, logos, or bonded details.</li>
        </ul>

        <h2 className="info-page-heading">Technical fabrics</h2>
        <p>
          Performance fabrics are built for repeated use in training and daily
          movement. Wash after heavy sessions, avoid overloading the machine, and
          skip softener so moisture management and stretch recovery stay
          effective over time.
        </p>

        <h2 className="info-page-heading">Storage</h2>
        <p>
          Store garments clean and dry. Fold knits and soft shells rather than
          hanging them for long periods when shape retention matters. Keep
          products away from prolonged direct sunlight when not in use.
        </p>
      </>
    ),
  },

  sustainability: {
    title: 'Sustainability',
    content: (
      <>
        <p>
          Tenth Athletic approaches sustainability through product purpose,
          material responsibility, and long-term use.
        </p>
        <p>
          We do not believe responsible design is only about using better
          materials. It is also about making fewer unnecessary decisions. Every
          panel, seam, pocket, trim, and material choice should have a reason.
        </p>
        <p>
          We are working to improve material traceability, increase the use of
          recycled or certified materials where suitable, reduce unnecessary
          packaging, and design products that remain useful beyond a single
          season.
        </p>
        <p>
          As our supply chain develops, we will continue to share clearer
          information about materials, construction, care, and product impact.
        </p>
        <p>
          Our approach is guided by the same principle that shapes our products:
          reduce what is unnecessary, and keep what performs over time.
        </p>
      </>
    ),
  },

  careers: {
    title: 'Careers',
    content: (
      <>
        <p>
          We are not listing open roles at the moment. When opportunities become
          available, they will be shared on this page.
        </p>
        <p>
          If you would like to introduce yourself for future consideration,
          contact us via Customer Service with a short note and relevant
          background.
        </p>
      </>
    ),
  },

  'store-locator': {
    title: 'Store Locator / Stockists',
    content: (
      <>
        <p>
          Tenth Athletic products are available through this online store.
          Selected stockists and physical locations will be listed here as they
          are confirmed.
        </p>
        <p>
          For wholesale or stockist enquiries, please contact us via Customer
          Service.
        </p>
      </>
    ),
  },
};

export function getInfoPage(handle: string): InfoPageDefinition | null {
  return INFO_PAGES[handle] ?? null;
}

export function isInfoPageHandle(handle: string): boolean {
  return handle in INFO_PAGES;
}
