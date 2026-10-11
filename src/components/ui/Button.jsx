import { forwardRef } from "react";
import { HoverContent } from "./HoverControl";

const VARIANTS = {
  yellow: "bg-yellow text-dark hover:bg-white focus-visible:bg-white",
  dark: "bg-dark text-white hover:bg-secondary focus-visible:bg-secondary",
  outline:
    "bg-transparent text-white border border-white/40 hover:border-yellow hover:text-yellow",
  "outline-dark":
    "bg-transparent text-dark border border-dark/30 hover:border-dark hover:bg-dark hover:text-white",
};

const Button = forwardRef(
  (
    {
      children,
      variant = "yellow",
      className = "",
      as: Tag = "button",
      icon,
      magnetic = true,
      ...props
    },
    ref,
  ) => {
    return (
      <Tag
        ref={ref}
        data-magnetic={magnetic ? "true" : undefined}
        data-variant={variant}
        className={`premium-button group inline-flex items-center justify-center gap-3 ${VARIANTS[variant]} ${className}`}
        {...props}
      >
        <span><HoverContent>{children}</HoverContent></span>
        {icon && (
          <span className="transition-transform duration-300 ease-cinematic group-hover:translate-x-1">
            <HoverContent>{icon}</HoverContent>
          </span>
        )}
      </Tag>
    );
  },
);

Button.displayName = "Button";
export default Button;
