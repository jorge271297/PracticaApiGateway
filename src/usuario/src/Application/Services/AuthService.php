<?php
/**
 * Servicio de Autenticación
 * 
 * Encapsula la lógica de negocio para autenticación JWT:
 * - Generación de tokens JWT con payload personalizado
 * - Validación y decodificación de tokens
 * - Configuración de expiración y algoritmos de seguridad
 */

namespace App\Application\Services;

use App\Domain\Models\Usuario;
use Firebase\JWT\JWT;

class AuthService
{
    public function __construct(
        private string $jwtSecret
    ) {}

    public function generarToken(Usuario $usuario): string
    {
        $payload = [
            'sub' => $usuario->id,
            'email' => $usuario->email,
            'roles' => $usuario->roles,
            'iat' => time(),
            'exp' => time() + 3600
        ];

        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }

    public function validarToken(string $token): array
    {
        return (array) JWT::decode($token, new \Firebase\JWT\Key($this->jwtSecret, 'HS256'));
    }
}