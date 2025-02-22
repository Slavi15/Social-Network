import app from "@/app.ts";
import env from "@/lib/env.ts";
import { connectToDB } from "@/config/db.ts";

const PORT = env.PORT || 7000;

const startServer = async () => {
    await connectToDB();

    app.listen(PORT, () => {
        console.log(`The server is running at: http://localhost:${PORT}`);
    });
};

startServer();