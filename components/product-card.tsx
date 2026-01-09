"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, Eye } from "lucide-react" // Added Eye icon for Quick View
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

export interface Product {
  id: number
  category: string
  title: string
  rating: number
  reviews: number
  absorbency: string
  price: number
  image: string
}

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (product: Product) => void }) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: "M", // default size
    })
  }

  return (
    <div className="group border-2 border-brand-green/20 rounded-xl overflow-hidden bg-white p-6 space-y-4 hover:shadow-xl transition-shadow">
      <div className="aspect-square relative bg-brand-light rounded-lg overflow-hidden p-8">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-brand-green/5">
          <button
            onClick={(e) => {
              e.preventDefault()
              onQuickView?.(product)
            }}
            className="bg-brand-green text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold tracking-widest text-brand-green uppercase">{product.category}</span>
        <h3 className="text-lg font-bold">{product.title}</h3>
        <div className="flex items-center gap-2">
          <div className="flex text-zinc-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < product.rating ? "fill-current" : "text-muted"}`} />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-zinc-900">{product.absorbency}</p>
        <p className="text-2xl font-bold text-brand-green">${product.price}</p>
      </div>
      <div className="flex gap-2 pt-2">
        <Button variant="outline" asChild className="flex-1 rounded-full text-[10px] font-bold h-9 bg-transparent">
          <Link href={`/shop/${product.id}`}>View Details</Link>
        </Button>
        <Button
          onClick={handleAddToCart}
          className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white rounded-full text-[10px] font-bold h-9"
        >
          Add to card
        </Button>
      </div>
    </div>
  )
}
