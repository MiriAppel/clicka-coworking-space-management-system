import Swal from 'sweetalert2';

export const showAlertHTML = (content: string,title?: string,  icon?: 'success' | 'error' | 'warning' | 'info') => {
  
  Swal.fire({
    title,
    html: content,
    icon,
    showCloseButton: true, // מציג את כפתור הסגירה
    closeButtonAriaLabel: 'Close', // תיאור עבור גישה
    showConfirmButton: false,
  });
};