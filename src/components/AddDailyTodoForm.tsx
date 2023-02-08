import { FC, useState } from "react";
import { Button, Input, LoadingOverlay } from "@mantine/core";
import { trpc } from "@/utils/trpc";

const AddDailyTodoForm: FC = () => {
    const [title, setTitle] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);
    const utils = trpc.useContext();
    const { mutate: addTodo, isLoading } = trpc.daily.create.useMutation({
        async onSettled(todo) {
            await utils.daily.all.cancel();
            if (!todo) return;
            const previous = utils.daily.all.getData();
            console.log(previous);
            if (!previous) {
                utils.daily.all.setData(undefined, [todo]);
                return;
            }
            utils.daily.all.setData(undefined, [...previous, todo]);
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

export default AddDailyTodoForm;
