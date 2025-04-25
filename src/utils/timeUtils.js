export const yearsSince = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let years = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        years--;
    }
    return years;
};
