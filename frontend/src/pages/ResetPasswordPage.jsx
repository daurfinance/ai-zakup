import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('form'); // form, success, error
  const [errors, setErrors] = useState({});

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(t('auth.invalidResetLink'));
    }
  }, [token, t]);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = t('auth.passwordRequirements');
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.passwordsDoNotMatch');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || t('auth.passwordResetSuccess'));
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: t('auth.passwordResetCanLogin') }
          });
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || t('auth.passwordResetFailed'));
      }
    } catch (error) {
      setStatus('error');
      setMessage(t('auth.passwordResetError'));
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.password);

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.passwordReset')}
          </h1>
          <p className="text-gray-600 mb-4">
            {message}
          </p>
          <p className="text-sm text-gray-500">
            {t('auth.redirectingToLogin')}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.resetFailed')}
          </h1>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800"
          >
            {t('auth.backToLogin')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.resetPassword')}
          </h1>
          <p className="text-gray-600">
            {t('auth.enterNewPassword')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.newPassword')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('auth.enterNewPassword')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            
            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="text-xs text-gray-600">{t('auth.passwordMustContain')}:</div>
                <div className="space-y-1">
                  <div className={`text-xs flex items-center ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.minLength ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {t('auth.atLeast8Characters')}
                  </div>
                  <div className={`text-xs flex items-center ${passwordValidation.hasUpper ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasUpper ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {t('auth.uppercaseLetter')}
                  </div>
                  <div className={`text-xs flex items-center ${passwordValidation.hasLower ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasLower ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {t('auth.lowercaseLetter')}
                  </div>
                  <div className={`text-xs flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {t('auth.number')}
                  </div>
                  <div className={`text-xs flex items-center ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${passwordValidation.hasSpecial ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {t('auth.specialCharacter')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.confirmPassword')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('auth.confirmNewPassword')}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-md ${status === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passwordValidation.isValid}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t('auth.resetting')}
              </>
            ) : (
              t('auth.resetPassword')
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {t('auth.backToLogin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
