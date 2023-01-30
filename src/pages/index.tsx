import { trpc } from "@/utils/trpc";

export default function Index() {
    const { data: message } = trpc.day.check.useQuery({ name: "тестовый пользователь" });

    if (!message) return <>Загрузка...</>;

    return <>{message}</>;
}
