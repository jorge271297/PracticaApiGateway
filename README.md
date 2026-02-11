# 🛒 API Gateway con Microservicios

Sistema de e-commerce distribuido utilizando arquitectura de microservicios con **KrakenD** como API Gateway. El proyecto incluye servicios de usuarios, inventario de productos y carrito de compras, junto con una interfaz web moderna.

## 📑 Tabla de Contenidos

- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Inicio Rápido](#-inicio-rápido)
- [Servicios](#-servicios)
- [Endpoints Disponibles](#-endpoints-disponibles)
- [Interfaz Web](#-interfaz-web)
- [Configuración del API Gateway](#-configuración-del-api-gateway)
- [Base de Datos](#-base-de-datos)
- [Variables de Entorno](#️-variables-de-entorno)

## 🏗️ Arquitectura

```
┌─────────────┐
│   Cliente   │
│   (Web UI)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│     API Gateway (KrakenD)       │
│         Puerto 8080             │
└────┬──────────┬──────────┬──────┘
     │          │          │
     ▼          ▼          ▼
┌─────────┐ ┌──────────┐ ┌─────────┐
│ Usuario │ │Inventario│ │ Carrito │
│  :3001  │ │  :3002   │ │  :3003  │
└────┬────┘ └────┬─────┘ └────┬────┘
     │           │             │
     ▼           ▼             ▼
┌──────────┐ ┌─────────┐ ┌────────┐
│PostgreSQL│ │ MongoDB │ │ Redis  │
│  :5432   │ │ :27017  │ │ :6379  │
└──────────┘ └─────────┘ └────────┘
```

## 🚀 Tecnologías

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| API Gateway | KrakenD | 2.4.3 |
| Backend Services | PHP | 8.2 |
| Frontend UI | Node.js + Express + Pug | 18.x |
| Base de Datos Usuarios | PostgreSQL | 15 |
| Base de Datos Inventario | MongoDB | 8.0 |
| Cache Carrito | Redis | 7 |
| Contenedores | Docker + Docker Compose | - |
| Estilos | Bootstrap | 5.3.2 |
| Iconos | Font Awesome | 6.5.0 |

## 🚀 Inicio Rápido

### Prerrequisitos

Asegúrate de tener instalado:

- **Docker**: versión 20.10 o superior
- **Docker Compose**: versión 2.0 o superior

Verifica las instalaciones:
```bash
docker --version
docker compose version
```

### Primera Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio-url>
   cd PracticaApiGateway
   ```

2. **Construir y levantar todos los servicios**
   ```bash
   docker compose up --build
   ```
   
   Este comando:
   - Construye las imágenes de los 4 microservicios (usuario, inventario, carrito, ui)
   - Descarga imágenes base (KrakenD, PostgreSQL, MongoDB, Redis)
   - Crea las redes y volúmenes necesarios
   - Inicializa las bases de datos automáticamente
   - Levanta todos los servicios

3. **Verificar inicialización de MongoDB**
   
   El sistema incluye inicialización automática de la base de datos de productos. Espera a ver este mensaje:
   ```
   mongo-init     | ✅ Base de datos inicializada con 80 productos
   mongo-init exited with code 0
   ```

4. **Verificar que todos los servicios están funcionando**
   ```bash
   curl http://localhost:8080/api/health
   ```
   
   Deberías ver una respuesta como:
   ```json
   {
     "usuario": {"status": "OK", "service": "usuario"},
     "inventario": {"status": "OK", "service": "inventario", "total_productos": 80},
     "carrito": {"status": "OK", "service": "carrito"}
   }
   ```

5. **Acceder a la interfaz web**
   
   Abre tu navegador en: **http://localhost:3000**
   
   - **Usuario de prueba**: `demo@demo.com`
   - **Contraseña**: `demo`

### Comandos Útiles

```bash
# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (resetear bases de datos)
docker compose down -v

# Ver logs de todos los servicios
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f usuario-service

# Reconstruir un servicio específico
docker compose up --build usuario-service

# Reiniciar el API Gateway (después de modificar krakend.json)
docker compose restart api-gateway
```

## 🔧 Servicios

### 1. API Gateway (KrakenD)
- **Puerto**: 8080
- **Función**: Punto de entrada único, enrutamiento, agregación de respuestas
- **Configuración**: [krakend/krakend.json](krakend/krakend.json)
- **Documentación**: Ver [KRAKEND.md](KRAKEND.md) para explicación detallada

### 2. Servicio de Usuarios
- **Puerto**: 3001
- **Base de Datos**: PostgreSQL
- **Funcionalidad**: Registro, login, autenticación JWT
- **Framework**: Slim PHP

### 3. Servicio de Inventario
- **Puerto**: 3002
- **Base de Datos**: MongoDB 8.0
- **Funcionalidad**: 80 productos reales en 6 categorías
- **Categorías**: Tecnología, Hogar, Moda, Deportes, Libros, Juguetes

### 4. Servicio de Carrito
- **Puerto**: 3003
- **Cache**: Redis
- **Funcionalidad**: Agregar productos, obtener carrito, cálculo de totales
- **Persistencia**: En memoria (Redis)

### 5. Interfaz Web (UI)
- **Puerto**: 3000
- **Framework**: Express + Pug templates
- **Funcionalidades**:
  - Login/Registro de usuarios
  - Catálogo de productos con búsqueda
  - Detalle de productos
  - Carrito de compras
  - Diseño responsivo con Bootstrap

## 📡 Endpoints Disponibles

### Health Check
```http
GET http://localhost:8080/api/health
```
Retorna el estado de los tres microservicios (agregado).

### Autenticación

**Registro de Usuario**
```http
POST http://localhost:8080/api/auth/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Login**
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```

### Productos

**Listar Productos**
```http
GET http://localhost:8080/api/productos
```
Retorna catálogo completo de 80 productos.

### Carrito

**Obtener Carrito**
```http
GET http://localhost:8080/api/carrito/{usuario_id}
```

**Agregar Producto al Carrito**
```http
POST http://localhost:8080/api/carrito
Content-Type: application/json

{
  "usuario": "user_123",
  "producto": "TEC-0001",
  "cantidad": 2,
  "precio": 1199.99,
  "nombre": "iPhone 15 Pro Max"
}
```

## 🌐 Interfaz Web

La interfaz web está disponible en **http://localhost:3000** e incluye:

### Características
- ✅ Sistema de autenticación con sesiones
- ✅ Catálogo de productos con imágenes
- ✅ Búsqueda en tiempo real
- ✅ Vista detallada de productos
- ✅ Carrito de compras funcional
- ✅ Navbar responsivo con menú
- ✅ Diseño moderno con Bootstrap 5

### Usuario de Prueba
```
Email: demo@demo.com
Password: demo
```

## 📘 Configuración del API Gateway

El API Gateway utiliza **KrakenD** para:
- Enrutar peticiones a los microservicios correspondientes
- Agregar respuestas de múltiples servicios
- Manejar CORS y headers HTTP
- Proporcionar un punto de entrada único

Para entender en detalle cómo funciona el archivo `krakend.json`, consulta la documentación completa:

➡️ **[KRAKEND.md - Configuración del API Gateway](KRAKEND.md)**

Este documento explica:
- Estructura del archivo krakend.json
- Cada endpoint configurado
- Flujo de las peticiones
- Cómo agregar nuevos endpoints
- Características de enrutamiento y agregación

## 🗄️ Base de Datos

### PostgreSQL (Usuarios)
- **Puerto**: 5432
- **Base de Datos**: `usuarios_db`
- **Usuario**: `postgres`
- **Password**: `postgres`
- **Tablas**: `usuarios`

### MongoDB (Inventario)
- **Puerto**: 27017
- **Base de Datos**: `inventario_db`
- **Colección**: `productos`
- **Inicialización**: Automática con 80 productos reales
- **Categorías**: 6 categorías diferentes

### Redis (Carrito)
- **Puerto**: 6379
- **Persistencia**: En memoria
- **Estructura**: Hash por usuario
- **Keys**: `carrito:{usuario_id}`

## 📝 Estructura del Proyecto

```
PracticaApiGateway/
├── docker-compose.yml          # Orquestación de servicios
├── krakend/
│   └── krakend.json           # Configuración del API Gateway
├── src/
│   ├── usuario/               # Servicio de autenticación
│   │   ├── .env.example       # Variables de entorno (plantilla)
│   │   ├── Dockerfile
│   │   ├── composer.json
│   │   ├── init.sql           # Schema PostgreSQL
│   │   └── src/
│   ├── inventario/            # Servicio de productos
│   │   ├── .env.example       # Variables de entorno (plantilla)
│   │   ├── Dockerfile
│   │   ├── composer.json
│   │   └── src/
│   ├── carrito_de_compras/    # Servicio de carrito
│   │   ├── .env.example       # Variables de entorno (plantilla)
│   │   ├── Dockerfile
│   │   ├── composer.json
│   │   └── src/
│   └── ui/                    # Interfaz web
│       ├── .env.example       # Variables de entorno (plantilla)
│       ├── Dockerfile
│       ├── package.json
│       ├── server.js
│       └── views/             # Templates Pug
├── init-mongo/
│   └── init-products.js       # Script de inicialización MongoDB
├── KRAKEND.md                 # Documentación del API Gateway
└── README.md                  # Este archivo
```

## ⚙️ Variables de Entorno

Cada microservicio utiliza variables de entorno para su configuración. El proyecto incluye archivos `.env.example` como plantillas.

### Configuración Inicial

**Si usas Docker Compose** (recomendado), las variables de entorno ya están configuradas en el archivo `docker-compose.yml` y no necesitas crear archivos `.env`.

**Para desarrollo local** sin Docker, sigue estos pasos:

1. **Servicio de Usuario**
   ```bash
   cd src/usuario
   cp .env.example .env
   ```
   Edita `.env` y ajusta los valores:
   - `DB_HOST`: Host de PostgreSQL (por defecto: `db-usuario`)
   - `DB_PORT`: Puerto de PostgreSQL (por defecto: `5432`)
   - `DB_NAME`: Nombre de la base de datos (por defecto: `usuarios`)
   - `DB_USER`: Usuario de PostgreSQL (por defecto: `admin`)
   - `DB_PASSWORD`: Contraseña de PostgreSQL (por defecto: `admin123`)
   - `JWT_SECRET`: **⚠️ IMPORTANTE** - Cambia este valor en producción por uno seguro

2. **Servicio de Inventario**
   ```bash
   cd src/inventario
   cp .env.example .env
   ```
   Edita `.env` y ajusta:
   - `MONGO_HOST`: Host de MongoDB (por defecto: `mongo-inventario`)
   - `MONGO_INITDB_DATABASE`: Base de datos (por defecto: `inventario`)

3. **Servicio de Carrito**
   ```bash
   cd src/carrito_de_compras
   cp .env.example .env
   ```
   Edita `.env` y ajusta:
   - `REDIS_HOST`: Host de Redis (por defecto: `redis-carrito`)

4. **Interfaz Web (UI)**
   ```bash
   cd src/ui
   cp .env.example .env
   ```
   Edita `.env` y ajusta:
   - `API_GATEWAY_URL`: URL del API Gateway (por defecto: `http://api-gateway:8080`)
   - `NODE_ENV`: Entorno (opcional, usar `development` para desarrollo local)

### ⚠️ Seguridad en Producción

**NUNCA** subas archivos `.env` con datos sensibles al repositorio. Los archivos `.env` están excluidos en `.gitignore`.

Para producción, asegúrate de cambiar:
- ✅ `JWT_SECRET` - Usa un valor aleatorio y seguro
- ✅ `DB_PASSWORD` - Usa contraseñas fuertes
- ✅ `DB_USER` - No uses nombres predecibles como "admin"

### Ejemplo de Configuración Local

Si ejecutas los servicios fuera de Docker en tu máquina local:

```env
# src/usuario/.env (localhost)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=usuarios
DB_USER=postgres
DB_PASSWORD=tu_password_seguro
JWT_SECRET=genera_un_secreto_aleatorio_aqui
```

```env
# src/ui/.env (localhost)
API_GATEWAY_URL=http://localhost:8080
NODE_ENV=development
```

## 🧪 Pruebas

El proyecto incluye un archivo `PracticaApiGateWay.http` con ejemplos de peticiones HTTP que puedes ejecutar con extensiones como REST Client en VS Code.

## 🤝 Contribuir

Este es un proyecto académico de práctica. Para contribuir:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto es de uso académico y educativo.

---

**Desarrollado con ❤️ como proyecto de práctica de microservicios**
