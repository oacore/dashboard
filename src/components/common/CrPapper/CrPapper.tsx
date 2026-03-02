import React from 'react';
import './styles.css';

export interface CrPaperProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const CrPaper: React.FC<CrPaperProps> = ({
    children,
    className = '',
    style = {}
}) => {
    return (
        <div
            className={`cr-paper ${className}`.trim()}
            style={style}
        >
            {children}
        </div>
    );
};