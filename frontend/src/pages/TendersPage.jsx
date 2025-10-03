import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign,
  Users,
  Eye,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/AuthContext';

export default function TendersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    method: '',
    type: '',
    minBudget: '',
    maxBudget: '',
    currency: 'KZT',
    status: 'published',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
  });

  useEffect(() => {
    fetchTenders();
  }, [filters, pagination.page]);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual API
      const mockTenders = [
        {
          id: '1',
          title: 'Строительство офисного здания в г. Алматы',
          description: 'Требуется построить 5-этажное офисное здание площадью 2000 кв.м с современной инфраструктурой',
          budget: 50000000,
          currency: 'KZT',
          region: 'Алматы',
          method: 'tender',
          type: 'gen',
          status: 'published',
          deadlines: {
            submissionDeadline: '2024-02-15T23:59:59Z',
            executionDeadline: '2024-08-15T23:59:59Z'
          },
          customer: {
            name: 'ТОО "Строительная компания Алматы"',
            rating: 4.5,
            verifiedStatus: 'verified'
          },
          bidsCount: 5,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Поставка компьютерного оборудования',
          description: 'Закупка 100 единиц компьютеров и периферийного оборудования для государственного учреждения',
          budget: 15000000,
          currency: 'KZT',
          region: 'Нур-Султан',
          method: 'request_quotes',
          type: 'gen',
          status: 'published',
          deadlines: {
            submissionDeadline: '2024-02-10T23:59:59Z',
            executionDeadline: '2024-03-10T23:59:59Z'
          },
          customer: {
            name: 'Министерство образования РК',
            rating: 4.8,
            verifiedStatus: 'verified'
          },
          bidsCount: 12,
          createdAt: '2024-01-20T14:30:00Z'
        },
        {
          id: '3',
          title: 'Ремонт дорожного покрытия',
          description: 'Капитальный ремонт участка дороги протяженностью 5 км с заменой асфальтового покрытия',
          budget: 75000000,
          currency: 'KZT',
          region: 'Шымкент',
          method: 'tender',
          type: 'gen',
          status: 'published',
          deadlines: {
            submissionDeadline: '2024-02-20T23:59:59Z',
            executionDeadline: '2024-06-20T23:59:59Z'
          },
          customer: {
            name: 'Акимат г. Шымкент',
            rating: 4.2,
            verifiedStatus: 'verified'
          },
          bidsCount: 3,
          createdAt: '2024-01-18T09:15:00Z'
        }
      ];

      // Apply filters
      let filteredTenders = mockTenders.filter(tender => {
        if (filters.search && !tender.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !tender.description.toLowerCase().includes(filters.search.toLowerCase())) {
          return false;
        }
        if (filters.region && tender.region !== filters.region) return false;
        if (filters.method && tender.method !== filters.method) return false;
        if (filters.type && tender.type !== filters.type) return false;
        if (filters.minBudget && tender.budget < parseFloat(filters.minBudget)) return false;
        if (filters.maxBudget && tender.budget > parseFloat(filters.maxBudget)) return false;
        if (filters.status && tender.status !== filters.status) return false;
        return true;
      });

      setTenders(filteredTenders);
      setPagination(prev => ({
        ...prev,
        total: filteredTenders.length,
        hasMore: false
      }));
    } catch (error) {
      console.error('Error fetching tenders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
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
      year: 'numeric'
    });
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

  const getMethodBadge = (method) => {
    const methodConfig = {
      tender: { label: t('lot.tender'), variant: 'default' },
      request_quotes: { label: t('lot.request_quotes'), variant: 'secondary' },
      single_source: { label: t('lot.single_source'), variant: 'outline' },
    };

    const config = methodConfig[method] || methodConfig.tender;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getDaysLeft = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Просрочен';
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return '1 день';
    return `${diffDays} дней`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('nav.tenders')}
          </h1>
          <p className="text-muted-foreground mt-2">
            Найдите подходящие тендеры для участия
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Фильтры</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Поиск</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Регион</label>
              <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Все регионы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все регионы</SelectItem>
                  <SelectItem value="Алматы">Алматы</SelectItem>
                  <SelectItem value="Нур-Султан">Нур-Султан</SelectItem>
                  <SelectItem value="Шымкент">Шымкент</SelectItem>
                  <SelectItem value="Караганда">Караганда</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Метод закупки</label>
              <Select value={filters.method} onValueChange={(value) => handleFilterChange('method', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Все методы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все методы</SelectItem>
                  <SelectItem value="tender">{t('lot.tender')}</SelectItem>
                  <SelectItem value="request_quotes">{t('lot.request_quotes')}</SelectItem>
                  <SelectItem value="single_source">{t('lot.single_source')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Тип лота</label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Все типы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все типы</SelectItem>
                  <SelectItem value="gen">{t('lot.gen')}</SelectItem>
                  <SelectItem value="sub">{t('lot.sub')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Минимальный бюджет</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minBudget}
                onChange={(e) => handleFilterChange('minBudget', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Максимальный бюджет</label>
              <Input
                type="number"
                placeholder="Без ограничений"
                value={filters.maxBudget}
                onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Валюта</label>
              <Select value={filters.currency} onValueChange={(value) => handleFilterChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KZT">KZT</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Найдено {tenders.length} тендеров
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tenders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Тендеры не найдены. Попробуйте изменить фильтры.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {tenders.map((tender) => (
              <Card key={tender.id} className="hover:shadow-md transition-shadow">
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
                      <CardDescription className="text-sm">
                        {tender.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(tender.status)}
                      {getMethodBadge(tender.method)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatCurrency(tender.budget, tender.currency)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{tender.region}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>До {formatDate(tender.deadlines.submissionDeadline)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{tender.bidsCount} заявок</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Заказчик: {tender.customer.name}</span>
                      <Badge variant="outline">
                        Рейтинг: {tender.customer.rating}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={
                          getDaysLeft(tender.deadlines.submissionDeadline).includes('день') ||
                          getDaysLeft(tender.deadlines.submissionDeadline) === 'Сегодня'
                            ? 'text-destructive font-medium'
                            : 'text-muted-foreground'
                        }>
                          {getDaysLeft(tender.deadlines.submissionDeadline)}
                        </span>
                      </div>
                      
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/tenders/${tender.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Подробнее
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
