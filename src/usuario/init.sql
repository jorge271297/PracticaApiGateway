-- Script de Inicialización de Base de Datos de Usuarios
-- 
-- Crea la tabla de usuarios con:
-- - ID único como clave primaria
-- - Email único para autenticación
-- - Hash de contraseña seguro
-- - Sistema de roles con JSON
-- - Timestamp de creación

CREATE TABLE IF NOT EXISTS usuarios (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    roles JSON DEFAULT '["ROLE_USER"]',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);