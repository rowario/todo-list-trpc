import { FC } from "react";
import CenteredLoader from "@/components/CenteredLoader";
import LoginScreen from "@/components/LoginScreen";
import DayScreen from "@/components/DayScreen";
import { Container, Grid } from "@mantine/core";
import { useSession } from "next-auth/react";

const Index: FC = () => {
    let { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <Container>
                <CenteredLoader />
            </Container>
        );
    }

    return (
        <Container>
            <Grid>
                {session && <DayScreen />}
                {!session && <LoginScreen />}
            </Grid>
        </Container>
    );
};

export default Index;
