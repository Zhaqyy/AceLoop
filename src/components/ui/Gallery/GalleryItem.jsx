/* eslint-disable react/prop-types */
/**
 * GalleryItem Component - Individual project item in the gallery
 * @param {number} index - Index of the project
 * @param {string} title - Project title
 * @param {string} description - Project description
 * @param {Function} setModal - Function to update modal state
 */
const GalleryItem = ({ index, title, description, setModal }) => {
  return (
    <div
      className="gallery-item"
      onMouseEnter={() => {
        setModal({ active: true, index });
      }}
      onMouseLeave={() => {
        setModal({ active: false, index });
      }}
    >
      <h2 className="gallery-item-title">{title}</h2>
      <p className="gallery-item-description">{description}</p>
    </div>
  );
};

export default GalleryItem;

