import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  Moon, 
  Sun, 
  Globe,
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Header({ onMenuClick }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [languageOpen, setLanguageOpen] = useState(false);

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'kz', name: 'Қазақша', flag: '🇰🇿' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setLanguageOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-4">
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">GT</span>
            </div>
            <span className="font-bold text-xl text-foreground">GrandTender</span>
          </Link>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu open={languageOpen} onOpenChange={setLanguageOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
                <span className="sm:hidden">{currentLanguage.flag}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center space-x-2 ${
                    i18n.language === lang.code ? 'bg-accent' : ''
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="flex items-center space-x-2"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.email}
                </div>
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  {t(`auth.${user.role}`)}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{t('nav.profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Настройки</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">{t('register')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
