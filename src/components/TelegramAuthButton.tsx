import { TelegramAuthRepsonse } from "@/server/routes/telegram";
import { Button, DefaultMantineColor, MantineSize } from "@mantine/core";
import { createRef, FC, useEffect } from "react";

declare global {
    interface Window {
        Telegram: {
            Login: {
                auth: (
                    options: {
                        bot_id: string;
                        request_access?: boolean;
                        lang?: string;
                    },
                    callback: (authData: TelegramAuthRepsonse) => void
                ) => void;
            };
        };
    }
}

export const TelegramAuthButton: FC<{
    onAuthCallback: (data: TelegramAuthRepsonse) => void;
    botId: string;
    children: string;
    color?: DefaultMantineColor;
    compact?: boolean;
    size?: MantineSize;
	leftIcon?: React.ReactNode
}> = ({ onAuthCallback, botId, children, ...buttonProps }) => {
    const buttonRef = createRef<HTMLDivElement>();

    const handleTelegramAuth = () => {
        try {
            window.Telegram.Login.auth({ bot_id: botId }, (data) => {
                if (!data) {
                    console.log("ERROR: something went wrong");
                }
                onAuthCallback(data);
            });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.setAttribute(
            "src",
            "https://telegram.org/js/telegram-widget.js?21"
        );
        buttonRef.current?.appendChild(script);
        return () => {
            buttonRef.current?.removeChild(script);
        };
    }, []);

    return (
        <div ref={buttonRef}>
            <Button
                {...buttonProps}
                onClick={() => {
                    handleTelegramAuth();
                }}
            >
                {children}
            </Button>
        </div>
    );
};
