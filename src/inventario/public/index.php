<?php
/**
 * Microservicio de Inventario - Punto de entrada
 * 
 * Este archivo maneja todas las peticiones HTTP para el servicio de inventario.
 * Proporciona endpoints para gestión de productos usando MongoDB.
 * 
 * Endpoints disponibles:
 * - GET /api/productos: Listar productos disponibles
 * - POST /api/productos: Crear nuevo producto
 * - GET /health: Estado del servicio
 */

require __DIR__ . '/../vendor/autoload.php';

// Configuración de headers para API REST
header('Content-Type: application/json');

$controller = new App\Infrastructure\Controllers\ProductoController();
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($path) {
    case '/api/productos':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            echo $controller->listar();
        } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo $controller->crear();
        }
        break;
        
    case '/health':
        echo $controller->health();
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Ruta no encontrada']);
}