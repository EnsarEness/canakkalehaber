import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Giriş yapmış kullanıcının haberleri
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });
        }

        const user = session.user as any;

        const where: any =
            user.role === "AUTHOR" ? { authorId: user.id } : {};

        const news = await prisma.news.findMany({
            where,
            include: {
                author: { select: { id: true, name: true } },
                category: true,
            },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
