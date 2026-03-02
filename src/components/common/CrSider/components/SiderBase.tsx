import React from 'react';
import classNames from 'classnames';
import deny from '@/assets/icons/deny.svg';

interface SiderBaseProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    isOpen?: boolean;
    onClose?: () => void;
    onClick?: (event: React.MouseEvent) => void;
    showCloseButton?: boolean;
}

export const SiderBase: React.FC<SiderBaseProps> = ({
    children,
    className,
    id,
    isOpen = true,
    onClose,
    onClick,
    showCloseButton = false,
    ...restProps
}) => {
    const handleClick = (event: React.MouseEvent) => {
        onClick?.(event);

        const element = event.target as HTMLElement;
        if (element.dataset.autoClose) {
            onClose?.();
        }
    };

    return (
        <div
            id={id}
            className={classNames('cr-sider', className, {
                'open': isOpen,
            })}
            onClick={handleClick}
            {...restProps}
        >
            {showCloseButton && onClose && (
                <div className="cr-sider-app-bar">
                    <button
                        type="button"
                        className="cr-sider-close-btn"
                        data-auto-close="true"
                        aria-label="Close sidebar"
                    >
                        <img src={deny} alt="Close" />
                    </button>
                </div>
            )}
            {children}
        </div>
    );
};