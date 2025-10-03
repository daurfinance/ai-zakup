#!/bin/bash

# AI-Zakup Deployment Script
# Автоматическое развертывание платформы государственных закупок

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для вывода
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка прав root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "Не запускайте этот скрипт от имени root!"
        exit 1
    fi
}

# Проверка операционной системы
check_os() {
    print_info "Проверка операционной системы..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS=$NAME
            VER=$VERSION_ID
            print_success "Обнаружена ОС: $OS $VER"
        else
            print_error "Не удалось определить версию Linux"
            exit 1
        fi
    else
        print_error "Поддерживается только Linux"
        exit 1
    fi
}

# Проверка зависимостей
check_dependencies() {
    print_info "Проверка зависимостей..."
    
    # Проверка Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker не установлен. Устанавливаю..."
        install_docker
    else
        print_success "Docker установлен: $(docker --version)"
    fi
    
    # Проверка Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_warning "Docker Compose не установлен. Устанавливаю..."
        install_docker_compose
    else
        print_success "Docker Compose установлен: $(docker-compose --version)"
    fi
    
    # Проверка Git
    if ! command -v git &> /dev/null; then
        print_warning "Git не установлен. Устанавливаю..."
        install_git
    else
        print_success "Git установлен: $(git --version)"
    fi
}

# Установка Docker
install_docker() {
    print_info "Установка Docker..."
    
    # Обновление пакетов
    sudo apt-get update
    
    # Установка зависимостей
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Добавление GPG ключа Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Добавление репозитория Docker
    echo \
        "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Установка Docker
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Добавление пользователя в группу docker
    sudo usermod -aG docker $USER
    
    # Запуск Docker
    sudo systemctl enable docker
    sudo systemctl start docker
    
    print_success "Docker успешно установлен"
}

# Установка Docker Compose
install_docker_compose() {
    print_info "Установка Docker Compose..."
    
    # Загрузка Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Установка прав
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Создание символической ссылки
    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    
    print_success "Docker Compose успешно установлен"
}

# Установка Git
install_git() {
    print_info "Установка Git..."
    sudo apt-get update
    sudo apt-get install -y git
    print_success "Git успешно установлен"
}

# Настройка переменных окружения
setup_environment() {
    print_info "Настройка переменных окружения..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_info "Создан файл .env из шаблона"
        
        # Генерация случайных паролей
        POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
        REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
        JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-50)
        
        # Замена паролей в .env
        sed -i "s/your-secure-postgres-password/$POSTGRES_PASSWORD/g" .env
        sed -i "s/your-secure-redis-password/$REDIS_PASSWORD/g" .env
        sed -i "s/your-super-secret-jwt-key-change-in-production-minimum-32-characters/$JWT_SECRET/g" .env
        
        print_success "Сгенерированы безопасные пароли"
        print_warning "Пароли сохранены в файле .env - сохраните их в безопасном месте!"
    else
        print_info "Файл .env уже существует"
    fi
}

# Настройка файрвола
setup_firewall() {
    print_info "Настройка файрвола..."
    
    if command -v ufw &> /dev/null; then
        # Разрешение SSH
        sudo ufw allow 22/tcp
        
        # Разрешение HTTP/HTTPS
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        
        # Включение файрвола
        sudo ufw --force enable
        
        print_success "Файрвол настроен"
    else
        print_warning "UFW не установлен, пропускаю настройку файрвола"
    fi
}

# Сборка и запуск приложения
build_and_run() {
    print_info "Сборка и запуск приложения..."
    
    # Остановка существующих контейнеров
    docker-compose down 2>/dev/null || true
    
    # Сборка образов
    print_info "Сборка Docker образов..."
    docker-compose build --no-cache
    
    # Запуск сервисов
    print_info "Запуск сервисов..."
    docker-compose up -d
    
    # Ожидание запуска базы данных
    print_info "Ожидание запуска базы данных..."
    sleep 30
    
    # Применение миграций
    print_info "Применение миграций базы данных..."
    docker-compose exec -T backend npx prisma migrate deploy || true
    
    # Генерация Prisma клиента
    print_info "Генерация Prisma клиента..."
    docker-compose exec -T backend npx prisma generate || true
    
    print_success "Приложение успешно запущено!"
}

# Проверка состояния
check_status() {
    print_info "Проверка состояния сервисов..."
    
    # Проверка контейнеров
    docker-compose ps
    
    # Проверка доступности
    sleep 10
    
    if curl -f http://localhost/health &> /dev/null; then
        print_success "Frontend доступен: http://localhost"
    else
        print_warning "Frontend недоступен"
    fi
    
    if curl -f http://localhost:3000/api &> /dev/null; then
        print_success "Backend API доступен: http://localhost:3000/api"
    else
        print_warning "Backend API недоступен"
    fi
}

# Создание скрипта резервного копирования
setup_backup() {
    print_info "Настройка резервного копирования..."
    
    cat > backup.sh << 'EOF'
#!/bin/bash
# Скрипт резервного копирования AI-Zakup

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

# Создание директории для бэкапов
mkdir -p $BACKUP_DIR

# Резервное копирование базы данных
echo "Создание резервной копии базы данных..."
docker-compose exec -T postgres pg_dump -U postgres ai_zakup > $BACKUP_DIR/database_$DATE.sql

# Сжатие бэкапа
gzip $BACKUP_DIR/database_$DATE.sql

# Резервное копирование файлов загрузок
echo "Создание резервной копии файлов..."
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C backend uploads/ 2>/dev/null || true

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Резервное копирование завершено: $BACKUP_DIR"
EOF

    chmod +x backup.sh
    
    # Добавление в crontab
    (crontab -l 2>/dev/null; echo "0 2 * * * $(pwd)/backup.sh") | crontab -
    
    print_success "Настроено автоматическое резервное копирование (ежедневно в 02:00)"
}

# Вывод информации о завершении
print_completion_info() {
    print_success "Развертывание AI-Zakup завершено!"
    echo
    print_info "Доступ к приложению:"
    echo "  Frontend: http://localhost (или ваш домен)"
    echo "  Backend API: http://localhost:3000/api"
    echo "  Админ-панель: admin@ai-zakup.kz / admin123"
    echo
    print_info "Управление приложением:"
    echo "  Просмотр логов: docker-compose logs -f"
    echo "  Остановка: docker-compose down"
    echo "  Запуск: docker-compose up -d"
    echo "  Резервное копирование: ./backup.sh"
    echo
    print_warning "Важно:"
    echo "  1. Измените пароль администратора после первого входа"
    echo "  2. Настройте SSL сертификаты для продакшена"
    echo "  3. Регулярно обновляйте систему и приложение"
    echo "  4. Мониторьте логи и производительность"
    echo
    print_info "Документация: https://github.com/daurfinance/ai-zakup"
}

# Основная функция
main() {
    echo "=================================================="
    echo "    AI-Zakup - Автоматическое развертывание"
    echo "=================================================="
    echo
    
    check_root
    check_os
    check_dependencies
    setup_environment
    setup_firewall
    build_and_run
    check_status
    setup_backup
    print_completion_info
}

# Обработка ошибок
trap 'print_error "Произошла ошибка на строке $LINENO. Развертывание прервано."; exit 1' ERR

# Запуск основной функции
main "$@"
