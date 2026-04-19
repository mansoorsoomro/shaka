import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Assuming you have shadcn table component, if not I will use standard HTML
import { Edit2, Trash2, Eye } from 'lucide-react';
import { Customer } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CustomersTableProps {
    customers: Customer[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
}

export default function CustomersTable({ customers, searchTerm, setSearchTerm, onView, onEdit, onDelete }: CustomersTableProps) {
    return (
        <Card className="bg-white">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-xl md:text-2xl">Customers List</CardTitle>
                    <CardDescription className="text-sm md:text-base">Manage all your customers</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full text-sm md:text-base"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Company</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Join Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-foreground font-medium">{customer.name}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{customer.email}</td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{customer.company}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${customer.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">{customer.joinDate}</td>
                                    <td className="px-6 py-4 text-sm flex gap-2">
                                        <button
                                            onClick={() => onView(customer)}
                                            className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                                        >
                                            <Eye size={18} className="text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(customer)}
                                            className="p-1 hover:bg-yellow-100 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} className="text-yellow-600" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(customer)}
                                            className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} className="text-red-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
