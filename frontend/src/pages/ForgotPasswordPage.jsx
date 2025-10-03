import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('form'); // form, success, error
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrors({ email: t('auth.emailRequired') });
      return;
    }

    setLoading(true);
    setMessage('');
    setErrors({});

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || t('auth.passwordResetEmailSent'));
      } else {
        setStatus('error');
        setMessage(data.message || t('auth.passwordResetEmailFailed'));
      }
    } catch (error) {
      setStatus('error');
      setMessage(t('auth.passwordResetEmailError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
    if (status !== 'form') {
      setStatus('form');
      setMessage('');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t('auth.emailSent')}
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {t('auth.checkEmailInstructions')}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setStatus('form');
                  setEmail('');
                  setMessage('');
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t('auth.sendAnotherEmail')}
              </button>
              
              <Link
                to="/login"
                className="block w-full text-center text-blue-600 hover:text-blue-800 py-2"
              >
                {t('auth.backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('auth.forgotPassword')}
          </h1>
          <p className="text-gray-600">
            {t('auth.forgotPasswordDescription')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('auth.enterEmail')}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {message && status === 'error' && (
            <div className="p-3 rounded-md bg-red-50 text-red-700">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t('auth.sending')}
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                {t('auth.sendResetEmail')}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('auth.backToLogin')}
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              {t('auth.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
