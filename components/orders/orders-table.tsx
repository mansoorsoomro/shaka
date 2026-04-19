import { Card, CardContent } from '@/components/ui/card';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Order } from '@/types';

interface OrdersTableProps {
    orders: Order[];
    getStatusColor: (status: string) => string;
    onView: (order: Order) => void;
    onEdit: (order: Order) => void;
    onDelete: (order: Order) => void;
}

export default function OrdersTable({ orders, getStatusColor, onView, onEdit, onDelete }: OrdersTableProps) {
    return (
        <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-max text-xs md:text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b-2 border-gray-200">
                                <th className="px-3 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700">Order #</th>
                                <th className="px-3 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 hidden sm:table-cell">Customer</th>
                                <th className="px-3 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700">Amount</th>
                                <th className="px-3 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 hidden md:table-cell">Items</th>
                                <th className="px-3 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 hidden lg:table-cell">Date</th>
                                <th className="px-3 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700">Status</th>
                                <th className="px-3 md:px-6 py-3 md:py-4 text-center font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-3 md:px-6 py-3 md:py-4 font-medium text-gray-900">{order.orderNumber}</td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 hidden sm:table-cell">{order.customer}</td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 font-semibold text-gray-900">{order.amount}</td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 hidden md:table-cell">{order.items}</td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 hidden lg:table-cell">{order.date}</td>
                                    <td className="px-3 md:px-6 py-3 md:py-4">
                                        <span
                                            className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-3 md:px-6 py-3 md:py-4 flex gap-1 justify-center">
                                        <button
                                            onClick={() => onView(order)}
                                            className="p-1.5 md:p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                        >
                                            <Eye size={16} className="text-blue-600" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(order)}
                                            className="p-1.5 md:p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} className="text-yellow-600" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(order)}
                                            className="p-1.5 md:p-2 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} className="text-red-600" />
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
