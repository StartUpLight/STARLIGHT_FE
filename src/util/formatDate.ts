export const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        const year = kstDate.getFullYear().toString().slice(-2);
        const month = String(kstDate.getMonth() + 1).padStart(2, '0');
        const day = String(kstDate.getDate()).padStart(2, '0');
        const hours = String(kstDate.getHours()).padStart(2, '0');
        const minutes = String(kstDate.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    } catch {
        return dateString;
    }
};