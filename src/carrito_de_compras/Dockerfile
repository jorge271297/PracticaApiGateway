# Dockerfile para Microservicio de Carrito
# 
# Construye un microservicio PHP 8.2 con:
# - Extensión Redis para caché en memoria
# - Composer para dependencias
# - Cliente Redis para PHP
# - Servidor PHP integrado en puerto 3003

FROM php:8.2-cli-alpine

# Instalar extensiones necesarias
RUN apk add --no-cache autoconf g++ make \
    && pecl install redis \
    && docker-php-ext-enable redis

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiar archivos
COPY . .

# Instalar dependencias
RUN composer install --no-dev --optimize-autoloader

# Exponer puerto
EXPOSE 3003

# Comando para ejecutar
CMD ["php", "-S", "0.0.0.0:3003", "-t", "public"]