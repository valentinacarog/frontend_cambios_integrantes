import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, icon, required, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (<div className="form-group">
        {label && (<label htmlFor={inputId} className="form-label">
            {label} {required && <span className="required">*</span>}
          </label>)}
        <div className="input-wrapper">
          {icon && <span className="input-icon">{icon}</span>}
          <input id={inputId} ref={ref} className={`form-input ${icon ? 'has-icon' : ''} ${error ? 'is-invalid' : ''} ${className}`} {...props}/>
        </div>
        {error && <span className="form-error">{error}</span>}
      </div>);
});

Input.displayName = 'Input';
export default Input;
