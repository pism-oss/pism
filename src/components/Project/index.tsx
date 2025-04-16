import React from 'react';

import './index.css';

interface MarketingCardProps {
  title: string;
  description: string;
  tags: string[];
  url: string,
  image: string;
}

const MarketingCard: React.FC<MarketingCardProps> =
  ({
     title,
     description,
     tags,
     url,
     image,
   }) => {
    return (
      <div style={{
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
           onMouseEnter={(e) => {
             e.currentTarget.style.transform = 'translateY(-4px)';
             e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
           }}
           onClick={() => {
             window.open(url, '_blank')
           }}
      >
        <img src={image} alt="Marketing" className="card-image"/>
        <div className="card-content">
          <h3>{title}</h3>
          <p>{description}</p>
          <div className="card-tags">
            {tags.map((tag, i) => (
              <span className="tag" key={i}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default MarketingCard;
