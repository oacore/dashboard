import './styles.css';
import type {ReactNode} from 'react';

interface CrFeatureLayoutProps {
    children: ReactNode;
    className?: string;
}

interface CrCardsWrapperProps {
    children: ReactNode;
    className?: string;
}

export const CrFeatureLayout = ({ children, className = '' }: CrFeatureLayoutProps) => {
    return (
        <div className={`layout-wrapper ${className}`.trim()}>
            {children}
        </div>
    );
};

export const CrCardsWrapper = ({ children, className = '' }: CrCardsWrapperProps) => {
    return (
        <div className={`cards-wrapper ${className}`.trim()}>
            {children}
        </div>
    );
};
