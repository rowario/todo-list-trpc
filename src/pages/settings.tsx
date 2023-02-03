import CenteredLoader from "@/components/CenteredLoader";
import { TelegramAuthButton } from "@/components/TelegramAuthButton";
import { trpc } from "@/utils/trpc";
import { Avatar, Button, Container, Grid, Paper } from "@mantine/core";
import { IconBrandDiscord, IconBrandTelegram } from "@tabler/icons-react";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
};

const providers = [
    {
        name: "Discord",
        icon: <IconBrandDiscord size={24} />,
    },
    {
        name: "Telegram",
        icon: <IconBrandTelegram size={24} />,
    },
];

const Settings: FC = () => {
    const { data: user, isLoading, refetch } = trpc.user.me.useQuery();
    const { mutate: removeAccount } = trpc.user.removeAccount.useMutation({
        onSettled(result) {
            if (result) {
                refetch();
            }
        },
    });
    if (isLoading) return <CenteredLoader />;
    if (!user) return <>Ошибка загрузки</>;
    return (
        <Container>
            <Grid>
                <Grid.Col
                    offsetLg={2}
                    lg={8}
                    offsetMd={2}
                    md={8}
                    sm={12}
                    xs={12}
                >
                    <Paper
                        withBorder
                        p="sm"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                        }}
                    >
                        Привязанные аккаунты:
                        {providers.map((provider) => {
                            const account = user.accounts.find(
                                (x) =>
                                    x.provider === provider.name.toLowerCase()
                            );
                            const isUsed = !!account;
                            return (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <Avatar color="blue" radius="sm">
                                        {provider.icon}
                                    </Avatar>
                                    <span
                                        style={{
                                            display: "flex",
                                            gap: 8,
                                            alignItems: "center",
                                        }}
                                    >
                                        <span>{provider.name}</span>
                                        {isUsed ? (
                                            <>
                                                <Button
                                                    color="red"
                                                    compact
                                                    size="xs"
                                                    disabled={
                                                        user.accounts.length < 2
                                                    }
                                                    onClick={() => {
                                                        removeAccount({
                                                            account: account.id,
                                                        });
                                                    }}
                                                >
                                                    Отвязать
                                                </Button>
                                            </>
                                        ) : (
                                            <ConnectionButton
                                                name={provider.name}
                                            />
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

const ConnectionButton: FC<{ name: string }> = ({ name }) => {
    const router = useRouter();
    const { mutate: connectTelegram } = trpc.telegram.connect.useMutation({
        onSuccess(response) {
            if (response) router.reload();
        },
    });
    switch (name) {
        case "Telegram":
            return (
                <TelegramAuthButton
					color="green"
					compact
                    size="xs"
                    botId={process.env.NEXT_PUBLIC_BOT_ID}
                    onAuthCallback={connectTelegram}
                >
					Привязать 
                </TelegramAuthButton>
            );
        case "Discord":
            return (
                <Button
                    onClick={() => {
                        signIn("discord");
                    }}
                    color="green"
                    compact
                    size="xs"
                >
                    Привязать
                </Button>
            );
        default:
            return (
                <Button disabled color="green" compact size="xs">
                    Нельзя привязать аккаунт
                </Button>
            );
    }
};

export default Settings;