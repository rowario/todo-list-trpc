import { trpc } from "@/utils/trpc";
import { Button } from "@mantine/core";
import AddTodoForm from "./AddTodoForm";
import CenteredLoader from "./CenteredLoader";
import TodoItem from "./TodoItem";

const TodoList = () => {
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
            {day.todos.length &&
                day.todos.map((todo) => <TodoItem todo={todo} />)}
            {!day.todos.length && "У вас нет задач."}
            <div style={{ paddingTop: 4 }}>
                <AddTodoForm />
            </div>
        </>
    );
};

export default TodoList;
