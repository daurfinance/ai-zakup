import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  FileText, 
  User, 
  Settings,
  LogOut,
  Bell,
  Plus,
  Building,
  Award,
  DollarSign,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MobileNavigation = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Close menu when route changes
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const menuItems = [
    {
      title: t('nav.home'),
      path: '/',
      icon: Home,
      public: true,
    },
    {
      title: t('nav.tenders'),
      path: '/tenders',
      icon: Search,
      public: true,
    },
    {
      title: t('nav.myTenders'),
      path: '/my-tenders',
      icon: FileText,
      requiresAuth: true,
      roles: ['customer'],
    },
    {
      title: t('nav.myBids'),
      path: '/my-bids',
      icon: Award,
      requiresAuth: true,
      roles: ['supplier'],
    },
    {
      title: t('nav.createTender'),
      path: '/create-tender',
      icon: Plus,
      requiresAuth: true,
      roles: ['customer'],
    },
    {
      title: t('nav.company'),
      path: '/company',
      icon: Building,
      requiresAuth: true,
    },
    {
      title: t('nav.escrow'),
      path: '/escrow',
      icon: DollarSign,
      requiresAuth: true,
    },
    {
      title: t('nav.profile'),
      path: '/profile',
      icon: User,
      requiresAuth: true,
    },
    {
      title: t('nav.settings'),
      path: '/settings',
      icon: Settings,
      requiresAuth: true,
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.public) return true;
    if (item.requiresAuth && !user) return false;
    if (item.roles && !item.roles.includes(user?.role)) return false;
    return true;
  });

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg border border-gray-200"
        aria-label={isOpen ? t('common.closeMenu') : t('common.openMenu')}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                AI Zakup
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {user && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t(`roles.${user.role}`)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-4">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);

                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Notifications */}
            {user && notifications.length > 0 && (
              <div className="px-4 mt-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {t('nav.notifications')}
                </h3>
                <div className="space-y-2">
                  {notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 bg-gray-50 rounded-lg text-sm"
                    >
                      <p className="text-gray-900 font-medium">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                  {notifications.length > 3 && (
                    <Link
                      to="/notifications"
                      className="block text-center text-blue-600 text-sm font-medium py-2"
                    >
                      {t('common.viewAll')}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Language Selector */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {t('common.language')}
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => changeLanguage('ru')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md border ${
                    i18n.language === 'ru'
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Русский
                </button>
                <button
                  onClick={() => changeLanguage('kk')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md border ${
                    i18n.language === 'kk'
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Қазақша
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md border ${
                    i18n.language === 'en'
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Auth Actions */}
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('auth.logout')}</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-5 h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center space-y-1 ${
              isActivePath('/') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">{t('nav.home')}</span>
          </Link>

          <Link
            to="/tenders"
            className={`flex flex-col items-center justify-center space-y-1 ${
              isActivePath('/tenders') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">{t('nav.tenders')}</span>
          </Link>

          {user && user.role === 'customer' && (
            <Link
              to="/create-tender"
              className="flex flex-col items-center justify-center space-y-1 text-blue-600"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs">{t('common.create')}</span>
            </Link>
          )}

          {user && user.role === 'supplier' && (
            <Link
              to="/my-bids"
              className={`flex flex-col items-center justify-center space-y-1 ${
                isActivePath('/my-bids') ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Award className="h-5 w-5" />
              <span className="text-xs">{t('nav.bids')}</span>
            </Link>
          )}

          {!user && (
            <Link
              to="/login"
              className="flex flex-col items-center justify-center space-y-1 text-gray-500"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">{t('auth.login')}</span>
            </Link>
          )}

          {user && (
            <Link
              to="/notifications"
              className={`flex flex-col items-center justify-center space-y-1 relative ${
                isActivePath('/notifications') ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                </div>
              )}
              <span className="text-xs">{t('nav.notifications')}</span>
            </Link>
          )}

          <Link
            to={user ? '/profile' : '/register'}
            className={`flex flex-col items-center justify-center space-y-1 ${
              isActivePath('/profile') || isActivePath('/register') ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">
              {user ? t('nav.profile') : t('auth.register')}
            </span>
          </Link>
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default MobileNavigation;
