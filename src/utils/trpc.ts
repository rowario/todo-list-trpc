import { AppRouter } from "@/server/routes/_app";
import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return "";
    }

    return `http://127.0.0.1:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCNext<AppRouter>({
    config() {
        return {
            links: [
                httpBatchLink({
                    url: getBaseUrl() + "/api/trpc",
                }),
            ],
            transformer: superjson,
            queryClientConfig: {
                defaultOptions: {
                    queries: {
                        staleTime: Infinity,
                    },
                },
            },
        };
    },
    ssr: false,
});
