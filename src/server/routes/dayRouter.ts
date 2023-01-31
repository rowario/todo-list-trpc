import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { z } from "zod";
import { userProcedure, router } from "../trpc";

export const dayRouter = router({
    getAll: userProcedure.query(async ({ ctx }) => {
        return ctx.prisma.day.findMany({
            where: {
                userId: ctx.session.user.id,
            },
        });
    }),
    getByDate: userProcedure
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
            });
            if (!day) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            return day;
        }),
    getById: userProcedure
        .input(
            z.object({
                id: z.string(),
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
        const date = dayjs().format("YYYY/MM/DD");
        const checked = await ctx.prisma.day.findFirst({
            where: {
                userId: ctx.session.user.id,
                date,
            },
        });
        if (checked) {
            throw new TRPCError({ code: "CONFLICT" });
        }
        const created = await ctx.prisma.day.create({
            data: {
                date,
                userId: ctx.session.user.id,
            },
        });
        if (!created) {
            throw new TRPCError({ code: "BAD_REQUEST" });
        }
        return created;
    }),
});
