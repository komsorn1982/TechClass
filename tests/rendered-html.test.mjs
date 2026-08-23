import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const root=new URL("../",import.meta.url);
const read=(path)=>readFile(new URL(path,root),"utf8");

test("uses the native Next.js runtime",async()=>{const pkg=JSON.parse(await read("package.json"));assert.equal(pkg.scripts.dev,"next dev");assert.equal(pkg.scripts.build,"next build");assert.ok(pkg.dependencies.next);assert.equal(pkg.devDependencies.vinext,undefined);assert.equal(pkg.devDependencies.wrangler,undefined);});

test("uses PostgreSQL and Vercel Blob without Cloudflare bindings",async()=>{const [schema,db,uploads,config,migration]=await Promise.all([read("db/schema.ts"),read("db/index.ts"),read("db/uploads.ts"),read("drizzle.config.ts"),read("drizzle/0000_free_shinobi_shaw.sql")]);assert.match(schema,/drizzle-orm\/pg-core/);assert.match(db,/@neondatabase\/serverless/);assert.match(uploads,/@vercel\/blob/);assert.match(config,/dialect:\s*"postgresql"/);assert.match(migration,/CREATE TABLE "students"/);for(const source of [schema,db,uploads,config])assert.doesNotMatch(source,/cloudflare:workers|drizzle-orm\/d1|sqlite-core/);});
