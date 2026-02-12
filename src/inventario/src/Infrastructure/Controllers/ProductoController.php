<?php
/**
 * Controlador de Productos
 * 
 * Maneja las operaciones CRUD para productos en el inventario:
 * - Listado de productos con paginación
 * - Creación de nuevos productos
 * - Conexión y operaciones con MongoDB
 * - Health check del servicio
 */

namespace App\Infrastructure\Controllers;

use MongoDB\Client;

class ProductoController
{
    private \MongoDB\Collection $collection;

    public function __construct()
    {
        // Configuración optimizada para MongoDB 8.0 con opciones mejoradas
        $options = [
            'serverSelectionTimeoutMS' => 3000, // Timeout en conexión
            'compressors' => ['snappy', 'zlib'], // Compresión habilitada en MongoDB 8+
            'maxPoolSize' => 10, // Pool de conexiones optimizado
        ];
        
        $client = new Client('mongodb://' . getenv('MONGO_HOST') . ':27017', [], $options);
        $this->collection = $client->inventario->productos; // Usar base de datos correcta
    }

    public function listar(): string
    {
        // Consulta optimizada con proyección y ordenamiento para MongoDB 8.0
        $options = [
            'limit' => 50,
            'sort' => ['_id' => -1], // Ordenar por más recientes
            'projection' => [
                '_id' => 0, // Excluir ObjectId auto-generado
                'nombre' => 1,
                'sku' => 1,
                'precio' => 1,
                'stock' => 1,
                'categoria' => 1
            ]
        ];
        
        $productos = $this->collection->find([], $options);
        
        return json_encode([
            'productos' => iterator_to_array($productos),
            'total' => $this->collection->estimatedDocumentCount(), // Count optimizado en MongoDB 8+
            'version' => 'MongoDB 8.0 + PHP Driver 1.20'
        ]);
    }

    public function crear(): string
    {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validación mejorada de datos de entrada
        if (empty($data['nombre']) || empty($data['precio'])) {
            http_response_code(400);
            return json_encode(['error' => 'Nombre y precio son requeridos']);
        }
        
        $producto = [
            'sku' => $data['sku'] ?? 'SKU-' . uniqid(),
            'nombre' => trim($data['nombre']),
            'descripcion' => trim($data['descripcion'] ?? ''),
            'precio' => (float) $data['precio'],
            'stock' => (int) ($data['stock'] ?? 0),
            'categoria' => $data['categoria'] ?? 'general',
            'metadatos' => $data['metadatos'] ?? [],
            'creado_en' => new \MongoDB\BSON\UTCDateTime(), // Fecha nativa de MongoDB
            'actualizado_en' => new \MongoDB\BSON\UTCDateTime()
        ];

        // Inserción con writeConcern optimizado para MongoDB 8.0
        $result = $this->collection->insertOne($producto, [
            'writeConcern' => new \MongoDB\Driver\WriteConcern(1, 100) // Confirmación rápida
        ]);
        
        http_response_code(201);
        return json_encode([
            'producto' => $producto,
            'insertedId' => $result->getInsertedId()
        ]);
    }

    /**
     * Reducir stock de múltiples productos
     * Espera JSON: { items: [ { sku: 'SKU', cantidad: 2 }, ... ] }
     */
    public function reducir(): string
    {
        $data = json_decode(file_get_contents('php://input'), true) ?: [];
        $items = $data['items'] ?? [];

        if (!is_array($items) || empty($items)) {
            http_response_code(400);
            return json_encode(['error' => 'items requeridos']);
        }

        $results = [];
        foreach ($items as $it) {
            $sku = $it['sku'] ?? null;
            $qty = isset($it['cantidad']) ? (int)$it['cantidad'] : 0;
            if (!$sku || $qty <= 0) {
                $results[] = ['sku' => $sku, 'success' => false, 'message' => 'sku o cantidad inválidos'];
                continue;
            }

            $doc = $this->collection->findOne(['sku' => $sku]);
            if (!$doc) {
                $results[] = ['sku' => $sku, 'success' => false, 'message' => 'No encontrado'];
                continue;
            }

            $current = $doc['stock'] ?? 0;
            if ($current < $qty) {
                $results[] = ['sku' => $sku, 'success' => false, 'message' => 'Stock insuficiente', 'stock' => $current];
                continue;
            }

            $res = $this->collection->updateOne(['sku' => $sku], ['$inc' => ['stock' => -$qty]]);
            $results[] = ['sku' => $sku, 'success' => $res->getModifiedCount() > 0, 'reduced' => $qty];
        }

        return json_encode(['results' => $results]);
    }

    public function health(): string
    {
        try {
            // Health check mejorado con estadísticas de MongoDB 8.0
            $stats = $this->collection->aggregate([
                ['$count' => 'total_productos']
            ])->toArray();
            
            $totalProductos = $stats[0]['total_productos'] ?? 0;
            
            return json_encode([
                'status' => 'OK',
                'service' => 'inventario',
                'mongodb_version' => '8.0',
                'php_driver_version' => '1.20.0',
                'database' => 'inventario',
                'collection' => 'productos',
                'total_productos' => $totalProductos,
                'timestamp' => date('c')
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            return json_encode([
                'status' => 'ERROR',
                'service' => 'inventario',
                'error' => $e->getMessage(),
                'timestamp' => date('c')
            ]);
        }
    }
}