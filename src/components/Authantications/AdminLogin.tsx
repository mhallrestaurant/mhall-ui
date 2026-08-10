import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { LoginCredentials } from '../../types/index';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginData: LoginCredentials = {
        email,
        password,
        rememberMe
      };

      const response = await apiService.login(loginData);
      const { admin, token, refreshToken } = response.data.data || response.data;

      if (!token || !admin) {
        throw new Error('Invalid response from server: missing token or admin data');
      }

      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('adminToken', token);

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      localStorage.setItem('adminUser', JSON.stringify({
        id: admin.id,
        name: admin.fullName || admin.name,
        email: admin.email,
        role: admin.role
      }));

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setLoading(false);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    setForgotPasswordLoading(true);

    try {
      await apiService.forgotPassword({ email });

      setForgotPasswordSuccess('Password reset instructions sent to your email');
      setForgotPasswordLoading(false);
    } catch (err: any) {
      setForgotPasswordError(err.response?.data?.message || 'Failed to send reset instructions');
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center admin-neu-page px-4">
      <div className="w-full max-w-md p-8 neu-card">
        <div className="text-center mb-8">
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{
              background: 'var(--neu-gradient-brand)',
              boxShadow: '0 0 0 4px #e0e5ec, 0 8px 24px rgba(255,107,0,0.45)'
            }}
          >
            <span className="text-2xl font-bold text-white tracking-tight">MH</span>
          </div>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--neu-accent)' }}>
            Admin Login
          </h2>
          <p className="mt-2 font-medium" style={{ color: 'var(--neu-text-secondary)' }}>
            Sign in to access the admin panel
          </p>
        </div>

        {error && (
          <div className="neu-inset bg-red-50 text-red-700 p-4 mb-6 border border-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--neu-text-primary)' }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="neu-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2" style={{ color: 'var(--neu-text-primary)' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="neu-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 border-gray-300 rounded"
                style={{ color: 'var(--neu-accent)', accentColor: 'var(--neu-accent)' }}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm font-medium" style={{ color: 'var(--neu-text-primary)' }}>
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-semibold"
                style={{ color: 'var(--neu-accent)' }}
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPassword(true);
                }}
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="neu-btn-primary w-full justify-center"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm" style={{ color: 'var(--neu-text-secondary)' }}>
              Don't have an admin account?{' '}
              <Link to="/admin/register" className="font-semibold" style={{ color: 'var(--neu-accent)' }}>
                Register here
              </Link>
            </p>
          </div>
        </form>

        {showForgotPassword && (
          <div className="mt-6 p-5 neu-card-flat">
            <h3 className="text-lg font-semibold text-center mb-3" style={{ color: 'var(--neu-accent)' }}>
              Forgot Password
            </h3>
            <p className="text-center text-sm mb-4" style={{ color: 'var(--neu-text-secondary)' }}>
              Enter your email address to receive password reset instructions
            </p>

            {forgotPasswordError && (
              <div className="neu-inset bg-red-50 text-red-700 p-4 mb-4 border border-red-200 rounded-xl text-sm">
                {forgotPasswordError}
              </div>
            )}

            {forgotPasswordSuccess && (
              <div className="neu-inset bg-green-50 text-green-700 p-4 mb-4 border border-green-200 rounded-xl text-sm">
                {forgotPasswordSuccess}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleForgotPassword}>
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--neu-text-primary)' }}>
                  Email address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neu-input"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="neu-btn text-sm py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-primary justify-center"
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );

};

export default AdminLogin;
