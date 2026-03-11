"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    PenLine,
    FileText,
    CheckSquare,
    Tag,
    LogOut,
    Newspaper,
    ChevronRight,
} from "lucide-react";

interface Props {
    role: string;
    name: string;
    email: string;
}

const navItems = [
    { href: "/panel", label: "Dashboard", icon: LayoutDashboard, roles: ["AUTHOR", "EDITOR", "ADMIN"] },
    { href: "/panel/haber-yaz", label: "Haber Yaz", icon: PenLine, roles: ["AUTHOR", "EDITOR", "ADMIN"] },
    { href: "/panel/haberlerim", label: "Haberlerim", icon: FileText, roles: ["AUTHOR", "EDITOR", "ADMIN"] },
    { href: "/panel/onay-bekleyenler", label: "Onay Bekleyenler", icon: CheckSquare, roles: ["EDITOR", "ADMIN"] },
    { href: "/panel/kategoriler", label: "Kategoriler", icon: Tag, roles: ["ADMIN"] },
];

const roleLabels: Record<string, string> = {
    AUTHOR: "🖊️ Yazar",
    EDITOR: "✍️ Editör",
    ADMIN: "⚙️ Yönetici",
};

export function PanelSidebar({ role, name, email }: Props) {
    const pathname = usePathname();

    const allowed = navItems.filter((item) => item.roles.includes(role));

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm">
            {/* Logo */}
            <div className="p-5 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-red-700 text-white p-1.5 rounded-lg">
                        <Newspaper size={16} />
                    </div>
                    <span className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Çanakkale Haber
                    </span>
                </Link>
            </div>

            {/* User info */}
            <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1a2744] to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                        <p className="text-xs text-gray-500 truncate">{email}</p>
                        <span className="text-xs text-gray-400">{roleLabels[role]}</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1">
                {allowed.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive ? "active" : ""}`}
                        >
                            <item.icon size={17} />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight size={14} />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100">
                <Link href="/" className="sidebar-link mb-1">
                    <Newspaper size={17} />
                    Ana Sayfa
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut size={17} />
                    Çıkış Yap
                </button>
            </div>
        </aside>
    );
}
