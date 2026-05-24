'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { adminService } from '@/lib/services/admin-service';
import { extractData, isApiSuccess } from '@/lib/admin/extract';
import type { DashboardData } from '@/lib/services/types';
import { toast } from 'sonner';

// Static seed data — replaced by GET /api/admin/dashboard (kept for reference).
// const chartData = [ { name: 'Jan', value: 4000 }, ... ];
// const pieData = [ { name: 'Product A', value: 400 }, ... ];
// const products = [ { id: 1, name: 'Product 1', price: '$99.99', status: 'Active' }, ... ];

const COLORS = ['#22c55e', '#3b82f6', '#6366f1', '#16a34a', '#ef4444'];

type ChartPoint = { name: string; value: number };
type TopProduct = { id: number; name: string; price: string; status: string };

function num(value: unknown): number | undefined {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value);
    return undefined;
}

function formatCurrency(value: number | undefined): string {
    if (value === undefined) return '—';
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getDashboard();
            if (!isApiSuccess(res)) {
                toast.error((res as { message?: string }).message ?? 'Failed to load dashboard');
                setData(null);
                return;
            }
            setData(extractData<DashboardData>(res));
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Failed to load dashboard');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadDashboard();
    }, [loadDashboard]);

    const kpis = data?.kpis;

    const statCards = [
        { label: 'Total Revenue', kpi: kpis?.total_revenue, format: formatCurrency },
        { label: 'Total Orders', kpi: kpis?.total_orders, format: (v: number | undefined) => (v ?? '—').toString() },
        { label: 'Total Customers', kpi: kpis?.total_customers, format: (v: number | undefined) => (v ?? '—').toString() },
        { label: 'Avg Order Value', kpi: kpis?.avg_order_value, format: formatCurrency },
    ];

    // revenue_trend item shape is undocumented — read common keys defensively.
    const revenueTrend: ChartPoint[] = (data?.revenue_trend ?? []).map((d) => ({
        name: String(d.date ?? d.month ?? d.label ?? d.period ?? d.day ?? ''),
        value: num(d.total) ?? num(d.revenue) ?? num(d.value) ?? 0,
    }));

    // Orders grouped by status — drives the distribution pie chart.
    const orderStatus: ChartPoint[] = (data?.order_status ?? []).map((d) => ({
        name: String(d.status ?? ''),
        value: num(d.count) ?? 0,
    }));
    const orderStatusHasData = orderStatus.some((s) => s.value > 0);

    const topProducts: TopProduct[] = (data?.top_products ?? []).map((p, i) => ({
        id: Number(p.id ?? i),
        name: String(p.name ?? p.product_name ?? p.title ?? ''),
        price:
            num(p.price) !== undefined
                ? formatCurrency(num(p.price))
                : num(p.total) !== undefined
                  ? formatCurrency(num(p.total))
                  : String(p.price ?? ''),
        status: String(p.status ?? 'Active'),
    }));

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => {
                    const value = card.kpi?.value;
                    const change = card.kpi?.change ?? null;
                    return (
                        <Card key={card.label} className="bg-white border-0 shadow-md">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{card.format(value)}</div>
                                    <p className="text-sm text-muted-foreground">{card.label}</p>
                                    {change !== null && (
                                        <p
                                            className={`mt-1 flex items-center justify-center gap-1 text-xs font-medium ${
                                                change >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}
                                        >
                                            {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {Math.abs(change)}%
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
                {/* Revenue Trend */}
                <Card className="bg-white border-0 shadow-md">
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {revenueTrend.length === 0 ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">No revenue data yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Orders by Status */}
                <Card className="bg-white border-0 shadow-md">
                    <CardHeader>
                        <CardTitle>Orders by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        {!orderStatusHasData ? (
                            <p className="py-12 text-center text-sm text-muted-foreground">No orders yet</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={orderStatus.filter((s) => s.value > 0)}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {orderStatus
                                            .filter((s) => s.value > 0)
                                            .map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Status Summary (counts + totals) */}
            {(data?.order_status?.length ?? 0) > 0 && (
                <Card className="bg-white border-0 shadow-md mb-8">
                    <CardHeader>
                        <CardTitle>Order Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                            {(data?.order_status ?? []).map((s) => (
                                <div key={s.status} className="rounded-lg bg-primary/10 p-4 text-center">
                                    <p className="text-2xl font-bold text-primary">{num(s.count) ?? 0}</p>
                                    <p className="text-xs capitalize text-muted-foreground">{s.status}</p>
                                    <p className="mt-1 text-xs font-medium text-foreground">{formatCurrency(num(s.total))}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Top Products */}
            <Card className="bg-white border-0 shadow-md">
                <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                    {topProducts.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">No product sales data yet</p>
                    ) : (
                        <div className="space-y-2">
                            {topProducts.map((product) => (
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
