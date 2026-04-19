import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit2, Trash2 } from 'lucide-react';
import { User } from '@/types';

interface UsersTableProps {
    users: User[];
    onStatusToggle: (id: number) => void;
    onView: (user: User) => void;
    onDelete: (user: User) => void;
}

export default function UsersTable({ users, onStatusToggle, onView, onDelete }: UsersTableProps) {
    return (
        <Card className="bg-white border-0 shadow-md">
            <CardHeader className="border-b border-gray-200">
                <CardTitle>All Users</CardTitle>
                <CardDescription>{users.length} total users</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 overflow-x-auto">
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-max text-sm md:text-base">
                        <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-50">
                                <th className="text-left px-3 md:px-4 py-3 font-semibold text-foreground">Name</th>
                                <th className="text-left px-3 md:px-4 py-3 font-semibold text-foreground hidden sm:table-cell">Email</th>
                                <th className="text-left px-3 md:px-4 py-3 font-semibold text-foreground hidden md:table-cell">Role</th>
                                <th className="text-left px-3 md:px-4 py-3 font-semibold text-foreground">Status</th>
                                <th className="text-center px-3 md:px-4 py-3 font-semibold text-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-3 md:px-4 py-4 text-foreground font-medium">{user.name}</td>
                                    <td className="px-3 md:px-4 py-4 text-muted-foreground hidden sm:table-cell text-xs md:text-sm">{user.email}</td>
                                    <td className="px-3 md:px-4 py-4 hidden md:table-cell">
                                        <span className="px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold bg-primary/10 text-primary">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-3 md:px-4 py-4">
                                        <button
                                            onClick={() => onStatusToggle(user.id)}
                                            className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold cursor-pointer transition-colors ${user.status === 'Active'
                                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                        >
                                            {user.status}
                                        </button>
                                    </td>
                                    <td className="px-3 md:px-4 py-4">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => onView(user)}
                                                className="p-1.5 md:p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                                                title="View user details"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(user)}
                                                className="p-1.5 md:p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                title="Delete user"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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
