import getCurrentDate from "@/utils/getCurrentDate";
import { trpc } from "@/utils/trpc";
import { Button, Grid, Paper } from "@mantine/core";
import AddTodoForm from "./AddTodoForm";
import CenteredLoader from "./CenteredLoader";
import NotesForm from "./NotesForm";
import TodoList from "./TodoList";

const DayScreen = () => {
    const { data: day, isLoading, refetch } = trpc.day.last.useQuery();
    const ctx = trpc.useContext();
    const { mutate: createNewDay } = trpc.day.create.useMutation({
        onSettled: (newDay) => {
            if (newDay) {
                refetch();
                ctx.todo.allByDay.refetch({ dayId: newDay.id });
            }
        },
    });

    if (isLoading) {
        return <CenteredLoader />;
    }

    if (!day) {
        return (
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyItems: "center",
                }}
            >
                <span>Еще не создано ни одного дня.</span>
                <Button onClick={() => createNewDay()}>Создать день</Button>
            </div>
        );
    }

    return (
        <>
            <Grid.Col lg={6} md={6} sm={12} xs={12}>
                <Paper withBorder p="sm">
                    Список задач ({day.date}):
                    <br />
                    <TodoList day={day} />
                    <div style={{ paddingTop: 4 }}>
                        <AddTodoForm dayId={day.id} />
                    </div>
                    {day.date < getCurrentDate() && (
                        <div style={{ paddingTop: 8 }}>
                            <Button
                                color="green"
                                onClick={() => createNewDay()}
                                fullWidth
                            >
                                Создать новый день
                            </Button>
                        </div>
                    )}
                </Paper>
            </Grid.Col>
            <Grid.Col lg={6} md={6} sm={12} xs={12}>
                <NotesForm key={day.id} day={day} />
            </Grid.Col>
        </>
    );
};

export default DayScreen;
