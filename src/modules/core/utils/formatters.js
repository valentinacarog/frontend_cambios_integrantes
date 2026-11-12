export const formatDate = (dateString) => {
    if (!dateString)
        return '-';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime()))
            return dateString;
        return new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
    catch {
        return dateString;
    }
};
export const formatDateOnly = (dateString) => {
    if (!dateString)
        return '-';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime()))
            return dateString;
        return new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }).format(date);
    }
    catch {
        return dateString;
    }
};
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(amount);
};
export const formatPoints = (points) => {
    return `${new Intl.NumberFormat('es-CO').format(points)} pts`;
};
export const capitalize = (str) => {
    if (!str)
        return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
