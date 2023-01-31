import { signIn, useSession } from "next-auth/react";

export default function Index() {
    const { data: session } = useSession();

    return (
        <div>
            {!session && (
                <div>
                    <button onClick={() => signIn("discord")}>
                        Войти при помощи Discord
                    </button>
                </div>
            )}
            {session && <div>Привет {session.user.name}</div>}
        </div>
    );
}
