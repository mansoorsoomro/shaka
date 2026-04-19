import React from 'react';
import { Order } from '@/types';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onEdit: (order: Order) => void;
}

export default function OrderDetailModal({ isOpen, onClose, order, onEdit }: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">Order #{order.order_number}</p>
            <p>Status: {order.status}</p>
          </div>

            <div>
                <h3 className="font-semibold mb-2">User Information</h3>
                <p>Customer Name: {order?.user?.firstname} {order?.user?.lastname}</p>
                <p>Email: {order?.user?.email}</p>
                <p>Phone: {order?.user?.phone}</p>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Shipment Information</h3>
                <p>Shipping Address: {order?.shipping_address?.street_address}, {order?.shipping_address?.city}, {order?.shipping_address?.state} {order?.shipping_address?.zip_code}</p>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Total</h3>
                <p><strong>SubTotal:</strong> ${order?.subtotal?.toFixed(2)}</p>
                <p><strong>Shipment:</strong> ${order?.shipping_cost?.toFixed(2)} ({order?.shipping_method?.name})</p>
                <p><strong>Order Total:</strong> ${order?.total?.toFixed(2)}</p>
            </div>
          <div>
            <h3 className="font-semibold mb-2">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="border p-3 rounded">
                  <p><strong>Product:</strong> {item.product_name}</p>
                  <p><strong>SKU:</strong> {item.sku}</p>
                  <p><strong>Size:</strong> {item.size}</p>
                  <p><strong>Absorbency:</strong> {item.absorbency_level}</p>
                  <p><strong>Quantity per Pack:</strong> {item.quantity_per_pack}</p>
                  <p><strong>Quantity Ordered:</strong> {item.quantity}</p>
                  <p><strong>Unit Price:</strong> {item.unit_price}</p>
                  <p><strong>Subtotal:</strong> {item.subtotal}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
