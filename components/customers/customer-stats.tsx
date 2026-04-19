import { Card, CardContent } from '@/components/ui/card';
import { Customer } from '@/types';

interface CustomerStatsProps {
    customers: Customer[];
}

export default function CustomerStats({ customers }: CustomerStatsProps) {
    const stats = [
        { label: 'Total Customers', value: customers.length, color: 'bg-blue-500' },
        { label: 'Active', value: customers.filter((c) => c.status === 'Active').length, color: 'bg-green-500' },
        { label: 'Inactive', value: customers.filter((c) => c.status === 'Inactive').length, color: 'bg-red-500' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            {stats.map((stat) => (
                <Card key={stat.label} className="bg-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} rounded-full p-2`}>
                                <div className="w-4 h-4"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
