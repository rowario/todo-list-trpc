import { router } from "../trpc";
import { dayRouter } from "./dayRouter";

export const appRouter = router({
    day: dayRouter,
});

export type AppRouter = typeof appRouter;
