import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { trpc } from "@/utils/trpc";

function App(props: AppProps) {
    const { Component, pageProps } = props;

    return (
        <>
            <Head>
                <title>Todo List</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: "dark",
                }}
            >
                <SessionProvider session={pageProps.session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </MantineProvider>
        </>
    );
}

export default trpc.withTRPC(App);
