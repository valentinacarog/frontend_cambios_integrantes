import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    if (totalPages <= 1 && totalItems <= itemsPerPage) {
        return (<div className="pagination-wrapper">
        <span className="pagination-info">
          Mostrando {totalItems} de {totalItems} registros
        </span>
      </div>);
    }
    return (<div className="pagination-wrapper">
      <span className="pagination-info">
        Mostrando {startItem} a {endItem} de {totalItems} registros
      </span>
      <div className="pagination-controls">
        <button className="page-btn" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} aria-label="Página anterior">
          <ChevronLeft size={16}/>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (<button key={page} className={`page-btn ${currentPage === page ? 'active' : ''}`} onClick={() => onPageChange(page)}>
            {page}
          </button>))}

        <button className="page-btn" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} aria-label="Página siguiente">
          <ChevronRight size={16}/>
        </button>
      </div>
    </div>);
};

export default Pagination;
