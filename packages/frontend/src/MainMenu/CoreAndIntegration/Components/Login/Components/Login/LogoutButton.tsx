import axios from 'axios';
import { useAuthStore } from '../../Stores/Auth/useAuthStore'; // ודאי שהנתיב נכון
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
     withCredentials: true, // Ensure cookies are sent with requests
});
export const LogoutButton = () => {
  const clearAuth = useAuthStore((state) => state.clearUser); // פונקציה שמנקה את ה־auth state
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout', {}, { withCredentials: true });
      clearAuth();
      navigate('/'); // או כל דף אחר
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <button onClick={handleLogout}>התנתק</button>;
};
