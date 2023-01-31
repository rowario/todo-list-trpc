import { trpc } from "@/utils/trpc";
import { Day } from "@prisma/client";
import { FC } from "react";
import CenteredLoader from "./CenteredLoader";
import TodoItem from "./TodoItem";

const TodoList: FC<{
    day: Day;
}> = ({ day }) => {
    const { data: todos, isLoading: isTodosLoading } =
        trpc.todo.getAllByDay.useQuery({ dayId: day.id });

    if (isTodosLoading) {
        return <CenteredLoader />;
    }

    return (
        <>
            {todos &&
                todos.length &&
                todos.map((todo) => <TodoItem todo={todo} />)}
            {(!todos || !todos.length) && "У вас нет задач."}
        </>
    );
};

export default TodoList;
