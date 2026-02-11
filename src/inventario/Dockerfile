# Dockerfile para Microservicio de Inventario
# 
# Construye un microservicio PHP 8.2 con:
# - Extensión MongoDB (versión 1.20.0 compatible con MongoDB 7/8)
# - Composer para dependencias
# - Driver MongoDB optimizado para PHP 8.2
# - Servidor PHP integrado en puerto 3002

FROM php:8.2-cli-alpine

# Instalar extensiones necesarias (mongodb 1.20.0 compatible con PHP 8.2 y MongoDB 7/8)
RUN apk add --no-cache autoconf g++ make openssl-dev \
    && pecl install mongodb-1.20.0 \
    && docker-php-ext-enable mongodb

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiar archivos
COPY . .

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader

# Exponer puerto
EXPOSE 3002

# Comando para ejecutar
CMD ["php", "-S", "0.0.0.0:3002", "-t", "public"]