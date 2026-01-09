import Image from "next/image"
import { Button } from "@/components/ui/button"

interface CategoryCardProps {
  title: string
  description: string
  image: string
  buttonText: string
  isDark?: boolean
  style?: React.CSSProperties
}

export function CategoryCard({
  title,
  description,
  image,
  buttonText,
  isDark = false,
  style,
}: CategoryCardProps) {
  return (
    <div
      className={`p-8 border-2 border-brand-green/30 rounded-2xl ${isDark ? "bg-white" : "bg-white"}`}
      style={style}
    >
      {/* Header with title/description and button */}
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-2 flex-1">
          <h3 className="text-3xl font-bold">{title}</h3>
          <p className="text-sm text-gray-600 max-w-xs">{description}</p>
        </div>
        <Button
          variant="default"
          className="bg-brand-green hover:bg-brand-green/90 text-white rounded-full px-6 py-2 text-sm whitespace-nowrap ml-4"
        >
          {buttonText}
        </Button>
      </div>

      {/* Product Image - centered */}
      <div className="relative w-full h-64 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
