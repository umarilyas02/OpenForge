import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema/index.js";

/**
 * Create a Drizzle client bound to a real PostgreSQL connection pool.
 *
 * @param {{ connectionString: string }} options
 */
export function createDbClient({ connectionString }) {
  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool, { schema });

  return {
    db,
    async close() {
      await pool.end();
    },
  };
}
