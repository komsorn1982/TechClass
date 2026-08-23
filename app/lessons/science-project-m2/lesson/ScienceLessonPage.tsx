"use client";
import {useEffect,useState} from "react";
import {scienceHours,scienceMissions} from "../science-data";

const missionStarts=[1,3,5,8,11,14,17,19];

export function ScienceLessonPage(){
 const[hour,setHour]=useState(1),[access,setAccess]=useState<"checking"|"allowed"|"locked">("checking"),[choice,setChoice]=useState<number|null>(null),[warmupDone,setWarmupDone]=useState(false);
 useEffect(()=>{const value=Number(new URLSearchParams(window.location.search).get("hour")),safe=Number.isFinite(value)?Math.min(20,Math.max(1,value)):1;setHour(safe);setAccess(localStorage.getItem(`scilab-m2-pretest-hour-${safe}`)==="completed"?"allowed":"locked")},[]);
 const missionIndex=Math.max(0,scienceMissions.findIndex((_,i)=>hour>=missionStarts[i]&&hour<missionStarts[i]+scienceMissions[i].hourCount)),mission=scienceMissions[missionIndex];
 if(access==="checking")return <main className="sci-lesson-gate"><div><span>กำลังตรวจสอบเส้นทางการเรียน...</span></div></main>;
 if(access==="locked")return <main className="sci-lesson-gate"><div><i>🔒</i><small>ต้องทำขั้นก่อนหน้าให้เสร็จ</small><h1>บทเรียนนี้ยังไม่ปลดล็อก</h1><p>นักเรียนต้องทำแบบทดสอบก่อนเรียนให้ครบ 10 ข้อก่อน จึงจะเข้าสู่บทเรียนและกิจกรรมได้</p><a href={`/lessons/science-project-m2/pretest?hour=${hour}`}>ทำแบบทดสอบก่อนเรียน →</a><a className="subtle" href={`/lessons/science-project-m2?hour=${hour}`}>กลับสู่เส้นทางการเรียน</a></div></main>;
 const options=[
  {icon:"💭",text:"เดาคำตอบทันที",hint:"การเดายังไม่มีข้อมูลยืนยันว่าแสงหรือน้ำเป็นสาเหตุ"},
  {icon:"👥",text:"ถามเพื่อนส่วนใหญ่",hint:"ความคิดเห็นของคนส่วนใหญ่ยังไม่ใช่หลักฐานทางวิทยาศาสตร์"},
  {icon:"🔬",text:"วางแผนทดลองและเก็บข้อมูล",hint:"ถูกต้อง! เราต้องเปรียบเทียบอย่างเป็นธรรมและใช้ข้อมูลจริง"},
  {icon:"❤️",text:"เลือกคำตอบที่ตนเองชอบ",hint:"ความชอบส่วนตัวไม่ช่วยพิสูจน์ว่าสาเหตุใดถูกต้อง"}
 ];
 function selectOption(index:number){setChoice(index);if(index===2)setWarmupDone(true)}
 return <main className="sci-lesson-page">
  <header><a href={`/lessons/science-project-m2?hour=${hour}`}>← กลับสู่เส้นทางการเรียน</a><small>ชั่วโมงที่ {hour} · Mission {String(missionIndex+1).padStart(2,"0")}</small><h1>{scienceHours[hour-1]}</h1><p>{mission.title}</p></header>
  <article className="sci-hour-stage">
   <section className="sci-warmup-scene">
    <header><span>เริ่มจากเรื่องใกล้ตัว</span><small>OBSERVE • WONDER • FIND EVIDENCE</small><h2>ต้นถั่วโตไม่เท่ากัน เพราะอะไรกันนะ?</h2><p>สังเกตสถานการณ์ แล้วช่วยนักเรียนสองคนเลือกวิธีค้นหาคำตอบ</p></header>
    <div className="sci-bean-scene"><article><div className="sci-pot sunny"><b>☀️</b><i>🌱</i></div><span>กระถาง A</span><small>อยู่ใกล้หน้าต่าง</small></article><div className="sci-scene-dialog"><p>“ฉันคิดว่าเกิดจาก<br/><b>ปริมาณแสง</b>”</p><em>แต่...</em><p>“ฉันคิดว่าเกิดจาก<br/><b>ปริมาณน้ำ</b>”</p></div><article><div className="sci-pot watery"><b>💧</b><i>🌿</i></div><span>กระถาง B</span><small>ได้รับน้ำมากกว่า</small></article></div>
    <div className="sci-warmup-question"><small>ภารกิจของเรา</small><h3>เราจะรู้ได้อย่างไรว่าใครอธิบายถูกต้อง?</h3><p>แตะเลือกสิ่งที่ควรทำต่อ</p></div>
    <div className="sci-warmup-options">{options.map((option,index)=><button className={choice===index?(index===2?"chosen correct":"chosen retry"):""} onClick={()=>selectOption(index)} key={option.text}><i>{option.icon}</i><span>{option.text}</span>{choice===index&&<b>{index===2?"✓":"ลองคิดใหม่"}</b>}</button>)}</div>
    {choice!==null&&<div className={choice===2?"sci-warmup-feedback success":"sci-warmup-feedback retry"} role="status"><i>{choice===2?"✓":"↻"}</i><div><b>{choice===2?"เยี่ยมมาก! นี่คือจุดเริ่มต้นของโครงงานวิทยาศาสตร์":options[choice].text+" ยังไม่ช่วยพิสูจน์คำตอบ"}</b><p>{options[choice].hint}</p>{choice===2&&<p>ความสงสัย → วางแผนตรวจสอบ → เก็บข้อมูล → สรุปจากหลักฐาน</p>}</div></div>}
    {warmupDone&&<a className="sci-warmup-continue" href="#lesson-content">ค้นพบความหมายของโครงงานวิทยาศาสตร์ ↓</a>}
   </section>
   <div id="lesson-content" className={warmupDone?"sci-lesson-content unlocked":"sci-lesson-content"}>
    <section className="sci-flow-complete"><span>ภารกิจถัดไป</span><b>02</b><h2>อะไรคือโครงงานวิทยาศาสตร์?</h2><p>เปิดหน้าใหม่เพื่อแยกสถานการณ์ที่เป็นและยังไม่เป็นโครงงานวิทยาศาสตร์</p><a className="sci-hour-next sci-lesson-finish" href={`/lessons/science-project-m2/lesson/activity/1?hour=${hour}`}>เข้าสู่ภารกิจที่ 2 →</a></section>
   </div>
  </article>
 </main>
}
