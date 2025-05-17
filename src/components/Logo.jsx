import React from "react";

const Logo = ({ className }) => {
  return (
    <img
      src="/LOGO UFC.png"
      alt="UFC Logo"
      className={`h-24 w-auto object-contain ${className}`}
    />
  );
};

export default Logo;
