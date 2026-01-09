"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Star, Minus, Plus, Check, Truck, ShieldCheck, Box, X, Ruler, Info } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SizeGuideTable } from "@/components/size-guide-table"
import { SizeGuideModal } from "@/components/size-guide-modal"
import { ProductReviews } from "@/components/product-reviews"


export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState("L")
  const [quantity, setQuantity] = useState(1)
  const [packSize, setPackSize] = useState(3)
  const [plan, setPlan] = useState("subscribe")
  const [activeTab, setActiveTab] = useState("description")
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)

  const productImages = [
    "/white-diaper-side-view.jpg",
    "/adult-diaper-product.jpg",
    "/adult-pant-product.jpg",
    "/diaper-pack-front.jpg",
  ]
  const [selectedImage, setSelectedImage] = useState(productImages[0])

  const price = 25
  const subtotal = price * packSize
  const discount = plan === "subscribe" ? subtotal * 0.2 : subtotal * 0.1
  const total = subtotal - discount

  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: 1, // simplified for UI demo
      title: "PANT DIAPER",
      price: total,
      quantity: quantity,
      image: "/white-diaper-side-view.jpg",
      size: selectedSize,
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Image Gallery & Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 w-20">
                {productImages.map((src, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(src)}
                    className={cn(
                      "aspect-square relative border rounded-lg overflow-hidden bg-brand-light cursor-pointer transition-all",
                      selectedImage === src ? "border-brand-green ring-1 ring-brand-green" : "hover:border-brand-green/50",
                    )}
                  >
                    <Image src={src || "/placeholder.svg"} alt={`Thumbnail ${i}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex-1 aspect-square relative border rounded-2xl overflow-hidden bg-brand-light p-12">
                <Image src={selectedImage || "/placeholder.svg"} alt="Main Product" fill className="object-contain p-8" />
              </div>
            </div>

            {/* Product Basic Info - Moved here */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">PANT DIAPER</h1>
              <p className="text-3xl font-bold text-brand-green">${price}</p>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < 4 ? "fill-current" : "text-zinc-300 fill-current"}`} />
                  ))}
                </div>
                <span className="text-xl text-muted-foreground font-serif">(342)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry&apos;s standard dummy text ever since the 1500s.
              </p>
            </div>
          </div>

          {/* Product Selection */}
          <div className="lg:col-span-5 space-y-8">

            {/* Plans */}
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-wider text-sm">Choose Your Plan</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setPlan("one-time")}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                    plan === "one-time" ? "border-brand-green bg-brand-green/5" : "border-zinc-200",
                  )}
                >
                  <div>
                    <p className="font-bold">One Time Purchase</p>
                    <p className="text-xs text-muted-foreground">By once, no commitment</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${price}</p>
                    <p className="text-[10px] text-muted-foreground">Per Pack</p>
                  </div>
                </button>
                <button
                  onClick={() => setPlan("subscribe")}
                  className={cn(
                    "relative flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                    plan === "subscribe" ? "border-brand-green bg-brand-green/5" : "border-zinc-200",
                  )}
                >
                  <div className="absolute -top-2 right-4 bg-brand-green text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Best Value
                  </div>
                  <div>
                    <p className="font-bold">Subscribe And Save</p>
                    <p className="text-xs text-muted-foreground">Cancel or modify at any time</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-green">${price - 5}</p>
                    <p className="text-[10px] line-through text-muted-foreground">${price}</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Size */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold uppercase tracking-wider text-sm">Select Size</h3>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[10px] font-bold text-brand-green flex items-center gap-1 hover:underline"
                >
                  <span className="inline-block w-4 h-4 rounded-full border border-brand-green flex items-center justify-center text-[8px]">
                    ?
                  </span>{" "}
                  Fit Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {["S", "M", "L", "XL", "XX-L"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold transition-all",
                      selectedSize === size
                        ? "border-brand-green bg-brand-green/5 text-brand-green"
                        : "border-zinc-200 text-zinc-500 hover:border-brand-green/50",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                <span className="text-orange-500 italic font-bold">!</span> Please select a size to continue
              </p>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="font-bold uppercase tracking-wider text-sm">Quantity</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center border-2 border-zinc-200 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-zinc-100 rounded"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-zinc-100 rounded">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Pack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 3, 6, 12].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPackSize(num)}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg border-2 font-bold transition-all text-sm",
                      packSize === num
                        ? "border-brand-green bg-brand-green/5 text-brand-green"
                        : "border-zinc-200 text-zinc-500",
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Discount Banner */}
            <div className="bg-brand-green/10 border border-brand-green/30 rounded-lg p-3">
              <p className="text-brand-green font-bold text-sm">Bulk Discount Applied!</p>
              <p className="text-[10px] text-brand-green">
                Save 10% when buying 3+ packs. You&apos;re saving ${discount.toFixed(2)}!
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-brand-light rounded-2xl p-6 space-y-3">
              <h4 className="font-bold text-sm">Order Summary</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({packSize} Packs)</span>
                  <span className="font-bold">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bulk Discount (10%)</span>
                  <span className="font-bold text-brand-green">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-brand-green/10">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-[10px] text-center text-brand-green font-bold italic pt-2">
                You Save ${discount.toFixed(2)} (10% Off)
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-full py-6 text-lg font-bold"
              >
                Add to Card
              </Button>
              <p className="text-[10px] text-center text-muted-foreground italic">
                Please Select A Size Before Adding To Cart
              </p>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-zinc-100">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="h-5 w-5 text-brand-green" />
                <span className="text-[8px] font-bold text-muted-foreground">Free Shipping Over $50</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand-green" />
                <span className="text-[8px] font-bold text-muted-foreground">30-Day Guarantee</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Box className="h-5 w-5 text-brand-green" />
                <span className="text-[8px] font-bold text-muted-foreground">Discreet Packaging</span>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-sm">Key Features:</h3>
              <ul className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Check className="h-4 w-4 text-brand-green shrink-0" />
                    Lorem Ipsum is simply dummy text.
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-24">
          <div className="flex border-b">
            {[
              { id: "description", label: "Product Description" },
              { id: "guide", label: "Sizes & Fit Guide" },
              { id: "reviews", label: "Reviews (2)" },
              { id: "faqs", label: "FAQs" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-8 py-4 text-sm font-bold transition-all relative",
                  activeTab === tab.id ? "text-brand-green" : "text-muted-foreground",
                )}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-green" />}
              </button>
            ))}
          </div>
          <div className="py-12 space-y-12 max-w-4xl">
            {activeTab === "description" && (
              <>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">About This Product</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of
                    type and scrambled it to make a type specimen book.
                  </p>
                </div>
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Complete Features List:</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                        Lorem Ipsum is simply dummy text.
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "guide" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Size Guide</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Choose the right size for optimal comfort and protection. Measure at the fullest part of the hips.
                  </p>
                </div>

                <div className="max-w-2xl">
                  <SizeGuideTable />
                </div>

                <div className="bg-brand-green/5 rounded-xl p-4 flex items-center gap-2 border border-brand-green/5">
                  <p className="text-xs text-brand-green">
                    <span className="font-bold">Tip:</span> If You&apos;re Between Sizes, We Recommend Choosing The
                    Larger Size For Better Comfort.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && <ProductReviews />}

            {activeTab === "faqs" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">
                    Find answers to common questions about our products and services.
                  </p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-brand-green/10">
                    <AccordionTrigger className="text-left font-bold hover:text-brand-green transition-colors">
                      How do I choose the right size?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      We recommend measuring around the widest part of your hips or waist. Use our Size & Fit Guide tab
                      above to find the perfect match for your measurements. If you are between two sizes, we suggest
                      choosing the larger one for better comfort and safety.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-brand-green/10">
                    <AccordionTrigger className="text-left font-bold hover:text-brand-green transition-colors">
                      Is the packaging discreet?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      Yes, absolutely. All orders are shipped in plain, unmarked boxes with no logos or descriptions of
                      the contents. Your privacy is our top priority.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-brand-green/10">
                    <AccordionTrigger className="text-left font-bold hover:text-brand-green transition-colors">
                      How long can these be worn?
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      Our products are designed for up to 8-12 hours of protection depending on the absorbency level.
                      However, we recommend changing them whenever they feel wet or heavy to maintain skin health and
                      maximum comfort.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="bg-brand-green/5 p-8 rounded-3xl border border-brand-green/10 text-center space-y-4">
                  <h3 className="font-bold">Still have questions?</h3>
                  <p className="text-sm text-muted-foreground">Our care specialists are available 24/7 to help you.</p>
                  <div className="flex flex-wrap justify-center gap-4 pt-2">
                    <Button
                      variant="outline"
                      className="rounded-full px-6 border-brand-green text-brand-green hover:bg-brand-green/5 bg-transparent"
                    >
                      Call Now
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full px-6 border-brand-green text-brand-green hover:bg-brand-green/5 bg-transparent"
                    >
                      Live Chat
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  )
}
