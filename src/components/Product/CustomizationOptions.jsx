import { useState } from 'react';
import Accordion from '../ui/Accordion/Accordion';
import Tabs from '../ui/Tabs/Tabs';
import './ProductComponents.scss';

/* eslint-disable react/prop-types */
const CustomizationOptions = ({ options = {}, onOptionChange }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    size: options.size?.selected || options.size?.options?.[0]?.value,
    upholstery: options.upholstery?.selected || options.upholstery?.fabric?.[0]?.value,
    legStyle: options.legStyle?.selected || options.legStyle?.options?.[0]?.value,
    legFinish: options.legFinish?.selected || options.legFinish?.options?.[0]?.value,
  });

  const [openAccordion, setOpenAccordion] = useState('upholstery'); // Default open

  const handleOptionChange = (category, value) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: value }));
    onOptionChange?.(category, value);
  };

  // Size options
  const sizeOptions = options.size?.options || [
    { value: '85', label: '85" Two-Cushion Sofa' },
    { value: '95', label: '95" Three-Cushion Sofa' },
    { value: '95', label: '95" Three-Cushion Sofa' },
  ];

  // Upholstery options
  const fabricOptions = options.upholstery?.fabric || [
    { value: 'jade', label: 'Jade', color: '#2d5016', category: 'Performance Velvet' },
    { value: 'wedgewood', label: 'Wedgewood', color: '#6b8e9f', category: 'Performance Velvet' },
    { value: 'taupe', label: 'Taupe', color: '#8b7d6b', category: 'Performance Velvet' },
    { value: 'dove', label: 'Dove', color: '#e8e8e8', category: 'Woven' },
    { value: 'ebony', label: 'Ebony', color: '#2c2c2c', category: 'Woven' },
    { value: 'java', label: 'Java', color: '#5c4033', category: 'Woven' },
  ];

  const leatherOptions = options.upholstery?.leather || [];

  const upholsteryTabs = [
    {
      id: 'fabric',
      label: 'Fabric',
      content: (
        <div className="customization-options-swatches">
          {['Performance Velvet', 'Woven'].map((category) => (
            <div key={category} className="customization-options-category">
              <h4 className="customization-options-category-title">{category}</h4>
              <div className="customization-options-swatch-group">
                {fabricOptions
                  .filter((opt) => opt.category === category)
                  .map((option) => (
                    <button
                      key={option.value}
                      className={`customization-options-swatch ${
                        selectedOptions.upholstery === option.value ? 'selected' : ''
                      }`}
                      onClick={() => handleOptionChange('upholstery', option.value)}
                      aria-label={option.label}
                    >
                      <div
                        className="customization-options-swatch-color"
                        style={{ backgroundColor: option.color }}
                      />
                      <span className="customization-options-swatch-label">
                        {option.label}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'leather',
      label: 'Leather',
      content: (
        <div className="customization-options-swatches">
          {leatherOptions.length > 0 ? (
            leatherOptions.map((option) => (
              <button
                key={option.value}
                className={`customization-options-swatch ${
                  selectedOptions.upholstery === option.value ? 'selected' : ''
                }`}
                onClick={() => handleOptionChange('upholstery', option.value)}
              >
                <div
                  className="customization-options-swatch-color"
                  style={{ backgroundColor: option.color }}
                />
                <span className="customization-options-swatch-label">
                  {option.label}
                </span>
              </button>
            ))
          ) : (
            <p className="customization-options-empty">No leather options available</p>
          )}
        </div>
      ),
    },
  ];

  // Leg style options
  const legStyleOptions = options.legStyle?.options || [
    { value: 'round', label: 'Round leg', icon: '○' },
    { value: 'square', label: 'Square leg', icon: '□' },
    { value: 'taper', label: 'Taper leg', icon: '▽' },
  ];

  // Leg finish options
  const legFinishOptions = options.legFinish?.options || [
    { value: 'brushed-gold', label: 'Brushed Gold', color: '#d4af37' },
    { value: 'graphite', label: 'Graphite', color: '#4a4a4a' },
    { value: 'stainless-steel', label: 'Stainless Steel', color: '#c0c0c0' },
  ];

  // Get selected option labels
  const selectedSizeLabel = sizeOptions.find(opt => opt.value === selectedOptions.size)?.label;
  const selectedUpholsteryOption = [...fabricOptions, ...leatherOptions].find(
    opt => opt.value === selectedOptions.upholstery
  );
  const selectedUpholsteryLabel = selectedUpholsteryOption
    ? selectedUpholsteryOption.category
      ? `${selectedUpholsteryOption.label} (${selectedUpholsteryOption.category})`
      : selectedUpholsteryOption.label
    : null;
  const selectedLegStyleLabel = legStyleOptions.find(opt => opt.value === selectedOptions.legStyle)?.label;
  const selectedLegFinishLabel = legFinishOptions.find(opt => opt.value === selectedOptions.legFinish)?.label;

  const handleAccordionToggle = (accordionId) => {
    setOpenAccordion((prev) => (prev === accordionId ? null : accordionId));
  };

  return (
    <div className="customization-options">
      <Accordion
        title="Size"
        optionsCount={sizeOptions.length}
        isOpen={openAccordion === 'size'}
        onToggle={() => handleAccordionToggle('size')}
        selectedValue={selectedSizeLabel}
      >
        <div className="customization-options-list">
          {sizeOptions.map((option) => {
            // Extract size number from label (e.g., "85" from '85" Two-Cushion Sofa')
            const sizeNumber = option.label.match(/^(\d+)/)?.[1] || option.value;
            return (
              <button
                key={option.value}
                className={`customization-options-item ${
                  selectedOptions.size === option.value ? 'selected' : ''
                }`}
                onClick={() => handleOptionChange('size', option.value)}
                title={option.label}
              >
                {sizeNumber}&quot;
              </button>
            );
          })}
        </div>
      </Accordion>

      <Accordion
        title="Upholstery"
        optionsCount={fabricOptions.length + leatherOptions.length}
        isOpen={openAccordion === 'upholstery'}
        onToggle={() => handleAccordionToggle('upholstery')}
        selectedValue={selectedUpholsteryLabel}
      >
        <Tabs tabs={upholsteryTabs} defaultTab="fabric" />
      </Accordion>

      <Accordion
        title="Leg Style"
        optionsCount={legStyleOptions.length}
        isOpen={openAccordion === 'legStyle'}
        onToggle={() => handleAccordionToggle('legStyle')}
        selectedValue={selectedLegStyleLabel}
      >
        <div className="customization-options-leg-styles">
          {legStyleOptions.map((option) => (
            <button
              key={option.value}
              className={`customization-options-leg-style ${
                selectedOptions.legStyle === option.value ? 'selected' : ''
              }`}
              onClick={() => handleOptionChange('legStyle', option.value)}
              aria-label={option.label}
            >
              <div className="customization-options-leg-style-icon">
                {option.icon}
              </div>
              <span className="customization-options-leg-style-label">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </Accordion>

      <Accordion
        title="Leg Finish"
        optionsCount={legFinishOptions.length}
        isOpen={openAccordion === 'legFinish'}
        onToggle={() => handleAccordionToggle('legFinish')}
        selectedValue={selectedLegFinishLabel}
      >
        <div className="customization-options-swatches customization-options-swatches--bordered">
          {legFinishOptions.map((option) => (
            <button
              key={option.value}
              className={`customization-options-swatch ${
                selectedOptions.legFinish === option.value ? 'selected' : ''
              }`}
              onClick={() => handleOptionChange('legFinish', option.value)}
              aria-label={option.label}
            >
              <div
                className="customization-options-swatch-color"
                style={{ backgroundColor: option.color }}
              />
              <span className="customization-options-swatch-label">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </Accordion>
    </div>
  );
};

export default CustomizationOptions;

