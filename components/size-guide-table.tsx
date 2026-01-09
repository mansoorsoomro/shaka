import { cn } from "@/lib/utils"

interface Size {
    name: string
    waist: string
    weight: string
}

const SIZES: Size[] = [
    { name: "Small", waist: "20-30", weight: "100-150" },
    { name: "Medium", waist: "28-36", weight: "100-150" },
    { name: "Large", waist: "28-36", weight: "100-150" },
    { name: "X-Large", waist: "28-36", weight: "100-150" },
    { name: "XX-Large", waist: "28-36", weight: "100-150" },
]

export function SizeGuideTable() {
    return (
        <div className="overflow-hidden border border-brand-green/30 rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-white border-b border-brand-green/30">
                    <tr>
                        <th className="px-4 py-3 font-bold text-zinc-900 border-r border-brand-green/30">Size</th>
                        <th className="px-4 py-3 font-bold text-zinc-900 border-r border-brand-green/30">Waist/Hip (Inches)</th>
                        <th className="px-4 py-3 font-bold text-zinc-900">Weight Range (Lbs)</th>
                    </tr>
                </thead>
                <tbody>
                    {SIZES.map((size, idx) => (
                        <tr key={size.name} className={cn(idx !== SIZES.length - 1 && "border-b border-brand-green/10")}>
                            <td className="px-4 py-3 font-medium border-r border-brand-green/30">{size.name}</td>
                            <td className="px-4 py-3 text-muted-foreground border-r border-brand-green/30">{size.waist}</td>
                            <td className="px-4 py-3 text-muted-foreground">{size.weight}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
