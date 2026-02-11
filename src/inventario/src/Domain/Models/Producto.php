<?php
/**
 * Modelo de Producto - Entidad de Dominio
 * 
 * Representa un producto en el inventario con sus propiedades:
 * - Identificación única (SKU)
 * - Información básica (nombre, descripción, precio)
 * - Control de stock y disponibilidad
 * - Categorización y metadatos
 */

namespace App\Domain\Models;

class Producto
{
    public function __construct(
        public string $sku,
        public string $nombre,
        public string $descripcion,
        public float $precio,
        public int $stock,
        public string $categoria,
        public array $metadatos = []
    ) {}

    /**
     * Verifica si el producto está disponible
     */
    public function estaDisponible(): bool
    {
        return $this->stock > 0;
    }

    /**
     * Reduce el stock del producto
     */
    public function reducirStock(int $cantidad): bool
    {
        if ($this->stock >= $cantidad) {
            $this->stock -= $cantidad;
            return true;
        }
        return false;
    }

    /**
     * Convierte el modelo a array para persistencia
     */
    public function toArray(): array
    {
        return [
            'sku' => $this->sku,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'precio' => $this->precio,
            'stock' => $this->stock,
            'categoria' => $this->categoria,
            'metadatos' => $this->metadatos
        ];
    }
}
