import { forwardRef } from 'react';
import classNames from 'classnames';
import "./styles.css"

export interface CrMessageProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'success' | 'warning' | 'danger' | 'info';
    fill?: boolean;
    alignItems?: 'center' | 'flex-start';
}

export const CrMessage = forwardRef<HTMLDivElement, CrMessageProps>(
    (
        {
            children,
            className,
            variant,
            fill = false,
            alignItems = 'center',
            ...restProps
        },
        ref
    ) => (
        <div
            ref={ref}
            className={classNames(
                "message",
                variant && variant,
                fill && "fill",
                alignItems === 'flex-start' && "align-start",
                className
            )}
            {...restProps}
        >
            {children}
        </div>
    )
);

CrMessage.displayName = 'CrMessage';
