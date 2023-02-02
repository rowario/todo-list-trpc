import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { NotificationsProvider } from "@mantine/notifications";
import { AppShell } from "@mantine/core";
import PageHeader from "@/components/PageHeader";

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
                <NotificationsProvider>
                    <SessionProvider session={pageProps.session}>
                        <AppShell header={<PageHeader />}>
                            <Component {...pageProps} />
                        </AppShell>
                    </SessionProvider>
                </NotificationsProvider>
            </MantineProvider>
        </>
    );
}

export default trpc.withTRPC(App);
