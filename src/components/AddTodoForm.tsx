import { FC, useState } from "react";
import { Button, Input, LoadingOverlay } from "@mantine/core";
import { trpc } from "@/utils/trpc";

const AddTodoForm: FC<{
    dayId: string;
}> = ({ dayId }) => {
    const [title, setTitle] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);
    const utils = trpc.useContext();
    const { mutate: addTodo, isLoading } = trpc.todo.create.useMutation({
        async onSettled(todo) {
            await utils.todo.allByDay.cancel();
            if (!todo) return;
            const previous = utils.todo.allByDay.getData({ dayId });
            console.log(previous);
            if (!previous) {
                utils.todo.allByDay.setData({ dayId }, [todo]);
                return;
            }
            utils.todo.allByDay.setData({ dayId }, [...previous, todo]);
        },
    });
    return (
        <>
            <form
                style={{ display: "flex", position: "relative" }}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (title.length) {
                        addTodo({
                            title,
                            dayId,
                        });
                        setTitle("");
                    } else {
                        setIsInvalid(true);
                    }
                }}
            >
                <LoadingOverlay visible={isLoading} overlayBlur={2} />
                <Input
                    invalid={isInvalid}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setIsInvalid(false);
                    }}
                    sx={{ flexGrow: 1, paddingRight: 8 }}
                    placeholder="Название задачи"
                ></Input>
                <Button type="submit">Добавить</Button>
            </form>
        </>
    );
};

export default AddTodoForm;
