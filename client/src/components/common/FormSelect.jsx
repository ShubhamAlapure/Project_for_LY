import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
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

      <select
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-select ${error ? 'has-error' : ''}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="error-text">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};
