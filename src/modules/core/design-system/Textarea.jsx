import React, { forwardRef } from 'react';

export const Textarea = forwardRef(({ label, error, required, className = '', id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (<div className="form-group">
        {label && (<label htmlFor={textareaId} className="form-label">
            {label} {required && <span className="required">*</span>}
          </label>)}
        <textarea id={textareaId} ref={ref} rows={rows} className={`form-textarea ${error ? 'is-invalid' : ''} ${className}`} {...props}/>
        {error && <span className="form-error">{error}</span>}
      </div>);
});

Textarea.displayName = 'Textarea';
export default Textarea;
