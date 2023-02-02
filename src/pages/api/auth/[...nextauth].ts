import { GetServerSidePropsContext } from "next";
import NextAuth, {
    DefaultSession,
    getServerSession,
    NextAuthOptions,
} from "next-auth";
import DiscordProvider, { DiscordProfile } from "next-auth/providers/discord";
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
        async signIn({ account, profile }) {
            if (account && profile) {
                if (account.provider === "discord") {
                    const discordUser = profile as DiscordProfile;
                    const providerAccountName = [
                        discordUser.username,
                        discordUser.discriminator,
                    ].join("#");
                    const foundAccount = await prisma.account.findFirst({
                        where: {
                            providerAccountId: discordUser.id,
                        },
                    });
                    if (foundAccount) {
                        await prisma.account.update({
                            where: {
                                id: foundAccount.id,
                            },
                            data: {
                                providerAccountName,
                            },
                        });
                    }
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
};

export default NextAuth(authOptions);

export const getServerAuthSession = async (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};
