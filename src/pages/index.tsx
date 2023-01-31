import CenteredLoader from "@/components/CenteredLoader";
import LoginScreen from "@/components/LoginScreen";
import UserDay from "@/components/UserDay";
import {
    AppShell,
    Avatar,
    Button,
    Grid,
    Header,
    Paper,
    Text,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";

export default function Index() {
    const { data: session, status } = useSession();

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
                <Grid>
                    <Grid.Col
                        offsetLg={4}
                        lg={4}
                        xs={12}
                        offset={0}
                        offsetSm={2}
                        sm={8}
                        offsetMd={3}
                        md={6}
                    >
                        {session && (
                            <Paper withBorder p="sm">
                                <UserDay />
                            </Paper>
                        )}
                        {!session && <LoginScreen />}
                    </Grid.Col>
                </Grid>
            </AppShell>
        </>
    );
}
