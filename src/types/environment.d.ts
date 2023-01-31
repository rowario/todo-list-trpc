declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            NEXTAUTH_URL: string;
            DISCORD_ID: string;
            DISCORD_SECRET: string;
            PORT: string;
        }
    }
}

export {};