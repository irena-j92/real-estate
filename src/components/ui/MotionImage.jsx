// Scroll translation and hover zoom live on separate layers, so the two
// interactions can run together without overwriting each other's transforms.
export default function MotionImage({ src, alt, className = "", scroll = true, reveal = false, ...props }) {
  return <div className={`motion-image ${className}`} data-reveal={reveal || undefined}>
    <div className="motion-image-drift" data-image-drift={scroll ? "" : undefined}>
      <img src={src} alt={alt} {...props} />
    </div>
  </div>;
}
