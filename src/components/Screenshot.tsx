/** Below this width the mobile crop is served; the site's layout breaks at the same point. */
export const MOBILE_MAX_WIDTH = 768;

export interface ScreenshotSource {
  src: string;
  width: number;
  height: number;
}

interface ScreenshotProps {
  /** The full window. */
  full: ScreenshotSource;
  /** The crop for narrow screens; without one the full image serves everywhere. */
  mobile?: ScreenshotSource;
  alt: string;
  /** Off-screen at load: fetch when it nears the viewport. */
  lazy?: boolean;
  onClick?: () => void;
}

/**
 * A screenshot as a `<picture>`: the mobile crop under the breakpoint, the
 * full image above it. Each source carries its own width and height, so the
 * box is the right shape before the file arrives and nothing shifts.
 */
const Screenshot = ({ full, mobile, alt, lazy = false, onClick }: ScreenshotProps) => (
  <picture>
    {mobile && <source media={`(max-width: ${MOBILE_MAX_WIDTH}px)`} srcSet={mobile.src} width={mobile.width} height={mobile.height} />}
    <img
      src={full.src}
      width={full.width}
      height={full.height}
      alt={alt}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      className={onClick ? 'zoomable' : undefined}
      onClick={onClick}
    />
  </picture>
);

export default Screenshot;
