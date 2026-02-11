<?php
/**
 * Controlador de Autenticación
 * 
 * Maneja todas las operaciones relacionadas con autenticación y autorización:
 * - Registro de usuarios nuevos
 * - Login y generación de tokens JWT
 * - Validación de usuarios existentes
 * - Endpoint de perfil de usuario
 * - Provisión de claves JWT para validación
 */

namespace App\Infrastructure\Controllers;

use PDO;
use App\Domain\Models\Usuario;
use App\Application\Services\AuthService;
use App\Infrastructure\Persistence\UsuarioRepository;

class AuthController
{
    private UsuarioRepository $usuarioRepository;
    private AuthService $authService;

    public function __construct()
    {
        $pdo = new PDO(
            "pgsql:host=" . getenv('DB_HOST') . ";port=" . getenv('DB_PORT') . ";dbname=" . getenv('DB_NAME'),
            getenv('DB_USER'),
            getenv('DB_PASSWORD')
        );
        
        $this->usuarioRepository = new UsuarioRepository($pdo);
        $this->authService = new AuthService(getenv('JWT_SECRET'));
    }

    public function register(): string
    {
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Validación básica
        if (empty($data['email']) || empty($data['password']) || empty($data['nombre'])) {
            http_response_code(400);
            return json_encode(['error' => 'Datos incompletos']);
        }

        // Verificar si el email ya existe
        if ($this->usuarioRepository->findByEmail($data['email'])) {
            http_response_code(400);
            return json_encode(['error' => 'Email ya registrado']);
        }

        $usuario = new Usuario(
            uniqid(),
            $data['email'],
            $data['nombre'],
            password_hash($data['password'], PASSWORD_BCRYPT)
        );

        $this->usuarioRepository->save($usuario);

        return json_encode([
            'id' => $usuario->id,
            'email' => $usuario->email,
            'nombre' => $usuario->nombre
        ]);
    }

    public function login(): string
    {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $usuario = $this->usuarioRepository->findByEmail($data['email']);
        
        if (!$usuario || !$usuario->verificarPassword($data['password'])) {
            http_response_code(401);
            return json_encode(['error' => 'Credenciales inválidas']);
        }

        $token = $this->authService->generarToken($usuario);

        return json_encode([
            'token' => $token,
            'user' => [
                'id' => $usuario->id,
                'email' => $usuario->email,
                'nombre' => $usuario->nombre
            ]
        ]);
    }

    public function profile(): string
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (!str_starts_with($authHeader, 'Bearer ')) {
            http_response_code(401);
            return json_encode(['error' => 'Token requerido']);
        }

        $token = substr($authHeader, 7);
        
        try {
            $payload = $this->authService->validarToken($token);
            return json_encode(['user' => $payload]);
        } catch (\Exception $e) {
            http_response_code(401);
            return json_encode(['error' => 'Token inválido']);
        }
    }

    public function jwks(): string
    {
        return json_encode([
            'keys' => [[
                'kty' => 'oct',
                'k' => base64_encode(getenv('JWT_SECRET')),
                'alg' => 'HS256'
            ]]
        ]);
    }

    public function health(): string
    {
        return json_encode([
            'status' => 'OK',
            'service' => 'usuario',
            'timestamp' => date('c')
        ]);
    }
}