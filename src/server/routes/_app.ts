import { router } from "../trpc";
import { telegram } from "./telegram";
import { day } from "./day";
import { todo } from "./todo";
import { user } from "./user";
import { daily } from "./daily";

export const appRouter = router({
    day,
    todo,
    telegram,
	user,
	daily
});

export type AppRouter = typeof appRouter;
