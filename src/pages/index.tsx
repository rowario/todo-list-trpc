import { trpc } from "@/utils/trpc";
import { signIn, useSession } from "next-auth/react";

export default function Index() {
    const { data: message } = trpc.day.check.useQuery({
        name: "тестовый пользователь",
    });
    const { data: session } = useSession();

    if (!message) return <>Загрузка...</>;

    return (
        <div>
            {message}

            {!session && (
                <div>
                    <button onClick={() => signIn("discord")}>
                        Войти при помощи Discord
                    </button>
                </div>
            )}
            {session && (
                <div>
                    Привет {session.user.name}
                    <img
                        src={session.user.image || ""}
                        width="100"
                        height="100"
                        alt=""
                    />
                </div>
            )}
        </div>
    );
}
