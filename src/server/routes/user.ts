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
						provider: true,
						providerAccountId: true,
						providerAccountName: true
					}
				}
			}
        });
    }),
});
