'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CustomerDetailModal from '@/components/customer-detail-modal';
import CustomerFormModal from '@/components/customer-form-modal';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import CustomerStats from '@/components/customers/customer-stats';
import CustomersTable from '@/components/customers/customer-table';
import { Customer } from '@/types';

const initialCustomers: Customer[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0101', company: 'Tech Corp', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0102', company: 'Design Inc', status: 'Active', joinDate: '2024-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0103', company: 'Business LLC', status: 'Inactive', joinDate: '2024-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '555-0104', company: 'Creative Studio', status: 'Active', joinDate: '2024-04-05' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '555-0105', company: 'Innovation Labs', status: 'Active', joinDate: '2024-05-12' },
];

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

    const filteredCustomers = customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCustomer = () => {
        setSelectedCustomer(null);
        setModalMode('create');
        setIsFormModalOpen(true);
    };

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDetailModalOpen(true);
    };

    const handleEditCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setModalMode('edit');
        setIsFormModalOpen(true);
    };

    const handleConfirmDelete = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedCustomer) {
            setCustomers(customers.filter((c) => c.id !== selectedCustomer.id));
            setSelectedCustomer(null);
        }
    };

    const handleFormSubmit = (customerData: Customer) => {
        if (modalMode === 'edit' && selectedCustomer) {
            setCustomers(customers.map((c) => (c.id === selectedCustomer.id ? customerData : c)));
        } else {
            setCustomers([...customers, customerData]);
        }
        setIsFormModalOpen(false);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Customers</h1>
                <Button
                    onClick={handleAddCustomer}
                    className="bg-primary hover:bg-primary/90 text-white gap-2 w-full sm:w-auto"
                >
                    <Plus size={18} />
                    Add Customer
                </Button>
            </div>

            <CustomerStats customers={customers} />

            <CustomersTable
                customers={filteredCustomers}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onView={handleViewCustomer}
                onEdit={handleEditCustomer}
                onDelete={handleConfirmDelete}
            />

            <CustomerFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                customer={selectedCustomer || undefined}
                mode={modalMode}
            />

            <CustomerDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                customer={selectedCustomer}
                onEdit={handleEditCustomer}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemName={selectedCustomer?.name || ''}
                itemType="customer"
            />
        </div>
    );
}
