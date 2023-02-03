import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, userProcedure } from "../trpc";

export const user = router({
    me: userProcedure.query(async ({ ctx }) => {
        return ctx.prisma.user.findFirst({
            where: {
                id: ctx.session.user.id,
            },
            include: {
                accounts: {
                    select: {
                        id: true,
                        provider: true,
                        providerAccountId: true,
                    },
                },
            },
        });
    }),
    removeAccount: userProcedure
        .input(
            z.object({
                account: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const account = await ctx.prisma.account.findFirst({
                    where: {
                        id: input.account,
                        userId: ctx.session.user.id,
                    },
                });
                if (!account) throw new TRPCError({ code: "NOT_FOUND" });
                return ctx.prisma.account.delete({
                    where: {
                        id: account.id,
                    },
                });
            } catch (e) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }
        }),
});
