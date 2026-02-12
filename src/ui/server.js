/**
 * Servidor de Interfaz de Usuario
 * 
 * Aplicación Express.js que proporciona una interfaz web para probar el API Gateway.
 * Funcionalidades principales:
 * - Sistema de autenticación con sesión en memoria
 * - Navegación entre vistas (login, registro, productos, carrito, perfil)
 * - Comunicación con microservicios a través del API Gateway
 * - Detección automática de entorno (Docker/localhost)
 * - Renderizado con Pug templates y Bootstrap
 */

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// Configuración de Express y middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Detección automática del entorno y configuración de API base
// Permite funcionamiento tanto en Docker como en localhost
let API_BASE = process.env.API_GATEWAY_URL;
if (!API_BASE) {
  // Si no está definida, intentar detectar entorno
  if (process.env.NODE_ENV === 'development' || process.env.LOCALHOST) {
    API_BASE = 'http://localhost:8080';
  } else {
    API_BASE = 'http://api-gateway:8080';
  }
}

// Estado de sesión simple en memoria (solo para demo, no usar en producción)
// En un entorno real se usaría Redis, base de datos o JWT
let session = {};

// RUTAS DE AUTENTICACIÓN

// Página principal - muestra login si no hay sesión activa
app.get('/', (req, res) => {
  if (session.token) {
    res.redirect('/productos');
  } else {
    res.render('login', { login: false, currentPage: 'home', error: null });
  }
});

// Cerrar sesión
app.get('/logout', (req, res) => {
  session = {};
  res.redirect('/');
});

// Procesamiento de login - autentica usuario y redirige a productos
app.post('/login', async (req, res) => {
  try {
    // Llamada al microservicio de usuario a través del API Gateway
    const r = await fetch(API_BASE + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: req.body.email, password: req.body.password })
    });
    const data = await r.json();
    if (data.token) {
      session.token = data.token;
      session.email = req.body.email;
      // Usar email sin @ para evitar problemas en URL
      session.userId = req.body.email.replace('@', '-at-').replace(/\./g, '-');
      res.redirect('/productos');
    } else {
      res.render('login', { login: false, currentPage: 'home', error: data.message || 'Error de login' });
    }
  } catch (e) {
    res.render('login', { login: false, currentPage: 'home', error: 'Error de conexión' });
  }
});

// RUTAS DE GESTIÓN DE USUARIOS

// Vista de registro de nuevos usuarios
app.get('/registro', (req, res) => {
  res.render('registro', { login: !!session.token, currentPage: 'registro', registro: null, error: null });
});

app.post('/registro', async (req, res) => {
  try {
    const r = await fetch(API_BASE + '/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: req.body.nombre, email: req.body.email, password: req.body.password })
    });
    const data = await r.json();
    res.render('registro', { login: !!session.token, currentPage: 'registro', registro: data, error: null });
  } catch (e) {
    res.render('registro', { login: !!session.token, currentPage: 'registro', registro: null, error: 'Error de conexión' });
  }
});

// RUTAS DE PRODUCTOS E INVENTARIO

// Lista de productos disponibles desde el microservicio de inventario
app.get('/productos', async (req, res) => {
  try {
    const r = await fetch(API_BASE + '/api/productos');
    let productos = await r.json();
    // Si la respuesta es {productos: [...]}, extraer el array
    if (productos && productos.productos && Array.isArray(productos.productos)) {
      productos = productos.productos;
    }
    res.render('productos', { 
      login: !!session.token, 
      productos, 
      currentPage: 'productos',
      error: null 
    });
  } catch (e) {
    res.render('productos', { 
      login: !!session.token, 
      productos: [], 
      currentPage: 'productos',
      error: 'No se pudieron cargar productos' 
    });
  }
});

// Detalle de producto - busca en la lista de productos por SKU
app.get('/producto/:sku', async (req, res) => {
  try {
    const r = await fetch(API_BASE + '/api/productos');
    let data = await r.json();
    let productos = data.productos || data;
    const producto = productos.find(p => p.sku === req.params.sku);
    res.render('producto', { 
      login: !!session.token, 
      producto, 
      email: session.email,
      currentPage: 'productos',
      error: producto ? null : 'Producto no encontrado' 
    });
  } catch (e) {
    res.render('producto', { 
      login: !!session.token, 
      producto: null, 
      currentPage: 'productos',
      error: 'No se pudo cargar el producto' 
    });
  }
});

// RUTAS DEL CARRITO DE COMPRAS

// Agregar producto al carrito del usuario autenticado
app.post('/carrito/agregar', async (req, res) => {
  if (!session.token || !session.userId) {
    return res.redirect('/');
  }
  
  try {
    // Primero obtener información del producto
    const rProductos = await fetch(API_BASE + '/api/productos');
    let data = await rProductos.json();
    let productos = data.productos || data;
    const producto = productos.find(p => p.sku === req.body.sku);
    
    if (!producto) {
      return res.redirect('/carrito?error=producto_no_encontrado');
    }
    
    const r = await fetch(API_BASE + '/api/carrito', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        usuario: session.userId,
        producto: req.body.sku,
        cantidad: parseInt(req.body.cantidad) || 1,
        precio: producto.precio,
        nombre: producto.nombre
      })
    });
    const result = await r.json();
    res.redirect('/carrito?added=true');
  } catch (e) {
    console.error('Error agregando al carrito:', e);
    res.redirect('/carrito?error=true');
  }
});

// Vista de carrito
app.get('/carrito', async (req, res) => {
  if (!session.token || !session.userId) {
    // Si no hay sesión, mostrar carrito vacío con mensaje de login
    return res.render('carrito', { 
      login: false, 
      carrito: { items: [], total: '0.00', mensaje: 'Inicia sesión para ver tu carrito' }, 
      currentPage: 'carrito',
      added: false,
      error: 'Debes iniciar sesión para usar el carrito' 
    });
  }
  
  try {
    console.log(`Obteniendo carrito para usuario: ${session.userId}`);
    const r = await fetch(API_BASE + `/api/carrito/${session.userId}`);
    
    if (!r.ok) {
      throw new Error(`HTTP ${r.status}: ${r.statusText}`);
    }
    
    const carrito = await r.json();
    console.log(`Carrito cargado:`, carrito);
    
    res.render('carrito', { 
      login: !!session.token, 
      carrito, 
      currentPage: 'carrito',
      added: req.query.added === 'true',
      error: req.query.error === 'true' ? 'No se pudo agregar al carrito' : null 
    });
  } catch (e) {
    console.error('Error cargando carrito:', e.message);
    res.render('carrito', { 
      login: !!session.token, 
      carrito: { items: [], total: '0.00', mensaje: 'Error al cargar' }, 
      currentPage: 'carrito',
      error: `Error: ${e.message}. Verifica que todos los servicios estén activos.`
    });
  }
});

// Vista de perfil
app.get('/perfil', async (req, res) => {
  if (!session.token) return res.redirect('/');
  try {
    const perfil = {
      nombre: session.nombre || 'Usuario',
      email: session.email,
      token: session.token
    };
    res.render('perfil', { login: true, currentPage: 'perfil', perfil, error: null });
  } catch (e) {
    res.render('perfil', { login: true, currentPage: 'perfil', perfil: null, error: 'No se pudo cargar el perfil' });
  }
});

// Página de pago - muestra formulario con resumen del carrito
app.get('/pago', async (req, res) => {
  if (!session.token || !session.userId) return res.redirect('/');
  try {
    const r = await fetch(API_BASE + `/api/carrito/${session.userId}`);
    const carrito = await r.json();
    const total = parseFloat(carrito.total || 0);
    res.render('pago', { login: !!session.token, carrito, total, currentPage: 'pago', error: null });
  } catch (e) {
    res.render('pago', { login: !!session.token, carrito: { items: [] }, total: 0, currentPage: 'pago', error: 'No se pudo cargar carrito' });
  }
});

// Procesar pago (simulado) - envía al servicio de pagos a través del API Gateway
app.post('/pago/process', async (req, res) => {
  if (!session.token || !session.userId) return res.redirect('/');
  try {
    const amount = parseFloat(req.body.amount) || 0;
    const body = {
      usuario: session.userId,
      amount,
      currency: req.body.currency || 'USD',
      method: 'card',
      metadata: { card_holder: req.body.card_holder || 'Anon' }
    };

    const r = await fetch(API_BASE + '/api/pagos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    if (data.payment_id) {
      res.redirect(`/pago/result?id=${data.payment_id}`);
    } else {
      res.render('pago', { login: !!session.token, carrito: { items: [] }, total: amount, currentPage: 'pago', error: 'Error procesando pago' });
    }
  } catch (e) {
    console.error('Error procesando pago:', e);
    res.render('pago', { login: !!session.token, carrito: { items: [] }, total: 0, currentPage: 'pago', error: 'Error de conexión' });
  }
});

// Resultado del pago
app.get('/pago/result', async (req, res) => {
  if (!session.token || !session.userId) return res.redirect('/');
  const id = req.query.id;
  if (!id) return res.redirect('/productos');
  try {
    const r = await fetch(API_BASE + `/api/pagos/${id}`);
    const result = await r.json();
    res.render('pago_result', { login: !!session.token, result, currentPage: 'pago' });
  } catch (e) {
    res.render('pago_result', { login: !!session.token, result: null, currentPage: 'pago', error: 'No se pudo obtener estado de pago' });
  }
});

// INICIALIZACIÓN DEL SERVIDOR

// Inicia el servidor en puerto 3000
app.listen(3000, () => console.log('UI corriendo en puerto 3000'));
