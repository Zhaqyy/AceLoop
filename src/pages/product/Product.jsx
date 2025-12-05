import ProductGallery from '@/components/Product/ProductGallery';
import ProductDetails from '@/components/Product/ProductDetails';
import CustomizationOptions from '@/components/Product/CustomizationOptions';
import ProductActions from '@/components/Product/ProductActions';
import './Product.scss';

const Product = () => {
  // Sample product data - in a real app, this would come from props or API
  const product = {
    name: 'Reese Sofa',
    collection: 'Bamidele Collection',
    rating: 5,
    reviewCount: 549,
    price: 3199,
    monthlyPayment: 200,
    paymentProvider: 'Sezzle',
    images: [
      { src: '/Products/pconfig.webp', type: '360 View' },
      { src: '/Products/ppacket.webp', type: 'Packetshot' },
      { src: '/Products/plife.webp', type: 'Animation' },
    { src: '/Products/plife2.webp', type: 'Lifestyle' },
    { src: '/Products/ppacket2.webp', type: 'Packetshot' },
    { src: '/Products/plife3.webp', type: 'Lifestyle' },
  ]};

  const customizationOptions = {
    size: {
      options: [
        { value: '85', label: '85" Two-Cushion Sofa' },
        { value: '95', label: '95" Three-Cushion Sofa' },
      ],
    },
    upholstery: {
      fabric: [
        { value: 'jade', label: 'Jade', color: '#2d5016', category: 'Performance Velvet' },
        { value: 'wedgewood', label: 'Wedgewood', color: '#6b8e9f', category: 'Performance Velvet' },
        { value: 'taupe', label: 'Taupe', color: '#8b7d6b', category: 'Performance Velvet' },
        { value: 'dove', label: 'Dove', color: '#e8e8e8', category: 'Woven' },
        { value: 'ebony', label: 'Ebony', color: '#2c2c2c', category: 'Woven' },
        { value: 'java', label: 'Java', color: '#5c4033', category: 'Woven' },
      ],
      leather: [],
    },
    legStyle: {
      options: [
        { value: 'round', label: 'Round leg', icon: '○' },
        { value: 'square', label: 'Square leg', icon: '□' },
        { value: 'taper', label: 'Taper leg', icon: '▽' },
      ],
    },
    legFinish: {
      options: [
        { value: 'brushed-gold', label: 'Brushed Gold', color: '#d4af37' },
        { value: 'graphite', label: 'Graphite', color: '#4a4a4a' },
        { value: 'stainless-steel', label: 'Stainless Steel', color: '#c0c0c0' },
      ],
    },
  };

  const handleOptionChange = (category, value) => {
    console.log(`Option changed: ${category} = ${value}`);
    // Handle option change logic here
  };

  const handleAddToCart = (data) => {
    console.log('Add to cart:', data);
    // Handle add to cart logic here
  };

  return (
    <div className="product-page">
      <div className="product-page-container">
        <div className="product-page-content">
          <div className="product-page-gallery">
            <ProductGallery images={product.images} />
          </div>
          <div className="product-page-details">
            <ProductDetails product={product} />
            <CustomizationOptions
              options={customizationOptions}
              onOptionChange={handleOptionChange}
            />
            <ProductActions product={product} onAddToCart={handleAddToCart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;

