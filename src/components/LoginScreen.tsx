import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";

export default function LoginScreen() {
    return (
        <div style={{ textAlign: "center", width: "100%" }}>
            <span>Вы не вошли в свой аккаунт.</span>
            <br />
            <Button fullWidth onClick={() => signIn("discord")}>
                Войти через Discord.
            </Button>
        </div>
    );
}
