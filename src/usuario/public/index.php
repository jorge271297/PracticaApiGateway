<?php
/**
 * Microservicio de Usuario - Punto de entrada
 * 
 * Este archivo maneja todas las peticiones HTTP para el servicio de usuarios.
 * Proporciona endpoints para registro, login, perfil y validación JWT.
 * 
 * Endpoints disponibles:
 * - POST /api/usuarios/registro: Crear nuevo usuario
 * - POST /api/usuarios/login: Autenticación de usuario
 * - GET /api/usuarios/perfil: Obtener perfil de usuario autenticado
 * - GET /api/jwks: Claves públicas para validación JWT
 * - GET /health: Estado del servicio
 */

require __DIR__ . '/../vendor/autoload.php';

// Configuración de headers para API REST
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$controller = new App\Infrastructure\Controllers\AuthController();
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($path) {
    case '/api/usuarios/registro':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo $controller->register();
        }
        break;
        
    case '/api/usuarios/login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo $controller->login();
        }
        break;
        
    case '/api/usuarios/perfil':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            echo $controller->profile();
        }
        break;
        
    case '/api/jwks':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            echo $controller->jwks();
        }
        break;
        
    case '/health':
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            echo $controller->health();
        }
        break;
        
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Ruta no encontrada']);
}