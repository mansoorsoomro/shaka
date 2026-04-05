"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Star, Minus, Plus, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "./product-card"

interface ProductVariation {
  id: number
  product_id: number
  size?: {
    id: number
    name: string
    code: string
    is_active: number
  }
  sku?: string
  price: number
  quantity_per_pack?: number
  stock: number
  absorbency_level?: string
  is_active: number
  price_per_piece?: number
  total_pieces?: number
}

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null)
  const { addItem } = useCart()

  // Initialize with first variation when product changes
  useEffect(() => {
    if (product?.variations && product.variations.length > 0) {
      setSelectedVariation(product.variations[0])
      setQuantity(1)
    }
  }, [product])

  if (!product || !isOpen || !selectedVariation) return null

  const isInStock = selectedVariation.stock > 0
  const displaySize = selectedVariation.size?.code || `Size ${selectedVariation.id}`

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: selectedVariation.price,
      quantity,
      image: product?.featured_image?.image_url ?? product.image,
      variation_id: selectedVariation.id,
      size: displaySize,
      sku: selectedVariation.sku,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 bg-brand-light p-8 flex items-center justify-center">
          <div className="relative aspect-square w-full max-w-[400px]">
            <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-contain p-4" />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-brand-green uppercase">{product.category}</span>
              <h2 className="text-2xl font-bold font-serif">{product.title}</h2>
              <div className="flex items-center gap-3">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < product.rating ? "fill-current" : "text-zinc-200"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews})</span>
              </div>
              <p className="text-3xl font-bold text-brand-green mt-4">PKR {selectedVariation.price}</p>
              {selectedVariation.price_per_piece && (
                <p className="text-xs text-muted-foreground">
                  PKR {selectedVariation.price_per_piece.toFixed(2)} per piece
                </p>
              )}
            </div>

            <p
              className="text-sm text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            {/* <p className="text-sm text-muted-foreground leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the
              industry&apos;s standard dummy text ever since the 1500s.
            </p> */}

            {/* Key Features */}
            {/* <div className="space-y-2">
              <p className="font-bold text-sm uppercase tracking-wider">Key Features:</p>
              <div className="space-y-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-brand-green" />
                    <span>Lorem Ipsum is simply dummy text.</span>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Variation Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm uppercase tracking-wider">Select Size</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-bold ${
                    isInStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isInStock ? `In Stock (${selectedVariation.stock})` : "Out of Stock"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variations && product.variations.map((variation) => (
                  <button
                    key={variation.id}
                    onClick={() => setSelectedVariation(variation)}
                    disabled={variation.stock === 0}
                    className={`flex flex-col items-center gap-1 px-3 py-2 border-2 rounded-lg text-sm font-bold transition-all ${
                      selectedVariation.id === variation.id
                        ? "border-brand-green bg-brand-green text-white"
                        : variation.stock === 0
                        ? "border-zinc-200 bg-zinc-50 text-zinc-400 cursor-not-allowed opacity-50"
                        : "border-brand-green/20 hover:border-brand-green/40"
                    }`}
                  >
                    <span>{variation.size?.code || `V${variation.id}`}</span>
                    <span className="text-xs font-normal">
                      {variation.stock > 0 ? `${variation.stock} left` : "0 left"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Variation Details */}
            {selectedVariation && (
              <div className="bg-brand-light/30 rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedVariation.size?.name && (
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <p className="font-bold">{selectedVariation.size.name}</p>
                    </div>
                  )}
                  {selectedVariation.quantity_per_pack && (
                    <div>
                      <span className="text-muted-foreground">Quantity/Pack:</span>
                      <p className="font-bold">{selectedVariation.quantity_per_pack}</p>
                    </div>
                  )}
                  {selectedVariation.absorbency_level && (
                    <div>
                      <span className="text-muted-foreground">Absorbency:</span>
                      <p className="font-bold">{selectedVariation.absorbency_level}</p>
                    </div>
                  )}
                  {selectedVariation.sku && (
                    <div>
                      <span className="text-muted-foreground">SKU:</span>
                      <p className="font-bold text-xs">{selectedVariation.sku}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <p className="font-bold text-sm uppercase tracking-wider">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-brand-green/20 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!isInStock}
                    className="p-2 hover:bg-brand-light rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(quantity + 1, selectedVariation.stock))}
                    disabled={!isInStock || quantity >= selectedVariation.stock}
                    className="p-2 hover:bg-brand-light rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {quantity > selectedVariation.stock && (
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>Only {selectedVariation.stock} available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-brand-green/10">
              <Button
                onClick={handleAddToCart}
                disabled={!isInStock || quantity > selectedVariation.stock}
                className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-full py-6 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full rounded-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white py-6 font-bold text-lg bg-transparent"
              >
                <Link href={`/shop/${product.slug || product.id}`} onClick={onClose}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
