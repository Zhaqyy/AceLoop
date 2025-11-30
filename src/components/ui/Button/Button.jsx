import { Link } from "react-router-dom";
import "./Button.scss";

/* eslint-disable react/prop-types */
/**
 * Button component with multiple variants
 * @param {React.ReactNode} children - Button content
 * @param {string} variant - Button variant: 'primary', 'secondary', or 'underline-arrow'
 * @param {string} to - React Router link path (renders as Link)
 * @param {string} href - External link URL (renders as anchor tag)
 * @param {object} props - Additional button/link props
 */
const Button = ({ children, variant = "primary", to, href, ...props }) => {
  // Arrow SVG for underline-arrow variant
  const ArrowIcon = () => (
    <svg
      className="button-arrow"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M16.175 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.175l-4.9-4.9q-.3-.3-.288-.7t.313-.7q.3-.275.7-.288t.7.288l6.6 6.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-6.6 6.6q-.275.275-.687.275T11.3 19.3q-.3-.3-.3-.712t.3-.713z" />
    </svg>
  );

  const { disabled, ...restProps } = props;
  const className = `button ${variant}${disabled ? ' disabled' : ''}`;
  const content =
    variant === "underline-arrow" ? (
      <>
        <span className="button-underline-text">{children}</span>
        <ArrowIcon />
      </>
    ) : (
      children
    );

  // If disabled, always render as button to prevent navigation
  if (disabled) {
    return (
      <button className={className} disabled {...restProps}>
        {content}
      </button>
    );
  }

  // Render as React Router Link if 'to' prop is provided
  if (to) {
    return (
      <Link to={to} className={className} {...restProps}>
        {content}
      </Link>
    );
  }

  // Render as anchor tag if 'href' prop is provided
  if (href) {
    return (
      <a href={href} className={className} {...restProps}>
        {content}
      </a>
    );
  }

  // Default: render as button
  return (
    <button className={className} {...restProps}>
      {content}
    </button>
  );
};

export default Button;
