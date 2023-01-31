import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, userProcedure } from "../trpc";

export const todoRouter = router({
    getAll: userProcedure.query(async ({ ctx }) => {
        return ctx.prisma.todo.findMany({
            where: {
                userId: ctx.session.user.id,
            },
            orderBy: {},
        });
    }),
    getById: userProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const todo = await ctx.prisma.todo.findFirst({
                where: {
                    id: input.id,
                    userId: ctx.session.user.id,
                },
            });
            if (!todo) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            return todo;
        }),
    create: userProcedure
        .input(
            z.object({
                title: z.string(),
                dayId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const created = await ctx.prisma.todo.create({
                data: {
                    ...input,
                    userId: ctx.session.user.id,
                    completed: false,
                },
            });
            if (!created) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }
            return created;
        }),
    patch: userProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string(),
                completed: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input: { id, ...input } }) => {
            const updated = await ctx.prisma.todo.update({
                data: {
                    ...input,
                },
                where: {
                    id,
                    userId: ctx.session.user.id,
                },
            });
            if (!updated) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }
            return updated;
        }),
});
