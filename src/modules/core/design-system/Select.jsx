import React, { forwardRef } from 'react';

export const Select = forwardRef(({ label, options, error, required, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (<div className="form-group">
        {label && (<label htmlFor={selectId} className="form-label">
            {label} {required && <span className="required">*</span>}
          </label>)}
        <select id={selectId} ref={ref} className={`form-select ${error ? 'is-invalid' : ''} ${className}`} {...props}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (<option key={opt.value} value={opt.value}>
              {opt.label}
            </option>))}
        </select>
        {error && <span className="form-error">{error}</span>}
      </div>);
});

Select.displayName = 'Select';
export default Select;
