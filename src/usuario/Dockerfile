# Dockerfile para Microservicio de Usuario
# 
# Construye un microservicio PHP 8.2 con:
# - Extensiones PostgreSQL (pdo_pgsql)
# - Composer para dependencias
# - Firebase JWT para autenticación
# - Servidor PHP integrado en puerto 3001

FROM php:8.2-cli-alpine

# Instalar extensiones necesarias
RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiar archivos
COPY . .

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader

# Exponer puerto
EXPOSE 3001

# Comando para ejecutar
CMD ["php", "-S", "0.0.0.0:3001", "-t", "public"]