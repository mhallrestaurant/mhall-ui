import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get token from URL query params
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing reset token. Please use the link from your email.');
    }
  }, [searchParams]);

  // Redirect to login if already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const validateForm = (): boolean => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await apiService.resetPassword({
        resetToken: token,
        newPassword,
        confirmPassword,
      });

      setSuccess('Password reset successfully! You can now log in with your new password.');
      setLoading(false);

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The token may have expired.');
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-8 p-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-center text-[#BF2201]">
              Reset Password
            </h2>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
            {error}
          </div>
          
          <div className="text-center">
            <Link
              to="/admin/login"
              className="font-medium text-[#BF2201] hover:text-[#BF2201]/80"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-center text-[#BF2201]">
            Reset Password
          </h2>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            {success}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 shadow-sm focus:outline-none focus:ring-[#BF2201] focus:border-[#BF2201] sm:text-sm"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading || !!success}
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters
            </p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 shadow-sm focus:outline-none focus:ring-[#BF2201] focus:border-[#BF2201] sm:text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || !!success}
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#BF2201] hover:bg-[#BF2201]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BF2201] disabled:opacity-50 transition-all"
              disabled={loading || !!success}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
          
          <div className="text-center">
            <Link
              to="/admin/login"
              className="font-medium text-[#BF2201] hover:text-[#BF2201]/80"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;