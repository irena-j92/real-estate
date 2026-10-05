export default function Card({ children, className = "", glass = false }) {
  return (
    <div
      className={`${glass ? "glass" : "bg-white"} ${className}`}
    >
      {children}
    </div>
  );
}
