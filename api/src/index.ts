import { httpServer } from "@/app";
import env from "@/lib/env";
import { connectToDB } from "@/config/db";

const PORT = env.PORT || 7000;

const startServer = async () => {
    try {
        await connectToDB();

        httpServer.listen(PORT, () => {
            console.log(`Server running on: http://localhost:${PORT}`);
        });

        httpServer.on('error', (err) => {
            console.error('Server error:', err);
            process.exit(1);
        });

        process.on("SIGINT", () => httpServer.close(err => process.exit(err ? 1 : 0)));
        process.on("SIGTERM", () => httpServer.close(err => process.exit(err ? 1 : 0)));
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();