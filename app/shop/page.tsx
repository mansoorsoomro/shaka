"use client" // Changed to client component for modal state

import { useState } from "react" // Added state for Quick View
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard, type Product } from "@/components/product-card"
import { QuickViewModal } from "@/components/quick-view-modal" // Imported QuickViewModal

const PRODUCTS = [
  {
    id: 1,
    category: "PANT DIAPER",
    title: "Overnight Protection Diapers",
    rating: 4,
    reviews: 342,
    absorbency: "Heavy",
    price: 25,
    image: "/white-diaper-side-view.jpg",
  },
  {
    id: 2,
    category: "DIAPERS",
    title: "Travel Pack Diaper",
    rating: 4,
    reviews: 342,
    absorbency: "Light",
    price: 150,
    image: "/opened-diaper-texture.jpg",
  },
  {
    id: 3,
    category: "DIAPERS",
    title: "Maximum Protection Diapers",
    rating: 4,
    reviews: 342,
    absorbency: "Maximum",
    price: 252,
    image: "/blue-diaper-packaging.jpg",
  },
  // Replicate for the grid
  {
    id: 4,
    category: "PANT DIAPER",
    title: "Overnight Protection Diapers",
    rating: 4,
    reviews: 342,
    absorbency: "Heavy",
    price: 25,
    image: "/white-diaper-texture.jpg",
  },
  {
    id: 5,
    category: "DIAPERS",
    title: "Overnight Protection Diapers",
    rating: 4,
    reviews: 342,
    absorbency: "Heavy",
    price: 369,
    image: "/diaper-pack-front.jpg",
  },
  {
    id: 6,
    category: "DIAPERS",
    title: "Maximum Protection Diapers",
    rating: 4,
    reviews: 342,
    absorbency: "Maximum",
    price: 252,
    image: "/placeholder.svg?height=300&width=300",
  },
]

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleQuickView = (product: Product) => {
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex gap-2">
            <Button variant="default" className="bg-brand-green rounded-full px-6">
              All Products
            </Button>
            <Button variant="secondary" className="bg-zinc-600 text-white rounded-full px-6 hover:bg-zinc-700">
              Pants
            </Button>
            <Button variant="secondary" className="bg-zinc-600 text-white rounded-full px-6 hover:bg-zinc-700">
              Diapers
            </Button>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 2 })
            .flatMap(() => PRODUCTS)
            .map((product, idx) => (
              <ProductCard
                key={`${product.id}-${idx}`}
                product={product}
                onQuickView={handleQuickView} // Passed handleQuickView prop
              />
            ))}
        </div>
      </main>

      <QuickViewModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Footer />
    </div>
  )
}
