import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Autocomplete } from '@/components/ui/Autocomplete/Autocomplete';
import { APP_CONSTANTS } from '@/config/constants';
import styles from './ProfileCityChips.module.css';

interface ProfileCityChipsProps {
  serviceCities: string[];
  onAddCity: (city: string) => void;
  onRemoveCity: (city: string) => void;
}

export const ProfileCityChips: React.FC<ProfileCityChipsProps> = ({
  serviceCities,
  onAddCity,
  onRemoveCity,
}) => {
  const [selectedAddCity, setSelectedAddCity] = useState('');

  return (
    <div className={styles.formArea}>
      <label className={styles.formLabel}>
        <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
        Active Service Cities Covered ({serviceCities.length} selected)
      </label>

      <div className={styles.cityChipContainer}>
        {serviceCities.map((svcCity) => (
          <span key={svcCity} className={styles.cityChip}>
            {svcCity}
            <button
              type='button'
              onClick={() => onRemoveCity(svcCity)}
              className={styles.cityChipRemoveBtn}
              aria-label={`Remove ${svcCity}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      <div style={{ marginTop: '6px' }}>
        <Autocomplete
          options={APP_CONSTANTS.CITIES.filter((c) => !serviceCities.includes(c))}
          value={selectedAddCity}
          onChange={(newCity) => {
            onAddCity(newCity);
            setSelectedAddCity('');
          }}
          placeholder='+ Add another regional service city...'
        />
      </div>
    </div>
  );
};
