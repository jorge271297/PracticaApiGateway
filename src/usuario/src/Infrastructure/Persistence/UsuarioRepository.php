<?php
/**
 * Repositorio de Usuarios
 * 
 * Maneja la persistencia de usuarios en PostgreSQL:
 * - Operaciones CRUD para usuarios
 * - Consultas por email para autenticación
 * - Mapeado entre base de datos y modelos de dominio
 * - Gestión de conexión PDO
 */

namespace App\Infrastructure\Persistence;

use PDO;
use App\Domain\Models\Usuario;

class UsuarioRepository
{
    public function __construct(private PDO $pdo) {}

    public function save(Usuario $usuario): void
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO usuarios (id, email, nombre, password_hash, roles) 
            VALUES (:id, :email, :nombre, :password_hash, :roles)
        ");
        
        $stmt->execute([
            'id' => $usuario->id,
            'email' => $usuario->email,
            'nombre' => $usuario->nombre,
            'password_hash' => $usuario->passwordHash,
            'roles' => json_encode($usuario->roles)
        ]);
    }

    public function findByEmail(string $email): ?Usuario
    {
        $stmt = $this->pdo->prepare("SELECT * FROM usuarios WHERE email = :email");
        $stmt->execute(['email' => $email]);
        
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$data) return null;
        
        return new Usuario(
            $data['id'],
            $data['email'],
            $data['nombre'],
            $data['password_hash'],
            json_decode($data['roles'], true)
        );
    }
}