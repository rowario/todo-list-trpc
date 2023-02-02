import { getServerAuthSession } from "@/pages/api/auth/[...nextauth]";
import { initTRPC, TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import superjson from "superjson";
import { prisma } from "./db";

interface CreateContextOptions {
    session: Session | null;
    res: NextApiResponse;
    req: NextApiRequest;
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
        req: ctx.req,
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
            ...ctx,
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
