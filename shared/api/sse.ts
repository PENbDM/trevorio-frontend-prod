export type DetectionNotification = {
    datasource_id: string;
    table_id: string;
    new_row_ids: Array<string | number>;
};

export function connectSSE(
    onDetection: (notification: DetectionNotification) => void
): EventSource {
    const sse = new EventSource(
        "http://127.0.0.1:8000/api/streaming/events/"
    );

    sse.addEventListener("open", () => {
        console.log("🟢 SSE connected to Django");
    });

    sse.addEventListener("message", (event: MessageEvent) => {
        try {
            const data: unknown = JSON.parse(event.data);

            if (
                typeof data !== "object" ||
                data === null ||
                !("datasource_id" in data) ||
                !("table_id" in data) ||
                !("new_row_ids" in data)
            ) {
                return;
            }

            const notification = data as DetectionNotification;

            if (!Array.isArray(notification.new_row_ids)) {
                return;
            }

            if (notification.new_row_ids.length === 0) {
                return;
            }

            console.log(
                "New rows detected:",
                notification
            );

            onDetection(notification);
        } catch (error) {
            console.error("Invalid SSE message:", error);
        }
    });

    sse.addEventListener("error", () => {
        console.error("SSE connection interrupted");
    });

    return sse;
}