'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
];

const pieData = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 200 },
    { name: 'Product D', value: 100 },
];

const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d'];

const products = [
    { id: 1, name: 'Product 1', price: '$99.99', status: 'Active' },
    { id: 2, name: 'Product 2', price: '$149.99', status: 'Active' },
    { id: 3, name: 'Product 3', price: '$199.99', status: 'Inactive' },
];

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-white border-0 shadow-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">$12,847</div>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">1,205</div>
                            <p className="text-sm text-muted-foreground">Orders</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">342</div>
                            <p className="text-sm text-muted-foreground">Customers</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">89%</div>
                            <p className="text-sm text-muted-foreground">Growth</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
                {/* Bar Chart */}
                <Card className="bg-white border-0 shadow-md">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card className="bg-white border-0 shadow-md">
                    <CardHeader>
                        <CardTitle>Sales Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Products */}
            <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {products.map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                                <div>
                                    <p className="font-semibold text-foreground">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.price}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {product.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
