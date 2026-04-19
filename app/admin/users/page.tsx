'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import UserFormModal from '@/components/user-form-modal';
import UserDetailModal from '@/components/user-detail-modal';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import UsersTable from '@/components/users/users-table';
import { User } from '@/types';

const initialUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2024-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive', joinDate: '2024-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'Active', joinDate: '2024-01-25' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Active', joinDate: '2024-04-05' },
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = () => {
        if (selectedUser) {
            setUsers(users.filter((user) => user.id !== selectedUser.id));
            setSelectedUser(null);
        }
    };

    const handleStatusToggle = (id: number) => {
        setUsers(
            users.map((user) =>
                user.id === id ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
            )
        );
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setModalMode('create');
        setIsFormModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setModalMode('edit');
        setIsFormModalOpen(true);
    };

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const handleConfirmDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = (userData: Omit<User, 'id' | 'joinDate'> & { id?: number }) => {
        if (modalMode === 'edit' && selectedUser) {
            setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, ...userData } : u)));
        } else {
            const newUser: User = {
                id: Math.max(0, ...users.map((u) => u.id)) + 1,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                status: userData.status as 'Active' | 'Inactive',
                joinDate: new Date().toISOString().split('T')[0],
            };
            setUsers([...users, newUser]);
        }
        setIsFormModalOpen(false);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">User Management</h1>
                <Button
                    onClick={handleAddUser}
                    className="bg-primary hover:bg-primary/90 text-white gap-2"
                >
                    <Plus size={18} />
                    Add User
                </Button>
            </div>

            {/* Search */}
            <Card className="bg-white border-0 shadow-md mb-6">
                <CardContent className="pt-6">
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-primary/20 focus:border-primary"
                    />
                </CardContent>
            </Card>

            <UsersTable
                users={filteredUsers}
                onStatusToggle={handleStatusToggle}
                onView={handleViewUser}
                onDelete={handleConfirmDelete}
            />

            <UserFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                user={selectedUser || undefined}
                mode={modalMode}
            />

            <UserDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                user={selectedUser}
                onEdit={handleEditUser}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={selectedUser?.name || ''}
                itemType="user"
            />
        </div>
    );
}
