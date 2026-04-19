"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Eye, Pencil } from "lucide-react";

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
  items: number;
}

interface AdminOrdersTableProps {
  orders: AdminOrderRow[];
  getStatusColor: (status: string) => string;
  onView: (order: AdminOrderRow) => void;
  onUpdateStatus: (order: AdminOrderRow) => void;
}

export default function AdminOrdersTable({
  orders,
  getStatusColor,
  onView,
  onUpdateStatus,
}: AdminOrdersTableProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className="p-0 overflow-x-auto">
        <div className="w-full overflow-x-auto">
          <table className="min-w-max w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="px-3 py-3 text-left font-semibold text-gray-700 md:px-6 md:py-4">Order #</th>
                <th className="hidden px-3 py-3 text-left font-semibold text-gray-700 sm:table-cell md:px-6 md:py-4">
                  Customer
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700 md:px-6 md:py-4">Amount</th>
                <th className="hidden px-3 py-3 text-left font-semibold text-gray-700 md:table-cell md:px-6 md:py-4">
                  Items
                </th>
                <th className="hidden px-3 py-3 text-left font-semibold text-gray-700 lg:table-cell md:px-6 md:py-4">
                  Date
                </th>
                <th className="px-3 py-3 text-left font-semibold text-gray-700 md:px-6 md:py-4">Status</th>
                <th className="px-3 py-3 text-center font-semibold text-gray-700 md:px-6 md:py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                  <td className="px-3 py-3 font-medium text-gray-900 md:px-6 md:py-4">{order.orderNumber}</td>
                  <td className="hidden px-3 py-3 text-gray-600 sm:table-cell md:px-6 md:py-4">{order.customer}</td>
                  <td className="px-3 py-3 font-semibold text-gray-900 md:px-6 md:py-4">{order.amount}</td>
                  <td className="hidden px-3 py-3 text-gray-600 md:table-cell md:px-6 md:py-4">{order.items}</td>
                  <td className="hidden px-3 py-3 text-gray-600 lg:table-cell md:px-6 md:py-4">{order.date}</td>
                  <td className="px-3 py-3 md:px-6 md:py-4">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold md:px-3 ${getStatusColor(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="flex justify-center gap-1 px-3 py-3 md:px-6 md:py-4">
                    <button
                      type="button"
                      onClick={() => onView(order)}
                      className="rounded-lg p-1.5 transition-colors hover:bg-blue-100 md:p-2"
                      title="View"
                    >
                      <Eye size={16} className="text-blue-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateStatus(order)}
                      className="rounded-lg p-1.5 transition-colors hover:bg-yellow-100 md:p-2"
                      title="Update status"
                    >
                      <Pencil size={16} className="text-yellow-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
