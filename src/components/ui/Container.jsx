export default function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-site ${className}`}>{children}</div>
  );
}
