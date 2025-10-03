import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PlusCircle, Eye, Edit, Trash2, Play, Square } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

export default function MyTendersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTenders();
  }, []);

  const fetchMyTenders = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTenders = [
        {
          id: '1',
          title: 'Строительство офисного здания',
          description: 'Требуется построить 5-этажное офисное здание',
          budget: 50000000,
          currency: 'KZT',
          status: 'published',
          bidsCount: 5,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Поставка компьютерного оборудования',
          description: 'Закупка 100 единиц компьютеров',
          budget: 15000000,
          currency: 'KZT',
          status: 'draft',
          bidsCount: 0,
          createdAt: '2024-01-20T14:30:00Z'
        }
      ];
      setTenders(mockTenders);
    } catch (error) {
      console.error('Error fetching tenders:', error);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { label: 'Опубликован', variant: 'default' },
      draft: { label: 'Черновик', variant: 'secondary' },
      closed: { label: 'Закрыт', variant: 'outline' },
      winner_selected: { label: 'Победитель выбран', variant: 'success' },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Мои тендеры</h1>
          <p className="text-muted-foreground mt-2">
            Управляйте своими тендерами и отслеживайте заявки
          </p>
        </div>
        <Button asChild>
          <Link to="/create-tender">
            <PlusCircle className="h-4 w-4 mr-2" />
            Создать тендер
          </Link>
        </Button>
      </div>

      {tenders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <PlusCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Нет тендеров</h3>
            <p className="text-muted-foreground mb-4">
              Вы еще не создали ни одного тендера
            </p>
            <Button asChild>
              <Link to="/create-tender">Создать первый тендер</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tenders.map((tender) => (
            <Card key={tender.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      <Link 
                        to={`/tenders/${tender.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {tender.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {tender.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(tender.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">Бюджет: </span>
                      <span className="font-medium">
                        {formatCurrency(tender.budget, tender.currency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Заявок: </span>
                      <span className="font-medium">{tender.bidsCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Создан: </span>
                      <span className="font-medium">
                        {new Date(tender.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/tenders/${tender.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Просмотр
                      </Link>
                    </Button>
                    
                    {tender.status === 'draft' && (
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </Button>
                    )}
                    
                    {tender.status === 'draft' && (
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Опубликовать
                      </Button>
                    )}
                    
                    {tender.status === 'published' && (
                      <Button variant="destructive" size="sm">
                        <Square className="h-4 w-4 mr-2" />
                        Закрыть
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
