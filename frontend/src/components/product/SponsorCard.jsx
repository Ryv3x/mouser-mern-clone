import React from 'react';

const SponsorCard = ({ sponsor }) => {
  return (
    <a
      href={sponsor.link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="sponsor-card m-2 inline-block"
    >
      <img
        src={sponsor.logoUrl}
        alt={sponsor.name}
        className="h-16 object-contain"
      />
    </a>
  );
};

export default SponsorCard;
