import { router } from "../trpc";
import { telegram } from "./telegram";
import { day } from "./day";
import { todo } from "./todo";

export const appRouter = router({
    day,
    todo,
    telegram,
});

export type AppRouter = typeof appRouter;
