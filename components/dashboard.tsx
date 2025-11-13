"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Upload, Files, Copy, Download, Trash2, HardDrive } from "lucide-react"
import type { User } from "@/lib/auth"

interface DashboardProps {
  user: User
  onLogout: () => void
  brandName: string
  logo: string
  gitCommit: string
}

interface FileItem {
  id: number
  filename: string
  original_filename: string
  file_size: number
  mime_type: string
  cdn_url: string
  upload_date: string
  downloads: number
}

export function Dashboard({ user, onLogout, brandName, logo, gitCommit }: DashboardProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    onLogout()
  }

  const loadFiles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/files")
      const data = await response.json()
      if (response.ok) {
        setFiles(data.files)
      }
    } catch (error) {
      console.error("Failed to load files:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">{brandName}</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <Files className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files.length}</div>
              <p className="text-xs text-muted-foreground">Files uploaded</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files.reduce((sum, f) => sum + f.downloads, 0)}</div>
              <p className="text-xs text-muted-foreground">Across all files</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(files.reduce((sum, f) => sum + f.file_size, 0))}</div>
              <p className="text-xs text-muted-foreground">Total file size</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>File Manager</CardTitle>
                <CardDescription>Upload and manage your CDN files</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={loadFiles} disabled={isLoading}>
                  <Files className="mr-2 h-4 w-4" />
                  {isLoading ? "Loading..." : "Refresh"}
                </Button>
                <Button disabled>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {files.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Files className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No files uploaded yet</p>
                <p className="text-sm mt-2">Click "Refresh" to load files or "Upload File" to add new ones</p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{file.original_filename}</p>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{formatBytes(file.file_size)}</span>
                        <span>{file.mime_type}</span>
                        <span>{file.downloads} downloads</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(file.cdn_url)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>©2025 TheITFurryFox</p>
            <div className="flex items-center gap-2">
              <span>==</span>
              <a
                href="https://github.com/theitfurryfox/CDN-Manager"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                CDN Manager
              </a>
              <span>==</span>
            </div>
            <p className="font-mono text-xs">{gitCommit}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
