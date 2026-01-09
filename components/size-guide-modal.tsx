import { X, Ruler, Info } from "lucide-react"
import { SizeGuideTable } from "./size-guide-table"

interface SizeGuideModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-xl relative overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <Ruler className="h-6 w-6 text-zinc-900" />
                        <h2 className="text-xl font-bold uppercase tracking-tight">Size & Fit Guide</h2>
                    </div>

                    <div className="bg-brand-green/5 border border-brand-green/30 rounded-2xl p-6 space-y-2">
                        <div className="flex items-center gap-2 text-brand-green">
                            <Info className="h-4 w-4" />
                            <p className="font-bold text-sm">Finding Your Perfect Fit</p>
                        </div>
                        <p className="text-[10px] text-brand-green/80 leading-relaxed">
                            A proper fit is essential for comfort and protection. Take a moment to measure correctly using our guide
                            below. If you&apos;re between sizes, we recommend sizing up for maximum comfort and security.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-sm">Size Guide</h3>
                        <SizeGuideTable />
                    </div>
                </div>
            </div>
        </div>
    )
}
