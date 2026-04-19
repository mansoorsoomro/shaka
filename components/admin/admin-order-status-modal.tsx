"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import type { AdminOrderRow } from "@/components/admin/admin-orders-table";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

interface AdminOrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrderRow | null;
  onSave: (orderNumber: string, status: string) => Promise<void>;
}

export default function AdminOrderStatusModal({ isOpen, onClose, order, onSave }: AdminOrderStatusModalProps) {
  const [status, setStatus] = useState<string>("pending");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      setStatus(order.status || "pending");
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(order.orderNumber, status);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <Card className="relative w-full max-w-md border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Update order status</CardTitle>
            <CardDescription>{order.orderNumber}</CardDescription>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
            <X size={20} className="text-gray-600" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-primary/90">
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
