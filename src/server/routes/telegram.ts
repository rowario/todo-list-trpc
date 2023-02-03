import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthDataValidator, TelegramUserData } from "@telegram-auth/server";
import { z } from "zod";
import { procedure, router, userProcedure } from "../trpc";
import { randomBytes, randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import { PrismaClient, User } from "@prisma/client";

const telegramAuthResponse = z.object({
    auth_date: z.number(),
    first_name: z.string(),
    last_name: z.string().optional(),
    hash: z.string(),
    id: z.number(),
    photo_url: z.string().optional(),
    username: z.string().optional(),
});

export type TelegramAuthRepsonse = z.infer<typeof telegramAuthResponse>;

export const telegram = router({
    connect: userProcedure
        .input(telegramAuthResponse)
        .mutation(async ({ ctx, input }) => {
            try {
                const telegramUser = await getTelegramValidatedUser(input);
                const user = await ctx.prisma.user.findFirst({
                    where: {
                        id: ctx.session.user.id,
                    },
                });
                if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

                await getAccount(ctx.prisma, telegramUser, user);

                return true;
            } catch (e) {
                if (e instanceof TRPCError) throw e;
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
        }),
    auth: procedure
        .input(telegramAuthResponse)
        .mutation(async ({ ctx, input }) => {
            try {
                const telegramUser = await getTelegramValidatedUser(input);
                const account = await getAccount(ctx.prisma, telegramUser);

                const date = new Date();
                date.setDate(date.getDate() + 30);

                const adapter = PrismaAdapter(ctx.prisma);
                const session = await adapter.createSession({
                    sessionToken: generateSessionToken(),
                    userId: account.userId,
                    expires: date,
                });

                const reqUrl = ctx.req.headers["referer"];
                const url = new URL(reqUrl || "http://localhost");

                if (url.protocol === "https:") {
                    ctx.res.setHeader(
                        "set-cookie",
                        `__Secure-next-auth.session-token=${session.sessionToken}; path=/; samesite=lax; httponly; secure=true; Expires=${date};`
                    );
                } else {
                    ctx.res.setHeader(
                        "set-cookie",
                        `next-auth.session-token=${session.sessionToken}; path=/; samesite=lax; httponly; Expires=${date};`
                    );
                }

                return true;
            } catch (e) {
                if (e instanceof TRPCError) throw e;
                throw new TRPCError({ code: "UNAUTHORIZED" });
            }
        }),
});

const getAccount = async (
    prisma: PrismaClient,
    telegramUser: TelegramUserData,
    user?: User
) => {
    let account = await prisma.account.findFirst({
        where: {
            provider: "telegram",
            providerAccountId: telegramUser.id.toString(),
        },
    });

    if (account) {
        if (!user) return account;
        throw new TRPCError({ code: "CONFLICT" });
    }

    try {
        const accountName =
            telegramUser.username ||
            [telegramUser.first_name, telegramUser.last_name].join(" ");
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: accountName,
                    image: telegramUser.photo_url || null,
                },
            });
        }
        account = await prisma.account.create({
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
    } catch (e) {
        throw new TRPCError({ code: "CONFLICT" });
    }

    return account;
};

const getTelegramValidatedUser = async (
    input: z.infer<typeof telegramAuthResponse>
) => {
    try {
        const validator = new AuthDataValidator({
            botToken: process.env.BOT_TOKEN,
        });

        const user = await validator.validate(new Map(Object.entries(input)));

        return user;
    } catch (e) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
};

const generateSessionToken = () => {
    return randomUUID?.() ?? randomBytes(32).toString("hex");
};
