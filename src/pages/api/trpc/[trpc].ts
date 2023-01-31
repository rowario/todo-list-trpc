import { appRouter } from "@/server/routes/_app";
import { createTRPCConetxt } from "@/server/trpc";
import * as trpcNext from "@trpc/server/adapters/next";

export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext: createTRPCConetxt,
});
