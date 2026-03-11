import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/NewsCard";
import { BreakingNewsTicker } from "@/components/BreakingNewsTicker";
import { AuthorsGrid } from "@/components/AuthorsGrid";
import { WeatherWidget } from "@/components/WeatherWidget";
import { GestasWidget } from "@/components/GestasWidget";
import { EczaneWidget } from "@/components/EczaneWidget";
import { HeroSlider } from "@/components/HeroSlider";
import { DistrictsSection } from "@/components/DistrictsSection";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export const revalidate = 60;

async function getPublishedNews() {
  return [
    {
      id: "mock-news-1",
      title: "Çanakkale Boğazı'nda Gemi Trafiği",
      excerpt: "Çanakkale Boğazı'nda yoğun sis nedeniyle gemi trafiği geçici olarak durduruldu.",
      slug: "canakkale-bogazinda-gemi-trafigi",
      coverImage: "https://images.unsplash.com/photo-1570959828461-1ff9702283dc?q=80&w=800",
      publishedAt: new Date().toISOString(),
      author: { id: "test-author-1", name: "Fatma Yılmaz", avatarUrl: null },
      category: { id: "cat-1", name: "Gündem", color: "#EF4444" }
    },
    {
      id: "mock-news-2",
      title: "Troya Müzesi'ne Ziyaretçi Akını",
      excerpt: "Avrupa Yılın Müzesi Özel Ödülü alan Troya Müzesi, yerli ve yabancı turistlerin gözdesi oldu.",
      slug: "troya-muzesine-ziyaretci-akini",
      coverImage: "https://images.unsplash.com/photo-1565022515024-9f2061214e2c?q=80&w=800",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      author: { id: "test-author-2", name: "Mehmet Demir", avatarUrl: null },
      category: { id: "cat-2", name: "Kültür & Sanat", color: "#8B5CF6" }
    }
  ];
}

async function getAuthors() {
  return [
    {
      id: "test-author-1", name: "Fatma Yılmaz", role: "AUTHOR", bio: "Çanakkale merkezli yerel muhabir.", avatarUrl: null,
      news: [{ id: "mock-news-1", title: "Çanakkale Boğazı'nda Gemi Trafiği", publishedAt: new Date().toISOString() }]
    },
    {
      id: "test-author-2", name: "Mehmet Demir", role: "AUTHOR", bio: "Kültür ve sanat haberleri.", avatarUrl: null,
      news: [{ id: "mock-news-2", title: "Troya Müzesi'ne Ziyaretçi Akını", publishedAt: new Date(Date.now() - 86400000).toISOString() }]
    }
  ];
}

async function getCategories() {
  return [
    { id: "cat-1", name: "Gündem", slug: "gundem", color: "#EF4444" },
    { id: "cat-2", name: "Kültür & Sanat", slug: "kultur-sanat", color: "#8B5CF6" },
    { id: "cat-3", name: "Spor", slug: "spor", color: "#10B981" }
  ];
}

async function getDistricts() {
  const slugs = ["biga", "can", "ayvacik", "gelibolu", "ezine"];
  return prisma.category.findMany({
    where: { slug: { in: slugs } },
    include: {
      news: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        take: 4,
        include: {
          author: { select: { id: true, name: true, avatarUrl: true } },
          category: { select: { id: true, name: true, slug: true, color: true } }
        }
      }
    }
  });
}

export default async function HomePage() {
  const [allNews, authors, categories, districtCategories] = await Promise.all([
    getPublishedNews(),
    getAuthors(),
    getCategories(),
    getDistricts()
  ]);

  // Use top 5 for the slider
  const heroNews = allNews.slice(0, 5);
  // Grid uses the rest, up to 16 cards (4 columns x 4 rows)
  const gridNews = allNews.slice(5, 21);

  const districtsData = districtCategories.map((cat: any) => ({
    category: { id: cat.id, name: cat.name, slug: cat.slug, color: cat.color },
    news: cat.news as any
  }));

  return (
    <div style={{ background: "var(--bg-base)" }}>
      {/* Breaking Ticker */}
      <BreakingNewsTicker items={allNews.slice(0, 6).map((n: any) => n.title)} />

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

      {/* ── DISTRICTS (İLÇELERİMİZ) ────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 pb-4 mt-8">
        <DistrictsSection districts={districtsData} />
      </div>

      {/* ── CATEGORIES (MOVED ABOVE TUM HABERLER) ─ */}
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap lg:justify-between gap-4 pb-4">
          <Link href="/haberler"
            className="flex-1 text-center whitespace-nowrap px-4 py-4 rounded-2xl text-base lg:text-lg font-bold border transition-colors hover:bg-[var(--bg-surface-2)] shadow-sm bg-[var(--bg-surface)] text-[var(--accent)] border-[var(--border)]">
            🌟 Tüm Haberler
          </Link>
          {categories.map((c: any) => (
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
          {gridNews.map((news: any) => (
            <NewsCard key={news.id} id={news.id} title={news.title} excerpt={news.excerpt}
              slug={news.slug} coverImage={news.coverImage} publishedAt={news.publishedAt}
              viewCount={news.viewCount} author={news.author} category={news.category as any} />
          ))}
        </div>
      </div>
    </div>
  );
}
