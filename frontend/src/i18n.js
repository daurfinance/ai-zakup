import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ru: {
    translation: {
      // Общие
      "welcome": "Добро пожаловать",
      "login": "Войти",
      "register": "Регистрация",
      "logout": "Выйти",
      "save": "Сохранить",
      "cancel": "Отмена",
      "delete": "Удалить",
      "edit": "Редактировать",
      "create": "Создать",
      "search": "Поиск",
      "filter": "Фильтр",
      "loading": "Загрузка...",
      "error": "Ошибка",
      "success": "Успешно",
      
      // Навигация
      "nav.home": "Главная",
      "nav.tenders": "Тендеры",
      "nav.my_tenders": "Мои тендеры",
      "nav.my_bids": "Мои заявки",
      "nav.profile": "Профиль",
      "nav.admin": "Администрирование",
      
      // Аутентификация
      "auth.email": "Email",
      "auth.password": "Пароль",
      "auth.phone": "Телефон",
      "auth.role": "Роль",
      "auth.customer": "Заказчик",
      "auth.supplier": "Поставщик",
      "auth.admin": "Администратор",
      "auth.login_title": "Вход в систему",
      "auth.register_title": "Регистрация",
      "auth.forgot_password": "Забыли пароль?",
      "auth.remember_me": "Запомнить меня",
      "auth.2fa_setup": "Настройка двухфакторной аутентификации",
      "auth.2fa_code": "Код из приложения",
      "auth.verify_2fa": "Подтвердить код",
      
      // Компании
      "company.profile": "Профиль компании",
      "company.name": "Наименование",
      "company.bin_iin": "БИН/ИИН",
      "company.opf": "ОПФ",
      "company.address": "Адрес",
      "company.bank_details": "Банковские реквизиты",
      "company.licenses": "Лицензии",
      "company.rating": "Рейтинг",
      "company.verified": "Верифицирована",
      "company.not_verified": "Не верифицирована",
      "company.blacklisted": "В черном списке",
      
      // Тендеры/Лоты
      "lot.title": "Название лота",
      "lot.description": "Описание",
      "lot.budget": "Бюджет",
      "lot.currency": "Валюта",
      "lot.region": "Регион",
      "lot.method": "Метод закупки",
      "lot.type": "Тип лота",
      "lot.gen": "Генеральный подряд",
      "lot.sub": "Субподряд",
      "lot.tender": "Тендер",
      "lot.request_quotes": "Запрос ценовых предложений",
      "lot.single_source": "Из одного источника",
      "lot.status": "Статус",
      "lot.draft": "Черновик",
      "lot.published": "Опубликован",
      "lot.closed": "Закрыт",
      "lot.winner_selected": "Победитель выбран",
      "lot.create": "Создать лот",
      "lot.publish": "Опубликовать",
      "lot.close": "Закрыть",
      "lot.bids_count": "Количество заявок",
      "lot.deadline": "Срок подачи заявок",
      "lot.execution_deadline": "Срок выполнения",
      
      // Заявки
      "bid.submit": "Подать заявку",
      "bid.price": "Цена",
      "bid.eta_days": "Срок выполнения (дней)",
      "bid.attachments": "Вложения",
      "bid.status": "Статус заявки",
      "bid.pending": "На рассмотрении",
      "bid.approved": "Одобрена",
      "bid.rejected": "Отклонена",
      "bid.winner": "Победитель",
      "bid.withdraw": "Отозвать заявку",
      
      // Эскроу
      "escrow.account": "Эскроу счет",
      "escrow.balance": "Баланс",
      "escrow.deposit": "Депозит",
      "escrow.withdraw": "Вывод",
      "escrow.status": "Статус счета",
      "escrow.created": "Создан",
      "escrow.active": "Активен",
      "escrow.closed": "Закрыт",
      
      // Гарантии
      "guarantee.bank": "Банковская гарантия",
      "guarantee.type": "Тип гарантии",
      "guarantee.performance": "Исполнения",
      "guarantee.advance": "Авансовая",
      "guarantee.tender": "Тендерная",
      "guarantee.amount": "Сумма гарантии",
      "guarantee.valid_until": "Действительна до",
      
      // Договоры и акты
      "contract.title": "Договор",
      "contract.sign": "Подписать",
      "contract.signed": "Подписан",
      "contract.pending": "Ожидает подписания",
      "act.title": "Акт выполненных работ",
      "act.stage": "Этап",
      "act.amount": "Сумма",
      "act.sign_customer": "Подпись заказчика",
      "act.sign_supplier": "Подпись поставщика",
      
      // Уведомления
      "notification.new_bid": "Новая заявка на ваш лот",
      "notification.bid_approved": "Ваша заявка одобрена",
      "notification.winner_selected": "Выбран победитель тендера",
      "notification.contract_ready": "Договор готов к подписанию",
      "notification.act_signed": "Акт подписан",
      "notification.payment_received": "Получен платеж",
      
      // Ошибки
      "error.network": "Ошибка сети",
      "error.unauthorized": "Не авторизован",
      "error.forbidden": "Доступ запрещен",
      "error.not_found": "Не найдено",
      "error.validation": "Ошибка валидации",
      "error.server": "Ошибка сервера"
    }
  },
  kz: {
    translation: {
      // Общие
      "welcome": "Қош келдіңіз",
      "login": "Кіру",
      "register": "Тіркелу",
      "logout": "Шығу",
      "save": "Сақтау",
      "cancel": "Болдырмау",
      "delete": "Жою",
      "edit": "Өңдеу",
      "create": "Жасау",
      "search": "Іздеу",
      "filter": "Сүзгі",
      "loading": "Жүктелуде...",
      "error": "Қате",
      "success": "Сәтті",
      
      // Навигация
      "nav.home": "Басты бет",
      "nav.tenders": "Тендерлер",
      "nav.my_tenders": "Менің тендерлерім",
      "nav.my_bids": "Менің өтінімдерім",
      "nav.profile": "Профиль",
      "nav.admin": "Әкімшілік",
      
      // Аутентификация
      "auth.email": "Email",
      "auth.password": "Құпия сөз",
      "auth.phone": "Телефон",
      "auth.role": "Рөл",
      "auth.customer": "Тапсырыс беруші",
      "auth.supplier": "Жеткізуші",
      "auth.admin": "Әкімші",
      "auth.login_title": "Жүйеге кіру",
      "auth.register_title": "Тіркелу",
      "auth.forgot_password": "Құпия сөзді ұмыттыңыз ба?",
      "auth.remember_me": "Мені есте сақта",
      "auth.2fa_setup": "Екі факторлы аутентификацияны орнату",
      "auth.2fa_code": "Қосымшадан код",
      "auth.verify_2fa": "Кодты растау",
      
      // Компании
      "company.profile": "Компания профилі",
      "company.name": "Атауы",
      "company.bin_iin": "БСН/ЖСН",
      "company.opf": "ҰҚФ",
      "company.address": "Мекенжай",
      "company.bank_details": "Банк деректемелері",
      "company.licenses": "Лицензиялар",
      "company.rating": "Рейтинг",
      "company.verified": "Расталған",
      "company.not_verified": "Расталмаған",
      "company.blacklisted": "Қара тізімде",
      
      // Тендеры/Лоты
      "lot.title": "Лот атауы",
      "lot.description": "Сипаттама",
      "lot.budget": "Бюджет",
      "lot.currency": "Валюта",
      "lot.region": "Аймақ",
      "lot.method": "Сатып алу әдісі",
      "lot.type": "Лот түрі",
      "lot.gen": "Бас мердігер",
      "lot.sub": "Қосалқы мердігер",
      "lot.tender": "Тендер",
      "lot.request_quotes": "Баға ұсыныстарын сұрау",
      "lot.single_source": "Бір көзден",
      "lot.status": "Мәртебе",
      "lot.draft": "Жоба",
      "lot.published": "Жарияланған",
      "lot.closed": "Жабық",
      "lot.winner_selected": "Жеңімпаз таңдалды",
      "lot.create": "Лот жасау",
      "lot.publish": "Жариялау",
      "lot.close": "Жабу",
      "lot.bids_count": "Өтінімдер саны",
      "lot.deadline": "Өтінім беру мерзімі",
      "lot.execution_deadline": "Орындау мерзімі"
    }
  },
  en: {
    translation: {
      // General
      "welcome": "Welcome",
      "login": "Login",
      "register": "Register",
      "logout": "Logout",
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "create": "Create",
      "search": "Search",
      "filter": "Filter",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      
      // Navigation
      "nav.home": "Home",
      "nav.tenders": "Tenders",
      "nav.my_tenders": "My Tenders",
      "nav.my_bids": "My Bids",
      "nav.profile": "Profile",
      "nav.admin": "Administration",
      
      // Authentication
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.phone": "Phone",
      "auth.role": "Role",
      "auth.customer": "Customer",
      "auth.supplier": "Supplier",
      "auth.admin": "Administrator",
      "auth.login_title": "Login",
      "auth.register_title": "Registration",
      "auth.forgot_password": "Forgot password?",
      "auth.remember_me": "Remember me",
      "auth.2fa_setup": "Two-factor authentication setup",
      "auth.2fa_code": "Code from app",
      "auth.verify_2fa": "Verify code",
      
      // Companies
      "company.profile": "Company Profile",
      "company.name": "Name",
      "company.bin_iin": "BIN/IIN",
      "company.opf": "Legal Form",
      "company.address": "Address",
      "company.bank_details": "Bank Details",
      "company.licenses": "Licenses",
      "company.rating": "Rating",
      "company.verified": "Verified",
      "company.not_verified": "Not Verified",
      "company.blacklisted": "Blacklisted",
      
      // Tenders/Lots
      "lot.title": "Lot Title",
      "lot.description": "Description",
      "lot.budget": "Budget",
      "lot.currency": "Currency",
      "lot.region": "Region",
      "lot.method": "Procurement Method",
      "lot.type": "Lot Type",
      "lot.gen": "General Contract",
      "lot.sub": "Subcontract",
      "lot.tender": "Tender",
      "lot.request_quotes": "Request for Quotes",
      "lot.single_source": "Single Source",
      "lot.status": "Status",
      "lot.draft": "Draft",
      "lot.published": "Published",
      "lot.closed": "Closed",
      "lot.winner_selected": "Winner Selected",
      "lot.create": "Create Lot",
      "lot.publish": "Publish",
      "lot.close": "Close",
      "lot.bids_count": "Number of Bids",
      "lot.deadline": "Submission Deadline",
      "lot.execution_deadline": "Execution Deadline"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
