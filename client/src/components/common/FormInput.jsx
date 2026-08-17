import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  min,
  max
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          <span>
            {label}
            {required && <span className="required-star">*</span>}
          </span>
          {helperText && <span className="helper-hint">{helperText}</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: error ? 'var(--danger-500)' : 'var(--slate-400)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <Icon size={18} />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          className={`form-input ${error ? 'has-error' : ''}`}
          style={{
            paddingLeft: Icon ? '40px' : '0.95rem'
          }}
        />
      </div>

      {error && (
        <p className="error-text">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};
