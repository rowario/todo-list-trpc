import CenteredLoader from "@/components/CenteredLoader";
import { Container, Grid, Notification } from "@mantine/core";
import { useRouter } from "next/router";
import { FC } from "react";

const ErrorPage: FC = () => {
    const { isReady, query } = useRouter();

    if (!isReady) return <CenteredLoader />;

    return (
        <Container>
            <Grid>
                <Grid.Col offsetLg={3} lg={6}>
                    {query.error && (
                        <Notification
                            color="red"
                            title="Ошибка авторизации"
                            disallowClose
                        >
                            {getErrorMessage(query.error as string)}
                        </Notification>
                    )}
                </Grid.Col>
            </Grid>
        </Container>
    );
};

const errors = new Map<string, string>([
    ["Configuration", "Ошибка на сервере, попробуйте позднее."],
    ["AccessDenied", "Этот аккаунт не может быть привязан дважды."],
    ["Verification", "Ссылка для авторизации истекла."], // used only with email auth
    ["Default", "Неопознонная ошибка авторизации."],
]);

const getErrorMessage = (error: string) => {
    const message = errors.get(error);
    if (!message) return "Непознонная ошибка авторизации.";
    return message;
};

export default ErrorPage;
