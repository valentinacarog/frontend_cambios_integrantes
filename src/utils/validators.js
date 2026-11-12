export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};
export const isValidPassword = (password, minLength = 6) => {
    return password.length >= minLength;
};
export const isNotEmpty = (value) => {
    if (value === null || value === undefined)
        return false;
    if (typeof value === 'string')
        return value.trim().length > 0;
    return true;
};
export const isValidPhone = (phone) => {
    if (!phone)
        return true; // optional
    const phoneRegex = /^[0-9+() -]{7,15}$/;
    return phoneRegex.test(phone.trim());
};
export const isValidNit = (nit) => {
    const nitRegex = /^[0-9.-]{5,20}$/;
    return nitRegex.test(nit.trim());
};
