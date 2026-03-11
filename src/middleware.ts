import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const pathname = req.nextUrl.pathname;

        // Onay sayfaları sadece EDITOR ve ADMIN erişebilir
        if (pathname.startsWith("/panel/onay-bekleyenler")) {
            if (token?.role !== "EDITOR" && token?.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/panel", req.url));
            }
        }

        // Kategori yönetimi sadece ADMIN erişebilir
        if (pathname.startsWith("/panel/kategoriler")) {
            if (token?.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/panel", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/panel/:path*"],
};
