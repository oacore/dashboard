import React from 'react';
import './styles.css';
import imagePlaceholder from '@/assets/icons/imagePlaceholder.svg';

type DataProviderLogoSize = 'sm' | 'md' | 'ml' | 'lg';

interface DataProviderLogoProps {
    alt: string;
    imageSrc?: string;
    size?: DataProviderLogoSize;
    useDefault?: boolean;
    className?: string;
}

export const DataProviderLogo: React.FC<DataProviderLogoProps> = ({
    alt,
    imageSrc,
    size = 'md',
    useDefault = true,
    className = '',
}) => {
    const containerClassName = `
    data-provider-logo
    ${size}
    ${!useDefault ? 'hidden' : 'circle'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <div className={containerClassName}>
            {imageSrc ? (
                <img 
                    src={imageSrc} 
                    alt={alt} 
                    className="image"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== imagePlaceholder) {
                            target.src = imagePlaceholder;
                        }
                    }}
                />
            ) : (
                <img
                    src={imagePlaceholder}
                    className="image"
                    alt=""
                />
            )}
        </div>
    );
};

export default DataProviderLogo;
