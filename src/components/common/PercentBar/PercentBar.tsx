import React from 'react';
import './style.css';

interface PercentBarProps {
  percentLabel?: string;
  countCovered: number;
  countTotal: number;
}

export const PercentBar: React.FC<PercentBarProps> = ({ 
  percentLabel,
  countCovered,
  countTotal 
}) => {
  
  const clampedValue = (countCovered / countTotal) * 100


  const formattedValue = `${clampedValue.toFixed(1)}%`;

  return (
    <div className="percent-bar">
      <p className="percent-bar__label">{percentLabel}</p>
      <div
        className="percent-bar__bar"
        role="progressbar"
        aria-valuenow={Number(clampedValue.toFixed(1))}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${formattedValue} ${percentLabel}`}
      >
        <div
          className="percent-bar__fill"
          style={{ width: `${clampedValue}%` }}
        >
          <span className="percent-bar__value">{formattedValue}</span>
        </div>
      </div>
    </div>
  );
};
