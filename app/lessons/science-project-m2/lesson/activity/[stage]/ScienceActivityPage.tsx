"use client";
import {useEffect,useState} from "react";
import {scienceHours} from "../../../science-data";
import {ProjectDiscoveryFlow} from "../../ProjectDiscoveryFlow";

export function ScienceActivityPage({stage}:{stage:number}){
 const[hour,setHour]=useState(1),[access,setAccess]=useState<"checking"|"allowed"|"locked">("checking");
 useEffect(()=>{const value=Number(new URLSearchParams(window.location.search).get("hour")),safe=Number.isFinite(value)?Math.min(20,Math.max(1,value)):1;setHour(safe);setAccess(localStorage.getItem(`scilab-m2-pretest-hour-${safe}`)==="completed"?"allowed":"locked")},[]);
 if(access==="checking")return <main className="sci-lesson-gate"><div><span>กำลังตรวจสอบเส้นทางการเรียน...</span></div></main>;
 if(access==="locked")return <main className="sci-lesson-gate"><div><i>🔒</i><h1>กิจกรรมนี้ยังไม่ปลดล็อก</h1><p>ทำแบบทดสอบก่อนเรียนก่อนจึงจะเข้าสู่กิจกรรมได้</p><a href={`/lessons/science-project-m2/pretest?hour=${hour}`}>ทำแบบทดสอบก่อนเรียน →</a></div></main>;
 if(stage===0)return <main className="sci-detective-page"><a className="detective-back" href={`/lessons/science-project-m2/lesson?hour=${hour}`}>← กลับหน้าบทเรียน</a><ProjectDiscoveryFlow hour={hour} initialStage={stage} onFinish={()=>{}}/></main>;
 return <main className="sci-lesson-page"><header><a href={`/lessons/science-project-m2/lesson?hour=${hour}`}>← กลับหน้าบทเรียน</a><small>ชั่วโมงที่ {hour} · {scienceHours[hour-1]}</small><h1>เส้นทางค้นพบโครงงานวิทยาศาสตร์</h1></header><ProjectDiscoveryFlow hour={hour} initialStage={stage} onFinish={()=>{window.location.href=`/lessons/science-project-m2?hour=${hour}`}}/></main>
}
