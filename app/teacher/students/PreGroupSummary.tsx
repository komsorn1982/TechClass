type Student={id:number;number:string;firstName:string;lastName:string;grade:number;classroom:string};
type PreGroup={studentId:number;courseCode:string;unit:number;hour:number;correct:number|null;group:string|null};
export function PreGroupSummary({students,groups}:{students:Student[];groups:PreGroup[]}){
 const latest=[...groups].filter(x=>x.group).sort((a,b)=>b.hour-a.hour).filter((x,i,list)=>list.findIndex(y=>y.studentId===x.studentId&&y.courseCode===x.courseCode&&y.unit===x.unit)===i);
 if(!latest.length)return null;
 return <section className="pre-group-summary wrap"><header><div><small>ผลประเมินความรู้เดิม · ไม่คิดคะแนน</small><h2>กลุ่มผู้เรียนรายบุคคล</h2></div><p>อ่อน 0–4 ข้อ · กลาง 5–7 ข้อ · เก่ง 8–10 ข้อ</p></header><div>{latest.map(result=>{const student=students.find(x=>x.id===result.studentId);if(!student)return null;return <article key={`${result.studentId}-${result.courseCode}-${result.unit}`}><b>{student.number}</b><span><strong>{student.firstName} {student.lastName}</strong><small>ม.{student.grade}/{student.classroom} · {result.courseCode} · หน่วย {result.unit}</small></span><em className={`ability-${result.group}`}>{result.correct}/10 · กลุ่ม{result.group}</em></article>})}</div></section>
}
