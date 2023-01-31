import { FC, useState } from "react";
import { Button, Input, LoadingOverlay } from "@mantine/core";
import { trpc } from "@/utils/trpc";

const AddTodoForm: FC = () => {
    const [title, setTitle] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);
    const { mutate: addTodo } = trpc.todo.create.useMutation({
        onSettled() {
            refetch();
        },
    });
    const { data: day, refetch } = trpc.day.getLast.useQuery();
    if (!day) return null;
    return (
        <>
            <form
                style={{ display: "flex", position: "relative" }}
                onSubmit={(e) => {
                    e.preventDefault();
                    if (title.length) {
                        addTodo({
                            title,
                            dayId: day.id,
                        });
                        setTitle("");
                    } else {
                        setIsInvalid(true);
                    }
                }}
            >
                <LoadingOverlay visible={false} overlayBlur={2} />
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
