import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL must be set to generate or run migrations (see envs/examples/infrastructure.env.example).",
  );
}

export default defineConfig({
  schema: "./src/schema/index.js",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url: connectionString },
});
