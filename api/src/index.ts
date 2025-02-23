import app from "@/app.ts";
import env from "@/lib/env.ts";
import { connectToDB } from "@/config/db.ts";

const PORT = env.PORT || 7000;

const startServer = async () => {
    await connectToDB();

    const server = app.listen(PORT, () => {
        console.log(`The server is running at: http://localhost:${PORT}`);
    });
    
    process.on("SIGINT", () => server.close(err => process.exit(err ? 1 : 0)));
    process.on("SIGTERM", () => server.close(err => process.exit(err ? 1 : 0)));
};

startServer();