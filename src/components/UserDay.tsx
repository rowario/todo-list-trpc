import { trpc } from "@/utils/trpc";
import { Button } from "@mantine/core";
import AddTodoForm from "./AddTodoForm";
import CenteredLoader from "./CenteredLoader";
import TodoList from "./TodoList";

const UserDay = () => {
    const { data: day, isLoading, refetch } = trpc.day.getLast.useQuery();
    const { mutate: createNewDay } = trpc.day.create.useMutation({
        onSettled: () => {
            refetch();
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
        </>
    );
};

export default UserDay;
