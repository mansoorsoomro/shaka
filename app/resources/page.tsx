"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { metaService } from "@/lib/services/meta-service"
import { extractList } from "@/lib/admin/extract"
import type { Faq } from "@/lib/services/types"

// Static seed data — replaced by GET /api/faqs (kept for reference).
// const faqs = [
//   { q: "Is my order shipped discreetly?", a: "Yes, absolutely. All orders are shipped in plain, unmarked brown boxes ..." },
//   { q: "How do I know what size to order?", a: "Each product page includes a detailed size guide ..." },
//   { q: "What's your return policy?", a: "We offer a 30-day money-back guarantee on all unopened packages ..." },
//   { q: "How long does shipping take?", a: "Orders placed before 2 PM EST ship the same day ..." },
//   { q: "Do you offer subscription services?", a: "Yes! Our Subscribe & Save program offers 15% off every order ..." },
// ]

export default function ResourcesPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await metaService.getFaqs()
        if (active) setFaqs(extractList<Faq>(res))
      } catch {
        if (active) setFaqs([])
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Resources & FAQs</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the
              industry's standard dummy.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-bold text-xl mb-8 border-b pb-4">General Questions</h2>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : faqs.length === 0 ? (
              <p className="text-muted-foreground">No FAQs available at the moment.</p>
            ) : (
              <>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={faq.id ?? i} value={`item-${i}`} className="bg-muted/30 rounded-lg px-6 border-none">
                      <AccordionTrigger className="font-bold hover:no-underline py-6">{faq.title}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                        <div dangerouslySetInnerHTML={{ __html: faq.description ?? "" }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {/* <h2 className="font-bold text-xl mt-16 mb-8 border-b pb-4">Product Questions</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.slice(0, 3).map((faq, i) => (
                    <AccordionItem key={faq.id ?? i} value={`prod-${i}`} className="bg-muted/30 rounded-lg px-6 border-none">
                      <AccordionTrigger className="font-bold hover:no-underline py-6">{faq.title}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                        <div dangerouslySetInnerHTML={{ __html: faq.description ?? "" }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion> */}
              </>
            )}
          </div>
        </section>

        {/* Educational Resources */}
        <section className="py-16 px-4 bg-accent/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-12 uppercase">Educational Resources</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white border-2 border-primary/20 rounded-lg p-8 hover:border-primary transition-colors"
                >
                  <h3 className="font-serif text-xl font-bold mb-4 text-primary">
                    {i % 2 === 0 ? "Understanding Incontinence" : "Exercises & Habits"}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the
                    industry's standard dummy.
                  </p>
                  <Button variant="link" className="text-primary p-0 h-auto font-bold uppercase tracking-wider">
                    Read More →
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Essential Care Tips */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-center mb-12 uppercase">Essential Care Tips</h2>
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                    {i}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 uppercase tracking-tight">Choose the Right Absorbency</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been
                      the industry's standard dummy. Lorem Ipsum has been the industry's standard dummy.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Questions CTA Banner */}
        <section className="bg-primary py-16 px-4 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 uppercase">Still Have Questions?</h2>
            <p className="mb-8 text-white/90">Our compassionate care specialists are available 24/7 to help</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8">
                Call Support
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 rounded-full px-8 bg-transparent"
              >
                Live Chat
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 rounded-full px-8 bg-transparent"
              >
                Email Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
