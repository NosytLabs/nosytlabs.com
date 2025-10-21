export function formatDate(date: Date | string | number | null | undefined): string {
  if (date === null || date === undefined) {
    return '';
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  try {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
