import { drizzle } from "drizzle-orm/noen-http";
import { neon } from "@neondatabase/serverless";
import { ENV } from "./env";
import * as schema from "../db/schema";

const sql = neon(ENV.DATEBASE_URL);
export const db = drizzle(sql, { schema });
