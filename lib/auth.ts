import { query } from "./db"
import crypto from "crypto"

export interface User {
  id: number
  email: string
  created_at: string
  last_login: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex")
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err)
      resolve(salt + ":" + derivedKey.toString("hex"))
    })
  })
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":")
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err)
      resolve(key === derivedKey.toString("hex"))
    })
  })
}

export async function createUser(email: string, password: string): Promise<number> {
  const passwordHash = await hashPassword(password)
  const result = await query<any>("INSERT INTO users (email, password_hash) VALUES (?, ?)", [email, passwordHash])
  return result.insertId
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const users = await query<any[]>(
    "SELECT id, email, password_hash, created_at, last_login FROM users WHERE email = ? AND is_active = TRUE",
    [email],
  )

  if (users.length === 0) return null

  const user = users[0]
  const isValid = await verifyPassword(password, user.password_hash)

  if (!isValid) return null

  await query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id])

  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    last_login: new Date().toISOString(),
  }
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await query("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)", [sessionId, userId, expiresAt])

  return sessionId
}

export async function validateSession(sessionId: string): Promise<User | null> {
  const sessions = await query<any[]>(
    `SELECT s.user_id, u.email, u.created_at, u.last_login 
     FROM sessions s 
     JOIN users u ON s.user_id = u.id 
     WHERE s.id = ? AND s.expires_at > NOW() AND u.is_active = TRUE`,
    [sessionId],
  )

  if (sessions.length === 0) return null

  return {
    id: sessions[0].user_id,
    email: sessions[0].email,
    created_at: sessions[0].created_at,
    last_login: sessions[0].last_login,
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  await query("DELETE FROM sessions WHERE id = ?", [sessionId])
}
