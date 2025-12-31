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

export const formatCareerDate = (
  startDate: string | number[],
  endDate: string | number[] | null
): string => {
  const formatDateInput = (dateInput: string | number[]): string => {
    try {
      if (Array.isArray(dateInput) && dateInput.length >= 2) {
        const year = dateInput[0];
        const month = dateInput[1];
        return `${year}년 ${month}월`;
      }

      if (typeof dateInput === 'string') {
        const date = new Date(dateInput);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        return `${year}년 ${month}월`;
      }
      return String(dateInput);
    } catch {
      return String(dateInput);
    }
  };

  const start = formatDateInput(startDate);
  const end = endDate ? formatDateInput(endDate) : null;
  return end ? `${start} ~ ${end}` : start;
};
