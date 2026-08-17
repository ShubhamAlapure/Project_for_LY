import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
  error,
  helperText,
  disabled = false
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

      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        disabled={disabled}
        className={`form-textarea ${error ? 'has-error' : ''}`}
      />

      {error && (
        <p className="error-text">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};
