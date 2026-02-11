# 📡 Configuración del API Gateway - KrakenD

Este documento explica en detalle la configuración del API Gateway utilizando KrakenD y el archivo `krakend.json`.

## 📋 Tabla de Contenidos

- [¿Qué es KrakenD?](#qué-es-krakend)
- [Estructura del krakend.json](#estructura-del-krakend-json)
- [Endpoints Configurados](#endpoints-configurados)
- [Características Implementadas](#características-implementadas)
- [Cómo Funciona](#cómo-funciona)

## ¿Qué es KrakenD?

**KrakenD** es un API Gateway de alto rendimiento que actúa como punto de entrada único para todos los microservicios. Sus principales funciones son:

- **Enrutamiento**: Redirige peticiones HTTP a los microservicios correspondientes
- **Agregación**: Puede combinar respuestas de múltiples servicios
- **Rate Limiting**: Controla el tráfico y previene sobrecarga
- **Transformación**: Modifica requests/responses según necesidad
- **Autenticación**: Valida tokens JWT y credenciales
- **CORS**: Maneja políticas de acceso cross-origin

## Estructura del krakend.json

El archivo `krakend.json` contiene toda la configuración del API Gateway:

```json
{
  "version": 3,
  "name": "API Gateway Practica",
  "port": 8080,
  "host": ["0.0.0.0"],
  "endpoints": [...]
}
```

### Campos Principales

| Campo | Descripción | Valor |
|-------|-------------|-------|
| `version` | Versión de la configuración de KrakenD | 3 |
| `name` | Nombre descriptivo del gateway | "API Gateway Practica" |
| `port` | Puerto donde escucha el gateway | 8080 |
| `host` | Direcciones IP donde escucha | ["0.0.0.0"] |
| `endpoints` | Array de rutas expuestas | Ver sección siguiente |

## Endpoints Configurados

### 1. Health Check Agregado

**Endpoint**: `GET /api/health`

Combina el estado de salud de los tres microservicios en una sola respuesta.

```json
{
  "endpoint": "/api/health",
  "method": "GET",
  "backend": [
    {
      "url_pattern": "/health",
      "host": ["http://usuario-service:3001"],
      "group": "usuario"
    },
    {
      "url_pattern": "/health",
      "host": ["http://inventario-service:3002"],
      "group": "inventario"
    },
    {
      "url_pattern": "/health",
      "host": ["http://carrito-service:3003"],
      "group": "carrito"
    }
  ]
}
```

**Respuesta Agregada**:
```json
{
  "usuario": {
    "status": "OK",
    "service": "usuario"
  },
  "inventario": {
    "status": "OK", 
    "service": "inventario",
    "total_productos": 80
  },
  "carrito": {
    "status": "OK",
    "service": "carrito"
  }
}
```

### 2. Registro de Usuarios

**Endpoint**: `POST /api/auth/registro`

Crea un nuevo usuario en el sistema.

```json
{
  "endpoint": "/api/auth/registro",
  "method": "POST",
  "backend": [
    {
      "url_pattern": "/api/usuarios/registro",
      "host": ["http://usuario-service:3001"]
    }
  ]
}
```

**Request**:
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

### 3. Login de Usuarios

**Endpoint**: `POST /api/auth/login`

Autentica un usuario y devuelve un token JWT.

```json
{
  "endpoint": "/api/auth/login",
  "method": "POST",
  "backend": [
    {
      "url_pattern": "/api/usuarios/login",
      "host": ["http://usuario-service:3001"]
    }
  ]
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

### 4. Lista de Productos

**Endpoint**: `GET /api/productos`

Obtiene el catálogo completo de productos desde MongoDB.

```json
{
  "endpoint": "/api/productos",
  "method": "GET",
  "backend": [
    {
      "url_pattern": "/api/productos",
      "host": ["http://inventario-service:3002"]
    }
  ]
}
```

**Response**:
```json
{
  "productos": [
    {
      "nombre": "iPhone 15 Pro Max 256GB",
      "precio": 1199.99,
      "categoria": "Tecnología",
      "stock": 25,
      "sku": "TEC-0001"
    },
    ...
  ]
}
```

### 5. Obtener Carrito

**Endpoint**: `GET /api/carrito/{usuario_id}`

Obtiene el carrito de compras de un usuario específico desde Redis.

```json
{
  "endpoint": "/api/carrito/{usuario_id}",
  "method": "GET",
  "backend": [
    {
      "url_pattern": "/api/carrito/{usuario_id}",
      "host": ["http://carrito-service:3003"]
    }
  ]
}
```

**Response**:
```json
{
  "usuario": "user_1",
  "items": [
    {
      "producto": "TEC-0001",
      "cantidad": 2,
      "precio": 1199.99,
      "nombre": "iPhone 15 Pro Max"
    }
  ],
  "total": "2399.98"
}
```

### 6. Agregar al Carrito

**Endpoint**: `POST /api/carrito`

Agrega un producto al carrito del usuario.

```json
{
  "endpoint": "/api/carrito",
  "method": "POST",
  "backend": [
    {
      "url_pattern": "/api/carrito",
      "host": ["http://carrito-service:3003"]
    }
  ]
}
```

**Request**:
```json
{
  "usuario": "user_1",
  "producto": "TEC-0001",
  "cantidad": 2,
  "precio": 1199.99,
  "nombre": "iPhone 15 Pro Max"
}
```

## Características Implementadas

### 🔄 Enrutamiento Dinámico

Cada microservicio es accesible a través del API Gateway sin necesidad de conocer su dirección interna:

- **Usuario Service** (`usuario-service:3001`) → `http://localhost:8080/api/auth/*`
- **Inventario Service** (`inventario-service:3002`) → `http://localhost:8080/api/productos`
- **Carrito Service** (`carrito-service:3003`) → `http://localhost:8080/api/carrito/*`

### 📦 Agregación de Respuestas

El endpoint `/api/health` combina respuestas de múltiples servicios:

```
GET /api/health → Consulta 3 servicios simultáneamente
                → Combina resultados con "group"
                → Retorna respuesta unificada
```

### 🎯 Parámetros Dinámicos

URLs con parámetros como `{usuario_id}` son extraídos y pasados al backend:

```
GET /api/carrito/user_123 
  ↓
GET http://carrito-service:3003/api/carrito/user_123
```

### 🔒 Headers y CORS

KrakenD maneja automáticamente:
- Content-Type: application/json
- CORS headers para peticiones cross-origin
- Forwarding de headers personalizados

## Cómo Funciona

### Flujo de una Petición

```
1. Cliente hace request
   ↓
2. KrakenD recibe en puerto 8080
   ↓
3. Busca endpoint que coincida en krakend.json
   ↓
4. Valida método HTTP (GET, POST, etc.)
   ↓
5. Ejecuta transformaciones (si aplica)
   ↓
6. Envía request al backend correspondiente
   ↓
7. Recibe respuesta del microservicio
   ↓
8. Agrega múltiples respuestas (si aplica)
   ↓
9. Retorna resultado al cliente
```

### Ejemplo Práctico

**Cliente solicita productos:**
```bash
curl http://localhost:8080/api/productos
```

**KrakenD procesa:**
1. Recibe GET en `/api/productos`
2. Encuentra endpoint en krakend.json
3. Hace request a `http://inventario-service:3002/api/productos`
4. Recibe respuesta del microservicio
5. Retorna JSON al cliente

## 🛠️ Modificar la Configuración

### Agregar un Nuevo Endpoint

Para agregar un nuevo endpoint, edita `krakend/krakend.json`:

```json
{
  "endpoint": "/api/nuevo",
  "method": "GET",
  "backend": [
    {
      "url_pattern": "/api/nuevo",
      "host": ["http://nuevo-service:3004"]
    }
  ]
}
```

### Reiniciar KrakenD

Después de modificar `krakend.json`:

```bash
docker compose restart api-gateway
```

## 📚 Referencias

- [Documentación Oficial de KrakenD](https://www.krakend.io/docs/)
- [KrakenD Playground](https://designer.krakend.io/) - Editor visual de configuración
- [KrakenD GitHub](https://github.com/krakend/krakend-ce)

## 🔗 Enlaces Relacionados

- [README Principal](README.md) - Documentación completa del proyecto
- [Docker Compose](docker-compose.yml) - Configuración de servicios

---

**Última actualización**: Febrero 2026  
**Versión KrakenD**: 2.4.3
