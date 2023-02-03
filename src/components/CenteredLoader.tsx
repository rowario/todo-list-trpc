import { Loader } from "@mantine/core";

export default function CenteredLoader() {
    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Loader />
        </div>
    );
}
