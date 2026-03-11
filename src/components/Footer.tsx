import Link from "next/link";
import { Newspaper, Mail, Phone, MapPin, Instagram, Twitter, Youtube } from "lucide-react";

const categories = [
    { name: "Gündem", slug: "gundem" },
    { name: "Kültür & Sanat", slug: "kultur-sanat" },
    { name: "Spor", slug: "spor" },
    { name: "Ekonomi", slug: "ekonomi" },
    { name: "Turizm", slug: "turizm" },
];

const links = [
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Künye", href: "/kunye" },
    { label: "İletişim", href: "/iletisim" },
    { label: "Gizlilik Politikası", href: "/gizlilik" },
    { label: "Yazarlar", href: "/yazarlar" },
];

export function Footer() {
    return (
        <footer
            className="border-t mt-16"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
            <div className="max-w-[1440px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4 group">
                            <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center">
                                <Newspaper size={20} className="text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <span className="block font-black text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    Çanakkale Haber
                                </span>
                                <span className="text-[10px] font-semibold tracking-widest text-[var(--accent)] uppercase">
                                    Güvenilir Yerel Haber Kaynağı
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-sm">
                            Çanakkale'nin güncel haberlerini, yerel gelişmelerini ve kültür-sanat etkinliklerini güvenilir kaynaklardan sunuyoruz.
                        </p>

                        {/* Social links */}
                        <div className="flex items-center gap-3 mt-5">
                            {[
                                { href: "#", icon: <Twitter size={16} />, label: "Twitter" },
                                { href: "#", icon: <Instagram size={16} />, label: "Instagram" },
                                { href: "#", icon: <Youtube size={16} />, label: "YouTube" },
                            ].map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] border border-[var(--border)] hover:border-[var(--accent)] transition-all hover:bg-[var(--accent-glow)]"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-faint)] mb-4">
                            Kategoriler
                        </h3>
                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li key={cat.slug}>
                                    <Link
                                        href={`/kategori/${cat.slug}`}
                                        className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-50" />
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links + Contact */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-faint)] mb-4">
                            Kurumsal
                        </h3>
                        <ul className="space-y-2 mb-6">
                            {links.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-50" />
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="space-y-2 text-xs text-[var(--text-muted)]">
                            <div className="flex items-center gap-2"><MapPin size={12} className="text-[var(--accent)]" /> Çanakkale Merkez, TR</div>
                            <div className="flex items-center gap-2"><Phone size={12} className="text-[var(--accent)]" /> 0286 212 00 00</div>
                            <div className="flex items-center gap-2"><Mail size={12} className="text-[var(--accent)]" /> haber@canakkale-haber.com</div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-faint)]">
                    <p>© 2026 Çanakkale Haber Portalı. Tüm hakları saklıdır.</p>
                    <p>
                        Built with{" "}
                        <span className="text-[var(--accent)]">♥</span>{" "}
                        in Çanakkale
                    </p>
                </div>
            </div>
        </footer>
    );
}
