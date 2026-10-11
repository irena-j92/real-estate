import { Children, cloneElement, isValidElement } from "react";

function rollIcon(icon) {
  return (
    <span className="hover-roll-mask hover-roll-icon" aria-hidden="true">
      <span className="hover-roll-track">
        {icon}
        <span className="hover-roll-icon-copy">{icon}</span>
      </span>
    </span>
  );
}

// Keep both faces declarative so changing labels never disrupt React's DOM.
// The second text face is CSS content, preserving one accessible label.
function rollChildren(children) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      if (!String(child).trim()) return child;
      return (
        <span className="hover-roll-mask">
          <span className="hover-roll-track" data-hover-label={String(child)}>
            {child}
          </span>
        </span>
      );
    }
    if (!isValidElement(child)) return child;
    if (child.props.className === "architecture-mark") {
      return cloneElement(child, {}, rollIcon(
        <span className="architecture-grid">{child.props.children}</span>,
      ));
    }
    if ((child.type === "img" && child.props.className === "sunny-logo") ||
        (child.type === "svg" && child.props.viewBox === "0 0 32 32") ||
        child.props.className === "service-chapter-dot") return rollIcon(child);
    if (typeof child.type === "string" && child.props.children &&
        !["svg", "picture"].includes(child.type)) {
      return cloneElement(child, {}, rollChildren(child.props.children));
    }
    // Roll compact icons, leaving property photographs and orbit artwork intact.
    if (typeof child.type === "function" && /^Fi/.test(child.type.name || "")) {
      return rollIcon(child);
    }
    return child;
  });
}

export function HoverContent({ children }) {
  return rollChildren(children);
}

export default function HoverControl({ as: Tag = "button", children, ...props }) {
  return <Tag {...props}>{rollChildren(children)}</Tag>;
}
