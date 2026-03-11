"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    color: string;
    _count: { news: number };
}

const COLORS = [
    "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16",
];

export default function KategorilerPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState(COLORS[0]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function fetchCategories() {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
        setLoading(false);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchCategories(); }, []);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!newName.trim()) return;
        setSaving(true);
        setError("");
        const res = await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName, color: newColor }),
        });
        setSaving(false);
        if (res.ok) {
            setNewName("");
            fetchCategories();
        } else {
            const d = await res.json();
            setError(d.error || "Bir hata oluştu");
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Kategori Yönetimi
                </h1>
                <p className="text-gray-500 text-sm mt-1">Haber kategorilerini ekleyin ve yönetin</p>
            </div>

            {/* Add form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <h2 className="font-semibold text-gray-800 mb-4">Yeni Kategori Ekle</h2>
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleAdd} className="flex items-end gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Kategori Adı
                        </label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="örn: Gündem"
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Renk</label>
                        <div className="flex gap-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setNewColor(color)}
                                    className={`w-8 h-8 rounded-full transition-transform ${newColor === color ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : ""
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#1a2744] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#243561] transition-colors disabled:opacity-50"
                    >
                        <Plus size={15} />
                        {saving ? "Ekleniyor..." : "Ekle"}
                    </button>
                </form>
            </div>

            {/* Categories grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
                    <RefreshCw size={18} className="animate-spin" /> Yükleniyor...
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xl font-bold"
                                style={{ backgroundColor: cat.color }}
                            >
                                {cat.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{cat.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">/{cat.slug}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {cat._count.news} haber
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
