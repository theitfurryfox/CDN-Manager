import { createUser } from "../lib/auth.ts"
import dotenv from "dotenv"

dotenv.config()

// Grab from .env
async function main() {
  const email = process.env.FIRST_USER_EMAIL
  const password = process.env.FIRST_USER_PASSWORD

  // scream at user
  if (!email || !password) {
    console.error("Error: FIRST_USER_EMAIL and FIRST_USER_PASSWORD must be set in .env")
    process.exit(1)
  }

  // log things for user
  try {
    const userId = await createUser(email, password)
    console.log(`✅ First user created successfully!`)
    console.log(`   User ID: ${userId}`)
    console.log(`   Email: ${email}`)
    process.exit(0)
  } catch (error) {
    console.error("❌ Failed to create user:", error.message)
    process.exit(1)
  }
}

main()
