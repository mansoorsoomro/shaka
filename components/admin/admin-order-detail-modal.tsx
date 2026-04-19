"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { AdminOrderRow } from "@/components/admin/admin-orders-table";

interface AdminOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrderRow | null;
}

export default function AdminOrderDetailModal({ isOpen, onClose, order }: AdminOrderDetailModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Order details</CardTitle>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-b pb-3">
            <p className="text-sm text-muted-foreground">Order number</p>
            <p className="text-lg font-semibold">{order.orderNumber}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="font-semibold">{order.customer}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-lg font-semibold text-primary">{order.amount}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="font-semibold">{order.items}</p>
          </div>
          <div className="border-b pb-3">
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-semibold">{order.date}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="mt-1 font-semibold capitalize">{order.status}</p>
          </div>
          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
