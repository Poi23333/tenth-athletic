import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl}>
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;
            const {title, color} = getProductDisplayParts(product.title);

            return (
              <Link
                className="product-item"
                key={product.id}
                prefetch="intent"
                to={productUrl}
              >
                {image ? (
                  <div className="product-item-media">
                    <Image
                      alt={product.title}
                      data={image}
                      sizes="(min-width: 48em) 25vw, 50vw"
                    />
                  </div>
                ) : null}
                <h4>{title}</h4>
                {color ? <p className="product-item-color">{color}</p> : null}
                {price ? (
                  <div className="product-item-price">
                    <Money data={price} />
                  </div>
                ) : null}
              </Link>
            );
          });

          return (
            <div>
              <div className="search-results-grid">{ItemsMarkup}</div>
              <div>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <div>
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return (
    <p className="search-empty">No results, try a different search.</p>
  );
}

const COLOR_NAMES = [
  'black',
  'white',
  'grey',
  'gray',
  'navy',
  'blue',
  'green',
  'red',
  'brown',
  'cream',
  'beige',
  'sand',
  'stone',
  'olive',
  'khaki',
  'charcoal',
];

function getProductDisplayParts(title: string) {
  const separated = title.match(/^(.*)\s[-–—]\s([^–—-]+)$/);
  if (separated && isColorName(separated[2])) {
    return {title: separated[1], color: separated[2]};
  }

  const words = title.trim().split(/\s+/);
  const lastWord = words[words.length - 1]?.toLowerCase();
  if (lastWord && isColorName(lastWord) && words.length > 1) {
    return {
      title: words.slice(0, -1).join(' '),
      color: words[words.length - 1],
    };
  }

  return {title, color: ''};
}

function isColorName(value: string) {
  return COLOR_NAMES.includes(value.trim().toLowerCase());
}
