declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            NEXTAUTH_URL: string;
            DISCORD_ID: string;
            DISCORD_SECRET: string;
            BOT_TOKEN: string;
            NEXT_PUBLIC_BOT_ID: string;
        }
    }
}

export {};
