import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Phone, Mail, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <section className="py-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Lorem Ipsum is simply dummy text of the printing and type setting industry. Lorem Ipsum has been the
              industry's standard dummy.
            </p>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-primary/20 rounded-xl p-10 text-center hover:border-primary transition-colors shadow-sm">
              <Phone className="w-10 h-10 text-primary mx-auto mb-6" />
              <h3 className="font-bold text-xl mb-2 uppercase">Phone</h3>
              <p className="text-sm text-muted-foreground mb-4">Available 24/7</p>
              <a href="tel:18002360878" className="text-primary font-bold text-lg hover:underline">
                (1-800-236-0878)
              </a>
            </div>
            <div className="bg-white border-2 border-primary/20 rounded-xl p-10 text-center hover:border-primary transition-colors shadow-sm">
              <Mail className="w-10 h-10 text-primary mx-auto mb-6" />
              <h3 className="font-bold text-xl mb-2 uppercase">Email</h3>
              <p className="text-sm text-muted-foreground mb-4">Response within 24 hours</p>
              <a href="mailto:Support@logo.com" className="text-primary font-bold text-lg hover:underline">
                Support@logo.com
              </a>
            </div>
            <div className="bg-white border-2 border-primary/20 rounded-xl p-10 text-center hover:border-primary transition-colors shadow-sm">
              <MessageCircle className="w-10 h-10 text-primary mx-auto mb-6" />
              <h3 className="font-bold text-xl mb-2 uppercase">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">Instant assistance</p>
              <button className="text-primary font-bold text-lg hover:underline">Start Chat</button>
            </div>
          </div>
        </section>

        {/* Message Form */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto bg-muted/30 rounded-2xl p-8 md:p-16">
            <h2 className="font-serif text-3xl font-bold mb-10 uppercase tracking-tight">Send Us a Message</h2>
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider">
                    First Name <span className="text-primary">*</span>
                  </label>
                  <Input className="bg-white border-primary/20 h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider">
                    Last Name <span className="text-primary">*</span>
                  </label>
                  <Input className="bg-white border-primary/20 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">
                  Email Address <span className="text-primary">*</span>
                </label>
                <Input type="email" className="bg-white border-primary/20 h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">Phone Number (Optional)</label>
                <Input type="tel" className="bg-white border-primary/20 h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">
                  Subject <span className="text-primary">*</span>
                </label>
                <Select>
                  <SelectTrigger className="bg-white border-primary/20 h-12">
                    <SelectValue placeholder="Select a Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order Inquiry</SelectItem>
                    <SelectItem value="product">Product Question</SelectItem>
                    <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                    <SelectItem value="billing">Billing Inquiry</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">
                  Message <span className="text-primary">*</span>
                </label>
                <Textarea className="bg-white border-primary/20 min-h-[150px] resize-none" />
              </div>
              <div className="bg-white border border-primary/20 rounded-lg p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-bold uppercase text-primary">Privacy Note:</span> Your information is kept
                  strictly confidential. We will never share your personal details with third parties. All communication
                  are secure and discreet.
                </p>
              </div>
              <Button size="lg" className="px-16 h-14 text-base font-bold uppercase tracking-wider rounded-full">
                Send Message
              </Button>
            </form>
          </div>
        </section>

        {/* Extra Info */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-primary/20 rounded-xl p-12 shadow-sm">
              <h3 className="font-bold text-xl mb-6 uppercase border-b pb-4">Business Hours</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Phone Support:</span>
                  <span className="font-bold">24/7</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Live Chat:</span>
                  <span className="font-bold">24/7</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Email Response:</span>
                  <span className="font-bold">Within 24 hours</span>
                </div>
              </div>
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed pt-6 border-t">
                We're here for you around the clock because we understand that questions and concerns can arise at any
                time.
              </p>
            </div>
            <div className="bg-white border-2 border-primary/20 rounded-xl p-12 shadow-sm">
              <h3 className="font-bold text-xl mb-6 uppercase border-b pb-4">Mailing Address</h3>
              <div className="text-muted-foreground space-y-1">
                <p>Company Name, INC.</p>
                <p>123 Comfort Lane</p>
                <p>Suite 100</p>
                <p>Primary City, ST 12345</p>
              </div>
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed pt-6 border-t">
                Please note: For fastest service, we recommend contacting us by phone, email, or live chat rather than
                mail.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="bg-primary py-16 px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 uppercase">Looking for Quick Answers?</h2>
            <p className="mb-8 text-white/90 leading-relaxed">
              Many common questions are answered in our comprehensive FAQ section.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary hover:bg-white/90 border-white px-12"
              asChild
            >
              <Link href="/resources">Visit Resources & FAQs</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
