import { getPool } from '../../config/database.js';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface SecretRow extends RowDataPacket {
  id: string;
  encrypted_data: string;
  pin_hash: string | null;
  views_left: number;
  expires_at: Date;
  created_at: Date;
  ip_address: string;
  pin_attempts: number;
}

export interface LogEventRow extends RowDataPacket {
  id: number;
  event_type: string;
  secret_id: string | null;
  ip_hash: string;
  user_agent_hash: string;
  created_at: Date;
}

/**
 * Create a new secret in the database
 */
export const createSecret = async (
  id: string,
  encryptedData: string,
  pinHash: string | null,
  viewsLeft: number,
  expiresAt: Date,
  ipAddress: string
): Promise<void> => {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO secrets (id, encrypted_data, pin_hash, views_left, expires_at, ip_address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, encryptedData, pinHash, viewsLeft, expiresAt, ipAddress]
  );
};

/**
 * Get a secret by ID
 */
export const getSecret = async (id: string): Promise<SecretRow | null> => {
  const pool = getPool();
  const [rows] = await pool.execute<SecretRow[]>(
    'SELECT * FROM secrets WHERE id = ? AND expires_at > NOW()',
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Decrement views_left and delete if 0
 */
export const decrementViews = async (id: string): Promise<boolean> => {
  const pool = getPool();
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE secrets SET views_left = views_left - 1 WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    return false;
  }

  // Check if views_left is now 0 and delete
  const [rows] = await pool.execute<SecretRow[]>(
    'SELECT views_left FROM secrets WHERE id = ?',
    [id]
  );

  if (rows.length > 0 && rows[0].views_left <= 0) {
    await pool.execute('DELETE FROM secrets WHERE id = ?', [id]);
  }

  return true;
};

/**
 * Increment PIN attempts
 */
export const incrementPinAttempts = async (id: string): Promise<number> => {
  const pool = getPool();
  await pool.execute(
    'UPDATE secrets SET pin_attempts = pin_attempts + 1 WHERE id = ?',
    [id]
  );

  const [rows] = await pool.execute<SecretRow[]>(
    'SELECT pin_attempts FROM secrets WHERE id = ?',
    [id]
  );

  return rows.length > 0 ? rows[0].pin_attempts : 0;
};

/**
 * Log an event
 */
export const logEvent = async (
  eventType: string,
  secretId: string | null,
  ipHash: string,
  userAgentHash: string
): Promise<void> => {
  const pool = getPool();
  await pool.execute(
    `INSERT INTO log_events (event_type, secret_id, ip_hash, user_agent_hash)
     VALUES (?, ?, ?, ?)`,
    [eventType, secretId, ipHash, userAgentHash]
  );
};




