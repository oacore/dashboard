import React, { forwardRef, useState, useId } from 'react';
import { Input } from 'antd';
import type { InputProps, InputRef } from 'antd';
import './styles.css';

export interface CrInputProps extends Omit<InputProps, 'onChange'> {
    onChange?: (value: string) => void;
    size?: 'small' | 'middle' | 'large';
    isPassword?: boolean;
    label?: string;
}

export const CrInput = forwardRef<InputRef, CrInputProps>(({
    placeholder,
    value = '',
    onChange,
    onBlur,
    onFocus,
    allowClear = false,
    size = 'middle',
    className = '',
    style,
    disabled = false,
    readOnly = false,
    type = 'text',
    name,
    id,
    autoComplete,
    autoFocus = false,
    maxLength,
    minLength,
    required = false,
    pattern,
    title,
    isPassword = false,
    label,
    ...rest
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const inputId = id || name || generatedId;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const hasValue = Boolean(value);
    const isLabelFloated = isFocused || hasValue;
    // Show placeholder when label is floated (focused or has value)
    const shouldShowPlaceholder = label ? isLabelFloated : true;

    const inputProps = {
        ref,
        value,
        onChange: handleChange,
        onBlur: handleBlur,
        onFocus: handleFocus,
        allowClear,
        size,
        className: label ? `cr-input-with-label ${className}` : className,
        style,
        disabled,
        readOnly,
        name,
        id: inputId,
        autoComplete,
        autoFocus,
        maxLength,
        minLength,
        required,
        pattern,
        title,
        placeholder: shouldShowPlaceholder ? placeholder : '',
        ...rest,
    };

    if (label) {
        const inputComponent = isPassword ? (
            <Input.Password {...inputProps} />
        ) : (
            <Input {...inputProps} type={type} />
        );

        return (
            <div className={`cr-input-wrapper ${isLabelFloated ? 'label-floated' : ''} ${disabled ? 'disabled' : ''}`}>
                {inputComponent}
                <label
                    htmlFor={inputId}
                    className={`cr-input-label ${isLabelFloated ? 'floated' : ''}`}
                >
                    {label}
                    {required && <span className="cr-input-required"> *</span>}
                </label>
            </div>
        );
    }

    if (isPassword) {
        return (
            <Input.Password
                ref={ref}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                allowClear={allowClear}
                size={size}
                className={className}
                style={style}
                disabled={disabled}
                readOnly={readOnly}
                name={name}
                id={id}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                maxLength={maxLength}
                minLength={minLength}
                required={required}
                pattern={pattern}
                title={title}
                {...rest}
            />
        );
    }

    return (
        <Input
            ref={ref}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            allowClear={allowClear}
            size={size}
            className={className}
            style={style}
            disabled={disabled}
            readOnly={readOnly}
            type={type}
            name={name}
            id={id}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            required={required}
            pattern={pattern}
            title={title}
            {...rest}
        />
    );
});

CrInput.displayName = 'CrInput';
