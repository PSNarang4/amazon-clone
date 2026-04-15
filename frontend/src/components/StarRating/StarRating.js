import React from 'react';

function StarRating({ rating, reviewCount, size = 14 }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<span key={i} style={{ color: '#f90', fontSize: size }}>★</span>);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<span key={i} style={{ color: '#f90', fontSize: size }}>★</span>);
    } else {
      stars.push(<span key={i} style={{ color: '#ddd', fontSize: size }}>★</span>);
    }
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {stars}
      {reviewCount !== undefined && (
        <span style={{ fontSize: size - 1, color: '#007185', marginLeft: 4 }}>
          {reviewCount.toLocaleString()}
        </span>
      )}
    </span>
  );
}

export default StarRating;
