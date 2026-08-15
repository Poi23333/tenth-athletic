export const CUSTOMER_WISHLIST_QUERY = `#graphql
  query CustomerWishlist {
    customer {
      id
      wishlist: metafield(namespace: "custom", key: "wishlist_products") {
        value
        compareDigest
      }
    }
  }
` as const;

export const CUSTOMER_WISHLIST_MUTATION = `#graphql
  mutation CustomerWishlistUpdate($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        value
        compareDigest
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;
