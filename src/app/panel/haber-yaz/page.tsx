"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Send, Save, ImageIcon, FileText, Globe } from "lucide-react";

interface Category {
    id: string;
    name: string;
    color: string;
}

export default function HaberYazPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const user = session?.user as any;
    const isEditorOrAdmin = user?.role === "EDITOR" || user?.role === "ADMIN";

    const [form, setForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        coverImage: "",
        categoryId: "",
        // DRAFT = save as draft, PENDING = submit to editor, PUBLISHED = direct publish (editor/admin only)
        submitType: "PENDING" as "DRAFT" | "PENDING" | "PUBLISHED",
    });

    useEffect(() => {
        fetch("/api/categories")
            .then((r) => r.json())
            .then(setCategories);
    }, []);

    function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(submitType: "DRAFT" | "PENDING" | "PUBLISHED") {
        setError("");
        setLoading(true);

        // For DRAFT, only title and category are required
        if (!form.title.trim()) {
            setError("Başlık alanı zorunludur.");
            setLoading(false);
            return;
        }
        if (!form.categoryId) {
            setError("Kategori seçimi zorunludur.");
            setLoading(false);
            return;
        }
        if (submitType !== "DRAFT" && (!form.excerpt.trim() || !form.content || form.content === "<p></p>")) {
            setError("Onaya göndermek için özet ve içerik alanları doldurulmalıdır.");
            setLoading(false);
            return;
        }

        const res = await fetch("/api/news", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: form.title,
                excerpt: form.excerpt || form.title,
                content: form.content || "<p></p>",
                coverImage: form.coverImage || null,
                categoryId: form.categoryId,
                status: submitType,
            }),
        });

        setLoading(false);

        if (res.ok) {
            const messages: Record<string, string> = {
                DRAFT: "✅ Haber taslak olarak kaydedildi!",
                PENDING: "✅ Haber onaya gönderildi! Editör inceleyecek.",
                PUBLISHED: "✅ Haber yayınlandı!",
            };
            setSuccess(messages[submitType]);
            setTimeout(() => router.push("/panel/haberlerim"), 1800);
        } else {
            const data = await res.json();
            setError(data.error || "Bir hata oluştu.");
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Haber Yaz ✍️
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    Haberi taslak olarak kaydedebilir veya editör onayına gönderebilirsiniz.
                </p>
            </div>

            {/* Status indicator */}
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl mb-6 text-sm font-medium">
                    {success}
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl mb-6 text-sm">
                    ❌ {error}
                </div>
            )}

            <div className="space-y-6">
                {/* Meta card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
                    <h2 className="font-semibold text-gray-800 border-b pb-3 text-sm uppercase tracking-wider text-gray-500">
                        Haber Bilgileri
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Başlık <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleField}
                                placeholder="Haberin dikkat çekici başlığı..."
                                maxLength={200}
                                className="input-field text-base font-medium"
                            />
                            <p className="text-xs text-gray-400 mt-1">{form.title.length}/200</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Kategori <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleField}
                                className="input-field"
                            >
                                <option value="">Kategori seçin...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Kapak Fotoğrafı URL
                            </label>
                            <div className="relative">
                                <ImageIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="url"
                                    name="coverImage"
                                    value={form.coverImage}
                                    onChange={handleField}
                                    placeholder="https://..."
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cover preview */}
                    {form.coverImage && (
                        <div className="rounded-xl overflow-hidden h-40">
                            <img
                                src={form.coverImage}
                                alt="Kapak önizleme"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Kısa Özet
                            <span className="text-gray-400 font-normal ml-1">(onaya göndermek için zorunlu)</span>
                        </label>
                        <textarea
                            name="excerpt"
                            value={form.excerpt}
                            onChange={handleField}
                            placeholder="Haberin 2-3 cümlelik özeti..."
                            rows={2}
                            maxLength={500}
                            className="input-field resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/500</p>
                    </div>
                </div>

                {/* Rich Text Editor */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 pt-5 pb-3 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wider text-gray-500">
                            Haber İçeriği
                        </h2>
                    </div>

                    {/* Custom TipTap styles */}
                    <style>{`
            .ProseMirror p.is-editor-empty:first-child::before {
              content: attr(data-placeholder);
              float: left;
              color: #9ca3af;
              pointer-events: none;
              height: 0;
            }
            .ProseMirror:focus { outline: none; }
            .ProseMirror h1 { font-size: 1.75rem; font-weight: 700; font-family: 'Playfair Display', serif; margin: 1.5rem 0 0.75rem; }
            .ProseMirror h2 { font-size: 1.4rem; font-weight: 700; font-family: 'Playfair Display', serif; margin: 1.25rem 0 0.5rem; }
            .ProseMirror h3 { font-size: 1.15rem; font-weight: 700; margin: 1rem 0 0.5rem; }
            .ProseMirror p { margin-bottom: 0.9rem; line-height: 1.75; color: #374151; }
            .ProseMirror ul { list-style: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
            .ProseMirror ol { list-style: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
            .ProseMirror li { margin-bottom: 0.25rem; }
            .ProseMirror blockquote { border-left: 4px solid #c8102e; padding-left: 1rem; color: #6b7280; font-style: italic; margin: 1rem 0; }
            .ProseMirror code { background: #f3f4f6; padding: 0.15rem 0.35rem; border-radius: 4px; font-size: 0.9em; font-family: monospace; }
            .ProseMirror hr { border: none; border-top: 2px solid #e5e7eb; margin: 1.5rem 0; }
            .ProseMirror img { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; }
            .ProseMirror a { color: #c8102e; text-decoration: underline; }
          `}</style>

                    <RichTextEditor
                        value={form.content}
                        onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                        placeholder="Haberin tam içeriğini buraya yazın... Yeni paragrafa geçmek için Enter'a basın."
                    />

                    <div className="px-6 py-2 border-t border-gray-100 flex justify-end">
                        <span className="text-xs text-gray-400">
                            {form.content.replace(/<[^>]*>/g, "").length} karakter
                        </span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h2 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wider text-gray-500">
                        Yayınlama Durumu
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Draft */}
                        <button
                            type="button"
                            onClick={() => handleSubmit("DRAFT")}
                            disabled={loading}
                            className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group text-left disabled:opacity-50"
                        >
                            <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                                <Save size={18} className="text-gray-600 group-hover:text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Taslak Kaydet</p>
                                <p className="text-xs text-gray-400 mt-0.5">Henüz yayınlanmaz</p>
                            </div>
                        </button>

                        {/* Submit to editor */}
                        {(!isEditorOrAdmin) && (
                            <button
                                type="button"
                                onClick={() => handleSubmit("PENDING")}
                                disabled={loading}
                                className="flex items-center gap-3 p-4 rounded-xl border-2 border-amber-200 hover:border-amber-400 bg-amber-50 hover:bg-amber-100 transition-all group text-left disabled:opacity-50"
                            >
                                <div className="w-10 h-10 bg-amber-100 group-hover:bg-amber-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                                    <Send size={18} className="text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Onaya Gönder</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Editör onaylar ve yayınlar</p>
                                </div>
                            </button>
                        )}

                        {/* Direct publish (EDITOR/ADMIN only) */}
                        {isEditorOrAdmin && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit("PENDING")}
                                    disabled={loading}
                                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-amber-200 hover:border-amber-400 bg-amber-50 hover:bg-amber-100 transition-all group text-left disabled:opacity-50"
                                >
                                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Send size={18} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Onay Kuyruğu</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Pending olarak ekle</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleSubmit("PUBLISHED")}
                                    disabled={loading}
                                    className="flex items-center gap-3 p-4 rounded-xl border-2 border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-500 transition-all group text-left disabled:opacity-50"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Globe size={18} className="text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">Hemen Yayınla</p>
                                        <p className="text-xs text-gray-400 mt-0.5">Anında siteye çıkar</p>
                                    </div>
                                </button>
                            </>
                        )}
                    </div>

                    {loading && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                            <svg className="animate-spin h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Kaydediliyor...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
