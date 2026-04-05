"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { authService } from "@/lib/services/auth-service"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useGoogleLogin } from '@react-oauth/google'

function LoginContent() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<{ email?: string[]; password?: string[]; general?: string }>({})
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
                    toast.success("Logged in with Google!")
                    router.push("/")
                } else {
                    toast.error(response.message || "Google login failed")
                }
            } catch (error: any) {
                toast.error(error.message || "An error occurred during Google login")
            } finally {
                setIsLoading(false)
            }
        },
        onError: () => toast.error("Google login failed"),
        flow: 'auth-code',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        try {
            const response = await authService.login({ email, password })
            const isSuccess = response.status || response.success

            if (isSuccess && response.data) {
                setAuth(response.data.user, response.data.token)
                toast.success(response.message || "Logged in successfully")
                router.push("/")
            } else {
                setErrors({ general: response.message || "Login failed" })
                toast.error(response.message || "Login failed")
            }
        } catch (error: any) {
            if (error.data?.errors) {
                setErrors(error.data.errors)
            } else {
                setErrors({ general: error.message || "An error occurred during login" })
            }
            toast.error(error.message || "An error occurred during login")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-brand-light p-8 rounded-2xl border border-brand-green/10 shadow-sm">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold uppercase tracking-tighter text-brand-green">Welcome Back</h1>
                <p className="text-zinc-500 text-sm">Please enter your details to sign in.</p>
            </div>

            {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-xs animate-shake">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                    <div className="relative">
                        <Mail className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                            errors.email ? "text-red-500" : "text-zinc-400"
                        )} />
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cn(
                                "pl-12 rounded-full h-12 transition-all",
                                errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-brand-green/20 focus-visible:ring-brand-green"
                            )}
                            required
                        />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-500 ml-4 font-bold uppercase">{errors.email[0]}</p>}
                </div>

                <div className="space-y-1">
                    <div className="relative">
                        <Lock className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                            errors.password ? "text-red-500" : "text-zinc-400"
                        )} />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cn(
                                "pl-12 rounded-full h-12 transition-all",
                                errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-brand-green/20 focus-visible:ring-brand-green"
                            )}
                            required
                        />
                    </div>
                    {errors.password && <p className="text-[10px] text-red-500 ml-4 font-bold uppercase">{errors.password[0]}</p>}
                </div>

                <div className="flex items-center justify-end">
                    <Link href="/forgot-password" title="Forgot Password" className="text-xs font-bold text-brand-green hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-green hover:bg-brand-green/90 text-white rounded-full py-6 font-bold uppercase tracking-widest transition-transform active:scale-[0.98]"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign In
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
                <span className="text-zinc-500">Don't have an account? </span>
                <Link href={`/register${redirectPath !== '/' ? `?redirect=${redirectPath}` : ''}`} className="font-bold text-brand-green hover:underline">
                    Sign Up
                </Link>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <main className="flex-1 flex items-center justify-center px-4 py-20">
                <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-brand-green" />}>
                    <LoginContent />
                </Suspense>
            </main>
        </div>
    )
}
