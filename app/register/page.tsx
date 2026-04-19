"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Lock, Phone, Calendar, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/services/auth-service"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useGoogleLogin } from '@react-oauth/google'
import { getRoleAwareRedirectPath } from "@/lib/auth/role"

function RegisterContent() {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        dob: "",
        password: "",
        password_confirmation: "",
        gender: "male" as const,
        image: undefined as File | undefined,
    })
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const router = useRouter()
    const searchParams = useSearchParams()
    const { setAuth } = useAuth()

    const redirectPath = searchParams.get("redirect") || "/"

    const googleLogin = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                setIsLoading(true)
                const response = await authService.handleGoogleCallback({ code: codeResponse.code })
                if ((response.status || response.success) && response.data) {
                    setAuth(response.data.user, response.data.token)
                    toast.success("Signed up with Google!")
                    router.push(
                        getRoleAwareRedirectPath({
                            user: response.data.user,
                            defaultUserPath: "/",
                        }),
                    )
                } else {
                    toast.error(response.message || "Google signup failed")
                }
            } catch (error: any) {
                toast.error(error.message || "An error occurred during Google signup")
            } finally {
                setIsLoading(false)
            }
        },
        onError: () => toast.error("Google signup failed"),
        flow: 'auth-code',
    });

    const formatDob = (val: string) => {
        // Input: YYYY-MM-DD → Output: DD-MM-YYYY
        if (!val) return "";
        const [y, m, d] = val.split("-");
        if (!y || !m || !d) return val; // Fallback if format is unexpected
        return `${d}-${m}-${y}`;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, image: file })
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        try {
            const response = await authService.register({
                ...formData,
                dob: formatDob(formData.dob)
            })
            const isSuccess = response.status || response.success

            if (isSuccess) {
                toast.success("Account created successfully! Please sign in.")
                router.push("/login")
            } else {
                toast.error(response.message || "Registration failed")
            }
        } catch (error: any) {
            if (error.data?.errors) {
                setErrors(error.data.errors)
            }
            toast.error(error.message || "An error occurred during registration")
        } finally {
            setIsLoading(false)
        }
    }

    const renderError = (field: string) => {
        if (errors[field]) {
            return <p className="text-[10px] text-red-500 ml-4 mt-1 font-bold uppercase">{errors[field][0]}</p>
        }
        return null
    }

    return (
        <div className="w-full max-w-2xl space-y-8 bg-brand-light p-8 rounded-2xl border border-brand-green/10 shadow-sm">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-brand-green">Join Shaka</h1>
                <p className="text-zinc-500 text-sm">Create your account for a personalized experience.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center justify-center space-y-4 mb-6">
                    <div 
                        className="relative w-24 h-24 rounded-full border-2 border-dashed border-brand-green/30 flex items-center justify-center overflow-hidden bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group"
                        onClick={() => document.getElementById('image-upload')?.click()}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-zinc-400 group-hover:text-brand-green transition-colors">
                                <User className="h-8 w-8" />
                                <span className="text-[10px] font-bold uppercase mt-1">Photo</span>
                            </div>
                        )}
                        <input 
                            id="image-upload"
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="relative">
                            <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4", errors.firstname ? "text-red-500" : "text-zinc-400")} />
                            <Input
                                placeholder="First Name"
                                value={formData.firstname}
                                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                className={cn("pl-12 rounded-full h-12", errors.firstname ? "border-red-500" : "border-brand-green/20")}
                                required
                            />
                        </div>
                        {renderError("firstname")}
                    </div>
                    <div className="space-y-1">
                        <div className="relative">
                            <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4", errors.lastname ? "text-red-500" : "text-zinc-400")} />
                            <Input
                                placeholder="Last Name"
                                value={formData.lastname}
                                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                className={cn("pl-12 rounded-full h-12", errors.lastname ? "border-red-500" : "border-brand-green/20")}
                                required
                            />
                        </div>
                        {renderError("lastname")}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="relative">
                        <Mail className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4", errors.email ? "text-red-500" : "text-zinc-400")} />
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={cn("pl-12 rounded-full h-12", errors.email ? "border-red-500" : "border-brand-green/20")}
                            required
                        />
                    </div>
                    {renderError("email")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="relative">
                            <Phone className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4", errors.phone ? "text-red-500" : "text-zinc-400")} />
                            <Input
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className={cn("pl-12 rounded-full h-12", errors.phone ? "border-red-500" : "border-brand-green/20")}
                                required
                            />
                        </div>
                        {renderError("phone")}
                    </div>
                    <div className="space-y-1">
                        <div className="relative">
                            <Calendar className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4", errors.dob ? "text-red-500" : "text-zinc-400")} />
                            <Input
                                type="date"
                                placeholder="DOB (DD-MM-YYYY)"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                className={cn("pl-12 rounded-full h-12", errors.dob ? "border-red-500" : "border-brand-green/20")}
                                required
                            />
                        </div>
                        {renderError("dob")}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="relative">
                        <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4", errors.gender ? "text-red-500" : "text-zinc-400")} />
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                            className={cn(
                                "flex h-12 w-full rounded-full border bg-transparent pl-12 pr-4 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border-brand-green/20 outline-none appearance-none cursor-pointer",
                                errors.gender ? "border-red-500" : "border-brand-green/20"
                            )}
                            required
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                    {renderError("gender")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="relative">
                            <Lock className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4", errors.password ? "text-red-500" : "text-zinc-400")} />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={cn("pl-12 rounded-full h-12", errors.password ? "border-red-500" : "border-brand-green/20")}
                                required
                            />
                        </div>
                        {renderError("password")}
                    </div>
                    <div className="space-y-1">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                className="pl-12 rounded-full border-brand-green/20 h-12"
                                required
                            />
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-full py-6 font-bold uppercase tracking-widest transition-transform active:scale-[0.98]"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Account
                </Button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-200"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-brand-light px-2 text-zinc-500">Or continue with</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => googleLogin()}
                    disabled={isLoading}
                    className="w-full border-zinc-200 hover:bg-white text-zinc-600 rounded-full py-6 font-bold flex items-center justify-center gap-3 transition-all hover:shadow-md"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continue with Google
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-zinc-500">Already have an account? </span>
                <Link href={`/login${redirectPath !== '/' ? `?redirect=${redirectPath}` : ''}`} className="font-bold text-brand-green hover:underline">
                    Sign In
                </Link>
            </div>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <main className="flex-1 flex items-center justify-center px-4 py-20">
                <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-brand-green" />}>
                    <RegisterContent />
                </Suspense>
            </main>
        </div>
    )
}
