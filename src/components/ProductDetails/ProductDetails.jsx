import Rating from '../ui/Rating/Rating';
import './ProductDetails.scss';

const ProductDetails = ({ product }) => {
  const {
    name = 'Reese Sofa',
    collection = 'Bamidele Collection',
    rating = 5,
    reviewCount = 549,
    price = 3199,
    currency = '$',
    vatIncluded = true,
    shippingNote = 'Plus shipping costs.',
  } = product || {};

  return (
    <div className="product-details">
      <div className="product-details-header">
        <h1 className="product-details-name">{name}</h1>
        <p className="product-details-collection">{collection}</p>
              </div>
      <div className="product-details-price">
        <span className="product-details-price-amount">
          {currency}
          {price.toLocaleString()}
        </span>
        {vatIncluded && (
          <span className="product-details-price-note">VAT included.</span>
        )}
        {shippingNote && (
          <a href="#" className="product-details-price-shipping">{shippingNote}</a>
        )}
      </div>
      <div className="product-details-rating">
          <Rating rating={rating} reviewCount={reviewCount} />
        </div>
    </div>
  );
};

export default ProductDetails;

