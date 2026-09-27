import { useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

/**
 * A full-window view of one screenshot, with its caption. Pinch to zoom
 * and drag to pan on touch, double-tap (or double-click) to zoom in and
 * back out, the wheel to zoom on a desktop; the arrows and the ← → keys
 * move through the set. The backdrop, the × and Escape close it, and the
 * page behind does not scroll while it is open. The gestures come from
 * react-zoom-pan-pinch; the image is always the full window, not the
 * mobile crop.
 */
const Lightbox = ({ images, index, onClose, onChange }: LightboxProps) => {
  const count = images.length;
  /** Where the last pointer went down on the stage: a tap closes, a drag does not. */
  const down = useRef<{ x: number; y: number } | null>(null);
  const prev = () => onChange((index - 1 + count) % count);
  const next = () => onChange((index + 1) % count);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  });

  const image = images[index];
  if (!image) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={image.alt} onClick={onClose}>
      <button type="button" className="lightbox-close" aria-label="Close" onClick={onClose}>
        ×
      </button>
      {count > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          aria-label="Previous"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
        >
          ‹
        </button>
      )}
      {/* The stage fills the window, so a tap on its empty part is a tap on the
          backdrop and closes; a drag that ends there (a pan) does not. */}
      <figure
        className="lightbox-figure"
        onPointerDown={(e) => {
          down.current = { x: e.clientX, y: e.clientY };
        }}
        onClick={(e) => {
          e.stopPropagation();
          const t = e.target as HTMLElement;
          if (t.tagName === 'IMG' || t.closest('figcaption')) return;
          const d = down.current;
          if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) onClose();
        }}
      >
        {/* A new wrapper per image, so a zoom does not carry over to the next. */}
        <TransformWrapper
          key={image.src}
          minScale={1}
          maxScale={6}
          centerOnInit
          centerZoomedOut
          doubleClick={{ mode: 'toggle', step: 2 }}
          wheel={{ step: 0.2 }}
          pinch={{ step: 5 }}
          panning={{ velocityDisabled: true }}
        >
          <TransformComponent wrapperClass="lightbox-stage" contentClass="lightbox-content">
            <img src={image.src} alt={image.alt} draggable={false} onClick={(e) => e.stopPropagation()} />
          </TransformComponent>
        </TransformWrapper>
        {image.caption && <figcaption onClick={(e) => e.stopPropagation()}>{image.caption}</figcaption>}
      </figure>
      {count > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          aria-label="Next"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          ›
        </button>
      )}
    </div>
  );
};

export default Lightbox;
