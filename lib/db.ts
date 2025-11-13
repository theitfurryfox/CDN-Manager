import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

export function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number.parseInt(process.env.DB_PORT || "3306"),
      database: process.env.DB_NAME || "cdn_manager",
      user: process.env.DB_USER || "cdn_user",
      password: process.env.DB_PASSWORD || "",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  }
  return pool
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const connection = await getDbPool().getConnection()
  try {
    const [results] = await connection.execute(sql, params)
    return results as T
  } finally {
    connection.release()
  }
}
