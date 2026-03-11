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
