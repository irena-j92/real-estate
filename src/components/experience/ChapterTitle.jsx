export default function ChapterTitle({
  lines,
  className = "",
  as: Tag = "h2",
}) {
  const label = lines.map((line) => line.text).join(" ");
  return (
    <Tag className={`chapter-title ${className}`} aria-label={label}>
      {lines.map((line, i) => (
        <span className={`title-mask ${line.italic ? "is-serif" : ""}`} key={i}>
          {line.text.split(" ").map((word, j) => (
            <span
              className="reveal-word"
              key={j}
              style={{ "--word-delay": `${j * 35}ms` }}
            >
              {word}
              {j < line.text.split(" ").length - 1 ? "\u00a0" : ""}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
