import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "../../db";
import { ensureAuthSchema } from "../../db/initialize";
import { sessions, students } from "../../db/schema";
import { hashSessionToken } from "./password";

export async function getCurrentStudent() {
  const token=(await cookies()).get("techclass_session")?.value;
  if(!token)return null;
  await ensureAuthSchema();
  const [record]=await getDb().select({id:students.id,firstName:students.firstName,lastName:students.lastName,username:students.username,avatarKey:students.avatarKey}).from(sessions).innerJoin(students,eq(sessions.studentId,students.id)).where(and(eq(sessions.tokenHash,await hashSessionToken(token)),gt(sessions.expiresAt,new Date()))).limit(1);
  return record??null;
}
