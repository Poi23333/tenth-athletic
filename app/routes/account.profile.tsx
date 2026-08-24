import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type {Route} from './+types/account.profile';

export type ActionResponse = {
  error: string | null;
  success: boolean;
  customer: {
    firstName?: string | null;
    lastName?: string | null;
    emailAddress?: {emailAddress?: string | null} | null;
    phoneNumber?: {phoneNumber?: string | null} | null;
  } | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data(
      {error: 'Method not allowed', success: false, customer: null},
      {status: 405},
    );
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const firstName = form.get('firstName');
    const lastName = form.get('lastName');
    if (typeof firstName === 'string' && firstName.length) {
      customer.firstName = firstName;
    }
    if (typeof lastName === 'string' && lastName.length) {
      customer.lastName = lastName;
    }

    const {data: mutationData, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!mutationData?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    if (mutationData.customerUpdate.userErrors?.length) {
      throw new Error(mutationData.customerUpdate.userErrors[0].message);
    }

    return {
      error: null,
      success: true,
      customer: mutationData.customerUpdate.customer,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Customer profile update failed.';
    return data(
      {error: message, success: false, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = {
    ...account.customer,
    ...action?.customer,
    emailAddress:
      action?.customer?.emailAddress ?? account.customer.emailAddress,
    phoneNumber: action?.customer?.phoneNumber ?? account.customer.phoneNumber,
  };

  return (
    <div className="account-profile">
      <h2>Profile</h2>
      <Form
        className="account-form"
        key={`${customer.firstName}-${customer.lastName}`}
        method="PUT"
      >
        <fieldset>
          <legend>Personal information</legend>
          <label className="account-field">
            <span>First name</span>
            <input
              id="account-firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              aria-label="First name"
              defaultValue={customer.firstName ?? ''}
              minLength={2}
            />
          </label>
          <label className="account-field">
            <span>Last name</span>
            <input
              id="account-lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              aria-label="Last name"
              defaultValue={customer.lastName ?? ''}
              minLength={2}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Contact</legend>
          <div className="account-readonly">
            <span>Email</span>
            <p>{customer.emailAddress?.emailAddress || 'Not provided'}</p>
          </div>
          <div className="account-readonly">
            <span>Phone</span>
            <p>{customer.phoneNumber?.phoneNumber || 'Not provided'}</p>
          </div>
        </fieldset>

        {action?.error ? (
          <p className="account-feedback account-feedback--error">{action.error}</p>
        ) : null}
        {action?.success ? (
          <p className="account-feedback account-feedback--success">
            Profile updated.
          </p>
        ) : null}

        <div className="account-actions">
          <button
            className="account-button"
            type="submit"
            disabled={state !== 'idle'}
          >
            {state !== 'idle' ? 'Updating' : 'Update'}
          </button>
        </div>
      </Form>
    </div>
  );
}
