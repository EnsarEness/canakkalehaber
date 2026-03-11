import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/NewsCard";
import { BreakingNewsTicker } from "@/components/BreakingNewsTicker";
import { AuthorsGrid } from "@/components/AuthorsGrid";
import { WeatherWidget } from "@/components/WeatherWidget";
import { GestasWidget } from "@/components/GestasWidget";
import { EczaneWidget } from "@/components/EczaneWidget";
import { HeroSlider } from "@/components/HeroSlider";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export const revalidate = 60;

async function getPublishedNews() {
  return prisma.news.findMany({
    where: { status: "PUBLISHED" },
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
      category: true,
    },
    orderBy: { publishedAt: "desc" },
    take: 22,
  });
}

async function getAuthors() {
  return prisma.user.findMany({
    where: { news: { some: { status: "PUBLISHED" } } },
    select: {
      id: true, name: true, role: true, bio: true, avatarUrl: true,
      news: {
        where: { status: "PUBLISHED" },
        select: { id: true, title: true, publishedAt: true },
        orderBy: { publishedAt: "desc" },
        take: 2,
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export default async function HomePage() {
  const [allNews, authors, categories] = await Promise.all([
    getPublishedNews(),
    getAuthors(),
    getCategories()
  ]);

  // Use top 5 for the slider
  const heroNews = allNews.slice(0, 5);
  // Grid uses the rest, up to 16 cards (4 columns x 4 rows)
  const gridNews = allNews.slice(5, 21);

  return (
    <div style={{ background: "var(--bg-base)" }}>
      {/* Breaking Ticker */}
      <BreakingNewsTicker items={allNews.slice(0, 6).map((n) => n.title)} />

      {/* ── HERO ROW ───────────────────────────────── */}
      <section className="pt-6 pb-8 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* BIG HERO SLIDER */}
            <div className="flex-1 lg:max-w-[calc(100%-344px)] min-w-0">
              <HeroSlider news={heroNews as any} />
            </div>

            {/* SECONDARY CARDS COLUMN -> REPLACED WITH WIDGETS */}
            <div className="flex-shrink-0 w-full lg:w-[320px] space-y-4 lg:max-h-[550px] lg:overflow-y-auto scrollbar-hide pb-2">
              <WeatherWidget />
              <GestasWidget />
              <EczaneWidget />
            </div>

          </div>
        </div>
      </section>

      {/* ── CATEGORY PILLS DELETED FOR CLEANLAYOUT ── */}

      {/* ── AUTHORS ────────────────────────────────── */}
      {authors.length > 0 && <AuthorsGrid authors={authors} />}

      {/* ── CATEGORIES (RESTORED TO FILL VOID & FILTER) ─ */}
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-between gap-4 pb-4">
          <Link href="/haberler"
            className="flex-1 text-center whitespace-nowrap px-4 py-4 rounded-2xl text-base lg:text-lg font-bold border transition-colors hover:bg-[var(--bg-surface-2)] shadow-sm bg-[var(--bg-surface)] text-[var(--accent)] border-[var(--border)]">
            🌟 Tüm Haberler
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/kategori/${c.slug}`}
              className="flex-1 text-center whitespace-nowrap px-4 py-4 rounded-2xl text-base lg:text-lg font-bold border transition-colors hover:bg-[var(--bg-surface-2)] shadow-sm bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border)]">
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT (100% WIDE 4-COL GRID) ────── */}
      <div className="max-w-[1440px] mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 section-title"
            style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', serif" }}>
            <Clock size={16} style={{ color: "var(--accent)" }} />
            Tüm Haberler
          </h2>
          <Link href="/haberler" className="text-sm font-semibold flex items-center gap-1 transition-all hover:opacity-80"
            style={{ color: "var(--accent)" }}>
            Hepsini Gör <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {gridNews.map((news) => (
            <NewsCard key={news.id} id={news.id} title={news.title} excerpt={news.excerpt}
              slug={news.slug} coverImage={news.coverImage} publishedAt={news.publishedAt}
              viewCount={news.viewCount} author={news.author} category={news.category as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
