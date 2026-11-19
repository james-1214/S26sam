import { useState, type ImgHTMLAttributes } from 'react'

interface SmartImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height' | 'alt'> {
  src?: string
  alt: string
  width: number
  height: number
  /** Above-the-fold image: loaded eagerly with high priority. */
  priority?: boolean
}

/** Image with explicit intrinsic size (no layout shift), lazy loading and a graceful fallback. */
export default function SmartImage({ src, alt, width, height, priority = false, className, style, ...rest }: SmartImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`img-fallback ${className ?? ''}`}
        style={{ aspectRatio: `${width} / ${height}`, ...style }}
      >
        <span>Image unavailable</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      draggable={false}
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
