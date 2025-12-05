import { useState } from 'react';
import { Button, Dropdown } from '../ui';
import './ProductComponents.scss';

const ProductActions = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const quantityOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `Qty ${i + 1}`,
  }));

  const handleAddToCart = () => {
    onAddToCart?.({
      product,
      quantity,
    });
  };

  const monthlyPayment = product?.monthlyPayment || 200;
  const paymentProvider = product?.paymentProvider || 'Sezzle';

  return (
    <div className="product-actions">
      <div className="product-actions-engagement">
        <p className="product-actions-engagement-text">
          <strong>Customers love this.</strong> <em>122 People</em> purchased recently.
        </p>
      </div>

      <div className="product-actions-pricing">
        <div className="product-actions-price">
          <span className="product-actions-price-amount">
            ${product?.price?.toLocaleString() || '3,199'} VAT included.
          </span>
          <a href="#" className="product-actions-price-shipping">
            Plus shipping costs.
          </a>
        </div>
        {monthlyPayment && (
          <p className="product-actions-payment-plan">
            Or as low as <strong>${monthlyPayment}/mo</strong> with{' '}
            <a href="#" className="product-actions-payment-link">
              {paymentProvider}
            </a>
          </p>
        )}
      </div>

      <div className="product-actions-controls">
        <div className="product-actions-quantity">
          <Dropdown
            options={quantityOptions}
            value={quantity}
            onChange={setQuantity}
            placeholder="Qty 1"
          />
        </div>
        <Button
          variant="primary"
          className="product-actions-add-to-cart"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>

      <div className="product-actions-info">
        <AccordionLink title="Dimensions" />
        <AccordionLink
          title="Free fabric sample"
          linkText="Order now"
          linkHref="#"
        />
        <AccordionLink title="WE CARE" />
        <AccordionLink title="Shipping and Returns" />
        <AccordionLink title="10-Year Warranty & Treatment Instructions" />
      </div>
    </div>
  );
};

const AccordionLink = ({ title, linkText, linkHref }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="product-actions-info-item">
      <button
        className="product-actions-info-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {linkText && linkHref && (
          <a
            href={linkHref}
            className="product-actions-info-link"
            onClick={(e) => e.stopPropagation()}
          >
            {linkText}
          </a>
        )}
        <svg
          className={`product-actions-info-icon ${isOpen ? 'open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && <div className="product-actions-info-content">Content here</div>}
    </div>
  );
};

export default ProductActions;

