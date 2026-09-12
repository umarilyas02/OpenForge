import { createDbClient, schema } from "@openforge/db";
import {
  createDrizzleSessionStore,
  createSessionManager,
} from "@openforge/auth";
import { config } from "dotenv";
config();
const { db } = createDbClient({ connectionString: process.env.DATABASE_URL });
const [user] = await db.select().from(schema.users).limit(1);
const sessionManager = createSessionManager({
  store: createDrizzleSessionStore({ db }),
});
const { token } = await sessionManager.issue({ userId: user.id });
console.log("TOKEN", token);
process.exit(0);
