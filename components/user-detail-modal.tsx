'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onEdit: (user: User) => void;
}

export default function UserDetailModal({ isOpen, onClose, user, onEdit }: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>User Details</CardTitle>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-semibold text-foreground">{user.name}</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold text-foreground">{user.email}</p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-muted-foreground">Role</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                {user.role}
              </span>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <p className="text-sm text-muted-foreground">Status</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  user.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {user.status}
              </span>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Join Date</p>
              <p className="font-semibold text-foreground">{user.joinDate}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onEdit(user);
                onClose();
              }}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Edit User
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
