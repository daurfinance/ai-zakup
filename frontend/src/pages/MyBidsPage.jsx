import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Clock, CheckCircle, XCircle, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

export default function MyBidsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchMyBids();
    fetchStats();
  }, []);

  const fetchMyBids = async () => {
    try {
      // Mock data - replace with actual API call
      const mockBids = [
        {
          id: '1',
          lot: {
            id: '1',
            title: 'Строительство офисного здания',
            budget: 50000000,
            currency: 'KZT',
            customer: {
              name: 'ТОО "Строительная компания Алматы"'
            }
          },
          price: 48000000,
          currency: 'KZT',
          etaDays: 180,
          status: 'pending',
          createdAt: '2024-01-16T09:00:00Z'
        },
        {
          id: '2',
          lot: {
            id: '2',
            title: 'Поставка компьютерного оборудования',
            budget: 15000000,
            currency: 'KZT',
            customer: {
              name: 'Министерство образования РК'
            }
          },
          price: 14500000,
          currency: 'KZT',
          etaDays: 30,
          status: 'winner',
          createdAt: '2024-01-10T14:30:00Z'
        },
        {
          id: '3',
          lot: {
            id: '3',
            title: 'Ремонт дорожного покрытия',
            budget: 75000000,
            currency: 'KZT',
            customer: {
              name: 'Акимат г. Шымкент'
            }
          },
          price: 72000000,
          currency: 'KZT',
          etaDays: 90,
          status: 'rejected',
          createdAt: '2024-01-05T11:15:00Z'
        }
      ];
      setBids(mockBids);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats - replace with actual API call
      setStats({
        total: 15,
        pending: 3,
        approved: 5,
        rejected: 4,
        won: 3,
        successRate: 20
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatCurrency = (amount, currency = 'KZT') => {
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        label: 'На рассмотрении', 
        variant: 'default',
        icon: Clock
      },
      approved: { 
        label: 'Одобрена', 
        variant: 'success',
        icon: CheckCircle
      },
      rejected: { 
        label: 'Отклонена', 
        variant: 'destructive',
        icon: XCircle
      },
      winner: { 
        label: 'Победитель', 
        variant: 'success',
        icon: Award
      },
      withdrawn: { 
        label: 'Отозвана', 
        variant: 'secondary',
        icon: XCircle
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const canEditBid = (bid) => {
    return bid.status === 'pending';
  };

  const canWithdrawBid = (bid) => {
    return bid.status === 'pending';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Мои заявки</h1>
          <p className="text-muted-foreground mt-2">
            Отслеживайте статус ваших заявок на участие в тендерах
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Всего заявок</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">На рассмотрении</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-sm text-muted-foreground">Одобрено</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-sm text-muted-foreground">Отклонено</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.won}</div>
            <p className="text-sm text-muted-foreground">Выиграно</p>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Успешность заявок</h3>
              <p className="text-sm text-muted-foreground">
                Процент выигранных тендеров от общего количества заявок
              </p>
            </div>
            <div className="text-3xl font-bold text-primary">
              {stats.successRate}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bids List */}
      {bids.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Нет заявок</h3>
            <p className="text-muted-foreground mb-4">
              Вы еще не подали ни одной заявки на участие в тендерах
            </p>
            <Button asChild>
              <Link to="/tenders">Найти тендеры</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {bids.map((bid) => (
            <Card key={bid.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      <Link 
                        to={`/tenders/${bid.lot.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {bid.lot.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Заказчик: {bid.lot.customer.name}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(bid.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Ваша цена</p>
                    <p className="font-semibold">
                      {formatCurrency(bid.price, bid.currency)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Бюджет тендера</p>
                    <p className="font-medium">
                      {formatCurrency(bid.lot.budget, bid.lot.currency)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Срок выполнения</p>
                    <p className="font-medium">{bid.etaDays} дней</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Подана</p>
                    <p className="font-medium">
                      {new Date(bid.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {bid.status === 'winner' && (
                      <Badge variant="outline" className="text-green-600">
                        🏆 Поздравляем! Вы выиграли тендер
                      </Badge>
                    )}
                    {bid.status === 'rejected' && (
                      <Badge variant="outline" className="text-red-600">
                        ❌ К сожалению, заявка отклонена
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/tenders/${bid.lot.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Просмотр тендера
                      </Link>
                    </Button>
                    
                    {canEditBid(bid) && (
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </Button>
                    )}
                    
                    {canWithdrawBid(bid) && (
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Отозвать
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
