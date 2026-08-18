import {Link, useLoaderData, data, type HeadersFunction} from 'react-router';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import {COMPLIMENTARY_DELIVERY, RETURNS_30_DAYS} from '~/data/supportBenefits';
import brandLogo from '~/assets/logo.svg';

export const meta: Route.MetaFunction = () => {
  return [{title: `Basket | Tenth Athletic`}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();

  return (
    <div className="cart-page">
      <header className="cart-page-header">
        <Link to="/" aria-label="Tenth Athletic home">
          <img src={brandLogo} alt="Tenth Athletic" />
        </Link>
        <ol className="cart-checkout-progress" aria-label="Checkout progress">
          <li aria-current="step">
            <span>1</span> Basket
          </li>
          <li>
            <span>2</span> Details
          </li>
          <li>
            <span>3</span> Shipping
          </li>
          <li>
            <span>4</span> Payment
          </li>
        </ol>
      </header>
      <div className="cart-page-grid">
        <CartMain layout="page" cart={cart} />
        <CartSupport />
      </div>
    </div>
  );
}

function CartSupport() {
  return (
    <aside className="cart-support" aria-labelledby="cart-support-title">
      <div className="cart-support-contact">
        <h2 id="cart-support-title">Support for the miles ahead →</h2>
        <p>
          <strong>Need Help?</strong>
        </p>
        <a href="mailto:clientservices@tenthathletic.com">
          Clientservices@tenthathletic.com
        </a>
        <h3>UK delivery &amp; returns</h3>
        <p>Free standard delivery on UK orders over £150.</p>
        <p>Free returns on all UK orders.</p>
      </div>
      <SupportItem image={RETURNS_30_DAYS.image} title={RETURNS_30_DAYS.title}>
        {RETURNS_30_DAYS.description}
      </SupportItem>
      <SupportItem
        image={COMPLIMENTARY_DELIVERY.image}
        title={COMPLIMENTARY_DELIVERY.title}
      >
        {COMPLIMENTARY_DELIVERY.description}
      </SupportItem>
      <SupportItem
        image="/images/cart/distance-programme.svg"
        title="Back to Distance Programme"
      >
        Damaged your equipment in an accident? We&apos;ll help get you back out
        there.
      </SupportItem>
    </aside>
  );
}

function SupportItem({
  image,
  title,
  children,
}: {
  image: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cart-support-item">
      <img src={image} alt="" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{children}</p>
    </section>
  );
}
