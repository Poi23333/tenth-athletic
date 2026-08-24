import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  useRouteLoaderData,
} from 'react-router';
import {useEffect, useId, useState, type ReactNode} from 'react';
import type {Route} from './+types/account.addresses';
import {
  CREATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import type {RootLoader} from '~/root';

export type ActionResponse = {
  addressId?: string | null;
  error: string | null;
  success: 'created' | 'updated' | 'deleted' | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Addresses'}];
};

export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: 'Unauthorized', success: null, addressId},
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        const {data: mutationData, errors} = await customerAccount.mutate(
          CREATE_ADDRESS_MUTATION,
          {
            variables: {
              address,
              defaultAddress,
              language: customerAccount.i18n.language,
            },
          },
        );

        if (errors?.length) {
          throw new Error(errors[0].message);
        }

        if (mutationData?.customerAddressCreate?.userErrors?.length) {
          throw new Error(
            mutationData.customerAddressCreate.userErrors[0].message,
          );
        }

        if (!mutationData?.customerAddressCreate?.customerAddress) {
          throw new Error('Customer address create failed.');
        }

        return {error: null, success: 'created' as const, addressId};
      }

      case 'PUT': {
        const {data: mutationData, errors} = await customerAccount.mutate(
          UPDATE_ADDRESS_MUTATION,
          {
            variables: {
              address,
              addressId: decodeURIComponent(addressId),
              defaultAddress,
              language: customerAccount.i18n.language,
            },
          },
        );

        if (errors?.length) {
          throw new Error(errors[0].message);
        }

        if (mutationData?.customerAddressUpdate?.userErrors?.length) {
          throw new Error(
            mutationData.customerAddressUpdate.userErrors[0].message,
          );
        }

        if (!mutationData?.customerAddressUpdate?.customerAddress) {
          throw new Error('Customer address update failed.');
        }

        return {error: null, success: 'updated' as const, addressId};
      }

      case 'DELETE': {
        const {data: mutationData, errors} = await customerAccount.mutate(
          DELETE_ADDRESS_MUTATION,
          {
            variables: {
              addressId: decodeURIComponent(addressId),
              language: customerAccount.i18n.language,
            },
          },
        );

        if (errors?.length) {
          throw new Error(errors[0].message);
        }

        if (mutationData?.customerAddressDelete?.userErrors?.length) {
          throw new Error(
            mutationData.customerAddressDelete.userErrors[0].message,
          );
        }

        if (!mutationData?.customerAddressDelete?.deletedAddressId) {
          throw new Error('Customer address delete failed.');
        }

        return {error: null, success: 'deleted' as const, addressId};
      }

      default: {
        return data(
          {error: 'Method not allowed', success: null, addressId},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Address update failed.';
    return data(
      {error: message, success: null},
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;
  const action = useActionData<ActionResponse>();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const countries =
    rootData?.localization?.localization?.availableCountries ?? [];
  const currentCountry =
    rootData?.localization?.localization?.country?.isoCode ?? '';

  const successMessage =
    action?.success === 'created'
      ? 'Address created.'
      : action?.success === 'updated'
        ? 'Address saved.'
        : action?.success === 'deleted'
          ? 'Address deleted.'
          : null;

  return (
    <div className="account-addresses">
      <h2>Addresses</h2>
      {action?.error ? (
        <p className="account-feedback account-feedback--error">{action.error}</p>
      ) : null}
      {successMessage ? (
        <p className="account-feedback account-feedback--success">
          {successMessage}
        </p>
      ) : null}

      <section className="account-address-create">
        <h3>New address</h3>
        <NewAddressForm
          countries={countries}
          defaultTerritoryCode={currentCountry}
          key={addresses.nodes.length}
        />
      </section>

      <section>
        <h3>Saved addresses</h3>
        {!addresses.nodes.length ? (
          <p className="account-empty">You have no addresses saved.</p>
        ) : (
          <div className="account-address-list">
            {addresses.nodes.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                countries={countries}
                isDefault={defaultAddress?.id === address.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function NewAddressForm({
  countries,
  defaultTerritoryCode,
}: {
  countries: CountryOption[];
  defaultTerritoryCode: string;
}) {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: defaultTerritoryCode,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } satisfies CustomerAddressInput;

  return (
    <AddressForm
      address={newAddress}
      addressId="NEW_ADDRESS_ID"
      countries={countries}
      isDefault={false}
      method="POST"
      submitLabel="Create"
      submittingLabel="Creating"
    />
  );
}

function AddressCard({
  address,
  countries,
  isDefault,
}: {
  address: AddressFragment;
  countries: CountryOption[];
  isDefault: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const action = useActionData<ActionResponse>();
  const {formMethod} = useNavigation();
  const isDeleting = formMethod === 'DELETE';

  useEffect(() => {
    if (action?.success === 'updated' && action.addressId === address.id) {
      setEditing(false);
    }
  }, [action, address.id]);

  const lines = Array.isArray(address.formatted)
    ? address.formatted
    : address.formatted
      ? [address.formatted]
      : [];

  return (
    <article className="account-address-card">
      {isDefault ? <p className="account-badge">Default</p> : null}
      <address>
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </address>
      {editing ? (
        <AddressForm
          address={address}
          addressId={address.id}
          countries={countries}
          isDefault={isDefault}
          method="PUT"
          onCancel={() => setEditing(false)}
          submitLabel="Save"
          submittingLabel="Saving"
        />
      ) : (
        <div className="account-actions">
          <button
            className="account-text-button"
            type="button"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <Form method="DELETE">
            <input type="hidden" name="addressId" value={address.id} />
            <button
              className="account-text-button"
              disabled={isDeleting}
              type="submit"
            >
              {isDeleting ? 'Deleting' : 'Delete'}
            </button>
          </Form>
        </div>
      )}
    </article>
  );
}

type CountryOption = {
  isoCode: string;
  name: string;
};

function AddressForm({
  address,
  addressId,
  countries,
  isDefault,
  method,
  onCancel,
  submitLabel,
  submittingLabel,
}: {
  address: CustomerAddressInput;
  addressId: string;
  countries: CountryOption[];
  isDefault: boolean;
  method: 'POST' | 'PUT';
  onCancel?: () => void;
  submitLabel: string;
  submittingLabel: string;
}) {
  const formId = useId();
  const {formMethod} = useNavigation();
  const isSubmitting = formMethod === method;
  const selectedCountry = address.territoryCode ?? '';
  const hasSelectedCountry = countries.some(
    (country) => country.isoCode === selectedCountry,
  );

  return (
    <Form className="account-form" id={formId} method={method}>
      <input type="hidden" name="addressId" value={addressId} />
      <fieldset>
        <Field id={`${formId}-firstName`} label="First name" required>
          <input
            autoComplete="given-name"
            defaultValue={address.firstName ?? ''}
            id={`${formId}-firstName`}
            name="firstName"
            required
            type="text"
          />
        </Field>
        <Field id={`${formId}-lastName`} label="Last name" required>
          <input
            autoComplete="family-name"
            defaultValue={address.lastName ?? ''}
            id={`${formId}-lastName`}
            name="lastName"
            required
            type="text"
          />
        </Field>
        <Field id={`${formId}-company`} label="Company">
          <input
            autoComplete="organization"
            defaultValue={address.company ?? ''}
            id={`${formId}-company`}
            name="company"
            type="text"
          />
        </Field>
        <Field id={`${formId}-address1`} label="Address line 1" required>
          <input
            autoComplete="address-line1"
            defaultValue={address.address1 ?? ''}
            id={`${formId}-address1`}
            name="address1"
            required
            type="text"
          />
        </Field>
        <Field id={`${formId}-address2`} label="Address line 2">
          <input
            autoComplete="address-line2"
            defaultValue={address.address2 ?? ''}
            id={`${formId}-address2`}
            name="address2"
            type="text"
          />
        </Field>
        <Field id={`${formId}-city`} label="City" required>
          <input
            autoComplete="address-level2"
            defaultValue={address.city ?? ''}
            id={`${formId}-city`}
            name="city"
            required
            type="text"
          />
        </Field>
        <Field id={`${formId}-zoneCode`} label="State" required>
          <input
            autoComplete="address-level1"
            defaultValue={address.zoneCode ?? ''}
            id={`${formId}-zoneCode`}
            name="zoneCode"
            required
            type="text"
          />
        </Field>
        <Field id={`${formId}-zip`} label="Postal code" required>
          <input
            autoComplete="postal-code"
            defaultValue={address.zip ?? ''}
            id={`${formId}-zip`}
            name="zip"
            required
            type="text"
          />
        </Field>
        <Field id={`${formId}-territoryCode`} label="Country" required>
          <select
            autoComplete="country"
            defaultValue={selectedCountry}
            id={`${formId}-territoryCode`}
            name="territoryCode"
            required
          >
            <option value="">Select country</option>
            {!hasSelectedCountry && selectedCountry ? (
              <option value={selectedCountry}>{selectedCountry}</option>
            ) : null}
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${formId}-phoneNumber`} label="Phone">
          <input
            autoComplete="tel"
            defaultValue={address.phoneNumber ?? ''}
            id={`${formId}-phoneNumber`}
            name="phoneNumber"
            pattern="^\+?[1-9]\d{3,14}$"
            type="tel"
          />
        </Field>
        <div className="account-checkbox">
          <input
            defaultChecked={isDefault}
            id={`${formId}-defaultAddress`}
            name="defaultAddress"
            type="checkbox"
          />
          <label htmlFor={`${formId}-defaultAddress`}>
            Set as default address
          </label>
        </div>
      </fieldset>
      <div className="account-actions">
        <button className="account-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
        {onCancel ? (
          <button
            className="account-text-button"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </Form>
  );
}

function Field({
  children,
  id,
  label,
  required,
}: {
  children: ReactNode;
  id: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="account-field" htmlFor={id}>
      <span>
        {label}
        {required ? '*' : ''}
      </span>
      {children}
    </label>
  );
}
