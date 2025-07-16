import Swal from 'sweetalert2';
export const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: 'Accept',
  });
};

