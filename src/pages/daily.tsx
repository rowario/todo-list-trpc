import AddDailyTodoForm from "@/components/AddDailyTodoForm";
import CenteredLoader from "@/components/CenteredLoader";
import { trpc } from "@/utils/trpc";
import { ActionIcon, Container, Grid, Group, Paper, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
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

const Daily: FC = () => {
    const { data: todos, isLoading } = trpc.daily.all.useQuery();
    const utils = trpc.useContext();
    const { mutate: deleteDailyTodo } = trpc.daily.delete.useMutation({
        async onMutate({ id }) {
            await utils.daily.all.cancel();
            const previous = utils.daily.all.getData();
            if (!previous) {
                return;
            }
            utils.daily.all.setData(
                undefined,
                previous.filter((x) => x.id !== id)
            );
        },
    });

    if (isLoading) return <CenteredLoader />;

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
                        Ежедневные задачи:
						<br />
                        {todos &&
                            todos.map((todo) => (
                                <Group position="apart">
                                    <Text>{todo.title}</Text>
                                    <ActionIcon
                                        onClick={() =>
                                            deleteDailyTodo({ id: todo.id })
                                        }
                                        size="xs"
                                    >
                                        <IconX />
                                    </ActionIcon>
                                </Group>
                            ))}
						{!todos?.length && "У вас нет ежедневных задач."}
                        <AddDailyTodoForm />
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default Daily;
