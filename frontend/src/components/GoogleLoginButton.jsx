import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

function GoogleLoginButton() {
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post(
        '/auth/google-login',
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );

      console.log('Google login response:', res.data);
      
      // Update auth state
      await checkAuth();
      
      // Show success message
      toast.success(res.data.message || 'Google login successful');
      
      // Navigate to home
      navigate('/home');
    } catch (err) {
      console.error('Google login failed:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Google login failed');
    }
  };

  const handleLoginError = () => {
    console.log('Google login error');
    toast.error('Google login failed');
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-sm">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          theme="filled_black"
          size="large"
          width="100%"
          text="signin_with"
          shape="rectangular"
          logo_alignment="left"
        />
      </div>
    </div>
  );
}

export default GoogleLoginButton;
