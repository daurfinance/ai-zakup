import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  FileText,
  Download,
  Send,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';

export default function TenderDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tender, setTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTenderDetails();
  }, [id]);

  const fetchTenderDetails = async () => {
    try {
      // Mock data - replace with actual API calls
      const mockTender = {
        id: id,
        title: 'Строительство офисного здания в г. Алматы',
        description: 'Требуется построить 5-этажное офисное здание площадью 2000 кв.м с современной инфраструктурой. Здание должно соответствовать всем требованиям энергоэффективности и экологической безопасности.',
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
        criteria: {
          minExperience: 5,
          requiredLicenses: ['Строительная лицензия категории А'],
          technicalRequirements: [
            'Опыт строительства зданий высотой не менее 5 этажей',
            'Наличие собственной строительной техники',
            'Сертификат ISO 9001'
          ]
        },
        customer: {
          name: 'ТОО "Строительная компания Алматы"',
          rating: 4.5,
          verifiedStatus: 'verified',
          contact: {
            email: 'info@stroyka-almaty.kz',
            phone: '+7 727 123 45 67'
          }
        },
        docs: [
          { name: 'Техническое задание.pdf', url: '/docs/tz.pdf', size: '2.5 MB' },
          { name: 'Проектная документация.pdf', url: '/docs/project.pdf', size: '15.2 MB' },
          { name: 'Смета.xlsx', url: '/docs/estimate.xlsx', size: '1.1 MB' }
        ],
        bidsCount: 5,
        createdAt: '2024-01-15T10:00:00Z'
      };

      const mockBids = [
        {
          id: '1',
          supplier: {
            name: 'ТОО "СтройМастер"',
            rating: 4.2,
            verifiedStatus: 'verified'
          },
          price: 48000000,
          currency: 'KZT',
          etaDays: 180,
          status: 'pending',
          createdAt: '2024-01-16T09:00:00Z'
        },
        {
          id: '2',
          supplier: {
            name: 'АО "КазСтрой"',
            rating: 4.7,
            verifiedStatus: 'verified'
          },
          price: 52000000,
          currency: 'KZT',
          etaDays: 150,
          status: 'pending',
          createdAt: '2024-01-17T14:30:00Z'
        }
      ];

      setTender(mockTender);
      setBids(mockBids);
    } catch (error) {
      console.error('Error fetching tender details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async () => {
    setSubmitting(true);
    try {
      // Here would be the actual bid submission logic
      console.log('Submitting bid for tender:', id);
      // Redirect to bid creation form or show modal
    } catch (error) {
      console.error('Error submitting bid:', error);
    } finally {
      setSubmitting(false);
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

  const canSubmitBid = () => {
    if (!user || user.role !== 'supplier') return false;
    if (tender?.status !== 'published') return false;
    const deadline = new Date(tender?.deadlines?.submissionDeadline);
    return new Date() < deadline;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Тендер не найден</h2>
        <p className="text-muted-foreground mb-4">
          Запрашиваемый тендер не существует или был удален.
        </p>
        <Button asChild>
          <Link to="/tenders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться к списку
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link to="/tenders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к списку
          </Link>
        </Button>
        
        {canSubmitBid() && (
          <Button onClick={handleSubmitBid} disabled={submitting}>
            <Send className="h-4 w-4 mr-2" />
            {submitting ? 'Отправка...' : 'Подать заявку'}
          </Button>
        )}
      </div>

      {/* Main Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{tender.title}</CardTitle>
              <CardDescription className="text-base">
                {tender.description}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getStatusBadge(tender.status)}
              <Badge variant="outline">{t(`lot.${tender.method}`)}</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Бюджет</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(tender.budget, tender.currency)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Регион</p>
                <p className="font-medium">{tender.region}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Срок подачи</p>
                <p className="font-medium">
                  {formatDate(tender.deadlines.submissionDeadline)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Осталось</p>
                <p className={`font-medium ${
                  getDaysLeft(tender.deadlines.submissionDeadline).includes('день') ||
                  getDaysLeft(tender.deadlines.submissionDeadline) === 'Сегодня'
                    ? 'text-destructive'
                    : ''
                }`}>
                  {getDaysLeft(tender.deadlines.submissionDeadline)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm text-muted-foreground">Заказчик</p>
                <p className="font-medium">{tender.customer.name}</p>
              </div>
              <Badge variant="outline">
                Рейтинг: {tender.customer.rating}
              </Badge>
              <Badge variant="outline">
                {tender.customer.verifiedStatus === 'verified' ? 'Верифицирован' : 'Не верифицирован'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{tender.bidsCount} заявок</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Tabs defaultValue="requirements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requirements">Требования</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
          <TabsTrigger value="bids">Заявки ({bids.length})</TabsTrigger>
          <TabsTrigger value="timeline">График</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Требования к участникам</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Минимальный опыт</h4>
                <p className="text-muted-foreground">
                  {tender.criteria.minExperience} лет в сфере строительства
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Необходимые лицензии</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {tender.criteria.requiredLicenses.map((license, index) => (
                    <li key={index}>{license}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Технические требования</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {tender.criteria.technicalRequirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Документы тендера</CardTitle>
              <CardDescription>
                Скачайте необходимые документы для подготовки заявки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tender.docs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.size}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Скачать
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bids">
          <Card>
            <CardHeader>
              <CardTitle>Поданные заявки</CardTitle>
              <CardDescription>
                {user?.role === 'customer' && tender.customer.name.includes(user.email) 
                  ? 'Заявки на ваш тендер'
                  : 'Информация о количестве поданных заявок'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.role === 'customer' ? (
                <div className="space-y-4">
                  {bids.map((bid) => (
                    <div key={bid.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{bid.supplier.name}</h4>
                        <Badge variant="outline">{bid.status}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Цена: </span>
                          <span className="font-medium">
                            {formatCurrency(bid.price, bid.currency)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Срок: </span>
                          <span className="font-medium">{bid.etaDays} дней</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Рейтинг: </span>
                          <span className="font-medium">{bid.supplier.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Подано заявок: {tender.bidsCount}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Детальная информация доступна только заказчику
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>График выполнения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-medium">Подача заявок</p>
                    <p className="text-sm text-muted-foreground">
                      До {formatDate(tender.deadlines.submissionDeadline)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <div>
                    <p className="font-medium">Рассмотрение заявок</p>
                    <p className="text-sm text-muted-foreground">
                      7-14 рабочих дней после закрытия подачи
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <div>
                    <p className="font-medium">Выполнение работ</p>
                    <p className="text-sm text-muted-foreground">
                      До {formatDate(tender.deadlines.executionDeadline)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
