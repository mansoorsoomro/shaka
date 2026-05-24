'use client';

import { useCallback, useEffect, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import CustomerDetailModal from '@/components/customer-detail-modal';
// import CustomerFormModal from '@/components/customer-form-modal';
// import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import CustomerStats from '@/components/customers/customer-stats';
import CustomersTable from '@/components/customers/customer-table';
import { Customer } from '@/types';
import { adminService } from '@/lib/services/admin-service';
import { extractList, isApiSuccess } from '@/lib/admin/extract';
import type { User as ApiUser } from '@/lib/services/types';
import { toast } from 'sonner';

/** Map a raw API customer (user) into the UI Customer shape. */
function mapApiCustomer(u: ApiUser): Customer {
    const fullName = [u.firstname, u.lastname].filter(Boolean).join(' ').trim();
    const joinDate = typeof u.created_at === 'string' ? u.created_at.split('T')[0] : '';
    return {
        id: u.id,
        name: fullName || u.username || u.email,
        email: u.email,
        phone: u.phone ?? '',
        status: 'Active',
        joinDate,
    };
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    // const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    // const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const loadCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllCustomers();
            if (!isApiSuccess(res)) {
                toast.error((res as { message?: string }).message ?? 'Failed to load customers');
                setCustomers([]);
                return;
            }
            setCustomers(extractList<ApiUser>(res).map(mapApiCustomer));
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Failed to load customers');
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadCustomers();
    }, [loadCustomers]);

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDetailModalOpen(true);
    };

    // Customer create/edit/delete are not exposed by the API (only GET
    // /api/admin/customers exists), so those actions are not rendered.

    // const handleAddCustomer = () => {
    //     setSelectedCustomer(null);
    //     setModalMode('create');
    //     setIsFormModalOpen(true);
    // };

    // const handleEditCustomer = (customer: Customer) => {
    //     setSelectedCustomer(customer);
    //     setModalMode('edit');
    //     setIsFormModalOpen(true);
    // };

    // const handleConfirmDelete = (customer: Customer) => {
    //     setSelectedCustomer(customer);
    //     setIsDeleteModalOpen(true);
    // };

    // const handleDelete = () => {
    //     if (selectedCustomer) {
    //         setCustomers(customers.filter((c) => c.id !== selectedCustomer.id));
    //         setSelectedCustomer(null);
    //     }
    // };

    // const handleFormSubmit = (customerData: Customer) => {
    //     if (modalMode === 'edit' && selectedCustomer) {
    //         setCustomers(customers.map((c) => (c.id === selectedCustomer.id ? customerData : c)));
    //     } else {
    //         setCustomers([...customers, customerData]);
    //     }
    //     setIsFormModalOpen(false);
    // };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Customers</h1>
                {/* No create-customer API available — Add Customer disabled.
                <Button
                    onClick={handleAddCustomer}
                    className="bg-primary hover:bg-primary/90 text-white gap-2 w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Add Customer
                </Button> */}
            </div>

            <CustomerStats customers={customers} />

            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : (
                // onEdit/onDelete omitted — no customer mutation API, so those buttons are hidden.
                <CustomersTable
                    customers={filteredCustomers}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onView={handleViewCustomer}
                />
            )}

            {/* No create/edit API available — CustomerFormModal disabled.
            <CustomerFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                customer={selectedCustomer || undefined}
                mode={modalMode}
            /> */}

            {/* onEdit omitted — customer edit is not supported by the API. */}
            <CustomerDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                customer={selectedCustomer}
            />

            {/* No delete API available — DeleteConfirmationModal disabled.
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={selectedCustomer?.name || ''}
                itemType="customer"
            /> */}
        </div>
    );
}
