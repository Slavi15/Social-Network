import { httpServer } from "@/app";
import env from "@/lib/env";
import { connectToDB } from "@/config/db";

const PORT = env.PORT || 7000;

const startServer = async () => {
    await connectToDB();

    httpServer.listen(PORT, () => {
        console.log(`Server running on: http://localhost:${PORT}`);
    });

    process.on("SIGINT", () => httpServer.close(err => process.exit(err ? 1 : 0)));
    process.on("SIGTERM", () => httpServer.close(err => process.exit(err ? 1 : 0)));
};

startServer();