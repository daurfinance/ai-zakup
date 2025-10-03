import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  PlusCircle, 
  ClipboardList, 
  User, 
  Settings,
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: t('nav.home'),
      href: '/',
      icon: Home,
      roles: ['customer', 'supplier', 'admin'],
    },
    {
      name: t('nav.tenders'),
      href: '/tenders',
      icon: FileText,
      roles: ['customer', 'supplier', 'admin'],
    },
    {
      name: t('nav.my_tenders'),
      href: '/my-tenders',
      icon: PlusCircle,
      roles: ['customer', 'admin'],
    },
    {
      name: t('nav.my_bids'),
      href: '/my-bids',
      icon: ClipboardList,
      roles: ['supplier', 'admin'],
    },
    {
      name: t('nav.profile'),
      href: '/profile',
      icon: User,
      roles: ['customer', 'supplier', 'admin'],
    },
    {
      name: t('nav.admin'),
      href: '/admin',
      icon: Settings,
      roles: ['admin'],
    },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-card border-r border-border transition-all duration-300",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:w-16"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
          <span className="font-semibold text-lg">Навигация</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={cn(
                  "transition-opacity duration-300",
                  isOpen ? "opacity-100" : "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        {isOpen && user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(`auth.${user.role}`)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
