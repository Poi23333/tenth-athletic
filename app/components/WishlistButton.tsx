import {RiBookmarkFill, RiBookmarkLine} from '@remixicon/react';
import type {MouseEvent} from 'react';
import {useWishlist} from '~/components/WishlistProvider';

export function WishlistButton({
  productId,
  className = '',
}: {
  productId: string;
  className?: string;
}) {
  const {isReady, isPending, isWishlisted, toggle} = useWishlist();
  const selected = isWishlisted(productId);
  const pending = isPending(productId);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    void toggle(productId).catch(() => undefined);
  }

  return (
    <button
      aria-label={selected ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={selected}
      className={`wishlist-button reset ${className}`.trim()}
      disabled={!isReady || pending}
      onClick={handleClick}
      type="button"
    >
      {selected ? (
        <RiBookmarkFill aria-hidden="true" />
      ) : (
        <RiBookmarkLine aria-hidden="true" />
      )}
    </button>
  );
}
