import { trpc } from "@/utils/trpc";
import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { TelegramAuthButton } from "./TelegramAuthButton";

export default function LoginScreen() {
    const router = useRouter();

    const { mutate } = trpc.telegram.auth.useMutation({
        onError(err) {
            switch (err.data?.code) {
                case "CONFLICT":
                    showNotification({
                        title: "Ошибка авторизации",
                        message:
                            "Этот аккаунт уже используется в другом профиле.",
                    });
                    break;
                default:
                    showNotification({
                        title: "Ошибка авторизации",
                        message: "Не удалось войти.",
                    });
                    break;
            }
        },
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
                onAuthCallback={mutate}
            >Войти через Telegram.</TelegramAuthButton>
        </div>
    );
}
