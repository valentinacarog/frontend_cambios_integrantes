import React from 'react';
import { Loader2 } from 'lucide-react';
export const Button = ({ children, variant = 'primary', size = 'md', isLoading = false, icon, className = '', disabled, ...props }) => {
    const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
    const variantClass = `btn-${variant}`;
    return (<button className={`btn ${variantClass} ${sizeClass} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? (<>
          <Loader2 size={16} className="animate-spin"/>
          <span>Cargando...</span>
        </>) : (<>
          {icon && <span className="btn-icon-prefix">{icon}</span>}
          {children}
        </>)}
    </button>);
};
export default Button;
