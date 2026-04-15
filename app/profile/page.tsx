"use client"

import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { User, Mail, Phone, Calendar, ShieldCheck, LogOut, Loader2, PackageSearch, Eye, XCircle } from "lucide-react"
import { toast } from "sonner"
import { orderService } from "@/lib/services/order-service"
import { useMounted } from "@/hooks/use-mounted"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { format } from "date-fns";

type GenericRecord = Record<string, unknown>

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
})

function asRecord(value: unknown): GenericRecord | null {
    if (typeof value !== "object" || value === null) return null
    return value as GenericRecord
}

function toStringValue(value: unknown): string | null {
    if (typeof value === "string") return value
    if (typeof value === "number") return String(value)
    return null
}

function toNumberValue(value: unknown): number {
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value === "string") {
        const parsed = Number(value)
        if (Number.isFinite(parsed)) return parsed
    }
    return 0
}

function extractOrders(data: unknown): GenericRecord[] {
    if (Array.isArray(data)) {
        return data.map(asRecord).filter((value): value is GenericRecord => value !== null)
    }

    const record = asRecord(data)
    if (!record) return []

    if (Array.isArray(record.data)) {
        return record.data.map(asRecord).filter((value): value is GenericRecord => value !== null)
    }

    if (Array.isArray(record.orders)) {
        return record.orders.map(asRecord).filter((value): value is GenericRecord => value !== null)
    }

    const nestedData = asRecord(record.data)
    if (!nestedData) return []

    if (Array.isArray(nestedData.data)) {
        return nestedData.data.map(asRecord).filter((value): value is GenericRecord => value !== null)
    }

    if (Array.isArray(nestedData.orders)) {
        return nestedData.orders.map(asRecord).filter((value): value is GenericRecord => value !== null)
    }

    return []
}

function extractOrder(data: unknown): GenericRecord | null {
    if (Array.isArray(data)) {
        return asRecord(data[0])
    }

    const record = asRecord(data)
    if (!record) return null

    const directOrder = asRecord(record.order)
    if (directOrder) return directOrder

    if (Array.isArray(record.data)) {
        return asRecord(record.data[0])
    }

    const nestedData = asRecord(record.data)
    if (!nestedData) return record

    const nestedOrder = asRecord(nestedData.order)
    if (nestedOrder) return nestedOrder

    return nestedData
}

function getOrderKey(order: GenericRecord, index: number): string {
    return (
        toStringValue(order.order_number) ??
        toStringValue(order.id) ??
        toStringValue(order.order_id) ??
        `order-${index}`
    )
}

function getOrderReference(order: GenericRecord): string | null {
    return toStringValue(order.order_number) ?? toStringValue(order.id) ?? toStringValue(order.order_id)
}

function getOrderLabel(order: GenericRecord, index: number): string {
    const orderNumber = toStringValue(order.order_number)
    if (orderNumber) return `#${orderNumber}`

    const id = toStringValue(order.id) ?? toStringValue(order.order_id)
    if (id) return `Order #${id}`

    return `Order ${index + 1}`
}

function getOrderStatus(order: GenericRecord): string {
    return (toStringValue(order.status) ?? "pending").toLowerCase()
}

function getOrderTotal(order: GenericRecord): number {
    const total = toNumberValue(order.total ?? order.total_amount ?? order.grand_total ?? order.amount)
    if (total > 0) return total

    const items = Array.isArray(order.items) ? order.items : Array.isArray(order.order_items) ? order.order_items : []
    return items.reduce((sum, item) => {
        const itemRecord = asRecord(item)
        if (!itemRecord) return sum
        const subtotal = toNumberValue(itemRecord.subtotal ?? itemRecord.total)
        const quantity = Math.max(1, toNumberValue(itemRecord.quantity))
        const price = toNumberValue(itemRecord.price ?? itemRecord.unit_price)
        return sum + (subtotal > 0 ? subtotal : price * quantity)
    }, 0)
}

function getOrderDate(order: GenericRecord): string | null {
    return toStringValue(order.created_at) ?? toStringValue(order.createdAt)
}

function formatDateLabel(dateValue: string | null): string {
    if (!dateValue) return "Date unavailable"

    const parsed = new Date(dateValue)
    if (Number.isNaN(parsed.getTime())) return dateValue

    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function getStatusClass(status: string): string {
    if (["cancelled", "canceled", "failed", "refunded"].includes(status)) {
        return "border-red-200 bg-red-100 text-red-700"
    }

    if (["delivered", "completed"].includes(status)) {
        return "border-emerald-200 bg-emerald-100 text-emerald-700"
    }

    if (["pending", "processing", "confirmed", "shipped"].includes(status)) {
        return "border-amber-200 bg-amber-100 text-amber-700"
    }

    return "border-zinc-200 bg-zinc-100 text-zinc-600"
}

function canCancelOrder(status: string): boolean {
    return !["cancelled", "canceled", "delivered", "completed", "refunded", "failed"].includes(status)
}

function formatStatusLabel(status: string): string {
    const label = status.replace(/_/g, " ")
    return label.charAt(0).toUpperCase() + label.slice(1)
}

function getShippingAddress(order: GenericRecord): string | null {
    const shipping = asRecord(order.shipping_address)
    const street =
        toStringValue(order.street_address ?? order.address ?? order.shipping_address_line_1) ??
        toStringValue(shipping?.street_address ?? shipping?.address)
    const city = toStringValue(order.city ?? shipping?.city)
    const state = toStringValue(order.state ?? shipping?.state)
    const zip = toStringValue(order.zip_code ?? order.postal_code ?? shipping?.zip_code ?? shipping?.postal_code)

    const parts = [street, city, state, zip].filter((item): item is string => Boolean(item && item.trim().length > 0))
    return parts.length > 0 ? parts.join(", ") : null
}

function getOrderItems(order: GenericRecord): Array<{ key: string; name: string; quantity: number; price: number; subtotal: number; size?: string }> {
    const rawItems = Array.isArray(order.items) ? order.items : Array.isArray(order.order_items) ? order.order_items : []

    return rawItems
        .map((item, index) => {
            const record = asRecord(item)
            if (!record) return null

            const product = asRecord(record.product)
            const quantity = Math.max(1, toNumberValue(record.quantity ?? record.qty))
            const price = toNumberValue(record.price ?? record.unit_price ?? record.amount)
            const subtotalCandidate = toNumberValue(record.subtotal ?? record.total)
            const subtotal = subtotalCandidate > 0 ? subtotalCandidate : price * quantity
            const size = toStringValue(record.size ?? record.size_name ?? record.size_code) ?? undefined

            return {
                key: toStringValue(record.id ?? record.variation_id ?? record.product_id) ?? `item-${index}`,
                name:
                    toStringValue(record.product_name) ??
                    toStringValue(record.name) ??
                    toStringValue(record.title) ??
                    toStringValue(product?.name) ??
                    `Item ${index + 1}`,
                quantity,
                price,
                subtotal,
                ...(size ? { size } : {}),
            }
        })
        .filter((item): item is { key: string; name: string; quantity: number; price: number; subtotal: number; size?: string } => item !== null)
}

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth()
    const router = useRouter()
    const mounted = useMounted()
    const [orders, setOrders] = useState<GenericRecord[]>([])
    const [isOrdersLoading, setIsOrdersLoading] = useState(true)
    const [expandedOrderKey, setExpandedOrderKey] = useState<string | null>(null)
    const [detailLoadingKey, setDetailLoadingKey] = useState<string | null>(null)
    const [cancelLoadingKey, setCancelLoadingKey] = useState<string | null>(null)
    const [orderDetailsByKey, setOrderDetailsByKey] = useState<Record<string, GenericRecord>>({})
    const [orderToCancel, setOrderToCancel] = useState<{ order: GenericRecord, index: number } | null>(null)

    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setIsOrdersLoading(true)

        try {
            const response = await orderService.getMyOrders()
            const fetchedOrders = extractOrders(response.data).sort((a, b) => {
                const aTime = Date.parse(getOrderDate(a) ?? "")
                const bTime = Date.parse(getOrderDate(b) ?? "")
                const safeA = Number.isNaN(aTime) ? 0 : aTime
                const safeB = Number.isNaN(bTime) ? 0 : bTime
                return safeB - safeA
            })

            setOrders(fetchedOrders)

            if ((response.success === false || response.status === false) && fetchedOrders.length === 0) {
                toast.error(response.message || "Unable to load your orders right now.")
            }
        } catch (error: any) {
            setOrders([])
            if (!silent) {
                toast.error(error.message || "Failed to load orders.")
            }
        } finally {
            if (!silent) setIsOrdersLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!mounted) return
        if (!isAuthenticated) {
            router.push("/login")
            return
        }

        void fetchOrders()
    }, [mounted, isAuthenticated, router, fetchOrders])

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const handleToggleOrderDetails = async (order: GenericRecord, index: number) => {
        const key = getOrderKey(order, index)

        if (expandedOrderKey === key) {
            setExpandedOrderKey(null)
            return
        }

        setExpandedOrderKey(key)

        if (orderDetailsByKey[key]) return

        const reference = getOrderReference(order)
        if (!reference) return

        setDetailLoadingKey(key)
        try {
            const response = await orderService.getOrderDetails(reference)
            const details = extractOrder(response.data)

            if (!details) {
                toast.error(response.message || "Order details are unavailable.")
                return
            }

            setOrderDetailsByKey((prev) => ({ ...prev, [key]: details }))
            setOrders((prev) => prev.map((currentOrder, currentIndex) => (
                getOrderKey(currentOrder, currentIndex) === key ? { ...currentOrder, ...details } : currentOrder
            )))
        } catch (error: any) {
            toast.error(error.message || "Failed to load order details.")
        } finally {
            setDetailLoadingKey(null)
        }
    }

    const handleCancelOrder = (order: GenericRecord, index: number) => {
        setOrderToCancel({ order, index })
    }

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return
        const { order, index } = orderToCancel

        const key = getOrderKey(order, index)
        const reference = getOrderReference(order)

        if (!reference) {
            toast.error("Unable to cancel this order because no order reference was found.")
            setOrderToCancel(null)
            return
        }

        const orderLabel = getOrderLabel(order, index)
        setCancelLoadingKey(key)

        try {
            const response = await orderService.cancelOrder(reference)
            const details = extractOrder(response.data)

            if (details) {
                setOrderDetailsByKey((prev) => ({ ...prev, [key]: { ...order, ...details } }))
                setOrders((prev) => prev.map((currentOrder, currentIndex) => (
                    getOrderKey(currentOrder, currentIndex) === key ? { ...currentOrder, ...details } : currentOrder
                )))
            } else {
                setOrders((prev) => prev.map((currentOrder, currentIndex) => (
                    getOrderKey(currentOrder, currentIndex) === key ? { ...currentOrder, status: "cancelled" } : currentOrder
                )))
            }

            toast.success(response.message || `${orderLabel} cancelled successfully.`)
            void fetchOrders(true)
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel order.")
        } finally {
            setCancelLoadingKey(null)
            setOrderToCancel(null)
        }
    }

    if (!mounted || !user || !isAuthenticated) return null

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 pt-28">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between pb-8 border-b border-brand-green/10">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green border-4 border-white shadow-xl">
                                <User size={48} />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold uppercase tracking-tighter text-brand-green">
                                    {user.firstname} {user.lastname}
                                </h1>
                                <p className="text-zinc-500 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" /> Verified Customer
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-full font-bold uppercase text-xs hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="space-y-6 lg:col-span-2">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-400">Personal Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-brand-light rounded-2xl border border-brand-green/5">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-green shadow-sm">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Email Address</p>
                                        <p className="font-bold text-zinc-700">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-brand-light rounded-2xl border border-brand-green/5">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-green shadow-sm">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Phone Number</p>
                                        <p className="font-bold text-zinc-700">{user.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-brand-light rounded-2xl border border-brand-green/5">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-green shadow-sm">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Date of Birth</p>
                                        <p className="font-bold text-zinc-700">{user?.dob ? format(new Date(user.dob), "MMM dd, yyyy") : "-"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 lg:col-span-3">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-400">Order History</h2>

                            {isOrdersLoading ? (
                                <div className="p-8 bg-brand-light rounded-2xl border border-dashed border-brand-green/20 flex flex-col items-center justify-center text-center space-y-4">
                                    <Loader2 className="h-8 w-8 text-brand-green animate-spin" />
                                    <p className="text-sm text-zinc-500 italic max-w-xs">Loading your orders...</p>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="p-8 bg-brand-light rounded-2xl border border-dashed border-brand-green/20 flex flex-col items-center justify-center text-center space-y-4">
                                    <PackageSearch className="h-12 w-12 text-zinc-300" />
                                    <p className="text-sm text-zinc-500 italic max-w-xs">
                                        Your orders will appear here after your first purchase.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order, index) => {
                                        const key = getOrderKey(order, index)
                                        const detailedOrder = orderDetailsByKey[key] ?? order
                                        const orderLabel = getOrderLabel(order, index)
                                        const status = getOrderStatus(detailedOrder)
                                        const total = getOrderTotal(detailedOrder)
                                        const isExpanded = expandedOrderKey === key
                                        const isDetailLoading = detailLoadingKey === key
                                        const isCancelLoading = cancelLoadingKey === key
                                        const shippingAddress = getShippingAddress(detailedOrder)
                                        const items = getOrderItems(detailedOrder)

                                        return (
                                            <div
                                                key={key}
                                                className="p-4 bg-brand-light rounded-2xl border border-brand-green/10 space-y-4"
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Order</p>
                                                        <p className="font-bold text-zinc-700">{orderLabel}</p>
                                                        <p className="text-xs text-zinc-500">{formatDateLabel(getOrderDate(detailedOrder))}</p>
                                                    </div>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${getStatusClass(status)}`}
                                                    >
                                                        {formatStatusLabel(status)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Total</p>
                                                    <p className="text-lg font-bold text-brand-green">{currencyFormatter.format(total)}</p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => void handleToggleOrderDetails(order, index)}
                                                        className="flex items-center gap-2 px-4 py-2 border border-brand-green/20 text-brand-green rounded-full font-bold uppercase text-[10px] hover:bg-brand-green/5 transition-colors"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        {isExpanded ? "Hide Details" : "View Details"}
                                                    </button>

                                                    {canCancelOrder(status) && (
                                                        <button
                                                            onClick={() => void handleCancelOrder(order, index)}
                                                            disabled={isCancelLoading}
                                                            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-full font-bold uppercase text-[10px] hover:bg-red-50 transition-colors disabled:opacity-60"
                                                        >
                                                            {isCancelLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                                                            {isCancelLoading ? "Cancelling..." : "Cancel Order"}
                                                        </button>
                                                    )}
                                                </div>

                                                {isExpanded && (
                                                    <div className="pt-4 border-t border-brand-green/10 space-y-3">
                                                        {isDetailLoading ? (
                                                            <p className="text-sm text-zinc-500 flex items-center gap-2">
                                                                <Loader2 className="h-4 w-4 animate-spin text-brand-green" />
                                                                Loading order details...
                                                            </p>
                                                        ) : (
                                                            <>
                                                                {shippingAddress && (
                                                                    <div>
                                                                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Shipping Address</p>
                                                                        <p className="text-sm text-zinc-600">{shippingAddress}</p>
                                                                    </div>
                                                                )}

                                                                <div className="space-y-2">
                                                                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Items</p>
                                                                    {items.length === 0 ? (
                                                                        <p className="text-sm text-zinc-500">No item details available for this order.</p>
                                                                    ) : (
                                                                        items.map((item) => (
                                                                            <div
                                                                                key={`${key}-${item.key}`}
                                                                                className="p-3 bg-white rounded-xl border border-brand-green/5 flex items-start justify-between gap-3"
                                                                            >
                                                                                <div>
                                                                                    <p className="font-semibold text-sm text-zinc-700">{item.name}</p>
                                                                                    <p className="text-[11px] text-zinc-500">
                                                                                        Qty {item.quantity}
                                                                                        {item.size ? ` • Size ${item.size}` : ""}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <p className="text-sm font-bold text-zinc-700">{currencyFormatter.format(item.subtotal)}</p>
                                                                                    {item.quantity > 1 && (
                                                                                        <p className="text-[11px] text-zinc-500">{currencyFormatter.format(item.price)} each</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel {orderToCancel ? getOrderLabel(orderToCancel.order, orderToCancel.index) : "this order"}?
                            This action cannot be undone and your payment won't be charged.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Keep Order</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmCancelOrder} className="bg-red-600 hover:bg-red-700 text-white border-transparent">
                            Cancel Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
