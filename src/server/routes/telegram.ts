import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthDataValidator } from "@telegram-auth/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import { randomBytes, randomUUID } from "crypto";

export const telegram = router({
    auth: procedure
        .input(
            z.object({
                auth_date: z.number(),
                first_name: z.string(),
                last_name: z.string().optional(),
                hash: z.string(),
                id: z.number(),
                photo_url: z.string().optional(),
                username: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const validator = new AuthDataValidator({
                    botToken: process.env.BOT_TOKEN,
                });
                const telegramUser = await validator.validate(
                    new Map(Object.entries(input))
                );
                const adapter = PrismaAdapter(ctx.prisma);

                let account = await ctx.prisma.account.findFirst({
                    where: {
                        provider: "telegram",
                        providerAccountId: telegramUser.id.toString(),
                    },
                });

                if (!account) {
                    const user = await ctx.prisma.user.create({
                        data: {
                            name:
                                telegramUser.username ||
                                [
                                    telegramUser.first_name,
                                    telegramUser.last_name,
                                ].join(" "),
                            image: telegramUser.photo_url || null,
                        },
                    });
                    account = await ctx.prisma.account.create({
                        data: {
                            type: "widget",
                            provider: "telegram",
                            providerAccountId: telegramUser.id.toString(),
                            user: {
                                connect: {
                                    id: user.id,
                                },
                            },
                        },
                    });
                }

                const date = new Date();
                date.setDate(date.getDate() + 30);

                const session = await adapter.createSession({
                    sessionToken: generateSessionToken(),
                    userId: account.userId,
                    expires: date,
                });
                ctx.res.setHeader(
                    "set-cookie",
                    `next-auth.session-token=${session.sessionToken}; path=/; samesite=lax; httponly;`
                );

                return true;
            } catch (e) {
                return false;
            }
        }),
});

const generateSessionToken = () => {
    return randomUUID?.() ?? randomBytes(32).toString("hex");
};
