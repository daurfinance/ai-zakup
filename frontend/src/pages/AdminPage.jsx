import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Building, 
  FileText, 
  DollarSign, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalUsers: 1247,
        totalCompanies: 856,
        totalTenders: 342,
        totalValue: 15600000000,
        activeUsers: 89,
        pendingVerifications: 23,
        disputes: 5
      });

      setPendingVerifications([
        {
          id: '1',
          company: 'ТОО "СтройИнвест"',
          type: 'company_verification',
          submittedAt: '2024-01-20T10:30:00Z',
          documents: 5
        },
        {
          id: '2',
          company: 'АО "КазСтрой"',
          type: 'license_verification',
          submittedAt: '2024-01-19T15:45:00Z',
          documents: 3
        }
      ]);

      setRecentActivity([
        {
          id: '1',
          type: 'tender_created',
          user: 'user@example.com',
          description: 'Создан новый тендер "Строительство моста"',
          timestamp: '2024-01-20T14:30:00Z'
        },
        {
          id: '2',
          type: 'company_verified',
          user: 'admin@system.com',
          description: 'Верифицирована компания ТОО "СтройМастер"',
          timestamp: '2024-01-20T13:15:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'KZT') => {
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type) => {
    const icons = {
      tender_created: FileText,
      company_verified: CheckCircle,
      user_registered: Users,
      dispute_opened: AlertTriangle
    };
    return icons[type] || FileText;
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Администрирование</h1>
          <p className="text-muted-foreground mt-2">
            Управление платформой государственных закупок
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% за последний месяц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Компании</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              +8% за последний месяц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Тендеры</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenders}</div>
            <p className="text-xs text-muted-foreground">
              +15% за последний месяц
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий оборот</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +22% за последний месяц
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">На верификации</p>
                <p className="text-sm text-yellow-600">{stats.pendingVerifications} компаний</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Споры</p>
                <p className="text-sm text-red-600">{stats.disputes} активных</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Активные пользователи</p>
                <p className="text-sm text-green-600">{stats.activeUsers} онлайн</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Management */}
      <Tabs defaultValue="verifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="verifications">Верификации</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="tenders">Тендеры</TabsTrigger>
          <TabsTrigger value="activity">Активность</TabsTrigger>
          <TabsTrigger value="reports">Отчеты</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications">
          <Card>
            <CardHeader>
              <CardTitle>Ожидающие верификации</CardTitle>
              <CardDescription>
                Компании, ожидающие проверки документов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingVerifications.map((verification) => (
                  <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{verification.company}</h4>
                      <p className="text-sm text-muted-foreground">
                        {verification.type === 'company_verification' ? 'Верификация компании' : 'Верификация лицензии'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Подано: {formatDate(verification.submittedAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {verification.documents} документов
                      </Badge>
                      <Button size="sm" variant="outline">
                        Проверить
                      </Button>
                      <Button size="sm">
                        Одобрить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
              <CardDescription>
                Просмотр и управление аккаунтами пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Функция в разработке
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenders">
          <Card>
            <CardHeader>
              <CardTitle>Управление тендерами</CardTitle>
              <CardDescription>
                Модерация и управление тендерами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Функция в разработке
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Последняя активность</CardTitle>
              <CardDescription>
                Журнал действий пользователей в системе
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.user} • {formatDate(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Отчеты и аналитика</CardTitle>
              <CardDescription>
                Статистика и отчеты по работе платформы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Отчет по тендерам
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Отчет по пользователям
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <DollarSign className="h-6 w-6 mb-2" />
                  Финансовый отчет
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Building className="h-6 w-6 mb-2" />
                  Отчет по компаниям
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
