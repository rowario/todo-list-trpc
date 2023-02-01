import { trpc } from "@/utils/trpc";
import { LoadingOverlay, Paper, Textarea, Text } from "@mantine/core";
import { Day } from "@prisma/client";
import { FC, useEffect, useState } from "react";

const NotesForm: FC<{
    day: Day;
}> = ({ day }) => {
    const [notes, setNotes] = useState(day.notes);
    const debounced = useDebounceValue("", notes, 1000);
    const { mutate: patchDay, isLoading: isPatchLoading } =
        trpc.day.patch.useMutation({
            onSettled() {},
        });

    useEffect(() => {
        if (day) {
            patchDay({
                id: day.id,
                notes: debounced,
            });
        }
    }, [debounced]);

    return (
        <Paper withBorder p="sm" sx={{ position: "relative" }}>
            <LoadingOverlay visible={isPatchLoading} overlayBlur={2} />
            <Text sx={{ paddingBottom: 4 }}>Пометки:</Text>
            <Textarea
                autosize
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Вы можете здесь свои пометки.."
                value={notes}
            ></Textarea>
        </Paper>
    );
};

function useDebounceValue<T>(init: T, input: T, delay: number) {
    const [value, setValue] = useState<T>(init);
    useEffect(() => {
        const timerId = setTimeout(() => {
            setValue(input);
        }, delay);
        return () => {
            clearTimeout(timerId);
        };
    }, [input]);

    return value;
}

export default NotesForm;
