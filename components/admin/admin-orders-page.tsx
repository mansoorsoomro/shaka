"use client";

import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import AdminOrdersTable, { type AdminOrderRow } from "@/components/admin/admin-orders-table";
import OrderDetailModal from "@/components/order-detail-modal";
import AdminOrderStatusModal from "@/components/admin/admin-order-status-modal";
import { adminService } from "@/lib/services/admin-service";
import { extractOrdersList, isApiSuccess } from "@/lib/admin/extract";
import { toast } from "sonner";
import { Order } from "@/types";

function mapRawOrder(raw: Record<string, unknown>): AdminOrderRow {
  const orderNumber = String(raw.order_number ?? raw.orderNumber ?? "");
  const id = String(raw.id ?? orderNumber);

  const user = raw.user as Record<string, unknown> | undefined;
  const first =
    user?.firstname ??
    user?.first_name ??
    raw.first_name ??
    raw.customer_first_name ??
    raw.billing_first_name;
  const last =
    user?.lastname ?? user?.last_name ?? raw.last_name ?? raw.customer_last_name ?? raw.billing_last_name;
  const email = String(user?.email ?? raw.email ?? "");
  const customerFromName = [first, last].filter(Boolean).join(" ").trim();
  const customer = customerFromName || email || String(raw.customer_name ?? raw.customer ?? "—");

  const total = raw.total ?? raw.amount ?? raw.grand_total ?? raw.subtotal;
  let amount = "—";
  if (typeof total === "number") amount = `$${total.toFixed(2)}`;
  else if (total != null) amount = String(total);

  let items = 0;
  if (typeof raw.items_count === "number") items = raw.items_count;
  else if (Array.isArray(raw.items)) items = raw.items.length;
  else if (typeof raw.line_items_count === "number") items = raw.line_items_count;

  const status = String(raw.status ?? "pending").toLowerCase();
  const created = raw.created_at ?? raw.date ?? raw.placed_at;
  const date = typeof created === "string" ? created.split("T")[0] : String(created ?? "—");

  return { id, orderNumber, customer, amount, status, date, items };
}

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [fullOrders, setFullOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState<AdminOrderRow | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllOrders();
      if (!isApiSuccess(res)) {
        toast.error((res as { message?: string }).message ?? "Failed to load orders");
        setOrders([]);
        setFullOrders([]);
        return;
      }
      const list = extractOrdersList(res);
      const mapped = list
        .map((item) => mapRawOrder(item as Record<string, unknown>))
        .filter((o) => o.orderNumber);
      setOrders(mapped);
      setFullOrders(list as Order[]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load orders";
      toast.error(msg);
      setOrders([]);
      setFullOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSaveStatus = async (orderNumber: string, status: string) => {
    try {
      const res = await adminService.updateOrderStatus(orderNumber, status);
      if (isApiSuccess(res)) {
        toast.success("Order status updated");
        await loadOrders();
      } else {
        toast.error((res as { message?: string }).message ?? "Update failed");
        throw new Error("update failed");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Update failed";
      toast.error(msg);
      throw e;
    }
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">Orders</h1>
        <p className="text-sm text-muted-foreground md:text-base">Admin order list and status updates (API)</p>
      </div>

      <Card className="mb-6 border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <Input
              placeholder="Search by order number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm md:text-base"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <AdminOrdersTable
          orders={filtered}
          getStatusColor={getStatusColor}
          onView={(o) => {
            const fullOrder = fullOrders.find(order => order.order_number === o.orderNumber);
            if (fullOrder) {
              setDetailOrder(fullOrder);
              setDetailOpen(true);
            } else {
              toast.error("Order details not found");
            }
          }}
          onUpdateStatus={(o) => {
            setStatusOrder(o);
            setStatusOpen(true);
          }}
        />
      )}

      <OrderDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        order={detailOrder}
        onEdit={() => {}} // Not needed for admin view
      />

      <AdminOrderStatusModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
        order={statusOrder}
        onSave={handleSaveStatus}
      />
    </div>
  );
}
