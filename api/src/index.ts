import app from "@/app.ts";
import env from "@/lib/env.ts";

const PORT = env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`The server is running at: http://localhost:${PORT}`);
});