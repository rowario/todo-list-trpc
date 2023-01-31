import { FC } from "react";
import { Checkbox, CloseButton } from "@mantine/core";
import { Todo } from "@prisma/client";
import { trpc } from "@/utils/trpc";

const TodoItem: FC<{
    todo: Todo;
}> = ({ todo }) => {
    const utils = trpc.useContext();
    const { mutate: patchTodo } = trpc.todo.patch.useMutation({
        async onMutate({ id }) {
            await utils.todo.allByDay.cancel();
            const previous = utils.todo.allByDay.getData({ dayId: todo.dayId });
            if (!previous) {
                return;
            }
            utils.todo.allByDay.setData(
                { dayId: todo.dayId },
                previous.map((x) =>
                    x.id === id ? { ...x, completed: !x.completed } : x
                )
            );
        },
    });
    const { mutate: deleteTodo } = trpc.todo.delete.useMutation({
        async onMutate({ id }) {
            await utils.todo.allByDay.cancel();
            const previous = utils.todo.allByDay.getData({ dayId: todo.dayId });
            if (!previous) {
                return;
            }
            utils.todo.allByDay.setData(
                { dayId: todo.dayId },
                previous.filter((x) => x.id !== id)
            );
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
