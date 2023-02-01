import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { procedure, router } from "../trpc";

export const auth = router({
    telegram: procedure.mutation(async ({ ctx }) => {
        const adapter = PrismaAdapter(ctx.prisma);
        const session = await adapter.createSession({
            sessionToken: "rowario-tst-432",
            userId: "cldjlz2540000cg29g1lpdgpw",
            expires: new Date(new Date().setHours(23)),
        });
        ctx.res.setHeader(
            "set-cookie",
            `next-auth.session-token=${session.sessionToken}; path=/; samesite=lax; httponly;`
        );
        return "test";
    }),
});
