'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import AdminFaqFormModal from '@/components/admin/admin-faq-form-modal';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import { adminService } from '@/lib/services/admin-service';
import { extractList, isApiSuccess } from '@/lib/admin/extract';
import type { Faq, FaqInput } from '@/lib/services/types';
import { toast } from 'sonner';

// Static seed data — replaced by GET /api/faqs and the admin FAQ APIs (kept for reference).
// interface FAQ {
//     id: number;
//     question: string;
//     answer: string;
//     category: string;
// }
//
// const faqs: FAQ[] = [
//     { id: 1, question: 'What is included in the basic plan?', answer: 'The basic plan includes ...', category: 'Pricing' },
//     { id: 2, question: 'How can I cancel my subscription?', answer: 'You can cancel ...', category: 'Billing' },
//     { id: 3, question: 'Is there a free trial available?', answer: 'Yes! We offer a 14-day free trial ...', category: 'Getting Started' },
//     { id: 4, question: 'What payment methods do you accept?', answer: 'We accept all major credit cards ...', category: 'Billing' },
//     { id: 5, question: 'Do you offer customer support?', answer: 'Yes, we offer 24/7 customer support ...', category: 'Support' },
//     { id: 6, question: 'Can I export my data?', answer: 'Absolutely! You can export ...', category: 'Features' },
//     { id: 7, question: 'Is my data secure?', answer: 'Yes, we use industry-leading encryption ...', category: 'Security' },
//     { id: 8, question: 'Can I upgrade or downgrade my plan?', answer: 'Yes, you can change your plan ...', category: 'Billing' },
// ];

export default function FAQs() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const loadFaqs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adminService.getFaqs();
            if (!isApiSuccess(res)) {
                toast.error((res as { message?: string }).message ?? 'Failed to load FAQs');
                setFaqs([]);
                return;
            }
            setFaqs(extractList<Faq>(res));
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Failed to load FAQs');
            setFaqs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadFaqs();
    }, [loadFaqs]);

    const toggleExpanded = (id: number) => setExpandedId(expandedId === id ? null : id);

    const handleAdd = () => {
        setFormMode('create');
        setSelectedFaq(null);
        setIsFormOpen(true);
    };

    const handleEdit = (faq: Faq) => {
        setFormMode('edit');
        setSelectedFaq(faq);
        setIsFormOpen(true);
    };

    const handleConfirmDelete = (faq: Faq) => {
        setSelectedFaq(faq);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async (data: FaqInput) => {
        try {
            const res =
                formMode === 'edit' && selectedFaq
                    ? await adminService.editFaq(selectedFaq.id, data)
                    : await adminService.addFaq(data);
            if (isApiSuccess(res)) {
                toast.success(formMode === 'edit' ? 'FAQ updated' : 'FAQ created');
                await loadFaqs();
            } else {
                toast.error((res as { message?: string }).message ?? 'Save failed');
                throw new Error('save failed');
            }
        } catch (e: unknown) {
            if (e instanceof Error && e.message !== 'save failed') {
                toast.error(e.message);
            }
            throw e;
        }
    };

    const handleDelete = async () => {
        if (!selectedFaq) return;
        try {
            const res = await adminService.deleteFaq(selectedFaq.id);
            if (isApiSuccess(res)) {
                toast.success('FAQ deleted');
                setIsDeleteOpen(false);
                setSelectedFaq(null);
                await loadFaqs();
            } else {
                toast.error((res as { message?: string }).message ?? 'Delete failed');
            }
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : 'Delete failed');
        }
    };

    return (
        <div>
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="mb-4 text-3xl font-bold text-foreground">Frequently Asked Questions</h1>
                    <p className="text-lg text-muted-foreground">Manage the FAQs shown to your customers.</p>
                </div>
                <Button onClick={handleAdd} className="gap-2 bg-primary text-white hover:bg-primary/90">
                    <Plus size={18} />
                    Add FAQ
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : faqs.length === 0 ? (
                <Card className="bg-white">
                    <CardContent className="py-12 text-center text-muted-foreground">No FAQs yet. Add your first one.</CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <Card key={faq.id} className="bg-white">
                            <CardContent className="p-0">
                                <div className="flex items-center justify-between gap-2 p-6">
                                    <button
                                        onClick={() => toggleExpanded(faq.id)}
                                        className="flex flex-1 items-center justify-between text-left"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-foreground">{faq.title}</h3>
                                            {faq.is_active !== undefined && (
                                                <span
                                                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                        Number(faq.is_active)
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {Number(faq.is_active) ? 'Active' : 'Inactive'}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown
                                            size={24}
                                            className={`ml-4 flex-shrink-0 text-primary transition-transform ${
                                                expandedId === faq.id ? 'rotate-180 transform' : ''
                                            }`}
                                        />
                                    </button>
                                    <div className="flex flex-shrink-0 gap-1">
                                        <button
                                            onClick={() => handleEdit(faq)}
                                            className="rounded-lg p-2 text-yellow-600 transition-colors hover:bg-yellow-100"
                                            title="Edit FAQ"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleConfirmDelete(faq)}
                                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-100"
                                            title="Delete FAQ"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {expandedId === faq.id && (
                                    <div
                                        className="border-t bg-gray-50 px-6 py-4 leading-relaxed text-foreground [&_h1]:text-xl [&_h1]:font-bold"
                                        dangerouslySetInnerHTML={{ __html: faq.description ?? '' }}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Still Have Questions */}
            <Card className="mt-12 bg-primary text-white">
                <CardHeader>
                    <CardTitle className="text-white">Still have questions?</CardTitle>
                    <CardDescription className="text-green-50">
                        Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-green-50">
                        Contact our support team via email at support@company.com or use the live chat feature in the bottom
                        right corner.
                    </p>
                </CardContent>
            </Card>

            <AdminFaqFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                mode={formMode}
                faq={selectedFaq}
                onSubmit={handleSubmit}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                itemName={selectedFaq?.title || ''}
                itemType="faq"
            />
        </div>
    );
}
