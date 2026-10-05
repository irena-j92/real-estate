export default function Heading({
  as: Tag = "h2",
  italic = false,
  className = "",
  children,
}) {
  return (
    <Tag
      className={`${italic ? "font-accent-italic" : "font-sans"} ${className}`}
    >
      {children}
    </Tag>
  );
}
