<?php
// Cargar clase directamente (servicio simulado sin Composer)
require_once __DIR__ . '/../src/Infrastructure/Controllers/PaymentController.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$controller = new App\\Infrastructure\\Controllers\\PaymentController();
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path === '/api/pagos' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    echo $controller->create();
    exit();
}

if (preg_match('#^/api/pagos/[^/]+$#', $path) && $_SERVER['REQUEST_METHOD'] === 'GET') {
    echo $controller->status();
    exit();
}

if ($path === '/health') {
    echo $controller->health();
    exit();
}

http_response_code(404);
echo json_encode(['error' => 'Ruta no encontrada']);
