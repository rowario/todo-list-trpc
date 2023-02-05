import CenteredLoader from "@/components/CenteredLoader";
import TodoList from "@/components/TodoList";
import { trpc } from "@/utils/trpc";
import { Button, Container, Grid, Paper, Textarea } from "@mantine/core";
import { FC, useEffect, useState } from "react";

const Statistics: FC = () => {
    const [date, setDate] = useState("");
    const {
        data: days,
        isLoading,
        refetch: refetechAll,
    } = trpc.day.all.useQuery(undefined, {
        onSettled(days) {
            if (days) {
                setDate(days[days.length - 1].date);
            }
        },
    });
    const {
        data: currentDay,
        isLoading: isCurrentLoading,
        refetch,
    } = trpc.day.byDate.useQuery(
        { date },
        {
            enabled: date.length > 0,
        }
    );

    useEffect(() => {
        refetechAll();
        refetch();
    }, []);
    if (isLoading || isCurrentLoading) return <CenteredLoader />;
    if (!days || !currentDay)
        return (
            <div style={{ textAlign: "center" }}>
                У вас еще нет ни одного дня.
            </div>
        );
    return (
        <Container>
            <Grid>
                <Grid.Col xs={12} sx={{ display: "flex", gap: 8 }}>
                    {days.slice(-3).map((day) => (
                        <Button
                            onClick={() => setDate(day.date)}
                            disabled={day.date == currentDay.date}
                        >
                            {day.date}
                        </Button>
                    ))}
                </Grid.Col>
                <Grid.Col lg={6} md={6} sm={12} xs={12}>
                    <Paper withBorder p="sm">
                        Статистика ({currentDay.date}):
                        <br />
                        <TodoList day={currentDay} disabled={true} />
                    </Paper>
                </Grid.Col>
                <Grid.Col lg={6} md={6} sm={12} xs={12}>
                    <Paper withBorder p="sm">
                        Пометки:
                        <Textarea
                            sx={{ paddingTop: 4 }}
                            autosize
                            value={currentDay.notes}
                            disabled={true}
                        />
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default Statistics;
