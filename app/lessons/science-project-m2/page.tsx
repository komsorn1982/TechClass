import {and,eq} from "drizzle-orm";
import {getDb} from "../../../db";
import {ensureAuthSchema} from "../../../db/initialize";
import {lessonResults} from "../../../db/schema";
import {getCurrentStudent} from "../../lib/session";
import {ScienceMissionPlatform} from "./ScienceMissionPlatform";

export default async function ScienceProjectM2Page(){
 const student=await getCurrentStudent();
 let completedHours:number[]=[];
 if(student){
  await ensureAuthSchema();
  const rows=await getDb().select({hour:lessonResults.lessonHour,postMax:lessonResults.postMaxScore,taskMax:lessonResults.taskMaxScore}).from(lessonResults).where(and(eq(lessonResults.studentId,student.id),eq(lessonResults.courseCode,"ว20290")));
  completedHours=rows.filter(row=>row.postMax>0||row.taskMax>0).map(row=>row.hour);
 }
 return <ScienceMissionPlatform student={student?{firstName:student.firstName,lastName:student.lastName,avatarKey:student.avatarKey}:null} initialCompletedHours={completedHours}/>;
}
