import { getServerAuthSession } from "@/pages/api/auth/[...nextauth]";
import { initTRPC, TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { NextApiResponse } from "next";
import { Session } from "next-auth";
import superjson from "superjson";
import { prisma } from "./db";

interface CreateContextOptions {
    session: Session | null;
    res: NextApiResponse;
}

const createInnerContext = (opts: CreateContextOptions) => {
    return {
        ...opts,
        prisma,
    };
};

export const createTRPCConetxt = async (ctx: CreateNextContextOptions) => {
    const session = await getServerAuthSession(ctx);
    return createInnerContext({
        session,
        res: ctx.res,
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
