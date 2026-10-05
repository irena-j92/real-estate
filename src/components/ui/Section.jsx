export default function Section({
  children,
  className = "",
  as: Tag = "section",
  id,
  ariaLabel,
}) {
  return (
    <Tag id={id} aria-label={ariaLabel} className={className}>
      {children}
    </Tag>
  );
}
