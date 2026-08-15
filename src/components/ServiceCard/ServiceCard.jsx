import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Lock, ArrowRight } from 'lucide-react';

export const ServiceCard = ({ service, onLockedClick, index = 0 }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const IconComponent = Icons[service.icon] || Icons.Box;
  const isLocked =
    service.status === 'comingSoon' ||
    service.status === 'locked' ||
    service.status === 'inactive';

  const getLocalizedName = () => {
    if (i18n.language === 'hi' && service.nameHi) return service.nameHi;
    if (i18n.language === 'bn' && service.nameBn) return service.nameBn;
    return service.nameEn;
  };

  const handleClick = () => {
    if (isLocked) {
      onLockedClick?.(getLocalizedName());
      return;
    }

    if (service.status === 'active') {
      navigate(`/services/${service.slug}`);
    }
  };

  // Fallback image if not provided
  const imageUrl = service.image || 'https://via.placeholder.com/400x300?text=Service';

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={service.status === 'active' ? { y: -3 } : {}}
      onClick={handleClick}
      className={`group relative w-full overflow-hidden rounded-3xl border text-left transition-all duration-300 ${
        service.status === 'active'
          ? 'border-border-60 bg-surface-60 backdrop-blur hover:border-primary-50 hover:shadow-md'
          : 'border-border-50 bg-surface-40'
      }`}
    >
      {/* 
        Image on top - Fixed height to handle any aspect ratio.
        Adjust h-48 to h-56 or h-64 if you want it larger/smaller.
      */}
      <div className="relative w-full overflow-hidden bg-gray-100 h-48">
        <img
          src={imageUrl}
          alt={getLocalizedName()}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Small icon badge on the image (optional) */}
        <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur">
          <IconComponent className="h-4 w-4 text-primary-700" />
        </div>
      </div>

      {/* Content below the image */}
      <div className="p-6 pt-4">
        <h3 className="line-clamp-1 font-display text-lg font-semibold text-text-primary">
          {getLocalizedName()}
        </h3>

        {service.shortDescription && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
            {service.shortDescription}
          </p>
        )}

        {service.status === 'active' && (
          <div className="mt-4 inline-flex items-center text-sm font-medium text-primary-700">
            {t('services.bookInspection')}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        )}
      </div>

      {/* Lock overlay – covers the entire card including the image */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background-60 backdrop-blur-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-80 px-3 py-1.5 text-xs font-medium text-text-muted">
            <Lock className="h-3 w-3" />
            {t('services.comingSoon')}
          </span>
        </div>
      )}
    </motion.button>
  );
};