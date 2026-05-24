'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import UserFormModal from '@/components/user-form-modal';
import UserDetailModal from '@/components/user-detail-modal';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import UsersTable from '@/components/users/users-table';
import { User } from '@/types';
import { adminService } from '@/lib/services/admin-service';
import { extractList, isApiSuccess } from '@/lib/admin/extract';
import type { User as ApiUser } from '@/lib/services/types';
import { toast } from 'sonner';

// Static seed data — replaced by GET /api/admin/users (kept for reference).
// const initialUsers: User[] = [
//     { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2024-02-20' },
//     { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive', joinDate: '2024-03-10' },
//     { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'Active', joinDate: '2024-01-25' },
//     { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Active', joinDate: '2024-04-05' },
// ];

/** Map a raw API user into the UI shape used by the table/modals. */
function mapApiUser(u: ApiUser): User {
    const fullName = [u.firstname, u.lastname].filter(Boolean).join(' ').trim();
    const name = fullName || u.username || u.email;

    let role = 'User';
    if (typeof u.role === 'string') role = u.role;
    else if (u.role && typeof u.role === 'object' && 'name' in u.role) role = String(u.role.name);
    else if (Array.isArray(u.roles) && u.roles.length) {
        const first = u.roles[0];
        role = typeof first === 'string' ? first : String(first?.name ?? 'User');
    } else if (u.is_admin === true || u.is_admin === 1 || u.is_admin === '1') {
        role = 'Admin';
    }

    const joinDate = typeof u.created_at === 'string' ? u.created_at.split('T')[0] : '';

    return {
        id: u.id,
        name,
        email: u.email,
        role,
        // API does not expose an explicit active/inactive flag for users.
        status: 'Active',
        joinDate,
        phone: u.phone ?? '',
    };
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllUsers();
            if (!isApiSuccess(res)) {
                toast.error((res as { message?: string }).message ?? 'Failed to load users');
                setUsers([]);
                return;
            }
            setUsers(extractList<ApiUser>(res).map(mapApiUser));
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadUsers();
    }, [loadUsers]);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            const res = await adminService.deleteUser(selectedUser.id);
            if (isApiSuccess(res)) {
                toast.success('User deleted');
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
                await loadUsers();
            } else {
                toast.error((res as { message?: string }).message ?? 'Delete failed');
            }
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Delete failed');
        }
    };

    // User status has no backing API field, so the toggle is a no-op for now.
    const handleStatusToggle = (_id: number) => {
        toast.info('User status is managed by the backend and cannot be toggled here.');
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

    const handleFormSubmit = async (userData: Omit<User, 'id' | 'joinDate'> & { id?: number }) => {
        // Only edit is backed by an API (POST /api/admin/users/{id}); there is
        // no create-user endpoint in the collection.
        if (modalMode !== 'edit' || !selectedUser) {
            toast.error('Creating users is not supported by the API.');
            return;
        }
        try {
            const [firstname, ...rest] = (userData.name ?? '').trim().split(' ');
            const formData = new FormData();
            formData.append('firstname', firstname || '');
            formData.append('lastname', rest.join(' '));
            if (userData.phone) formData.append('phone', userData.phone);

            const res = await adminService.editUser(selectedUser.id, formData);
            if (isApiSuccess(res)) {
                toast.success('User updated');
                setIsFormModalOpen(false);
                await loadUsers();
            } else {
                toast.error((res as { message?: string }).message ?? 'Update failed');
            }
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Update failed');
        }
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

            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : (
                <UsersTable
                    users={filteredUsers}
                    onStatusToggle={handleStatusToggle}
                    onView={handleViewUser}
                    onDelete={handleConfirmDelete}
                />
            )}

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
