<?php
/**
 * Modelo de Usuario - Entidad de Dominio
 * 
 * Representa un usuario del sistema con sus propiedades y comportamientos:
 * - Datos de identidad (id, email, nombre)
 * - Credenciales encriptadas
 * - Roles y permisos
 * - Validación de contraseñas
 */

namespace App\Domain\Models;

class Usuario
{
    public function __construct(
        public string $id,
        public string $email,
        public string $nombre,
        public string $passwordHash,
        public array $roles = ['ROLE_USER']
    ) {}

    public function verificarPassword(string $password): bool
    {
        return password_verify($password, $this->passwordHash);
    }
}