"use client";

import { useState } from "react";
import { NewsCard } from "./NewsCard";

interface DistrictCategory {
    id: string;
    name: string;
    slug: string;
    color: string;
}

interface DistrictNews {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    coverImage: string | null;
    publishedAt: Date | null;
    viewCount: number;
    author: { id: string; name: string; avatarUrl?: string | null };
    category: DistrictCategory;
}

interface DistrictsSectionProps {
    districts: {
        category: DistrictCategory;
        news: DistrictNews[];
    }[];
}

export function DistrictsSection({ districts }: DistrictsSectionProps) {
    const [activeTab, setActiveTab] = useState(districts[0]?.category.slug);

    const activeDistrict = districts.find(d => d.category.slug === activeTab);

    if (!districts || districts.length === 0) return null;

    return (
        <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-[var(--accent)] rounded-full"></div>
                <h2 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    İlçelerimiz
                </h2>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
                {districts.map(({ category }) => (
                    <button
                        key={category.slug}
                        onClick={() => setActiveTab(category.slug)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === category.slug
                                ? "bg-[var(--accent)] text-white shadow-md shadow-rose-500/20"
                                : "bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-3)]"
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeDistrict?.news.map((item) => (
                    <div key={item.id} className="h-[400px]">
                        <NewsCard {...item} />
                    </div>
                ))}
                {(!activeDistrict?.news || activeDistrict.news.length === 0) && (
                    <p className="text-[var(--text-muted)] p-4 col-span-full text-center bg-[var(--bg-surface-2)] rounded-xl">Bu ilçe için henüz haber bulunmuyor.</p>
                )}
            </div>
        </section>
    );
}
