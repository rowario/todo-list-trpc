import { GetServerSidePropsContext } from "next";
import NextAuth, {
    DefaultSession,
    getServerSession,
    NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/server/db";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

export const authAdapter = PrismaAdapter(prisma);

export const authOptions: NextAuthOptions = {
    callbacks: {
        async signIn({ user, account }) {
            if (account) {
                const existAccount = await prisma.account.findFirst({
                    where: {
                        providerAccountId: account.providerAccountId,
                    },
                });

                if (existAccount) {
                    const checkOldUser = await prisma.user.findFirst({
                        where: {
                            id: user.id,
                        },
                    });

                    if (!checkOldUser) return true;
                }
            }

            return true;
        },
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    adapter: authAdapter,
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_ID,
            clientSecret: process.env.DISCORD_SECRET,
        }),
    ],
    pages: {
        error: "/error",
        signIn: "/error",
    },
};

export default NextAuth(authOptions);

export const getServerAuthSession = async (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};
