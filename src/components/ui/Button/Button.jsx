import { Link } from "react-router-dom";
import "../ui.scss";

/* eslint-disable react/prop-types */
/**
 * Button component with multiple variants
 * @param {React.ReactNode} children - Button content
 * @param {string} variant - Button variant: 'primary', 'secondary', or 'underline-arrow'
 * @param {string} to - React Router link path (renders as Link)
 * @param {string} href - External link URL (renders as anchor tag)
 * @param {string} textColor - Custom text color (overrides variant default)
 * @param {string} backgroundColor - Custom background color (overrides variant default)
 * @param {string} iconColor - Custom icon/arrow color (for underline-arrow variant)
 * @param {string} underlineColor - Custom underline color (for underline-arrow variant)
 * @param {object} props - Additional button/link props
 */
const Button = ({ 
  children, 
  variant = "primary", 
  to, 
  href,
  textColor,
  backgroundColor,
  iconColor,
  underlineColor,
  ...props 
}) => {
  // Arrow SVG for underline-arrow variant
  const ArrowIcon = () => (
    <svg
      className="button-arrow"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style={iconColor ? { fill: iconColor } : {}}
    >
      <path d="M16.175 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.175l-4.9-4.9q-.3-.3-.288-.7t.313-.7q.3-.275.7-.288t.7.288l6.6 6.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-6.6 6.6q-.275.275-.687.275T11.3 19.3q-.3-.3-.3-.712t.3-.713z" />
    </svg>
  );

  const { disabled, ...restProps } = props;
  const className = `button ${variant}${disabled ? ' disabled' : ''}`;
  
  // Build inline styles for color customization
  const style = {};
  if (textColor) style.color = textColor;
  if (backgroundColor) style.backgroundColor = backgroundColor;
  
  // For underline-arrow variant, add underline color as CSS variable
  const underlineStyle = underlineColor 
    ? { '--underline-color': underlineColor } 
    : {};
  
  const combinedStyle = { ...style, ...underlineStyle };
  
  const content =
    variant === "underline-arrow" ? (
      <>
        <span 
          className="button-underline-text"
          style={textColor ? { color: textColor } : {}}
        >
          {children}
        </span>
        <ArrowIcon />
      </>
    ) : (
      children
    );

  // If disabled, always render as button to prevent navigation
  if (disabled) {
    return (
      <button className={className} style={combinedStyle} disabled {...restProps}>
        {content}
      </button>
    );
  }

  // Render as React Router Link if 'to' prop is provided
  if (to) {
    return (
      <Link to={to} className={className} style={combinedStyle} {...restProps}>
        {content}
      </Link>
    );
  }

  // Render as anchor tag if 'href' prop is provided
  if (href) {
    return (
      <a href={href} className={className} style={combinedStyle} {...restProps}>
        {content}
      </a>
    );
  }

  // Default: render as button
  return (
    <button className={className} style={combinedStyle} {...restProps}>
      {content}
    </button>
  );
};

export default Button;
