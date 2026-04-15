"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { orderService } from "@/lib/services/order-service"

function SuccessPageContent() {
    const searchParams = useSearchParams()
    const urlOrderNum = searchParams.get("order") || searchParams.get("order_number")
    const sessionId = searchParams.get("session_id")
    const [dynamicOrderNum, setDynamicOrderNum] = useState<string | null>(urlOrderNum)

    useEffect(() => {
        if (!dynamicOrderNum && sessionId) {
            orderService.getOrderBySession(sessionId).then(res => {
                if ((res.success || res.status) && res.data) {
                    setDynamicOrderNum(res.data.order_number || null)
                }
            }).catch(console.error)
        }
    }, [sessionId, dynamicOrderNum])

    const orderNumberDisplay = dynamicOrderNum ? `#${dynamicOrderNum}` : "your recent order"

    return (
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center">
                <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-brand-green" />
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl font-serif font-bold">Order Received!</h1>
                <p className="text-muted-foreground text-lg">
                    Thank you for your purchase. {dynamicOrderNum ? "Your order " : ""}
                    <span className="text-zinc-900 font-bold">{orderNumberDisplay}</span> has been placed successfully.
                </p>
            </div>

            <div className="bg-brand-light border border-brand-green/10 rounded-3xl p-8 space-y-6">
                <div className="flex items-start gap-4 text-left">
                    <div className="p-3 bg-white rounded-xl border border-brand-green/10">
                        <Package className="h-6 w-6 text-brand-green" />
                    </div>
                    <div>
                        <h3 className="font-bold">Shipping Update</h3>
                        <p className="text-sm text-zinc-500">
                            You will receive an email confirmation shortly with your tracking details. Orders typically ship within 24 hours in discreet packaging.
                        </p>
                    </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Button asChild className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white rounded-full py-6 font-bold uppercase tracking-widest text-xs">
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1 rounded-full py-6 border-brand-green/20 font-bold uppercase tracking-widest text-xs">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>

            <div className="pt-8 text-sm text-muted-foreground flex items-center justify-center gap-2">
                Need help? <Link href="/contact" className="text-brand-green font-bold hover:underline flex items-center gap-1">Contact Support <ArrowRight className="h-3 w-3" /></Link>
            </div>
        </div>
    )
}

export default function OrderSuccessPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-20 pt-40">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-64 flex-col gap-4 text-brand-green">
                        <div className="w-8 h-8 rounded-full border-4 border-brand-green/20 border-t-brand-green animate-spin" />
                        <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Loading Order...</p>
                    </div>
                }>
                    <SuccessPageContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
