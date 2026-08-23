"use client";
import { useState } from "react";
const subjects=[
 {code:"ว21103",name:"การออกแบบและเทคโนโลยี",grade:"มัธยมศึกษาปีที่ 1",hours:20,credits:.5,href:"/lessons/design-technology-m1"},
 {code:"ว20290",name:"เริ่มต้นโครงงานวิทยาศาสตร์",grade:"มัธยมศึกษาปีที่ 2/1",hours:20,credits:.5,href:"/lessons/science-project-m2"},
 {code:"ว31102",name:"การออกแบบและเทคโนโลยี",grade:"มัธยมศึกษาปีที่ 4",hours:20,credits:.5},
 {code:"ว32103",name:"การออกแบบและเทคโนโลยี",grade:"มัธยมศึกษาปีที่ 5",hours:20,credits:.5},
 {code:"ว20283",name:"ไมโครซอฟท์ออฟฟิศ 1",grade:"มัธยมศึกษาปีที่ 2",hours:20,credits:.5},
 {code:"ว20285",name:"ไมโครซอฟท์ออฟฟิศ 3",grade:"มัธยมศึกษาปีที่ 3",hours:20,credits:.5},
 {code:"ว30285",name:"การผลิตสื่อวิดีโอ",grade:"มัธยมศึกษาปีที่ 5/2",hours:40,credits:1},
 {code:"ว33289",name:"ดิจิทัลสร้างอาชีพ",grade:"มัธยมศึกษาปีที่ 6/2",hours:40,credits:1},
 {code:"ส32201",name:"การป้องกันการทุจริต 1",grade:"มัธยมศึกษาปีที่ 5/1",hours:20,credits:.5}
];
export function LessonCatalog(){const[semester,setSemester]=useState(1);return <><div className="semester-tabs" role="tablist" aria-label="เลือกภาคเรียน">{[1,2].map(n=><button role="tab" aria-selected={semester===n} className={semester===n?"selected":""} onClick={()=>setSemester(n)} key={n}><small>SEMESTER {n}</small><b>ภาคเรียนที่ {n}</b></button>)}</div>{semester===1?<><div className="catalog-summary"><div><small>รายวิชาทั้งหมด</small><b>{subjects.length} รายวิชา</b></div><span>ภาคเรียนที่ 1</span></div><div className="course-row-list"><div className="course-row-head"><span>ลำดับ</span><span>รายวิชา</span><span>รหัสวิชา</span><span>ชั้นเรียน</span><span>เวลา</span><span>หน่วยกิต</span><span/></div>{subjects.map((s,index)=><article className="course-row" key={s.code}><b className="course-row-number">{String(index+1).padStart(2,"0")}</b><div className="course-row-title"><strong>{s.name}</strong><small>กลุ่มสาระวิทยาศาสตร์และเทคโนโลยี</small></div><code>{s.code}</code><span data-label="ชั้นเรียน">{s.grade}</span><span data-label="เวลา">{s.hours} ชั่วโมง</span><span data-label="หน่วยกิต">{s.credits.toFixed(1)}</span>{s.href?<a className="course-open-link" href={s.href}>ดูบทเรียน <i>→</i></a>:<button disabled>เร็ว ๆ นี้</button>}</article>)}</div></>:<div className="semester-empty"><span>02</span><h2>บทเรียนภาคเรียนที่ 2</h2><p>ยังไม่มีรายวิชาในภาคเรียนนี้</p></div>}</>}
