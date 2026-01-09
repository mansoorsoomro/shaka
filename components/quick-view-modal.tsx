"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Star, Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "./product-card"

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("M")
  const { addItem } = useCart()

  if (!product || !isOpen) return null

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.image,
      size: selectedSize,
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
              <p className="text-3xl font-bold text-brand-green mt-4">${product.price}</p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the
              industry&apos;s standard dummy text ever since the 1500s.
            </p>

            {/* Key Features */}
            <div className="space-y-2">
              <p className="font-bold text-sm uppercase tracking-wider">Key Features:</p>
              <div className="space-y-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-brand-green" />
                    <span>Lorem Ipsum is simply dummy text.</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <p className="font-bold text-sm uppercase tracking-wider">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 w-12 flex items-center justify-center border-2 rounded-lg text-sm font-bold transition-all ${
                      selectedSize === size
                        ? "border-brand-green bg-brand-green text-white"
                        : "border-brand-green/20 hover:border-brand-green/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <p className="font-bold text-sm uppercase tracking-wider">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-brand-green/20 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-brand-light rounded-md transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-brand-light rounded-md transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-brand-green/10">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-full py-6 font-bold text-lg"
              >
                Add to Card
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full rounded-full border-brand-green text-brand-green hover:bg-brand-green hover:text-white py-6 font-bold text-lg bg-transparent"
              >
                <Link href={`/shop/${product.id}`} onClick={onClose}>
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
