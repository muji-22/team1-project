import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';  // 實心星星
import { FaRegStar } from 'react-icons/fa'; // 空心星星

const StarRating = ({ totalStars = 5, initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex">
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          const isActive = (hover || rating) >= starValue;
          
          return (
            <button
              key={index}
              type="button"
              className="btn btn-link p-0 mx-1 text-decoration-none"
              onClick={() => handleRatingChange(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
              aria-label={`給 ${starValue} 顆星`}
            >
              {isActive ? (
                <FaStar className="text-custom" size={24} />
              ) : (
                <FaRegStar className="text-secondary" size={24} />
              )}
            </button>
          );
        })}
      </div>

        <span className="fs-5 p-2">
        {rating > 0 ? `${rating} 顆星` : '尚未評分'}
        </span>

    </div>
  );
};

export default StarRating;