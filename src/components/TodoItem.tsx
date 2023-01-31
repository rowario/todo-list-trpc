import { FC } from "react";
import { Checkbox, CloseButton } from "@mantine/core";
import { Todo } from "@prisma/client";
import { trpc } from "@/utils/trpc";

const TodoItem: FC<{
    todo: Todo;
}> = ({ todo }) => {
    const { refetch } = trpc.day.getLast.useQuery();
    const { mutate: patchTodo } = trpc.todo.patch.useMutation({
        onSettled() {
            refetch();
        },
    });
    const { mutate: deleteTodo } = trpc.todo.delete.useMutation({
        onSettled() {
            refetch();
        },
    });
    return (
        <div
            style={{
                paddingTop: 4,
                paddingBottom: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Checkbox
                onChange={() => {
                    patchTodo({
                        ...todo,
                        completed: !todo.completed,
                    });
                }}
                label={todo.title}
                checked={todo.completed}
            />
            <CloseButton
                size="sm"
                onClick={() => {
                    deleteTodo({ id: todo.id });
                }}
                aria-label="Delete todo"
            />
        </div>
    );
};

export default TodoItem;
