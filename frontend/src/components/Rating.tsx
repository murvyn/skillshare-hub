"use client";
import React, { useEffect, useState } from "react";

const Rating = ({ value }: { value?: number }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (value) {
      setRating(value);
    }
  }, [value]);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            className={`text-xl ${value ? "cursor-default" : "cursor-pointer"} ${
              starValue <= (hover || rating)
                ? "text-yellow-800"
                : "text-gray-300"
            }`}
            onClick={() => value ? null :setRating(starValue)}
            onMouseEnter={() => value ? null :setHover(starValue)}
            onMouseLeave={() => value ? null :setHover(0)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
