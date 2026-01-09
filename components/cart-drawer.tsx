"use client"

import { useCart } from "@/hooks/use-cart"
import { X, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem } = useCart()

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-[70] h-full w-full max-w-[400px] bg-brand-light shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-brand-green/10 bg-white">
          <h2 className="text-xl font-bold tracking-tight uppercase">Shopping Cart</h2>
          <button onClick={toggleCart} className="p-2 hover:bg-muted rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <p className="font-serif">Your cart is empty</p>
              <Button variant="outline" onClick={toggleCart} className="rounded-full bg-transparent">
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="h-20 w-20 relative bg-white border border-brand-green/10 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-contain p-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm leading-none">{item.title}</h3>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Size: {item.size || "M"} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-sm">${item.price}</p>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button onClick={() => removeItem(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t border-brand-green/10 space-y-4">
          <div className="space-y-2 text-sm font-bold">
            <div className="flex justify-between">
              <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg pt-2 border-t border-brand-green/5">
              <span className="uppercase tracking-wider">Total</span>
              <span className="text-brand-green">${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <Button
            asChild
            className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-full py-6 font-bold"
            disabled={items.length === 0}
            onClick={toggleCart}
          >
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
