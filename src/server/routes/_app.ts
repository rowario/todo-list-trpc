import { router } from "../trpc";
import { dayRouter } from "./dayRouter";
import { todoRouter } from "./todoRouter";

export const appRouter = router({
    day: dayRouter,
    todo: todoRouter,
});

export type AppRouter = typeof appRouter;
