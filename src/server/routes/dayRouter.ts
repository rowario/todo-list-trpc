import { z } from "zod";
import { procedure, router } from "../trpc";

export const dayRouter = router({
    check: procedure
        .input(
            z.object({
                name: z
                    .string()
                    .min(2, "минимальная длинна строки 2 симвлов!"),
            })
        )
        .query(({ input: { name } }) => {
            return `Ну привет ${name}`;
        }),
});
