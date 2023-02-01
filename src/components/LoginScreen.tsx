import { trpc } from "@/utils/trpc";
import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { TelegramAuthButton } from "./TelegramAuthButton";

export default function LoginScreen() {
    const router = useRouter();

    const { mutate } = trpc.telegram.auth.useMutation({
        onSettled(result) {
            if (result) router.reload();
        },
    });
    return (
        <div style={{ textAlign: "center", width: "100%" }}>
            <span>Вы не вошли в свой аккаунт.</span>
            <br />
            <Button onClick={() => signIn("discord")}>
                Войти через Discord.
            </Button>
            <TelegramAuthButton
                botId={process.env.NEXT_PUBLIC_BOT_ID}
                onAuthCallback={(data) => {
                    console.log("test");
                    mutate(data);
                }}
            />
        </div>
    );
}
