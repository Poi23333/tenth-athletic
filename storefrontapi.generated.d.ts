/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'sku' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  parentRelationship?: StorefrontAPI.Maybe<{
    parent: Pick<StorefrontAPI.CartLine, 'id'>;
  }>;
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'sku' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  lineComponents: Array<
    Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
      attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
      cost: {
        totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        amountPerQuantity: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
        compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
      };
      merchandise: Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'availableForSale' | 'requiresShipping' | 'sku' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        product: Pick<
          StorefrontAPI.Product,
          'handle' | 'title' | 'id' | 'vendor'
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      };
      parentRelationship?: StorefrontAPI.Maybe<{
        parent: Pick<StorefrontAPI.CartLine, 'id'>;
      }>;
    }
  >;
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'id' | 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'sku' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
          parentRelationship?: StorefrontAPI.Maybe<{
            parent: Pick<StorefrontAPI.CartLine, 'id'>;
          }>;
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'sku' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
          lineComponents: Array<
            Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
              attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
              cost: {
                totalAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                amountPerQuantity: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
              };
              merchandise: Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'availableForSale' | 'requiresShipping' | 'sku' | 'title'
              > & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                product: Pick<
                  StorefrontAPI.Product,
                  'handle' | 'title' | 'id' | 'vendor'
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
              };
              parentRelationship?: StorefrontAPI.Maybe<{
                parent: Pick<StorefrontAPI.CartLine, 'id'>;
              }>;
            }
          >;
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  shopMenuHandle: StorefrontAPI.Scalars['String']['input'];
  manMenuHandle: StorefrontAPI.Scalars['String']['input'];
  womanMenuHandle: StorefrontAPI.Scalars['String']['input'];
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  globalMainColor?: StorefrontAPI.Maybe<{
    color?: StorefrontAPI.Maybe<Pick<StorefrontAPI.MetaobjectField, 'value'>>;
  }>;
  shopMenu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
  manMenu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
  womanMenu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type LocalizationQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type LocalizationQuery = {
  localization: {
    country: Pick<StorefrontAPI.Country, 'isoCode' | 'name'> & {
      currency: Pick<StorefrontAPI.Currency, 'isoCode' | 'symbol'>;
    };
    language: Pick<StorefrontAPI.Language, 'isoCode' | 'name'>;
    availableCountries: Array<
      Pick<StorefrontAPI.Country, 'isoCode' | 'name'> & {
        currency: Pick<StorefrontAPI.Currency, 'isoCode' | 'symbol'>;
      }
    >;
  };
};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = {shop: Pick<StorefrontAPI.Shop, 'id'>};

export type HomepageCurrentReleaseQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first: StorefrontAPI.Scalars['Int']['input'];
}>;

export type HomepageCurrentReleaseQuery = {
  banners: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        backgroundImage?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            | {
                __typename:
                  | 'Article'
                  | 'Collection'
                  | 'GenericFile'
                  | 'Metaobject'
                  | 'Model3d'
                  | 'Page'
                  | 'Product'
                  | 'ProductVariant'
                  | 'Video';
              }
            | ({__typename: 'MediaImage'} & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'url' | 'width'
                  >
                >;
              })
          >;
        }>;
        mobileImage?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            | {
                __typename:
                  | 'Article'
                  | 'Collection'
                  | 'GenericFile'
                  | 'Metaobject'
                  | 'Model3d'
                  | 'Page'
                  | 'Product'
                  | 'ProductVariant'
                  | 'Video';
              }
            | ({__typename: 'MediaImage'} & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'url' | 'width'
                  >
                >;
              })
          >;
        }>;
        logoFile?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            | {
                __typename:
                  | 'Article'
                  | 'Collection'
                  | 'Metaobject'
                  | 'Model3d'
                  | 'Page'
                  | 'Product'
                  | 'ProductVariant'
                  | 'Video';
              }
            | ({__typename: 'GenericFile'} & Pick<
                StorefrontAPI.GenericFile,
                'alt' | 'mimeType' | 'url'
              >)
            | ({__typename: 'MediaImage'} & {
                image?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'altText' | 'url'>
                >;
              })
          >;
        }>;
        logoText?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        slogan?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        buttonText?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        buttonLink?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        sortOrder?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
      }
    >;
  };
  categories: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        image?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            | {
                __typename:
                  | 'Article'
                  | 'Collection'
                  | 'GenericFile'
                  | 'Metaobject'
                  | 'Model3d'
                  | 'Page'
                  | 'Product'
                  | 'ProductVariant'
                  | 'Video';
              }
            | ({__typename: 'MediaImage'} & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'url' | 'width'
                  >
                >;
              })
          >;
        }>;
        label?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        link?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        sortOrder?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
      }
    >;
  };
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'altText' | 'url' | 'width' | 'height'>
        >;
        fullImage?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            | {
                __typename:
                  | 'Article'
                  | 'Collection'
                  | 'GenericFile'
                  | 'Metaobject'
                  | 'Model3d'
                  | 'Page'
                  | 'Product'
                  | 'ProductVariant'
                  | 'Video';
              }
            | ({__typename: 'MediaImage'} & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'url' | 'width' | 'height'
                  >
                >;
              })
          >;
        }>;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type WishlistProductsQueryVariables = StorefrontAPI.Exact<{
  ids:
    | Array<StorefrontAPI.Scalars['ID']['input']>
    | StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type WishlistProductsQuery = {
  nodes: Array<
    StorefrontAPI.Maybe<
      | {
          __typename:
            | 'AppliedGiftCard'
            | 'Article'
            | 'Blog'
            | 'Cart'
            | 'CartLine'
            | 'Collection'
            | 'Comment'
            | 'Company'
            | 'CompanyContact'
            | 'CompanyLocation'
            | 'ComponentizableCartLine'
            | 'ExternalVideo'
            | 'GenericFile'
            | 'Location'
            | 'MailingAddress'
            | 'Market'
            | 'MediaImage'
            | 'MediaPresentation'
            | 'Menu'
            | 'MenuItem';
        }
      | {
          __typename:
            | 'Metafield'
            | 'Metaobject'
            | 'Model3d'
            | 'Order'
            | 'Page'
            | 'ProductOption'
            | 'ProductOptionValue'
            | 'ProductVariant'
            | 'Shop'
            | 'ShopPayInstallmentsFinancingPlan'
            | 'ShopPayInstallmentsFinancingPlanTerm'
            | 'ShopPayInstallmentsProductVariantPricing'
            | 'ShopPolicy'
            | 'TaxonomyCategory'
            | 'UrlRedirect'
            | 'Video';
        }
      | ({__typename: 'Product'} & Pick<
          StorefrontAPI.Product,
          'id' | 'handle' | 'title' | 'productType'
        > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            fullImage?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                | {
                    __typename:
                      | 'Article'
                      | 'Collection'
                      | 'GenericFile'
                      | 'Metaobject'
                      | 'Model3d'
                      | 'Page'
                      | 'Product'
                      | 'ProductVariant'
                      | 'Video';
                  }
                | ({__typename: 'MediaImage'} & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'altText' | 'url' | 'width' | 'height'
                      >
                    >;
                  })
              >;
            }>;
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name'> & {
                optionValues: Array<
                  Pick<StorefrontAPI.ProductOptionValue, 'name'>
                >;
              }
            >;
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'availableForSale' | 'quantityAvailable'
                > & {
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                }
              >;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
          })
    >
  >;
};

export type ArticleQueryVariables = StorefrontAPI.Exact<{
  articleHandle: StorefrontAPI.Scalars['String']['input'];
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArticleQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'handle'> & {
      articleByHandle?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.Article,
          'handle' | 'title' | 'contentHtml' | 'publishedAt'
        > & {
          author?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ArticleAuthor, 'name'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          seo?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Seo, 'description' | 'title'>
          >;
        }
      >;
    }
  >;
};

export type BlogQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'title' | 'description'>
      >;
      articles: {
        nodes: Array<
          Pick<
            StorefrontAPI.Article,
            'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
          > & {
            author?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ArticleAuthor, 'name'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            blog: Pick<StorefrontAPI.Blog, 'handle'>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type ArticleItemFragment = Pick<
  StorefrontAPI.Article,
  'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
> & {
  author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  blog: Pick<StorefrontAPI.Blog, 'handle'>;
};

export type BlogsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogsQuery = {
  blogs: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
    nodes: Array<
      Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
      }
    >;
  };
};

export type MoneyProductItemFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type ProductItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'productType'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  fullImage?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
    }
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'quantityAvailable'
      > & {
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      }
    >;
  };
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type CollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductCollectionSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
}>;

export type CollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            'id' | 'handle' | 'title' | 'productType'
          > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            fullImage?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                | {
                    __typename:
                      | 'Article'
                      | 'Collection'
                      | 'GenericFile'
                      | 'Metaobject'
                      | 'Model3d'
                      | 'Page'
                      | 'Product'
                      | 'ProductVariant'
                      | 'Video';
                  }
                | ({__typename: 'MediaImage'} & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'altText' | 'url' | 'width' | 'height'
                      >
                    >;
                  })
              >;
            }>;
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name'> & {
                optionValues: Array<
                  Pick<StorefrontAPI.ProductOptionValue, 'name'>
                >;
              }
            >;
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'availableForSale' | 'quantityAvailable'
                > & {
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                }
              >;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type CollectionFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type StoreCollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type StoreCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type MoneyCollectionItemFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type CollectionItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'productType'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  fullImage?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
    }
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'quantityAvailable'
      > & {
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      }
    >;
  };
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type CatalogQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  sortKey?: StorefrontAPI.InputMaybe<StorefrontAPI.ProductCollectionSortKeys>;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
}>;

export type CatalogQuery = {
  collection?: StorefrontAPI.Maybe<{
    products: {
      nodes: Array<
        Pick<
          StorefrontAPI.Product,
          'id' | 'handle' | 'title' | 'productType'
        > & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          fullImage?: StorefrontAPI.Maybe<{
            reference?: StorefrontAPI.Maybe<
              | {
                  __typename:
                    | 'Article'
                    | 'Collection'
                    | 'GenericFile'
                    | 'Metaobject'
                    | 'Model3d'
                    | 'Page'
                    | 'Product'
                    | 'ProductVariant'
                    | 'Video';
                }
              | ({__typename: 'MediaImage'} & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'altText' | 'url' | 'width' | 'height'
                    >
                  >;
                })
            >;
          }>;
          options: Array<
            Pick<StorefrontAPI.ProductOption, 'name'> & {
              optionValues: Array<
                Pick<StorefrontAPI.ProductOptionValue, 'name'>
              >;
            }
          >;
          variants: {
            nodes: Array<
              Pick<
                StorefrontAPI.ProductVariant,
                'availableForSale' | 'quantityAvailable'
              > & {
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
              }
            >;
          };
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            maxVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
        }
      >;
      pageInfo: Pick<
        StorefrontAPI.PageInfo,
        'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
      >;
    };
  }>;
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'handle' | 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
    }
  >;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  refundPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  termsOfService: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type PolicyQuery = {
  shop: {
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type PolicyItemFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'id' | 'title' | 'handle'
>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type ProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'availableForSale' | 'id' | 'sku' | 'title'
> & {
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  image?: StorefrontAPI.Maybe<
    {__typename: 'Image'} & Pick<
      StorefrontAPI.Image,
      'id' | 'url' | 'altText' | 'width' | 'height'
    >
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  unitPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
};

export type PdpMediaImageFragment = {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type ProductFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'vendor'
  | 'handle'
  | 'productType'
  | 'descriptionHtml'
  | 'description'
  | 'tags'
  | 'encodedVariantExistence'
  | 'encodedVariantAvailability'
> & {
  images: {
    nodes: Array<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
  };
  secondaryImage?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  mainColor?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  pdpSummary?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  colorGalleries?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        | {
            __typename:
              | 'Article'
              | 'Collection'
              | 'GenericFile'
              | 'MediaImage'
              | 'Model3d'
              | 'Page'
              | 'Product'
              | 'ProductVariant'
              | 'Video';
          }
        | ({__typename: 'Metaobject'} & Pick<
            StorefrontAPI.Metaobject,
            'id' | 'handle'
          > & {
              colorName?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              images?: StorefrontAPI.Maybe<{
                references?: StorefrontAPI.Maybe<{
                  nodes: Array<
                    | {
                        __typename:
                          | 'Article'
                          | 'Collection'
                          | 'GenericFile'
                          | 'Metaobject'
                          | 'Model3d'
                          | 'Page'
                          | 'Product'
                          | 'ProductVariant'
                          | 'Video';
                      }
                    | ({__typename: 'MediaImage'} & {
                        image?: StorefrontAPI.Maybe<
                          Pick<
                            StorefrontAPI.Image,
                            'id' | 'url' | 'altText' | 'width' | 'height'
                          >
                        >;
                      })
                  >;
                }>;
              }>;
            })
      >;
    }>;
  }>;
  editorialBlocks?: StorefrontAPI.Maybe<{
    references?: StorefrontAPI.Maybe<{
      nodes: Array<
        | {
            __typename:
              | 'Article'
              | 'Collection'
              | 'GenericFile'
              | 'MediaImage'
              | 'Model3d'
              | 'Page'
              | 'Product'
              | 'ProductVariant'
              | 'Video';
          }
        | ({__typename: 'Metaobject'} & Pick<StorefrontAPI.Metaobject, 'id'> & {
              heading?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              body?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MetaobjectField, 'value'>
              >;
              image?: StorefrontAPI.Maybe<{
                reference?: StorefrontAPI.Maybe<
                  | {
                      __typename:
                        | 'Article'
                        | 'Collection'
                        | 'GenericFile'
                        | 'Metaobject'
                        | 'Model3d'
                        | 'Page'
                        | 'Product'
                        | 'ProductVariant'
                        | 'Video';
                    }
                  | ({__typename: 'MediaImage'} & {
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                >;
              }>;
            })
      >;
    }>;
  }>;
  productWeight?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  productWeightLogo?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  fabricContent?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  fabricContentLogo?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  fabric?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  fabricLogo?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  fit?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  fitLogo?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  temperatureRange?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'value'>
  >;
  temperatureRangeLogo?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  ridingConditions?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'value'>
  >;
  ridingConditionsLogo?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  construction?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
  constructionLogo?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  careInstructions?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'GenericFile'} & Pick<
          StorefrontAPI.GenericFile,
          'alt' | 'mimeType' | 'url'
        >)
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<
        Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
          firstSelectableVariant?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.ProductVariant,
              'availableForSale' | 'id' | 'sku' | 'title'
            > & {
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              image?: StorefrontAPI.Maybe<
                {__typename: 'Image'} & Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              unitPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
            }
          >;
          swatch?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
              image?: StorefrontAPI.Maybe<{
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              }>;
            }
          >;
        }
      >;
    }
  >;
  selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  adjacentVariants: Array<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'vendor'
      | 'handle'
      | 'productType'
      | 'descriptionHtml'
      | 'description'
      | 'tags'
      | 'encodedVariantExistence'
      | 'encodedVariantAvailability'
    > & {
      images: {
        nodes: Array<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      };
      secondaryImage?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          | {
              __typename:
                | 'Article'
                | 'Collection'
                | 'GenericFile'
                | 'Metaobject'
                | 'Model3d'
                | 'Page'
                | 'Product'
                | 'ProductVariant'
                | 'Video';
            }
          | ({__typename: 'MediaImage'} & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
        >;
      }>;
      mainColor?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      pdpSummary?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      colorGalleries?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            | {
                __typename:
                  | 'Article'
                  | 'Collection'
                  | 'GenericFile'
                  | 'MediaImage'
                  | 'Model3d'
                  | 'Page'
                  | 'Product'
                  | 'ProductVariant'
                  | 'Video';
              }
            | ({__typename: 'Metaobject'} & Pick<
                StorefrontAPI.Metaobject,
                'id' | 'handle'
              > & {
                  colorName?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  images?: StorefrontAPI.Maybe<{
                    references?: StorefrontAPI.Maybe<{
                      nodes: Array<
                        | {
                            __typename:
                              | 'Article'
                              | 'Collection'
                              | 'GenericFile'
                              | 'Metaobject'
                              | 'Model3d'
                              | 'Page'
                              | 'Product'
                              | 'ProductVariant'
                              | 'Video';
                          }
                        | ({__typename: 'MediaImage'} & {
                            image?: StorefrontAPI.Maybe<
                              Pick<
                                StorefrontAPI.Image,
                                'id' | 'url' | 'altText' | 'width' | 'height'
                              >
                            >;
                          })
                      >;
                    }>;
                  }>;
                })
          >;
        }>;
      }>;
      editorialBlocks?: StorefrontAPI.Maybe<{
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            | {
                __typename:
                  | 'Article'
                  | 'Collection'
                  | 'GenericFile'
                  | 'MediaImage'
                  | 'Model3d'
                  | 'Page'
                  | 'Product'
                  | 'ProductVariant'
                  | 'Video';
              }
            | ({__typename: 'Metaobject'} & Pick<
                StorefrontAPI.Metaobject,
                'id'
              > & {
                  heading?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  body?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MetaobjectField, 'value'>
                  >;
                  image?: StorefrontAPI.Maybe<{
                    reference?: StorefrontAPI.Maybe<
                      | {
                          __typename:
                            | 'Article'
                            | 'Collection'
                            | 'GenericFile'
                            | 'Metaobject'
                            | 'Model3d'
                            | 'Page'
                            | 'Product'
                            | 'ProductVariant'
                            | 'Video';
                        }
                      | ({__typename: 'MediaImage'} & {
                          image?: StorefrontAPI.Maybe<
                            Pick<
                              StorefrontAPI.Image,
                              'id' | 'url' | 'altText' | 'width' | 'height'
                            >
                          >;
                        })
                    >;
                  }>;
                })
          >;
        }>;
      }>;
      productWeight?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      productWeightLogo?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          | {
              __typename:
                | 'Article'
                | 'Collection'
                | 'GenericFile'
                | 'Metaobject'
                | 'Model3d'
                | 'Page'
                | 'Product'
                | 'ProductVariant'
                | 'Video';
            }
          | ({__typename: 'MediaImage'} & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
        >;
      }>;
      fabricContent?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      fabricContentLogo?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          | {
              __typename:
                | 'Article'
                | 'Collection'
                | 'GenericFile'
                | 'Metaobject'
                | 'Model3d'
                | 'Page'
                | 'Product'
                | 'ProductVariant'
                | 'Video';
            }
          | ({__typename: 'MediaImage'} & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
        >;
      }>;
      fabric?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      fabricLogo?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          | {
              __typename:
                | 'Article'
                | 'Collection'
                | 'GenericFile'
                | 'Metaobject'
                | 'Model3d'
                | 'Page'
                | 'Product'
                | 'ProductVariant'
                | 'Video';
            }
          | ({__typename: 'MediaImage'} & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
        >;
      }>;
      fit?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'value'>>;
      fitLogo?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          | {
              __typename:
                | 'Article'
                | 'Collection'
                | 'GenericFile'
                | 'Metaobject'
                | 'Model3d'
                | 'Page'
                | 'Product'
                | 'ProductVariant'
                | 'Video';
            }
          | ({__typename: 'MediaImage'} & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
        >;
      }>;
      temperatureRange?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      temperatureRangeLogo?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          | {
              __typename:
                | 'Article'
                | 'Collection'
                | 'GenericFile'
                | 'Metaobject'
                | 'Model3d'
                | 'Page'
                | 'Product'
                | 'ProductVariant'
                | 'Video';
            }
          | ({__typename: 'MediaImage'} & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
        >;
      }>;
      ridingConditions?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      ridingConditionsLogo?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          | {
              __typename:
                | 'Article'
                | 'Collection'
                | 'GenericFile'
                | 'Metaobject'
                | 'Model3d'
                | 'Page'
                | 'Product'
                | 'ProductVariant'
                | 'Video';
            }
          | ({__typename: 'MediaImage'} & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
        >;
      }>;
      construction?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'value'>
      >;
      constructionLogo?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          | {
              __typename:
                | 'Article'
                | 'Collection'
                | 'GenericFile'
                | 'Metaobject'
                | 'Model3d'
                | 'Page'
                | 'Product'
                | 'ProductVariant'
                | 'Video';
            }
          | ({__typename: 'MediaImage'} & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
        >;
      }>;
      careInstructions?: StorefrontAPI.Maybe<{
        reference?: StorefrontAPI.Maybe<
          | {
              __typename:
                | 'Article'
                | 'Collection'
                | 'Metaobject'
                | 'Model3d'
                | 'Page'
                | 'Product'
                | 'ProductVariant'
                | 'Video';
            }
          | ({__typename: 'GenericFile'} & Pick<
              StorefrontAPI.GenericFile,
              'alt' | 'mimeType' | 'url'
            >)
          | ({__typename: 'MediaImage'} & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            })
        >;
      }>;
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
              firstSelectableVariant?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'availableForSale' | 'id' | 'sku' | 'title'
                > & {
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  image?: StorefrontAPI.Maybe<
                    {__typename: 'Image'} & Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  unitPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                }
              >;
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<{
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  }>;
                }
              >;
            }
          >;
        }
      >;
      selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      adjacentVariants: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type ProductMerchandisingItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'productType'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  fullImage?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
    }
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'quantityAvailable'
      > & {
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      }
    >;
  };
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type ProductMerchandisingQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  productId: StorefrontAPI.Scalars['ID']['input'];
  recentlyExploredQuery: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductMerchandisingQuery = {
  productRecommendations?: StorefrontAPI.Maybe<
    Array<
      Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title' | 'productType'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        fullImage?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            | {
                __typename:
                  | 'Article'
                  | 'Collection'
                  | 'GenericFile'
                  | 'Metaobject'
                  | 'Model3d'
                  | 'Page'
                  | 'Product'
                  | 'ProductVariant'
                  | 'Video';
              }
            | ({__typename: 'MediaImage'} & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'altText' | 'url' | 'width' | 'height'
                  >
                >;
              })
          >;
        }>;
        options: Array<
          Pick<StorefrontAPI.ProductOption, 'name'> & {
            optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
          }
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'availableForSale' | 'quantityAvailable'
            > & {
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
            }
          >;
        };
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >
  >;
  recentlyExplored: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title' | 'productType'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        fullImage?: StorefrontAPI.Maybe<{
          reference?: StorefrontAPI.Maybe<
            | {
                __typename:
                  | 'Article'
                  | 'Collection'
                  | 'GenericFile'
                  | 'Metaobject'
                  | 'Model3d'
                  | 'Page'
                  | 'Product'
                  | 'ProductVariant'
                  | 'Video';
              }
            | ({__typename: 'MediaImage'} & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'altText' | 'url' | 'width' | 'height'
                  >
                >;
              })
          >;
        }>;
        options: Array<
          Pick<StorefrontAPI.ProductOption, 'name'> & {
            optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
          }
        >;
        variants: {
          nodes: Array<
            Pick<
              StorefrontAPI.ProductVariant,
              'availableForSale' | 'quantityAvailable'
            > & {
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
            }
          >;
        };
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
  };
};

export type SearchProductItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title' | 'productType' | 'trackingParameters'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  fullImage?: StorefrontAPI.Maybe<{
    reference?: StorefrontAPI.Maybe<
      | {
          __typename:
            | 'Article'
            | 'Collection'
            | 'GenericFile'
            | 'Metaobject'
            | 'Model3d'
            | 'Page'
            | 'Product'
            | 'ProductVariant'
            | 'Video';
        }
      | ({__typename: 'MediaImage'} & {
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
        })
    >;
  }>;
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<Pick<StorefrontAPI.ProductOptionValue, 'name'>>;
    }
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'quantityAvailable'
      > & {
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      }
    >;
  };
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type SearchProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  term: StorefrontAPI.Scalars['String']['input'];
}>;

export type SearchProductsQuery = {
  search: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    nodes: Array<
      | {__typename: 'Article' | 'Page'}
      | ({__typename: 'Product'} & Pick<
          StorefrontAPI.Product,
          'id' | 'handle' | 'title' | 'productType' | 'trackingParameters'
        > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            fullImage?: StorefrontAPI.Maybe<{
              reference?: StorefrontAPI.Maybe<
                | {
                    __typename:
                      | 'Article'
                      | 'Collection'
                      | 'GenericFile'
                      | 'Metaobject'
                      | 'Model3d'
                      | 'Page'
                      | 'Product'
                      | 'ProductVariant'
                      | 'Video';
                  }
                | ({__typename: 'MediaImage'} & {
                    image?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'altText' | 'url' | 'width' | 'height'
                      >
                    >;
                  })
              >;
            }>;
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name'> & {
                optionValues: Array<
                  Pick<StorefrontAPI.ProductOptionValue, 'name'>
                >;
              }
            >;
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'availableForSale' | 'quantityAvailable'
                > & {
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                }
              >;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
          })
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $language: LanguageCode\n    $shopMenuHandle: String!\n    $manMenuHandle: String!\n    $womanMenuHandle: String!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    globalMainColor: metaobject(\n      handle: {type: "main_color", handle: "global"}\n    ) {\n      color: field(key: "color") {\n        value\n      }\n    }\n    shopMenu: menu(handle: $shopMenuHandle) {\n      ...Menu\n    }\n    manMenu: menu(handle: $manMenuHandle) {\n      ...Menu\n    }\n    womanMenu: menu(handle: $womanMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Localization(\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    localization {\n      country {\n        isoCode\n        name\n        currency {\n          isoCode\n          symbol\n        }\n      }\n      language {\n        isoCode\n        name\n      }\n      availableCountries {\n        isoCode\n        name\n        currency {\n          isoCode\n          symbol\n        }\n      }\n    }\n  }\n': {
    return: LocalizationQuery;
    variables: LocalizationQueryVariables;
  };
  '#graphql\n  query StoreRobots($country: CountryCode, $language: LanguageCode)\n   @inContext(country: $country, language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
  '#graphql\n  query HomepageCurrentRelease(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int!\n  ) @inContext(country: $country, language: $language) {\n    banners: metaobjects(type: "homepage_banner", first: 20) {\n      nodes {\n        id\n        backgroundImage: field(key: "image") {\n          reference {\n            __typename\n            ... on MediaImage {\n              image {\n                altText\n                height\n                url\n                width\n              }\n            }\n          }\n        }\n        mobileImage: field(key: "mobile_image") {\n          reference {\n            __typename\n            ... on MediaImage {\n              image {\n                altText\n                height\n                url\n                width\n              }\n            }\n          }\n        }\n        logoFile: field(key: "logo_file") {\n          reference {\n            __typename\n            ... on GenericFile {\n              alt\n              mimeType\n              url\n            }\n            ... on MediaImage {\n              image {\n                altText\n                url\n              }\n            }\n          }\n        }\n        logoText: field(key: "logo_text") {\n          value\n        }\n        slogan: field(key: "slogan") {\n          value\n        }\n        buttonText: field(key: "button_text") {\n          value\n        }\n        buttonLink: field(key: "button_link") {\n          value\n        }\n        sortOrder: field(key: "sort_order") {\n          value\n        }\n      }\n    }\n    categories: metaobjects(type: "homepage_category", first: 10) {\n      nodes {\n        id\n        image: field(key: "image") {\n          reference {\n            __typename\n            ... on MediaImage {\n              image {\n                altText\n                height\n                url\n                width\n              }\n            }\n          }\n        }\n        label: field(key: "label") {\n          value\n        }\n        link: field(key: "link") {\n          value\n        }\n        sortOrder: field(key: "sort_order") {\n          value\n        }\n      }\n    }\n    products(first: $first, sortKey: CREATED_AT, reverse: true) {\n      nodes {\n        id\n        handle\n        title\n        featuredImage {\n          altText\n          url\n          width\n          height\n        }\n        fullImage: metafield(namespace: "custom", key: "full") {\n          reference {\n            __typename\n            ... on MediaImage {\n              image {\n                altText\n                url\n                width\n                height\n              }\n            }\n          }\n        }\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n': {
    return: HomepageCurrentReleaseQuery;
    variables: HomepageCurrentReleaseQueryVariables;
  };
  '#graphql\n  query WishlistProducts(\n    $ids: [ID!]!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    nodes(ids: $ids) {\n      __typename\n      ... on Product {\n        id\n        handle\n        title\n        productType\n        featuredImage {\n          id\n          altText\n          url\n          width\n          height\n        }\n        fullImage: metafield(namespace: "custom", key: "full") {\n          reference {\n            __typename\n            ... on MediaImage {\n              image {\n                id\n                altText\n                url\n                width\n                height\n              }\n            }\n          }\n        }\n        options {\n          name\n          optionValues { name }\n        }\n        variants(first: 50) {\n          nodes {\n            availableForSale\n            quantityAvailable\n            selectedOptions { name value }\n          }\n        }\n        priceRange {\n          minVariantPrice { amount currencyCode }\n          maxVariantPrice { amount currencyCode }\n        }\n      }\n    }\n  }\n': {
    return: WishlistProductsQuery;
    variables: WishlistProductsQueryVariables;
  };
  '#graphql\n  query Article(\n    $articleHandle: String!\n    $blogHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    blog(handle: $blogHandle) {\n      handle\n      articleByHandle(handle: $articleHandle) {\n        handle\n        title\n        contentHtml\n        publishedAt\n        author: authorV2 {\n          name\n        }\n        image {\n          id\n          altText\n          url\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n      }\n    }\n  }\n': {
    return: ArticleQuery;
    variables: ArticleQueryVariables;
  };
  '#graphql\n  query Blog(\n    $language: LanguageCode\n    $blogHandle: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(language: $language) {\n    blog(handle: $blogHandle) {\n      title\n      handle\n      seo {\n        title\n        description\n      }\n      articles(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ArticleItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n\n      }\n    }\n  }\n  fragment ArticleItem on Article {\n    author: authorV2 {\n      name\n    }\n    contentHtml\n    handle\n    id\n    image {\n      id\n      altText\n      url\n      width\n      height\n    }\n    publishedAt\n    title\n    blog {\n      handle\n    }\n  }\n': {
    return: BlogQuery;
    variables: BlogQueryVariables;
  };
  '#graphql\n  query Blogs(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    blogs(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      nodes {\n        title\n        handle\n        seo {\n          title\n          description\n        }\n      }\n    }\n  }\n': {
    return: BlogsQuery;
    variables: BlogsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    productType\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    fullImage: metafield(namespace: "custom", key: "full") {\n      reference {\n        __typename\n        ... on MediaImage {\n          image {\n            id\n            altText\n            url\n            width\n            height\n          }\n        }\n      }\n    }\n    options {\n      name\n      optionValues {\n        name\n      }\n    }\n    variants(first: 50) {\n      nodes {\n        availableForSale\n        quantityAvailable\n        selectedOptions {\n          name\n          value\n        }\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n  }\n\n  query Collection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n    $sortKey: ProductCollectionSortKeys\n    $reverse: Boolean\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor,\n        sortKey: $sortKey,\n        reverse: $reverse\n      ) {\n        nodes {\n          ...ProductItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n': {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  '#graphql\n  fragment Collection on Collection {\n    id\n    title\n    handle\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n  }\n  query StoreCollections(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collections(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      nodes {\n        ...Collection\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n': {
    return: StoreCollectionsQuery;
    variables: StoreCollectionsQueryVariables;
  };
  '#graphql\n  query Catalog(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n    $sortKey: ProductCollectionSortKeys\n    $reverse: Boolean\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: "all") {\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor,\n        sortKey: $sortKey,\n        reverse: $reverse\n      ) {\n        nodes {\n          ...CollectionItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n  #graphql\n  fragment MoneyCollectionItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment CollectionItem on Product {\n    id\n    handle\n    title\n    productType\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    fullImage: metafield(namespace: "custom", key: "full") {\n      reference {\n        __typename\n        ... on MediaImage {\n          image {\n            id\n            altText\n            url\n            width\n            height\n          }\n        }\n      }\n    }\n    options {\n      name\n      optionValues {\n        name\n      }\n    }\n    variants(first: 50) {\n      nodes {\n        availableForSale\n        quantityAvailable\n        selectedOptions {\n          name\n          value\n        }\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyCollectionItem\n      }\n      maxVariantPrice {\n        ...MoneyCollectionItem\n      }\n    }\n  }\n\n': {
    return: CatalogQuery;
    variables: CatalogQueryVariables;
  };
  '#graphql\n  query Page(\n    $language: LanguageCode,\n    $country: CountryCode,\n    $handle: String!\n  )\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      handle\n      id\n      title\n      body\n      seo {\n        description\n        title\n      }\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $country: CountryCode\n    $language: LanguageCode\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {\n    id\n    title\n    handle\n  }\n  query Policies ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    shop {\n      shippingPolicy {\n        ...PolicyItem\n      }\n      termsOfService {\n        ...PolicyItem\n      }\n      refundPolicy {\n        ...PolicyItem\n      }\n      subscriptionPolicy {\n        id\n        title\n        handle\n      }\n    }\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  query Product(\n    $country: CountryCode\n    $handle: String!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  #graphql\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    productType\n    descriptionHtml\n    description\n    tags\n    images(first: 20) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    secondaryImage: metafield(\n      namespace: "custom"\n      key: "img"\n    ) {\n      reference {\n        __typename\n        ... on MediaImage {\n          image {\n            id\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n    }\n    mainColor: metafield(namespace: "custom", key: "main_color") {\n      value\n    }\n    pdpSummary: metafield(namespace: "custom", key: "pdp_summary") {\n      value\n    }\n    colorGalleries: metafield(\n      namespace: "custom"\n      key: "color_galleries"\n    ) {\n      references(first: 20) {\n        nodes {\n          __typename\n          ... on Metaobject {\n            id\n            handle\n            colorName: field(key: "color_name") {\n              value\n            }\n            images: field(key: "images") {\n              references(first: 6) {\n                nodes {\n                  __typename\n                  ...PdpMediaImage\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    editorialBlocks: metafield(\n      namespace: "custom"\n      key: "editorial_blocks"\n    ) {\n      references(first: 2) {\n        nodes {\n          __typename\n          ... on Metaobject {\n            id\n            heading: field(key: "heading") {\n              value\n            }\n            body: field(key: "body") {\n              value\n            }\n            image: field(key: "image") {\n              reference {\n                __typename\n                ...PdpMediaImage\n              }\n            }\n          }\n        }\n      }\n    }\n    productWeight: metafield(\n      namespace: "custom"\n      key: "spec_product_weight"\n    ) {\n      value\n    }\n    productWeightLogo: metafield(\n      namespace: "custom"\n      key: "spec_product_weight_logo"\n    ) {\n      reference {\n        __typename\n        ...PdpMediaImage\n      }\n    }\n    fabricContent: metafield(\n      namespace: "custom"\n      key: "spec_main_fabric_content"\n    ) {\n      value\n    }\n    fabricContentLogo: metafield(\n      namespace: "custom"\n      key: "spec_main_fabric_content_logo"\n    ) {\n      reference {\n        __typename\n        ...PdpMediaImage\n      }\n    }\n    fabric: metafield(namespace: "custom", key: "spec_fabric") {\n      value\n    }\n    fabricLogo: metafield(namespace: "custom", key: "spec_fabric_logo") {\n      reference {\n        __typename\n        ...PdpMediaImage\n      }\n    }\n    fit: metafield(namespace: "custom", key: "spec_fit") {\n      value\n    }\n    fitLogo: metafield(namespace: "custom", key: "spec_fit_logo") {\n      reference {\n        __typename\n        ...PdpMediaImage\n      }\n    }\n    temperatureRange: metafield(\n      namespace: "custom"\n      key: "spec_temperature_range"\n    ) {\n      value\n    }\n    temperatureRangeLogo: metafield(\n      namespace: "custom"\n      key: "spec_temperature_range_logo"\n    ) {\n      reference {\n        __typename\n        ...PdpMediaImage\n      }\n    }\n    ridingConditions: metafield(\n      namespace: "custom"\n      key: "spec_riding_conditions"\n    ) {\n      value\n    }\n    ridingConditionsLogo: metafield(\n      namespace: "custom"\n      key: "spec_riding_conditions_logo"\n    ) {\n      reference {\n        __typename\n        ...PdpMediaImage\n      }\n    }\n    construction: metafield(\n      namespace: "custom"\n      key: "spec_construction"\n    ) {\n      value\n    }\n    constructionLogo: metafield(\n      namespace: "custom"\n      key: "spec_construction_logo"\n    ) {\n      reference {\n        __typename\n        ...PdpMediaImage\n      }\n    }\n    careInstructions: metafield(\n      namespace: "custom"\n      key: "care_instructions"\n    ) {\n      reference {\n        __typename\n        ... on GenericFile {\n          alt\n          mimeType\n          url\n        }\n        ... on MediaImage {\n          image {\n            id\n            url\n            altText\n            width\n            height\n          }\n        }\n      }\n    }\n    encodedVariantExistence\n    encodedVariantAvailability\n    options {\n      name\n      optionValues {\n        name\n        firstSelectableVariant {\n          ...ProductVariant\n        }\n        swatch {\n          color\n          image {\n            previewImage {\n              url\n            }\n          }\n        }\n      }\n    }\n    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {\n      ...ProductVariant\n    }\n    adjacentVariants (selectedOptions: $selectedOptions) {\n      ...ProductVariant\n    }\n    seo {\n      description\n      title\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n  #graphql\n  fragment PdpMediaImage on MediaImage {\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n  }\n\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  query ProductMerchandising(\n    $country: CountryCode\n    $language: LanguageCode\n    $productId: ID!\n    $recentlyExploredQuery: String!\n  ) @inContext(country: $country, language: $language) {\n    productRecommendations(productId: $productId, intent: COMPLEMENTARY) {\n      ...ProductMerchandisingItem\n    }\n    recentlyExplored: products(\n      first: 8\n      query: $recentlyExploredQuery\n    ) {\n      nodes {\n        ...ProductMerchandisingItem\n      }\n    }\n  }\n  #graphql\n  fragment ProductMerchandisingItem on Product {\n    id\n    handle\n    title\n    productType\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    fullImage: metafield(namespace: "custom", key: "full") {\n      reference {\n        __typename\n        ... on MediaImage {\n          image {\n            id\n            altText\n            url\n            width\n            height\n          }\n        }\n      }\n    }\n    options {\n      name\n      optionValues {\n        name\n      }\n    }\n    variants(first: 50) {\n      nodes {\n        availableForSale\n        quantityAvailable\n        selectedOptions {\n          name\n          value\n        }\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n': {
    return: ProductMerchandisingQuery;
    variables: ProductMerchandisingQueryVariables;
  };
  '#graphql\n  query SearchProducts(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n    $term: String!\n  ) @inContext(country: $country, language: $language) {\n    search(\n      after: $endCursor\n      before: $startCursor\n      first: $first\n      last: $last\n      prefix: LAST\n      query: $term\n      sortKey: RELEVANCE\n      types: [PRODUCT]\n      unavailableProducts: LAST\n    ) {\n      nodes {\n        __typename\n        ... on Product {\n          ...SearchProductItem\n        }\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n      totalCount\n    }\n  }\n  #graphql\n  fragment SearchProductItem on Product {\n    id\n    handle\n    title\n    productType\n    trackingParameters\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    fullImage: metafield(namespace: "custom", key: "full") {\n      reference {\n        __typename\n        ... on MediaImage {\n          image {\n            id\n            altText\n            url\n            width\n            height\n          }\n        }\n      }\n    }\n    options {\n      name\n      optionValues {\n        name\n      }\n    }\n    variants(first: 50) {\n      nodes {\n        availableForSale\n        quantityAvailable\n        selectedOptions {\n          name\n          value\n        }\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n': {
    return: SearchProductsQuery;
    variables: SearchProductsQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
