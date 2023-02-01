import { trpc } from "@/utils/trpc";
import { LoadingOverlay, Paper, Textarea, Text } from "@mantine/core";
import { Day } from "@prisma/client";
import { FC, useEffect, useRef, useState } from "react";

const NotesForm: FC<{
    day: Day;
}> = ({ day }) => {
    const [notes, setNotes] = useState(day.notes);
    const debounced = useDebounceValue(notes, 1000);
    const utils = trpc.useContext();
    const { mutate: patchDay, isLoading: isPatchLoading } =
        trpc.day.patch.useMutation({
            onSettled() {
                utils.day.last.setData(undefined, {
                    ...day,
                    notes: debounced,
                });
            },
        });

    useEffect(() => {
        if (day.notes !== debounced) {
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

function useDebounceValue<T>(input: T, delay: number) {
    const [value, setValue] = useState<T>(input);
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
