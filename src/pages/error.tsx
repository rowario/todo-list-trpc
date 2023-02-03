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
                        <Notification color="red" title="Ошибка авторизации" disallowClose>
                            Этот аккаунт не может быть привязан дважды.
                        </Notification>
                    )}
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default ErrorPage;
