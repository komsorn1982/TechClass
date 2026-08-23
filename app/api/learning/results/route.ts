import {and,eq,sql} from "drizzle-orm";
import {NextResponse} from "next/server";
import {getDb} from "../../../../db";
import {ensureAuthSchema} from "../../../../db/initialize";
import {lessonResults,studentScores} from "../../../../db/schema";
import {getCurrentStudent} from "../../../lib/session";

type ResultBody={kind?:"pre"|"post"|"task";courseCode?:string;unit?:number;hour?:number;correct?:number;total?:number;score?:number;maxScore?:number};

export async function GET(request:Request){
 const student=await getCurrentStudent();
 if(!student)return NextResponse.json({student:null,results:[]});
 await ensureAuthSchema();
 const courseCode=new URL(request.url).searchParams.get("courseCode")??"";
 if(!courseCode)return NextResponse.json({error:"กรุณาระบุรหัสวิชา"},{status:400});
 const results=await getDb().select().from(lessonResults).where(and(eq(lessonResults.studentId,student.id),eq(lessonResults.courseCode,courseCode)));
 return NextResponse.json({student:{id:student.id,firstName:student.firstName,lastName:student.lastName,avatarKey:student.avatarKey},results});
}

export async function POST(request:Request){
 const student=await getCurrentStudent();
 if(!student)return NextResponse.json({error:"กรุณาเข้าสู่ระบบเพื่อบันทึกผลการเรียน"},{status:401});
 await ensureAuthSchema();
 const body=await request.json() as ResultBody,kind=body.kind,courseCode=String(body.courseCode??""),unit=Number(body.unit),hour=Number(body.hour),total=Number(body.total??10),now=new Date();
 if(!kind||!courseCode||!Number.isInteger(unit)||unit<1||!Number.isInteger(hour)||hour<1)return NextResponse.json({error:"ข้อมูลผลการเรียนไม่ถูกต้อง"},{status:400});
 const db=getDb(),where=and(eq(lessonResults.studentId,student.id),eq(lessonResults.courseCode,courseCode),eq(lessonResults.lessonHour,hour));
 const[existing]=await db.select().from(lessonResults).where(where).limit(1);
 const base={studentId:student.id,courseCode,unitNumber:unit,lessonHour:hour,updatedAt:now};
 let values:Partial<typeof lessonResults.$inferInsert>={...base};
 if(kind==="pre"){
  const correct=Math.max(0,Math.min(total,Number(body.correct??0))),abilityGroup=correct<=4?"อ่อน":correct<=7?"กลาง":"เก่ง";
  values={...values,preCorrect:correct,preTotal:total,abilityGroup};
 }else if(kind==="post"){
  values={...values,postScore:Math.max(0,Number(body.score??0)),postMaxScore:Math.max(0,Number(body.maxScore??0))};
 }else values={...values,taskScore:Math.max(0,Number(body.score??0)),taskMaxScore:Math.max(0,Number(body.maxScore??0))};
 if(existing)await db.update(lessonResults).set(values).where(eq(lessonResults.id,existing.id));
 else await db.insert(lessonResults).values({...base,preTotal:10,postScore:0,postMaxScore:0,taskScore:0,taskMaxScore:0,...values});
 if(kind!=="pre"){
  const[sum]=await db.select({score:sql<number>`coalesce(sum(${lessonResults.postScore}+${lessonResults.taskScore}),0)`,maxScore:sql<number>`coalesce(sum(${lessonResults.postMaxScore}+${lessonResults.taskMaxScore}),0)`}).from(lessonResults).where(and(eq(lessonResults.studentId,student.id),eq(lessonResults.courseCode,courseCode),eq(lessonResults.unitNumber,unit)));
  await db.insert(studentScores).values({studentId:student.id,courseCode,unitNumber:unit,score:Number(sum.score),maxScore:Number(sum.maxScore),updatedAt:now}).onConflictDoUpdate({target:[studentScores.studentId,studentScores.courseCode,studentScores.unitNumber],set:{score:Number(sum.score),maxScore:Number(sum.maxScore),updatedAt:now}});
 }
 return NextResponse.json({ok:true,group:values.abilityGroup??null});
}
