'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

import { Order } from '../types';

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: Order) => void;
  order?: Order;
  mode?: 'create' | 'edit';
}

export default function OrderFormModal({ isOpen, onClose, onSubmit, order, mode = 'create' }: OrderFormModalProps) {
  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    items: '',
    status: 'pending' as Order['status'],
  });

  React.useEffect(() => {
    if (order && mode === 'edit') {
      setFormData({
        customer: order.customer,
        amount: order.amount.replace('$', ''),
        items: order.items.toString(),
        status: order.status,
      });
    } else {
      setFormData({
        customer: '',
        amount: '',
        items: '',
        status: 'pending',
      });
    }
  }, [order, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: order?.id || Date.now().toString(),
      orderNumber: order?.orderNumber || `ORD-${Math.floor(Math.random() * 10000)}`,
      customer: formData.customer,
      amount: formData.amount.startsWith('$') ? formData.amount : `$${formData.amount}`,
      status: formData.status,
      date: order?.date || new Date().toISOString().split('T')[0],
      items: parseInt(formData.items) || 0,
    };
    onSubmit(newOrder);
    setFormData({ customer: '', amount: '', items: '', status: 'pending' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <Card className="relative w-full max-w-md my-8 transform text-left shadow-xl transition-all sm:my-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>{mode === 'edit' ? 'Edit Order' : 'Create New Order'}</CardTitle>
              <CardDescription>{mode === 'edit' ? 'Update order details' : 'Add a new order to the system'}</CardDescription>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <Input
                  type="text"
                  name="customer"
                  placeholder="Enter customer name"
                  value={formData.customer}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Amount
                </label>
                <Input
                  type="text"
                  name="amount"
                  placeholder="Enter amount (e.g., 99.99)"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Items
                </label>
                <Input
                  type="number"
                  name="items"
                  placeholder="Enter number of items"
                  value={formData.items}
                  onChange={handleChange}
                  required
                  className="border-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {mode === 'edit' ? 'Update Order' : 'Create Order'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
