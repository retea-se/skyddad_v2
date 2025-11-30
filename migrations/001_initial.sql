-- Skyddad v2 - Initial Database Schema
-- Database: skyddad_v2_db

-- Secrets table
CREATE TABLE IF NOT EXISTS secrets (
  id VARCHAR(32) PRIMARY KEY,
  encrypted_data TEXT NOT NULL,
  pin_hash VARCHAR(255) NULL,
  views_left INT NOT NULL DEFAULT 1,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45) NOT NULL,
  pin_attempts INT DEFAULT 0,
  INDEX idx_expires_at (expires_at),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Log events table (GDPR-compliant)
CREATE TABLE IF NOT EXISTS log_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  secret_id VARCHAR(32) NULL,
  ip_hash VARCHAR(64) NOT NULL,
  user_agent_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_secret_id (secret_id),
  INDEX idx_event_type (event_type),
  INDEX idx_created_at (created_at),
  INDEX idx_event_type_created_at (event_type, created_at),
  FOREIGN KEY (secret_id) REFERENCES secrets(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migrations history table
CREATE TABLE IF NOT EXISTS migrations_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  migration_name VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

