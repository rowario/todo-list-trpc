import { Header, Text, Avatar, ActionIcon } from "@mantine/core";
import { IconArrowBigRight, IconChartLine, IconSettings } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const PageHeader = () => {
    const { data: session } = useSession();
    return (
        <Header
            height={70}
            p="xs"
            sx={{
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <Link
                style={{
                    textDecoration: "none",
                    color: "inherit",
                }}
                href="/"
            >
                <Text weight="bold" size={24} lh={1.8}>
                    TodoList
                </Text>
            </Link>
            {session && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <Link
                        href="/statistics"
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <ActionIcon size="lg">
                            <IconChartLine size={20} />
                        </ActionIcon>
                    </Link>
                    <Link
                        href="/settings"
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <ActionIcon size="lg">
                            <IconSettings size={20} />
                        </ActionIcon>
                    </Link>
                    <Avatar src={session.user?.image} alt="it's me" />
                    <Text>{session?.user?.name}</Text>
                    <ActionIcon
                        variant="default"
                        title="Выйти"
                        size="lg"
                        onClick={() => {
                            signOut();
                        }}
                    >
                        <IconArrowBigRight size={20} />
                    </ActionIcon>
                </div>
            )}
        </Header>
    );
};

export default PageHeader;
