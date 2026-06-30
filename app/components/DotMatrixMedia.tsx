import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type DotMatrixMediaProps = {
  children: ReactNode;
  className?: string;
  maskSrc?: string | null;
  dotColor?: string;
  dotGap?: number;
  dotRadius?: number;
  clearance?: number;
  alphaThreshold?: number;
  maxDpr?: number;
  objectFit?: 'contain' | 'cover';
};

type Bounds = {
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

type ImageRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AlphaMask =
  | {
      data: Uint8ClampedArray;
      height: number;
      kind: 'alpha';
      width: number;
    }
  | {kind: 'rect'};

const DEFAULTS = {
  alphaThreshold: 28,
  clearance: 13,
  dotColor: 'rgba(212, 61, 72, 0.78)',
  dotGap: 30,
  dotRadius: 1.35,
  maxDpr: 1.5,
  objectFit: 'contain',
} as const;

const maskCache = new Map<string, AlphaMask>();

export function DotMatrixMedia({
  alphaThreshold = DEFAULTS.alphaThreshold,
  children,
  className,
  clearance = DEFAULTS.clearance,
  dotColor = DEFAULTS.dotColor,
  dotGap = DEFAULTS.dotGap,
  dotRadius = DEFAULTS.dotRadius,
  maskSrc,
  maxDpr = DEFAULTS.maxDpr,
  objectFit = DEFAULTS.objectFit,
}: DotMatrixMediaProps) {
  const frameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [bounds, setBounds] = useState<Bounds>({
    height: 0,
    pageX: 0,
    pageY: 0,
    width: 0,
  });
  const [maskImage, setMaskImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const measure = () => {
      const rect = root.getBoundingClientRect();

      setBounds({
        height: Math.round(rect.height),
        pageX: rect.left + window.scrollX,
        pageY: rect.top + window.scrollY,
        width: Math.round(rect.width),
      });
    };

    measure();

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            if (frameRef.current !== null) {
              window.cancelAnimationFrame(frameRef.current);
            }

            frameRef.current = window.requestAnimationFrame(measure);
          });

    observer?.observe(root);
    window.addEventListener('resize', measure);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!maskSrc) {
      setMaskImage(null);
      return;
    }

    let isMounted = true;
    const image = new Image();

    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => {
      if (isMounted) setMaskImage(image);
    };
    image.onerror = () => {
      if (isMounted) setMaskImage(null);
    };
    image.src = maskSrc;

    return () => {
      isMounted = false;
    };
  }, [maskSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || bounds.width <= 0 || bounds.height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = Math.round(bounds.width * dpr);
    canvas.height = Math.round(bounds.height * dpr);
    canvas.style.width = `${bounds.width}px`;
    canvas.style.height = `${bounds.height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const imageRect =
      maskImage && maskImage.naturalWidth > 0 && maskImage.naturalHeight > 0
        ? getImageRect({
            bounds,
            imageHeight: maskImage.naturalHeight,
            imageWidth: maskImage.naturalWidth,
            objectFit,
          })
        : null;

    const alphaMask =
      maskImage && imageRect
        ? getAlphaMask({
            image: maskImage,
            imageRect,
            maskSrc,
          })
        : null;

    drawDotMatrix({
      alphaMask,
      alphaThreshold,
      bounds,
      clearance,
      context,
      dotColor,
      dotGap,
      dotRadius,
      imageRect,
    });
  }, [
    alphaThreshold,
    bounds,
    clearance,
    dotColor,
    dotGap,
    dotRadius,
    maskImage,
    maskSrc,
    maxDpr,
    objectFit,
  ]);

  return (
    <div className={joinClassNames('dot-matrix-media', className)} ref={rootRef}>
      <canvas aria-hidden className="dot-matrix-media__canvas" ref={canvasRef} />
      <div className="dot-matrix-media__content">{children}</div>
    </div>
  );
}

function drawDotMatrix({
  alphaMask,
  alphaThreshold,
  bounds,
  clearance,
  context,
  dotColor,
  dotGap,
  dotRadius,
  imageRect,
}: {
  alphaMask: AlphaMask | null;
  alphaThreshold: number;
  bounds: Bounds;
  clearance: number;
  context: CanvasRenderingContext2D;
  dotColor: string;
  dotGap: number;
  dotRadius: number;
  imageRect: ImageRect | null;
}) {
  const gap = Math.max(12, dotGap);
  const radius = Math.max(0.7, dotRadius);
  const startX = positiveModulo(gap * 0.5 - bounds.pageX, gap);
  const startY = positiveModulo(gap * 0.5 - bounds.pageY, gap);

  context.clearRect(0, 0, bounds.width, bounds.height);
  context.fillStyle = dotColor;

  for (let y = startY; y <= bounds.height; y += gap) {
    for (let x = startX; x <= bounds.width; x += gap) {
      if (
        imageRect &&
        alphaMask &&
        isPointHiddenByImage({
          alphaMask,
          alphaThreshold,
          clearance,
          imageRect,
          pointX: x,
          pointY: y,
        })
      ) {
        continue;
      }

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  }
}

function getImageRect({
  bounds,
  imageHeight,
  imageWidth,
  objectFit,
}: {
  bounds: Bounds;
  imageHeight: number;
  imageWidth: number;
  objectFit: 'contain' | 'cover';
}) {
  const containerRatio = bounds.width / bounds.height;
  const imageRatio = imageWidth / imageHeight;
  const shouldFitWidth =
    objectFit === 'contain'
      ? imageRatio >= containerRatio
      : imageRatio < containerRatio;

  const width = shouldFitWidth ? bounds.width : bounds.height * imageRatio;
  const height = shouldFitWidth ? bounds.width / imageRatio : bounds.height;

  return {
    height,
    width,
    x: (bounds.width - width) * 0.5,
    y: (bounds.height - height) * 0.5,
  };
}

function getAlphaMask({
  image,
  imageRect,
  maskSrc,
}: {
  image: HTMLImageElement;
  imageRect: ImageRect;
  maskSrc?: string | null;
}): AlphaMask {
  const cacheKey = [
    maskSrc,
    Math.round(imageRect.width),
    Math.round(imageRect.height),
  ].join('|');
  const cachedMask = maskCache.get(cacheKey);

  if (cachedMask) return cachedMask;

  const longestSide = Math.max(imageRect.width, imageRect.height);
  const scale = longestSide > 560 ? 560 / longestSide : 1;
  const width = Math.max(1, Math.round(imageRect.width * scale));
  const height = Math.max(1, Math.round(imageRect.height * scale));
  const maskCanvas = document.createElement('canvas');

  maskCanvas.width = width;
  maskCanvas.height = height;

  const maskContext = maskCanvas.getContext('2d', {willReadFrequently: true});

  if (!maskContext) return {kind: 'rect'};

  maskContext.clearRect(0, 0, width, height);
  maskContext.drawImage(image, 0, 0, width, height);

  try {
    const imageData = maskContext.getImageData(0, 0, width, height).data;
    const data = new Uint8ClampedArray(width * height);

    for (let index = 0; index < data.length; index += 1) {
      data[index] = imageData[index * 4 + 3];
    }

    const mask: AlphaMask = {data, height, kind: 'alpha', width};

    maskCache.set(cacheKey, mask);
    return mask;
  } catch {
    const mask: AlphaMask = {kind: 'rect'};

    maskCache.set(cacheKey, mask);
    return mask;
  }
}

function isPointHiddenByImage({
  alphaMask,
  alphaThreshold,
  clearance,
  imageRect,
  pointX,
  pointY,
}: {
  alphaMask: AlphaMask;
  alphaThreshold: number;
  clearance: number;
  imageRect: ImageRect;
  pointX: number;
  pointY: number;
}) {
  if (
    pointX < imageRect.x - clearance ||
    pointX > imageRect.x + imageRect.width + clearance ||
    pointY < imageRect.y - clearance ||
    pointY > imageRect.y + imageRect.height + clearance
  ) {
    return false;
  }

  if (alphaMask.kind === 'rect') return true;

  const scaleX = alphaMask.width / imageRect.width;
  const scaleY = alphaMask.height / imageRect.height;
  const radiusX = Math.max(1, Math.round(clearance * scaleX));
  const radiusY = Math.max(1, Math.round(clearance * scaleY));
  const maskX = Math.round((pointX - imageRect.x) * scaleX);
  const maskY = Math.round((pointY - imageRect.y) * scaleY);

  for (let offsetY = -radiusY; offsetY <= radiusY; offsetY += 1) {
    const targetY = maskY + offsetY;

    if (targetY < 0 || targetY >= alphaMask.height) continue;

    for (let offsetX = -radiusX; offsetX <= radiusX; offsetX += 1) {
      const targetX = maskX + offsetX;

      if (targetX < 0 || targetX >= alphaMask.width) continue;

      if (
        alphaMask.data[targetY * alphaMask.width + targetX] >= alphaThreshold
      ) {
        return true;
      }
    }
  }

  return false;
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(' ');
}
