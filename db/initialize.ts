import { env } from "cloudflare:workers";

let initialized = false;

export async function ensureAuthSchema() {
  if (initialized) return;
  const db = env.DB;
  if (!db) throw new Error("D1 binding DB is unavailable");
  await db.prepare(`CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, auth_user_id TEXT NOT NULL, email TEXT NOT NULL, username TEXT NOT NULL, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, student_code TEXT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, grade_level INTEGER NOT NULL, classroom TEXT NOT NULL, created_at INTEGER NOT NULL)`).run();
  const columns = await db.prepare("PRAGMA table_info(students)").all<{ name:string }>();
  const names = new Set(columns.results.map(column => column.name));
  if (!names.has("username")) await db.prepare("ALTER TABLE students ADD COLUMN username TEXT").run();
  if (!names.has("password_hash")) await db.prepare("ALTER TABLE students ADD COLUMN password_hash TEXT").run();
  if (!names.has("password_salt")) await db.prepare("ALTER TABLE students ADD COLUMN password_salt TEXT").run();
  if (!names.has("avatar_key")) await db.prepare("ALTER TABLE students ADD COLUMN avatar_key TEXT").run();
  await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_students_username ON students(username)").run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE, token_hash TEXT NOT NULL, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL)`).run();
  await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON sessions(student_id)").run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS teachers (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, first_name TEXT NOT NULL, last_name TEXT NOT NULL, username TEXT NOT NULL, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, avatar_key TEXT, created_at INTEGER NOT NULL)`).run();
  await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_teachers_username ON teachers(username)").run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS teacher_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE, token_hash TEXT NOT NULL, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL)`).run();
  await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_teacher_sessions_token_hash ON teacher_sessions(token_hash)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_teacher_sessions_teacher_id ON teacher_sessions(teacher_id)").run();
  initialized = true;
}
