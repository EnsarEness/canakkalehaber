import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Haberleri listele
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const status = searchParams.get("status") || "PUBLISHED";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const where: any = { status };
        if (category) where.category = { slug: category };

        const [news, total] = await Promise.all([
            prisma.news.findMany({
                where,
                include: {
                    author: { select: { id: true, name: true, avatarUrl: true } },
                    category: true,
                },
                orderBy: { publishedAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.news.count({ where }),
        ]);

        return NextResponse.json({ news, total, page, limit });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}

// POST - Yeni haber oluştur (AUTHOR+)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
        }

        const user = session.user as any;
        const body = await req.json();
        const { title, content, excerpt, coverImage, categoryId, status: rawStatus } = body;

        if (!title || !categoryId) {
            return NextResponse.json({ error: "Başlık ve kategori zorunludur" }, { status: 400 });
        }

        // Determine allowed statuses by role
        const allowedStatuses: Record<string, string[]> = {
            AUTHOR: ["DRAFT", "PENDING"],
            EDITOR: ["DRAFT", "PENDING", "PUBLISHED"],
            ADMIN: ["DRAFT", "PENDING", "PUBLISHED"],
        };
        const allowed = allowedStatuses[user.role] || ["DRAFT", "PENDING"];
        const finalStatus = allowed.includes(rawStatus) ? rawStatus : "PENDING";

        // For non-draft, require content and excerpt
        if (finalStatus !== "DRAFT" && (!excerpt || !content)) {
            return NextResponse.json({ error: "Özet ve içerik alanları zorunludur" }, { status: 400 });
        }

        const slug =
            title
                .toLowerCase()
                .replace(/ğ/g, "g")
                .replace(/ü/g, "u")
                .replace(/ş/g, "s")
                .replace(/ı/g, "i")
                .replace(/ö/g, "o")
                .replace(/ç/g, "c")
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "") +
            "-" +
            Date.now();

        const news = await prisma.news.create({
            data: {
                title,
                slug,
                content: content || "",
                excerpt: excerpt || title,
                coverImage: coverImage || null,
                categoryId,
                authorId: user.id,
                status: finalStatus,
                publishedAt: finalStatus === "PUBLISHED" ? new Date() : null,
            },
            include: {
                author: { select: { id: true, name: true } },
                category: true,
            },
        });

        return NextResponse.json(news, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
