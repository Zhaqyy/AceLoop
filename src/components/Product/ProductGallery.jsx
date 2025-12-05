import { useState } from 'react';
import './ProductComponents.scss';

const ProductGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  // Default placeholder images if none provided
  const defaultImages = [
    { src: '/Products/pconfig.webp', type: '360 View' },
    { src: '/Products/ppacket.webp', type: 'Packetshot' },
    { src: '/Products/plife.webp', type: 'Animation' },
    { src: '/Products/plife2.webp', type: 'Lifestyle' },
    { src: '/Products/ppacket2.webp', type: 'Packetshot' },
    { src: '/Products/plife3.webp', type: 'Lifestyle' },
  ];

  const displayImages = images.length > 0 ? images : defaultImages;

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <div className="product-gallery-image-wrapper">
          <img
            src={displayImages[selectedImage]?.src || displayImages[0]?.src}
            alt={`Product view ${selectedImage + 1}`}
            className="product-gallery-main-image"
          />
          {displayImages[selectedImage]?.type && (
            <div className="product-gallery-overlay">
              {displayImages[selectedImage].type}
            </div>
          )}
        </div>
      </div>
      <div className="product-gallery-thumbnails">
        {displayImages.map((image, index) => (
          <button
            key={index}
            className={`product-gallery-thumbnail ${
              selectedImage === index ? 'active' : ''
            }`}
            onClick={() => setSelectedImage(index)}
            aria-label={`View image ${index + 1}`}
          >
            <img src={image.src} alt={`Thumbnail ${index + 1}`} />
            {image.type && (
              <span className="product-gallery-thumbnail-label">{image.type}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;

