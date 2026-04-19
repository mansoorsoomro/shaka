'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQ[] = [
    {
        id: 1,
        question: 'What is included in the basic plan?',
        answer: 'The basic plan includes access to all core features, up to 10 projects, basic analytics, and email support. You can upgrade anytime to access premium features.',
        category: 'Pricing',
    },
    {
        id: 2,
        question: 'How can I cancel my subscription?',
        answer: 'You can cancel your subscription at any time from your account settings. Your access will continue until the end of the current billing period.',
        category: 'Billing',
    },
    {
        id: 3,
        question: 'Is there a free trial available?',
        answer: 'Yes! We offer a 14-day free trial for all our plans. No credit card required to get started.',
        category: 'Getting Started',
    },
    {
        id: 4,
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual plans.',
        category: 'Billing',
    },
    {
        id: 5,
        question: 'Do you offer customer support?',
        answer: 'Yes, we offer 24/7 customer support via email and live chat. Premium plans also include phone support and a dedicated account manager.',
        category: 'Support',
    },
    {
        id: 6,
        question: 'Can I export my data?',
        answer: 'Absolutely! You can export all your data at any time in CSV or JSON format from your dashboard settings.',
        category: 'Features',
    },
    {
        id: 7,
        question: 'Is my data secure?',
        answer: 'Yes, we use industry-leading encryption and security practices. All data is encrypted in transit and at rest. We are SOC 2 certified.',
        category: 'Security',
    },
    {
        id: 8,
        question: 'Can I upgrade or downgrade my plan?',
        answer: 'Yes, you can change your plan at any time. If you upgrade, you\'ll be charged the difference. If you downgrade, the credit will be applied to your next billing cycle.',
        category: 'Billing',
    },
];

export default function FAQs() {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = Array.from(new Set(faqs.map((faq) => faq.category)));
    const filteredFaqs = selectedCategory ? faqs.filter((faq) => faq.category === selectedCategory) : faqs;

    const toggleExpanded = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div>
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
                <p className="text-muted-foreground text-lg">
                    Find answers to common questions about our service, pricing, and support.
                </p>
            </div>

            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-3">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === null
                            ? 'bg-primary text-white'
                            : 'bg-white text-foreground border border-gray-200 hover:border-primary'
                        }`}
                >
                    All Categories
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                                ? 'bg-primary text-white'
                                : 'bg-white text-foreground border border-gray-200 hover:border-primary'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* FAQs List */}
            <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                    <Card key={faq.id} className="bg-white">
                        <CardContent className="p-0">
                            <button
                                onClick={() => toggleExpanded(faq.id)}
                                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                                    <p className="text-sm text-primary mt-1">{faq.category}</p>
                                </div>
                                <ChevronDown
                                    size={24}
                                    className={`text-primary flex-shrink-0 ml-4 transition-transform ${expandedId === faq.id ? 'transform rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {expandedId === faq.id && (
                                <div className="border-t px-6 py-4 bg-gray-50">
                                    <p className="text-foreground leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Still Have Questions */}
            <Card className="bg-primary text-white mt-12">
                <CardHeader>
                    <CardTitle className="text-white">Still have questions?</CardTitle>
                    <CardDescription className="text-green-50">
                        Can't find the answer you're looking for? Our team is here to help.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-green-50 mb-4">
                        Contact our support team via email at support@company.com or use the live chat feature in the bottom right corner.
                    </p>
                    <button className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Contact Support
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}
