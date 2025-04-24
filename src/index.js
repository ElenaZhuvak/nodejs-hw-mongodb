import { initMongoConnection } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";

export async function bootstrap() {
    await initMongoConnection();
    setupServer();
};
bootstrap();