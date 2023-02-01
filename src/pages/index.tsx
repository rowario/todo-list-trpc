import CenteredLoader from "@/components/CenteredLoader";
import LoginScreen from "@/components/LoginScreen";
import DayScreen from "@/components/DayScreen";
import {
    AppShell,
    Avatar,
    Button,
    Container,
    Grid,
    Header,
    Text,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export default function Index() {
    let { data: session, status } = useSession();
    const router = useRouter();

    const { mutate } = trpc.auth.telegram.useMutation({
        onSettled() {
            router.reload();
        },
    });

    if (status === "loading") {
        return <CenteredLoader />;
    }

    return (
        <>
            <AppShell
                header={
                    <Header
                        height={70}
                        p="xs"
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text weight="bold" size={24} lh={1.8}>
                            TodoList
                        </Text>
                        {session && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <Avatar
                                    src={session.user?.image}
                                    alt="it's me"
                                />
                                <Text>{session?.user?.name}</Text>
                                <Button
                                    onClick={() => {
                                        signOut();
                                    }}
                                >
                                    Выйти
                                </Button>
                            </div>
                        )}
                    </Header>
                }
            >
                <Container>
                    <Button
                        onClick={() => {
                            mutate();
                        }}
                    >
                        TG
                    </Button>
                    <Grid>
                        {session && <DayScreen />}
                        {!session && <LoginScreen />}
                    </Grid>
                </Container>
            </AppShell>
        </>
    );
}
