import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Tek haber detayı
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const news = await prisma.news.findUnique({
            where: { id: params.id },
            include: {
                author: { select: { id: true, name: true, bio: true, avatarUrl: true } },
                category: true,
            },
        });

        if (!news) {
            return NextResponse.json({ error: "Haber bulunamadı" }, { status: 404 });
        }

        // View count artır
        await prisma.news.update({
            where: { id: params.id },
            data: { viewCount: { increment: 1 } },
        });

        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}

// PATCH - Haberi güncelle
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
        }

        const user = session.user as any;
        const body = await req.json();

        const existingNews = await prisma.news.findUnique({
            where: { id: params.id },
        });

        if (!existingNews) {
            return NextResponse.json({ error: "Haber bulunamadı" }, { status: 404 });
        }

        // Yazar sadece kendi haberini düzenleyebilir, EDITOR+ herkesi düzenleyebilir
        if (user.role === "AUTHOR" && existingNews.authorId !== user.id) {
            return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
        }

        const news = await prisma.news.update({
            where: { id: params.id },
            data: body,
        });

        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
