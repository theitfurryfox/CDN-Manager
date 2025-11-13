import fs from "fs"
import path from "path"

export interface BrandConfig {
  baseUrl: string
  favicon: string
  logo: string
  name: string
}

const defaultBrand: BrandConfig = {
  baseUrl: "https://example.com",
  favicon: "https://m.mi12vb.techfurry.com/img/cdnman.png",
  logo: "https://m.mi12vb.techfurry.com/img/cdnman.png",
  name: "CDN Manager by TheITFurryFox",
}

export function getBrandConfig(): BrandConfig {
  try {
    const brandPath = path.join(process.cwd(), "brand.json")
    if (fs.existsSync(brandPath)) {
      const brandData = fs.readFileSync(brandPath, "utf-8")
      return { ...defaultBrand, ...JSON.parse(brandData) }
    }
  } catch (error) {
    console.error("Error reading brand.json:", error)
  }
  return defaultBrand
}
