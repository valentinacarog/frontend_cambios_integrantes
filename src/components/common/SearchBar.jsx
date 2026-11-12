import React from 'react';
import { Search, X } from 'lucide-react';
export const SearchBar = ({ value, onChange, placeholder = 'Buscar...', className = '' }) => {
    return (<div className={`input-wrapper ${className}`}>
      <span className="input-icon">
        <Search size={18}/>
      </span>
      <input type="text" className="form-input has-icon" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}/>
      {value && (<button type="button" onClick={() => onChange('')} style={{
                position: 'absolute',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
            }} aria-label="Limpiar búsqueda">
          <X size={16}/>
        </button>)}
    </div>);
};
export default SearchBar;
