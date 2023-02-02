import { router } from "../trpc";
import { telegram } from "./telegram";
import { day } from "./day";
import { todo } from "./todo";
import { user } from "./user";

export const appRouter = router({
    day,
    todo,
    telegram,
	user
});

export type AppRouter = typeof appRouter;
