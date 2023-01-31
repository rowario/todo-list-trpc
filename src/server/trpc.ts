import { getServerAuthSession } from "@/pages/api/auth/[...nextauth]";
import { initTRPC, TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { Session } from "next-auth";
import superjson from "superjson";
import { prisma } from "./db";

interface CreateContextOptions {
    session: Session | null;
}

const createInnerContext = (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prisma,
    };
};

export const createTRPCConetxt = async (ctx: CreateNextContextOptions) => {
    const session = await getServerAuthSession(ctx);
    return createInnerContext({
        session,
    });
};

const t = initTRPC.context<typeof createTRPCConetxt>().create({
    transformer: superjson,
});

const checkUserMiddleware = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            session: {
                ...ctx.session,
                user: ctx.session.user,
            },
        },
    });
});

export const router = t.router;
export const procedure = t.procedure;
export const userProcedure = t.procedure.use(checkUserMiddleware);
