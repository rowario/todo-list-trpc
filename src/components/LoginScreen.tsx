import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";

export default function LoginScreen() {
    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={() => signIn("discord")}>
                Войти через дискорд
            </Button>
        </div>
    );
}
