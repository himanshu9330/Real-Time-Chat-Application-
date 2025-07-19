import React from "react";

/**
 * AuthImagePattern component
 * Shows a 3x3 animated grid with a title and subtitle.
 * Hidden on smaller screens (mobile/tablet).
 */
const AuthImagePattern = ({ title, subtitle, squareCount = 9 }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        {/* Animated 3x3 Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(squareCount)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 transition-opacity duration-500 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl lg:text-2xl font-bold mb-4">{title}</h2>
        <p className="text-sm lg:text-base text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
