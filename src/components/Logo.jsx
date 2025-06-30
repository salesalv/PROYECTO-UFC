import React from "react";
import { useTranslation } from 'react-i18next';

const Logo = ({ className }) => {
  const { t } = useTranslation();
  return (
    <img
      src="/LOGO UFC.png"
      alt={t('logo.alt')}
      className={`h-24 w-auto object-contain ${className}`}
    />
  );
};

export default Logo;
