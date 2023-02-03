import { Button, DefaultMantineColor, MantineSize } from "@mantine/core";
import { createRef, FC, useEffect, useRef } from "react";

declare global {
    interface Window {
        Telegram: {
            // 👇️ not sure about getWidgetInfo's callback arguments
            getWidgetInfo: (
                el_or_id: HTMLElement | string,
                callback: Function
            ) => void;
            setWidgetOptions: (
                options: TelegramOptions,
                el_or_id: HTMLElement | string
            ) => void;
            Login: {
                // 👇️ init checks for base64 'tgAuthResult' in URL, though redirect after login has 'hash' instead, so ????
                init: (
                    options: TelegramOptions,
                    auth_callback: (auth_result: TelegramResponseType) => void
                ) => void;
                open: (
                    callback: (authData: TelegramResponseType) => void
                ) => void;
                auth: (
                    options: TelegramOptions,
                    callback: (authData: TelegramResponseType) => void
                ) => void;
                widgetsOrigin:
                    | "https://oauth.telegram.org"
                    | "https://oauth.tg.dev";
            };
        };
    }
}

interface TelegramResponseType {
    auth_date: number;
    first_name: string;
    hash: string;
    id: number;
    last_name?: string;
    photo_url?: string;
    username?: string;
}

interface TelegramOptions {
    bot_id: string;
    request_access?: boolean;
    lang?: string;
}

export const TelegramAuthButton: FC<{
    onAuthCallback: (data: TelegramResponseType) => void;
    botId: string;
    children: string;
    color?: DefaultMantineColor;
    compact?: boolean;
    size?: MantineSize;
}> = ({ onAuthCallback, botId, children, ...buttonProps }) => {
    const buttonRef = createRef<HTMLDivElement>();
    const didMount = useRef(false);

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
        if (!didMount.current) {
            const script = document.createElement("script");
            didMount.current = true;
            script.setAttribute(
                "src",
                "https://telegram.org/js/telegram-widget.js?21"
            );
            buttonRef.current?.appendChild(script);
            return () => {
                buttonRef.current?.removeChild(script);
            };
        }
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
