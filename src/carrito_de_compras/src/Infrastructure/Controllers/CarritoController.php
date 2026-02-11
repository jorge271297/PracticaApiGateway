<?php
/**
 * Controlador de Carrito de Compras
 * 
 * Maneja las operaciones del carrito de compras usando Redis:
 * - Obtener productos del carrito por usuario
 * - Agregar nuevos productos al carrito
 * - Persistencia en Redis para sesiones rápidas
 * - Health check del servicio
 */

namespace App\Infrastructure\Controllers;

use Redis;

class CarritoController
{
    private Redis $redis;

    public function __construct()
    {
        $this->redis = new Redis();
        try {
            $this->redis->connect(getenv('REDIS_HOST') ?: 'redis-carrito', 6379);
        } catch (\Exception $e) {
            // Si falla, intentar con localhost
            $this->redis->connect('localhost', 6379);
        }
    }

    /**
     * Obtener carrito de un usuario específico
     */
    public function obtener(): string
    {
        // Obtener usuario_id de la URL
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $parts = explode('/', $path);
        $usuarioId = end($parts);
        
        $carrito = $this->redis->get("carrito:$usuarioId");
        $items = $carrito ? json_decode($carrito, true) : [];
        
        // Calcular total
        $total = 0;
        foreach ($items as $item) {
            $total += ($item['precio'] ?? 0) * ($item['cantidad'] ?? 0);
        }
        
        return json_encode([
            'usuario' => $usuarioId,
            'items' => $items,
            'total' => number_format($total, 2, '.', ''),
            'mensaje' => count($items) > 0 ? count($items) . ' productos en tu carrito' : 'Carrito vacío'
        ]);
    }

    /**
     * Agregar producto al carrito
     */
    public function agregar(): string
    {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['usuario']) || !isset($data['producto'])) {
            http_response_code(400);
            return json_encode([
                'success' => false,
                'message' => 'Faltan datos: usuario y producto son requeridos'
            ]);
        }
        
        $usuarioId = $data['usuario'];
        $productoSku = $data['producto'];
        $cantidad = $data['cantidad'] ?? 1;
        
        // Obtener carrito actual
        $carrito = $this->redis->get("carrito:$usuarioId");
        $items = $carrito ? json_decode($carrito, true) : [];
        
        // Buscar si el producto ya existe
        $encontrado = false;
        foreach ($items as &$item) {
            if ($item['producto'] === $productoSku) {
                $item['cantidad'] += $cantidad;
                $encontrado = true;
                break;
            }
        }
        
        // Si no existe, agregarlo
        if (!$encontrado) {
            $items[] = [
                'producto' => $productoSku,
                'cantidad' => $cantidad,
                'precio' => $data['precio'] ?? 0,
                'nombre' => $data['nombre'] ?? 'Producto',
                'agregado_en' => date('c')
            ];
        }
        
        // Guardar carrito actualizado
        $this->redis->set("carrito:$usuarioId", json_encode($items));
        
        return json_encode([
            'success' => true,
            'message' => 'Producto agregado al carrito',
            'items' => $items
        ]);
    }

    public function health(): string
    {
        try {
            $this->redis->ping();
            $connected = true;
        } catch (\Exception $e) {
            $connected = false;
        }
        
        return json_encode([
            'status' => $connected ? 'OK' : 'ERROR',
            'service' => 'carrito',
            'redis_connected' => $connected,
            'timestamp' => date('c')
        ]);
    }
}