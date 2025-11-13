"use client"

import { useEffect, useState } from "react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"
import type { User } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface BrandConfig {
  baseUrl: string
  favicon: string
  logo: string
  name: string
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [brand, setBrand] = useState<BrandConfig | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const [authResponse, brandResponse] = await Promise.all([fetch("/api/auth/me"), fetch("/api/brand")])

        const authData = await authResponse.json()
        const brandData = await brandResponse.json()

        setBrand(brandData)

        if (authResponse.ok && authData.user) {
          setUser(authData.user)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLoginSuccess = async () => {
    const response = await fetch("/api/auth/me")
    const data = await response.json()
    if (response.ok && data.user) {
      setUser(data.user)
    }
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (isLoading || !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm onSuccess={handleLoginSuccess} brandName={brand.name} logo={brand.logo} />
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      brandName={brand.name}
      logo={brand.logo}
      gitCommit={process.env.NEXT_PUBLIC_GIT_COMMIT || "latest"}
    />
  )
}
