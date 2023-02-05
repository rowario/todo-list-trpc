import { trpc } from "@/utils/trpc";
import { Day } from "@prisma/client";
import { FC } from "react";
import CenteredLoader from "./CenteredLoader";
import TodoItem from "./TodoItem";

const TodoList: FC<{
    day: Day;
	disabled?: boolean;
}> = ({ day, disabled = false}) => {
    const { data: todos, isLoading } = trpc.todo.allByDay.useQuery({
        dayId: day.id,
    });

    if (isLoading) {
        return <CenteredLoader />;
    }

    return (
        <>
            {todos &&
                todos.map((todo) => <TodoItem key={todo.id} todo={todo} disabled={disabled} />)}
            {(!todos || !todos.length) && "У вас нет задач."}
        </>
    );
};

export default TodoList;
