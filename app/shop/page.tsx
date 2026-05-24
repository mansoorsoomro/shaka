"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Sorting is not supported by the products API — sort dropdown is disabled.
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard, type Product as CardProduct } from "@/components/product-card"
import { QuickViewModal } from "@/components/quick-view-modal"
import { productService } from "@/lib/services/product-service"
import { Product as ApiProduct, Category } from "@/lib/services/types"
import { Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"

const PAGE_SIZE = 12

// Shape of the Laravel paginator returned under `data`.
type ProductsPayload = {
  data?: ApiProduct[]
  next_page_url?: string | null
  current_page?: number
}

/** Resolve a usable image URL from an API product. */
function productImageUrl(p: ApiProduct): string {
  const fi = p.featured_image
  if (fi) return typeof fi === "string" ? fi : fi.image_url || ""
  const first = Array.isArray(p.images) ? p.images[0] : undefined
  if (first) return typeof first === "string" ? first : first.image_url || ""
  return ""
}

/** Map an API product into the shape expected by <ProductCard />. */
function toCardProduct(p: ApiProduct): CardProduct {
  const img = productImageUrl(p)
  return {
    id: p.id,
    slug: p.slug,
    category: p.category?.name || "Uncategorized",
    title: p.name,
    rating: p.rating ?? 4, // API may not provide rating/reviews — placeholders for UI
    reviews: p.reviews_count ?? 0,
    absorbency: p.absorbency || "Medium",
    price: Number(p.price ?? p.variations?.[0]?.price ?? 0),
    image: img,
    featured_image: { image_url: img },
    variations: (p.variations ?? []).map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price ?? 0),
      stock: v.stock,
      size: v.size ? { name: v.size.name, code: (v.size as { code?: string }).code } : undefined,
    })),
  }
}

function ShopPageContent() {
  const searchParams = useSearchParams()
  const initialCategorySlug = searchParams.get("category")

  const [products, setProducts] = useState<ApiProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [nextPage, setNextPage] = useState(2)

  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filters (all server-side via the products API)
  const [searchInput, setSearchInput] = useState("")
  const [minPriceInput, setMinPriceInput] = useState("")
  const [maxPriceInput, setMaxPriceInput] = useState("")
  const [search, setSearch] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Debounce search + price inputs before hitting the API.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput)
      setMinPrice(minPriceInput)
      setMaxPrice(maxPriceInput)
    }, 450)
    return () => clearTimeout(t)
  }, [searchInput, minPriceInput, maxPriceInput])

  // Load categories once.
  useEffect(() => {
    ;(async () => {
      try {
        const res = await productService.getCategories()
        if (res.success && Array.isArray(res.data)) setCategories(res.data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    })()
  }, [])

  // Resolve the initial ?category=slug from the URL once categories arrive.
  const appliedInitialCategory = useRef(false)
  useEffect(() => {
    if (appliedInitialCategory.current || !initialCategorySlug || categories.length === 0) return
    const match = categories.find((c) => c.slug.toLowerCase() === initialCategorySlug.toLowerCase())
    if (match) setSelectedCategory(match)
    appliedInitialCategory.current = true
  }, [categories, initialCategorySlug])

  const fetchProducts = useCallback(
    async (page: number, append: boolean) => {
      if (append) setIsLoadMoreLoading(true)
      else setIsLoading(true)
      try {
        const res = await productService.getFilteredProducts({
          page,
          pagination: PAGE_SIZE,
          search,
          categoryId: selectedCategory?.id,
          minPrice,
          maxPrice,
        })
        if (res.success) {
          const payload = res.data as unknown as ProductsPayload
          const items = payload.data ?? []
          setProducts((prev) => (append ? [...prev, ...items] : items))
          setHasMore(Boolean(payload.next_page_url))
          setNextPage((payload.current_page ?? page) + 1)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        if (append) setIsLoadMoreLoading(false)
        else setIsLoading(false)
      }
    },
    [search, selectedCategory, minPrice, maxPrice],
  )

  // Re-fetch from page 1 whenever a filter changes.
  useEffect(() => {
    void fetchProducts(1, false)
  }, [fetchProducts])

  const handleQuickView = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 pt-32">
        <div className="mb-12">
          <h1 className="text-4xl font-serif mb-4">Shop Products</h1>
          <p className="text-muted-foreground">Browse our complete selection of premium incontinence products.</p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-11 rounded-full"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={!selectedCategory ? "default" : "secondary"}
              className={cn("rounded-full px-6", !selectedCategory && "bg-brand-green")}
              onClick={() => setSelectedCategory(null)}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory?.id === category.id ? "default" : "secondary"}
                className={cn(
                  "rounded-full px-6",
                  selectedCategory?.id === category.id
                    ? "bg-brand-green text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
                )}
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Price range filter (server-side: min_price / max_price) */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">Price</span>
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-24 rounded-full"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              min={0}
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-24 rounded-full"
            />
          </div>

          {/* Sort filter — disabled: the products API does not support sorting.
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold">Sort By</span>
            <Select value={sort} onValueChange={(v) => setSort(v as ProductSort)}>
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
          </div> */}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={toCardProduct(product)} onQuickView={handleQuickView} />
              ))}
            </div>
            {isLoadMoreLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-brand-green" />
              </div>
            ) : hasMore ? (
              <div className="flex gap-2 justify-center pt-2">
                <div className="justify-center flex items-center gap-2">
                  <Button
                    onClick={() => fetchProducts(nextPage, true)}
                    variant="outline"
                    className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white rounded-full text-[10px] font-bold h-9"
                  >
                    Load More
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-brand-green/10 rounded-2xl">
            <p className="text-zinc-500 font-bold uppercase tracking-widest">No products found.</p>
          </div>
        )}
      </main>

      <QuickViewModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Footer />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopPageContent />
    </Suspense>
  )
}
