import { Container, Grid, Paper } from "@mantine/core";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { FC } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    return {
        props: {},
    };
};

const Settings: FC = () => {
    return (
        <Container>
            <Grid>
                <Grid.Col
                    offsetLg={2}
                    lg={8}
                    offsetMd={2}
                    md={8}
                    sm={12}
                    xs={12}
                >
                    <Paper withBorder p="sm">
                        Test
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default Settings;
