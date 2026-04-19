'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onEdit?: (customer: Customer) => void;
}

export default function CustomerDetailModal({ isOpen, onClose, customer, onEdit }: CustomerDetailModalProps) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Customer Details</CardTitle>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="text-lg font-semibold text-foreground">{customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="text-lg font-semibold text-foreground">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone</p>
              <p className="text-lg font-semibold text-foreground">{customer.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Company</p>
              <p className="text-lg font-semibold text-foreground">{customer.company}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  customer.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {customer.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Join Date</p>
              <p className="text-lg font-semibold text-foreground">{customer.joinDate}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={() => {
                if (onEdit && customer) {
                  onEdit(customer);
                  onClose();
                }
              }}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              Edit Customer
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
