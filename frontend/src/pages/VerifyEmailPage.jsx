import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage(t('auth.invalidVerificationLink'));
    }
  }, [token, t]);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${verificationToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || t('auth.emailVerifiedSuccess'));
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { message: t('auth.emailVerifiedCanLogin') }
          });
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || t('auth.emailVerificationFailed'));
      }
    } catch (error) {
      setStatus('error');
      setMessage(t('auth.emailVerificationError'));
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || t('auth.verificationEmailResent'));
        setResendEmail('');
      } else {
        setMessage(data.message || t('auth.resendVerificationFailed'));
      }
    } catch (error) {
      setMessage(t('auth.resendVerificationError'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.verifyingEmail')}
              </h1>
              <p className="text-gray-600">
                {t('auth.pleaseWait')}
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.emailVerified')}
              </h1>
              <p className="text-gray-600 mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                {t('auth.redirectingToLogin')}
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.verificationFailed')}
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>

              {/* Resend verification form */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('auth.resendVerification')}
                </h2>
                <form onSubmit={handleResendVerification} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('auth.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('auth.enterEmail')}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resending || !resendEmail}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {t('auth.sending')}
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        {t('auth.resendEmail')}
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {t('auth.backToLogin')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
