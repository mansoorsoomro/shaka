import Image from "next/image"
import { Button } from "@/components/ui/button"

interface FeatureSectionProps {
    title: string
    description: string
    image: string
    buttonText: string
    reverse?: boolean
    bgColor?: string
}

export function FeatureSection({
    title,
    description,
    image,
    buttonText,
    reverse = false,
    bgColor = "bg-white",
}: FeatureSectionProps) {
    return (
        <section className={`w-full ${bgColor}`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[500px]`}>
                <div className={`relative h-[400px] md:h-auto ${reverse ? "md:order-last" : ""}`}>
                    <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
                </div>
                <div className="flex items-center justify-center p-8 md:p-16 lg:p-24">
                    <div className="space-y-6 max-w-md">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">{title}</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
                        <Button className="bg-brand-green hover:bg-brand-green/90 text-white rounded-full px-8 h-12 text-base font-semibold">
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
