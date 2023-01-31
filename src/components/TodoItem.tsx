import { FC } from "react";
import { Checkbox, CloseButton } from "@mantine/core";
import { Todo } from "@prisma/client";
import { trpc } from "@/utils/trpc";

const TodoItem: FC<{
    todo: Todo;
}> = ({ todo }) => {
    const ctx = trpc.useContext();
    const { refetch } = trpc.todo.getAllByDay.useQuery({ dayId: todo.dayId });
    const { mutate: patchTodo } = trpc.todo.patch.useMutation({
        onMutate({ id }) {
            ctx.todo.getAllByDay.cancel();
            ctx.todo.getAllByDay.setData({ dayId: todo.dayId }, (old) => {
                if (old) {
                    return old.map((x) => {
                        if (id !== x.id) return x;
                        return {
                            ...x,
                            completed: !x.completed,
                        };
                    });
                }

                return old;
            });
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
