import {neon} from "@neondatabase/serverless";
import {drizzle} from "drizzle-orm/neon-http";
import * as schema from "./schema";
let database:ReturnType<typeof createDb>|undefined;
function createDb(){const url=process.env.DATABASE_URL;if(!url)throw new Error("DATABASE_URL is not configured");return drizzle(neon(url),{schema});}
export function getDb(){return database??=createDb();}
