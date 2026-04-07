import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination-container">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Previous Page"
            >
                <FaChevronLeft size={14} />
                <span>Previous</span>
            </button>

            <div className="pagination-info">
                Page {currentPage} of {totalPages}
            </div>

            <button
                className="pagination-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Next Page"
            >
                <span>Next</span>
                <FaChevronRight size={14} />
            </button>
        </div>
    );
};

export default Pagination;
