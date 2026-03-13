import React from 'react';

interface SiderDetailItemProps {
    label: string;
    value: React.ReactNode;
    icon?: string;
    iconAlt?: string;
    isDanger?: boolean;
}

export const SiderDetailItem: React.FC<SiderDetailItemProps> = ({
    label,
    value,
    icon,
    iconAlt = '',
    isDanger = false,
}) => {
    return (
        <div className="cr-sider-detail-item">
            <span className="cr-sider-detail-name">{label}</span>
            <div className="cr-sider-detail-value">
                {icon && (
                    <img
                        src={icon}
                        alt={iconAlt}
                        className={`type-icon ${isDanger ? 'danger-icon' : ''}`}
                    />
                )}
                {value}
            </div>
        </div>
    );
};
