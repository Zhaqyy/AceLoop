import { useState } from 'react';
import Accordion from '../ui/Accordion/Accordion';
import Tabs from '../ui/Tabs/Tabs';
import './CustomizationOptions.scss';

const CustomizationOptions = ({ options = {}, onOptionChange }) => {
  const [selectedOptions, setSelectedOptions] = useState({
    size: options.size?.selected || options.size?.options?.[0]?.value,
    upholstery: options.upholstery?.selected || options.upholstery?.fabric?.[0]?.value,
    legStyle: options.legStyle?.selected || options.legStyle?.options?.[0]?.value,
    legFinish: options.legFinish?.selected || options.legFinish?.options?.[0]?.value,
  });

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

  return (
    <div className="customization-options">
      <Accordion
        title="Size"
        optionsCount={sizeOptions.length}
        defaultOpen={false}
      >
        <div className="customization-options-list">
          {sizeOptions.map((option) => (
            <button
              key={option.value}
              className={`customization-options-item ${
                selectedOptions.size === option.value ? 'selected' : ''
              }`}
              onClick={() => handleOptionChange('size', option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Accordion>

      <Accordion
        title="Upholstery"
        optionsCount={fabricOptions.length + leatherOptions.length}
        defaultOpen={true}
      >
        <Tabs tabs={upholsteryTabs} defaultTab="fabric" />
      </Accordion>

      <Accordion
        title="Leg Style"
        optionsCount={legStyleOptions.length}
        defaultOpen={true}
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
        defaultOpen={true}
      >
        <div className="customization-options-swatches">
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

