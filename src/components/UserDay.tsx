import getCurrentDate from "@/utils/getCurrentDate";
import { trpc } from "@/utils/trpc";
import { Button } from "@mantine/core";
import AddTodoForm from "./AddTodoForm";
import CenteredLoader from "./CenteredLoader";
import TodoList from "./TodoList";

const UserDay = () => {
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
            <>
                Еще не создано ни одного дня.
                <Button onClick={() => createNewDay()}>Создать день</Button>
            </>
        );
    }

    return (
        <>
            Список задач ({day.date}):
            <br />
            <TodoList day={day} />
            <div style={{ paddingTop: 4 }}>
                <AddTodoForm dayId={day.id} />
            </div>
            {day.date !== getCurrentDate() && (
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
        </>
    );
};

export default UserDay;
