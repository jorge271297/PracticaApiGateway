<?php
namespace App\Infrastructure\Controllers;

/**
 * Controlador de Pagos (simulado)
 *
 * Endpoints:
 * - POST /api/pagos -> crea pago simulado
 * - GET  /api/pagos/{id} -> obtiene estado del pago
 * - GET  /health -> estado del servicio
 */

class PaymentController
{
    private string $storeFile;

    public function __construct()
    {
        $this->storeFile = __DIR__ . '/../../../../payments_store.json';
        if (!file_exists($this->storeFile)) {
            file_put_contents($this->storeFile, json_encode([]));
        }
    }

    private function readStore(): array
    {
        $content = @file_get_contents($this->storeFile);
        $data = $content ? json_decode($content, true) : [];
        return is_array($data) ? $data : [];
    }

    private function writeStore(array $data): void
    {
        file_put_contents($this->storeFile, json_encode($data, JSON_PRETTY_PRINT));
    }

    public function create(): string
    {
        $input = json_decode(file_get_contents('php://input'), true) ?: [];

        if (empty($input['usuario']) || empty($input['amount'])) {
            http_response_code(400);
            return json_encode(['error' => 'usuario y amount son requeridos']);
        }

        $id = uniqid('pay_');
        // Simular éxito en 85% de los casos
        $success = (mt_rand(1, 100) <= 85);
        $status = $success ? 'success' : 'failed';

        $record = [
            'id' => $id,
            'usuario' => $input['usuario'],
            'amount' => (float)$input['amount'],
            'currency' => $input['currency'] ?? 'USD',
            'method' => $input['method'] ?? 'card',
            'status' => $status,
            'metadata' => $input['metadata'] ?? [],
            'created_at' => date('c')
        ];

        $store = $this->readStore();
        $store[$id] = $record;
        $this->writeStore($store);

        http_response_code(201);
        return json_encode(['payment_id' => $id, 'status' => $status]);
    }

    public function status(): string
    {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $parts = explode('/', trim($path, '/'));
        $id = end($parts);

        $store = $this->readStore();

        if (!isset($store[$id])) {
            http_response_code(404);
            return json_encode(['error' => 'Pago no encontrado']);
        }

        return json_encode($store[$id]);
    }

    public function health(): string
    {
        return json_encode([ 'status' => 'OK', 'service' => 'payments', 'timestamp' => date('c') ]);
    }
}
