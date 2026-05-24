'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Loader2 } from 'lucide-react';
import type { Faq, FaqInput } from '@/lib/services/types';

interface AdminFaqFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    faq?: Faq | null;
    onSubmit: (data: FaqInput) => Promise<void>;
}

export default function AdminFaqFormModal({ isOpen, onClose, mode, faq, onSubmit }: AdminFaqFormModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [images, setImages] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (faq && mode === 'edit') {
            setTitle(faq.title ?? '');
            setDescription(faq.description ?? '');
            setIsActive(faq.is_active === undefined ? true : Boolean(Number(faq.is_active)));
        } else {
            setTitle('');
            setDescription('');
            setIsActive(true);
        }
        setImages([]);
    }, [faq, mode, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit({ title, description, is_active: isActive, images });
            onClose();
        } catch {
            // Errors are surfaced via toast by the caller.
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-lg border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>{mode === 'create' ? 'Add FAQ' : 'Edit FAQ'}</CardTitle>
                    <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter FAQ question / title"
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Answer (HTML allowed)"
                                rows={6}
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Images (optional)</label>
                            <Input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="faq-is-active"
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 accent-primary"
                            />
                            <label htmlFor="faq-is-active" className="text-sm font-medium text-gray-700">
                                Active
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={submitting}>
                                {submitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : mode === 'create' ? (
                                    'Create'
                                ) : (
                                    'Update'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
