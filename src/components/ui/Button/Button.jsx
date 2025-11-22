import React from 'react';
import './Button.scss';

const Button = ({ children, variant = 'primary', ...props }) => {
  return (
    <button className={`button ${variant}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

