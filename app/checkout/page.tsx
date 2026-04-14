"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/hooks/use-cart"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Check, Lock } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { orderService } from "@/lib/services/order-service"
import { metaService } from "@/lib/services/meta-service"
import type { ShippingMethod } from "@/lib/services/types"

export default function CheckoutPage() {
  const { items, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isShippingMethodsLoading, setIsShippingMethodsLoading] = useState(false)
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    shipping_method: "",
    payment_method: "card"
  })

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to proceed to checkout")
      router.push("/login?redirect=/checkout")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (!isAuthenticated) return

    let isMounted = true
    const fetchShippingMethods = async () => {
      setIsShippingMethodsLoading(true)
      try {
        const response = await metaService.getShippingMethods()
        const methods = Array.isArray(response.data) ? response.data : []

        if ((response.success || response.status) && methods.length > 0) {
          if (!isMounted) return
          setShippingMethods(methods)
          setFormData((prev) => {
            const hasSelectedMethod = methods.some((method) => String(method.id) === prev.shipping_method)
            if (hasSelectedMethod) return prev
            return { ...prev, shipping_method: String(methods[0].id) }
          })
          return
        }

        if (!isMounted) return
        setShippingMethods([])
        setFormData((prev) => ({ ...prev, shipping_method: "" }))
        toast.error(response.message || "No shipping methods available")
      } catch (error: any) {
        if (!isMounted) return
        setShippingMethods([])
        setFormData((prev) => ({ ...prev, shipping_method: "" }))
        toast.error(error.message || "Failed to load shipping methods")
      } finally {
        if (isMounted) {
          setIsShippingMethodsLoading(false)
        }
      }
    }

    fetchShippingMethods()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  const selectedShippingMethod = shippingMethods.find((method) => String(method.id) === formData.shipping_method)
  const shipping = selectedShippingMethod?.price ?? 0

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) return
    if (!formData.shipping_method) {
      toast.error("Please select a shipping method")
      return
    }

    setIsLoading(true)
    try {
      const orderItems = items.map(item => ({
        product_id: item.product_id || 0,
        quantity: item.quantity,
        price: item.price,
        size: item.size
      }))

      const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0)
      const total = subtotal + shipping

      const response = await orderService.placeOrder({
        ...formData,
        shipping_method: Number(formData.shipping_method),
        items: orderItems,
        total: total
      })

      if (response.status) {
        toast.success("Order placed successfully!")
        clearCart()
        router.push("/checkout/success")
      } else {
        toast.error(response.message || "Failed to place order")
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while placing order")
    } finally {
      setIsLoading(false)
    }
  }

  const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0)
  const total = subtotal + shipping

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 pt-28">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/shop"
              className="text-sm font-bold flex items-center gap-2 hover:text-brand-green transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Shopping
            </Link>
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                      step === s
                        ? "bg-brand-green text-white"
                        : step > s
                          ? "bg-brand-green/20 text-brand-green"
                          : "bg-zinc-100 text-zinc-400",
                    )}
                  >
                    {step > s ? <Check className="h-4 w-4" /> : s}
                  </div>
                  {s < 3 && <div className={cn("w-8 h-0.5 mx-2", step > s ? "bg-brand-green/20" : "bg-zinc-100")} />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Form Content */}
            <div className="lg:col-span-8 space-y-8">
              {step === 1 && (
                <div className="border border-brand-green/10 rounded-2xl bg-brand-light p-8 space-y-8">
                  <h2 className="text-xl font-bold uppercase tracking-tight">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="First Name" value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} className="rounded-full bg-white h-12" />
                    <Input placeholder="Last Name" value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} className="rounded-full bg-white h-12" />
                    <Input placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rounded-full bg-white h-12" />
                    <Input placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="rounded-full bg-white h-12" />
                    <Input placeholder="Street Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="rounded-full bg-white h-12 md:col-span-2" />
                    <Input placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="rounded-full bg-white h-12" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="rounded-full bg-white h-12" />
                      <Input placeholder="Zip Code" value={formData.zip_code} onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })} className="rounded-full bg-white h-12" />
                    </div>
                  </div>
                  <div className="p-4 bg-brand-green/5 border border-brand-green/20 rounded-xl flex items-start gap-3">
                    <Check className="h-4 w-4 text-brand-green mt-1 shrink-0" />
                    <div className="text-[10px]">
                      <p className="font-bold text-brand-green uppercase tracking-widest">
                        Discreet Packaging Guaranteed
                      </p>
                      <p className="text-zinc-500">
                        Your package will arrive in unmarked, non-descriptive packaging to protect your privacy.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <h3 className="font-bold uppercase tracking-wider text-sm">Shipping Method</h3>
                    <div className="space-y-2">
                      {isShippingMethodsLoading && (
                        <div className="p-4 bg-white border border-brand-green/10 rounded-xl">
                          <p className="text-sm text-zinc-500">Loading shipping methods...</p>
                        </div>
                      )}

                      {!isShippingMethodsLoading && shippingMethods.length === 0 && (
                        <div className="p-4 bg-white border border-brand-green/10 rounded-xl">
                          <p className="text-sm text-zinc-500">No shipping methods available right now.</p>
                        </div>
                      )}

                      {!isShippingMethodsLoading && shippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className={cn(
                            "flex items-center justify-between p-4 bg-white border rounded-xl cursor-pointer transition-colors",
                            formData.shipping_method === String(method.id) ? "border-brand-green bg-brand-green/5" : "border-brand-green/10"
                          )}
                          onClick={() => setFormData({ ...formData, shipping_method: String(method.id) })}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                              formData.shipping_method === String(method.id) ? "border-brand-green" : "border-zinc-300"
                            )}>
                              {formData.shipping_method === String(method.id) && <div className="w-2 h-2 rounded-full bg-brand-green" />}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{method.name}</p>
                              <p className="text-[10px] text-zinc-400">
                                {typeof method.business_days === "number"
                                  ? `${method.business_days} business day${method.business_days === 1 ? "" : "s"}`
                                  : "Delivery timeline unavailable"}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-sm">${method.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={isShippingMethodsLoading || shippingMethods.length === 0 || !formData.shipping_method}
                    className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-full py-6 font-bold"
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="border border-brand-green/10 rounded-2xl bg-brand-light p-8 space-y-8">
                  <h2 className="text-xl font-bold uppercase tracking-tight">Payment Information</h2>
                  <div className="space-y-4">
                    <Input placeholder="Card Number" className="rounded-full bg-white h-12" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="MM/YY" className="rounded-full bg-white h-12" />
                      <Input placeholder="CVV" className="rounded-full bg-white h-12" />
                    </div>
                  </div>
                  <div className="p-4 border-2 border-dashed border-brand-green/20 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-brand-green uppercase tracking-widest">Optional:</p>
                    <p className="text-[10px] text-zinc-500 italic">
                      Explore &apos;Buy Now, Pay Later&apos; options like Affirm or Klarna for flexible payment plans.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 rounded-full py-6 border-brand-green/20"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      className="flex-2 bg-brand-green hover:bg-brand-green/90 text-white rounded-full py-6 font-bold"
                    >
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="border border-brand-green/10 rounded-2xl bg-brand-light p-8 space-y-8">
                  <h2 className="text-xl font-bold uppercase tracking-tight">Order Review</h2>
                  <div className="space-y-6">
                    <div className="pb-6 border-b border-brand-green/10">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Shipping To:</p>
                      <p className="font-serif italic text-zinc-600">{formData.address}, {formData.city}, {formData.state}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                        Shipping Method:
                      </p>
                      <p className="font-serif italic text-zinc-600">{selectedShippingMethod?.name || "Not selected"}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex-1 rounded-full py-6 border-brand-green/20"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isLoading}
                      className="flex-2 bg-brand-green hover:bg-brand-green/90 text-white rounded-full py-6 font-bold uppercase tracking-widest"
                    >
                      {isLoading ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="border border-brand-green/10 rounded-2xl bg-brand-light p-6 space-y-6">
                <h3 className="font-bold uppercase tracking-wider text-sm">Order Summary</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variation_id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-bold leading-none">{item.title}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">Size: {item.size || "M"}</p>
                      </div>
                      <span className="font-bold text-brand-green">${item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-xs pt-4 border-t border-brand-green/10">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Shipping</span>
                    <span className="font-bold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-4 text-lg font-bold">
                    <span className="uppercase tracking-widest">Total:</span>
                    <span className="text-brand-green">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                <Lock className="h-3 w-3" /> Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
