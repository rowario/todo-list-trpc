import { Loader } from "@mantine/core";

export default function CenteredLoader() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Loader />
        </div>
    );
}
