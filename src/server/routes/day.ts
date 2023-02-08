import getCurrentDate from "@/utils/getCurrentDate";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { userProcedure, router } from "../trpc";

export const day = router({
    all: userProcedure.query(async ({ ctx }) => {
        return ctx.prisma.day.findMany({
            where: {
                userId: ctx.session.user.id,
            },
            select: {
                id: true,
                date: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }),
    last: userProcedure.query(async ({ ctx }) => {
        return ctx.prisma.day.findFirst({
            where: {
                currentDayUser: {
                    id: ctx.session.user.id,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }),
    byDate: userProcedure
        .input(
            z.object({
                date: z.string(),
            })
        )
        .query(async ({ ctx, input }) => {
            const day = await ctx.prisma.day.findFirst({
                where: {
                    date: input.date,
                    userId: ctx.session.user.id,
                },
                include: {
                    todos: true,
                },
            });
            if (!day) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            return day;
        }),
    byId: userProcedure
        .input(
            z.object({
                id: z.string().cuid(),
            })
        )
        .query(async ({ input, ctx }) => {
            const day = await ctx.prisma.day.findFirst({
                where: {
                    id: input.id,
                    userId: ctx.session.user.id,
                },
            });
            if (!day) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            return day;
        }),
    create: userProcedure.mutation(async ({ ctx }) => {
        const date = getCurrentDate();
        const checked = await ctx.prisma.day.findFirst({
            where: {
                userId: ctx.session.user.id,
                date,
            },
        });
        if (checked) {
            throw new TRPCError({ code: "CONFLICT" });
        }
        const dailyTodos = await ctx.prisma.dailyTodo.findMany({
            where: {
                userId: ctx.session.user.id,
            },
        });
        const created = await ctx.prisma.day.create({
            data: {
                date,
                userId: ctx.session.user.id,
                todos: {
                    create: dailyTodos.map((todo) => ({
                        title: todo.title,
                        completed: false,
                        userId: ctx.session.user.id,
                    })),
                },
            },
        });
        await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                currentDay: {
                    connect: {
                        id: created.id,
                    },
                },
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
                id: z.string().cuid(),
                notes: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await ctx.prisma.day.update({
                data: {
                    notes: input.notes,
                },
                where: {
                    id: input.id,
                    userId: ctx.session.user.id,
                },
            });
        }),
});
