import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building, Mail, Phone, MapPin, Award, Shield, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCompany = {
        id: '1',
        name: 'ТОО "СтройМастер"',
        binIin: '123456789012',
        opf: 'ТОО',
        address: 'г. Алматы, ул. Абая, 150',
        rating: 4.2,
        verifiedStatus: 'verified',
        blacklistFlag: false,
        bankReqs: {
          bankName: 'Казкоммерцбанк',
          iban: 'KZ123456789012345678',
          bik: 'KKMFKZ2A'
        },
        licenses: [
          {
            type: 'Строительная лицензия категории А',
            number: 'СТР-А-12345',
            validUntil: '2025-12-31'
          },
          {
            type: 'Лицензия на проектирование',
            number: 'ПРО-123456',
            validUntil: '2024-06-30'
          }
        ],
        contact: {
          email: user?.email || 'info@stroymaster.kz',
          phone: '+7 727 123 45 67',
          website: 'https://stroymaster.kz'
        },
        stats: {
          totalTenders: 25,
          wonTenders: 8,
          successRate: 32,
          totalValue: 450000000
        }
      };
      setCompany(mockCompany);
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVerificationBadge = (status) => {
    const statusConfig = {
      verified: { label: 'Верифицирована', variant: 'success', icon: Shield },
      pending: { label: 'На проверке', variant: 'default', icon: Shield },
      draft: { label: 'Не верифицирована', variant: 'secondary', icon: Shield },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const formatCurrency = (amount, currency = 'KZT') => {
    return new Intl.NumberFormat('ru-KZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Профиль компании не найден</h2>
        <p className="text-muted-foreground mb-4">
          Пожалуйста, заполните информацию о вашей компании.
        </p>
        <Button>Создать профиль</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Профиль компании</h1>
          <p className="text-muted-foreground mt-2">
            Управляйте информацией о вашей компании
          </p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Редактировать
        </Button>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                <Building className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">{company.name}</CardTitle>
                <CardDescription className="text-base">
                  {company.opf} • БИН/ИИН: {company.binIin}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getVerificationBadge(company.verifiedStatus)}
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{company.rating}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Адрес</p>
                  <p className="font-medium">{company.address}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{company.contact.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Телефон</p>
                  <p className="font-medium">{company.contact.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Банковские реквизиты</p>
                <div className="space-y-1">
                  <p className="font-medium">{company.bankReqs.bankName}</p>
                  <p className="text-sm">IBAN: {company.bankReqs.iban}</p>
                  <p className="text-sm">БИК: {company.bankReqs.bik}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{company.stats.totalTenders}</div>
            <p className="text-sm text-muted-foreground">Участие в тендерах</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{company.stats.wonTenders}</div>
            <p className="text-sm text-muted-foreground">Выигранных тендеров</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{company.stats.successRate}%</div>
            <p className="text-sm text-muted-foreground">Успешность</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(company.stats.totalValue)}
            </div>
            <p className="text-sm text-muted-foreground">Общая стоимость</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="licenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="licenses">Лицензии</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses">
          <Card>
            <CardHeader>
              <CardTitle>Лицензии и сертификаты</CardTitle>
              <CardDescription>
                Действующие лицензии и сертификаты компании
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {company.licenses.map((license, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{license.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        Номер: {license.number}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Действует до</p>
                      <p className="font-medium">
                        {new Date(license.validUntil).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Документы компании</CardTitle>
              <CardDescription>
                Загруженные документы и справки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Документы не загружены
                </p>
                <Button className="mt-4">Загрузить документы</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>История активности</CardTitle>
              <CardDescription>
                Последние действия в системе
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  История активности пуста
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Настройки профиля</CardTitle>
              <CardDescription>
                Управление настройками аккаунта и уведомлений
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email уведомления</h4>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления о новых тендерах
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Настроить
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Двухфакторная аутентификация</h4>
                    <p className="text-sm text-muted-foreground">
                      Дополнительная защита аккаунта
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Настроить
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Смена пароля</h4>
                    <p className="text-sm text-muted-foreground">
                      Обновить пароль для входа
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Изменить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
