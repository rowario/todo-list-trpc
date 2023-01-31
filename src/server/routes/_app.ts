import { router } from "../trpc";
import { day } from "./day";
import { todo } from "./todo";

export const appRouter = router({
    day,
    todo,
});

export type AppRouter = typeof appRouter;
