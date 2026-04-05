"use client"

import { useAuth } from "@/hooks/use-auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { User, Mail, Phone, Calendar, ShieldCheck, MapPin, LogOut } from "lucide-react"

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login")
        }
    }, [isAuthenticated, router])

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    if (!isAuthenticated || !user) return null

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 pt-28">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between pb-8 border-b border-brand-green/10">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green border-4 border-white shadow-xl">
                                <User size={48} />
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-3xl font-bold uppercase tracking-tighter text-brand-green">
                                    {user.firstname} {user.lastname}
                                </h1>
                                <p className="text-zinc-500 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" /> Verified Customer
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-full font-bold uppercase text-xs hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-400">Personal Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-brand-light rounded-2xl border border-brand-green/5">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-green shadow-sm">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Email Address</p>
                                        <p className="font-bold text-zinc-700">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-brand-light rounded-2xl border border-brand-green/5">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-green shadow-sm">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Phone Number</p>
                                        <p className="font-bold text-zinc-700">{user.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-brand-light rounded-2xl border border-brand-green/5">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-green shadow-sm">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Date of Birth</p>
                                        <p className="font-bold text-zinc-700">{user.dob}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-400">Shipping History</h2>
                            <div className="p-8 bg-brand-light rounded-2xl border border-dashed border-brand-green/20 flex flex-col items-center justify-center text-center space-y-4">
                                <MapPin className="h-12 w-12 text-zinc-300" />
                                <p className="text-sm text-zinc-500 italic max-w-xs">
                                    Your primary shipping address and history will appear here after your first delivered order.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
