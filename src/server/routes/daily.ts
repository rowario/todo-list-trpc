import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { userProcedure, router } from "../trpc";

export const daily = router({
    all: userProcedure.query(async ({ ctx }) => {
        return ctx.prisma.dailyTodo.findMany({
            where: {
                userId: ctx.session.user.id,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }),
    create: userProcedure
        .input(
            z.object({
                title: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const created = await ctx.prisma.dailyTodo.create({
                    data: {
                        title: input.title,
                        userId: ctx.session.user.id,
                    },
                });
                return created;
            } catch (e) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }
        }),
    delete: userProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.dailyTodo.delete({
                where: {
                    id: input.id,
                    userId: ctx.session.user.id,
                },
            });
        }),
});
