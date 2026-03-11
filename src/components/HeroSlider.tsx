"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface NewsItem {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
    category: { name: string; color: string };
    author: { name: string };
}

interface HeroSliderProps {
    news: NewsItem[];
}

function timeAgo(date: Date | null): string {
    if (!date) return "";
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}d`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}s`;
    return new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export function HeroSlider({ news }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused || news.length === 0) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % news.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [paused, news.length]);

    if (news.length === 0) return null;

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrent((prev) => (prev - 1 + news.length) % news.length);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrent((prev) => (prev + 1) % news.length);
    };

    return (
        <div
            className="relative rounded-2xl overflow-hidden group h-[500px] lg:h-[550px] shadow-lg"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ background: "var(--navy-mid)" }}
        >
            {/* Slides */}
            {news.map((item, idx) => (
                <Link
                    key={item.id}
                    href={`/haber/${item.slug}`}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                >
                    {item.coverImage ? (
                        <img
                            src={item.coverImage}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-transform duration-[10s] ease-out ${idx === current ? "scale-105" : "scale-100"
                                }`}
                        />
                    ) : (
                        <div className="w-full h-full" style={{ background: "var(--navy-mid)" }} />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col justify-end">
                        <span
                            className="text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block w-fit shadow-md"
                            style={{ backgroundColor: item.category.color }}
                        >
                            {item.category.name}
                        </span>
                        <h1
                            className="text-white text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-3 max-w-3xl drop-shadow-md"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {item.title}
                        </h1>
                        {item.excerpt && (
                            <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl drop-shadow">
                                {item.excerpt}
                            </p>
                        )}
                        <div className="flex items-center gap-2 text-white/60 text-xs md:text-sm font-medium">
                            <span>{item.author.name}</span>
                            <span className="opacity-50">•</span>
                            <span>{timeAgo(item.publishedAt)}</span>
                        </div>
                    </div>
                </Link>
            ))}

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 inset-x-4 flex justify-between z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur border border-white/20 text-white hover:bg-black/60 hover:scale-110 transition-all pointer-events-auto"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur border border-white/20 text-white hover:bg-black/60 hover:scale-110 transition-all pointer-events-auto"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 right-6 z-20 flex gap-2">
                {news.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrent(idx);
                        }}
                        className={`transition-all duration-300 rounded-full ${idx === current ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
                            }`}
                    />
                ))}
            </div>

            {/* Play/Pause indicator visible only on hover */}
            <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center text-white/70">
                    {paused ? <Pause size={14} /> : <Play size={14} />}
                </div>
            </div>
        </div>
    );
}
