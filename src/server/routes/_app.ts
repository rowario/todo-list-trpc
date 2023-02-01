import { router } from "../trpc";
import { auth } from "./auth";
import { day } from "./day";
import { todo } from "./todo";

export const appRouter = router({
    day,
    todo,
	auth
});

export type AppRouter = typeof appRouter;
