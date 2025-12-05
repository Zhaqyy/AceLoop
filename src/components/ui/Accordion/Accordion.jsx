import { useState } from 'react';
import '../ui.scss';

/* eslint-disable react/prop-types */
const Accordion = ({ title, children, defaultOpen = false, isOpen: controlledIsOpen, onToggle, optionsCount, selectedValue }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div className="accordion">
      <button
        className="accordion-header"
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <div className="accordion-header-content">
          <div className="accordion-header-left">
            <div className="accordion-header-left-content">
            <span className="accordion-title">{title}</span>
            {optionsCount && (
              <span className="accordion-count">{optionsCount} options</span>
            )}
            </div>

            {selectedValue && (
              <span className="accordion-selected">{selectedValue}</span>
            )}
          </div>
        </div>
        <svg
          className={`accordion-icon ${isOpen ? 'open' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default Accordion;

