<?php
/**
 * Microservicio de Carrito de Compras - Punto de entrada
 * 
 * Este archivo maneja todas las peticiones HTTP para el servicio de carrito.
 * Proporciona endpoints para gestión del carrito de compras usando Redis.
 * 
 * Endpoints disponibles:
 * - GET /api/carrito/{usuario_id}: Obtener productos del carrito de un usuario
 * - POST /api/carrito: Agregar producto al carrito
 * - GET /health: Estado del servicio
 */

require __DIR__ . '/../vendor/autoload.php';

// Configuración de headers para API REST
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$controller = new App\Infrastructure\Controllers\CarritoController();
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Match para /api/carrito/clear (POST), /api/carrito o /api/carrito/{usuario_id}
if ($path === '/api/carrito/clear' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    echo $controller->clear();
} elseif (preg_match('#^/api/carrito(/[^/]+)?$#', $path)) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        echo $controller->obtener();
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        echo $controller->agregar();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
} elseif ($path === '/health') {
    echo $controller->health();
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Ruta no encontrada', 'path' => $path]);
}