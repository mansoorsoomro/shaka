import { Card, CardContent } from '@/components/ui/card';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { Product } from '@/types';

interface ProductGridProps {
    products: Product[];
    getStatusColor: (status: string) => string;
    getStockStatus: (stock: number) => string;
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export default function ProductGrid({ products, getStatusColor, getStockStatus, onView, onEdit, onDelete }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
                <Card key={product.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                <p className="text-sm text-gray-500">{product.sku}</p>
                            </div>
                            <span
                                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                                    product.status
                                )}`}
                            >
                                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                        </div>

                        <div className="mb-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Price</span>
                                <span className="font-semibold text-gray-900">{product.price}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Category</span>
                                <span className="font-semibold text-gray-900">{product.category}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Rating</span>
                                <span className="font-semibold text-yellow-500">★ {product.rating}</span>
                            </div>
                        </div>

                        <div className="mb-4 pb-4 border-t">
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-sm text-gray-600">Stock</span>
                                <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${getStockStatus(product.stock)}`}
                                >
                                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onView(product)}
                                className="flex-1 p-2 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Eye size={16} className="text-blue-600" />
                                <span className="text-sm font-medium text-blue-600">View</span>
                            </button>
                            <button
                                onClick={() => onEdit(product)}
                                className="flex-1 p-2 hover:bg-yellow-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit2 size={16} className="text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-600">Edit</span>
                            </button>
                            <button
                                onClick={() => onDelete(product)}
                                className="flex-1 p-2 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} className="text-red-600" />
                                <span className="text-sm font-medium text-red-600">Delete</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
