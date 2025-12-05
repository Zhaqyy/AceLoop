import '../ui.scss';

const Rating = ({ rating = 0, reviewCount, showReviewCount = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="rating">
      <div className="rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            className="rating-star rating-star-full"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 0L10.163 5.528L16 6.112L11.82 9.944L13.056 16L8 12.528L2.944 16L4.18 9.944L0 6.112L5.837 5.528L8 0Z"
              fill="currentColor"
            />
          </svg>
        ))}
        {hasHalfStar && (
          <svg
            className="rating-star rating-star-half"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 0L10.163 5.528L16 6.112L11.82 9.944L13.056 16L8 12.528L2.944 16L4.18 9.944L0 6.112L5.837 5.528L8 0Z"
              fill="currentColor"
            />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            className="rating-star rating-star-empty"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 0L10.163 5.528L16 6.112L11.82 9.944L13.056 16L8 12.528L2.944 16L4.18 9.944L0 6.112L5.837 5.528L8 0Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        ))}
      </div>
      {showReviewCount && reviewCount && (
        <span className="rating-count">({reviewCount})</span>
      )}
    </div>
  );
};

export default Rating;

