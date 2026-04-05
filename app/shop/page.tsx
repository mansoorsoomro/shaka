"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { QuickViewModal } from "@/components/quick-view-modal"
import { productService } from "@/lib/services/product-service"
import { Product as ApiProduct, Category } from "@/lib/services/types"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category")
  
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch both products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
        ])

        if (productsResponse.success) {
          setProducts(productsResponse.data.data) // Assuming the products are nested under data.data based on previous API responses
        }
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleQuickView = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCategoryChange = (categorySlug: string | null) => {
    if (categorySlug) {
      router.push(`/shop?category=${categorySlug}`)
    } else {
      router.push("/shop")
    }
  }

  // Filter products by category from URL parameter
  const filteredProducts = categoryParam
    ? products.filter(p => p.category?.slug.toLowerCase() === categoryParam.toLowerCase())
    : products || []

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 pt-32">
        <div className="mb-12">
          <h1 className="text-4xl font-serif mb-4">Shop Products</h1>
          <p className="text-muted-foreground">Browse our complete selection of premium incontinence products.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={!categoryParam ? "default" : "secondary"}
              className={cn("rounded-full px-6", !categoryParam && "bg-brand-green")}
              onClick={() => handleCategoryChange(null)}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={categoryParam === category.slug ? "default" : "secondary"}
                className={cn(
                  "rounded-full px-6",
                  categoryParam === category.slug
                    ? "bg-brand-green text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                )}
                onClick={() => handleCategoryChange(category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold">Sort By</span>
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  title: product.name,
                  category: product.category?.name || "Uncategorized",
                  rating: 4, // API might not provide these, using placeholders for UI consistency
                  reviews: 0,
                  absorbency: product.absorbency || "Medium"
                }}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-brand-green/10 rounded-2xl">
            <p className="text-zinc-500 font-bold uppercase tracking-widest">No products found in this category.</p>
          </div>
        )}
      </main>

      <QuickViewModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Footer />
    </div>
  )
}
