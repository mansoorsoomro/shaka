import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Review {
    name: string
    date: string
    rating: number
    title: string
    content: string
}

const INITIAL_REVIEWS: Review[] = [
    {
        name: "Sarah J.",
        date: "March 12, 2025",
        rating: 5,
        title: "Excellent protection!",
        content:
            "These diapers provide amazing absorption and keep me dry throughout the night. Very comfortable to wear under regular clothing.",
    },
    {
        name: "Michael R.",
        date: "February 28, 2025",
        rating: 4,
        title: "Good fit and discreet",
        content:
            "The sizing guide was accurate. They are very discreet under my pants and don't make any noise when I walk.",
    },
]

export function ProductReviews() {
    const [showReviewForm, setShowReviewForm] = useState(false)

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Customer Reviews</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-6 w-6 ${i < 4 ? "fill-current" : "text-zinc-300 fill-current"}`}
                                />
                            ))}
                        </div>
                        <p className="text-lg font-bold">4.2 out of 5</p>
                        <p className="text-muted-foreground text-sm">(342 Reviews)</p>
                    </div>
                </div>
                <Button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-brand-green hover:bg-brand-green/90 text-white rounded-full px-8 py-6 font-bold"
                >
                    {showReviewForm ? "Cancel Review" : "Add a Review"}
                </Button>
            </div>

            {showReviewForm && (
                <div className="bg-brand-light p-8 rounded-3xl border border-brand-green/10 space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <h3 className="text-xl font-bold">Write a Review</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Overall Rating</Label>
                            <div className="flex text-zinc-300 hover:text-yellow-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="h-8 w-8 cursor-pointer hover:fill-current" />
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Enter your name" className="rounded-xl border-zinc-200" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="rounded-xl border-zinc-200"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="review">Your Review</Label>
                            <Textarea
                                id="review"
                                placeholder="Share your experience with our product..."
                                className="rounded-xl border-zinc-200 min-h-[120px]"
                            />
                        </div>
                        <Button className="w-full md:w-auto bg-brand-green hover:bg-brand-green/90 text-white rounded-full px-12 py-6 font-bold">
                            Submit Review
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-8">
                {INITIAL_REVIEWS.map((review, i) => (
                    <div key={i} className="space-y-3 pb-8 border-b border-brand-green/5">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, starIdx) => (
                                        <Star
                                            key={starIdx}
                                            className={`h-4 w-4 ${starIdx < review.rating ? "fill-current" : "text-zinc-300 fill-current"}`}
                                        />
                                    ))}
                                </div>
                                <h4 className="font-bold">{review.title}</h4>
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
                        <p className="text-xs font-bold text-brand-green">— {review.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
