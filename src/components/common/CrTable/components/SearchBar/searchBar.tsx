import { useState, useCallback, useEffect, useRef } from 'react';
import { CrInput } from '@oacore/core-ui';

export interface SearchBarProps {
    placeholder?: string;
    onSearch?: (searchTerm: string) => void;
    allowClear?: boolean;
    size?: 'small' | 'middle' | 'large';
    className?: string;
    style?: React.CSSProperties;
    debounceMs?: number;
    value?: string;
}

export const CrSearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Any identifier, title, author...',
    onSearch,
    allowClear = true,
    size = 'middle',
    className,
    style,
    debounceMs = 300,
    value = '',
}) => {
    const [searchTerm, setSearchTerm] = useState(value);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Update local state when value prop changes
    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value);

        // Clear previous timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set new timeout for debounced search
        debounceTimeoutRef.current = setTimeout(() => {
            onSearch?.(value);
        }, debounceMs);
    }, [onSearch, debounceMs]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={className} style={style}>
            <CrInput
                label="Search"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearch}
                allowClear={allowClear}
                size={size}
            />
        </div>
    );
};
