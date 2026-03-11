import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Şifre", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Hardcoded admin bypass for Vercel without DB
                const testAccounts = [
                    { email: "admin@canakkale.com", name: "Sistem Yöneticisi", role: "ADMIN", id: "test-admin-1" },
                    { email: "fatma@canakkale.com", name: "Fatma Yılmaz", role: "AUTHOR", id: "test-author-1" },
                    { email: "mehmet@canakkale.com", name: "Mehmet Demir", role: "AUTHOR", id: "test-author-2" },
                    { email: "elif@canakkale.com", name: "Elif Kaya", role: "AUTHOR", id: "test-author-3" },
                ];

                const matchingAccount = testAccounts.find(acc => acc.email === credentials.email);

                if (matchingAccount && credentials.password === "password123") {
                    return matchingAccount;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) return null;

                    const passwordMatch = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!passwordMatch) return null;

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    // Fallback return if Prisma is uninitialized or fails to connect
                    console.error("Auth DB Error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).id = token.id;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/giris",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
