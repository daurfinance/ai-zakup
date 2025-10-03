import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  PlusCircle, 
  TrendingUp, 
  Users, 
  DollarSign,
  Clock,
  Award,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTenders: 0,
    activeTenders: 0,
    myBids: 0,
    wonTenders: 0,
    totalValue: 0,
  });
  const [recentTenders, setRecentTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for dashboard data
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API calls
        setStats({
          totalTenders: 156,
          activeTenders: 23,
          myBids: user?.role === 'supplier' ? 12 : 0,
          wonTenders: user?.role === 'supplier' ? 8 : 0,
          totalValue: 45600000,
        });

        setRecentTenders([
          {
            id: '1',
            title: 'Строительство офисного здания',
            budget: 50000000,
            currency: 'KZT',
            deadline: '2024-02-15',
            status: 'published',
            bidsCount: 5,
          },
          {
            id: '2',
            title: 'Поставка компьютерного оборудования',
            budget: 15000000,
            currency: 'KZT',
            deadline: '2024-02-10',
            status: 'published',
            bidsCount: 12,
          },
          {
            id: '3',
            title: 'Ремонт дорожного покрытия',
            budget: 75000000,
            currency: 'KZT',
            deadline: '2024-02-20',
            status: 'published',
            bidsCount: 3,
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const formatCurrency = (amount, currency = 'KZT') => {
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { label: t('lot.published'), variant: 'default' },
      draft: { label: t('lot.draft'), variant: 'secondary' },
      closed: { label: t('lot.closed'), variant: 'outline' },
      winner_selected: { label: t('lot.winner_selected'), variant: 'success' },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('welcome')}, {user?.email}!
          </h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === 'customer' 
              ? 'Управляйте своими тендерами и находите лучших исполнителей'
              : user?.role === 'supplier'
              ? 'Находите новые возможности и участвуйте в тендерах'
              : 'Администрирование платформы государственных закупок'
            }
          </p>
        </div>
        
        {user?.role === 'customer' && (
          <Button asChild>
            <Link to="/my-tenders">
              <PlusCircle className="h-4 w-4 mr-2" />
              Создать тендер
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Всего тендеров
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenders}</div>
            <p className="text-xs text-muted-foreground">
              +12% за последний месяц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Активные тендеры
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTenders}</div>
            <p className="text-xs text-muted-foreground">
              Доступны для участия
            </p>
          </CardContent>
        </Card>

        {user?.role === 'supplier' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Мои заявки
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.myBids}</div>
                <p className="text-xs text-muted-foreground">
                  На рассмотрении
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Выигранные тендеры
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.wonTenders}</div>
                <p className="text-xs text-muted-foreground">
                  Успешность: 67%
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {user?.role === 'customer' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Общая стоимость
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Всех тендеров
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Tenders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Последние тендеры
              <Button variant="outline" size="sm" asChild>
                <Link to="/tenders">Все тендеры</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Новые возможности для участия
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTenders.map((tender) => (
              <div key={tender.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">
                    <Link 
                      to={`/tenders/${tender.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {tender.title}
                    </Link>
                  </h4>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{formatCurrency(tender.budget, tender.currency)}</span>
                    <span>До {new Date(tender.deadline).toLocaleDateString('ru-RU')}</span>
                    <span>{tender.bidsCount} заявок</span>
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusBadge(tender.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>
              Часто используемые функции
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user?.role === 'customer' && (
              <>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/my-tenders">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Создать новый тендер
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/my-tenders">
                    <FileText className="h-4 w-4 mr-2" />
                    Мои тендеры
                  </Link>
                </Button>
              </>
            )}
            
            {user?.role === 'supplier' && (
              <>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/tenders">
                    <FileText className="h-4 w-4 mr-2" />
                    Найти тендеры
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/my-bids">
                    <Users className="h-4 w-4 mr-2" />
                    Мои заявки
                  </Link>
                </Button>
              </>
            )}
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/profile">
                <Users className="h-4 w-4 mr-2" />
                Профиль компании
              </Link>
            </Button>
            
            {user?.role === 'admin' && (
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to="/admin">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Администрирование
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
